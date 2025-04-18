export type AppCategory = 
  | 'management' 
  | 'informational' 
  | 'task-based' 
  | 'custom';

export interface AppStructure {
  pages: string[];
  features: string[];
  models: Record<string, Record<string, string>>;
}

export interface AppTemplate {
  id: string;
  name: string;
  category: AppCategory;
  description: string;
  samplePrompt: string;
  defaultStructure?: Partial<AppStructure>;
}

export interface BusinessContent {
  businessInfo: {
    name: string;
    description: string;
    mission?: string;
    contact?: {
      email?: string;
      phone?: string;
      address?: string;
      hours?: string[];
    };
  };
  services?: {
    title: string;
    description: string;
    price?: string;
    features?: string[];
  }[];
  sections?: {
    id: string;
    title: string;
    content: string;
    order: number;
  }[];
}

export interface SavedApp extends AppStructure {
  id: string;
  name: string;
  category: AppCategory;
  templateId: string;
  prompt: string;
  content?: BusinessContent;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParsedContent {
  businessInfo: {
    name: string;
    description: string;
    mission: string;
    contact: {
      email?: string;
      phone?: string;
      address?: string;
      hours?: string[];
    };
  };
  services: {
    title: string;
    description: string;
    price?: string;
    features?: string[];
  }[];
  content: {
    section: string;
    title: string;
    body: string;
    order: number;
  }[];
}

export interface BusinessSiteConfig {
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  layout: {
    showHero: boolean;
    showTestimonials: boolean;
    showServices: boolean;
  };
}