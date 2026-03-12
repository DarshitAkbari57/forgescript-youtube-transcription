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

        {state.deepAnalysis && !isLoadingTranscript && (
          <div className="space-y-6">
            <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/50 overflow-hidden shadow-xl shadow-primary/5">
              <div className="px-8 py-6 border-b border-white/50 bg-white/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Sparkles className="size-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Source Video Analysis</h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Reverse-Engineered DNA</p>
                  </div>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-black uppercase tracking-widest text-primary">
                  {state.videoMetadata?.channelName}
                </div>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {[
                    { label: 'Hook', data: state.deepAnalysis.hook },
                    { label: 'Setup', data: state.deepAnalysis.setup },
                    { label: 'Story', data: state.deepAnalysis.story },
                    { label: 'Insight', data: state.deepAnalysis.insight },
                    { label: 'CTA', data: state.deepAnalysis.cta },
                  ].map((item) => (
                    <div key={item.label} className="relative pl-6 border-l-2 border-primary/20 group hover:border-primary transition-colors">
                      <div className="absolute left-[-5px] top-0 size-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-black uppercase tracking-widest text-primary">{item.label}</span>
                        <span className="text-[10px] font-bold text-muted-foreground bg-primary/5 px-2 py-0.5 rounded text-mono">{item.data.timestamp}</span>
                      </div>
                      <p className="text-xs font-medium text-foreground/70 leading-relaxed">
                        {item.data.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Pacing & Flow</h4>
                    <div className="p-5 rounded-2xl bg-white/50 border border-white/80 text-xs font-semibold leading-relaxed text-foreground/80 italic shadow-inner">
                      &ldquo;{state.deepAnalysis.pacing}&rdquo;
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Key Retention Moments</h4>
                    <div className="space-y-3">
                      {state.deepAnalysis.keyMoments.map((moment, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-primary/5 border border-primary/10 group hover:bg-primary/10 transition-colors">
                          <span className="text-[10px] font-black text-primary px-2 py-1 bg-white rounded-lg shadow-sm">{moment.timestamp}</span>
                          <span className="text-xs font-bold text-foreground/80">{moment.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-5 bg-primary/5 border-t border-white/50 flex justify-end">
                <Button 
                  onClick={onNext}
                  className="rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90 px-8"
                >
                  Confirm & Continue
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </div>
            </div>
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
