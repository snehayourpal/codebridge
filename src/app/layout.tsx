import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'App Generator',
  description: 'Generate apps from natural language',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f5f5f7]">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="text-[#010079] font-bold text-lg mr-8">
                  App Generator
                </a>
                <div className="flex items-center space-x-1">
                  <a href="/" className="text-[#1B73D3] hover:text-[#010079] hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Generate New
                  </a>
                  <a href="/my-apps" className="text-[#1B73D3] hover:text-[#010079] hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    My Apps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-[#f5f5f7]">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-[#1B73D3]">
            App Generator © {new Date().getFullYear()}
          </div>
        </footer>
      </body>
    </html>
  );
}