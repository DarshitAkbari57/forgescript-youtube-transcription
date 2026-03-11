'use client';

import { useScriptWizard } from '@/hooks/useScriptWizard';
import { WizardStepper } from '@/components/WizardStepper';
import { StepSourceVideo } from '@/components/steps/StepSourceVideo';
import { StepVideoIdea } from '@/components/steps/StepVideoIdea';
import { StepChannelVoice } from '@/components/steps/StepChannelVoice';
import { StepScriptOutput } from '@/components/steps/StepScriptOutput';
import { AnimatePresence, motion } from 'framer-motion';
import { Video, Lightbulb, Mic, PenTool } from 'lucide-react';

const STEPS = [
  { id: 'source', label: 'Source Video', icon: <Video className="size-4" /> },
  { id: 'idea', label: 'Your Idea', icon: <Lightbulb className="size-4" /> },
  { id: 'voice', label: 'Channel Voice', icon: <Mic className="size-4" /> },
  { id: 'script', label: 'Script', icon: <PenTool className="size-4" /> },
];

export default function Home() {
  const wizard = useScriptWizard();
  const { currentStep, setCurrentStep, hydrated } = wizard;

  const handleGenerate = () => {
    setCurrentStep(3);
    wizard.generateScript(wizard.state);
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <PenTool className="size-4.5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground tracking-tight">ScriptForge</h1>
              <p className="text-xs text-muted-foreground">AI Script Generator</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground/40 hidden sm:block">
            Powered by Claude
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
        {/* Stepper */}
        <div className="mb-8">
          <WizardStepper
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step < currentStep) setCurrentStep(step);
            }}
          />
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 0 && (
              <StepSourceVideo
                wizard={wizard}
                onNext={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 1 && (
              <StepVideoIdea
                wizard={wizard}
                onNext={() => setCurrentStep(2)}
                onBack={() => setCurrentStep(0)}
              />
            )}
            {currentStep === 2 && (
              <StepChannelVoice
                wizard={wizard}
                onGenerate={handleGenerate}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && (
              <StepScriptOutput
                wizard={wizard}
                onBack={() => setCurrentStep(2)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between text-xs text-muted-foreground/40">
          <span>ScriptForge &mdash; YouTube AI Scriptwriter</span>
          <span>Your data stays in your browser</span>
        </div>
      </footer>
    </div>
  );
}
