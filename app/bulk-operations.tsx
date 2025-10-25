import { useLoads } from '@/contexts/LoadContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import {
  CheckSquare,
  Square,
  Trash2,
  ArrowLeft,
  Filter,
  X,
  Check,
  User,
  Package,
} from 'lucide-react-native';
import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { LoadStatus } from '@/types/load';

export default function BulkOperationsScreen() {
  const { loads, bulkDeleteLoads, bulkUpdateStatus, bulkAssignDriver } = useLoads();
  const { user } = useAuth();
  const router = useRouter();
  const [selectedLoadIds, setSelectedLoadIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<LoadStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLoads = useMemo(() => {
    return loads.filter(load => {
      const matchesStatus = statusFilter === 'all' || load.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        load.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        load.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        load.id.includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
  }, [loads, statusFilter, searchQuery]);

  const allSelected = filteredLoads.length > 0 && selectedLoadIds.length === filteredLoads.length;
  const someSelected = selectedLoadIds.length > 0 && !allSelected;

  const handleToggleAll = () => {
    console.log('[BulkOperations] Toggling all loads');
    if (allSelected) {
      setSelectedLoadIds([]);
    } else {
      setSelectedLoadIds(filteredLoads.map(l => l.id));
    }
  };

  const handleToggleLoad = (loadId: string) => {
    console.log('[BulkOperations] Toggling load:', loadId);
    if (selectedLoadIds.includes(loadId)) {
      setSelectedLoadIds(selectedLoadIds.filter(id => id !== loadId));
    } else {
      setSelectedLoadIds([...selectedLoadIds, loadId]);
    }
  };

  const handleBulkDelete = () => {
    console.log('[BulkOperations] Bulk delete initiated for:', selectedLoadIds.length, 'loads');
    if (selectedLoadIds.length === 0) {
      Alert.alert('No Selection', 'Please select loads to delete');
      return;
    }

    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${selectedLoadIds.length} load${selectedLoadIds.length > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('[BulkOperations] Deleting loads:', selectedLoadIds);
            bulkDeleteLoads(selectedLoadIds);
            setSelectedLoadIds([]);
          },
        },
      ]
    );
  };

  const handleBulkUpdateStatus = (newStatus: LoadStatus) => {
    console.log('[BulkOperations] Bulk status update to:', newStatus, 'for', selectedLoadIds.length, 'loads');
    if (selectedLoadIds.length === 0) {
      Alert.alert('No Selection', 'Please select loads to update');
      return;
    }

    bulkUpdateStatus(selectedLoadIds, newStatus);
    setSelectedLoadIds([]);
    Alert.alert('Success', `Updated ${selectedLoadIds.length} load${selectedLoadIds.length > 1 ? 's' : ''} to ${newStatus}`);
  };

  const handleBulkAssignDriver = () => {
    console.log('[BulkOperations] Bulk assign driver initiated');
    if (selectedLoadIds.length === 0) {
      Alert.alert('No Selection', 'Please select loads to assign');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    Alert.alert(
      'Assign Driver',
      `Assign all ${selectedLoadIds.length} selected load${selectedLoadIds.length > 1 ? 's' : ''} to yourself?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Assign',
          onPress: () => {
            console.log('[BulkOperations] Assigning loads to driver:', user.id);
            bulkAssignDriver(selectedLoadIds, user.id);
            setSelectedLoadIds([]);
            Alert.alert('Success', `Assigned ${selectedLoadIds.length} load${selectedLoadIds.length > 1 ? 's' : ''}`);
          },
        },
      ]
    );
  };

  const getStatusColor = (status: LoadStatus) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'at_pickup':
        return '#3b82f6';
      case 'in_transit':
        return '#8b5cf6';
      case 'delivered':
        return '#22c55e';
      default:
        return '#64748b';
    }
  };

  const getStatusLabel = (status: LoadStatus) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'at_pickup':
        return 'At Pickup';
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#f1f5f9" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bulk Operations</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by location or ID..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterContainer}>
          <Filter size={16} color="#94a3b8" />
          <Text style={styles.filterLabel}>Filter:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterButtons}
          >
            {(['all', 'pending', 'at_pickup', 'in_transit', 'delivered'] as const).map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  statusFilter === status && styles.filterButtonActive,
                ]}
                onPress={() => setStatusFilter(status)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    statusFilter === status && styles.filterButtonTextActive,
                  ]}
                >
                  {status === 'all' ? 'All' : getStatusLabel(status)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.selectionBar}>
          <TouchableOpacity
            style={styles.selectAllButton}
            onPress={handleToggleAll}
          >
            {allSelected ? (
              <CheckSquare size={20} color="#f59e0b" />
            ) : someSelected ? (
              <CheckSquare size={20} color="#64748b" />
            ) : (
              <Square size={20} color="#64748b" />
            )}
            <Text style={styles.selectAllText}>
              {selectedLoadIds.length} of {filteredLoads.length} selected
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {filteredLoads.length === 0 ? (
          <View style={styles.emptyState}>
            <Package size={64} color="#475569" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No Loads Found</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Try different search terms' : 'No loads match the selected filters'}
            </Text>
          </View>
        ) : (
          filteredLoads.map(load => {
            const isSelected = selectedLoadIds.includes(load.id);
            return (
              <TouchableOpacity
                key={load.id}
                style={[styles.loadCard, isSelected && styles.loadCardSelected]}
                onPress={() => handleToggleLoad(load.id)}
              >
                <View style={styles.loadCardHeader}>
                  <View style={styles.checkboxContainer}>
                    {isSelected ? (
                      <CheckSquare size={24} color="#f59e0b" />
                    ) : (
                      <Square size={24} color="#64748b" />
                    )}
                  </View>
                  <View style={styles.loadCardContent}>
                    <View style={styles.loadCardTitleRow}>
                      <Text style={styles.loadId}>#{load.id.slice(-6)}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(load.status) }]}>
                        <Text style={styles.statusText}>{getStatusLabel(load.status)}</Text>
                      </View>
                    </View>
                    <View style={styles.routeRow}>
                      <Text style={styles.routeText} numberOfLines={1}>
                        {load.origin} → {load.destination}
                      </Text>
                    </View>
                    <View style={styles.detailsRow}>
                      <Text style={styles.detailText}>{load.claimedMiles} mi</Text>
                      <Text style={styles.detailText}>•</Text>
                      <Text style={styles.detailText}>${load.payAmount.toLocaleString()}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {selectedLoadIds.length > 0 && (
        <View style={styles.actionsBar}>
          <Text style={styles.actionsTitle}>{selectedLoadIds.length} Selected</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.actions}
          >
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonAssign]}
              onPress={handleBulkAssignDriver}
            >
              <User size={16} color="#ffffff" />
              <Text style={styles.actionButtonText}>Assign</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonPending]}
              onPress={() => handleBulkUpdateStatus('pending')}
            >
              <Check size={16} color="#ffffff" />
              <Text style={styles.actionButtonText}>Pending</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonPickup]}
              onPress={() => handleBulkUpdateStatus('at_pickup')}
            >
              <Check size={16} color="#ffffff" />
              <Text style={styles.actionButtonText}>At Pickup</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonTransit]}
              onPress={() => handleBulkUpdateStatus('in_transit')}
            >
              <Check size={16} color="#ffffff" />
              <Text style={styles.actionButtonText}>In Transit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonDelivered]}
              onPress={() => handleBulkUpdateStatus('delivered')}
            >
              <Check size={16} color="#ffffff" />
              <Text style={styles.actionButtonText}>Delivered</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonDelete]}
              onPress={handleBulkDelete}
            >
              <Trash2 size={16} color="#ffffff" />
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: '#f1f5f9',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  filterButtons: {
    gap: 8,
    paddingRight: 20,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#0f172a',
  },
  filterButtonActive: {
    backgroundColor: '#f59e0b',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#94a3b8',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  selectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#cbd5e1',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  loadCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#334155',
  },
  loadCardSelected: {
    borderColor: '#f59e0b',
    backgroundColor: '#1e293b',
  },
  loadCardHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  checkboxContainer: {
    paddingTop: 2,
  },
  loadCardContent: {
    flex: 1,
    gap: 8,
  },
  loadCardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loadId: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#94a3b8',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  routeRow: {
    flexDirection: 'row',
  },
  routeText: {
    fontSize: 15,
    color: '#cbd5e1',
    fontWeight: '500' as const,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500' as const,
  },
  emptyState: {
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
    textAlign: 'center',
  },
  actionsBar: {
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  actionsTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonAssign: {
    backgroundColor: '#6366f1',
  },
  actionButtonPending: {
    backgroundColor: '#f59e0b',
  },
  actionButtonPickup: {
    backgroundColor: '#3b82f6',
  },
  actionButtonTransit: {
    backgroundColor: '#8b5cf6',
  },
  actionButtonDelivered: {
    backgroundColor: '#22c55e',
  },
  actionButtonDelete: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
});
