import { useAuth } from '@/contexts/AuthContext';
import { useRouter, Redirect } from 'expo-router';
import { 
  Settings as SettingsIcon, 
  ChevronLeft, 
  Monitor, 
  CreditCard, 
  Briefcase,
  ChevronRight,
  User,
  Bell,
  Shield,
  Database
} from 'lucide-react-native';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingsMenuItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
}

export default function SettingsScreen() {
  const { user } = useAuth();
  const router = useRouter();

  if (user?.role !== 'admin') {
    return <Redirect href="/dashboard" />;
  }

  const menuItems: SettingsMenuItem[] = [
    {
      id: 'screens',
      title: 'Screens',
      description: 'Manage app screens and their visibility',
      icon: <Monitor size={24} color="#3b82f6" />,
      route: '/settings/screens',
      color: '#3b82f6',
    },
    {
      id: 'stripe',
      title: 'Stripe',
      description: 'Configure payment processing',
      icon: <CreditCard size={24} color="#22c55e" />,
      route: '/settings/stripe',
      color: '#22c55e',
    },
    {
      id: 'business',
      title: 'Business Model',
      description: 'Track features and requirements',
      icon: <Briefcase size={24} color="#f59e0b" />,
      route: '/settings/business',
      color: '#f59e0b',
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: <User size={24} color="#8b5cf6" />,
      route: '/settings/users',
      color: '#8b5cf6',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure notification settings',
      icon: <Bell size={24} color="#ec4899" />,
      route: '/settings/notifications',
      color: '#ec4899',
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Security and authentication settings',
      icon: <Shield size={24} color="#ef4444" />,
      route: '/settings/security',
      color: '#ef4444',
    },
    {
      id: 'database',
      title: 'Database',
      description: 'Backup and data management',
      icon: <Database size={24} color="#06b6d4" />,
      route: '/settings/database',
      color: '#06b6d4',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color="#f59e0b" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <SettingsIcon size={24} color="#f59e0b" />
            <Text style={styles.headerTitle}>Settings</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Manage your app configuration and settings
        </Text>

        <View style={styles.menuList}>
          {menuItems.map((item, index) => {
            const bgColor = item.color + '20';
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && styles.menuItemLast,
                ]}
                onPress={() => router.push(item.route as any)}
                testID={`settings-menu-${item.id}`}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
                    {item.icon}
                  </View>
                  <View style={styles.menuItemText}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#64748b" />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>System Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version:</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build:</Text>
            <Text style={styles.infoValue}>Production</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Logged in as:</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
        </View>
      </ScrollView>
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
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 24,
    textAlign: 'center',
  },
  menuList: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    flex: 1,
    gap: 4,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#f1f5f9',
  },
  menuItemDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  infoCard: {
    marginTop: 24,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#f1f5f9',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  infoValue: {
    fontSize: 14,
    color: '#f1f5f9',
    fontWeight: '600' as const,
  },
});
