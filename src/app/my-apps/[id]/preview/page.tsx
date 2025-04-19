'use client';
import { useState, useEffect, use } from 'react';
import { SavedApp } from '@/lib/types';
import PreviewEditor from '@/components/BusinessSite/PreviewEditor';

export default function AppPreview({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [app, setApp] = useState<SavedApp | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/apps/${resolvedParams.id}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
          throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();
        setApp(data);
      } catch (err) {
        console.error('Failed to fetch app:', err);
        setError(err instanceof Error ? err.message : 'Failed to load app');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApp();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error || 'Failed to load app'}</div>
          <button 
            onClick={() => window.location.href = '/my-apps'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to My Apps
          </button>
        </div>
      </div>
    );
  }

  return <PreviewEditor app={app} onUpdate={setApp} />;
} 