import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { LoadTemplate } from '@/types/load-template';

const STORAGE_KEY = 'load_templates';

export const [LoadTemplateProvider, useLoadTemplates] = createContextHook(() => {
  const [templates, setTemplates] = useState<LoadTemplate[]>([]);

  const templatesQuery = useQuery({
    queryKey: ['loadTemplates'],
    queryFn: async () => {
      console.log('[LoadTemplateContext] Loading templates from storage');
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (updatedTemplates: LoadTemplate[]) => {
      console.log('[LoadTemplateContext] Saving templates to storage:', updatedTemplates.length);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
      return updatedTemplates;
    }
  });

  const { mutate } = saveMutation;

  useEffect(() => {
    if (templatesQuery.data) {
      setTemplates(templatesQuery.data);
    }
  }, [templatesQuery.data]);

  const saveTemplates = useCallback((updatedTemplates: LoadTemplate[]) => {
    setTemplates(updatedTemplates);
    mutate(updatedTemplates);
  }, [mutate]);

  const addTemplate = useCallback((template: Omit<LoadTemplate, 'id' | 'createdAt' | 'useCount'>) => {
    console.log('[LoadTemplateContext] Adding new template:', template.name);
    const newTemplate: LoadTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      useCount: 0,
    };
    const updated = [newTemplate, ...templates];
    saveTemplates(updated);
    return newTemplate.id;
  }, [templates, saveTemplates]);

  const updateTemplate = useCallback((id: string, updates: Partial<LoadTemplate>) => {
    console.log('[LoadTemplateContext] Updating template:', id);
    const updated = templates.map(template => 
      template.id === id ? { ...template, ...updates } : template
    );
    saveTemplates(updated);
  }, [templates, saveTemplates]);

  const deleteTemplate = useCallback((id: string) => {
    console.log('[LoadTemplateContext] Deleting template:', id);
    const updated = templates.filter(template => template.id !== id);
    saveTemplates(updated);
  }, [templates, saveTemplates]);

  const getTemplate = useCallback((id: string) => {
    return templates.find(template => template.id === id);
  }, [templates]);

  const incrementTemplateUsage = useCallback((id: string) => {
    console.log('[LoadTemplateContext] Incrementing usage for template:', id);
    const updated = templates.map(template => {
      if (template.id === id) {
        return {
          ...template,
          useCount: template.useCount + 1,
          lastUsed: new Date().toISOString(),
        };
      }
      return template;
    });
    saveTemplates(updated);
  }, [templates, saveTemplates]);

  const getMostUsedTemplates = useCallback((limit: number = 5) => {
    return [...templates]
      .sort((a, b) => b.useCount - a.useCount)
      .slice(0, limit);
  }, [templates]);

  const getRecentTemplates = useCallback((limit: number = 5) => {
    return [...templates]
      .filter(t => t.lastUsed)
      .sort((a, b) => {
        const dateA = a.lastUsed ? new Date(a.lastUsed).getTime() : 0;
        const dateB = b.lastUsed ? new Date(b.lastUsed).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, limit);
  }, [templates]);

  return useMemo(() => ({
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    incrementTemplateUsage,
    getMostUsedTemplates,
    getRecentTemplates,
    isLoading: templatesQuery.isLoading,
  }), [
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    incrementTemplateUsage,
    getMostUsedTemplates,
    getRecentTemplates,
    templatesQuery.isLoading,
  ]);
});
