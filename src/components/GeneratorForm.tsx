'use client';
import { AppTemplate, AppStructure, SavedApp } from '@/lib/types';
import { useState } from 'react';
import ResultsView from './AppGenerator/ResultsView';

export default function GeneratorForm({
  template,
  onBack,
  onSave
}: {
  template: AppTemplate;
  onBack: () => void;
  onSave: (app: SavedApp) => void;
}) {
  const [input, setInput] = useState(template.samplePrompt);
  const [generatedApp, setGeneratedApp] = useState<AppStructure | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: input,
          template: template.id 
        })
      });
      const data = await response.json();
      setGeneratedApp(data);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (app: AppStructure) => {
    try {
      const savedApp: SavedApp = {
        ...app,
        id: crypto.randomUUID(),
        name: template.name,
        category: template.category,
        templateId: template.id,
        prompt: input,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const response = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedApp)
      });
      
      if (response.ok) {
        onSave(savedApp);
      }
    } catch (error) {
      console.error('Failed to save app:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 mr-4"
        >
          ← Back to Templates
        </button>
        <h1 className="text-2xl font-bold">{template.name} Generator</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your application
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 border rounded-lg mb-4 min-h-[100px]"
            placeholder="Describe what you want your application to do..."
            rows={4}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {isGenerating ? 'Generating...' : 'Generate App'}
        </button>
      </div>

      {generatedApp && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Generated Structure</h3>
            <button
              onClick={() => handleSave(generatedApp)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              Save App
            </button>
          </div>
          
          <ResultsView data={generatedApp} />
        </div>
      )}
    </div>
  );
}