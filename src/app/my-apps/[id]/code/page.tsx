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
        
        if (!response.ok) {
          throw new Error('Failed to fetch app data');
        }
        
        const data = await response.json();
        setApp(data);
        
        // Generate files once we have the app data
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          {error || 'Failed to load app'}
          <br />
          <button 
            onClick={() => window.location.href = '/my-apps'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to My Apps
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{app.name} - Code</h1>
          <a
            href="/my-apps"
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Apps
          </a>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-4 min-h-[600px]">
            {/* File Explorer */}
            <div className="border-r">
              <div className="p-4">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Files</h2>
                <div className="space-y-1">
                  {Object.keys(files).map((filename) => (
                    <button
                      key={filename}
                      onClick={() => setSelectedFile(filename)}
                      className={`w-full text-left px-2 py-1 rounded text-sm ${
                        selectedFile === filename
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {filename}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Code View */}
            <div className="col-span-3">
              <div className="p-4">
                {selectedFile && (
                  <>
                    <div className="text-sm font-mono mb-2 text-gray-500">
                      {selectedFile}
                    </div>
                    <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm font-mono">
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