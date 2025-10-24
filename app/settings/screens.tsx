import { useAuth } from '@/contexts/AuthContext';
import { useRouter, Redirect } from 'expo-router';
import { Monitor, ChevronLeft, Eye, Info } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AppScreen {
  id: number;
  name: string;
  route: string;
  description: string;
  isActive: boolean;
  category: string;
}

export default function ScreensManagementScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [screens, setScreens] = useState<AppScreen[]>([
    {
      id: 1,
      name: 'Dashboard',
      route: '/dashboard',
      description: 'Main dashboard view showing loads and key metrics. This is the primary landing page after login for all user roles.',
      isActive: true,
      category: 'Core',
    },
    {
      id: 2,
      name: 'Hero Page',
      route: '/hero',
      description: 'Marketing landing page with pricing plans and feature highlights. Visible to unauthenticated users to attract new subscriptions.',
      isActive: true,
      category: 'Marketing',
    },
    {
      id: 3,
      name: 'Login',
      route: '/login',
      description: 'Authentication screen for user login with quick login buttons for development and testing purposes.',
      isActive: true,
      category: 'Auth',
    },
    {
      id: 4,
      name: 'Add Load',
      route: '/add-load',
      description: 'Form to create a new load by parsing dispatch text. Captures pickup, delivery, and rate information.',
      isActive: true,
      category: 'Core',
    },
    {
      id: 5,
      name: 'Load Details',
      route: '/load/[id]',
      description: 'Detailed view of a single load showing all odometer readings, expenses, fuel costs, and profit calculations.',
      isActive: true,
      category: 'Core',
    },
    {
      id: 6,
      name: 'Analytics',
      route: '/analytics',
      description: 'Analytics dashboard with profit reports, date range filtering, and key performance metrics like $/mile and $/day.',
      isActive: true,
      category: 'Core',
    },
    {
      id: 7,
      name: 'Settings',
      route: '/settings',
      description: 'Admin settings hub for configuring app behavior, managing screens, Stripe integration, and business features.',
      isActive: true,
      category: 'Admin',
    },
    {
      id: 8,
      name: 'Screens Management',
      route: '/settings/screens',
      description: 'Manage all app screens, view their purpose, and toggle visibility. Admin-only feature for controlling app structure.',
      isActive: true,
      category: 'Admin',
    },
    {
      id: 9,
      name: 'Stripe Configuration',
      route: '/settings/stripe',
      description: 'Configure Stripe API keys for payment processing and subscription management.',
      isActive: true,
      category: 'Admin',
    },
    {
      id: 10,
      name: 'Business Model',
      route: '/settings/business',
      description: 'Track must-have and good-to-have features with done/undone status. Helps manage product roadmap and feature completeness.',
      isActive: true,
      category: 'Admin',
    },
  ]);

  const [selectedScreen, setSelectedScreen] = useState<AppScreen | null>(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState<boolean>(false);

  const handleToggleScreen = (id: number) => {
    setScreens((prev) =>
      prev.map((screen) =>
        screen.id === id ? { ...screen, isActive: !screen.isActive } : screen
      )
    );
    Alert.alert('Success', 'Screen status updated');
  };

  const handleViewScreen = (screen: AppScreen) => {
    setShowDescriptionModal(false);
    setTimeout(() => {
      router.push(screen.route as any);
    }, 100);
  };

  const handleShowDescription = (screen: AppScreen) => {
    setSelectedScreen(screen);
    setShowDescriptionModal(true);
  };

  if (user?.role !== 'admin') {
    return <Redirect href="/dashboard" />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color="#3b82f6" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Monitor size={24} color="#3b82f6" />
            <Text style={styles.headerTitle}>Screens</Text>
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
          Manage all app screens and their visibility
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{screens.length}</Text>
            <Text style={styles.statLabel}>Total Screens</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#22c55e' }]}>
              {screens.filter((s) => s.isActive).length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#ef4444' }]}>
              {screens.filter((s) => !s.isActive).length}
            </Text>
            <Text style={styles.statLabel}>Inactive</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colId]}>#</Text>
            <Text style={[styles.tableHeaderText, styles.colName]}>Screen Name</Text>
            <Text style={[styles.tableHeaderText, styles.colIcon]}>Info</Text>
            <Text style={[styles.tableHeaderText, styles.colToggle]}>Active</Text>
          </View>

          {screens.map((screen, index) => (
            <View
              key={screen.id}
              style={[
                styles.tableRow,
                index === screens.length - 1 && styles.tableRowLast,
              ]}
            >
              <Text style={[styles.tableCell, styles.colId]}>{screen.id}</Text>
              <TouchableOpacity
                style={styles.colName}
                onPress={() => handleViewScreen(screen)}
              >
                <Text style={styles.screenNameText}>{screen.name}</Text>
                <Text style={styles.screenRouteText}>{screen.route}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tableCell, styles.colIcon]}
                onPress={() => handleShowDescription(screen)}
              >
                <View style={styles.infoButton}>
                  <Info size={20} color="#3b82f6" />
                </View>
              </TouchableOpacity>
              <View style={[styles.tableCell, styles.colToggle]}>
                <Switch
                  value={screen.isActive}
                  onValueChange={() => handleToggleScreen(screen.id)}
                  trackColor={{ false: '#334155', true: '#22c55e' }}
                  thumbColor={screen.isActive ? '#ffffff' : '#94a3b8'}
                  testID={`screen-toggle-${screen.id}`}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showDescriptionModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDescriptionModal(false)}
      >
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.modalSafeArea} edges={['top']}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Screen Details</Text>
              <TouchableOpacity
                onPress={() => setShowDescriptionModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>Done</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <ScrollView style={styles.modalContent} contentContainerStyle={styles.modalContentContainer}>
            {selectedScreen && (
              <>
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Screen Name</Text>
                  <Text style={styles.modalValue}>{selectedScreen.name}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Route</Text>
                  <Text style={styles.modalValueCode}>{selectedScreen.route}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Category</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{selectedScreen.category}</Text>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Status</Text>
                  <View style={[
                    styles.statusBadge,
                    selectedScreen.isActive ? styles.statusBadgeActive : styles.statusBadgeInactive,
                  ]}>
                    <Text style={styles.statusBadgeText}>
                      {selectedScreen.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Description</Text>
                  <Text style={styles.modalDescription}>{selectedScreen.description}</Text>
                </View>

                <TouchableOpacity
                  style={styles.viewScreenButton}
                  onPress={() => handleViewScreen(selectedScreen)}
                >
                  <Eye size={20} color="#ffffff" />
                  <Text style={styles.viewScreenButtonText}>View Screen</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
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
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  table: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#334155',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    alignItems: 'center',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableCell: {
    justifyContent: 'center',
  },
  colId: {
    width: 40,
  },
  colName: {
    flex: 1,
    paddingRight: 8,
  },
  colIcon: {
    width: 50,
    alignItems: 'center',
  },
  colToggle: {
    width: 60,
    alignItems: 'center',
  },
  screenNameText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#3b82f6',
    marginBottom: 2,
  },
  screenRouteText: {
    fontSize: 11,
    color: '#64748b',
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1e3a8a20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  modalSafeArea: {
    backgroundColor: '#1e293b',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  modalCloseButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#3b82f6',
  },
  modalContent: {
    flex: 1,
  },
  modalContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  modalValue: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#f1f5f9',
  },
  modalValueCode: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#3b82f6',
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f59e0b20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  categoryBadgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#f59e0b',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusBadgeActive: {
    backgroundColor: '#22c55e20',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  statusBadgeInactive: {
    backgroundColor: '#ef444420',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#f1f5f9',
  },
  modalDescription: {
    fontSize: 15,
    color: '#cbd5e1',
    lineHeight: 22,
  },
  viewScreenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  viewScreenButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
});
