'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { useScriptWizard } from '@/hooks/useScriptWizard';

interface Props {
  wizard: ReturnType<typeof useScriptWizard>;
  onNext: () => void;
}

export function StepSourceVideo({ wizard, onNext }: Props) {
  const { state, updateState, fetchTranscript, isLoadingTranscript, transcriptError } = wizard;
  const [url, setUrl] = useState(state.youtubeUrl || '');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleFetch = async () => {
    if (!url.trim()) return;
    updateState({ youtubeUrl: url });
    const success = await fetchTranscript(url);
    if (success) onNext();
  };

  const exampleVideos = [
    { label: 'Veritasium', url: 'https://www.youtube.com/watch?v=HeQX2HjkcNo' },
    { label: 'Ali Abdaal', url: 'https://www.youtube.com/watch?v=lIW5jBrrsS0' },
    { label: 'Fireship', url: 'https://www.youtube.com/watch?v=r-98YRAF1dY' },
  ];

  return (
    <div className="space-y-12">
      <div className="relative">
        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
        <h2 className="text-4xl font-black tracking-tight text-foreground mb-4">
          Import Source Video
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed font-medium">
          Paste a YouTube URL to borrow its <span className="text-primary font-bold italic">structure</span> — not its content.
          Analyze hook style, pacing, and transitions.
        </p>
      </div>

      <div className="space-y-6">
        <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] ml-1">
          YouTube Video URL
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-lg transition-opacity opacity-0 group-focus-within:opacity-100" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="relative z-10 w-full h-16 text-lg px-6 rounded-2xl border-2 border-border/50 bg-white/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30"
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              disabled={isLoadingTranscript}
            />
          </div>
          <Button
            onClick={handleFetch}
            disabled={!url.trim() || isLoadingTranscript}
            size="lg"
            className={`h-16 px-10 text-base font-bold rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] ${!isLoadingTranscript ? 'shimmer' : ''}`}
          >
            {isLoadingTranscript ? (
              <>
                <Loader2 className="size-5 animate-spin mr-2" />
                Analyzing
              </>
            ) : (
              <>
                Analyze Video
                <ArrowRight className="size-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {transcriptError && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-sm font-semibold text-destructive bg-destructive/5 border border-destructive/10 rounded-2xl px-6 py-4"
          >
            <span className="text-lg">✕</span>
            <span>{transcriptError}</span>
          </motion.div>
        )}

        {isLoadingTranscript && (
          <div className="bg-primary/5 rounded-2xl px-6 py-5 border border-primary/10 shimmer">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="size-5 text-primary animate-pulse" />
              </div>
              <p className="text-sm font-bold text-primary/80 tracking-wide uppercase">
                Reverse-engineering video DNA...
              </p>
            </div>
          </div>
        )}

        {state.structuralAnalysis && !isLoadingTranscript && (
          <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="w-full flex items-center justify-between px-6 py-5 text-sm font-bold text-foreground hover:bg-white/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="size-5 text-primary" />
                <span>Extracted Structure: &ldquo;{state.videoTitle}&rdquo;</span>
              </div>
              <div className={`transition-transform duration-300 ${showAnalysis ? 'rotate-180' : ''}`}>
                <ChevronDown className="size-5 opacity-40" />
              </div>
            </button>
            <AnimatePresence>
              {showAnalysis && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-8 text-sm text-foreground/70 whitespace-pre-wrap leading-relaxed border-t border-white/50 pt-6 italic">
                    {state.structuralAnalysis}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] ml-1">Try an example</p>
        <div className="flex flex-wrap gap-3">
          {exampleVideos.map((ex) => (
            <button
              key={ex.label}
              onClick={() => setUrl(ex.url)}
              className="text-xs font-bold px-6 py-2.5 rounded-full border border-border/50 text-muted-foreground bg-white/30 hover:bg-white hover:text-primary hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all outline-none focus:ring-2 focus:ring-primary/20"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs font-medium text-muted-foreground/40 bg-white/20 border border-white/40 rounded-3xl px-8 py-6 leading-relaxed">
        <strong className="text-foreground/30 uppercase tracking-widest block mb-1">Compatibility</strong>
        Works best with videos that have auto-generated or manual captions. Most popular
        creator channels have captions enabled by default.
      </div>
    </div>
  );
}
