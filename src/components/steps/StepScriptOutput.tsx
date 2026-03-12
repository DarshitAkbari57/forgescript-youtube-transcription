'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
  Zap,
  TrendingUp,
  Award,
  BarChart,
  Video,
  Type,
  Maximize2,
  Minimize2,
  PenTool,
  Send,
  RefreshCcw,
  Plus,
  History as HistoryIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { useScriptWizard } from '@/hooks/useScriptWizard';

interface Props {
  wizard: ReturnType<typeof useScriptWizard>;
  onBack: () => void;
}

export function StepScriptOutput({ wizard, onBack }: Props) {
  const { 
    state, 
    refineScript, 
    resetWizard, 
    generateHooks, 
    generateTitles,
    isLoadingHooks,
    isLoadingTitles
  } = wizard;
  const { generatedScript, isGenerating, streamedContent } = state;
  const [activeTab, setActiveTab] = useState<'full' | 'outline' | 'ai-tools'>('full');
  const [refineInput, setRefineInput] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRefine = async (request?: string) => {
    const r = request || refineInput;
    if (!r.trim()) return;
    setIsRefining(true);
    await refineScript(r);
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
      <div className="space-y-8 py-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="size-20 rounded-[2.5rem] bg-primary/10 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent animate-pulse" />
            <PenTool className="size-10 text-primary animate-bounce-slow" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gradient">Architecting your script...</h2>
            <p className="text-muted-foreground font-medium">The AI is weaving your strategy into a viral-ready narrative.</p>
          </div>
        </div>
        
        <Card className="bg-black/40 border-white/10 p-8 rounded-[3rem] shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4">
             <div className="flex gap-1">
                {[1,2,3].map(i => <div key={i} className="size-1.5 rounded-full bg-primary/30 animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}
             </div>
          </div>
          <pre className="text-sm text-primary/70 whitespace-pre-wrap font-mono leading-relaxed h-[400px] overflow-y-auto custom-scrollbar">
            {streamedContent}
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-primary/60 ml-1 translate-y-0.5" 
            />
          </pre>
        </Card>
      </div>
    );
  }

  if (!generatedScript) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Toolpanel */}
      <aside className="lg:col-span-1 space-y-6">
        <div className="glass-card p-6 rounded-[2.5rem] border border-white/10 space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Zap className="size-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Script Tools</span>
          </div>
          
          <div className="space-y-2">
            {[
              { 
                label: 'Viral Hooks', 
                icon: <Sparkles className="size-4" />, 
                onClick: () => {
                  generateHooks(state.newTopic, state.targetAudience);
                  setActiveTab('ai-tools');
                }, 
                loading: isLoadingHooks 
              },
              { 
                label: 'Pro Titles', 
                icon: <Target className="size-4" />, 
                onClick: () => {
                  generateTitles(state.newTopic, state.targetAudience);
                  setActiveTab('ai-tools');
                }, 
                loading: isLoadingTitles 
              },
              { 
                label: 'Improve Hook', 
                icon: <TrendingUp className="size-4" />, 
                onClick: () => {
                  handleRefine('Focus on creating a more viral, click-worthy hook for the beginning of the script.');
                  setActiveTab('full');
                }
              },
              { 
                label: 'Add Storytelling', 
                icon: <HistoryIcon className="size-4" />, 
                onClick: () => {
                  handleRefine('Inject more personal storytelling and emotional resonance throughout the script structure.');
                  setActiveTab('full');
                }
              },
              { 
                label: 'Generate CTA', 
                icon: <Send className="size-4" />, 
                onClick: () => {
                  handleRefine('Create a high-converting, irresistible call to action for the end of this script.');
                  setActiveTab('full');
                }
              },
            ].map((tool, i) => (
              <button
                key={i}
                onClick={tool.onClick}
                disabled={tool.loading || isRefining}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground group-hover:text-primary transition-colors">
                    {tool.loading ? <Loader2 className="size-4 animate-spin" /> : tool.icon}
                  </div>
                  <span className="text-xs font-bold">{tool.label}</span>
                </div>
                <Plus className="size-3 opacity-0 group-hover:opacity-40 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Quality Score */}
        <div className="glass-card p-6 rounded-[2.5rem] border border-white/10 space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Award className="size-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Quality Score</span>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Hook Strength', val: generatedScript.qualityScore?.hook ?? 0 },
              { label: 'Clarity', val: generatedScript.qualityScore?.clarity ?? 0 },
              { label: 'Engagement', val: generatedScript.qualityScore?.engagement ?? 0 },
              { label: 'Retention', val: generatedScript.qualityScore?.retention ?? 0 },
            ].map((s, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <span>{s.label}</span>
                  <span>{s.val}/10</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${s.val * 10}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:col-span-3 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-gradient leading-tight">
              Ready for Production
            </h2>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="size-3" /> {generatedScript.estimatedDuration}</span>
              <span className="flex items-center gap-1.5"><FileText className="size-3" /> {generatedScript.fullScript.split(' ').length} Words</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy} className="rounded-full px-6 border-white/10 h-12">
              {copied ? <Check className="size-4 mr-2" /> : <Copy className="size-4 mr-2" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button onClick={handleDownload} className="rounded-full px-8 h-12 font-bold shadow-xl shadow-primary/20">
              <Download className="size-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 w-fit">
          {[
            { id: 'full', label: 'Script', icon: <FileText className="size-4" /> },
            { id: 'outline', label: 'Timeline', icon: <BarChart className="size-4" /> },
            { id: 'ai-tools', label: 'AI Assets', icon: <Sparkles className="size-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:bg-white/5'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <Card className="min-h-[600px] border-white/10 bg-white/5 rounded-[3rem] p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <AnimatePresence mode="wait">
            {activeTab === 'full' && (
              <motion.div
                key="full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="prose prose-invert max-w-none font-medium leading-[1.8] text-lg text-foreground/90 whitespace-pre-wrap"
              >
                {generatedScript.fullScript}
              </motion.div>
            )}

            {activeTab === 'outline' && (
              <motion.div
                key="outline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Video Timeline</h3>
                  <div className="space-y-4">
                    {(generatedScript.timeline || []).map((t, i) => (
                      <div key={i} className="flex gap-6 group">
                        <div className="w-24 shrink-0 text-sm font-mono font-bold text-primary">{t.range}</div>
                        <div className="flex-1 pb-4 border-b border-white/5 flex items-center justify-between">
                          <span className="font-bold text-lg">{t.segment}</span>
                          <div className="h-1 flex-1 mx-8 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-primary/20 w-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-white/5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">B-Roll Suggestions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(generatedScript.bRollSuggestions || []).map((s, i) => (
                      <Card key={i} className="p-5 rounded-2xl bg-white/5 border-white/10 flex items-start gap-4 hover:border-primary/20 transition-all">
                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-xs font-bold text-muted-foreground leading-relaxed">{s}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ai-tools' && (
              <motion.div
                key="ai-tools"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Viral Hook Variations</h3>
                    <Button variant="ghost" size="sm" onClick={() => generateHooks(state.newTopic, state.targetAudience)} disabled={isLoadingHooks}>
                       {isLoadingHooks ? <Loader2 className="size-3 animate-spin mr-2" /> : <RefreshCcw className="size-3 mr-2" />}
                       Regenerate
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {state.hookVariations.length > 0 ? state.hookVariations.map((h, i) => (
                      <Card key={i} className="p-6 rounded-[2rem] bg-white/5 border-white/10 hover:border-primary/30 transition-all cursor-pointer group flex items-center justify-between" onClick={() => handleRefine(`Use this hook instead: "${h}"`)}>
                        <p className="text-sm font-bold leading-relaxed">{h}</p>
                        <PenTool className="size-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </Card>
                    )) : (
                      <div className="py-10 text-center text-muted-foreground italic text-sm">Click "Viral Hooks" in the left panel to generate variations.</div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Title & Thumbnail Concepts</h3>
                    <Button variant="ghost" size="sm" onClick={() => generateTitles(state.newTopic, state.targetAudience)} disabled={isLoadingTitles}>
                      {isLoadingTitles ? <Loader2 className="size-3 animate-spin mr-2" /> : <RefreshCcw className="size-3 mr-2" />}
                      Regenerate
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold text-muted-foreground flex items-center gap-2"><Type className="size-3" /> Click-Worthy Titles</label>
                        {state.suggestedTitles.map((t, i) => (
                          <div key={i} className="text-sm font-black p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all cursor-pointer" onClick={() => handleRefine(`Update script title to: ${t}`)}>{t}</div>
                        ))}
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold text-muted-foreground flex items-center gap-2"><Video className="size-3" /> Thumbnail Text</label>
                        {state.thumbnailText.map((t, i) => (
                          <div key={i} className="text-sm font-black p-4 rounded-xl bg-primary/5 border border-primary/10 text-primary uppercase tracking-wider text-center">{t}</div>
                        ))}
                     </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Bottom Refine Bar */}
        <div className="glass-card p-6 rounded-[2.5rem] border border-white/10 space-y-4">
           <div className="flex gap-4">
              <div className="relative flex-1 group">
                 <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
                 <Input 
                   value={refineInput}
                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRefineInput(e.target.value)}
                   placeholder="Whisper your refinements... e.g. 'Make it more persuasive'"
                   className="h-16 relative z-10 bg-white/50 border-2 border-border/50 rounded-2xl px-6 text-base focus:border-primary transition-all"
                   onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleRefine()}
                 />
              </div>
              <Button 
                onClick={() => handleRefine()} 
                disabled={!refineInput.trim() || isRefining}
                className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
              >
                {isRefining ? <Loader2 className="size-5 animate-spin mr-2" /> : <Sparkles className="size-5 mr-2" />}
                Perfect
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
