'use client';
import { useState, useEffect, use } from 'react';
import { SavedApp } from '@/lib/types';
import { generateAppFiles } from '@/lib/fileGenerator';

export default function AppCode({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [app, setApp] = useState<SavedApp | null>(null);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/apps/${resolvedParams.id}`);
        if (!response.ok) throw new Error('Failed to fetch app data');

        const data = await response.json();
        setApp(data);
        const generatedFiles = await generateAppFiles(data);
        setFiles(generatedFiles);
        setSelectedFile(Object.keys(generatedFiles)[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchApp();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-[#010079]">Loading...</div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-red-600 text-center">
          {error || 'Failed to load app'}
          <br />
          <button 
            onClick={() => window.location.href = '/my-apps'}
            className="mt-4 px-4 py-2 bg-[#1B73D3] text-white rounded hover:bg-[#155bb0]"
          >
            Return to My Apps
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#010079]">{app.name} - Code</h1>
          <a
            href="/my-apps"
            className="text-[#1B73D3] hover:underline"
          >
            Back to Apps
          </a>
        </div>

        <div className="bg-[#010079] rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-4 min-h-[600px]">
            {/* File Explorer */}
            <div className="border-r border-[#1B73D3] bg-[#010079] text-white">
              <div className="p-4">
                <h2 className="text-sm font-medium text-[#1B73D3] mb-2">Files</h2>
                <div className="space-y-1">
                  {Object.keys(files).map((filename) => (
                    <button
                      key={filename}
                      onClick={() => setSelectedFile(filename)}
                      className={`w-full text-left px-2 py-1 rounded text-sm ${
                        selectedFile === filename
                          ? 'bg-[#1B73D3] text-white'
                          : 'hover:bg-[#1B73D3]/20'
                      }`}
                    >
                      {filename}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Code View */}
            <div className="col-span-3 bg-white">
              <div className="p-4">
                {selectedFile && (
                  <>
                    <div className="text-sm font-mono mb-2 text-[#1B73D3]">
                      {selectedFile}
                    </div>
                    <pre className="bg-[#f0f4ff] text-[#010079] p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm font-mono whitespace-pre-wrap">
                        {files[selectedFile]}
                      </code>
                    </pre>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
