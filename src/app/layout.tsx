import type { Metadata } from 'next';
import '@/styles/globals.css';
import Image from 'next/image';

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
      <body className="bg-black">
        <nav className="bg-black shadow-[0_8px_16px_rgba(255,255,255,0.2)] border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-24">
              <div className="flex items-center">
                <a href="/" className="flex items-center mr-8">
                  <Image
                    src="/logo.png"
                    alt="App Generator Logo"
                    width={450}
                    height={120}
                    className="h-20 w-auto"
                  />
                </a>
                <div className="flex items-center space-x-4">
                  <a href="/" className="box text-white hover:text-gray-300 hover:bg-gray-900 px-6 py-2 rounded-md text-xl font-bold transition-colors">
                    Generate New
                  </a>
                  <a href="/my-apps" className="box text-white hover:text-gray-300 hover:bg-gray-900 px-6 py-2 rounded-md text-xl font-bold transition-colors">
                    My Apps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-black">
          {children}
        </main>
        <footer className="bg-black border-t border-gray-800 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-white">
            <Image
              src="/logo.png"
              alt="App Generator Logo"
              width={120}
              height={30}
              className="h-6 w-auto mx-auto mb-2"
            />
            © {new Date().getFullYear()}
          </div>
        </footer>
      </body>
    </html>
  );
}