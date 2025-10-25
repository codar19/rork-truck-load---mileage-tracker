import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { PromptExecution } from '@/types/prompt-execution';

const STORAGE_KEY = 'prompt_executions';

export const [PromptExecutionProvider, usePromptExecution] = createContextHook(() => {
  const [executions, setExecutions] = useState<PromptExecution[]>([]);
  const queryClient = useQueryClient();

  const executionsQuery = useQuery({
    queryKey: ['prompt_executions'],
    queryFn: async () => {
      console.log('[PromptExecution] Loading executions from storage');
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : [];
      console.log('[PromptExecution] Loaded executions:', data.length);
      return data as PromptExecution[];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (newExecutions: PromptExecution[]) => {
      console.log('[PromptExecution] Saving executions to storage:', newExecutions.length);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newExecutions));
      return newExecutions;
    },
    onSuccess: () => {
      console.log('[PromptExecution] Successfully saved executions');
      queryClient.invalidateQueries({ queryKey: ['prompt_executions'] });
    }
  });

  const { mutate } = saveMutation;

  useEffect(() => {
    if (executionsQuery.data !== undefined) {
      setExecutions(executionsQuery.data);
    }
  }, [executionsQuery.data]);

  const markPromptAsExecuted = useCallback((
    featureId: string,
    featureTitle: string,
    promptType: 'done' | 'undone'
  ) => {
    console.log('[PromptExecution] Marking prompt as executed:', { featureId, featureTitle, promptType });
    const newExecution: PromptExecution = {
      featureId,
      featureTitle,
      executedAt: new Date().toISOString(),
      promptType,
    };
    
    const filtered = executions.filter(
      e => !(e.featureId === featureId && e.promptType === promptType)
    );
    
    const updated = [newExecution, ...filtered];
    setExecutions(updated);
    mutate(updated);
  }, [executions, mutate]);

  const isPromptExecuted = useCallback((featureId: string, promptType: 'done' | 'undone') => {
    const executed = executions.some(
      e => e.featureId === featureId && e.promptType === promptType
    );
    console.log('[PromptExecution] Checking if prompt executed:', { featureId, promptType, executed });
    return executed;
  }, [executions]);

  const getLastExecution = useCallback((featureId: string, promptType: 'done' | 'undone') => {
    return executions.find(
      e => e.featureId === featureId && e.promptType === promptType
    );
  }, [executions]);

  const clearExecutions = useCallback(() => {
    console.log('[PromptExecution] Clearing all executions');
    setExecutions([]);
    mutate([]);
  }, [mutate]);

  return useMemo(() => ({
    executions,
    markPromptAsExecuted,
    isPromptExecuted,
    getLastExecution,
    clearExecutions,
    isLoading: executionsQuery.isLoading,
  }), [
    executions,
    markPromptAsExecuted,
    isPromptExecuted,
    getLastExecution,
    clearExecutions,
    executionsQuery.isLoading,
  ]);
});
