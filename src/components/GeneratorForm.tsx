'use client';
import { useState } from 'react';
import { AppTemplate, AppStructure, SavedApp } from '@/lib/types';
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
      console.log('Generated app data:', data);

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
      {/* Form Section */}
      <div className="bg-black p-6 rounded-lg shadow-[0_8px_16px_rgba(255,255,255,0.2)]">
        <div className="flex items-center mb-4">
          <button
            onClick={onBack}
            className="text-white hover:text-gray-300 mr-4"
          >
            ←
          </button>
          <h2 className="text-xl font-bold text-white">{template.name} Generator</h2>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-4 border rounded-lg mb-4 border-white text-white"
          rows={4}
          placeholder="Describe your application..."
        />

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-gray-100 disabled:bg-gray-300 transition-colors"
        >
          {isGenerating ? 'generating...' : 'generate app'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Generated Structure Section */}
      {generatedApp && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-[#010079]">Generated Structure</h3>
            <button
              onClick={handleSave}
              className="bg-[#010079] hover:bg-[#1B73D3] text-white px-4 py-2 rounded transition-colors"
            >
              Save App
            </button>
          </div>

          {/* Debug Output */}
          <div className="mb-4 p-4 bg-[#f0f4ff] rounded">
            <pre className="text-sm overflow-auto text-[#010079]">
              {JSON.stringify(generatedApp, null, 2)}
            </pre>
          </div>

          {/* Results View Component */}
          <ResultsView data={generatedApp} />
        </div>
      )}
    </div>
  );
}
