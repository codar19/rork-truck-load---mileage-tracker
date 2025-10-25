import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function IndexScreen() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { settings, isLoading: settingsLoading } = useSettings();
  const router = useRouter();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    console.log('[Index] Loading states:', { authLoading, settingsLoading, isAuthenticated, hasNavigated });
    
    if (!authLoading && !settingsLoading && !hasNavigated) {
      console.log('[Index] Ready to navigate');
      setHasNavigated(true);
      
      setTimeout(() => {
        if (isAuthenticated) {
          console.log('[Index] Navigating to dashboard');
          router.replace('/dashboard');
        } else {
          if (settings.showHeroAsHomepage) {
            console.log('[Index] Navigating to hero');
            router.replace('/hero');
          } else {
            console.log('[Index] Navigating to login');
            router.replace('/login');
          }
        }
      }, 100);
    }
  }, [isAuthenticated, authLoading, settingsLoading, settings, router, hasNavigated]);

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
