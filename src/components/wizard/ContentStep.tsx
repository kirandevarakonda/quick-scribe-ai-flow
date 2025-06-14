
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, Copy, Download, RotateCcw } from "lucide-react";
import { generateContent } from "@/utils/api";
import { WizardData } from "../ContentWizard";
import { useToast } from "@/hooks/use-toast";

interface ContentStepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
  onBack: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ContentStep = ({ data, updateData, onBack, isLoading, setIsLoading }: ContentStepProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (data.selectedTopic && !data.content) {
      handleGenerateContent();
    }
  }, [data.selectedTopic]);

  const handleGenerateContent = async () => {
    if (!data.selectedTopic || !data.selectedKeyword) return;
    
    setIsLoading(true);
    try {
      const content = await generateContent(data.selectedTopic, data.selectedKeyword, data.selectedTitle);
      updateData({ content });
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(data.content);
      toast({
        title: "Content Copied",
        description: "The content has been copied to your clipboard.",
      });
    } catch (error) {
      console.error("Failed to copy content:", error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadContent = () => {
    const element = document.createElement("a");
    const file = new Blob([data.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${data.selectedKeyword.replace(/\s+/g, '_')}_content.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download Started",
      description: "Your content file is being downloaded.",
    });
  };

  const getSeoScore = () => {
    if (!data.content || !data.selectedKeyword) return 0;
    
    const content = data.content.toLowerCase();
    const keyword = data.selectedKeyword.toLowerCase();
    
    let score = 0;
    
    // Check if keyword appears in content
    if (content.includes(keyword)) score += 40;
    
    // Check content length (150-250 words ideal for this MVP)
    const wordCount = data.content.split(/\s+/).length;
    if (wordCount >= 100 && wordCount <= 250) score += 30;
    
    // Check if title contains keyword
    if (data.selectedTitle.toLowerCase().includes(keyword)) score += 30;
    
    return Math.min(score, 100);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Creation</h2>
        <p className="text-gray-600">
          Generated content for: <span className="font-semibold text-blue-600">"{data.selectedTopic}"</span>
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">Generating your content...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {data.content && (
            <>
              <Card className="p-6 bg-gray-50 border-2 border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Generated Content</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">SEO Score:</span>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getSeoScore() >= 80 ? "bg-green-100 text-green-800" :
                        getSeoScore() >= 60 ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {getSeoScore()}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none">
                    <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {data.content}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                    <div className="text-sm text-gray-600">
                      Word count: {data.content.split(/\s+/).length} words
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleGenerateContent}
                        variant="outline"
                        size="sm"
                        disabled={isLoading}
                        className="flex items-center space-x-1"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Regenerate</span>
                      </Button>
                      <Button
                        onClick={handleCopyContent}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </Button>
                      <Button
                        onClick={handleDownloadContent}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-1"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </>
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
          </div>
        </div>
      )}
    </div>
  );
};
