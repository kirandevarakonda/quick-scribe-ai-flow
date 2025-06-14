
import { CheckCircle, Circle } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface WizardNavigationProps {
  steps: Step[];
  currentStep: number;
}

export const WizardNavigation = ({ steps, currentStep }: WizardNavigationProps) => {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex items-center space-x-3">
            <div className={`flex-shrink-0 ${
              step.id < currentStep
                ? "text-green-600"
                : step.id === currentStep
                ? "text-blue-600"
                : "text-gray-400"
            }`}>
              {step.id < currentStep ? (
                <CheckCircle className="h-8 w-8" />
              ) : (
                <Circle className="h-8 w-8" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-medium ${
                step.id <= currentStep ? "text-gray-900" : "text-gray-500"
              }`}>
                {step.title}
              </h3>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-px mx-4 ${
              step.id < currentStep ? "bg-green-600" : "bg-gray-300"
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};
