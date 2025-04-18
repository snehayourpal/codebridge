'use client';

interface NavigationProps {
  pages: string[];
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Navigation({ pages, currentPage, onPageChange }: NavigationProps) {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-4 h-16 items-center">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === page
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
} 