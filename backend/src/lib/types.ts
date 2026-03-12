export interface DeepStructuralAnalysis {
  hook: { timestamp: string; description: string };
  setup: { timestamp: string; description: string };
  story: { timestamp: string; description: string };
  insight: { timestamp: string; description: string };
  cta: { timestamp: string; description: string };
  pacing: string;
  keyMoments: { timestamp: string; label: string }[];
}

export interface Idea {
  title: string;
  description: string;
}

export interface SEOData {
  keywords: { keyword: string; volume: string; competition: string }[];
}

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
  deepAnalysis: DeepStructuralAnalysis | null;
  scriptOutline: ScriptOutline | null;
  newTopic: string;
  researchNotes: string;
  targetAudience: string;
  videoGoal: 'educate' | 'entertain' | 'sell' | 'inspire';
  
  // New workflow fields
  niche: string;
  generatedIdeas: Idea[];
  seoData: SEOData | null;
  hookVariations: string[];
  suggestedTitles: string[];
  thumbnailText: string[];

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
  qualityScore: {
    hook: number;
    clarity: number;
    engagement: number;
    retention: number;
  };
  timeline: { segment: string; range: string }[];
  bRollSuggestions: string[];
}

export interface ScriptSection {
  title: string;
  type: 'hook' | 'intro' | 'main' | 'cta' | 'outro';
  content: string;
  durationEstimate: string;
}

export interface ScriptOutline {
  outline: OutlineItem[];
}

export interface OutlineItem {
  step: number;
  title: string;
  description: string;
}

export interface VoicePreset {
  id: string;
  label: string;
  description: string;
  icon: string;
  toneKeywords: string[];
  voiceDescription: string;
}
