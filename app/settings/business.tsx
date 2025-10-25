import { useAuth } from '@/contexts/AuthContext';
import { useRouter, Redirect } from 'expo-router';
import { 
  Briefcase, 
  ChevronLeft, 
  CheckCircle, 
  Circle, 
  XCircle,
  CreditCard,
  Users,
  Database,
  FileDown,
  Search,
  Lock,
  Smartphone,
  AlertTriangle,
  Bell,
  MapPin,
  FileText,
  FileCheck,
  MessageSquare,
  Route,
  Cloud,
  Wrench,
  Truck,
  ShoppingCart,
  Camera,
  WifiOff,
  BarChart3,
  Trophy,
  Activity,
  Bookmark,
  Globe,
  Mic,
  Bot,
  Calculator,
  FileSpreadsheet
} from 'lucide-react-native';
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
  iconName?: string;
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
      title: 'Role-Based Dashboards',
      description: 'Customized dashboards for admin, dispatch, and driver roles',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 10,
      title: 'Load Status Workflow',
      description: 'Track loads through pending, at pickup, in transit, and delivered stages',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 11,
      title: 'Dispatcher Assignment',
      description: 'Assign dispatchers to manage specific drivers',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 12,
      title: 'Dispatch Text Parsing',
      description: 'Parse load details from dispatcher text messages',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 13,
      title: 'Fuel Cost Tracking',
      description: 'Track gallons, price per gallon, and total fuel cost per load',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 14,
      title: 'Empty vs Loaded Miles',
      description: 'Differentiate between empty miles to pickup and loaded miles to delivery',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 15,
      title: 'Admin Cost Allocation',
      description: 'Automatic daily admin cost calculation ($90/week divided by days)',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 16,
      title: 'Persistent Data Storage',
      description: 'Store loads and user data locally with AsyncStorage',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 17,
      title: 'Footer Navigation',
      description: 'Persistent bottom navigation for quick access to key features',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 18,
      title: 'Business Model Tracking',
      description: 'Track feature completion and project progress',
      category: 'must-have',
      status: 'done',
      systemDetermined: true,
    },
    {
      id: 19,
      title: 'Stripe Integration',
      description: 'Payment processing for subscription plans',
      category: 'must-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'CreditCard',
    },
    {
      id: 20,
      title: 'User Management System',
      description: 'Create, edit, and delete users with different roles',
      category: 'must-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Users',
    },
    {
      id: 21,
      title: 'Database Backend',
      description: 'Connect to real database instead of mock data',
      category: 'must-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Database',
    },
    {
      id: 22,
      title: 'Data Export',
      description: 'Export load and analytics data to CSV/Excel',
      category: 'must-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'FileDown',
    },
    {
      id: 23,
      title: 'Load History & Search',
      description: 'Search and filter through historical loads',
      category: 'must-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Search',
    },
    {
      id: 24,
      title: 'Security & Authentication',
      description: 'Secure password management and session handling',
      category: 'must-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Lock',
    },
    {
      id: 25,
      title: 'Mobile Responsiveness',
      description: 'Optimize for different screen sizes and orientations',
      category: 'must-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Smartphone',
    },
    {
      id: 26,
      title: 'Error Handling',
      description: 'Comprehensive error handling and user feedback',
      category: 'must-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'AlertTriangle',
    },
    {
      id: 27,
      title: 'Real-time Notifications',
      description: 'Push notifications for load updates and status changes',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Bell',
    },
    {
      id: 28,
      title: 'GPS Tracking',
      description: 'Track driver location in real-time during loads',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'MapPin',
    },
    {
      id: 29,
      title: 'Document Management',
      description: 'Upload and manage load documents, BOLs, PODs',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'FileText',
    },
    {
      id: 30,
      title: 'Invoice Generation',
      description: 'Automatically generate invoices for completed loads',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'FileCheck',
    },
    {
      id: 31,
      title: 'Driver Communication',
      description: 'Built-in chat between driver and dispatch',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'MessageSquare',
    },
    {
      id: 32,
      title: 'Route Optimization',
      description: 'Suggest optimal routes to minimize fuel and time',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Route',
    },
    {
      id: 33,
      title: 'Weather Integration',
      description: 'Show weather conditions along route and at destinations',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Cloud',
    },
    {
      id: 34,
      title: 'Maintenance Tracking',
      description: 'Track truck maintenance schedules and costs',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Wrench',
    },
    {
      id: 35,
      title: 'Multi-Truck Support',
      description: 'Manage multiple trucks per driver or fleet',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Truck',
    },
    {
      id: 36,
      title: 'Load Marketplace',
      description: 'Browse and bid on available loads from brokers',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'ShoppingCart',
    },
    {
      id: 37,
      title: 'Photo Capture',
      description: 'Take photos of BOL, POD, and load condition',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Camera',
    },
    {
      id: 38,
      title: 'Offline Mode',
      description: 'Work offline and sync when connection returns',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'WifiOff',
    },
    {
      id: 39,
      title: 'Custom Reports',
      description: 'Create custom analytics reports with filters',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'BarChart3',
    },
    {
      id: 40,
      title: 'Driver Scorecard',
      description: 'Track driver performance metrics and ratings',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Trophy',
    },
    {
      id: 41,
      title: 'Fuel Card Integration',
      description: 'Integrate with fuel cards for automatic expense tracking',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'CreditCard',
    },
    {
      id: 42,
      title: 'ELD Integration',
      description: 'Connect with Electronic Logging Devices for HOS compliance',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Activity',
    },
    {
      id: 43,
      title: 'Load Templates',
      description: 'Save frequently used routes and settings as templates',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Bookmark',
    },
    {
      id: 44,
      title: 'Multi-language Support',
      description: 'Support multiple languages for international drivers',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Globe',
    },
    {
      id: 45,
      title: 'Voice Commands',
      description: 'Voice-activated features for hands-free operation',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Mic',
    },
    {
      id: 46,
      title: 'Automated Dispatch',
      description: 'AI-powered load assignment based on driver availability and location',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Bot',
    },
    {
      id: 47,
      title: 'Tax Report Generation',
      description: 'Generate quarterly and annual tax reports',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Calculator',
    },
    {
      id: 48,
      title: 'Customer Portal',
      description: 'Client-facing portal for load tracking and updates',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Globe',
    },
    {
      id: 49,
      title: 'Driver Time Tracking',
      description: 'Track hours of service and break times',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'Activity',
    },
    {
      id: 50,
      title: 'Load Rate History',
      description: 'Historical data on load rates for pricing insights',
      category: 'good-to-have',
      status: 'undone',
      systemDetermined: true,
      iconName: 'FileSpreadsheet',
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
              getFilteredFeatures().map((feature) => {
                const IconComponent = getIconComponent(feature.iconName);
                return (
                  <View key={feature.id} style={styles.featureCard}>
                    <View style={styles.featureCardHeader}>
                      <View style={styles.featureCardLeft}>
                        {feature.iconName && feature.status === 'undone' ? (
                          <View style={styles.iconContainer}>
                            <IconComponent size={24} color="#f59e0b" />
                          </View>
                        ) : feature.status === 'done' ? (
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
                );
              })
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function getIconComponent(iconName?: string) {
  const iconMap: Record<string, any> = {
    CreditCard,
    Users,
    Database,
    FileDown,
    Search,
    Lock,
    Smartphone,
    AlertTriangle,
    Bell,
    MapPin,
    FileText,
    FileCheck,
    MessageSquare,
    Route,
    Cloud,
    Wrench,
    Truck,
    ShoppingCart,
    Camera,
    WifiOff,
    BarChart3,
    Trophy,
    Activity,
    Bookmark,
    Globe,
    Mic,
    Bot,
    Calculator,
    FileSpreadsheet,
  };
  
  return iconMap[iconName || ''] || Circle;
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f59e0b20',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
