import { useAuth } from '@/contexts/AuthContext';
import { MOCK_ADMIN, MOCK_DISPATCHERS, MOCK_DRIVERS } from '@/mocks/users';
import { useRouter } from 'expo-router';
import { Truck, User, Shield, LogIn } from 'lucide-react-native';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const handleQuickLogin = (user: typeof MOCK_ADMIN) => {
    login(user);
    router.replace('/dashboard');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Truck size={48} color="#f59e0b" strokeWidth={2.5} />
            </View>
            <Text style={styles.title}>LoadBoard Pro</Text>
            <Text style={styles.subtitle}>Professional Load Management System</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Login</Text>
            <Text style={styles.sectionDescription}>
              Select a user type to explore the platform
            </Text>
          </View>

          <View style={styles.loginOptions}>
            <TouchableOpacity
              style={[styles.loginCard, styles.adminCard]}
              onPress={() => handleQuickLogin(MOCK_ADMIN)}
              testID="quick-login-admin"
            >
              <View style={styles.loginCardHeader}>
                <View style={[styles.iconContainer, styles.adminIcon]}>
                  <Shield size={24} color="#ffffff" />
                </View>
                <Text style={styles.loginCardTitle}>System Admin</Text>
              </View>
              <Text style={styles.loginCardDescription}>
                Full system access with analytics and user management
              </Text>
              <View style={styles.loginButton}>
                <LogIn size={18} color="#ffffff" />
                <Text style={styles.loginButtonText}>Login as Admin</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginCard, styles.dispatchCard]}
              onPress={() => handleQuickLogin(MOCK_DISPATCHERS[0])}
              testID="quick-login-dispatch"
            >
              <View style={styles.loginCardHeader}>
                <View style={[styles.iconContainer, styles.dispatchIcon]}>
                  <User size={24} color="#ffffff" />
                </View>
                <Text style={styles.loginCardTitle}>Dispatcher</Text>
              </View>
              <Text style={styles.loginCardDescription}>
                Manage drivers, assign loads, and track performance
              </Text>
              <View style={styles.dispatchInfo}>
                <Text style={styles.dispatchName}>{MOCK_DISPATCHERS[0].name}</Text>
                <Text style={styles.dispatchEmail}>{MOCK_DISPATCHERS[0].email}</Text>
              </View>
              <View style={styles.loginButton}>
                <LogIn size={18} color="#ffffff" />
                <Text style={styles.loginButtonText}>Login as Dispatcher</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginCard, styles.driverCard]}
              onPress={() => handleQuickLogin(MOCK_DRIVERS[0])}
              testID="quick-login-driver"
            >
              <View style={styles.loginCardHeader}>
                <View style={[styles.iconContainer, styles.driverIcon]}>
                  <Truck size={24} color="#ffffff" />
                </View>
                <Text style={styles.loginCardTitle}>Truck Driver</Text>
              </View>
              <Text style={styles.loginCardDescription}>
                Track your loads, manage expenses, and view earnings
              </Text>
              <View style={styles.dispatchInfo}>
                <Text style={styles.dispatchName}>{MOCK_DRIVERS[0].name}</Text>
                <Text style={styles.dispatchEmail}>{MOCK_DRIVERS[0].email}</Text>
              </View>
              <View style={styles.loginButton}>
                <LogIn size={18} color="#ffffff" />
                <Text style={styles.loginButtonText}>Login as Driver</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Industry-standard load board with real-time tracking
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  title: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  loginOptions: {
    gap: 16,
  },
  loginCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#334155',
  },
  adminCard: {
    borderColor: '#8b5cf6',
  },
  dispatchCard: {
    borderColor: '#3b82f6',
  },
  driverCard: {
    borderColor: '#f59e0b',
  },
  loginCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminIcon: {
    backgroundColor: '#8b5cf6',
  },
  dispatchIcon: {
    backgroundColor: '#3b82f6',
  },
  driverIcon: {
    backgroundColor: '#f59e0b',
  },
  loginCardTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#f1f5f9',
  },
  loginCardDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 16,
  },
  dispatchInfo: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dispatchName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#cbd5e1',
    marginBottom: 4,
  },
  dispatchEmail: {
    fontSize: 12,
    color: '#64748b',
  },
  loginButton: {
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
});
