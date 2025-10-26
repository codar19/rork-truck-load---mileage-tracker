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
    console.log('[IndexScreen] Auth loading:', authLoading, 'Settings loading:', settingsLoading, 'Has navigated:', hasNavigated);
    
    if (!authLoading && !settingsLoading && !hasNavigated) {
      console.log('[IndexScreen] Ready to navigate. IsAuthenticated:', isAuthenticated);
      setHasNavigated(true);
      
      setTimeout(() => {
        if (isAuthenticated) {
          console.log('[IndexScreen] Navigating to /dashboard');
          router.replace('/dashboard');
        } else {
          if (settings.showHeroAsHomepage) {
            console.log('[IndexScreen] Navigating to /hero');
            router.replace('/hero');
          } else {
            console.log('[IndexScreen] Navigating to /login');
            router.replace('/login');
          }
        }
      }, 100);
    }
  }, [isAuthenticated, authLoading, settingsLoading, hasNavigated, settings.showHeroAsHomepage, router]);

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
