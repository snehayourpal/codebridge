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
      <div className="box p-6">
        <h2 className="text-xl font-semibold mb-3 text-white">Pages</h2>
        <div className="flex flex-wrap gap-2">
          {data.pages.map((page, index) => (
            <span 
              key={`page-${index}-${String(page)}`} 
              className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm"
            >
              {String(page)}
            </span>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="box p-6">
        <h2 className="text-xl font-semibold mb-3 text-white">Features</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {data.features.map((feature, index) => (
            <li 
              key={`feature-${index}-${String(feature)}`} 
              className="flex items-center text-white"
            >
              <span className="mr-2 text-green-500">✓</span>
              {String(feature).replace(/-/g, ' ')}
            </li>
          ))}
        </ul>
      </div>

      {/* Models Section */}
      <div className="box p-6">
        <h2 className="text-xl font-semibold mb-3 text-white">Data Models</h2>
        <div className="space-y-4">
          {Object.entries(data.models).map(([modelName, fields], modelIndex) => (
            <div key={`model-${modelIndex}`} className="bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2 text-white">{modelName}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(fields).map(([fieldName, fieldType], fieldIndex) => (
                  <div 
                    key={`field-${fieldIndex}`} 
                    className="flex items-center text-gray-300"
                  >
                    <span className="font-mono mr-2">{fieldName}:</span>
                    <span className="text-gray-400">{fieldType}</span>
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