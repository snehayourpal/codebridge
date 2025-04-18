import { SavedApp } from './types';

// Temporary in-memory storage
export const appStore: SavedApp[] = [
  {
    id: "test-app-1",
    name: "Test Volunteer App",
    category: "management",
    templateId: "volunteer-mgmt",
    prompt: "A volunteer management system",
    pages: ["Dashboard", "VolunteerList", "EventCalendar"],
    features: ["Registration", "HourTracking", "EventSignup"],
    models: {
      Volunteer: {
        name: "string",
        email: "string",
        hours: "number"
      },
      Event: {
        title: "string",
        date: "date",
        location: "string"
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]; 