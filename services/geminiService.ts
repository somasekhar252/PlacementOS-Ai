
import { api } from './api';

/**
 * REFACTORED: The frontend no longer initializes GoogleGenAI.
 * It now makes secure requests to our Node.js backend.
 */

export const chatWithAssistant = async (history: { role: 'user' | 'model', text: string }[], message: string) => {
  try {
    const data = await api.post('/chat', { message, history });
    return data.text;
  } catch (error) {
    console.error("Chat proxy error:", error);
    throw error;
  }
};

export const matchResumeToJob = async (resumeText: string, jobDescription: string) => {
  try {
    return await api.post('/analyze-resume', { resumeText, jobDescription });
  } catch (error) {
    console.error("Analysis proxy error:", error);
    throw error;
  }
};

// This function is now also backend-driven
export const generateRecruiterResume = async (userDetails: any, templateType: string) => {
  try {
    // In a real app, you'd create an endpoint for this too
    return await api.post('/generate-resume', { userDetails, templateType });
  } catch (error) {
    throw error;
  }
};
