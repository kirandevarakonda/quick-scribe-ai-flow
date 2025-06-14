import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import { API_ENDPOINTS } from '@/lib/api';

interface TopicSelectionProps {
  data: {
    selectedTitle: string;
    topics: string[];
    selectedTopic: string;
  };
  onUpdate: (data: { topics: string[]; selectedTopic: string; content?: string }) => void;
  onNext: () => void;
  onBack?: () => void;
}

export default function TopicSelection({ data, onUpdate, onNext, onBack }: TopicSelectionProps) {
  const [generatingContent, setGeneratingContent] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerateTopics = async () => {
    if (!data.selectedTopic) return;
    
    setIsRegenerating(true);
    try {
      const response = await fetch(API_ENDPOINTS.topics, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: data.selectedTopic }),
      });
      
      if (!response.ok) throw new Error('Failed to generate topics');
      
      const { topics } = await response.json();
      onUpdate({ topics, selectedTopic: data.selectedTopic });
    } catch (error) {
      console.error('Error generating topics:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleTopicSelect = async (topic: string) => {
    setGeneratingContent(true);
    try {
      // First update the selected topic
      onUpdate({ ...data, selectedTopic: topic });
      
      // Then generate content for the selected topic
      const response = await fetch(API_ENDPOINTS.content, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });
      
      if (!response.ok) throw new Error('Failed to generate content');
      
      const { content } = await response.json();
      onUpdate({ ...data, selectedTopic: topic, content });
      
      // Automatically proceed to the next step
      onNext();
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setGeneratingContent(false);
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
            disabled={isRegenerating || !data.selectedTopic}
          >
            {isRegenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </>
            )}
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {data.topics.map((topic) => (
            <Card
              key={topic}
              className={`cursor-pointer transition-colors ${
                data.selectedTopic === topic
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50'
              } ${generatingContent ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => handleTopicSelect(topic)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-center">
                  {generatingContent && data.selectedTopic === topic ? (
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
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back to Titles
          </Button>
        )}
      </div>
    </div>
  );
} 