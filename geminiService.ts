
import { api } from './services/api';

/**
 * COMPATIBILITY PROXY
 * Redirects legacy calls to the new secure Backend API system.
 */

export const chatWithAssistant = async (history: any[], message: string) => {
  return (await api.post('/chat', { message, history })).text;
};

export const matchResumeToJob = async (resumeText: string, jobDescription: string) => {
  return await api.post('/analyze-resume', { resumeText, jobDescription });
};

export const generateRecruiterResume = async (userDetails: any, template: string) => {
  return await api.post('/generate-resume', { userDetails, template });
};
