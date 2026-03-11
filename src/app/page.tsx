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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 z-0 mesh-gradient opacity-60" />
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] z-0 animate-float" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px] z-0 animate-float-delayed" />
      
      {/* Header */}
      <header className="glass-panel sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="size-12 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <PenTool className="size-6 text-primary-foreground relative z-10" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gradient tracking-tight leading-none mb-1.5 uppercase">ScriptForge</h1>
              <p className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-[0.2em]">Next-Gen AI Scripting</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 sm:px-8 py-16 relative z-10">
        {/* Stepper */}
        <div className="mb-16">
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
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -20 }}
            transition={{ 
              type: "spring", 
              duration: 0.6, 
              bounce: 0.3,
              opacity: { duration: 0.4 }
            }}
            className="glass-card rounded-[3rem] p-10 sm:p-16 relative overflow-hidden"
          >
            {/* Subtle glow effect on card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
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
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-32 relative z-10 bg-white/40 backdrop-blur-xl border-t border-white/20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px] text-muted-foreground/50 tracking-widest uppercase font-bold">
          <div className="flex items-center gap-3">
            <div className="size-2.5 rounded-full bg-primary animate-pulse" />
            <span>ScriptForge &copy; 2026</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="bg-primary/5 text-primary px-4 py-1.5 rounded-full border border-primary/10">
              Private &amp; Secure
            </span>
            <span>Est. London</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
