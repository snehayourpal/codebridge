'use client';
import { useState, useEffect } from 'react';
import { TEMPLATES } from '@/lib/templates';
import { AppTemplate, SavedApp } from '@/lib/types';
import TemplateSelector from '@/components/TemplateSelector';
import AppGenerator from '@/components/GeneratorForm';
import Image from 'next/image';

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<AppTemplate | null>(null);
  const [savedApps, setSavedApps] = useState<SavedApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedApps = async () => {
      try {
        const response = await fetch('/api/apps');
        const data = await response.json();
        setSavedApps(data);
      } catch (error) {
        console.error('Failed to fetch saved apps:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedApps();
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">App Generator</h1>
      </div>

      {!selectedTemplate ? (
        <>
          <TemplateSelector 
            templates={TEMPLATES}
            onSelect={setSelectedTemplate}
          />

          {!isLoading && savedApps.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl font-semibold mb-4 text-white">Your Saved Apps</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedApps.map(app => (
                  <div 
                    key={app.id} 
                    className="bg-black p-5 rounded-lg shadow hover:shadow-md transition-all duration-300 border border-gray-800"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-white">{app.name}</h3>
                      <span className="text-xs px-2 py-1 bg-gray-900 text-white rounded-full font-medium">
                        {app.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {app.prompt}
                    </p>
                    <div className="text-xs text-gray-400 mb-4">
                      Created: {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={`/my-apps/${app.id}/preview`}
                        className="text-sm px-3 py-1.5 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                      >
                        View App
                      </a>
                      <a
                        href={`/my-apps/${app.id}/code`}
                        className="text-sm px-3 py-1.5 bg-black text-white border border-gray-700 rounded hover:bg-gray-900 transition-colors"
                      >
                        View Code
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <AppGenerator
          template={selectedTemplate}
          onBack={() => setSelectedTemplate(null)}
          onSave={(app: SavedApp) => {
            setSavedApps(prev => [...prev, app]);
            setSelectedTemplate(null);
          }}
        />
      )}
    </main>
  );
}