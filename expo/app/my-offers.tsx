import { useAuth } from '@/contexts/AuthContext';
import { useOffers } from '@/contexts/OfferContext';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Package,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyOffersScreen() {
  const { user } = useAuth();
  const { offers, availableLoads, withdrawOffer, isLoading } = useOffers();
  const router = useRouter();

  const myOffers = useMemo(() => {
    if (!user?.id) return [];
    return offers.filter(offer => offer.driverId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [offers, user?.id]);

  const pendingOffers = useMemo(() => myOffers.filter(o => o.status === 'pending'), [myOffers]);
  const acceptedOffers = useMemo(() => myOffers.filter(o => o.status === 'accepted'), [myOffers]);
  const rejectedOffers = useMemo(() => myOffers.filter(o => o.status === 'rejected'), [myOffers]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleWithdrawOffer = (offerId: string, loadInfo: string) => {
    Alert.alert(
      'Withdraw Offer',
      `Are you sure you want to withdraw your offer for ${loadInfo}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          style: 'destructive',
          onPress: () => {
            console.log('[MyOffers] Withdrawing offer:', offerId);
            withdrawOffer(offerId);
          },
        },
      ]
    );
  };

  const getLoadInfo = (loadId: string) => {
    return availableLoads.find(load => load.id === loadId);
  };

  const renderOfferCard = (offer: typeof offers[0]) => {
    const load = getLoadInfo(offer.loadId);
    if (!load) return null;

    const statusConfig = {
      pending: {
        icon: <Clock size={20} color="#f59e0b" />,
        color: '#f59e0b',
        bgColor: '#78350f',
        label: 'Pending',
      },
      accepted: {
        icon: <CheckCircle size={20} color="#22c55e" />,
        color: '#22c55e',
        bgColor: '#14532d',
        label: 'Accepted',
      },
      rejected: {
        icon: <XCircle size={20} color="#ef4444" />,
        color: '#ef4444',
        bgColor: '#7f1d1d',
        label: 'Rejected',
      },
      withdrawn: {
        icon: <AlertCircle size={20} color="#64748b" />,
        color: '#64748b',
        bgColor: '#1e293b',
        label: 'Withdrawn',
      },
    };

    const status = statusConfig[offer.status];

    return (
      <View key={offer.id} style={styles.offerCard}>
        <View style={styles.offerHeader}>
          <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
            {status.icon}
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
          <Text style={styles.timeText}>{formatDate(offer.createdAt)}</Text>
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

        <View style={styles.offerDetails}>
          <View style={styles.offerDetailRow}>
            <Text style={styles.detailLabel}>Your Offer:</Text>
            <Text style={styles.offerAmount}>${offer.offerAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.offerDetailRow}>
            <Text style={styles.detailLabel}>Suggested Pay:</Text>
            <Text style={styles.detailValue}>${load.suggestedPay.toLocaleString()}</Text>
          </View>
        </View>

        {offer.message && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageLabel}>Your Message:</Text>
            <Text style={styles.messageText}>{offer.message}</Text>
          </View>
        )}

        {offer.responseMessage && (
          <View style={[styles.messageContainer, styles.responseContainer]}>
            <Text style={styles.messageLabel}>Dispatcher Response:</Text>
            <Text style={styles.messageText}>{offer.responseMessage}</Text>
            {offer.respondedAt && (
              <Text style={styles.responseTime}>{formatDate(offer.respondedAt)}</Text>
            )}
          </View>
        )}

        {offer.status === 'pending' && (
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => handleWithdrawOffer(offer.id, `${load.origin} → ${load.destination}`)}
          >
            <Text style={styles.withdrawButtonText}>Withdraw Offer</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#f1f5f9" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Offers</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f59e0b" />
          <Text style={styles.loadingText}>Loading offers...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {myOffers.length === 0 ? (
            <View style={styles.emptyState}>
              <Package size={64} color="#475569" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No offers yet</Text>
              <Text style={styles.emptyText}>
                Browse the load board and make offers on loads
              </Text>
            </View>
          ) : (
            <>
              {pendingOffers.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Pending ({pendingOffers.length})
                  </Text>
                  {pendingOffers.map(renderOfferCard)}
                </View>
              )}

              {acceptedOffers.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Accepted ({acceptedOffers.length})
                  </Text>
                  {acceptedOffers.map(renderOfferCard)}
                </View>
              )}

              {rejectedOffers.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Rejected ({rejectedOffers.length})
                  </Text>
                  {rejectedOffers.map(renderOfferCard)}
                </View>
              )}
            </>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  placeholder: {
    width: 40,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#cbd5e1',
    marginBottom: 12,
  },
  offerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  timeText: {
    fontSize: 12,
    color: '#64748b',
  },
  routeContainer: {
    marginBottom: 12,
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
  offerDetails: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  offerDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  offerAmount: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#22c55e',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#cbd5e1',
  },
  messageContainer: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  responseContainer: {
    borderWidth: 1,
    borderColor: '#334155',
  },
  messageLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 6,
    textTransform: 'uppercase' as const,
    fontWeight: '600' as const,
  },
  messageText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  responseTime: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 8,
  },
  withdrawButton: {
    backgroundColor: '#7f1d1d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  withdrawButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#ef4444',
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
