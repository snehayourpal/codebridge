'use client';
import { useState } from 'react';
import { SavedApp, BusinessContent } from '@/lib/types';
import DocumentUploader from './DocumentUploader';
import Navigation from './Navigation';
import { HomePage, AboutPage, ServicesPage, ContactPage } from './PageTemplates';

interface PreviewEditorProps {
  app: SavedApp;
  onUpdate: (updatedApp: SavedApp) => void;
}

export default function PreviewEditor({ app, onUpdate }: PreviewEditorProps) {
  const [activeSection, setActiveSection] = useState<'preview' | 'edit'>('preview');
  const [currentPage, setCurrentPage] = useState(app.pages[0] || 'Home');

  // Initialize content if it doesn't exist
  const initialContent: BusinessContent = app.content || {
    businessInfo: {
      name: '',
      description: '',
      mission: '',
      contact: {}
    },
    services: [],
    sections: []
  };

  const handleParsedContent = async (content: BusinessContent) => {
    try {
      const updatedApp: SavedApp = {
        ...app,
        content: {
          ...app.content,
          ...content
        },
        updatedAt: new Date()
      };

      const response = await fetch(`/api/apps/${app.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedApp)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update app');
      }

      onUpdate(updatedApp);
    } catch (error) {
      console.error('Failed to update app:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleBusinessInfoUpdate = (
    field: keyof BusinessContent['businessInfo'],
    value: string
  ) => {
    const updatedApp: SavedApp = {
      ...app,
      content: {
        ...initialContent,
        businessInfo: {
          ...initialContent.businessInfo,
          [field]: value
        }
      },
      updatedAt: new Date()
    };
    onUpdate(updatedApp);
  };

  const renderPage = () => {
    const pageContent = app.content;
    
    switch (currentPage.toLowerCase()) {
      case 'home':
        return <HomePage content={pageContent} />;
      case 'about':
        return <AboutPage content={pageContent} />;
      case 'services':
        return <ServicesPage content={pageContent} />;
      case 'contact':
        return <ContactPage content={pageContent} />;
      default:
        return (
          <div className="py-12 text-center">
            <h1 className="text-3xl font-bold mb-4">{currentPage}</h1>
            <p className="text-gray-600">Page content coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold">{app.name}</h1>
              <p className="text-sm text-gray-500">Business Website Editor</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveSection('preview')}
                className={`px-4 py-2 rounded-md ${
                  activeSection === 'preview'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveSection('edit')}
                className={`px-4 py-2 rounded-md ${
                  activeSection === 'edit'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Edit Content
              </button>
              <a
                href="/my-apps"
                className="text-gray-600 hover:text-gray-800"
              >
                Exit Editor
              </a>
            </div>
          </div>
        </div>
      </div>

      {activeSection === 'preview' ? (
        <div className="min-h-screen">
          <Navigation 
            pages={app.pages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {renderPage()}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <DocumentUploader onParsedContent={handleParsedContent} />
            
            {/* Manual Content Editor */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Manual Content Editor</h3>
              <div className="space-y-4">
                {/* Business Info Section */}
                <div>
                  <h4 className="font-medium mb-2">Business Information</h4>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={initialContent.businessInfo.name}
                        onChange={(e) => handleBusinessInfoUpdate('name', e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={initialContent.businessInfo.description}
                        onChange={(e) => handleBusinessInfoUpdate('description', e.target.value)}
                        rows={3}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mission Statement
                      </label>
                      <textarea
                        value={initialContent.businessInfo.mission}
                        onChange={(e) => handleBusinessInfoUpdate('mission', e.target.value)}
                        rows={2}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Services Section */}
                <div>
                  <h4 className="font-medium mb-2">Services</h4>
                  <div className="space-y-4">
                    {initialContent.services?.map((service, index) => (
                      <div key={index} className="border p-4 rounded">
                        {/* Service editor fields */}
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const updatedApp = {
                          ...app,
                          content: {
                            ...initialContent,
                            services: [
                              ...(initialContent.services || []),
                              { title: '', description: '', price: '', features: [] }
                            ]
                          }
                        };
                        onUpdate(updatedApp);
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      + Add Service
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 