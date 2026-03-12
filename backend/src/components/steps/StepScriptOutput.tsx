'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Copy,
  Check,
  Download,
  Loader2,
  Clock,
  FileText,
  ListOrdered,
  Target,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import type { useScriptWizard } from '@/hooks/useScriptWizard';

function WordCount({ text }: { text: string }) {
  if (!text) return null;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.round(words / 130);
  return (
    <span className="text-sm text-muted-foreground flex items-center gap-1.5">
      <Clock className="size-3.5" />
      ~{words.toLocaleString()} words &middot; {minutes} min speaking time
    </span>
  );
}

function SectionWordCount({ text }: { text: string }) {
  if (!text) return null;
  const words = text.trim().split(/\s+/).length;
  return (
    <span className="text-[10px] text-muted-foreground/60">{words} words</span>
  );
}

const SECTION_COLORS: Record<string, string> = {
  hook: 'border-orange-500/30 text-orange-400 bg-orange-500/10',
  intro: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
  main: 'border-border text-muted-foreground',
  cta: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  outro: 'border-pink-500/30 text-pink-400 bg-pink-500/10',
};

interface Props {
  wizard: ReturnType<typeof useScriptWizard>;
  onBack: () => void;
}

export function StepScriptOutput({ wizard, onBack }: Props) {
  const { state, refineScript, resetWizard } = wizard;
  const { generatedScript, isGenerating, streamedContent } = state;
  const [activeTab, setActiveTab] = useState<'full' | 'outline' | 'meta'>('full');
  const [refineInput, setRefineInput] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRefine = async () => {
    if (!refineInput.trim()) return;
    setIsRefining(true);
    await refineScript(refineInput);
    setRefineInput('');
    setIsRefining(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript?.fullScript || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedScript) return;
    const content = [
      `Title: ${generatedScript.suggestedTitle}`,
      `Estimated Duration: ${generatedScript.estimatedDuration}`,
      `Thumbnail Idea: ${generatedScript.suggestedThumbnailIdea}`,
      '',
      '---',
      '',
      generatedScript.fullScript,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedScript.suggestedTitle.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 50)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isGenerating && !generatedScript) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Loader2 className="size-5 animate-spin text-primary" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">Generating your script...</h2>
            <p className="text-sm text-muted-foreground">
              This usually takes 15-30 seconds. The AI is crafting your script in real time.
            </p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 max-h-[60vh] overflow-y-auto">
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
            {streamedContent}
            <span className="inline-block w-2 h-4 bg-primary/60 animate-pulse ml-0.5" />
          </pre>
        </div>
      </div>
    );
  }

  if (!generatedScript) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">No script generated yet.</p>
        <Button variant="ghost" onClick={onBack} className="mt-4">
          <ArrowLeft className="size-4" />
          Go back and generate
        </Button>
      </div>
    );
  }

  const TABS = [
    { id: 'full' as const, label: 'Full Script', icon: <FileText className="size-4" /> },
    { id: 'outline' as const, label: 'Outline', icon: <ListOrdered className="size-4" /> },
    { id: 'meta' as const, label: 'Metadata', icon: <Target className="size-4" /> },
  ];

  const quickRefines = ['Make it punchier', 'Add more examples', 'Stronger CTA', 'More casual tone', 'Shorten it'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground leading-tight">
            {generatedScript.suggestedTitle}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-2.5">
            <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {generatedScript.estimatedDuration}
            </span>
            <WordCount text={generatedScript.fullScript} />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" onClick={handleCopy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="size-4" />
            Download
          </Button>
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="size-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1.5 rounded-xl">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary/15 text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {activeTab === 'full' && (
          <div className="p-5 max-h-[50vh] overflow-y-auto">
            <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed font-[inherit]">
              {generatedScript.fullScript}
            </div>
          </div>
        )}

        {activeTab === 'outline' && (
          <div className="divide-y divide-border">
            {generatedScript.outline?.map((section, i) => (
              <div key={i} className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wider ${
                        SECTION_COLORS[section.type] || SECTION_COLORS.main
                      }`}
                    >
                      {section.type}
                    </span>
                    <span className="text-sm font-medium text-foreground truncate">
                      {section.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <SectionWordCount text={section.content} />
                    <span className="text-[10px] text-muted-foreground/50">
                      {section.durationEstimate}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'meta' && (
          <div className="p-5 space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Suggested Title
              </p>
              <p className="text-sm text-foreground mt-0.5">{generatedScript.suggestedTitle}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Thumbnail Idea
              </p>
              <p className="text-sm text-foreground mt-0.5">
                {generatedScript.suggestedThumbnailIdea}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Estimated Duration
              </p>
              <p className="text-sm text-foreground mt-0.5">{generatedScript.estimatedDuration}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Hook Preview
              </p>
              <blockquote className="text-sm text-foreground/80 mt-1 pl-3 border-l-2 border-primary/30 italic">
                &ldquo;{generatedScript.hook}&rdquo;
              </blockquote>
            </div>
          </div>
        )}
      </div>

      {/* Refine Panel */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="size-4 text-primary" />
            <span className="text-base font-medium text-foreground">Refine with AI</span>
          </div>
          <button
            onClick={resetWizard}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="size-3.5" />
            Start Over
          </button>
        </div>
        <Textarea
          value={refineInput}
          onChange={(e) => setRefineInput(e.target.value)}
          placeholder='e.g. "Make the hook more dramatic", "Add more humor", "Shorten the intro"'
          className="min-h-[70px] text-base px-4 py-3"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleRefine();
          }}
        />
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {quickRefines.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setRefineInput(suggestion)}
                className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <Button
            onClick={handleRefine}
            disabled={!refineInput.trim() || isRefining}
            className="shrink-0"
          >
            {isRefining ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Refining...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Refine
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
