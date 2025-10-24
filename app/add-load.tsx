import { useLoads } from '@/contexts/LoadContext';
import { useRouter } from 'expo-router';
import { Sparkles, Package } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateObject } from '@rork/toolkit-sdk';
import { z } from 'zod';

const LoadSchema = z.object({
  origin: z.string().describe('Origin location/city'),
  destination: z.string().describe('Destination location/city'),
  claimedMiles: z.number().describe('Miles claimed by dispatcher'),
  payAmount: z.number().describe('Payment amount in dollars'),
  pickupDate: z.string().optional().describe('Pickup date if mentioned'),
  deliveryDate: z.string().optional().describe('Delivery date if mentioned'),
});

export default function AddLoadScreen() {
  const [dispatcherText, setDispatcherText] = useState('');
  const [odometerReading, setOdometerReading] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { addLoad } = useLoads();
  const router = useRouter();

  const handleParse = async () => {
    if (!dispatcherText.trim()) {
      Alert.alert('Error', 'Please paste the dispatcher text');
      return;
    }

    if (!odometerReading.trim() || isNaN(Number(odometerReading))) {
      Alert.alert('Error', 'Please enter a valid odometer reading');
      return;
    }

    setIsProcessing(true);

    try {
      const parsed = await generateObject({
        messages: [
          {
            role: 'user',
            content: `Parse this trucking load information and extract the key details:\n\n${dispatcherText}`,
          },
        ],
        schema: LoadSchema,
      });

      console.log('Parsed load data:', parsed);

      const loadId = addLoad({
        dispatcherText: dispatcherText.trim(),
        origin: parsed.origin,
        destination: parsed.destination,
        claimedMiles: parsed.claimedMiles,
        payAmount: parsed.payAmount,
        pickupDate: parsed.pickupDate,
        deliveryDate: parsed.deliveryDate,
        status: 'pending',
        odometerReadings: [
          {
            stage: 'received',
            reading: Number(odometerReading),
            timestamp: new Date().toISOString(),
          },
        ],
      });

      console.log('Load added with ID:', loadId);

      router.back();
      router.push({ pathname: '/load/[id]', params: { id: loadId } });
    } catch (error) {
      console.error('Error parsing load:', error);
      Alert.alert('Error', 'Failed to parse load information. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Package size={18} color="#f59e0b" />
              <Text style={styles.label}>Dispatcher Text</Text>
            </View>
            <Text style={styles.hint}>Paste the text message from your dispatcher</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Paste dispatcher message here..."
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={8}
              value={dispatcherText}
              onChangeText={setDispatcherText}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Current Odometer Reading</Text>
            </View>
            <Text style={styles.hint}>Enter your current odometer reading</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 125430"
              placeholderTextColor="#64748b"
              value={odometerReading}
              onChangeText={setOdometerReading}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isProcessing && styles.buttonDisabled]}
            onPress={handleParse}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Sparkles size={20} color="#ffffff" />
                <Text style={styles.buttonText}>Parse & Add Load</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#f1f5f9',
  },
  hint: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 10,
  },
  textArea: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#f1f5f9',
    minHeight: 140,
    borderWidth: 1,
    borderColor: '#334155',
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
  button: {
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
