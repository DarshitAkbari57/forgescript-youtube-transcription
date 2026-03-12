import { WizardState } from './types';

export function buildScriptGenerationPrompt(state: WizardState): string {
  return `You are an expert YouTube scriptwriter who has written scripts for channels with millions of subscribers. Your job is to write a high-performing, retention-optimized YouTube script.

## SOURCE MATERIAL ANALYSIS
The creator has provided a transcript from an existing YouTube video as structural inspiration.
Analyze this transcript for:
- Hook style and opening technique
- Pacing and segment transitions
- Storytelling patterns and narrative arcs
- How they build curiosity/tension
- Sentence length and rhythm
- Pattern interrupts used to maintain attention

SOURCE TRANSCRIPT:
"""
${state.transcript.slice(0, 8000)}
"""

## NEW VIDEO BRIEF
**Topic:** ${state.newTopic}
**Target Audience:** ${state.targetAudience}
**Video Goal:** ${state.videoGoal}
**Research Notes / Key Points to Cover:**
${state.researchNotes || 'No specific research notes provided. Use your knowledge on the topic.'}

${state.seoData ? `**SEO Keywords:** ${state.seoData.keywords.map(k => k.keyword).join(', ')}` : ''}

## CHANNEL VOICE & STYLE
**Channel Name:** ${state.channelName}
**Voice Description:** ${state.voiceDescription}
**Tone Keywords:** ${state.toneKeywords.join(', ')}
${state.examplePhrases ? `**Signature Phrases / Style Examples:** ${state.examplePhrases}` : ''}

## YOUR TASK
Write a complete YouTube script that:
1. Uses the STRUCTURAL INSPIRATION from the source transcript (hooks, pacing, transitions) — NOT the content
2. Covers the new topic thoroughly with the research notes provided
3. Perfectly matches the channel voice and tone described above
4. Is optimized for viewer retention (strong hook, pattern interrupts, clear payoff)
5. Includes natural delivery cues for the creator
6. Explicitly includes B-Roll suggestions

Return your response as a JSON object with this exact structure:
{
  "suggestedTitle": "SEO-optimized, click-worthy video title",
  "suggestedThumbnailIdea": "Brief visual description of a high-CTR thumbnail concept",
  "estimatedDuration": "X-Y minutes",
  "hook": "The opening 30 seconds of the script verbatim",
  "qualityScore": {
    "hook": 0-10,
    "clarity": 0-10,
    "engagement": 0-10,
    "retention": 0-10
  },
  "timeline": [
    { "segment": "Hook", "range": "0:00–0:20" },
    { "segment": "Setup", "range": "0:20–1:30" },
    { "segment": "Main Story", "range": "1:30–5:00" },
    { "segment": "Insight", "range": "5:00–6:30" },
    { "segment": "CTA", "range": "6:30–7:00" }
  ],
  "bRollSuggestions": [
    "Scene 1: [Description]",
    "Scene 2: [Description]"
  ],
  "outline": [
    {
      "title": "Section name",
      "type": "hook|intro|main|cta|outro",
      "content": "Full script text for this section",
      "durationEstimate": "~X minutes"
    }
  ],
  "fullScript": "The complete script with [B-ROLL: ...] and (pause) markers"
}

CRITICAL RULES:
- Write for SPEAKING.
- Include [B-ROLL: ...] markers.
- Include (pause) markers.
- The hook MUST be viral-level.
- Return ONLY valid JSON.`;
}

export function buildRefinePrompt(
  currentScript: string,
  refinementRequest: string,
  voiceDescription: string
): string {
  return `You are an expert YouTube scriptwriter. Refine the following script based on the creator's feedback.

CURRENT SCRIPT:
"""
${currentScript}
"""

CHANNEL VOICE:
${voiceDescription}

REFINEMENT REQUEST:
${refinementRequest}

Return the complete refined script as a JSON object with the same structure as the original generation (including qualityScore, timeline, and bRollSuggestions).

Return ONLY valid JSON.`;
}

export function buildStructuralAnalysisPrompt(transcript: string): string {
  return `You are a YouTube content strategist. Analyze this video transcript and extract its structural DNA.
  
TRANSCRIPT:
"""
${transcript.slice(0, 10000)}
"""

Return ONLY a JSON object with this exact structure:
{
  "hook": { "timestamp": "0:00–0:XX", "description": "Analysis of the hook technique" },
  "setup": { "timestamp": "0:XX–X:XX", "description": "How the problem/context is introduced" },
  "story": { "timestamp": "X:XX–X:XX", "description": "The main narrative or core examples" },
  "insight": { "timestamp": "X:XX–X:XX", "description": "The key takeaway or 'aha' moment" },
  "cta": { "timestamp": "X:XX–X:XX", "description": "The call to action and closing" },
  "pacing": "Analysis of the video's pacing",
  "keyMoments": [
    { "timestamp": "X:XX", "label": "Brief description of a high-retention moment" }
  ]
}

CRITICAL: Return ONLY valid JSON.`;
}

export function buildOutlinePrompt(state: WizardState): string {
  return `You are an expert YouTube content strategist. Create a 6-part outline for a new video.

## STRUCTURAL INSPIRATION (Source Video)
${state.deepAnalysis ? JSON.stringify(state.deepAnalysis, null, 2) : 'Standard high-retention structure'}

## NEW VIDEO DETAILS
**Topic:** ${state.newTopic}
**Target Audience:** ${state.targetAudience}
**Goal:** ${state.videoGoal}
**Research:** ${state.researchNotes}

Return ONLY a JSON object:
{
  "outline": [
    { "step": 1, "title": "Hook: ...", "description": "..." },
    { "step": 2, "title": "...", "description": "..." },
    { "step": 3, "title": "...", "description": "..." },
    { "step": 4, "title": "...", "description": "..." },
    { "step": 5, "title": "...", "description": "..." },
    { "step": 6, "title": "Conclusion/CTA: ...", "description": "..." }
  ]
}

Return ONLY valid JSON.`;
}

export function buildHookVariationsPrompt(topic: string, targetAudience: string): string {
  return `Generate 5 viral YouTube hook variations for the following:
Topic: ${topic}
Target Audience: ${targetAudience}

Return ONLY a JSON object:
{
  "hooks": [
    "Hook 1...",
    "Hook 2...",
    "Hook 3...",
    "Hook 4...",
    "Hook 5..."
  ]
}

Return ONLY valid JSON.`;
}

export function buildTitleThumbnailPrompt(topic: string, targetAudience: string): string {
  return `Generate 5 click-worthy YouTube titles and 3 thumbnail text ideas for the following:
Topic: ${topic}
Target Audience: ${targetAudience}

Return ONLY a JSON object:
{
  "titles": ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"],
  "thumbnailText": ["Text 1", "Text 2", "Text 3"]
}

Return ONLY valid JSON.`;
}

export function buildIdeaGeneratorPrompt(niche: string): string {
  return `Generate 10 viral YouTube video ideas for the niche: ${niche}.

Return ONLY a JSON object:
{
  "ideas": [
    { "title": "Idea 1", "description": "Brief concept" },
    ...
  ]
}

Return ONLY valid JSON.`;
}

export function buildSEOToolsPrompt(topic: string): string {
  return `Provide 5 SEO keywords for the topic: ${topic}, including estimated search volume and competition score (High/Medium/Low).

Return ONLY a JSON object:
{
  "keywords": [
    { "keyword": "...", "volume": "High/Med/Low", "competition": "High/Med/Low" },
    ...
  ]
}

Return ONLY valid JSON.`;
}
