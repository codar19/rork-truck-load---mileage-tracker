import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import DriverDashboard from '@/components/dashboards/DriverDashboard';
import DispatchDashboard from '@/components/dashboards/DispatchDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';

export default function DashboardScreen() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  switch (user.role) {
    case 'driver':
      return <DriverDashboard />;
    case 'dispatch':
      return <DispatchDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
