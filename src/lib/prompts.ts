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

Return your response as a JSON object with this exact structure:
{
  "suggestedTitle": "SEO-optimized, click-worthy video title",
  "suggestedThumbnailIdea": "Brief visual description of a high-CTR thumbnail concept",
  "estimatedDuration": "X-Y minutes",
  "hook": "The opening 30 seconds of the script verbatim — this must grab attention immediately",
  "outline": [
    {
      "title": "Section name",
      "type": "hook|intro|main|cta|outro",
      "content": "Full script text for this section, written for speaking out loud",
      "durationEstimate": "~X minutes"
    }
  ],
  "fullScript": "The complete script from start to finish, formatted with [SECTION HEADERS] and natural speech patterns including (pause), (emphasis), [B-ROLL SUGGESTION: description] markers throughout"
}

CRITICAL RULES:
- Write for SPEAKING, not reading. Use contractions, natural pauses, and conversational rhythm.
- Include [B-ROLL SUGGESTION: ...] markers where visual cutaways would work
- Include (pause), (beat), *emphasis* markers for delivery guidance
- The hook MUST grab attention in the first 5 seconds — make it impossible to scroll past
- Add pattern interrupts every 60-90 seconds to reset viewer attention
- Match the energy and personality of the channel voice exactly
- Do NOT reference the source video or its creator
- Return ONLY valid JSON, no markdown code fences`;
}

export function buildRefinePrompt(
  currentScript: string,
  refinementRequest: string,
  voiceDescription: string
): string {
  return `You are an expert YouTube scriptwriter. Refine the following script based on the creator's feedback while maintaining the same voice and structure.

CURRENT SCRIPT:
"""
${currentScript}
"""

CHANNEL VOICE:
${voiceDescription}

REFINEMENT REQUEST:
${refinementRequest}

Return the complete refined script as a JSON object with the same structure:
{
  "suggestedTitle": "Updated title if relevant, or keep the same",
  "suggestedThumbnailIdea": "Updated idea if relevant, or keep the same",
  "estimatedDuration": "X-Y minutes",
  "hook": "The opening 30 seconds",
  "outline": [
    {
      "title": "Section name",
      "type": "hook|intro|main|cta|outro",
      "content": "Full script for this section",
      "durationEstimate": "~X minutes"
    }
  ],
  "fullScript": "The complete refined script"
}

Return ONLY valid JSON, no markdown code fences.`;
}

export function buildStructuralAnalysisPrompt(transcript: string): string {
  return `You are a YouTube content strategist. Analyze this video transcript and extract its structural DNA — the techniques that make it work as a video, not the topic itself.

TRANSCRIPT:
"""
${transcript.slice(0, 6000)}
"""

Return a concise analysis (4-6 bullet points) covering:
1. **Hook technique**: How do the first 30 seconds grab attention?
2. **Structure**: What sections/segments does the video use?
3. **Pacing**: How long are segments? Where are transitions?
4. **Retention tactics**: Pattern interrupts, open loops, curiosity gaps?
5. **Tone & energy**: Sentence length, vocabulary level, personality traits?
6. **CTA approach**: How does the video close and what action does it ask for?

Format as plain text with bullet points. Be specific and actionable — a scriptwriter should be able to use this as a blueprint.`;
}
