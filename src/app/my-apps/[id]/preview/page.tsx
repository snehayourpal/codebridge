'use client';
import { useState, useEffect, use } from 'react';
import { SavedApp } from '@/lib/types';
import PreviewEditor from '@/components/BusinessSite/PreviewEditor';

export default function AppPreview({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [app, setApp] = useState<SavedApp | null>(null);
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/apps/${resolvedParams.id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch app data');
        }
        const data = await response.json();
        if (!data || !data.pages) {
          throw new Error('Invalid app data received');
        }
        setApp(data);
        setCurrentPage(data.pages[0]);
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

  // Business site editor
  if (app.templateId === 'business-info') {
    return <PreviewEditor app={app} onUpdate={setApp} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#010079] border-b border-[#010079]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-white">{app.name}</h1>
              <p className="text-sm text-white">Preview Mode</p>
            </div>
            <a href="/my-apps" className="text-white hover:underline">
              Exit Preview
            </a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[#1B73DS] shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-4 py-2">
            {Array.isArray(app.pages) && app.pages.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  currentPage === page
                    ? 'bg-white text-[#010079]'
                    : 'text-[#1B73D3] hover:bg-white/10'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Page Preview */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-[#f0f4ff] rounded-lg shadow border border-[#1B73D3]">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-[#010079] mb-4">{currentPage}</h2>
            <div className="border-2 border-dashed border-[#1B73D3] rounded-lg p-4 bg-white">
              <p className="text-[#1B73D3]">Preview of <span className="font-semibold">{currentPage}</span> component</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
