import { AppStructure } from '@/lib/types';

export default function ResultsView({ data }: { data: AppStructure }) {
  // Add validation check
  if (!data || !Array.isArray(data.pages) || !Array.isArray(data.features) || typeof data.models !== 'object') {
    return (
      <div className="text-red-600">
        Invalid data structure
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-8">
      {/* Pages Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Pages</h2>
        <div className="flex flex-wrap gap-2">
          {data.pages.map((page, index) => (
            <span 
              key={`page-${index}-${String(page)}`} 
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {String(page)}
            </span>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Features</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {data.features.map((feature, index) => (
            <li 
              key={`feature-${index}-${String(feature)}`} 
              className="flex items-center"
            >
              <span className="mr-2 text-green-500">✓</span>
              {String(feature).replace(/-/g, ' ')}
            </li>
          ))}
        </ul>
      </div>

      {/* Models Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Data Models</h2>
        <div className="space-y-4">
          {Object.entries(data.models).map(([modelName, fields], modelIndex) => (
            <div 
              key={`model-${modelIndex}-${String(modelName)}`} 
              className="border rounded-lg overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-2 font-medium">
                {String(modelName)}
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(fields).map(([field, type], fieldIndex) => (
                  <div 
                    key={`${modelName}-field-${fieldIndex}-${String(field)}`} 
                    className="text-sm"
                  >
                    <span className="font-mono">{String(field)}</span>
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-xs">
                      {String(type)}
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