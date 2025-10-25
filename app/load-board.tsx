import { useAuth } from '@/contexts/AuthContext';
import { useOffers } from '@/contexts/OfferContext';
import { useRouter } from 'expo-router';
import {
  Search,
  MapPin,
  DollarSign,
  Calendar,
  Truck,
  Package,
  X,
  Filter,
  ArrowLeft,
  ListOrdered,
  ArrowUpDown,
  ChevronDown,
} from 'lucide-react-native';
import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoadBoardScreen() {
  const { user } = useAuth();
  const { availableLoads, hasDriverOfferedOnLoad, isLoading } = useOffers();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<keyof Pick<typeof availableLoads[0], 'suggestedPay' | 'claimedMiles' | 'pickupDate' | 'deliveryDate' | 'weight' | 'origin' | 'destination' | 'equipment' | 'createdAt'>>('pickupDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showSortModal, setShowSortModal] = useState(false);

  const filteredLoads = useMemo(() => {
    let filtered = availableLoads;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        load =>
          load.origin.toLowerCase().includes(query) ||
          load.destination.toLowerCase().includes(query) ||
          load.equipment.toLowerCase().includes(query) ||
          load.description.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortBy === 'pickupDate' || sortBy === 'deliveryDate' || sortBy === 'createdAt') {
          comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
        } else {
          comparison = aValue.localeCompare(bValue);
        }
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    console.log(`[LoadBoard] Filtered and sorted ${filtered.length} loads by ${sortBy} (${sortOrder})`);

    return filtered;
  }, [availableLoads, searchQuery, sortBy, sortOrder]);



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderLoadCard = (load: typeof availableLoads[0]) => {
    const hasOffered = user?.id ? hasDriverOfferedOnLoad(user.id, load.id) : false;
    const ratePerMile = load.suggestedPay / load.claimedMiles;

    return (
      <TouchableOpacity
        key={load.id}
        style={[styles.loadCard, hasOffered && styles.loadCardOffered]}
        onPress={() => router.push({ pathname: '/available-load/[id]', params: { id: load.id } })}
        testID={`available-load-${load.id}`}
      >
        {hasOffered && (
          <View style={styles.offeredBadge}>
            <Text style={styles.offeredBadgeText}>Offer Submitted</Text>
          </View>
        )}

        <View style={styles.loadCardHeader}>
          <View style={styles.equipmentBadge}>
            <Truck size={14} color="#f59e0b" />
            <Text style={styles.equipmentText}>{load.equipment}</Text>
          </View>
          <View style={styles.payContainer}>
            <DollarSign size={18} color="#22c55e" />
            <Text style={styles.payAmount}>${load.suggestedPay.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routePoint}>
            <MapPin size={16} color="#3b82f6" />
            <Text style={styles.cityText} numberOfLines={1}>
              {load.origin}
            </Text>
          </View>
          <View style={styles.routeArrow}>
            <View style={styles.arrowLine} />
          </View>
          <View style={styles.routePoint}>
            <MapPin size={16} color="#ef4444" />
            <Text style={styles.cityText} numberOfLines={1}>
              {load.destination}
            </Text>
          </View>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Calendar size={14} color="#64748b" />
            <Text style={styles.detailLabel}>Pickup</Text>
            <Text style={styles.detailValue}>{formatDate(load.pickupDate)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Package size={14} color="#64748b" />
            <Text style={styles.detailLabel}>Weight</Text>
            <Text style={styles.detailValue}>{(load.weight / 1000).toFixed(1)}k</Text>
          </View>
          <View style={styles.detailItem}>
            <Truck size={14} color="#64748b" />
            <Text style={styles.detailLabel}>Miles</Text>
            <Text style={styles.detailValue}>{load.claimedMiles}</Text>
          </View>
          <View style={styles.detailItem}>
            <DollarSign size={14} color="#64748b" />
            <Text style={styles.detailLabel}>Rate/mi</Text>
            <Text style={styles.detailValue}>${ratePerMile.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {load.description}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#f1f5f9" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Load Board</Text>
            <TouchableOpacity
              onPress={() => router.push('/my-offers')}
              style={styles.offersButton}
            >
              <ListOrdered size={24} color="#f59e0b" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color="#64748b" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by location, equipment..."
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.filtersContainer}>
            <Filter size={16} color="#94a3b8" />
            <Text style={styles.filterLabel}>Sort:</Text>
            <TouchableOpacity
              style={styles.sortSelectorButton}
              onPress={() => setShowSortModal(true)}
            >
              <Text style={styles.sortSelectorText} numberOfLines={1}>
                {sortBy === 'suggestedPay' ? 'Pay' :
                 sortBy === 'claimedMiles' ? 'Miles' :
                 sortBy === 'pickupDate' ? 'Pickup Date' :
                 sortBy === 'deliveryDate' ? 'Delivery Date' :
                 sortBy === 'weight' ? 'Weight' :
                 sortBy === 'origin' ? 'Origin' :
                 sortBy === 'destination' ? 'Destination' :
                 sortBy === 'equipment' ? 'Equipment' :
                 sortBy === 'createdAt' ? 'Posted Date' : sortBy}
              </Text>
              <ChevronDown size={16} color="#f59e0b" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderButton}
              onPress={() => {
                setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                console.log(`[LoadBoard] Toggled sort order to ${sortOrder === 'asc' ? 'desc' : 'asc'}`);
              }}
            >
              <ArrowUpDown size={16} color="#f59e0b" />
              <Text style={styles.orderButtonText}>
                {sortOrder === 'asc' ? 'A→Z' : 'Z→A'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort By</Text>
            
            {[
              { key: 'suggestedPay' as const, label: 'Pay' },
              { key: 'claimedMiles' as const, label: 'Miles' },
              { key: 'pickupDate' as const, label: 'Pickup Date' },
              { key: 'deliveryDate' as const, label: 'Delivery Date' },
              { key: 'weight' as const, label: 'Weight' },
              { key: 'origin' as const, label: 'Origin (City)' },
              { key: 'destination' as const, label: 'Destination (City)' },
              { key: 'equipment' as const, label: 'Equipment Type' },
              { key: 'createdAt' as const, label: 'Posted Date' },
            ].map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.modalOption,
                  sortBy === key && styles.modalOptionActive
                ]}
                onPress={() => {
                  setSortBy(key);
                  setShowSortModal(false);
                  console.log(`[LoadBoard] Sort changed to ${key}`);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    sortBy === key && styles.modalOptionTextActive
                  ]}
                >
                  {label}
                </Text>
                {sortBy === key && (
                  <View style={styles.modalOptionCheck}>
                    <Text style={styles.modalOptionCheckText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowSortModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f59e0b" />
          <Text style={styles.loadingText}>Loading loads...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.resultCount}>
            {filteredLoads.length} load{filteredLoads.length !== 1 ? 's' : ''} available
          </Text>
          {filteredLoads.length === 0 ? (
            <View style={styles.emptyState}>
              <Package size={64} color="#475569" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No loads found</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Try different search terms' : 'Check back later for new loads'}
              </Text>
            </View>
          ) : (
            filteredLoads.map(renderLoadCard)
          )}
        </ScrollView>
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
    backgroundColor: '#1e293b',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  offersButton: {
    padding: 8,
    marginRight: -8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: '#f1f5f9',
    fontSize: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginRight: 4,
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
  sortSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#f59e0b',
    maxWidth: 140,
  },
  sortSelectorText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#f59e0b',
    flex: 1,
  },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  orderButtonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#f59e0b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#0f172a',
  },
  modalOptionActive: {
    backgroundColor: '#f59e0b',
  },
  modalOptionText: {
    fontSize: 15,
    color: '#cbd5e1',
    fontWeight: '500' as const,
  },
  modalOptionTextActive: {
    color: '#ffffff',
    fontWeight: '600' as const,
  },
  modalOptionCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionCheckText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#f59e0b',
  },
  modalCloseButton: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#334155',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#94a3b8',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  resultCount: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 16,
  },
  loadCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  loadCardOffered: {
    borderColor: '#f59e0b',
    borderWidth: 2,
  },
  offeredBadge: {
    position: 'absolute' as const,
    top: -8,
    right: 16,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  offeredBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  loadCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  equipmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  equipmentText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#f59e0b',
  },
  payContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  payAmount: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#22c55e',
  },
  routeContainer: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cityText: {
    fontSize: 15,
    color: '#cbd5e1',
    fontWeight: '500' as const,
    flex: 1,
  },
  routeArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    marginVertical: 4,
  },
  arrowLine: {
    width: 2,
    height: 20,
    backgroundColor: '#334155',
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#f1f5f9',
  },
  description: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
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
    textAlign: 'center',
  },
});
