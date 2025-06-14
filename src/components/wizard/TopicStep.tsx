
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { generateTopics } from "@/utils/api";
import { WizardData } from "../ContentWizard";

interface TopicStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const TopicStep = ({ data, updateData, onNext, onBack, isLoading, setIsLoading }: TopicStepProps) => {
  useEffect(() => {
    if (data.selectedTitle && data.topics.length === 0) {
      handleGenerateTopics();
    }
  }, [data.selectedTitle]);

  const handleGenerateTopics = async () => {
    if (!data.selectedTitle) return;
    
    setIsLoading(true);
    try {
      const topics = await generateTopics(data.selectedTitle, data.selectedKeyword);
      updateData({ topics, selectedTopic: "" });
    } catch (error) {
      console.error("Error generating topics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTopic = (topic: string) => {
    updateData({ selectedTopic: topic });
  };

  const canProceed = data.selectedTopic && !isLoading;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Topic Selection</h2>
        <p className="text-gray-600">
          Content topics for: <span className="font-semibold text-blue-600">"{data.selectedTitle}"</span>
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">Generating content topics...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {data.topics.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Generated Topics (Select one)
              </Label>
              <div className="space-y-3">
                {data.topics.map((topic, index) => (
                  <Card
                    key={index}
                    className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                      data.selectedTopic === topic
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleSelectTopic(topic)}
                  >
                    <div className="text-sm font-medium text-gray-900 leading-relaxed">{topic}</div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button 
              onClick={onBack}
              variant="outline"
              className="flex items-center space-x-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <Button 
              onClick={onNext}
              disabled={!canProceed}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              Next Step
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
