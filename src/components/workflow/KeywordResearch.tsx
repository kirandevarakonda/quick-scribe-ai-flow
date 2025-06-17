import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_ENDPOINTS, fetchWithConfig } from '@/lib/api';
import { Loader2, Search, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface KeywordResearchProps {
  data: {
    keywords: string[];
    selectedKeyword: string;
  };
  onUpdate: (data: { keywords: string[]; selectedKeyword: string; titles?: string[] }) => void;
  onNext: () => void;
}

export default function KeywordResearch({ data, onUpdate, onNext }: KeywordResearchProps) {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateKeywords = async () => {
    if (!keyword.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetchWithConfig(API_ENDPOINTS.keywords, {
        method: 'POST',
        body: JSON.stringify({ seedKeyword: keyword.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate keywords');
      }

      const result = await response.json();
      onUpdate({ keywords: result.keywords, selectedKeyword: '' });
    } catch (err) {
      setError('Failed to generate keywords. Please try again.');
      console.error('Error generating keywords:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateKeywords = async () => {
    if (!keyword.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetchWithConfig(API_ENDPOINTS.keywords, {
        method: 'POST',
        body: JSON.stringify({ seedKeyword: keyword.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate keywords');
      }

      const result = await response.json();
      onUpdate({ keywords: result.keywords, selectedKeyword: data.selectedKeyword });
    } catch (err) {
      setError('Failed to generate keywords. Please try again.');
      console.error('Error generating keywords:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Return') {
      e.preventDefault();
      handleGenerateKeywords();
    }
  };

  const handleKeywordSelect = async (selectedKeyword: string) => {
    if (isGeneratingTitles) return;
    
    setIsGeneratingTitles(true);
    onUpdate({ keywords: data.keywords, selectedKeyword });
    
    try {
      const response = await fetchWithConfig(API_ENDPOINTS.titles, {
        method: 'POST',
        body: JSON.stringify({ keyword: selectedKeyword }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate titles');
      }

      const result = await response.json();
      onUpdate({ keywords: data.keywords, selectedKeyword, titles: result.titles });
      onNext();
    } catch (err) {
      console.error('Error generating titles:', err);
      setError('Failed to generate titles. Please try again.');
      setIsGeneratingTitles(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <label htmlFor="keyword-input" className="text-sm font-medium text-gray-900">
            Enter a keyword to research
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="keyword-input"
                type="text"
                placeholder="e.g., digital marketing, content strategy..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 h-12 text-base border-gray-300 focus:border-black focus:ring-black"
                disabled={isGeneratingTitles}
              />
            </div>
            <Button 
              onClick={handleGenerateKeywords}
              disabled={isLoading || !keyword.trim() || isGeneratingTitles}
              className="bg-black hover:bg-gray-800 text-white h-12 px-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate
                </>
              )}
            </Button>
          </div>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 mt-2"
            >
              {error}
            </motion.p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {data.keywords.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Generated Keywords</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{data.keywords.length} suggestions</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerateKeywords}
                  disabled={isLoading || !keyword.trim() || isGeneratingTitles}
                  className="h-8 px-3 text-sm hover:bg-gray-50 hover:border-black hover:text-black"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.keywords.map((kw, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant={data.selectedKeyword === kw ? "default" : "outline"}
                    onClick={() => handleKeywordSelect(kw)}
                    disabled={isGeneratingTitles}
                    className={`w-full justify-start h-12 text-base relative ${
                      data.selectedKeyword === kw 
                        ? 'bg-black hover:bg-gray-800 text-white' 
                        : 'hover:bg-gray-50 hover:border-black hover:text-black'
                    } ${isGeneratingTitles ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isGeneratingTitles && data.selectedKeyword === kw ? (
                      <div className="flex items-center justify-center w-full">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating titles...
                      </div>
                    ) : (
                      kw
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 