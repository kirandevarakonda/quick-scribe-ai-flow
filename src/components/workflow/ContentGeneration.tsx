import React, { useState } from 'react';
import { API_ENDPOINTS } from '../../lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ContentGenerationProps {
  data: {
    selectedKeyword: string;
    titles: string[];
    selectedTitle: string;
    topics: string[];
    selectedTopic: string;
    keywords: string[];
    content: string;
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ContentGeneration({ data, onUpdate, onNext, onBack }: ContentGenerationProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegenerateContent = async () => {
    if (isRegenerating) return;
    setIsRegenerating(true);
    setError(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.content, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: data.selectedTitle,
          topics: [data.selectedTopic],
          keywords: data.keywords 
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to regenerate content');
      }

      if (!responseData.content) {
        throw new Error('Invalid response format from server');
      }

      onUpdate({ ...data, content: responseData.content });
    } catch (err) {
      console.error('Error regenerating content:', err);
      setError(err.message || 'Failed to regenerate content. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving content:', data.content);
  };

  // Custom components for markdown rendering
  const components = {
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-2">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-6">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-xl font-bold text-gray-800 mb-3 mt-4">{children}</h3>
    ),
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-bold text-gray-900">{children}</strong>
    ),
    em: ({ children }: { children: React.ReactNode }) => (
      <em className="italic text-gray-800">{children}</em>
    ),
  };

  // Preprocess the content to ensure proper markdown formatting
  const preprocessContent = (content: string) => {
    // First, ensure proper line breaks
    let processed = content
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^#(.*?)$/gm, '# $1')     // Add space after # for proper markdown
      .replace(/^##(.*?)$/gm, '## $1')   // Add space after ## for proper markdown
      .replace(/\*\*(.*?)\*\*/g, ' **$1** ')  // Add spaces around bold text
      .replace(/\s+/g, ' ')              // Normalize spaces
      .trim();                           // Remove extra whitespace
    
    return processed;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Generated Content</h2>
        <button
          onClick={handleRegenerateContent}
          disabled={isRegenerating}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          {isRegenerating ? 'Regenerating...' : 'Regenerate Content'}
        </button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="p-6 bg-white border rounded-lg shadow-sm">
        <div className="prose max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={components}
          >
            {preprocessContent(data.content)}
          </ReactMarkdown>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Save Content
        </button>
      </div>
    </div>
  );
} 