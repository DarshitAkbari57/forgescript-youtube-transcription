'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Lightbulb, Search, Users, Briefcase, Sparkles, Plus, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { useScriptWizard } from '@/hooks/useScriptWizard';
import { useState } from 'react';

const GOALS = [
  { id: 'educate' as const, label: 'Educate', icon: '🎓', desc: 'Teach something new' },
  { id: 'entertain' as const, label: 'Entertain', icon: '🎭', desc: 'Keep them watching' },
  { id: 'inspire' as const, label: 'Inspire', icon: '✨', desc: 'Motivate to act' },
  { id: 'sell' as const, label: 'Convert', icon: '💼', desc: 'Drive action/sales' },
];

const PERSONAS = ['Beginner', 'Students', 'Professionals', 'Founders', 'SaaS buyers', 'Creators'];
const INDUSTRIES = ['Educational', 'SaaS explainer', 'Real estate', 'Legal advisory', 'Pharma', 'Tech'];

interface Props {
  wizard: ReturnType<typeof useScriptWizard>;
  onNext: () => void;
  onBack: () => void;
}

export function StepVideoIdea({ wizard, onNext, onBack }: Props) {
  const { 
    state, 
    updateState, 
    generateIdeas, 
    isLoadingIdeas, 
    fetchSEOData, 
    isLoadingSEO 
  } = wizard;
  
  const [activeTab, setActiveTab] = useState<'strategy' | 'brainstorm'>('strategy');

  const canProceed = state.newTopic.trim() && state.targetAudience.trim();

  const handleGenerateIdeas = () => {
    if (state.niche) generateIdeas(state.niche);
  };

  const handleFetchSEO = () => {
    if (state.newTopic) fetchSEOData(state.newTopic);
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-gradient mb-3">Strategy & Concept</h2>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium">
            Define your audience and refine your core message with AI-powered market intelligence.
          </p>
        </div>
        <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('strategy')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'strategy' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:bg-white/5'}`}
          >
            Strategy
          </button>
          <button
            onClick={() => setActiveTab('brainstorm')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'brainstorm' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:bg-white/5'}`}
          >
            Brainstorm
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'strategy' ? (
          <motion.div
            key="strategy"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
            <div className="lg:col-span-2 space-y-8">
              {/* Topic Input */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-primary uppercase tracking-widest">Video Topic</label>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="h-auto p-0 text-xs font-bold"
                    onClick={handleFetchSEO}
                    disabled={!state.newTopic || isLoadingSEO}
                  >
                    {isLoadingSEO ? <Loader2 className="size-3 animate-spin mr-1" /> : <Search className="size-3 mr-1" />}
                    Analyze Keyword
                  </Button>
                </div>
                <Input
                  value={state.newTopic}
                  onChange={(e) => updateState({ newTopic: e.target.value })}
                  placeholder="e.g. How to scale a SaaS to $10k MRR"
                  className="h-16 text-lg px-6 rounded-2xl border-2 border-border/50 focus:border-primary shadow-sm"
                />
                
                {state.seoData && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 flex-wrap">
                    {state.seoData.keywords.map((k, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-3">
                        <span className="text-xs font-bold">{k.keyword}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-muted-foreground uppercase">{k.volume} Vol</span>
                          <span className={`size-1.5 rounded-full ${k.competition === 'Low' ? 'bg-green-500' : k.competition === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Persona & Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                    <Users className="size-3" /> Audience Persona
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PERSONAS.map(p => (
                      <button
                        key={p}
                        onClick={() => updateState({ targetAudience: p })}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${state.targetAudience === p ? 'bg-primary border-primary text-primary-foreground shadow-md' : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/30'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                    <Briefcase className="size-3" /> Content Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map(i => (
                      <button
                        key={i}
                        onClick={() => updateState({ voiceDescription: i })}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${state.voiceDescription === i ? 'bg-primary border-primary text-primary-foreground shadow-md' : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/30'}`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Research Notes */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-primary uppercase tracking-widest">Research & Key Points</label>
                <Textarea
                  value={state.researchNotes}
                  onChange={(e) => updateState({ researchNotes: e.target.value })}
                  placeholder="Paste your research, data points, or a loose script here..."
                  className="min-h-[200px] p-6 rounded-[2rem] border-2 border-border/50 focus:border-primary resize-none text-base font-medium leading-relaxed"
                />
              </div>
            </div>

            <aside className="space-y-8">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-primary uppercase tracking-widest">Video Goal</label>
                <div className="grid grid-cols-1 gap-3">
                  {GOALS.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => updateState({ videoGoal: goal.id })}
                      className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                        state.videoGoal === goal.id ? 'border-primary bg-primary/5 shadow-inner' : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <span className="text-2xl">{goal.icon}</span>
                      <div>
                        <p className="text-sm font-black">{goal.label}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{goal.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-linear-to-br from-primary/10 to-transparent p-6 rounded-[2rem] border border-primary/20">
                <h4 className="flex items-center gap-2 text-sm font-black mb-3">
                  <Sparkles className="size-4 text-primary" />
                  AI Tip: The Hook
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  YouTube analytics show that retention drops by 40% in the first 30 seconds. Focus your research on specific, counter-intuitive opening facts.
                </p>
              </div>
            </aside>
          </motion.div>
        ) : (
          <motion.div
            key="brainstorm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="flex flex-col sm:flex-row gap-6 max-w-4xl">
              <div className="flex-1 space-y-4">
                <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1">Your Niche / Sector</label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-lg transition-opacity opacity-0 group-focus-within:opacity-100" />
                  <Input
                    value={state.niche}
                    onChange={(e) => updateState({ niche: e.target.value })}
                    placeholder="e.g. Productivity for Founders"
                    className="relative z-10 h-16 text-lg px-6 rounded-2xl border-2 border-border/50 bg-white/50"
                  />
                </div>
              </div>
              <Button 
                variant="secondary"
                size="lg"
                onClick={handleGenerateIdeas}
                disabled={!state.niche || isLoadingIdeas}
                className="h-16 px-10 rounded-2xl mt-8 font-black uppercase tracking-widest"
              >
                {isLoadingIdeas ? <Loader2 className="size-5 animate-spin mr-2" /> : <Lightbulb className="size-5 mr-2" />}
                Generate 10 Idea Concepts
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.generatedIdeas.map((idea, idx) => (
                <Card 
                  key={idx} 
                  className="p-6 rounded-[2rem] bg-white/5 border-white/10 hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between"
                  onClick={() => {
                    updateState({ newTopic: idea.title, researchNotes: idea.description });
                    setActiveTab('strategy');
                  }}
                >
                  <div className="space-y-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      #{idx + 1}
                    </div>
                    <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{idea.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium line-clamp-3">
                      {idea.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-end">
                    <div className="size-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Plus className="size-4" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {state.generatedIdeas.length === 0 && !isLoadingIdeas && (
              <div className="py-20 flex flex-col items-center justify-center text-center opacity-20">
                <Lightbulb className="size-20 mb-6" />
                <p className="text-xl font-black">Enter your niche to start brainstorming</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-12 border-t border-white/5 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="rounded-full px-8 h-14 font-bold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={!canProceed}
          className="rounded-full px-12 h-16 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform"
        >
          Next Step: Outline
          <ArrowRight className="size-5 ml-3" />
        </Button>
      </div>
    </div>
  );
}
