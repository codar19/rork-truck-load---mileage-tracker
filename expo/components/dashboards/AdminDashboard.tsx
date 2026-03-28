import { useAuth } from '@/contexts/AuthContext';
import { useLoads } from '@/contexts/LoadContext';
import { MOCK_DISPATCHERS, MOCK_DRIVERS, ALL_USERS } from '@/mocks/users';
import { useRouter } from 'expo-router';
import { Shield, Users, Package, LogOut, DollarSign, Truck, TrendingUp, Activity, Settings, CheckCircle, Circle, AlertCircle, Lightbulb } from 'lucide-react-native';
import FooterNav from '@/components/FooterNav';
import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SYSTEM_SUGGESTIONS } from '@/mocks/suggestions';

type FeatureStatus = 'done' | 'pending' | 'blocked';
type Feature = {
  id: string;
  title: string;
  status: FeatureStatus;
  note?: string;
  suggestionIds?: string[];
};

const MUST_HAVE_FEATURES: Feature[] = [
  { id: 'auth', title: 'User Authentication (Admin/Dispatcher/Driver)', status: 'done' },
  { id: 'dashboard', title: 'Role-based Dashboards', status: 'done' },
  { id: 'load-crud', title: 'Load Management (Create/Edit/Delete)', status: 'done', suggestionIds: ['document-scanner'] },
  { id: 'load-metrics', title: 'Load Profit Calculations & Metrics', status: 'done' },
  { id: 'load-status', title: 'Load Status Tracking', status: 'done', suggestionIds: ['voice-commands', 'customer-portal'] },
  { id: 'user-stats', title: 'User/Dispatcher/Driver Statistics', status: 'done', suggestionIds: ['driver-scorecard'] },
  { id: 'settings', title: 'Settings Navigation & Structure', status: 'done' },
];

const GOOD_TO_HAVE_FEATURES: Feature[] = [
  { id: 'analytics', title: 'Advanced Analytics Dashboard', status: 'done' },
  { id: 'settings-screens', title: 'Settings Screens Configuration', status: 'done' },
  { id: 'settings-business', title: 'Business Settings', status: 'done' },
  { id: 'settings-users', title: 'User Management Settings', status: 'done' },
  { id: 'settings-security', title: 'Security Settings', status: 'done' },
  { id: 'settings-database', title: 'Database Settings', status: 'done' },
  { id: 'settings-notifications', title: 'Notification Preferences', status: 'done' },
  { id: 'stripe-integration', title: 'Stripe Payment Integration', status: 'blocked', note: 'Need: Stripe API keys (Publishable & Secret key)' },
  { id: 'push-notifications', title: 'Push Notifications', status: 'blocked', note: 'Need: Firebase/Expo Push Notification setup & credentials' },
  { id: 'real-time-tracking', title: 'Real-time GPS Load Tracking', status: 'blocked', note: 'Need: Real-time database (Firebase Realtime DB or Supabase real-time) + GPS permissions', suggestionIds: ['route-optimization', 'customer-portal'] },
  { id: 'document-upload', title: 'Document Upload (BOL, POD)', status: 'blocked', note: 'Need: Cloud storage (AWS S3, Cloudinary, or Firebase Storage) API keys', suggestionIds: ['document-scanner'] },
  { id: 'sms-notifications', title: 'SMS Notifications', status: 'blocked', note: 'Need: Twilio API credentials (Account SID, Auth Token, Phone Number)' },
  { id: 'email-notifications', title: 'Email Notifications', status: 'blocked', note: 'Need: Email service (SendGrid, Mailgun, or AWS SES) API keys' },
  { id: 'export-reports', title: 'Export Reports (PDF/CSV)', status: 'pending', note: 'Can implement with react-native-pdf or expo-file-system' },
  { id: 'multi-language', title: 'Multi-language Support', status: 'pending', note: 'Can implement with i18n library' },
  { id: 'dark-mode-toggle', title: 'Dark/Light Mode Toggle', status: 'pending', note: 'Can implement with theme context' },
  { id: 'offline-mode', title: 'Offline Mode Support', status: 'pending', note: 'Can implement with AsyncStorage caching' },
  { id: 'rate-calculator', title: 'Rate Calculator Tool', status: 'pending', note: 'Can implement with custom logic', suggestionIds: ['route-optimization', 'fuel-optimizer'] },
  { id: 'driver-chat', title: 'In-app Chat (Driver-Dispatcher)', status: 'blocked', note: 'Need: Real-time messaging service (Firebase, Pusher, or custom WebSocket server)' },
  { id: 'smart-load-assignment', title: 'Smart Load Assignment', status: 'pending', note: 'Can implement with AI-powered matching algorithm', suggestionIds: ['ai-load-matching'] },
  { id: 'expense-tracking', title: 'Expense Tracking', status: 'pending', note: 'Can implement with AsyncStorage and photo capture', suggestionIds: ['expense-tracker'] },
  { id: 'load-marketplace', title: 'Load Marketplace', status: 'pending', note: 'Can implement with marketplace context and matching', suggestionIds: ['load-marketplace'] },
  { id: 'maintenance-tracking', title: 'Maintenance Tracking', status: 'pending', note: 'Can implement with maintenance scheduler and alerts', suggestionIds: ['maintenance-scheduler'] },
  { id: 'fuel-optimization', title: 'Fuel Optimization', status: 'pending', note: 'Can implement with fuel finder and MPG tracking', suggestionIds: ['fuel-optimizer'] },
];

