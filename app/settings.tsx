import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useRouter } from 'expo-router';
import { Settings as SettingsIcon, ChevronLeft, CreditCard, Home } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { settings, updateSettings, isLoading } = useSettings();

  const [showHeroAsHomepage, setShowHeroAsHomepage] = useState<boolean>(false);
  const [showQuickLoginPage, setShowQuickLoginPage] = useState<boolean>(true);
  const [showQuickLoginOnHero, setShowQuickLoginOnHero] = useState<boolean>(true);
  const [stripePublishableKey, setStripePublishableKey] = useState<string>('');
  const [stripeSecretKey, setStripeSecretKey] = useState<string>('');

  useEffect(() => {
    if (!isLoading && settings) {
      setShowHeroAsHomepage(settings.showHeroAsHomepage);
      setShowQuickLoginPage(settings.showQuickLoginPage);
      setShowQuickLoginOnHero(settings.showQuickLoginOnHero);
      setStripePublishableKey(settings.stripePublishableKey);
      setStripeSecretKey(settings.stripeSecretKey);
    }
  }, [settings, isLoading]);

  const handleSave = () => {
    updateSettings({
      showHeroAsHomepage,
      showQuickLoginPage,
      showQuickLoginOnHero,
      stripePublishableKey,
      stripeSecretKey,
    });
    Alert.alert('Success', 'Settings saved successfully!');
  };

  if (user?.role !== 'admin') {
    router.replace('/dashboard');
    return null;
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
            <SettingsIcon size={24} color="#f59e0b" />
            <Text style={styles.headerTitle}>App Settings</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Home size={20} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Homepage Settings</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Control which page users see when they first visit the app
          </Text>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Show Hero Page as Homepage</Text>
                <Text style={styles.settingDescription}>
                  When enabled, unauthenticated users will see the hero page with pricing. 
                  When disabled, they&apos;ll be redirected to login.
                </Text>
                {showHeroAsHomepage && (
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Currently Active</Text>
                  </View>
                )}
              </View>
              <Switch
                value={showHeroAsHomepage}
                onValueChange={setShowHeroAsHomepage}
                trackColor={{ false: '#334155', true: '#f59e0b' }}
                thumbColor={showHeroAsHomepage ? '#ffffff' : '#94a3b8'}
                testID="hero-homepage-toggle"
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Show Quick Login Page</Text>
                <Text style={styles.settingDescription}>
                  Controls whether the Quick Login development page is accessible.
                </Text>
              </View>
              <Switch
                value={showQuickLoginPage}
                onValueChange={setShowQuickLoginPage}
                trackColor={{ false: '#334155', true: '#f59e0b' }}
                thumbColor={showQuickLoginPage ? '#ffffff' : '#94a3b8'}
                testID="quick-login-page-toggle"
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Show Quick Login on Hero Page</Text>
                <Text style={styles.settingDescription}>
                  When enabled, Quick Login buttons will appear on the Hero page for easy testing.
                </Text>
              </View>
              <Switch
                value={showQuickLoginOnHero}
                onValueChange={setShowQuickLoginOnHero}
                trackColor={{ false: '#334155', true: '#f59e0b' }}
                thumbColor={showQuickLoginOnHero ? '#ffffff' : '#94a3b8'}
                testID="quick-login-hero-toggle"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color="#22c55e" />
            <Text style={styles.sectionTitle}>Stripe Configuration</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Configure your Stripe API keys for payment processing
          </Text>

          <View style={styles.settingCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Stripe Publishable Key</Text>
              <Text style={styles.inputHint}>
                Starts with pk_test_ or pk_live_
              </Text>
              <TextInput
                style={styles.input}
                value={stripePublishableKey}
                onChangeText={setStripePublishableKey}
                placeholder="pk_live_..."
                placeholderTextColor="#475569"
                autoCapitalize="none"
                autoCorrect={false}
                testID="stripe-publishable-key-input"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Stripe Secret Key</Text>
              <Text style={styles.inputHint}>
                Starts with sk_test_ or sk_live_ (Keep this secure!)
              </Text>
              <TextInput
                style={styles.input}
                value={stripeSecretKey}
                onChangeText={setStripeSecretKey}
                placeholder="sk_live_..."
                placeholderTextColor="#475569"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                testID="stripe-secret-key-input"
              />
            </View>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              🔒 Your Stripe keys are stored locally and encrypted. Never share your secret key.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} testID="save-settings-button">
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Need Help?</Text>
          <Text style={styles.infoText}>
            • Get your Stripe API keys from stripe.com/dashboard{'\n'}
            • Use test keys during development{'\n'}
            • The hero page will only show when enabled and user is not authenticated{'\n'}
            • Changes take effect immediately after saving
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
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#f1f5f9',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 16,
    lineHeight: 20,
  },
  settingCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#f1f5f9',
    marginBottom: 6,
  },
  settingDescription: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#22c55e',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#ffffff',
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
  warningBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#422006',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  warningText: {
    fontSize: 12,
    color: '#fbbf24',
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: '#f59e0b',
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
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#f1f5f9',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 20,
  },
});
