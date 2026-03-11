import { VoicePreset } from './types';

export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'tech-reviewer',
    label: 'Tech Reviewer',
    description: 'Clean, authoritative, premium feel. Short punchy sentences.',
    icon: '📱',
    toneKeywords: ['authoritative', 'premium', 'concise', 'tech-savvy'],
    voiceDescription:
      'Confident and polished. Uses short declarative sentences. Starts with a bold statement. Minimal filler words. Premium, aspirational tone.',
  },
  {
    id: 'educational',
    label: 'Educational Deep Dive',
    description: 'Curiosity-driven, builds narrative tension, lots of "but why?"',
    icon: '🔬',
    toneKeywords: ['curious', 'narrative-driven', 'surprising', 'intellectual'],
    voiceDescription:
      'Starts with a counterintuitive question. Builds suspense. Uses storytelling to explain concepts. Conversational but intellectually rigorous.',
  },
  {
    id: 'business',
    label: 'Business / Marketing',
    description: 'Direct, value-forward, action-oriented. Speaks to professionals.',
    icon: '📈',
    toneKeywords: ['direct', 'value-driven', 'professional', 'actionable'],
    voiceDescription:
      'Gets to the point fast. Uses numbered frameworks. Speaks to pain points. Calls out common mistakes. Strong CTAs.',
  },
  {
    id: 'vlog',
    label: 'Personal Vlog',
    description: 'Warm, conversational, feels like talking to a friend.',
    icon: '🎥',
    toneKeywords: ['warm', 'personal', 'casual', 'relatable'],
    voiceDescription:
      'Talks directly to viewer like a friend. Uses "you" and "I" a lot. Shares personal anecdotes. Casual language, contractions, natural speech patterns.',
  },
  {
    id: 'finance',
    label: 'Finance / Investing',
    description: 'Data-driven, trustworthy, uses numbers and examples.',
    icon: '💰',
    toneKeywords: ['data-driven', 'trustworthy', 'analytical', 'practical'],
    voiceDescription:
      'Leads with data and statistics. Uses real-world examples. Explains complex concepts simply. Calm, measured delivery. Emphasizes risk and nuance.',
  },
  {
    id: 'custom',
    label: 'Custom Voice',
    description: 'Define your own unique channel style from scratch.',
    icon: '✏️',
    toneKeywords: [],
    voiceDescription: '',
  },
];
