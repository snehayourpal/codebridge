import { AppStructure } from '@/lib/types';

export default function ResultsView({ data }: { data: AppStructure }) {
  return (
    <div className="mt-8 space-y-8">
      {/* Pages Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Pages</h2>
        <div className="flex flex-wrap gap-2">
          {data.pages.map(page => (
            <span key={page} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {page}
            </span>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Features</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {data.features.map(feature => (
            <li key={feature} className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              {feature.replace(/-/g, ' ')}
            </li>
          ))}
        </ul>
      </div>

      {/* Models Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Data Models</h2>
        <div className="space-y-4">
          {Object.entries(data.models).map(([modelName, fields]) => (
            <div key={modelName} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 font-medium">
                {modelName}
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(fields).map(([field, type]) => (
                  <div key={field} className="text-sm">
                    <span className="font-mono">{field}</span>
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-xs">
                      {type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}