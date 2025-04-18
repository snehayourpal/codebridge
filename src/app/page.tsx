'use client';
import { useState } from 'react';
import { AppStructure } from '@/lib/types';
import ResultsView from '@/components/AppGenerator/ResultsView';
import LoadingSpinner from '@/components/AppGenerator/LoadingSpinner';

export default function Home() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AppStructure | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: input })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Generation failed');
      if (!data.pages || !data.models) throw new Error('Invalid response format');

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Describe Your App</h1>
      
      <div className="space-y-4">
        <textarea
          className="w-full p-4 border rounded-lg"
          placeholder="Example: 'A todo app with authentication'"
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
        >
          {isLoading ? 'Generating...' : 'Generate App'}
        </button>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <div className="mt-4 p-4 bg-red-50 text-red-600 rounded">{error}</div>}
      {result && <ResultsView data={result} />}
    </div>
  );
}