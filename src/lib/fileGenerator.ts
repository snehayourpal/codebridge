import { AppStructure } from './types';

type ComponentTemplate = {
  imports: string[];
  component: string;
};

export function generatePageComponent(pageName: string, models: Record<string, Record<string, string>>): ComponentTemplate {
  // Default imports that most components will need
  const baseImports = ['useState', 'useEffect'];
  
  // List page template
  if (pageName.toLowerCase().includes('list')) {
    const modelName = pageName.replace('List', '');
    const model = models[modelName];

    return {
      imports: baseImports,
      component: `
export default function ${pageName}() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/${modelName.toLowerCase()}s');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">${modelName} List</h1>
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg">
              ${Object.keys(model || {})
                .map(field => `<div><strong>${field}:</strong> {item.${field}}</div>`)
                .join('\n              ')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`
    };
  }

  // Dashboard template
  if (pageName.toLowerCase() === 'dashboard') {
    return {
      imports: baseImports,
      component: `
export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add dashboard widgets here */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Overview</h2>
          <p className="text-gray-600">Add dashboard content here</p>
        </div>
      </div>
    </div>
  );
}`
    };
  }

  // Form template for creation/editing
  if (pageName.toLowerCase().includes('create') || pageName.toLowerCase().includes('edit')) {
    const modelName = pageName.replace(/(Create|Edit)/, '');
    const model = models[modelName];

    return {
      imports: baseImports,
      component: `
export default function ${pageName}() {
  const [formData, setFormData] = useState({
    ${Object.entries(model || {})
      .map(([field, type]) => `${field}: ${type === 'string' ? '""' : type === 'number' ? '0' : '[]'}`)
      .join(',\n    ')}
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/${modelName.toLowerCase()}s', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Handle success
      }
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">${pageName}</h1>
      
      ${Object.entries(model || {})
        .map(([field, type]) => `
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">${field}</label>
        <input
          type="${type === 'number' ? 'number' : 'text'}"
          value={formData.${field}}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            ${field}: ${type === 'number' ? 'Number(e.target.value)' : 'e.target.value'}
          }))}
          className="w-full p-2 border rounded"
        />
      </div>`)
        .join('')}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </form>
  );
}`
    };
  }

  // Default page template
  return {
    imports: baseImports,
    component: `
export default function ${pageName}() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">${pageName}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Add content for ${pageName} here</p>
      </div>
    </div>
  );
}`
  };
}

export async function generateAppFiles(app: AppStructure) {
  const files: Record<string, string> = {};

  // Generate page components
  for (const pageName of app.pages) {
    const { imports, component } = generatePageComponent(pageName, app.models);
    
    files[`app/${pageName.toLowerCase()}/page.tsx`] = `'use client';
import { ${imports.join(', ')} } from 'react';
${component}`;
  }

  // Generate layout file
  files['app/layout.tsx'] = `
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              ${app.pages
                .map(
                  page => `<a href="/${page.toLowerCase()}" className="px-3 py-2 rounded-md text-sm font-medium">
                ${page}
              </a>`
                )
                .join('\n              ')}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}`;

  return files;
} 