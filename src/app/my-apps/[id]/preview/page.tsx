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
        console.log('Fetching app with ID:', resolvedParams.id); // Debug log
        
        const response = await fetch(`/api/apps/${resolvedParams.id}`);
        console.log('Response status:', response.status); // Debug log
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch app data');
        }
        
        const data = await response.json();
        console.log('Received data:', data); // Debug log
        
        if (!data || !data.pages) {
          throw new Error('Invalid app data received');
        }
        
        setApp(data);
        setCurrentPage(data.pages[0]);
      } catch (err) {
        console.error('Error details:', err); // Debug log
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

  // Show business site editor only for business-info template
  if (app.templateId === 'business-info') {
    return <PreviewEditor app={app} onUpdate={setApp} />;
  }

  // Default preview for other templates
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold">{app.name}</h1>
              <p className="text-sm text-gray-500">Preview Mode</p>
            </div>
            <a href="/my-apps" className="text-gray-600 hover:text-gray-900">
              Exit Preview
            </a>
          </div>
        </div>
      </div>

      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-4">
            {Array.isArray(app.pages) && app.pages.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === page
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{currentPage}</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
              <p className="text-gray-500">Preview of {currentPage} component</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 