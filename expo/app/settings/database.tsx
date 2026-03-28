import { useAuth } from '@/contexts/AuthContext';
import { useRouter, Redirect } from 'expo-router';
import { Database, ChevronLeft } from 'lucide-react-native';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DatabaseScreen() {
  const { user } = useAuth();
  const router = useRouter();

  if (user?.role !== 'admin') {
    return <Redirect href="/dashboard" />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color="#06b6d4" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Database size={24} color="#06b6d4" />
            <Text style={styles.headerTitle}>Database</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <View style={styles.content}>
        <Text style={styles.comingSoon}>Coming Soon</Text>
        <Text style={styles.description}>
          Database management features will be available in a future update
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  safeArea: {
    backgroundColor: '#1e293b',
  },
  header: {
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  comingSoon: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
