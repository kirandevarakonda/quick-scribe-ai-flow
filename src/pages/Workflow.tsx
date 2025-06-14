import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from 'lucide-react';
import KeywordResearch from '@/components/workflow/KeywordResearch';
import TitleGeneration from '@/components/workflow/TitleGeneration';
import TopicSelection from '@/components/workflow/TopicSelection';
import ContentCreation from '@/components/workflow/ContentCreation';
import { Header } from '@/components/Header';

const STEPS = [
  { id: 1, title: 'Keyword Research' },
  { id: 2, title: 'Title Generation' },
  { id: 3, title: 'Topic Selection' },
  { id: 4, title: 'Content Creation' }
];

export default function Workflow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState({
    keywords: [],
    selectedKeyword: '',
    titles: [],
    selectedTitle: '',
    topics: [],
    selectedTopic: '',
    content: ''
  });

  const handleUpdate = (updates: any) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/');
    }
  };

  const totalSteps = STEPS.length;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-black">
                  {STEPS[currentStep - 1].title}
                </span>
                <span className="text-sm text-gray-500">
                  ({currentStep} of {totalSteps})
                </span>
              </div>
              <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="relative">
              {/* Background Line */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2" />
              
              {/* Progress Line */}
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-black -translate-y-1/2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />

              {/* Steps */}
              <div className="relative flex justify-between">
                {STEPS.map((step, index) => {
                  const isCompleted = index + 1 < currentStep;
                  const isCurrent = index + 1 === currentStep;
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      {/* Step Dot */}
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-black text-white' 
                            : isCurrent 
                              ? 'bg-black text-white ring-4 ring-black/10' 
                              : 'bg-white border-2 border-gray-200 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-sm font-medium">{step.id}</span>
                        )}
                      </div>
                      
                      {/* Step Title */}
                      <div 
                        className={`text-sm font-medium text-center max-w-[120px] ${
                          isCompleted || isCurrent ? 'text-black' : 'text-gray-400'
                        }`}
                      >
                        {step.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6 text-gray-600 hover:text-black"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {/* Main Content */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                {STEPS[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && (
                <KeywordResearch
                  data={data}
                  onUpdate={handleUpdate}
                  onNext={() => setCurrentStep(2)}
                />
              )}
              {currentStep === 2 && (
                <TitleGeneration
                  data={data}
                  onUpdate={handleUpdate}
                  onNext={() => setCurrentStep(3)}
                />
              )}
              {currentStep === 3 && (
                <TopicSelection
                  data={data}
                  onUpdate={handleUpdate}
                  onNext={() => setCurrentStep(4)}
                />
              )}
              {currentStep === 4 && (
                <ContentCreation data={data} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 