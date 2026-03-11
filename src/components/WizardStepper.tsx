'use client';

import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export function WizardStepper({
  steps,
  currentStep,
  onStepClick,
}: {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isClickable = isCompleted && onStepClick;

        return (
          <div key={step.id} className="flex items-center gap-2 flex-1">
            <button
              type="button"
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all text-left ${
                isActive
                  ? 'bg-primary/15 text-primary'
                  : isCompleted
                    ? 'text-muted-foreground hover:text-foreground cursor-pointer'
                    : 'text-muted-foreground/40 cursor-default'
              }`}
            >
              <span className="shrink-0">{step.icon}</span>
              <div className="min-w-0 hidden sm:block">
                <p className="text-[11px] font-medium uppercase tracking-wider opacity-60">
                  Step {index + 1}
                </p>
                <p className="text-sm font-medium truncate">{step.label}</p>
              </div>
              {isCompleted && (
                <Check className="size-4 text-primary shrink-0" />
              )}
            </button>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-1 ${
                  isCompleted ? 'bg-primary/30' : 'bg-border'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
