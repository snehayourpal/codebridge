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
      <body className="bg-gray-50">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}