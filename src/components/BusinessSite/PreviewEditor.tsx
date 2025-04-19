'use client';
import { useState, useEffect } from 'react';
import { SavedApp, BusinessContent } from '@/lib/types';
import DocumentUploader from './DocumentUploader';
import Navigation from './Navigation';
import { HomePage, AboutPage, ServicesPage, ContactPage } from './PageTemplates';
import ChatBot from './ChatBot';

interface PreviewEditorProps {
  app: SavedApp;
  onUpdate: (updatedApp: SavedApp) => void;
}

interface ContentFeedback {
  message: string;
  recommendations: string[];
  parsedContent: Partial<BusinessContent>;
}

export default function PreviewEditor({ app, onUpdate }: PreviewEditorProps) {
  const [activeSection, setActiveSection] = useState<'preview' | 'edit'>('preview');
  const [currentPage, setCurrentPage] = useState(app.pages[0] || 'Home');
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState<ContentFeedback | null>(null);
  const [showPreview, setShowPreview] = useState(false);

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

  const analyzeContent = (content: BusinessContent): ContentFeedback => {
    const recommendations: string[] = [];
    const parsedContent: Partial<BusinessContent> = {};

    // Check business info
    if (content.businessInfo) {
      parsedContent.businessInfo = content.businessInfo;
      
      if (!content.businessInfo.name) {
        recommendations.push("Add a business name");
      }
      if (!content.businessInfo.description) {
        recommendations.push("Add a business description");
      }
      if (!content.businessInfo.mission) {
        recommendations.push("Add a mission statement");
      }
      if (!content.businessInfo.contact?.email && !content.businessInfo.contact?.phone) {
        recommendations.push("Add contact information (email or phone)");
      }
    }

    // Check services
    if (content.services && content.services.length > 0) {
      parsedContent.services = content.services;
    } else {
      recommendations.push("Add at least one service");
    }

    // Check sections
    if (content.sections && content.sections.length > 0) {
      parsedContent.sections = content.sections;
    }

    return {
      message: recommendations.length === 0 
        ? "Great! Your content looks complete. Ready to preview?" 
        : "Here's what I found in your content. Consider adding the following:",
      recommendations,
      parsedContent
    };
  };

  const handleParsedContent = async (content: BusinessContent) => {
    try {
      setIsUpdating(true);
      setError(null);
      setShowPreview(false);

      // Analyze the content
      const contentFeedback = analyzeContent(content);
      setFeedback(contentFeedback);

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedApp)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const savedApp = await response.json();
      onUpdate(savedApp);
    } catch (error) {
      console.error('Update failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to update app');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleApplyToPreview = () => {
    setShowPreview(true);
    setActiveSection('preview');
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
                className="px-4 py-2 rounded-md text-gray-600 hover:text-gray-800"
              >
                Exit Editor
              </a>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* Content Editor */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Content Editor</h3>
                    {feedback && (
                      <div className="flex items-center space-x-4">
                        {feedback.recommendations.length > 0 ? (
                          <div className="bg-yellow-50 p-3 rounded">
                            <p className="text-yellow-700">
                              Some fields are missing. You can add them below or proceed with the current content.
                            </p>
                          </div>
                        ) : (
                          <div className="bg-green-50 p-3 rounded">
                            <p className="text-green-700">Great! Your content looks complete.</p>
                          </div>
                        )}
                        <button
                          onClick={handleApplyToPreview}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Proceed to Preview
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-6">
                    {/* Business Info Section */}
                    <div>
                      <h4 className="font-medium mb-4">Business Information</h4>
                      {feedback?.recommendations.some(rec => rec.includes('business name')) && (
                        <div className="bg-yellow-50 p-2 rounded mb-2">
                          <p className="text-yellow-700 text-sm">Add a business name</p>
                        </div>
                      )}
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
                            placeholder="Enter your business name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          {feedback?.recommendations.some(rec => rec.includes('business description')) && (
                            <div className="bg-yellow-50 p-2 rounded mb-2">
                              <p className="text-yellow-700 text-sm">Add a business description</p>
                            </div>
                          )}
                          <textarea
                            value={initialContent.businessInfo.description}
                            onChange={(e) => handleBusinessInfoUpdate('description', e.target.value)}
                            rows={3}
                            className="w-full p-2 border rounded"
                            placeholder="Describe your business"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mission Statement
                          </label>
                          {feedback?.recommendations.some(rec => rec.includes('mission statement')) && (
                            <div className="bg-yellow-50 p-2 rounded mb-2">
                              <p className="text-yellow-700 text-sm">Add a mission statement</p>
                            </div>
                          )}
                          <textarea
                            value={initialContent.businessInfo.mission}
                            onChange={(e) => handleBusinessInfoUpdate('mission', e.target.value)}
                            rows={2}
                            className="w-full p-2 border rounded"
                            placeholder="What is your business mission?"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Information Section */}
                    <div>
                      <h4 className="font-medium mb-4">Contact Information</h4>
                      {feedback?.recommendations.some(rec => rec.includes('contact information')) && (
                        <div className="bg-yellow-50 p-2 rounded mb-2">
                          <p className="text-yellow-700 text-sm">Add contact information (email or phone)</p>
                        </div>
                      )}
                      <div className="grid gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={initialContent.businessInfo.contact?.email || ''}
                            onChange={(e) => {
                              const updatedApp = {
                                ...app,
                                content: {
                                  ...initialContent,
                                  businessInfo: {
                                    ...initialContent.businessInfo,
                                    contact: {
                                      ...initialContent.businessInfo.contact,
                                      email: e.target.value
                                    }
                                  }
                                }
                              };
                              onUpdate(updatedApp);
                            }}
                            className="w-full p-2 border rounded"
                            placeholder="business@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={initialContent.businessInfo.contact?.phone || ''}
                            onChange={(e) => {
                              const updatedApp = {
                                ...app,
                                content: {
                                  ...initialContent,
                                  businessInfo: {
                                    ...initialContent.businessInfo,
                                    contact: {
                                      ...initialContent.businessInfo.contact,
                                      phone: e.target.value
                                    }
                                  }
                                }
                              };
                              onUpdate(updatedApp);
                            }}
                            className="w-full p-2 border rounded"
                            placeholder="(123) 456-7890"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                          </label>
                          <textarea
                            value={initialContent.businessInfo.contact?.address || ''}
                            onChange={(e) => {
                              const updatedApp = {
                                ...app,
                                content: {
                                  ...initialContent,
                                  businessInfo: {
                                    ...initialContent.businessInfo,
                                    contact: {
                                      ...initialContent.businessInfo.contact,
                                      address: e.target.value
                                    }
                                  }
                                }
                              };
                              onUpdate(updatedApp);
                            }}
                            rows={2}
                            className="w-full p-2 border rounded"
                            placeholder="Enter your business address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Business Hours
                          </label>
                          <div className="space-y-2">
                            {initialContent.businessInfo.contact?.hours?.map((hour, index) => (
                              <div key={index} className="flex gap-2">
                                <input
                                  type="text"
                                  value={hour}
                                  onChange={(e) => {
                                    const updatedHours = [...(initialContent.businessInfo.contact?.hours || [])];
                                    updatedHours[index] = e.target.value;
                                    const updatedApp = {
                                      ...app,
                                      content: {
                                        ...initialContent,
                                        businessInfo: {
                                          ...initialContent.businessInfo,
                                          contact: {
                                            ...initialContent.businessInfo.contact,
                                            hours: updatedHours
                                          }
                                        }
                                      }
                                    };
                                    onUpdate(updatedApp);
                                  }}
                                  className="flex-1 p-2 border rounded"
                                  placeholder="Monday - Friday: 9am - 5pm"
                                />
                                <button
                                  onClick={() => {
                                    const updatedHours = [...(initialContent.businessInfo.contact?.hours || [])];
                                    updatedHours.splice(index, 1);
                                    const updatedApp = {
                                      ...app,
                                      content: {
                                        ...initialContent,
                                        businessInfo: {
                                          ...initialContent.businessInfo,
                                          contact: {
                                            ...initialContent.businessInfo.contact,
                                            hours: updatedHours
                                          }
                                        }
                                      }
                                    };
                                    onUpdate(updatedApp);
                                  }}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const updatedApp = {
                                  ...app,
                                  content: {
                                    ...initialContent,
                                    businessInfo: {
                                      ...initialContent.businessInfo,
                                      contact: {
                                        ...initialContent.businessInfo.contact,
                                        hours: [
                                          ...(initialContent.businessInfo.contact?.hours || []),
                                          ''
                                        ]
                                      }
                                    }
                                  }
                                };
                                onUpdate(updatedApp);
                              }}
                              className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                              + Add Business Hours
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Services Section */}
                    <div>
                      <h4 className="font-medium mb-4">Services</h4>
                      {feedback?.recommendations.some(rec => rec.includes('service')) && (
                        <div className="bg-yellow-50 p-2 rounded mb-2">
                          <p className="text-yellow-700 text-sm">Add at least one service</p>
                        </div>
                      )}
                      <div className="space-y-4">
                        {initialContent.services?.map((service, index) => (
                          <div key={index} className="border p-4 rounded space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service Title
                              </label>
                              <input
                                type="text"
                                value={service.title}
                                onChange={(e) => {
                                  const updatedServices = [...(initialContent.services || [])];
                                  updatedServices[index] = {
                                    ...service,
                                    title: e.target.value
                                  };
                                  const updatedApp = {
                                    ...app,
                                    content: {
                                      ...initialContent,
                                      services: updatedServices
                                    }
                                  };
                                  onUpdate(updatedApp);
                                }}
                                className="w-full p-2 border rounded"
                                placeholder="Service name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                value={service.description}
                                onChange={(e) => {
                                  const updatedServices = [...(initialContent.services || [])];
                                  updatedServices[index] = {
                                    ...service,
                                    description: e.target.value
                                  };
                                  const updatedApp = {
                                    ...app,
                                    content: {
                                      ...initialContent,
                                      services: updatedServices
                                    }
                                  };
                                  onUpdate(updatedApp);
                                }}
                                rows={3}
                                className="w-full p-2 border rounded"
                                placeholder="Describe this service"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price
                              </label>
                              <input
                                type="text"
                                value={service.price}
                                onChange={(e) => {
                                  const updatedServices = [...(initialContent.services || [])];
                                  updatedServices[index] = {
                                    ...service,
                                    price: e.target.value
                                  };
                                  const updatedApp = {
                                    ...app,
                                    content: {
                                      ...initialContent,
                                      services: updatedServices
                                    }
                                  };
                                  onUpdate(updatedApp);
                                }}
                                className="w-full p-2 border rounded"
                                placeholder="Starting at $99"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Features
                              </label>
                              <div className="space-y-2">
                                {service.features?.map((feature, featureIndex) => (
                                  <div key={featureIndex} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={feature}
                                      onChange={(e) => {
                                        const updatedFeatures = [...(service.features || [])];
                                        updatedFeatures[featureIndex] = e.target.value;
                                        const updatedServices = [...(initialContent.services || [])];
                                        updatedServices[index] = {
                                          ...service,
                                          features: updatedFeatures
                                        };
                                        const updatedApp = {
                                          ...app,
                                          content: {
                                            ...initialContent,
                                            services: updatedServices
                                          }
                                        };
                                        onUpdate(updatedApp);
                                      }}
                                      className="flex-1 p-2 border rounded"
                                      placeholder="Feature description"
                                    />
                                    <button
                                      onClick={() => {
                                        const updatedFeatures = [...(service.features || [])];
                                        updatedFeatures.splice(featureIndex, 1);
                                        const updatedServices = [...(initialContent.services || [])];
                                        updatedServices[index] = {
                                          ...service,
                                          features: updatedFeatures
                                        };
                                        const updatedApp = {
                                          ...app,
                                          content: {
                                            ...initialContent,
                                            services: updatedServices
                                          }
                                        };
                                        onUpdate(updatedApp);
                                      }}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => {
                                    const updatedServices = [...(initialContent.services || [])];
                                    updatedServices[index] = {
                                      ...service,
                                      features: [...(service.features || []), '']
                                    };
                                    const updatedApp = {
                                      ...app,
                                      content: {
                                        ...initialContent,
                                        services: updatedServices
                                      }
                                    };
                                    onUpdate(updatedApp);
                                  }}
                                  className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                  + Add Feature
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <button
                                onClick={() => {
                                  const updatedServices = [...(initialContent.services || [])];
                                  updatedServices.splice(index, 1);
                                  const updatedApp = {
                                    ...app,
                                    content: {
                                      ...initialContent,
                                      services: updatedServices
                                    }
                                  };
                                  onUpdate(updatedApp);
                                }}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Remove Service
                              </button>
                            </div>
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
              
              <div className="lg:col-span-1">
                <ChatBot 
                  content={initialContent}
                  onUpdate={(updatedContent) => {
                    const updatedApp = {
                      ...app,
                      content: updatedContent,
                      updatedAt: new Date()
                    };
                    onUpdate(updatedApp);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Updating...</p>
          </div>
        </div>
      )}
    </div>
  );
} 