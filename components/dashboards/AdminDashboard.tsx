import { useAuth } from '@/contexts/AuthContext';
import { useLoads } from '@/contexts/LoadContext';
import { MOCK_DISPATCHERS, MOCK_DRIVERS, ALL_USERS } from '@/mocks/users';
import { useRouter } from 'expo-router';
import { Shield, Users, Package, LogOut, DollarSign, Truck, TrendingUp, Activity, Settings } from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { loads, calculateLoadMetrics } = useLoads();
  const router = useRouter();

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

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
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
    paddingBottom: 40,
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
});
