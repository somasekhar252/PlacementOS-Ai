
import { GoogleGenAI, Type } from "@google/genai";
import { db, auth, doc, getDoc, setDoc, updateDoc } from "./firebase.ts";

/**
 * Backend Strategy:
 * This class acts as a secure controller between the Frontend (api.ts) 
 * and our external services (Firebase for DB/Auth, Gemini for Intelligence).
 */
class FirebaseBackend {
  private staticJobs = [
    { id: '1', title: 'Junior Frontend Developer', company: 'Google Cloud', location: 'Bangalore', salary: '₹12–18 LPA', matchScore: 85, link: 'https://google.com/careers', source: 'Google' },
    { id: '2', title: 'SDE Intern', company: 'Microsoft', location: 'Hyderabad', salary: '₹80,000/mo', matchScore: 72, link: 'https://careers.microsoft.com', source: 'Microsoft' },
    { id: '3', title: 'AI Research Assistant', company: 'Meta', location: 'Remote', salary: '₹24 LPA', matchScore: 91, link: 'https://meta.com/careers', source: 'Meta' }
  ];

  async handleRequest(endpoint: string, method: string, body?: any) {
    const user = auth.currentUser;
    // Allow job fetching without auth, but protect everything else
    if (!user && endpoint !== '/jobs') throw new Error("Unauthorized: Please sign in to Career OS.");

    try {
      if (method === 'GET') {
        if (endpoint === '/jobs') return this.staticJobs;
        
        if (user) {
          if (endpoint === '/profile') {
            const userRef = doc(db, 'users', user.uid);
            const snap = await getDoc(userRef);
            return snap.exists() ? snap.data() : null;
          }
          if (endpoint === '/dashboard-briefing') {
            const briefingRef = doc(db, 'briefings', user.uid);
            const snap = await getDoc(briefingRef);
            return snap.exists() ? snap.data() : null;
          }
        }
      }

      if (method === 'POST' && user) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        if (endpoint === '/synthesize-profile') return this.handleProfileSynthesis(ai, user.uid, body);
        if (endpoint === '/generate-briefing') return this.handleBriefingGeneration(ai, user.uid, body);
        if (endpoint === '/chat') return this.handleChat(ai, body);
        if (endpoint === '/analyze-resume') return this.handleResumeAnalysis(ai, body);
      }
      
      throw new Error(`Endpoint ${endpoint} not implemented.`);
    } catch (error: any) {
      console.error("[REAL FIREBASE BACKEND ERROR]", error);
      throw error;
    }
  }

  private async handleProfileSynthesis(ai: any, uid: string, body: any) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a high-end tech recruiter. Based on these raw details: ${JSON.stringify(body.userDetails)}, synthesize a professional identity for this student. Focus on making them placement-ready.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            summary: { type: Type.STRING },
            keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            preparationStage: { type: Type.STRING },
            suggestedFocusAreas: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["headline", "summary", "keySkills", "preparationStage"]
        }
      }
    });
    
    const aiResult = JSON.parse(response.text);
    const profileData = { 
      ...aiResult, 
      ...body.userDetails,
      name: body.userDetails.name,
      profileCompleted: true,
      updatedAt: new Date().toISOString()
    };

    // PERSIST TO REAL FIRESTORE
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, profileData);
    return profileData;
  }

  private async handleBriefingGeneration(ai: any, uid: string, body: any) {
    const context = body.profile;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a career strategy briefing (dashboard welcome) for this profile: ${JSON.stringify(context)}. Be motivating and data-driven.`,
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
    // PERSIST TO REAL FIRESTORE
    const briefingRef = doc(db, 'briefings', uid);
    await setDoc(briefingRef, briefing);
    return briefing;
  }

  private async handleChat(ai: any, body: any) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: body.message,
      config: { 
        systemInstruction: `You are the PlacementOS AI Assistant. Assist the student with placement strategy, coding help, and interview prep.`
      }
    });
    return { text: response.text };
  }

  private async handleResumeAnalysis(ai: any, body: any) {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a deep diagnostic audit on this resume text: "${body.resumeText}" against this job: "${body.jobDescription}". Output a comprehensive readiness report.`,
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

export const server = new FirebaseBackend();
