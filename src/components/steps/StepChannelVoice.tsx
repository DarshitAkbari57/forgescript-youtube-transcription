'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Sparkles, Mic2, Star, MessageSquareCode, Radio, Ghost, User, Wand2 } from 'lucide-react';
import { VOICE_PRESETS } from '@/lib/voicePresets';
import type { useScriptWizard } from '@/hooks/useScriptWizard';
import { motion } from 'framer-motion';

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
    <div className="space-y-12">
      <div className="relative">
        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
        <h2 className="text-4xl font-black tracking-tight text-foreground mb-4">
          Channel Sound Signature
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed font-medium">
          Define the frequency of your voice. We&apos;ll match your unique style, vocabulary, and delivery patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-4">
            <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <User className="size-3" /> Identity
            </label>
            <Input
              value={state.channelName}
              onChange={(e) => updateState({ channelName: e.target.value })}
              placeholder="Your Channel Name"
              className="h-16 text-lg px-6 rounded-2xl border-2 border-border/50 bg-white/50 focus:border-primary shadow-sm"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <Radio className="size-3" /> Voice & Narrative Style
            </label>
            <Textarea
              value={state.voiceDescription}
              onChange={(e) => updateState({ voiceDescription: e.target.value })}
              placeholder='Explain your delivery. "Hyper-fast, conversational fireship style with heavy sarcasm and obscure tech references."'
              className="min-h-[160px] p-6 rounded-[2rem] border-2 border-border/50 focus:border-primary resize-none text-base font-medium leading-relaxed"
            />
          </div>

          <div className="space-y-4">
             <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <Star className="size-3" /> Signature Hooks
            </label>
            <Input
              value={state.examplePhrases}
              onChange={(e) => updateState({ examplePhrases: e.target.value })}
              placeholder='e.g. "Yo, what is up guys...", "Wait, let me explain why that&apos;s a lie"'
              className="h-16 text-lg px-6 rounded-2xl border-2 border-border/50 bg-white/50 focus:border-primary shadow-sm"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] ml-1">Tone Architecture</label>
            <div className="flex flex-wrap gap-2">
              {TONE_OPTIONS.map((tone) => (
                <button
                  key={tone}
                  onClick={() => toggleTone(tone)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${
                    (state.toneKeywords || []).includes(tone)
                      ? 'bg-primary border-primary text-primary-foreground shadow-lg'
                      : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/40'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <label className="text-[11px] font-black text-primary uppercase tracking-[0.2em] ml-1">Creator Blueprints</label>
          <div className="grid grid-cols-1 gap-3">
            {VOICE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => selectPreset(preset)}
                className={`p-5 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${
                  state.voicePresetId === preset.id
                    ? 'border-primary bg-primary/5 shadow-inner'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{preset.icon}</span>
                  <div>
                    <p className="text-sm font-black">{preset.label}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider line-clamp-1">
                      {preset.description}
                    </p>
                  </div>
                </div>
                {state.voicePresetId === preset.id && (
                  <motion.div 
                    layoutId="voice-glow"
                    className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent" 
                  />
                )}
              </button>
            ))}
          </div>

          <div className="bg-linear-to-br from-orange-500/10 to-transparent p-6 rounded-[2rem] border border-orange-500/20 mt-6">
            <h4 className="flex items-center gap-2 text-sm font-black mb-3">
              <MessageSquareCode className="size-4 text-orange-400" />
              Signature NLP
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              We use Natural Language Processing to scan your signature phrases and replicate the exact sentence rhythm you use in your videos.
            </p>
          </div>

          <Button 
            onClick={onGenerate} 
            disabled={!canProceed} 
            className="w-full h-20 rounded-[2rem] text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform overflow-hidden relative group"
          >
                <div className="absolute inset-0 bg-linear-to-r from-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Sparkles className="size-5 mr-3" />
            Generate Viral Script
            <Wand2 className="size-5 ml-3" />
          </Button>
        </aside>
      </div>

      <div className="pt-8 border-t border-white/5 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="rounded-full px-8 py-6 font-bold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Strategy
        </Button>
      </div>
    </div>
  );
}
