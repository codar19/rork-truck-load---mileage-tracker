import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { AppSettings } from '@/types/settings';

const STORAGE_KEY = 'app_settings';

const DEFAULT_SETTINGS: AppSettings = {
  showHeroAsHomepage: false,
  showQuickLoginPage: true,
  showQuickLoginOnHero: true,
  stripePublishableKey: '',
  stripeSecretKey: '',
};

export const [SettingsProvider, useSettings] = createContextHook(() => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const settingsQuery = useQuery({
    queryKey: ['app_settings'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (newSettings: AppSettings) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      return newSettings;
    }
  });

  const { mutate } = saveMutation;

  useEffect(() => {
    if (settingsQuery.data !== undefined) {
      setSettings(settingsQuery.data);
    }
  }, [settingsQuery.data]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    mutate(updated);
  }, [settings, mutate]);

  return useMemo(() => ({
    settings,
    updateSettings,
    isLoading: settingsQuery.isLoading,
  }), [settings, updateSettings, settingsQuery.isLoading]);
});
