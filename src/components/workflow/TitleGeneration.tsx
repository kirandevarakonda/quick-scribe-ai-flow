import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import { API_ENDPOINTS } from '@/lib/api';

interface TitleGenerationProps {
  data: {
    selectedKeyword: string;
    titles: string[];
    selectedTitle: string;
  };
  onUpdate: (data: { titles: string[]; selectedTitle: string; topics?: string[] }) => void;
  onNext: () => void;
  onBack?: () => void;
}

export default function TitleGeneration({ data, onUpdate, onNext, onBack }: TitleGenerationProps) {
  const [generatingTopics, setGeneratingTopics] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerateTitles = async () => {
    if (!data.selectedTitle) return;
    
    setIsRegenerating(true);
    try {
      const response = await fetch(API_ENDPOINTS.titles, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: data.selectedTitle }),
      });
      
      if (!response.ok) throw new Error('Failed to generate titles');
      
      const { titles } = await response.json();
      onUpdate({ titles, selectedTitle: data.selectedTitle });
    } catch (error) {
      console.error('Error generating titles:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleTitleSelect = async (title: string) => {
    setGeneratingTopics(true);
    try {
      // First update the selected title
      onUpdate({ ...data, selectedTitle: title });
      
      // Then generate topics for the selected title
      const response = await fetch(API_ENDPOINTS.topics, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });
      
      if (!response.ok) throw new Error('Failed to generate topics');
      
      const { topics } = await response.json();
      onUpdate({ ...data, selectedTitle: title, topics });
      
      // Automatically proceed to the next step
      onNext();
    } catch (error) {
      console.error('Error generating topics:', error);
    } finally {
      setGeneratingTopics(false);
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