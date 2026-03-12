'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowRight, Sparkles, ChevronDown, CheckCircle2, History, Timer, BarChart3, Layout, MessageSquare } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { useScriptWizard } from '@/hooks/useScriptWizard';

interface Props {
  wizard: ReturnType<typeof useScriptWizard>;
  onNext: () => void;
}

export function StepSourceVideo({ wizard, onNext }: Props) {
  const { state, updateState, fetchTranscript, isLoadingTranscript, transcriptError } = wizard;
  const [url, setUrl] = useState(state.youtubeUrl || '');
  const [showAnalysis, setShowAnalysis] = useState(true);

  const handleFetch = async () => {
    if (!url.trim()) return;
    updateState({ youtubeUrl: url });
    const data = await fetchTranscript(url);
    // If we have a transcript but deep analysis failed/is missing, auto-proceed
    if (data && !data.deepAnalysis) {
      onNext();
    }
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
          Video Intelligence
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed font-medium">
          Paste a YouTube URL to extract its structural DNA. We analyze hooks, narrative arcs, and pacing to reverse-engineer success.
        </p>
      </div>

      <div className="space-y-6">
        <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] ml-1">
          Target Video URL
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
                Processing...
              </>
            ) : (
              <>
                Analyze Structure
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

        {/* Fallback Continue Button if analysis is missing but transcript exists */}
        {state.transcript && !state.deepAnalysis && !isLoadingTranscript && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-6">
            <Button 
              onClick={onNext}
              className="h-20 rounded-[2rem] px-12 text-lg font-black uppercase tracking-wider shadow-2xl shadow-primary/20"
            >
              Continue to Strategy
              <ArrowRight className="size-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {state.deepAnalysis && !isLoadingTranscript && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="size-5" />
              <span className="text-sm font-black uppercase tracking-widest">Intelligence Report Ready</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Analysis Panel */}
              <Card className="md:col-span-2 p-8 rounded-[2.5rem] bg-white/5 border-white/10 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black">Source Video Analysis</h3>
                  <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <History className="size-3" />
                    Structural DNA
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    { label: 'Hook', data: state.deepAnalysis?.hook, icon: <Sparkles className="size-4" /> },
                    { label: 'Setup', data: state.deepAnalysis?.setup, icon: <Layout className="size-4" /> },
                    { label: 'Story', data: state.deepAnalysis?.story, icon: <History className="size-4" /> },
                    { label: 'Insight', data: state.deepAnalysis?.insight, icon: <Sparkles className="size-4" /> },
                    { label: 'CTA', data: state.deepAnalysis?.cta, icon: <MessageSquare className="size-4" /> },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="shrink-0 w-32">
                        <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                          {item.icon}
                          {item.label}
                        </div>
                        {item.data?.timestamp && (
                          <div className="text-xs font-bold text-primary font-mono bg-primary/5 px-2 py-1 rounded-md inline-block">
                            {item.data.timestamp}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 pb-4 border-b border-white/5">
                        <p className="text-sm font-medium leading-relaxed text-foreground/80 group-hover:text-foreground transition-colors">
                          {item.data?.description || 'Analysis pending...'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Sidebar Metrics */}
              <div className="space-y-6">
                <Card className="p-6 rounded-[2rem] bg-white/5 border-white/10 space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Timer className="size-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Pacing</span>
                  </div>
                  <p className="text-sm font-bold leading-tight">
                    {state.deepAnalysis.pacing}
                  </p>
                </Card>

                <Card className="p-6 rounded-[2rem] bg-white/5 border-white/10 space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <BarChart3 className="size-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Key Moments</span>
                  </div>
                  <div className="space-y-3">
                    {state.deepAnalysis.keyMoments.map((m, i) => (
                      <div key={i} className="flex gap-3 items-start group">
                        <span className="text-[10px] font-mono font-bold text-primary mt-0.5">{m.timestamp}</span>
                        <p className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Button 
                  onClick={onNext}
                  className="w-full h-20 rounded-[2rem] text-lg font-black uppercase tracking-wider shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                >
                  Proceed to Strategy
                  <ArrowRight className="size-5 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="space-y-4 pt-12">
        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] ml-1">Select structural pattern</p>
        <div className="flex flex-wrap gap-3">
          {exampleVideos.map((ex) => (
            <button
              key={ex.label}
              onClick={() => { setUrl(ex.url); handleFetch(); }}
              className="text-xs font-bold px-6 py-2.5 rounded-full border border-border/50 text-muted-foreground bg-white/30 hover:bg-white hover:text-primary hover:border-primary/30 hover:shadow-md transition-all"
            >
              {ex.label} Pattern
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
