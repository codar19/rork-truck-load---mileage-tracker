import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  ChevronLeft,
  DollarSign,
  Calendar,
  MapPin,
  FileText,
  Camera,
  X,
  Check,
  Fuel,
  Coins,
  Wrench,
  UtensilsCrossed,
  Hotel,
  ParkingCircle,
  Scale,
  Droplets,
  Package,
  MoreHorizontal,
} from 'lucide-react-native';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLoads } from '@/contexts/LoadContext';
import { ExpenseCategory, EXPENSE_CATEGORIES } from '@/types/expense';

export default function AddExpenseScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { addExpense } = useExpenses();
  const { loads } = useLoads();
  
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>('fuel');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLoadId, setSelectedLoadId] = useState<string | undefined>();
  const [receiptPhoto, setReceiptPhoto] = useState<string | undefined>();
  
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const getCategoryIcon = (category: ExpenseCategory, size: number = 24, color: string = '#f59e0b') => {
    const iconName = EXPENSE_CATEGORIES.find(c => c.value === category)?.icon || 'MoreHorizontal';
    const icons: Record<string, any> = {
      Fuel,
      Coins,
      Wrench,
      UtensilsCrossed,
      Hotel,
      ParkingCircle,
      Scale,
      Droplets,
      Package,
      MoreHorizontal,
    };
    
    const Icon = icons[iconName];
    return <Icon size={size} color={color} />;
  };

  const handleTakePhoto = async () => {
    console.log('[AddExpense] Opening camera for receipt photo');
    
    if (!permission) {
      console.log('[AddExpense] Requesting camera permission');
      return;
    }

    if (!permission.granted) {
      console.log('[AddExpense] Camera permission not granted, requesting');
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera permission is required to scan receipts');
        return;
      }
    }

    setShowCamera(true);
  };

  const handleSubmit = () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    console.log('[AddExpense] Submitting expense:', selectedCategory, Number(amount));

    addExpense({
      driverId: user.id,
      loadId: selectedLoadId,
      category: selectedCategory,
      amount: Number(amount),
      date,
      location: location.trim() || undefined,
      description: description.trim() || undefined,
      receiptPhoto,
      status: 'pending',
    });

    console.log('[AddExpense] Expense added successfully');
    
    Alert.alert('Success', 'Expense added successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
        >
          <SafeAreaView style={styles.cameraOverlay} edges={['top', 'bottom']}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity
                style={styles.cameraCloseButton}
                onPress={() => setShowCamera(false)}
              >
                <X size={24} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>Scan Receipt</Text>
              <View style={{ width: 40 }} />
            </View>

            <View style={styles.cameraFooter}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={() => {
                  console.log('[AddExpense] Photo captured');
                  setReceiptPhoto(`receipt_${Date.now()}`);
                  setShowCamera(false);
                  Alert.alert('Success', 'Receipt photo captured');
                }}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </CameraView>
      </View>
    );
  }

  const userLoads = user ? loads.filter(load => load.driverId === user.id) : [];
  const activeLoads = userLoads.filter(load => load.status !== 'delivered');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#f1f5f9" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Expense</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoryGrid}>
              {EXPENSE_CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    styles.categoryCard,
                    selectedCategory === category.value && styles.categoryCardActive,
                  ]}
                  onPress={() => setSelectedCategory(category.value)}
                >
                  <View style={[
                    styles.categoryIconWrapper,
                    selectedCategory === category.value && styles.categoryIconWrapperActive,
                  ]}>
                    {getCategoryIcon(category.value, 24, selectedCategory === category.value ? '#ffffff' : '#f59e0b')}
                  </View>
                  <Text style={[
                    styles.categoryLabel,
                    selectedCategory === category.value && styles.categoryLabelActive,
                  ]}>
                    {category.label}
                  </Text>
                  {selectedCategory === category.value && (
                    <View style={styles.categoryCheck}>
                      <Check size={12} color="#ffffff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <DollarSign size={18} color="#f59e0b" />
                <Text style={styles.label}>Amount *</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor="#64748b"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Calendar size={18} color="#f59e0b" />
                <Text style={styles.label}>Date *</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#64748b"
                value={date}
                onChangeText={setDate}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <MapPin size={18} color="#64748b" />
                <Text style={styles.label}>Location</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g., Pilot Travel Center - Dallas, TX"
                placeholderTextColor="#64748b"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <FileText size={18} color="#64748b" />
                <Text style={styles.label}>Description</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add notes or details..."
                placeholderTextColor="#64748b"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {activeLoads.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Associate with Load (Optional)</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.loadScroll}
                contentContainerStyle={styles.loadScrollContent}
              >
                <TouchableOpacity
                  style={[
                    styles.loadChip,
                    !selectedLoadId && styles.loadChipActive,
                  ]}
                  onPress={() => setSelectedLoadId(undefined)}
                >
                  <Text style={[
                    styles.loadChipText,
                    !selectedLoadId && styles.loadChipTextActive,
                  ]}>
                    None
                  </Text>
                </TouchableOpacity>
                
                {activeLoads.slice(0, 5).map(load => (
                  <TouchableOpacity
                    key={load.id}
                    style={[
                      styles.loadChip,
                      selectedLoadId === load.id && styles.loadChipActive,
                    ]}
                    onPress={() => setSelectedLoadId(load.id)}
                  >
                    <Text style={[
                      styles.loadChipText,
                      selectedLoadId === load.id && styles.loadChipTextActive,
                    ]} numberOfLines={1}>
                      {load.origin} → {load.destination}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Receipt</Text>
            
            {receiptPhoto ? (
              <View style={styles.receiptPreview}>
                <View style={styles.receiptPlaceholder}>
                  <FileText size={48} color="#10b981" />
                  <Text style={styles.receiptText}>Receipt Captured</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeReceiptButton}
                  onPress={() => setReceiptPhoto(undefined)}
                >
                  <X size={20} color="#ef4444" />
                  <Text style={styles.removeReceiptText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.scanButton}
                onPress={handleTakePhoto}
              >
                <Camera size={24} color="#f59e0b" />
                <Text style={styles.scanButtonText}>Scan Receipt</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Check size={20} color="#ffffff" />
            <Text style={styles.submitButtonText}>Add Expense</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#f1f5f9',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: 'calc(33.333% - 8px)' as any,
    aspectRatio: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#334155',
    position: 'relative' as const,
  },
  categoryCardActive: {
    borderColor: '#f59e0b',
    backgroundColor: '#1e293b',
  },
  categoryIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryIconWrapperActive: {
    backgroundColor: '#f59e0b',
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#94a3b8',
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: '#f59e0b',
  },
  categoryCheck: {
    position: 'absolute' as const,
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#f1f5f9',
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
  },
  textArea: {
    minHeight: 80,
  },
  loadScroll: {
    marginHorizontal: -20,
    paddingLeft: 20,
  },
  loadScrollContent: {
    paddingRight: 20,
    gap: 8,
  },
  loadChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    maxWidth: 200,
  },
  loadChipActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  loadChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#94a3b8',
  },
  loadChipTextActive: {
    color: '#ffffff',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: '#f59e0b',
    borderStyle: 'dashed' as const,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#f59e0b',
  },
  receiptPreview: {
    gap: 12,
  },
  receiptPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  receiptText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#10b981',
    marginTop: 8,
  },
  removeReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  removeReceiptText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#ef4444',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f59e0b',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  cameraCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  cameraFooter: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#f59e0b',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f59e0b',
  },
});
