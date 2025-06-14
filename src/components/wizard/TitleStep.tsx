
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { generateTitles } from "@/utils/api";
import { WizardData } from "../ContentWizard";

interface TitleStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const TitleStep = ({ data, updateData, onNext, onBack, isLoading, setIsLoading }: TitleStepProps) => {
  useEffect(() => {
    if (data.selectedKeyword && data.titles.length === 0) {
      handleGenerateTitles();
    }
  }, [data.selectedKeyword]);

  const handleGenerateTitles = async () => {
    if (!data.selectedKeyword) return;
    
    setIsLoading(true);
    try {
      const titles = await generateTitles(data.selectedKeyword);
      updateData({ titles, selectedTitle: "" });
    } catch (error) {
      console.error("Error generating titles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTitle = (title: string) => {
    updateData({ selectedTitle: title });
  };

  const canProceed = data.selectedTitle && !isLoading;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Title Generation</h2>
        <p className="text-gray-600">
          SEO-optimized titles for: <span className="font-semibold text-blue-600">"{data.selectedKeyword}"</span>
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">Generating SEO-optimized titles...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {data.titles.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Generated Titles (Select one)
              </Label>
              <div className="space-y-3">
                {data.titles.map((title, index) => (
                  <Card
                    key={index}
                    className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                      data.selectedTitle === title
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleSelectTitle(title)}
                  >
                    <div className="text-sm font-medium text-gray-900 leading-relaxed">{title}</div>
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
