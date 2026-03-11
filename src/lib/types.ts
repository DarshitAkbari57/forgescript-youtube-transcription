export interface WizardState {
  youtubeUrl: string;
  transcript: string;
  videoTitle: string;
  videoMetadata: {
    title: string;
    channelName: string;
    duration?: string;
  } | null;
  structuralAnalysis: string;

  newTopic: string;
  researchNotes: string;
  targetAudience: string;
  videoGoal: 'educate' | 'entertain' | 'sell' | 'inspire';

  channelName: string;
  voiceDescription: string;
  toneKeywords: string[];
  examplePhrases: string;
  voicePresetId: string | null;

  generatedScript: GeneratedScript | null;
  isGenerating: boolean;
  streamedContent: string;
}

export interface GeneratedScript {
  hook: string;
  outline: ScriptSection[];
  fullScript: string;
  suggestedTitle: string;
  suggestedThumbnailIdea: string;
  estimatedDuration: string;
}

export interface ScriptSection {
  title: string;
  type: 'hook' | 'intro' | 'main' | 'cta' | 'outro';
  content: string;
  durationEstimate: string;
}

export interface VoicePreset {
  id: string;
  label: string;
  description: string;
  icon: string;
  toneKeywords: string[];
  voiceDescription: string;
}
