import { useAuth } from '@/contexts/AuthContext';
import { useLoads } from '@/contexts/LoadContext';
import { MOCK_DRIVERS } from '@/mocks/users';
import { useRouter } from 'expo-router';
import { Users, Package, MapPin, LogOut, DollarSign, Truck, TrendingUp } from 'lucide-react-native';
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

export default function DispatchDashboard() {
  const { user, logout } = useAuth();
  const { loads, calculateLoadMetrics } = useLoads();
  const router = useRouter();
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  const myDrivers = useMemo(
    () => MOCK_DRIVERS.filter(d => d.dispatchId === user?.id),
    [user?.id]
  );

  const myLoads = useMemo(
    () => loads.filter(l => l.dispatchId === user?.id),
    [loads, user?.id]
  );

  const filteredLoads = useMemo(
    () => selectedDriverId ? myLoads.filter(l => l.driverId === selectedDriverId) : myLoads,
    [myLoads, selectedDriverId]
  );

  const stats = useMemo(() => {
    const completedLoads = myLoads.filter(l => l.status === 'delivered');
    const activeLoads = myLoads.filter(l => l.status !== 'delivered');
    const totalRevenue = completedLoads.reduce((sum, load) => sum + load.payAmount, 0);
    const totalMiles = completedLoads.reduce((sum, load) => {
      const metrics = calculateLoadMetrics(load);
      return sum + metrics.actualMiles;
    }, 0);

    return {
      totalDrivers: myDrivers.length,
      activeLoads: activeLoads.length,
      completedLoads: completedLoads.length,
      totalRevenue,
      totalMiles,
    };
  }, [myLoads, myDrivers, calculateLoadMetrics]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const renderDriverTab = (driver: typeof myDrivers[0]) => {
    const driverLoads = myLoads.filter(l => l.driverId === driver.id);
    const isSelected = selectedDriverId === driver.id;
    
    return (
      <TouchableOpacity
        key={driver.id}
        style={[styles.driverTab, isSelected && styles.driverTabActive]}
        onPress={() => setSelectedDriverId(isSelected ? null : driver.id)}
      >
        <Text style={[styles.driverTabName, isSelected && styles.driverTabNameActive]}>
          {driver.name.split(' ')[0]}
        </Text>
        <Text style={[styles.driverTabCount, isSelected && styles.driverTabCountActive]}>
          {driverLoads.length}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderLoadCard = (load: typeof loads[0]) => {
    const driver = myDrivers.find(d => d.id === load.driverId);
    const isCompleted = load.status === 'delivered';
    
    return (
      <TouchableOpacity
        key={load.id}
        style={[styles.loadCard, isCompleted && styles.loadCardCompleted]}
        onPress={() => router.push({ pathname: '/load/[id]', params: { id: load.id } })}
      >
        <View style={styles.loadHeader}>
          <View style={styles.loadHeaderLeft}>
            <Package size={20} color={isCompleted ? "#94a3b8" : "#f59e0b"} />
            <View>
              <Text style={[styles.loadId, isCompleted && styles.textMuted]}>
                {load.id.slice(-8).toUpperCase()}
              </Text>
              <Text style={styles.driverName}>{driver?.name || 'Unknown Driver'}</Text>
            </View>
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
              <Users size={32} color="#3b82f6" />
              <View>
                <Text style={styles.headerTitle}>Dispatch Center</Text>
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
            <Users size={20} color="#3b82f6" />
            <Text style={styles.statValue}>{stats.totalDrivers}</Text>
            <Text style={styles.statLabel}>Drivers</Text>
          </View>
          <View style={styles.statCard}>
            <Truck size={20} color="#f59e0b" />
            <Text style={styles.statValue}>{stats.activeLoads}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <DollarSign size={20} color="#22c55e" />
            <Text style={styles.statValue}>${(stats.totalRevenue / 1000).toFixed(0)}k</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={20} color="#8b5cf6" />
            <Text style={styles.statValue}>{(stats.totalMiles / 1000).toFixed(0)}k</Text>
            <Text style={styles.statLabel}>Miles</Text>
          </View>
        </View>

        <View style={styles.driversSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.driversScroll}
          >
            <TouchableOpacity
              style={[styles.driverTab, !selectedDriverId && styles.driverTabActive]}
              onPress={() => setSelectedDriverId(null)}
            >
              <Text style={[styles.driverTabName, !selectedDriverId && styles.driverTabNameActive]}>
                All
              </Text>
              <Text style={[styles.driverTabCount, !selectedDriverId && styles.driverTabCountActive]}>
                {myLoads.length}
              </Text>
            </TouchableOpacity>
            {myDrivers.map(renderDriverTab)}
          </ScrollView>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {filteredLoads.length === 0 ? (
          <View style={styles.emptyState}>
            <Package size={64} color="#475569" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No loads found</Text>
            <Text style={styles.emptyText}>
              {selectedDriverId ? 'This driver has no loads' : 'No loads available'}
            </Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {selectedDriverId 
                ? `${myDrivers.find(d => d.id === selectedDriverId)?.name}'s Loads` 
                : 'All Loads'} ({filteredLoads.length})
            </Text>
            {filteredLoads.map(renderLoadCard)}
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
    paddingBottom: 16,
    gap: 10,
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
  driversSection: {
    backgroundColor: '#1e293b',
    paddingBottom: 16,
  },
  driversScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  driverTab: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  driverTabActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  driverTabName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#cbd5e1',
  },
  driverTabNameActive: {
    color: '#ffffff',
  },
  driverTabCount: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#64748b',
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  driverTabCountActive: {
    color: '#3b82f6',
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
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
  driverName: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
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
});
