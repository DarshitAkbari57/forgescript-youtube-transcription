'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
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
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Import Source Video
        </h2>
        <p className="text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">
          Paste a YouTube URL to borrow its <strong>structure</strong> — not its content.
          We&apos;ll analyze the hook style, pacing, and transitions to inspire your new script.
        </p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          YouTube Video URL
        </label>
        <div className="flex gap-3">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 h-12 text-base px-4"
            onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
            disabled={isLoadingTranscript}
          />
          <Button
            onClick={handleFetch}
            disabled={!url.trim() || isLoadingTranscript}
            size="lg"
            className="px-6 h-12 text-sm"
          >
            {isLoadingTranscript ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>

        {transcriptError && (
          <div className="flex items-start gap-2.5 text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{transcriptError}</span>
          </div>
        )}

        {isLoadingTranscript && (
          <div className="text-sm text-muted-foreground bg-card rounded-xl px-4 py-3 border border-border">
            <div className="flex items-center gap-2.5">
              <Sparkles className="size-4 text-primary animate-pulse" />
              Fetching transcript and analyzing video structure — this takes a few seconds...
            </div>
          </div>
        )}

        {state.structuralAnalysis && !isLoadingTranscript && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="size-4 text-primary" />
                Structural Analysis of &ldquo;{state.videoTitle}&rdquo;
              </div>
              {showAnalysis ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            {showAnalysis && (
              <div className="px-5 pb-5 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed border-t border-border pt-4">
                {state.structuralAnalysis}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground/60">Try an example:</p>
        <div className="flex flex-wrap gap-2.5">
          {exampleVideos.map((ex) => (
            <button
              key={ex.label}
              onClick={() => setUrl(ex.url)}
              className="text-sm px-4 py-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-muted-foreground/50 bg-muted/30 rounded-xl px-5 py-4 leading-relaxed">
        Works best with videos that have auto-generated or manual captions. Most popular
        creator channels have captions enabled by default.
      </div>
    </div>
  );
}
