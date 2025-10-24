import { useAuth } from '@/contexts/AuthContext';
import { useRouter, Redirect } from 'expo-router';
import { Briefcase, ChevronLeft, CheckCircle, Circle, XCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FeatureStatus = 'done' | 'undone';
type FeatureCategory = 'must-have' | 'good-to-have';

interface Feature {
  id: number;
  title: string;
  description: string;
  category: FeatureCategory;
  status: FeatureStatus;
  systemDetermined: boolean;
}

type TabType = 'description' | 'must-have' | 'good-to-have';
type SubTabType = 'done' | 'undone';

export default function BusinessModelScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('done');

  const [features, setFeatures] = useState<Feature[]>([
    {
      id: 1,
      title: 'User Authentication',
      description: 'Multi-role login system with admin, dispatch, and driver roles',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 2,
      title: 'Load Management',
      description: 'Add, edit, and track loads with all details',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 3,
      title: 'Odometer Tracking',
      description: 'Track odometer readings at dispatch, pickup, and delivery',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 4,
      title: 'Expense Management',
      description: 'Track fuel costs, tolls, daily truck expenses, and per-mile surcharges',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 5,
      title: 'Profit Calculation',
      description: 'Calculate real profit by deducting all expenses from load payment',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 6,
      title: 'Analytics Dashboard',
      description: 'View profit by date range, $/mile, $/day metrics',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 7,
      title: 'Hero Landing Page',
      description: 'Marketing page with pricing plans and feature highlights',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 8,
      title: 'Settings Management',
      description: 'Admin panel to configure app behavior and features',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 9,
      title: 'Stripe Integration',
      description: 'Payment processing for subscription plans',
      category: 'must-have',
      status: 'undone',
      systemDetermined: true,
    },
    {
      id: 10,
      title: 'Multiple Load Assignment',
      description: 'Dispatch can assign multiple loads to a driver',
      category: 'must-have',
      status: 'undone',
      systemDetermined: true,
    },
    {
      id: 11,
      title: 'Real-time Notifications',
      description: 'Push notifications for load updates and status changes',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
    },
    {
      id: 12,
      title: 'GPS Tracking',
      description: 'Track driver location in real-time',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
    },
    {
      id: 13,
      title: 'Document Management',
      description: 'Upload and manage load documents, BOLs, PODs',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
    },
    {
      id: 14,
      title: 'Invoice Generation',
      description: 'Automatically generate invoices for completed loads',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
    },
    {
      id: 15,
      title: 'Driver Communication',
      description: 'Built-in chat between driver and dispatch',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
    },
  ]);

  const handleToggleFeature = (id: number) => {
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === id
          ? { ...feature, status: feature.status === 'done' ? 'undone' : 'done' }
          : feature
      )
    );
  };

  const getFilteredFeatures = () => {
    if (activeTab === 'description') return [];

    const category: FeatureCategory = activeTab === 'must-have' ? 'must-have' : 'good-to-have';
    return features.filter(
      (f) => f.category === category && f.status === activeSubTab
    );
  };

  const getStats = (category: FeatureCategory) => {
    const categoryFeatures = features.filter((f) => f.category === category);
    const done = categoryFeatures.filter((f) => f.status === 'done').length;
    const total = categoryFeatures.length;
    return { done, total, percentage: total > 0 ? Math.round((done / total) * 100) : 0 };
  };

  const mustHaveStats = getStats('must-have');
  const goodToHaveStats = getStats('good-to-have');

  if (user?.role !== 'admin') {
    return <Redirect href="/dashboard" />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color="#f59e0b" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Briefcase size={24} color="#f59e0b" />
            <Text style={styles.headerTitle}>Business Model</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'description' && styles.tabActive]}
          onPress={() => setActiveTab('description')}
        >
          <Text style={[styles.tabText, activeTab === 'description' && styles.tabTextActive]}>
            Description
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'must-have' && styles.tabActive]}
          onPress={() => setActiveTab('must-have')}
        >
          <Text style={[styles.tabText, activeTab === 'must-have' && styles.tabTextActive]}>
            Must-Have
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{mustHaveStats.done}/{mustHaveStats.total}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'good-to-have' && styles.tabActive]}
          onPress={() => setActiveTab('good-to-have')}
        >
          <Text style={[styles.tabText, activeTab === 'good-to-have' && styles.tabTextActive]}>
            Good-to-Have
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{goodToHaveStats.done}/{goodToHaveStats.total}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {activeTab !== 'description' && (
        <View style={styles.subTabs}>
          <TouchableOpacity
            style={[styles.subTab, activeSubTab === 'done' && styles.subTabActive]}
            onPress={() => setActiveSubTab('done')}
          >
            <CheckCircle size={18} color={activeSubTab === 'done' ? '#22c55e' : '#64748b'} />
            <Text style={[styles.subTabText, activeSubTab === 'done' && styles.subTabTextActive]}>
              Done
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.subTab, activeSubTab === 'undone' && styles.subTabActive]}
            onPress={() => setActiveSubTab('undone')}
          >
            <Circle size={18} color={activeSubTab === 'undone' ? '#f59e0b' : '#64748b'} />
            <Text style={[styles.subTabText, activeSubTab === 'undone' && styles.subTabTextActive]}>
              Undone
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'description' && (
          <View>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionTitle}>Load Management System</Text>
              <Text style={styles.descriptionText}>
                A comprehensive mobile application designed for truck drivers and dispatchers to
                manage loads, track expenses, and calculate real profit margins.
              </Text>
            </View>

            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionSubtitle}>Core Purpose</Text>
              <Text style={styles.descriptionText}>
                This app helps truck drivers understand their true profitability by tracking all
                expenses including fuel, tolls, truck usage fees, and administrative costs. It
                provides transparency between claimed loaded miles and actual miles driven.
              </Text>
            </View>

            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionSubtitle}>Key Features</Text>
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <View style={styles.featureBullet} />
                  <Text style={styles.featureText}>Parse dispatch text to create load records</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.featureBullet} />
                  <Text style={styles.featureText}>Track odometer at dispatch, pickup, and delivery</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.featureBullet} />
                  <Text style={styles.featureText}>Calculate fuel costs based on consumption rate</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.featureBullet} />
                  <Text style={styles.featureText}>Track daily truck usage and per-mile surcharges</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.featureBullet} />
                  <Text style={styles.featureText}>Compare claimed miles vs actual miles</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.featureBullet} />
                  <Text style={styles.featureText}>Generate detailed profit reports</Text>
                </View>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{mustHaveStats.percentage}%</Text>
                <Text style={styles.statLabel}>Must-Have Complete</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${mustHaveStats.percentage}%` }]} />
                </View>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{goodToHaveStats.percentage}%</Text>
                <Text style={styles.statLabel}>Good-to-Have Complete</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${goodToHaveStats.percentage}%`, backgroundColor: '#f59e0b' }]} />
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab !== 'description' && (
          <View style={styles.featuresList}>
            {getFilteredFeatures().length === 0 ? (
              <View style={styles.emptyState}>
                <XCircle size={48} color="#64748b" />
                <Text style={styles.emptyStateText}>
                  No {activeSubTab} features in this category
                </Text>
              </View>
            ) : (
              getFilteredFeatures().map((feature) => (
                <View key={feature.id} style={styles.featureCard}>
                  <View style={styles.featureCardHeader}>
                    <View style={styles.featureCardLeft}>
                      {feature.status === 'done' ? (
                        <CheckCircle size={24} color="#22c55e" />
                      ) : (
                        <Circle size={24} color="#64748b" />
                      )}
                      <View style={styles.featureCardText}>
                        <Text style={styles.featureCardTitle}>{feature.title}</Text>
                        <Text style={styles.featureCardDescription}>{feature.description}</Text>
                      </View>
                    </View>
                    <Switch
                      value={feature.status === 'done'}
                      onValueChange={() => handleToggleFeature(feature.id)}
                      trackColor={{ false: '#334155', true: '#22c55e' }}
                      thumbColor={feature.status === 'done' ? '#ffffff' : '#94a3b8'}
                      testID={`feature-toggle-${feature.id}`}
                    />
                  </View>
                  {feature.systemDetermined && (
                    <View style={styles.systemBadge}>
                      <Text style={styles.systemBadgeText}>System Determined</Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    flexDirection: 'row',
    gap: 8,
  },
  tabActive: {
    borderBottomColor: '#f59e0b',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#64748b',
  },
  tabTextActive: {
    color: '#f59e0b',
  },
  badge: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#94a3b8',
  },
  subTabs: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    padding: 12,
    gap: 12,
  },
  subTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  subTabActive: {
    backgroundColor: '#334155',
    borderColor: '#f59e0b',
  },
  subTabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#64748b',
  },
  subTabTextActive: {
    color: '#f1f5f9',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  descriptionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#f59e0b',
    marginBottom: 12,
  },
  descriptionSubtitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#cbd5e1',
    lineHeight: 22,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f59e0b',
    marginTop: 7,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#22c55e',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 3,
  },
  featuresList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  featureCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  featureCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureCardText: {
    flex: 1,
  },
  featureCardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#f1f5f9',
    marginBottom: 4,
  },
  featureCardDescription: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  systemBadge: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#3b82f620',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  systemBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#3b82f6',
  },
});
