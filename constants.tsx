
import { Job, Application } from './types';

export const JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer (Full Stack)',
    company: 'Google Cloud',
    location: 'Bangalore / Remote',
    salary: '₹28L - ₹45L',
    type: 'Full-time',
    postedAt: '2h ago',
    description: 'Lead the development of next-gen cloud native applications.',
    requirements: ['React', 'Go', 'Kubernetes', 'LLMs']
  },
  {
    id: '2',
    title: 'Product Management Intern',
    company: 'Microsoft',
    location: 'Hyderabad, India',
    salary: '₹80,000/mo',
    type: 'Internship',
    postedAt: '5h ago',
    description: 'Work on feature specifications for the next version of Windows AI.',
    requirements: ['Agile', 'Product Vision', 'Data Analysis']
  },
  {
    id: '3',
    title: 'Machine Learning Engineer',
    company: 'OpenAI',
    location: 'San Francisco (H1B Support)',
    salary: '$180k - $250k',
    type: 'Full-time',
    postedAt: 'Just now',
    description: 'Fine-tune large scale models for enterprise applications.',
    requirements: ['PyTorch', 'Transformers', 'CUDA']
  },
  {
    id: '4',
    title: 'UX Researcher',
    company: 'Airbnb',
    location: 'Remote',
    salary: '$130k - $160k',
    type: 'Full-time',
    postedAt: '1d ago',
    description: 'Understand the needs of global travelers through deep user research.',
    requirements: ['User Testing', 'Figma', 'Psychology']
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  { id: 'a1', jobId: '1', status: 'Interview', appliedDate: '2024-02-15' },
  { id: 'a2', jobId: '2', status: 'Applied', appliedDate: '2024-02-18' },
  { id: 'a3', jobId: '3', status: 'Screening', appliedDate: '2024-02-20' }
];
