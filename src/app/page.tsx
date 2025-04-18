'use client';
import { useState } from 'react';
import { TEMPLATES } from '@/lib/templates';
import { AppTemplate, SavedApp } from '@/lib/types';
import TemplateSelector from '@/components/TemplateSelector';
import AppGenerator from '@/components/GeneratorForm';

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<AppTemplate | null>(null);
  const [savedApps, setSavedApps] = useState<SavedApp[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedApps');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const handleSaveApp = (app: SavedApp) => {
    setSavedApps(prev => {
      const newApps = [...prev, app];
      localStorage.setItem('savedApps', JSON.stringify(newApps));
      return newApps;
    });
    setSelectedTemplate(null);
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">App Generator</h1>

      {!selectedTemplate ? (
        <>
          <TemplateSelector 
            templates={TEMPLATES}
            onSelect={setSelectedTemplate}
          />

          {savedApps.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">Your Saved Apps</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedApps.map(app => (
                  <div 
                    key={app.id} 
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{app.name}</h3>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {app.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {app.prompt}
                    </p>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(app.createdAt).toLocaleDateString()}
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
          onSave={handleSaveApp}
        />
      )}
    </main>
  );
}