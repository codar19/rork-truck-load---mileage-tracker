import { useAuth } from '@/contexts/AuthContext';
import { useOffers } from '@/contexts/OfferContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Calendar,
  Truck,
  Package,
  DollarSign,
  Weight,
  Clock,
  MessageSquare,
} from 'lucide-react-native';
import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AvailableLoadDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { availableLoads, submitOffer, hasDriverOfferedOnLoad, getOffersByLoad } = useOffers();
  const router = useRouter();

  const load = useMemo(() => availableLoads.find(l => l.id === id), [availableLoads, id]);

  const [offerAmount, setOfferAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasOffered = useMemo(
    () => (user?.id && load ? hasDriverOfferedOnLoad(user.id, load.id) : false),
    [user?.id, load, hasDriverOfferedOnLoad]
  );

  const existingOffers = useMemo(
    () => (load ? getOffersByLoad(load.id) : []),
    [load, getOffersByLoad]
  );

  if (!load) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Text style={styles.errorText}>Load not found</Text>
        </SafeAreaView>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };



  const ratePerMile = load.suggestedPay / load.claimedMiles;

  const handleSubmitOffer = () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to submit an offer');
      return;
    }

    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid offer amount');
      return;
    }

    if (amount < load.suggestedPay * 0.5) {
      Alert.alert(
        'Low Offer',
        'Your offer is significantly lower than suggested pay. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit Anyway', onPress: () => submitOfferConfirmed(amount) },
        ]
      );
      return;
    }

    submitOfferConfirmed(amount);
  };

  const submitOfferConfirmed = (amount: number) => {
    if (!user) return;

    setIsSubmitting(true);
    console.log('[AvailableLoad] Submitting offer:', { loadId: load.id, amount, message });
    
    try {
      submitOffer(load.id, user.id, user.name, amount, message);
      
      Alert.alert(
        'Offer Submitted',
        'Your offer has been submitted successfully. The dispatcher will review it and respond.',
        [
          {
            text: 'View My Offers',
            onPress: () => router.replace('/my-offers'),
          },
          {
            text: 'Back to Load Board',
            onPress: () => router.replace('/load-board'),
          },
        ]
      );
    } catch (error) {
      console.error('[AvailableLoad] Error submitting offer:', error);
      Alert.alert('Error', 'Failed to submit offer. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerCard}>
          <View style={styles.equipmentBadge}>
            <Truck size={18} color="#f59e0b" />
            <Text style={styles.equipmentText}>{load.equipment}</Text>
          </View>

          <View style={styles.paySection}>
            <Text style={styles.payLabel}>Suggested Pay</Text>
            <View style={styles.payRow}>
              <DollarSign size={28} color="#22c55e" />
              <Text style={styles.payAmount}>${load.suggestedPay.toLocaleString()}</Text>
            </View>
            <Text style={styles.rateText}>${ratePerMile.toFixed(2)}/mile</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Route</Text>
          <View style={styles.routeContainer}>
            <View style={styles.routePoint}>
              <View style={[styles.locationDot, { backgroundColor: '#3b82f6' }]} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Pickup</Text>
                <Text style={styles.locationText}>{load.origin}</Text>
                <View style={styles.dateRow}>
                  <Calendar size={14} color="#64748b" />
                  <Text style={styles.dateText}>{formatDate(load.pickupDate)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.routeLine} />

            <View style={styles.routePoint}>
              <View style={[styles.locationDot, { backgroundColor: '#ef4444' }]} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Delivery</Text>
                <Text style={styles.locationText}>{load.destination}</Text>
                <View style={styles.dateRow}>
                  <Calendar size={14} color="#64748b" />
                  <Text style={styles.dateText}>{formatDate(load.deliveryDate)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Load Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Truck size={20} color="#f59e0b" />
              <Text style={styles.detailValue}>{load.claimedMiles} mi</Text>
              <Text style={styles.detailLabel}>Distance</Text>
            </View>
            <View style={styles.detailItem}>
              <Weight size={20} color="#3b82f6" />
              <Text style={styles.detailValue}>{(load.weight / 1000).toFixed(1)}k</Text>
              <Text style={styles.detailLabel}>Weight (lbs)</Text>
            </View>
            <View style={styles.detailItem}>
              <Clock size={20} color="#8b5cf6" />
              <Text style={styles.detailValue}>
                {Math.ceil((new Date(load.deliveryDate).getTime() - new Date(load.pickupDate).getTime()) / 86400000)}d
              </Text>
              <Text style={styles.detailLabel}>Duration</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Description</Text>
          <Text style={styles.description}>{load.description}</Text>
        </View>

        {existingOffers.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Other Offers ({existingOffers.length})</Text>
            <Text style={styles.offersNote}>
              There {existingOffers.length === 1 ? 'is' : 'are'} {existingOffers.length} other{' '}
              {existingOffers.length === 1 ? 'offer' : 'offers'} on this load
            </Text>
          </View>
        )}

        {!hasOffered ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Make an Offer</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Offer Amount ($)</Text>
              <View style={styles.inputWrapper}>
                <DollarSign size={20} color="#94a3b8" />
                <TextInput
                  style={styles.input}
                  placeholder={load.suggestedPay.toString()}
                  placeholderTextColor="#64748b"
                  keyboardType="decimal-pad"
                  value={offerAmount}
                  onChangeText={setOfferAmount}
                  editable={!isSubmitting}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Message to Dispatcher (Optional)</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <MessageSquare size={20} color="#94a3b8" style={styles.textAreaIcon} />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add any additional information..."
                  placeholderTextColor="#64748b"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={message}
                  onChangeText={setMessage}
                  editable={!isSubmitting}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmitOffer}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Submitting...' : 'Submit Offer'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.alreadyOfferedCard}>
            <Package size={48} color="#f59e0b" />
            <Text style={styles.alreadyOfferedTitle}>Offer Already Submitted</Text>
            <Text style={styles.alreadyOfferedText}>
              You&apos;ve already submitted an offer for this load. Check &quot;My Offers&quot; to see the status.
            </Text>
            <TouchableOpacity
              style={styles.viewOffersButton}
              onPress={() => router.push('/my-offers')}
            >
              <Text style={styles.viewOffersButtonText}>View My Offers</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  equipmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  equipmentText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#f59e0b',
  },
  paySection: {
    alignItems: 'center',
  },
  payLabel: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 8,
  },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payAmount: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: '#22c55e',
  },
  rateText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 16,
  },
  routeContainer: {
    gap: 0,
  },
  routePoint: {
    flexDirection: 'row',
    gap: 16,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
  },
  locationInfo: {
    flex: 1,
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase' as const,
    fontWeight: '600' as const,
  },
  locationText: {
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '600' as const,
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  routeLine: {
    width: 2,
    height: 40,
    backgroundColor: '#334155',
    marginLeft: 5,
    marginVertical: -10,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#f1f5f9',
  },
  detailLabel: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#cbd5e1',
    lineHeight: 22,
  },
  offersNote: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#cbd5e1',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
  },
  textAreaIcon: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    color: '#f1f5f9',
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 0,
  },
  submitButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  alreadyOfferedCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 32,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  alreadyOfferedTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginTop: 16,
    marginBottom: 8,
  },
  alreadyOfferedText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  viewOffersButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  viewOffersButtonText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
});
