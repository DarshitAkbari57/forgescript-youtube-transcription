'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { VOICE_PRESETS } from '@/lib/voicePresets';
import type { useScriptWizard } from '@/hooks/useScriptWizard';

const TONE_OPTIONS = [
  'Casual', 'Professional', 'Energetic', 'Calm', 'Humorous', 'Serious',
  'Inspiring', 'Educational', 'Conversational', 'Authoritative', 'Storytelling', 'Data-driven',
];

interface Props {
  wizard: ReturnType<typeof useScriptWizard>;
  onGenerate: () => void;
  onBack: () => void;
}

export function StepChannelVoice({ wizard, onGenerate, onBack }: Props) {
  const { state, updateState } = wizard;

  const selectPreset = (preset: (typeof VOICE_PRESETS)[number]) => {
    if (preset.id === 'custom') {
      updateState({ voicePresetId: 'custom', toneKeywords: [], voiceDescription: '' });
      return;
    }
    updateState({
      voicePresetId: preset.id,
      toneKeywords: preset.toneKeywords,
      voiceDescription: preset.voiceDescription,
    });
  };

  const toggleTone = (tone: string) => {
    const tones = state.toneKeywords || [];
    updateState({
      toneKeywords: tones.includes(tone)
        ? tones.filter((t) => t !== tone)
        : [...tones, tone],
    });
  };

  const canProceed = state.channelName.trim() && state.voiceDescription.trim();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Define Your Voice
        </h2>
        <p className="text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">
          How does your channel sound? The more detail, the more the script feels like <em>you</em>.
        </p>
      </div>

      {/* Voice Presets */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Start with a preset
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {VOICE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => selectPreset(preset)}
              className={`p-4 rounded-xl border text-left transition-all ${
                state.voicePresetId === preset.id
                  ? 'border-primary/50 bg-primary/10 text-foreground'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80'
              }`}
            >
              <span className="text-xl">{preset.icon}</span>
              <p className="text-sm font-medium mt-1.5">{preset.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Channel Name <span className="text-primary">*</span>
          </label>
          <Input
            value={state.channelName}
            onChange={(e) => updateState({ channelName: e.target.value })}
            placeholder="e.g. MyChannel"
            className="h-12 text-base px-4"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Voice & Style Description <span className="text-primary">*</span>
          </label>
          <Textarea
            value={state.voiceDescription}
            onChange={(e) => updateState({ voiceDescription: e.target.value })}
            placeholder='Describe how you sound on camera. e.g. "Casual but informative, like a knowledgeable friend. I use a lot of analogies and personal stories. Sentences are short and punchy."'
            className="min-h-[120px] text-base px-4 py-3"
          />
        </div>

        <div className="space-y-2.5">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Tone Keywords
          </label>
          <div className="flex flex-wrap gap-2">
            {TONE_OPTIONS.map((tone) => (
              <button
                key={tone}
                onClick={() => toggleTone(tone)}
                className={`px-4 py-2 rounded-full text-sm border transition-all ${
                  (state.toneKeywords || []).includes(tone)
                    ? 'border-primary/50 bg-primary/15 text-primary'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Signature Phrases or Openers
          </label>
          <Input
            value={state.examplePhrases}
            onChange={(e) => updateState({ examplePhrases: e.target.value })}
            placeholder={`e.g. "Here's the thing nobody tells you...", "Let me break this down..."`}
            className="h-12 text-base px-4"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" size="lg" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button onClick={onGenerate} disabled={!canProceed} size="lg" className="px-6">
          <Sparkles className="size-4" />
          Generate Script
        </Button>
      </div>
    </div>
  );
}
