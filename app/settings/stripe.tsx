import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useRouter, Redirect } from 'expo-router';
import { CreditCard, ChevronLeft, AlertCircle, CheckCircle } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StripeConfigurationScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { settings, updateSettings, isLoading } = useSettings();

  const [stripePublishableKey, setStripePublishableKey] = useState<string>('');
  const [stripeSecretKey, setStripeSecretKey] = useState<string>('');
  const [webhookSecret, setWebhookSecret] = useState<string>('');

  useEffect(() => {
    if (!isLoading && settings) {
      setStripePublishableKey(settings.stripePublishableKey || '');
      setStripeSecretKey(settings.stripeSecretKey || '');
      setWebhookSecret(settings.webhookSecret || '');
    }
  }, [settings, isLoading]);

  const validateKeys = (): boolean => {
    if (stripePublishableKey && !stripePublishableKey.startsWith('pk_')) {
      Alert.alert('Invalid Key', 'Publishable key must start with pk_test_ or pk_live_');
      return false;
    }
    if (stripeSecretKey && !stripeSecretKey.startsWith('sk_')) {
      Alert.alert('Invalid Key', 'Secret key must start with sk_test_ or sk_live_');
      return false;
    }
    if (webhookSecret && !webhookSecret.startsWith('whsec_')) {
      Alert.alert('Invalid Key', 'Webhook secret must start with whsec_');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateKeys()) return;

    updateSettings({
      stripePublishableKey,
      stripeSecretKey,
      webhookSecret,
    });
    Alert.alert('Success', 'Stripe configuration saved successfully!');
  };

  const isConfigured = stripePublishableKey && stripeSecretKey;

  if (user?.role !== 'admin') {
    return <Redirect href="/dashboard" />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color="#22c55e" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <CreditCard size={24} color="#22c55e" />
            <Text style={styles.headerTitle}>Stripe</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusCard}>
          {isConfigured ? (
            <>
              <CheckCircle size={32} color="#22c55e" />
              <Text style={styles.statusTitle}>Stripe Connected</Text>
              <Text style={styles.statusDescription}>
                Your app is connected to Stripe and ready to process payments
              </Text>
            </>
          ) : (
            <>
              <AlertCircle size={32} color="#f59e0b" />
              <Text style={styles.statusTitle}>Setup Required</Text>
              <Text style={styles.statusDescription}>
                Configure your Stripe API keys to enable payment processing
              </Text>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Keys</Text>
          <Text style={styles.sectionDescription}>
            Get your API keys from the Stripe Dashboard
          </Text>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Publishable Key</Text>
              <Text style={styles.inputHint}>
                Used in client-side code (safe to expose publicly)
              </Text>
              <TextInput
                style={styles.input}
                value={stripePublishableKey}
                onChangeText={setStripePublishableKey}
                placeholder="pk_test_... or pk_live_..."
                placeholderTextColor="#475569"
                autoCapitalize="none"
                autoCorrect={false}
                testID="stripe-publishable-key-input"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Secret Key</Text>
              <Text style={styles.inputHint}>
                Used in server-side code (keep this secure!)
              </Text>
              <TextInput
                style={styles.input}
                value={stripeSecretKey}
                onChangeText={setStripeSecretKey}
                placeholder="sk_test_... or sk_live_..."
                placeholderTextColor="#475569"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                testID="stripe-secret-key-input"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Webhooks (Optional)</Text>
          <Text style={styles.sectionDescription}>
            Configure webhook endpoint for real-time event notifications
          </Text>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Webhook Signing Secret</Text>
              <Text style={styles.inputHint}>
                Used to verify webhook events from Stripe
              </Text>
              <TextInput
                style={styles.input}
                value={webhookSecret}
                onChangeText={setWebhookSecret}
                placeholder="whsec_..."
                placeholderTextColor="#475569"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                testID="stripe-webhook-secret-input"
              />
            </View>
          </View>
        </View>

        <View style={styles.warningCard}>
          <AlertCircle size={20} color="#f59e0b" />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Security Notice</Text>
            <Text style={styles.warningText}>
              • Never share your secret key or webhook secret{'\n'}
              • Use test keys during development{'\n'}
              • Switch to live keys only in production{'\n'}
              • Keys are encrypted and stored locally
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave} 
          testID="save-stripe-button"
        >
          <Text style={styles.saveButtonText}>Save Configuration</Text>
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How to Get Your API Keys</Text>
          <View style={styles.stepsList}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                Go to stripe.com/dashboard and sign in
              </Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Click on &quot;Developers&quot; in the left sidebar
              </Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Select &quot;API keys&quot; to view your keys
              </Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>
                Copy and paste them here
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            Visit Stripe&apos;s documentation at stripe.com/docs for detailed setup instructions
          </Text>
        </View>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  statusCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 32,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginTop: 12,
    marginBottom: 8,
  },
  statusDescription: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 16,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#f1f5f9',
  },
  inputHint: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 20,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#422006',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f59e0b',
    marginBottom: 24,
    gap: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#fbbf24',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 13,
    color: '#fbbf24',
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  infoSection: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 16,
  },
  stepsList: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
    paddingTop: 4,
  },
  helpSection: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#f1f5f9',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 20,
  },
});