type TabType = 'overview' | 'must-have' | 'good-to-have';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { loads, calculateLoadMetrics } = useLoads();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const stats = useMemo(() => {
    const completedLoads = loads.filter(l => l.status === 'delivered');
    const activeLoads = loads.filter(l => l.status !== 'delivered');
    const totalRevenue = completedLoads.reduce((sum, load) => sum + load.payAmount, 0);
    const totalProfit = completedLoads.reduce((sum, load) => {
      const metrics = calculateLoadMetrics(load);
      return sum + metrics.netProfit;
    }, 0);
    const totalMiles = completedLoads.reduce((sum, load) => {
      const metrics = calculateLoadMetrics(load);
      return sum + metrics.actualMiles;
    }, 0);

    const dispatcherStats = MOCK_DISPATCHERS.map(dispatcher => {
      const dispatcherLoads = loads.filter(l => l.dispatchId === dispatcher.id);
      const drivers = MOCK_DRIVERS.filter(d => d.dispatchId === dispatcher.id);
      const revenue = dispatcherLoads
        .filter(l => l.status === 'delivered')
        .reduce((sum, load) => sum + load.payAmount, 0);
      
      return {
        dispatcher,
        drivers: drivers.length,
        loads: dispatcherLoads.length,
        revenue,
      };
    }).sort((a, b) => b.revenue - a.revenue);

    return {
      totalUsers: ALL_USERS.length,
      totalDispatchers: MOCK_DISPATCHERS.length,
      totalDrivers: MOCK_DRIVERS.length,
      totalLoads: loads.length,
      activeLoads: activeLoads.length,
      completedLoads: completedLoads.length,
      totalRevenue,
      totalProfit,
      totalMiles,
      avgRevenuePerLoad: completedLoads.length > 0 ? totalRevenue / completedLoads.length : 0,
      dispatcherStats,
    };
  }, [loads, calculateLoadMetrics]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const renderFeatureItem = (feature: Feature) => {
    const statusConfig = {
      done: { icon: CheckCircle, color: '#22c55e', text: 'Done' },
      pending: { icon: Circle, color: '#f59e0b', text: 'Pending' },
      blocked: { icon: AlertCircle, color: '#ef4444', text: 'Blocked' },
    };

    const config = statusConfig[feature.status];
    const IconComponent = config.icon;
    const hasSuggestions = feature.suggestionIds && feature.suggestionIds.length > 0;
    const suggestions = hasSuggestions 
      ? SYSTEM_SUGGESTIONS.filter(s => feature.suggestionIds?.includes(s.id))
      : [];

    return (
      <View key={feature.id} style={styles.featureItem}>
        <View style={styles.featureHeader}>
          <IconComponent size={20} color={config.color} />
          <Text style={styles.featureTitle}>{feature.title}</Text>
          {hasSuggestions && feature.status !== 'done' && (
            <TouchableOpacity
              onPress={() => {
                if (suggestions.length === 1) {
                  router.push(`/suggestion/${suggestions[0].id}`);
                } else {
                  console.log('Multiple suggestions available', suggestions);
                  router.push(`/suggestion/${suggestions[0].id}`);
                }
              }}
              style={styles.suggestionIconButton}
              testID={`suggestion-${feature.id}`}
            >
              <Lightbulb size={20} color="#f59e0b" fill="#f59e0b" />
              {suggestions.length > 1 && (
                <View style={styles.suggestionCount}>
                  <Text style={styles.suggestionCountText}>{suggestions.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.featureFooter}>
          <View style={[styles.statusBadge, { backgroundColor: config.color + '20' }]}>
            <Text style={[styles.statusText, { color: config.color }]}>{config.text}</Text>
          </View>
          {hasSuggestions && feature.status !== 'done' && (
            <TouchableOpacity
              onPress={() => {
                if (suggestions.length === 1) {
                  router.push(`/suggestion/${suggestions[0].id}`);
                } else {
                  router.push(`/suggestion/${suggestions[0].id}`);
                }
              }}
              style={styles.viewPromptButton}
              testID={`view-prompt-${feature.id}`}
            >
              <Text style={styles.viewPromptText}>View AI Prompt</Text>
            </TouchableOpacity>
          )}
        </View>
        {feature.note && (
          <View style={styles.featureNote}>
            <Text style={styles.noteText}>{feature.note}</Text>
          </View>
        )}
      </View>
    );
  };

  const mustHaveStats = {
    total: MUST_HAVE_FEATURES.length,
    done: MUST_HAVE_FEATURES.filter(f => f.status === 'done').length,
    pending: MUST_HAVE_FEATURES.filter(f => f.status === 'pending').length,
    blocked: MUST_HAVE_FEATURES.filter(f => f.status === 'blocked').length,
  };

  const goodToHaveStats = {
    total: GOOD_TO_HAVE_FEATURES.length,
    done: GOOD_TO_HAVE_FEATURES.filter(f => f.status === 'done').length,
    pending: GOOD_TO_HAVE_FEATURES.filter(f => f.status === 'pending').length,
    blocked: GOOD_TO_HAVE_FEATURES.filter(f => f.status === 'blocked').length,
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTitleContainer}>
              <Shield size={32} color="#8b5cf6" />
              <View>
                <Text style={styles.headerTitle}>Admin Panel</Text>
                <Text style={styles.headerSubtitle}>{user?.name}</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                onPress={() => router.push('/settings')} 
                style={styles.settingsButton}
                testID="settings-button"
              >
                <Settings size={24} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <LogOut size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'must-have' && styles.activeTab]}
          onPress={() => setActiveTab('must-have')}
        >
          <Text style={[styles.tabText, activeTab === 'must-have' && styles.activeTabText]}>Must-Have</Text>
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{mustHaveStats.done}/{mustHaveStats.total}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'good-to-have' && styles.activeTab]}
          onPress={() => setActiveTab('good-to-have')}
        >
          <Text style={[styles.tabText, activeTab === 'good-to-have' && styles.activeTabText]}>Good-to-Have</Text>
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{goodToHaveStats.done}/{goodToHaveStats.total}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'overview' && (
          <>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Users size={24} color="#3b82f6" />
              <Text style={styles.statValue}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.statCard}>
              <Shield size={24} color="#8b5cf6" />
              <Text style={styles.statValue}>{stats.totalDispatchers}</Text>
              <Text style={styles.statLabel}>Dispatchers</Text>
            </View>
            <View style={styles.statCard}>
              <Truck size={24} color="#f59e0b" />
              <Text style={styles.statValue}>{stats.totalDrivers}</Text>
              <Text style={styles.statLabel}>Drivers</Text>
            </View>
            <View style={styles.statCard}>
              <Package size={24} color="#22c55e" />
              <Text style={styles.statValue}>{stats.totalLoads}</Text>
              <Text style={styles.statLabel}>Total Loads</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.metricsCard}>
            <View style={styles.metricRow}>
              <View style={styles.metricIcon}>
                <Activity size={20} color="#f59e0b" />
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>Active Loads</Text>
                <Text style={styles.metricValue}>{stats.activeLoads}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricRow}>
              <View style={styles.metricIcon}>
                <Package size={20} color="#22c55e" />
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>Completed Loads</Text>
                <Text style={styles.metricValue}>{stats.completedLoads}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricRow}>
              <View style={styles.metricIcon}>
                <DollarSign size={20} color="#22c55e" />
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>Total Revenue</Text>
                <Text style={styles.metricValue}>${stats.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricRow}>
              <View style={styles.metricIcon}>
                <TrendingUp size={20} color="#3b82f6" />
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>Net Profit</Text>
                <Text style={styles.metricValue}>${stats.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricRow}>
              <View style={styles.metricIcon}>
                <Truck size={20} color="#f59e0b" />
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>Total Miles</Text>
                <Text style={styles.metricValue}>{stats.totalMiles.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricRow}>
              <View style={styles.metricIcon}>
                <DollarSign size={20} color="#8b5cf6" />
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricLabel}>Avg Revenue/Load</Text>
                <Text style={styles.metricValue}>${stats.avgRevenuePerLoad.toFixed(0)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Dispatchers</Text>
          {stats.dispatcherStats.slice(0, 5).map((stat, index) => (
            <View key={stat.dispatcher.id} style={styles.dispatcherCard}>
              <View style={styles.dispatcherRank}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
              <View style={styles.dispatcherInfo}>
                <Text style={styles.dispatcherName}>{stat.dispatcher.name}</Text>
                <Text style={styles.dispatcherStats}>
                  {stat.drivers} drivers • {stat.loads} loads
                </Text>
              </View>
              <View style={styles.dispatcherRevenue}>
                <Text style={styles.revenueValue}>${(stat.revenue / 1000).toFixed(1)}k</Text>
              </View>
            </View>
          ))}
        </View>
          </>
        )}

        {activeTab === 'must-have' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Must-Have Features</Text>
            <View style={styles.featureStats}>
              <View style={styles.featureStatItem}>
                <Text style={styles.featureStatValue}>{mustHaveStats.done}</Text>
                <Text style={styles.featureStatLabel}>Done</Text>
              </View>
              <View style={styles.featureStatItem}>
                <Text style={[styles.featureStatValue, { color: '#f59e0b' }]}>{mustHaveStats.pending}</Text>
                <Text style={styles.featureStatLabel}>Pending</Text>
              </View>
              <View style={styles.featureStatItem}>
                <Text style={[styles.featureStatValue, { color: '#ef4444' }]}>{mustHaveStats.blocked}</Text>
                <Text style={styles.featureStatLabel}>Blocked</Text>
              </View>
            </View>
            <View style={styles.featureList}>
              {MUST_HAVE_FEATURES.map(renderFeatureItem)}
            </View>
          </View>
        )}

        {activeTab === 'good-to-have' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Good-to-Have Features</Text>
            <View style={styles.featureStats}>
              <View style={styles.featureStatItem}>
                <Text style={styles.featureStatValue}>{goodToHaveStats.done}</Text>
                <Text style={styles.featureStatLabel}>Done</Text>
              </View>
              <View style={styles.featureStatItem}>
                <Text style={[styles.featureStatValue, { color: '#f59e0b' }]}>{goodToHaveStats.pending}</Text>
                <Text style={styles.featureStatLabel}>Pending</Text>
              </View>
              <View style={styles.featureStatItem}>
                <Text style={[styles.featureStatValue, { color: '#ef4444' }]}>{goodToHaveStats.blocked}</Text>
                <Text style={styles.featureStatLabel}>Blocked</Text>
              </View>
            </View>
            <View style={styles.featureList}>
              {GOOD_TO_HAVE_FEATURES.map(renderFeatureItem)}
            </View>
          </View>
        )}


      </ScrollView>

      <FooterNav />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsButton: {
    padding: 8,
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginTop: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  metricsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#f1f5f9',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
  },
  dispatcherCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  dispatcherRank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  dispatcherInfo: {
    flex: 1,
  },
  dispatcherName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#f1f5f9',
    marginBottom: 4,
  },
  dispatcherStats: {
    fontSize: 12,
    color: '#64748b',
  },
  dispatcherRevenue: {
    alignItems: 'flex-end',
  },
  revenueValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#22c55e',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#8b5cf6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#94a3b8',
  },
  activeTabText: {
    color: '#ffffff',
  },
  tabBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  featureStats: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'space-around',
  },
  featureStatItem: {
    alignItems: 'center',
  },
  featureStatValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#22c55e',
    marginBottom: 4,
  },
  featureStatLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  featureTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#f1f5f9',
  },
  featureFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  featureNote: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  noteText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  suggestionsDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 20,
  },
  suggestionsList: {
    gap: 12,
  },
  suggestionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#f1f5f9',
  },
  suggestionDescription: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
    marginBottom: 12,
  },
  suggestionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  suggestionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  suggestionBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    textTransform: 'capitalize',
  },
  suggestionTime: {
    fontSize: 12,
    color: '#64748b',
  },
  suggestionIconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  suggestionCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#f59e0b',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionCountText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  viewPromptButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f59e0b',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewPromptText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
});
