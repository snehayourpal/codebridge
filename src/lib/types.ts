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

export interface SavedApp extends AppStructure {
  id: string;
  name: string;
  category: AppCategory;
  templateId: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
}