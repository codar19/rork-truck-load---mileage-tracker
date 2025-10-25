import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ExecutedPrompt } from '@/types/suggestion';

const STORAGE_KEY = 'executed_prompts';
const COUNTER_KEY = 'prompt_counter';

export const [ExecutedPromptsProvider, useExecutedPrompts] = createContextHook(() => {
  const [executedPrompts, setExecutedPrompts] = useState<ExecutedPrompt[]>([]);
  const [promptCounter, setPromptCounter] = useState<number>(1);

  const promptsQuery = useQuery({
    queryKey: ['executed_prompts'],
    queryFn: async () => {
      console.log('[ExecutedPromptsContext] Loading executed prompts from AsyncStorage');
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const prompts = stored ? JSON.parse(stored) : [];
      console.log('[ExecutedPromptsContext] Loaded prompts:', prompts.length);
      return prompts;
    }
  });

  const counterQuery = useQuery({
    queryKey: ['prompt_counter'],
    queryFn: async () => {
      console.log('[ExecutedPromptsContext] Loading prompt counter from AsyncStorage');
      const stored = await AsyncStorage.getItem(COUNTER_KEY);
      const counter = stored ? parseInt(stored, 10) : 1;
      console.log('[ExecutedPromptsContext] Loaded counter:', counter);
      return counter;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (prompts: ExecutedPrompt[]) => {
      console.log('[ExecutedPromptsContext] Saving executed prompts to AsyncStorage:', prompts.length);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
      return prompts;
    }
  });

  const { mutate } = saveMutation;

  useEffect(() => {
    if (promptsQuery.data !== undefined) {
      const prompts = promptsQuery.data;
      
      // Auto-mark prompt #1 (Load Management) as executed if not already
      const hasPrompt1 = prompts.some((p: ExecutedPrompt) => p.featureId === '2' && p.type === 'done');
      
      if (!hasPrompt1) {
        console.log('[ExecutedPromptsContext] Auto-marking prompt #1 (Load Management) as executed');
        const prompt1: ExecutedPrompt = {
          id: '2-done-auto',
          promptNumber: 1,
          featureId: '2',
          featureTitle: 'Load Management',
          type: 'done',
          prompt: `I need to improve the "Load Management" feature in my trucking management app.\n\nCurrent feature: Add, edit, and track loads with all details\n\nPlease implement these improvements:\n1. Add load templates for frequent routes\n2. Implement bulk load operations\n\nRequirements:\n- Maintain compatibility with existing functionality\n- Follow the current code structure and patterns\n- Use TypeScript with proper typing\n- Add console logs for debugging\n- Test on both mobile and web\n- Use React Native components and StyleSheet\n\nPlease implement these improvements step by step.`,
          executedAt: '2025-10-24T00:00:00.000Z',
          source: 'business-model',
        };
        
        const updatedPrompts = [prompt1, ...prompts];
        setExecutedPrompts(updatedPrompts);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPrompts));
        AsyncStorage.setItem(COUNTER_KEY, '2');
        setPromptCounter(2);
      } else {
        setExecutedPrompts(prompts);
      }
    }
  }, [promptsQuery.data]);

  useEffect(() => {
    if (counterQuery.data !== undefined) {
      setPromptCounter(counterQuery.data);
    }
  }, [counterQuery.data]);

  const addExecutedPrompt = useCallback(async (prompt: Omit<ExecutedPrompt, 'id' | 'executedAt' | 'promptNumber'>) => {
    console.log('[ExecutedPromptsContext] Adding executed prompt:', prompt.featureTitle);
    const newPrompt: ExecutedPrompt = {
      ...prompt,
      id: `${prompt.featureId}-${prompt.type}-${Date.now()}`,
      promptNumber: promptCounter,
      executedAt: new Date().toISOString(),
    };
    const updated = [newPrompt, ...executedPrompts];
    const newCounter = promptCounter + 1;
    
    setExecutedPrompts(updated);
    setPromptCounter(newCounter);
    
    mutate(updated);
    await AsyncStorage.setItem(COUNTER_KEY, newCounter.toString());
    
    console.log('[ExecutedPromptsContext] Prompt added with number:', newPrompt.promptNumber, 'timestamp:', newPrompt.executedAt);
  }, [executedPrompts, promptCounter, mutate]);

  const getExecutedPromptsByFeature = useCallback((featureId: string, type: 'done' | 'undone') => {
    return executedPrompts.filter(p => p.featureId === featureId && p.type === type);
  }, [executedPrompts]);

  const hasExecutedPrompt = useCallback((featureId: string, type: 'done' | 'undone') => {
    return executedPrompts.some(p => p.featureId === featureId && p.type === type);
  }, [executedPrompts]);

  const getAllExecutedPrompts = useCallback(() => {
    return executedPrompts.sort((a, b) => 
      new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()
    );
  }, [executedPrompts]);

  const clearExecutedPrompts = useCallback(() => {
    console.log('[ExecutedPromptsContext] Clearing all executed prompts');
    setExecutedPrompts([]);
    mutate([]);
  }, [mutate]);

  const getPromptNumberForFeature = useCallback((featureId: string, type: 'done' | 'undone') => {
    const prompt = executedPrompts.find(p => p.featureId === featureId && p.type === type);
    return prompt?.promptNumber;
  }, [executedPrompts]);

  const getUniquePromptId = useCallback((featureId: string, type: 'done' | 'undone') => {
    // Generate a deterministic unique ID for each feature+type combination
    // This ensures each prompt has a unique ID even before execution
    const hashCode = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash);
    };
    
    const combinedKey = `${featureId}-${type}`;
    return hashCode(combinedKey) % 10000;
  }, []);

  return useMemo(() => ({
    executedPrompts,
    addExecutedPrompt,
    getExecutedPromptsByFeature,
    hasExecutedPrompt,
    getAllExecutedPrompts,
    clearExecutedPrompts,
    getPromptNumberForFeature,
    getUniquePromptId,
    isLoading: promptsQuery.isLoading || counterQuery.isLoading,
    nextPromptNumber: promptCounter,
  }), [
    executedPrompts,
    addExecutedPrompt,
    getExecutedPromptsByFeature,
    hasExecutedPrompt,
    getAllExecutedPrompts,
    clearExecutedPrompts,
    getPromptNumberForFeature,
    getUniquePromptId,
    promptsQuery.isLoading,
    counterQuery.isLoading,
    promptCounter,
  ]);
});
