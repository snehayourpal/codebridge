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
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: input,
          template: template.id 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate app structure');
      }

      const data = await response.json();
      console.log('Generated app data:', data); // Debug log
      
      // Ensure the data has the required structure
      if (!data.pages || !data.features || !data.models) {
        throw new Error('Invalid app structure received');
      }

      setGeneratedApp(data);
    } catch (error) {
      console.error('Generation failed:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedApp) return;

    try {
      const savedApp: SavedApp = {
        ...generatedApp,
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
      
      if (!response.ok) {
        throw new Error('Failed to save app');
      }

      onSave(savedApp);
    } catch (error) {
      console.error('Failed to save app:', error);
      setError(error instanceof Error ? error.message : 'Failed to save app');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 mr-4"
          >
            ← Back
          </button>
          <h2 className="text-xl font-bold">{template.name} Generator</h2>
        </div>
        
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-4 border rounded-lg mb-4"
          rows={4}
          placeholder="Describe your application..."
        />

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {isGenerating ? 'Generating...' : 'Generate App'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {generatedApp && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Generated Structure</h3>
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              Save App
            </button>
          </div>
          
          {/* Debug output */}
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(generatedApp, null, 2)}
            </pre>
          </div>

          <ResultsView data={generatedApp} />
        </div>
      )}
    </div>
  );
}