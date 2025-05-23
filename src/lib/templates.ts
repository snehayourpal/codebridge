import { AppTemplate } from './types';

export const TEMPLATES: AppTemplate[] = [
  {
    id: 'volunteer-mgmt',
    name: 'Volunteer Manager',
    category: 'management',
    description: 'Track volunteers, events, and participation',
    samplePrompt: 'A volunteer portal with signup, profiles, and event tracking',
    defaultStructure: {
      pages: ['VolunteerList', 'EventCalendar', 'Profile', 'Dashboard'],
      features: ['Registration', 'HourTracking', 'EventSignup', 'Reporting'],
      models: {
        Volunteer: {
          name: 'string',
          email: 'string',
          hours: 'number',
          skills: 'string[]'
        },
        Event: {
          title: 'string',
          date: 'date',
          location: 'string',
          requiredVolunteers: 'number'
        }
      }
    }
  },
  {
    id: 'customer-mgmt',
    name: 'Customer Manager',
    category: 'management',
    description: 'Manage customer information and interactions',
    samplePrompt: 'A customer relationship manager with profiles and interaction history',
    defaultStructure: {
      pages: ['CustomerList', 'CustomerProfile', 'Interactions', 'Dashboard'],
      features: ['CustomerTracking', 'InteractionHistory', 'Notes', 'Reporting'],
      models: {
        Customer: {
          name: 'string',
          email: 'string',
          phone: 'string',
          lastContact: 'date'
        }
      }
    }
  },
  {
    id: 'business-info',
    name: 'Business Website',
    category: 'informational',
    description: 'Create a professional business website with content management',
    samplePrompt: 'A business website with about page, services, and contact information.',
    defaultStructure: {
      pages: ['Home', 'About', 'Services', 'Contact'],
      features: ['ContentManagement', 'ContactForm'],
      models: {
        BusinessInfo: {
          name: 'string',
          description: 'string',
          mission: 'string',
          contact: 'object'
        },
        Service: {
          title: 'string',
          description: 'string',
          price: 'string',
          features: 'string[]'
        },
        Content: {
          section: 'string',
          title: 'string',
          body: 'string',
          order: 'number'
        }
      }
    }
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    category: 'task-based',
    description: 'Organize and track tasks and projects',
    samplePrompt: 'A todo list with categories and due dates',
    defaultStructure: {
      pages: ['TaskList', 'Calendar', 'Categories'],
      features: ['TaskCreation', 'Categories', 'DueDates', 'Priority'],
      models: {
        Task: {
          title: 'string',
          description: 'string',
          dueDate: 'date',
          status: 'string',
          priority: 'string'
        }
      }
    }
  },
  {
    id: 'custom',
    name: 'Custom Application',
    category: 'custom',
    description: 'Create a completely custom application',
    samplePrompt: 'Describe your application requirements...',
    defaultStructure: {
      pages: [],
      features: [],
      models: {}
    }
  }
];