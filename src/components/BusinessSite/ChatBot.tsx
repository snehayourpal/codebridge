'use client';
import { useState } from 'react';
import { BusinessContent } from '@/lib/types';

interface ChatBotProps {
  content: BusinessContent;
  onUpdate: (updatedContent: BusinessContent) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBot({ content, onUpdate }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRequest = async (userInput: string) => {
    setIsProcessing(true);
    setMessages(prev => [...prev, { role: 'user', content: userInput }]);

    try {
      // Here you would typically call an API to process the request
      // For now, we'll use a simple example implementation
      const response = await processRequest(userInput, content);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
      
      if (response.updatedContent) {
        onUpdate(response.updatedContent);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please try again.' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const processRequest = async (request: string, currentContent: BusinessContent): Promise<{
    message: string;
    updatedContent?: BusinessContent;
  }> => {
    // Example implementation - in a real app, this would call an API
    const requestLower = request.toLowerCase();
    
    if (requestLower.includes('change business name to')) {
      const newName = request.split('to')[1].trim();
      return {
        message: `I've updated your business name to "${newName}".`,
        updatedContent: {
          ...currentContent,
          businessInfo: {
            ...currentContent.businessInfo,
            name: newName
          }
        }
      };
    }
    
    if (requestLower.includes('add service')) {
      const serviceName = request.split('service')[1].trim();
      return {
        message: `I've added a new service "${serviceName}". You can now edit its details in the services section.`,
        updatedContent: {
          ...currentContent,
          services: [
            ...(currentContent.services || []),
            {
              title: serviceName,
              description: '',
              price: '',
              features: []
            }
          ]
        }
      };
    }

    if (requestLower.includes('update description')) {
      const newDescription = request.split('description')[1].trim();
      return {
        message: `I've updated your business description.`,
        updatedContent: {
          ...currentContent,
          businessInfo: {
            ...currentContent.businessInfo,
            description: newDescription
          }
        }
      };
    }

    // Default response for unrecognized requests
    return {
      message: "I can help you with:\n" +
        "- Changing your business name\n" +
        "- Adding new services\n" +
        "- Updating your business description\n" +
        "- Modifying contact information\n" +
        "Please be specific about what you'd like to change."
    };
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Website Assistant</h3>
      
      <div className="space-y-4 mb-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-50 text-blue-900 ml-auto' 
                : 'bg-gray-50 text-gray-900'
            }`}
          >
            {message.content}
          </div>
        ))}
        {isProcessing && (
          <div className="text-gray-500">Processing your request...</div>
        )}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && input.trim()) {
              handleRequest(input.trim());
              setInput('');
            }
          }}
          placeholder="What would you like to change on your website?"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={() => {
            if (input.trim()) {
              handleRequest(input.trim());
              setInput('');
            }
          }}
          disabled={isProcessing}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
} 