import { useAuth } from '@/contexts/AuthContext';
import { useLoads } from '@/contexts/LoadContext';
import { useRouter } from 'expo-router';
import { BarChart3, DollarSign, TrendingUp, Fuel, Receipt } from 'lucide-react-native';
import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FooterNav from '@/components/FooterNav';

type TimeRange = 'today' | 'week' | 'month' | 'custom';

export default function AnalyticsScreen() {
  const { user } = useAuth();
  const { loads, calculateLoadMetrics } = useLoads();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  const driverLoads = useMemo(
    () => loads.filter(l => l.driverId === user?.id && l.status === 'delivered'),
    [loads, user?.id]
  );

  const filteredLoads = useMemo(() => {
    const getRange = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (timeRange) {
        case 'today':
          return { start: today, end: now };
        case 'week': {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          return { start: weekStart, end: now };
        }
        case 'month': {
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          return { start: monthStart, end: now };
        }
        default:
          return { start: new Date(0), end: now };
      }
    };

    const range = getRange();
    return driverLoads.filter(load => {
      if (!load.completedAt) return false;
      const completedDate = new Date(load.completedAt);
      return completedDate >= range.start && completedDate <= range.end;
    });
  }, [driverLoads, timeRange]);

  const analytics = useMemo(() => {
    let totalRevenue = 0;
    let totalProfit = 0;
    let totalMiles = 0;
    let totalFuelCost = 0;
    let totalTolls = 0;
    let totalExpenses = 0;
    let totalDays = 0;

    filteredLoads.forEach(load => {
      const metrics = calculateLoadMetrics(load);
      totalRevenue += load.payAmount;
      totalProfit += metrics.netProfit;
      totalMiles += metrics.actualMiles;
      totalFuelCost += metrics.fuelCost;
      totalTolls += load.tolls || 0;
      totalExpenses += metrics.totalExpenses;
      totalDays += load.daysUsed || 0;
    });

    const avgDollarPerMile = totalMiles > 0 ? totalRevenue / totalMiles : 0;
    const avgProfitPerMile = totalMiles > 0 ? totalProfit / totalMiles : 0;
    const avgProfitPerDay = totalDays > 0 ? totalProfit / totalDays : 0;

    return {
      totalRevenue,
      totalProfit,
      totalMiles,
      totalFuelCost,
      totalTolls,
      totalExpenses,
      totalDays,
      avgDollarPerMile,
      avgProfitPerMile,
      avgProfitPerDay,
      loadCount: filteredLoads.length,
    };
  }, [filteredLoads, calculateLoadMetrics]);

  if (user?.role !== 'driver') {
    router.replace('/dashboard');
    return null;
  }

  const renderTimeRangeButton = (range: TimeRange, label: string) => (
    <TouchableOpacity
      key={range}
      style={[styles.timeButton, timeRange === range && styles.timeButtonActive]}
      onPress={() => setTimeRange(range)}
      testID={`time-range-${range}`}
    >
      <Text style={[styles.timeButtonText, timeRange === range && styles.timeButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <BarChart3 size={28} color="#f59e0b" />
            <Text style={styles.headerTitle}>Analytics</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.timeRangeContainer}>
          <View style={styles.timeRangeRow}>
            {renderTimeRangeButton('today', 'Today')}
            {renderTimeRangeButton('week', 'This Week')}
            {renderTimeRangeButton('month', 'This Month')}
          </View>
        </View>

        {filteredLoads.length === 0 ? (
          <View style={styles.emptyState}>
            <BarChart3 size={64} color="#475569" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No data available</Text>
            <Text style={styles.emptyText}>Complete some loads to see analytics</Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Revenue & Profit</Text>
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <DollarSign size={20} color="#22c55e" />
                    <Text style={styles.metricLabel}>Total Revenue</Text>
                  </View>
                  <Text style={styles.metricValue}>${analytics.totalRevenue.toFixed(2)}</Text>
                  <Text style={styles.metricSubtext}>{analytics.loadCount} loads</Text>
                </View>

                <View style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <TrendingUp size={20} color="#3b82f6" />
                    <Text style={styles.metricLabel}>Net Profit</Text>
                  </View>
                  <Text style={styles.metricValue}>${analytics.totalProfit.toFixed(2)}</Text>
                  <Text style={styles.metricSubtext}>
                    {((analytics.totalProfit / analytics.totalRevenue) * 100).toFixed(1)}% margin
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance Metrics</Text>
              <View style={styles.performanceGrid}>
                <View style={styles.performanceCard}>
                  <Text style={styles.performanceLabel}>Avg $/Mile</Text>
                  <Text style={styles.performanceValue}>${analytics.avgDollarPerMile.toFixed(2)}</Text>
                </View>
                <View style={styles.performanceCard}>
                  <Text style={styles.performanceLabel}>Profit/Mile</Text>
                  <Text style={styles.performanceValue}>${analytics.avgProfitPerMile.toFixed(2)}</Text>
                </View>
                <View style={styles.performanceCard}>
                  <Text style={styles.performanceLabel}>Profit/Day</Text>
                  <Text style={styles.performanceValue}>${analytics.avgProfitPerDay.toFixed(2)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Expenses Breakdown</Text>
              <View style={styles.expensesList}>
                <View style={styles.expenseRow}>
                  <View style={styles.expenseLeft}>
                    <Fuel size={18} color="#ef4444" />
                    <Text style={styles.expenseLabel}>Fuel Costs</Text>
                  </View>
                  <Text style={styles.expenseValue}>${analytics.totalFuelCost.toFixed(2)}</Text>
                </View>

                <View style={styles.expenseRow}>
                  <View style={styles.expenseLeft}>
                    <Receipt size={18} color="#f59e0b" />
                    <Text style={styles.expenseLabel}>Tolls</Text>
                  </View>
                  <Text style={styles.expenseValue}>${analytics.totalTolls.toFixed(2)}</Text>
                </View>

                <View style={styles.expenseRow}>
                  <View style={styles.expenseLeft}>
                    <DollarSign size={18} color="#64748b" />
                    <Text style={styles.expenseLabel}>Total Expenses</Text>
                  </View>
                  <Text style={styles.expenseValue}>${analytics.totalExpenses.toFixed(2)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mileage Summary</Text>
              <View style={styles.mileageCard}>
                <View style={styles.mileageRow}>
                  <Text style={styles.mileageLabel}>Total Miles Driven</Text>
                  <Text style={styles.mileageValue}>{analytics.totalMiles.toLocaleString()}</Text>
                </View>
                <View style={styles.mileageRow}>
                  <Text style={styles.mileageLabel}>Total Days Used</Text>
                  <Text style={styles.mileageValue}>{analytics.totalDays}</Text>
                </View>
              </View>
            </View>
          </>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 20,
  },
  timeRangeContainer: {
    marginBottom: 24,
  },
  timeRangeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  timeButtonActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  timeButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#94a3b8',
  },
  timeButtonTextActive: {
    color: '#ffffff',
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
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500' as const,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 4,
  },
  metricSubtext: {
    fontSize: 12,
    color: '#64748b',
  },
  performanceGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  performanceCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '500' as const,
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#22c55e',
  },
  expensesList: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  expenseLabel: {
    fontSize: 14,
    color: '#cbd5e1',
    fontWeight: '500' as const,
  },
  expenseValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#f1f5f9',
  },
  mileageCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  mileageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mileageLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500' as const,
  },
  mileageValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#f1f5f9',
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
