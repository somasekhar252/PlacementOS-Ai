
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Internship' | 'Contract';
  postedAt: string;
  description: string;
  requirements: string[];
  matchScore?: number;
}

export interface Application {
  id: string;
  jobId: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected';
  appliedDate: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface ResumeAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  rejectionRisks: string[];
  missingKeywords: string[];
  roadmapRecommendations: {
    skill: string;
    reason: string;
    impactOnMatch: string;
  }[];
}

export interface UserProfile {
  name: string;
  email: string;
  education: string;
  experience: string[];
  skills: string[];
  projects: string[];
  targetRole: string;
}
