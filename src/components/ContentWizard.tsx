
import { useState } from "react";
import { KeywordStep } from "./wizard/KeywordStep";
import { TitleStep } from "./wizard/TitleStep";
import { TopicStep } from "./wizard/TopicStep";
import { ContentStep } from "./wizard/ContentStep";
import { WizardNavigation } from "./wizard/WizardNavigation";

export interface WizardData {
  seedKeyword: string;
  keywords: string[];
  selectedKeyword: string;
  titles: string[];
  selectedTitle: string;
  topics: string[];
  selectedTopic: string;
  content: string;
}

const initialData: WizardData = {
  seedKeyword: "",
  keywords: [],
  selectedKeyword: "",
  titles: [],
  selectedTitle: "",
  topics: [],
  selectedTopic: "",
  content: ""
};

export const ContentWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const updateData = (updates: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const steps = [
    { id: 1, title: "Keyword Research", description: "Enter your seed keyword" },
    { id: 2, title: "Title Generation", description: "Choose your title" },
    { id: 3, title: "Topic Selection", description: "Select your topic" },
    { id: 4, title: "Content Creation", description: "Generate content" }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <KeywordStep
            data={data}
            updateData={updateData}
            onNext={() => setCurrentStep(2)}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      case 2:
        return (
          <TitleStep
            data={data}
            updateData={updateData}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      case 3:
        return (
          <TopicStep
            data={data}
            updateData={updateData}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      case 4:
        return (
          <ContentStep
            data={data}
            updateData={updateData}
            onBack={() => setCurrentStep(3)}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <WizardNavigation steps={steps} currentStep={currentStep} />
      <div className="min-h-[400px]">
        {renderStep()}
      </div>
    </div>
  );
};
