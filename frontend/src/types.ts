export interface TaskItem {
  id: string;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  progress: number;
  color: string;
  assignee: {
    name: string;
    avatar: string;
    role: string;
  };
  status: 'Open' | 'In Progress' | 'Under Review' | 'Completed';
  dependencies?: string[];
}

export interface IntegrationApp {
  id: string;
  name: string;
  category: 'taskforge' | 'productivity' | 'dev' | 'storage' | 'google';
  icon: string;
  description: string;
  badge?: string;
  color: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string | string[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  companyLogo?: string;
  metrics?: string;
}
