import { useState, useCallback, useEffect, useRef } from 'react';
import { WizardState, GeneratedScript } from '@/lib/types';

const STORAGE_KEY = 'scriptforge-wizard-state';

const initialState: WizardState = {
  youtubeUrl: '',
  transcript: '',
  videoTitle: '',
  videoMetadata: null,
  structuralAnalysis: '',
  newTopic: '',
  researchNotes: '',
  targetAudience: '',
  videoGoal: 'educate',
  channelName: '',
  voiceDescription: '',
  toneKeywords: [],
  examplePhrases: '',
  voicePresetId: null,
  generatedScript: null,
  isGenerating: false,
  streamedContent: '',
};

function loadSavedState(): WizardState {
  if (typeof window === 'undefined') return initialState;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...initialState, ...parsed, isGenerating: false, streamedContent: '' };
    }
  } catch {
    // corrupted storage; start fresh
  }
  return initialState;
}

function parseStreamedScript(raw: string): GeneratedScript | null {
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    if (parsed.fullScript && parsed.suggestedTitle) {
      return parsed as GeneratedScript;
    }
  } catch {
    // incomplete or malformed JSON
  }
  return null;
}

export function useScriptWizard() {
  const [state, setState] = useState<WizardState>(initialState);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
  const [transcriptError, setTranscriptError] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const saved = loadSavedState();
    setState(saved);
    if (saved.transcript) {
      setCurrentStep(saved.generatedScript ? 3 : saved.channelName ? 2 : saved.newTopic ? 1 : 0);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const { isGenerating, streamedContent, ...persistable } = state;
    void isGenerating;
    void streamedContent;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch {
      // storage full or unavailable
    }
  }, [state, hydrated]);

  const updateState = useCallback((updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const fetchTranscript = useCallback(
    async (url: string) => {
      setIsLoadingTranscript(true);
      setTranscriptError('');
      try {
        const res = await fetch('/api/transcript', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        updateState({
          youtubeUrl: url,
          transcript: data.transcript,
          videoTitle: data.videoTitle,
          structuralAnalysis: data.structuralAnalysis || '',
          videoMetadata: {
            title: data.videoTitle,
            channelName: data.channelName,
          },
        });
        return true;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to fetch transcript';
        setTranscriptError(message);
        return false;
      } finally {
        setIsLoadingTranscript(false);
      }
    },
    [updateState]
  );

  const generateScript = useCallback(
    async (wizardState: WizardState) => {
      updateState({ isGenerating: true, streamedContent: '', generatedScript: null });

      try {
        const res = await fetch('/api/generate-script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(wizardState),
        });

        if (!res.body) throw new Error('No response stream');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setState((prev) => ({ ...prev, streamedContent: accumulated }));
        }

        const parsed = parseStreamedScript(accumulated);
        setState((prev) => ({
          ...prev,
          generatedScript: parsed,
          isGenerating: false,
        }));
      } catch {
        setState((prev) => ({ ...prev, isGenerating: false }));
      }
    },
    [updateState]
  );

  const refineScript = useCallback(
    async (refinementRequest: string) => {
      const current = stateRef.current;
      if (!current.generatedScript) return;

      updateState({ isGenerating: true, streamedContent: '' });

      try {
        const res = await fetch('/api/refine-script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentScript: current.generatedScript.fullScript,
            refinementRequest,
            voiceDescription: current.voiceDescription,
          }),
        });

        if (!res.body) throw new Error('No response stream');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setState((prev) => ({ ...prev, streamedContent: accumulated }));
        }

        const parsed = parseStreamedScript(accumulated);
        if (parsed) {
          setState((prev) => ({
            ...prev,
            generatedScript: parsed,
            isGenerating: false,
            streamedContent: '',
          }));
        } else {
          setState((prev) => ({ ...prev, isGenerating: false, streamedContent: '' }));
        }
      } catch {
        setState((prev) => ({ ...prev, isGenerating: false, streamedContent: '' }));
      }
    },
    [updateState]
  );

  const resetWizard = useCallback(() => {
    setState(initialState);
    setCurrentStep(0);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    state,
    currentStep,
    setCurrentStep,
    updateState,
    fetchTranscript,
    generateScript,
    refineScript,
    resetWizard,
    isLoadingTranscript,
    transcriptError,
    hydrated,
  };
}
