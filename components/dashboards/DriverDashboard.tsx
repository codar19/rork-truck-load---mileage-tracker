import { useAuth } from '@/contexts/AuthContext';
import { useLoads } from '@/contexts/LoadContext';
import { useRouter } from 'expo-router';
import { Truck, Plus, Package, MapPin, LogOut, DollarSign, TrendingUp } from 'lucide-react-native';
import FooterNav from '@/components/FooterNav';
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

export default function DriverDashboard() {
  const { user, logout } = useAuth();
  const { loads, calculateLoadMetrics } = useLoads();
  const router = useRouter();

  const driverLoads = useMemo(
    () => loads.filter(l => l.driverId === user?.id),
    [loads, user?.id]
  );

  const activeLoads = useMemo(
    () => driverLoads.filter(l => l.status !== 'delivered'),
    [driverLoads]
  );

  const completedLoads = useMemo(
    () => driverLoads.filter(l => l.status === 'delivered'),
    [driverLoads]
  );

  const stats = useMemo(() => {
    const totalEarnings = completedLoads.reduce((sum, load) => sum + load.payAmount, 0);
    const totalProfit = completedLoads.reduce((sum, load) => {
      const metrics = calculateLoadMetrics(load);
      return sum + metrics.netProfit;
    }, 0);
    const totalMiles = completedLoads.reduce((sum, load) => {
      const metrics = calculateLoadMetrics(load);
      return sum + metrics.actualMiles;
    }, 0);

    return {
      totalEarnings,
      totalProfit,
      totalMiles,
      completedCount: completedLoads.length,
    };
  }, [completedLoads, calculateLoadMetrics]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const renderLoadCard = (load: typeof loads[0]) => {
    const isCompleted = load.status === 'delivered';
    
    return (
      <TouchableOpacity
        key={load.id}
        style={[styles.loadCard, isCompleted && styles.loadCardCompleted]}
        onPress={() => router.push({ pathname: '/load/[id]', params: { id: load.id } })}
        testID={`load-${load.id}`}
      >
        <View style={styles.loadHeader}>
          <View style={styles.loadHeaderLeft}>
            <Package size={20} color={isCompleted ? "#94a3b8" : "#f59e0b"} />
            <Text style={[styles.loadId, isCompleted && styles.textMuted]}>
              {load.id.slice(-8).toUpperCase()}
            </Text>
          </View>
          <View style={[styles.statusBadge, isCompleted ? styles.statusDelivered : styles.statusActive]}>
            <Text style={styles.statusText}>
              {load.status === 'delivered' ? 'Delivered' : load.status === 'at_pickup' ? 'At Pickup' : 'Pending'}
            </Text>
          </View>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routeRow}>
            <MapPin size={16} color="#64748b" />
            <Text style={styles.routeText} numberOfLines={1}>
              {load.origin}
            </Text>
          </View>
          <View style={styles.routeArrow}>
            <View style={styles.routeLine} />
            <Text style={styles.arrowText}>→</Text>
          </View>
          <View style={styles.routeRow}>
            <MapPin size={16} color="#ef4444" />
            <Text style={styles.routeText} numberOfLines={1}>
              {load.destination}
            </Text>
          </View>
        </View>

        <View style={styles.loadFooter}>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Pay</Text>
            <Text style={styles.footerValue}>${load.payAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Miles</Text>
            <Text style={styles.footerValue}>{load.claimedMiles}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTitleContainer}>
              <Truck size={32} color="#f59e0b" />
              <View>
                <Text style={styles.headerTitle}>My Loads</Text>
                <Text style={styles.headerSubtitle}>{user?.name}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <LogOut size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <DollarSign size={20} color="#22c55e" />
            <Text style={styles.statValue}>${stats.totalEarnings.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={20} color="#3b82f6" />
            <Text style={styles.statValue}>${stats.totalProfit.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Net Profit</Text>
          </View>
          <View style={styles.statCard}>
            <Truck size={20} color="#f59e0b" />
            <Text style={styles.statValue}>{stats.totalMiles.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Miles</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {driverLoads.length === 0 ? (
          <View style={styles.emptyState}>
            <Package size={64} color="#475569" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No loads yet</Text>
            <Text style={styles.emptyText}>Add your first load to get started</Text>
          </View>
        ) : (
          <>
            {activeLoads.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Active Loads ({activeLoads.length})</Text>
                {activeLoads.map(renderLoadCard)}
              </View>
            )}

            {completedLoads.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Completed Loads ({completedLoads.length})</Text>
                {completedLoads.map(renderLoadCard)}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/add-load')}
          testID="add-load-button"
        >
          <Plus size={28} color="#ffffff" />
          <Text style={styles.fabText}>Add Load</Text>
        </TouchableOpacity>
      </SafeAreaView>

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
    paddingBottom: 16,
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
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
    backgroundColor: '#1e293b',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 160,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#cbd5e1',
    marginBottom: 12,
  },
  loadCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  loadCardCompleted: {
    opacity: 0.7,
  },
  loadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loadHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadId: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#f1f5f9',
  },
  textMuted: {
    color: '#94a3b8',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#f59e0b',
  },
  statusDelivered: {
    backgroundColor: '#334155',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
  routeContainer: {
    marginBottom: 12,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeText: {
    fontSize: 14,
    color: '#cbd5e1',
    flex: 1,
  },
  routeArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingLeft: 8,
  },
  routeLine: {
    width: 1,
    height: 20,
    backgroundColor: '#334155',
    marginRight: 8,
  },
  arrowText: {
    fontSize: 16,
    color: '#475569',
  },
  loadFooter: {
    flexDirection: 'row',
    gap: 20,
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#22c55e',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#cbd5e1',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
  },
  fabContainer: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 20,
  },
  fab: {
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
