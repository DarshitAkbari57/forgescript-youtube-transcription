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
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isClickable = isCompleted && onStepClick;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={`group flex flex-col sm:flex-row items-center gap-3 transition-all duration-500 relative ${
                isActive ? 'scale-110' : ''
              } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div
                className={`size-12 rounded-2xl flex items-center justify-center transition-all duration-700 border-2 relative overflow-hidden ${
                  isActive
                    ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_30px_-5px_oklch(var(--primary))]'
                    : isCompleted
                    ? 'bg-primary/5 border-primary/20 text-primary'
                    : 'bg-white/40 border-white/50 text-muted-foreground/30'
                }`}
              >
                {/* Shimmer effect for active/completed steps */}
                {(isActive || isCompleted) && <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent animate-pulse" />}
                
                {isCompleted ? (
                  <Check className="size-6 stroke-[3px]" />
                ) : (
                  <span className="text-base font-black italic">{index + 1}</span>
                )}
              </div>
              
              <div className="hidden sm:block text-left">
                <p className={`text-[9px] uppercase tracking-[0.3em] font-black transition-all duration-500 ${
                  isActive ? 'text-primary' : 'text-muted-foreground/20'
                }`}>
                  Phase {index + 1}
                </p>
                <p className={`text-xs font-black uppercase tracking-wider transition-all duration-500 ${
                  isActive ? 'text-foreground' : 'text-muted-foreground/40'
                }`}>
                  {step.label}
                </p>
              </div>
            </button>

            {index < steps.length - 1 && (
              <div className="flex-1 mx-8 h-[3px] bg-white/30 rounded-full relative overflow-hidden hidden sm:block">
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-primary/60 to-primary transition-all duration-1000 ease-in-out ${
                    isCompleted ? 'translate-x-0' : '-translate-x-full'
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
