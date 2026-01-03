
import { GoogleGenAI, Type } from "@google/genai";

const STORAGE_KEY = 'placement_os_persistence_v3';

class VirtualServer {
  private db: any;

  constructor() {
    this.initDB();
  }

  private initDB() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.db = JSON.parse(saved);
      } catch (e) {
        console.error("DB Parse Error, resetting...", e);
        this.resetDB();
      }
    } else {
      this.resetDB();
    }
  }

  private resetDB() {
    this.db = {
      userProfile: null,
      sessionBriefing: null,
      jobs: [
        { id: '1', title: 'Junior Frontend Developer', company: 'Google Cloud', location: 'Bangalore', salary: '₹12–18 LPA', matchScore: 85, link: 'https://google.com/careers', source: 'Google' },
        { id: '2', title: 'SDE Intern', company: 'Microsoft', location: 'Hyderabad', salary: '₹80,000/mo', matchScore: 72, link: 'https://careers.microsoft.com', source: 'Microsoft' },
        { id: '3', title: 'AI Research Assistant', company: 'Meta', location: 'Remote', salary: '₹24 LPA', matchScore: 91, link: 'https://meta.com/careers', source: 'Meta' }
      ]
    };
    this.saveDB();
  }

  private saveDB() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
  }

  async handleRequest(endpoint: string, method: string, body?: any) {
    try {
      if (method === 'GET') {
        if (endpoint === '/jobs') return this.db.jobs;
        if (endpoint === '/profile') return this.db.userProfile;
        if (endpoint === '/dashboard-briefing') return this.db.sessionBriefing;
      }

      if (method === 'POST') {
        if (endpoint === '/init-user') {
          this.db.userProfile = body.profile;
          this.saveDB();
          return { success: true };
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        if (endpoint === '/chat') return this.handleChat(ai, body);
        if (endpoint === '/analyze-resume') return this.handleResumeAnalysis(ai, body);
        if (endpoint === '/synthesize-profile') return this.handleProfileSynthesis(ai, body);
        if (endpoint === '/generate-briefing') return this.handleBriefingGeneration(ai, body);
      }
      
      throw new Error(`404 Not Found: ${endpoint}`);
    } catch (error) {
      console.error("[VIRTUAL SERVER ERROR]", error);
      throw error;
    }
  }

  private async handleProfileSynthesis(ai: GoogleGenAI, body: any) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Synthesize a professional identity for this student based on raw inputs: ${JSON.stringify(body.userDetails)}. Provide a detailed recruiter-ready profile.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            headline: { type: Type.STRING },
            summary: { type: Type.STRING },
            keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            careerGoal: { type: Type.STRING },
            preparationStage: { type: Type.STRING },
            suggestedFocusAreas: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["name", "headline", "summary", "keySkills", "preparationStage"]
        }
      }
    });
    
    const profile = JSON.parse(response.text);
    
    this.db.userProfile = { 
      ...profile, 
      ...body.userDetails,
      name: body.userDetails.name || profile.name,
      profileCompleted: true,
      onboarded: true,
      updatedAt: new Date().toISOString()
    };
    this.saveDB();
    return this.db.userProfile;
  }

  private async handleBriefingGeneration(ai: GoogleGenAI, body: any) {
    const context = body.profile || this.db.userProfile;
    if (!context) throw new Error("No context for briefing generation");

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a dynamic session-based Career Strategy Briefing for a student with this profile: ${JSON.stringify(context)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            welcomeMessage: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            focusAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            sessionSummary: { type: Type.STRING }
          }
        }
      }
    });
    
    const briefing = JSON.parse(response.text);
    this.db.sessionBriefing = briefing;
    this.saveDB();
    return briefing;
  }

  private async handleChat(ai: GoogleGenAI, body: any) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: body.message,
      config: { 
        systemInstruction: `You are an expert AI Career Coach at PlacementOS. Provide specific, data-driven, and encouraging advice for college placements.`
      }
    });
    return { text: response.text };
  }

  private async handleResumeAnalysis(ai: GoogleGenAI, body: any) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this resume text: "${body.resumeText}" against this target job: "${body.jobDescription || 'General Tech Role'}". Provide structured feedback.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text);
  }
}

export const server = new VirtualServer();
