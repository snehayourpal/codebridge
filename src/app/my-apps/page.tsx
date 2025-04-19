'use client';
import { useState, useEffect } from 'react';
import { SavedApp } from '@/lib/types';

export default function MyApps() {
  const [apps, setApps] = useState<SavedApp[]>([]);

  useEffect(() => {
    const fetchApps = async () => {
      const response = await fetch('/api/apps');
      const data = await response.json();
      setApps(data);
    };
    fetchApps();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-white">My Generated Apps</h1>

      {apps.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No apps found. Create your first app to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <div key={app.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-[#010079]">{app.name}</h2>
                  <span className="px-3 py-1 bg-blue-100 text-[#1B73D3] text-sm rounded-full font-medium">
                    {app.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">{app.prompt}</p>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">
                    Created: {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-[#1B73D3] font-medium">
                    {app.pages.length} pages • {app.features.length} features
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <a
                    href={`/my-apps/${app.id}/preview`}
                    className="inline-flex items-center px-4 py-2 bg-[#1B73D3] text-white rounded-md hover:bg-[#010079] transition-colors"
                  >
                    View App
                  </a>
                  <a
                    href={`/my-apps/${app.id}/code`}
                    className="inline-flex items-center px-4 py-2 bg-white text-[#1B73D3] border border-[#1B73D3] rounded-md hover:bg-blue-50 transition-colors"
                  >
                    View Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}