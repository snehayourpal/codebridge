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
    if (!file) {
      setError('No file selected');
      return;
    }

    // Only accept text files
    if (file.type !== 'text/plain') {
      setError('Please upload a text file (.txt)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('document', file);

      const response = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to parse document');
      }

      if (!data.businessInfo) {
        throw new Error('Could not extract business information from document');
      }

      onParsedContent(data);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process document');
    } finally {
      setIsUploading(false);
      // Clear the input
      event.target.value = '';
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
            accept=".txt"
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
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <span className="text-blue-600">Upload a document</span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Text file up to 10MB
              </p>
            </div>
          </label>
        </div>

        {error && (
          <div className="text-red-600 text-sm p-4 bg-red-50 rounded">
            <div className="font-medium">Error:</div>
            <div>{error}</div>
          </div>
        )}

        <div className="text-sm text-gray-500">
          <h4 className="font-medium mb-2">Document Format Guidelines:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Upload a text file (.txt)</li>
            <li>Include "Business Name:" at the start</li>
            <li>Add "Description:" for business overview</li>
            <li>Include "Mission:" for mission statement</li>
            <li>Add contact details with "Email:", "Phone:", etc.</li>
            <li>Mark services with "Service:" followed by details</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 