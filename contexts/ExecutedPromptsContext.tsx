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
      setExecutedPrompts(promptsQuery.data);
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

  return useMemo(() => ({
    executedPrompts,
    addExecutedPrompt,
    getExecutedPromptsByFeature,
    hasExecutedPrompt,
    getAllExecutedPrompts,
    clearExecutedPrompts,
    isLoading: promptsQuery.isLoading || counterQuery.isLoading,
    nextPromptNumber: promptCounter,
  }), [
    executedPrompts,
    addExecutedPrompt,
    getExecutedPromptsByFeature,
    hasExecutedPrompt,
    getAllExecutedPrompts,
    clearExecutedPrompts,
    promptsQuery.isLoading,
    counterQuery.isLoading,
    promptCounter,
  ]);
});
