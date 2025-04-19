import { SavedApp } from './types';

// Initialize with a test app
export const appStore: SavedApp[] = [
  {
    id: "test-app-1",
    name: "Test Business Website",
    category: "informational",
    templateId: "business-info",
    prompt: "A business website with about page and services",
    pages: ["Home", "About", "Services", "Contact"],
    features: ["ContentManagement", "ContactForm"],
    models: {
      BusinessInfo: {
        name: "string",
        description: "string",
        contact: "object"
      }
    },
    content: {
      businessInfo: {
        name: "Sample Business",
        description: "A sample business description",
        mission: "",
        contact: {}
      },
      services: [],
      sections: []
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Helper functions for managing the store
export function findApp(id: string): SavedApp | undefined {
  return appStore.find(app => app.id === id);
}

export function updateApp(id: string, updatedApp: Partial<SavedApp>): SavedApp | null {
  const index = appStore.findIndex(app => app.id === id);
  if (index === -1) return null;

  appStore[index] = {
    ...appStore[index],
    ...updatedApp,
    updatedAt: new Date()
  };

  return appStore[index];
}

export function addApp(app: SavedApp): void {
  appStore.push(app);
}

export function deleteApp(id: string): boolean {
  const index = appStore.findIndex(app => app.id === id);
  if (index === -1) return false;
  
  appStore.splice(index, 1);
  return true;
} 