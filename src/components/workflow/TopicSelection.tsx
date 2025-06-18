import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import { API_ENDPOINTS } from '@/lib/api';

interface TopicSelectionProps {
  data: {
    selectedKeyword: string;
    titles: string[];
    selectedTitle: string;
    topics: string[];
    keywords: string[];
    selectedTopic?: string;
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function TopicSelection({ data, onUpdate, onNext, onBack }: TopicSelectionProps) {
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerateTopics = async () => {
    if (isRegenerating) return;
    setIsRegenerating(true);
    setError(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.topics, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: data.selectedTitle,
          keywords: data.keywords 
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to regenerate topics');
      }

      if (!responseData.topics || !Array.isArray(responseData.topics)) {
        throw new Error('Invalid response format from server');
      }

      onUpdate({ ...data, topics: responseData.topics, selectedTopic: undefined });
    } catch (err) {
      console.error('Error regenerating topics:', err);
      setError(err.message || 'Failed to regenerate topics. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleTopicSelect = async (selectedTopic: string) => {
    if (isGeneratingContent) return;
    
    setIsGeneratingContent(true);
    setError(null);
    onUpdate({ ...data, selectedTopic });
    
    try {
      const response = await fetch(API_ENDPOINTS.content, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: data.selectedTitle,
          topics: [selectedTopic],
          keywords: data.keywords 
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to generate content');
      }

      if (!responseData.content) {
        throw new Error('Invalid response format from server');
      }

      onUpdate({ ...data, selectedTopic, content: responseData.content });
      onNext();
    } catch (err) {
      console.error('Error generating content:', err);
      setError(err.message || 'Failed to generate content. Please try again.');
      setIsGeneratingContent(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Select a topic for: {data.selectedTitle}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerateTopics}
            disabled={isRegenerating}
          >
            {isRegenerating ? 'Regenerating...' : 'Regenerate Topics'}
          </Button>
        </div>
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 gap-2">
          {data.topics.map((topic) => (
            <Card
              key={topic}
              className={`cursor-pointer transition-colors ${
                data.selectedTopic === topic
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50'
              } ${isGeneratingContent ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => handleTopicSelect(topic)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-center">
                  {isGeneratingContent && data.selectedTopic === topic ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Generating content...</span>
                    </>
                  ) : (
                    <p className="text-center">{topic}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-start">
        <Button variant="outline" onClick={onBack}>
          Back to Titles
        </Button>
      </div>
    </div>
  );
} 