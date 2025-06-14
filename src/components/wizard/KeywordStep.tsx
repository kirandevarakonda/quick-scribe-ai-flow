
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { generateKeywords } from "@/utils/api";
import { WizardData } from "../ContentWizard";

interface KeywordStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const KeywordStep = ({ data, updateData, onNext, isLoading, setIsLoading }: KeywordStepProps) => {
  const [seedKeyword, setSeedKeyword] = useState(data.seedKeyword);

  const handleGenerateKeywords = async () => {
    if (!seedKeyword.trim()) return;
    
    setIsLoading(true);
    try {
      const keywords = await generateKeywords(seedKeyword);
      updateData({ seedKeyword, keywords, selectedKeyword: "" });
    } catch (error) {
      console.error("Error generating keywords:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectKeyword = (keyword: string) => {
    updateData({ selectedKeyword: keyword });
  };

  const canProceed = data.selectedKeyword && !isLoading;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Keyword Research</h2>
        <p className="text-gray-600">Start by entering a seed keyword to generate related keywords</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="seed-keyword" className="text-sm font-medium text-gray-700">
            Seed Keyword
          </Label>
          <div className="flex space-x-2 mt-1">
            <Input
              id="seed-keyword"
              value={seedKeyword}
              onChange={(e) => setSeedKeyword(e.target.value)}
              placeholder="e.g., digital marketing"
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerateKeywords()}
            />
            <Button 
              onClick={handleGenerateKeywords}
              disabled={!seedKeyword.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {data.keywords.length > 0 && (
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Generated Keywords (Select one)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.keywords.map((keyword, index) => (
                <Card
                  key={index}
                  className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                    data.selectedKeyword === keyword
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleSelectKeyword(keyword)}
                >
                  <div className="text-sm font-medium text-gray-900">{keyword}</div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button 
            onClick={onNext}
            disabled={!canProceed}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
};
