import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import { API_ENDPOINTS } from '@/lib/api';

interface TitleGenerationProps {
  data: {
    selectedKeyword: string;
    titles: string[];
    selectedTitle?: string;
    keywords: string[];
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function TitleGeneration({ data, onUpdate, onNext, onBack }: TitleGenerationProps) {
  const [generatingTopics, setGeneratingTopics] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegenerateTitles = async () => {
    if (isRegenerating) return;
    setIsRegenerating(true);
    setError(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.titles, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic: data.selectedKeyword,
          keywords: data.keywords 
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to regenerate titles');
      }

      if (!responseData.titles || !Array.isArray(responseData.titles)) {
        throw new Error('Invalid response format from server');
      }

      onUpdate({ ...data, titles: responseData.titles, selectedTitle: undefined });
    } catch (err) {
      console.error('Error regenerating titles:', err);
      setError(err.message || 'Failed to regenerate titles. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleTitleSelect = async (selectedTitle: string) => {
    if (isGeneratingTopics) return;
    
    setIsGeneratingTopics(true);
    setError(null);
    onUpdate({ ...data, selectedTitle });
    
    try {
      const response = await fetch(API_ENDPOINTS.topics, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: selectedTitle,
          keywords: data.keywords 
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to generate topics');
      }

      if (!responseData.topics || !Array.isArray(responseData.topics)) {
        throw new Error('Invalid response format from server');
      }

      onUpdate({ ...data, selectedTitle, topics: responseData.topics });
      onNext();
    } catch (err) {
      console.error('Error generating topics:', err);
      setError(err.message || 'Failed to generate topics. Please try again.');
      setIsGeneratingTopics(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Select a title for: {data.selectedKeyword}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerateTitles}
            disabled={isRegenerating || !data.selectedTitle}
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
          {data.titles.map((title) => (
            <Card
              key={title}
              className={`cursor-pointer transition-colors ${
                data.selectedTitle === title
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50'
              } ${generatingTopics ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => handleTitleSelect(title)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-center">
                  {generatingTopics && data.selectedTitle === title ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Generating topics...</span>
                    </>
                  ) : (
                    <p className="text-center">{title}</p>
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
            Back to Keywords
          </Button>
        )}
      </div>
    </div>
  );
} 