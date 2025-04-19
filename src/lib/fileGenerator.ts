import { AppStructure, SavedApp } from './types';

type ComponentTemplate = {
  imports: string[];
  component: string;
};

export function generatePageComponent(pageName: string, app: SavedApp): ComponentTemplate {
  // Default imports that most components will need
  const baseImports = ['useState', 'useEffect'];
  const content = app.content;
  
  // List page template
  if (pageName.toLowerCase().includes('list')) {
    const modelName = pageName.replace('List', '');
    const model = app.models[modelName];

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
    const model = app.models[modelName];

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

  // Business website page templates
  if (pageName.toLowerCase() === 'home') {
    return {
      imports: baseImports,
      component: `
export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gray-50">
        <h1 className="text-4xl font-bold mb-4">
          ${content?.businessInfo?.name || 'Welcome to Our Business'}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          ${content?.businessInfo?.description || 'Your trusted business partner'}
        </p>
      </div>

      {/* Services Preview */}
      ${content?.services && content.services.length > 0 ? `
      <div className="py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${content.services.map((service: any) => `
            <div key={service.title} className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold mb-2">${service.title}</h3>
              <p className="text-gray-600">${service.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
    </div>
  );
}`
    };
  }

  if (pageName.toLowerCase() === 'about') {
    return {
      imports: baseImports,
      component: `
export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      ${content?.businessInfo?.mission ? `
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
        <p className="text-gray-700">${content.businessInfo.mission}</p>
      </div>
      ` : ''}
      ${content?.sections ? `
      <div className="prose lg:prose-lg">
        ${content.sections.map((section: any) => `
          <div key={section.id} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">${section.title}</h2>
            <p>${section.content}</p>
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
  );
}`
    };
  }

  if (pageName.toLowerCase() === 'services') {
    return {
      imports: baseImports,
      component: `
export default function Services() {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        ${content?.services ? content.services.map((service: any) => `
          <div key={service.title} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-3">${service.title}</h2>
            <p className="text-gray-600 mb-4">${service.description}</p>
            ${service.price ? `
            <p className="text-blue-600 font-semibold">${service.price}</p>
            ` : ''}
            ${service.features && service.features.length > 0 ? `
            <ul className="mt-4 space-y-2">
              ${service.features.map((feature: string) => `
                <li key={feature} className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  ${feature}
                </li>
              `).join('')}
            </ul>
            ` : ''}
          </div>
        `).join('') : ''}
      </div>
    </div>
  );
}`
    };
  }

  if (pageName.toLowerCase() === 'contact') {
    return {
      imports: baseImports,
      component: `
export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          ${content?.businessInfo?.contact ? `
          <div className="space-y-4">
            ${content.businessInfo.contact.email ? `
            <p className="flex items-center">
              <span className="mr-2">📧</span>
              ${content.businessInfo.contact.email}
            </p>
            ` : ''}
            ${content.businessInfo.contact.phone ? `
            <p className="flex items-center">
              <span className="mr-2">📞</span>
              ${content.businessInfo.contact.phone}
            </p>
            ` : ''}
            ${content.businessInfo.contact.address ? `
            <p className="flex items-center">
              <span className="mr-2">📍</span>
              ${content.businessInfo.contact.address}
            </p>
            ` : ''}
          </div>
          ` : ''}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
          ${content?.businessInfo?.contact?.hours ? `
          <ul className="space-y-2">
            ${content.businessInfo.contact.hours.map((hour: string) => `
              <li key={hour}>${hour}</li>
            `).join('')}
          </ul>
          ` : ''}
        </div>
      </div>
    </div>
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

export async function generateAppFiles(app: SavedApp) {
  const files: Record<string, string> = {};

  // Generate page components
  for (const pageName of app.pages) {
    const { imports, component } = generatePageComponent(pageName, app);
    
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