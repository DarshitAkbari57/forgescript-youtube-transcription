'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { useScriptWizard } from '@/hooks/useScriptWizard';

const GOALS = [
  { id: 'educate' as const, label: 'Educate', icon: '🎓', desc: 'Teach something new' },
  { id: 'entertain' as const, label: 'Entertain', icon: '🎭', desc: 'Keep them watching' },
  { id: 'inspire' as const, label: 'Inspire', icon: '✨', desc: 'Motivate to act' },
  { id: 'sell' as const, label: 'Convert', icon: '💼', desc: 'Drive action/sales' },
];

interface Props {
  wizard: ReturnType<typeof useScriptWizard>;
  onNext: () => void;
  onBack: () => void;
}

export function StepVideoIdea({ wizard, onNext, onBack }: Props) {
  const { state, updateState } = wizard;
  const canProceed = state.newTopic.trim() && state.targetAudience.trim();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Define Your Video
        </h2>
        <p className="text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">
          What&apos;s your video about? The more detail you give, the better the script.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Video Topic <span className="text-primary">*</span>
          </label>
          <Input
            value={state.newTopic}
            onChange={(e) => updateState({ newTopic: e.target.value })}
            placeholder="e.g. Why most people fail at building habits"
            className="h-12 text-base px-4"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Target Audience <span className="text-primary">*</span>
          </label>
          <Input
            value={state.targetAudience}
            onChange={(e) => updateState({ targetAudience: e.target.value })}
            placeholder="e.g. Entrepreneurs aged 25-35 interested in productivity"
            className="h-12 text-base px-4"
          />
        </div>

        <div className="space-y-2.5">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Primary Goal
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {GOALS.map((goal) => (
              <button
                key={goal.id}
                onClick={() => updateState({ videoGoal: goal.id })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  state.videoGoal === goal.id
                    ? 'border-primary/50 bg-primary/10 text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80'
                }`}
              >
                <span className="text-xl">{goal.icon}</span>
                <p className="text-sm font-medium mt-1.5">{goal.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{goal.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Research Notes & Key Points
          </label>
          <p className="text-sm text-muted-foreground/60">
            Paste your research, stats, key points, examples, or talking points.
          </p>
          <Textarea
            value={state.researchNotes}
            onChange={(e) => updateState({ researchNotes: e.target.value })}
            placeholder={`• Study shows 92% of people abandon goals by February\n• James Clear's habit loop theory\n• The 2-minute rule works because...`}
            className="min-h-[160px] text-base px-4 py-3"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" size="lg" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed} size="lg" className="px-6">
          Continue
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
