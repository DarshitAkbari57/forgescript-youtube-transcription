'use client';

import { useScriptWizard } from '@/hooks/useScriptWizard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListChecks, RefreshCcw, Check, ChevronRight, ChevronLeft, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface StepScriptOutlineProps {
  wizard: ReturnType<typeof useScriptWizard>;
  onNext: () => void;
  onBack: () => void;
}

export function StepScriptOutline({ wizard, onNext, onBack }: StepScriptOutlineProps) {
  const { state, updateState, generateOutline, isLoadingOutline } = wizard;
  const [isEditing, setIsEditing] = useState(false);

  const handleGenerate = async () => {
    await generateOutline(state);
  };

  const outline = state.scriptOutline?.outline || [];

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-gradient mb-3">Script Outline</h2>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium">
            Review and refine your video's narrative structure before we write the full script.
          </p>
        </div>
        <div className="hidden sm:block">
          <div className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center">
            <ListChecks className="size-8 text-primary" />
          </div>
        </div>
      </div>

      {!state.scriptOutline && !isLoadingOutline ? (
        <Card className="p-12 border-dashed border-2 bg-white/5 flex flex-col items-center justify-center text-center gap-6 rounded-[2.5rem]">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
            <RefreshCcw className="size-8 text-primary animate-spin-slow" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Ready to structure?</h3>
            <p className="text-muted-foreground max-w-sm">
              We'll use your video ideas and structural inspiration to build a viral outline.
            </p>
          </div>
          <Button 
            onClick={handleGenerate} 
            size="lg" 
            className="rounded-full px-12 py-7 text-lg font-bold shadow-xl shadow-primary/20"
          >
            Generate Outline
          </Button>
        </Card>
      ) : isLoadingOutline ? (
        <Card className="p-12 bg-white/5 flex flex-col items-center justify-center text-center gap-6 rounded-[2.5rem]">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Engineering your outline...</h3>
            <p className="text-muted-foreground">Mapping out the narrative arc and key moments.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outline.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={item.step}
                className="group glass-card p-6 rounded-[2rem] border border-white/10 hover:border-primary/30 transition-all"
              >
                <div className="flex gap-4">
                  <span className="shrink-0 size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 py-4">
            <Button
              variant="outline"
              onClick={handleGenerate}
              className="rounded-full px-6 py-6 border-white/10 hover:bg-white/5"
            >
              <RefreshCcw className="size-4 mr-2" />
              Regenerate
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-full px-6 py-6 border-white/10 hover:bg-white/5"
            >
              <Edit3 className="size-4 mr-2" />
              {isEditing ? 'Save Outline' : 'Edit Outline'}
            </Button>
            <Button
              onClick={onNext}
              className="rounded-full px-12 py-6 bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 font-bold"
            >
              <Check className="size-4 mr-2" />
              Approve & Continue
            </Button>
          </div>
        </div>
      )}

      <div className="pt-8 border-t border-white/5 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="rounded-full px-8 py-6 font-bold text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={!state.scriptOutline}
          className="rounded-full px-12 py-6 text-lg font-bold shadow-xl shadow-primary/20"
        >
          Continue
          <ChevronRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
