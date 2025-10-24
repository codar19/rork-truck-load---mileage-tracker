import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function IndexScreen() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { settings, isLoading: settingsLoading } = useSettings();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !settingsLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        if (settings.showHeroAsHomepage) {
          router.replace('/hero');
        } else {
          router.replace('/login');
        }
      }
    }
  }, [isAuthenticated, authLoading, settingsLoading, settings, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#f59e0b" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
