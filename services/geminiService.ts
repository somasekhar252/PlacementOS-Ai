import { api } from './api';
import { auth, db, doc, setDoc, updateDoc, arrayUnion } from '../firebase';

/**
 * GEMINI SERVICE (Refactored for Firestore Persistence)
 * * 1. Calls the AI via your secure backend/virtual proxy.
 * 2. Intercepts the response.
 * 3. Saves it directly to the user's Firestore document.
 * 4. Returns data to the UI.
 */

export const chatWithAssistant = async (history: { role: 'user' | 'model', text: string }[], message: string) => {
  try {
    // 1. Get AI Response
    const data = await api.post('/chat', { message, history });
    const aiResponse = data.text;

    // 2. Persist Chat History to Firestore
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      
      // We use 'setDoc' with merge:true to ensure the document exists before writing
      await setDoc(userRef, {
        chatHistory: arrayUnion(
          { role: 'user', text: message, timestamp: new Date().toISOString() },
          { role: 'model', text: aiResponse, timestamp: new Date().toISOString() }
        ),
        lastActive: new Date().toISOString()
      }, { merge: true });
    }

    return aiResponse;
  } catch (error) {
    console.error("Chat proxy error:", error);
    throw error;
  }
};

export const matchResumeToJob = async (resumeText: string, jobDescription: string) => {
  try {
    // 1. Get AI Analysis
    const result = await api.post('/analyze-resume', { resumeText, jobDescription });

    // 2. Persist Analysis to Firestore (for Dashboard "Latest Briefing")
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      
      await setDoc(userRef, {
        latestAnalysis: {
          ...result,
          analyzedAt: new Date().toISOString(),
          jobContext: jobDescription.substring(0, 50) + "..."
        },
        // Also update the readiness score if the AI provided one
        readinessScore: result.matchScore || 0 
      }, { merge: true });
    }

    return result;
  } catch (error) {
    console.error("Analysis proxy error:", error);
    throw error;
  }
};

export const generateRecruiterResume = async (userDetails: any, templateType: string) => {
  try {
    // 1. Generate Resume Data
    const result = await api.post('/generate-resume', { userDetails, templateType });

    // 2. Save Generated Resume to Firestore
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      
      await setDoc(userRef, {
        generatedResume: {
          ...result,
          template: templateType,
          createdAt: new Date().toISOString()
        },
        profileCompleted: true // Implicitly complete profile if they generate a resume
      }, { merge: true });
    }

    return result;
  } catch (error) {
    console.error("Resume generation error:", error);
    throw error;
  }
};