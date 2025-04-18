'use client';
import { useState } from 'react';
import { BusinessContent } from '@/lib/types';

interface DocumentUploaderProps {
  onParsedContent: (content: BusinessContent) => void;
}

export default function DocumentUploader({ onParsedContent }: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('document', file);

      const response = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse document');
      }

      const parsedContent: BusinessContent = await response.json();
      onParsedContent(parsedContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process document');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Upload Business Document</h3>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".doc,.docx,.pdf,.txt"
            className="hidden"
            id="document-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="document-upload"
            className="cursor-pointer text-gray-600 hover:text-gray-800"
          >
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m0 0v4a4 4 0 004 4h20a4 4 0 004-4V28m-4-4l-8-8-4 4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-sm">
                {isUploading ? (
                  'Processing...'
                ) : (
                  <>
                    <span className="text-blue-600">Upload a document</span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">
                DOC, DOCX, PDF, or TXT up to 10MB
              </p>
            </div>
          </label>
        </div>

        {error && (
          <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div className="text-sm text-gray-500">
          <h4 className="font-medium mb-2">Document Guidelines:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Include business name and description</li>
            <li>List services or products with descriptions</li>
            <li>Add contact information and business hours</li>
            <li>Optional: mission statement and team information</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 