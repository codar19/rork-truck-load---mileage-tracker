import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Zap,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  Clock,
  CheckCheck,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { SYSTEM_SUGGESTIONS } from '@/mocks/suggestions';
import { useExecutedPrompts } from '@/contexts/ExecutedPromptsContext';

const FEATURE_SUGGESTIONS_MAP: Record<string, { done: string[]; undone: string[] }> = {
  '1': { 
    done: [
      'Add two-factor authentication (2FA) for enhanced security',
      'Implement password complexity requirements',
      'Add session timeout and auto-logout features',
      'Enable biometric login (fingerprint/face ID)'
    ], 
    undone: [
      'Implement multi-role authentication system',
      'Create secure login flow with JWT tokens',
      'Build role-based access control',
      'Add password reset functionality'
    ] 
  },
  '19': { 
    done: ['Integrate Stripe webhooks for payment events', 'Add subscription upgrade/downgrade flow'], 
    undone: ['Implement Stripe payment processing', 'Create subscription plan management', 'Add payment method storage'] 
  },
  '20': { 
    done: ['Add bulk user operations', 'Implement user activity logging'], 
    undone: ['Create user CRUD interface', 'Build role assignment system', 'Add user invitation system'] 
  },
  '21': { 
    done: ['Optimize database queries', 'Add database backup automation'], 
    undone: ['Connect to PostgreSQL/MySQL database', 'Implement data migration from AsyncStorage', 'Set up database connection pooling'] 
  },
  '22': { 
    done: ['Add scheduled export automation', 'Implement export templates'], 
    undone: ['Create CSV/Excel export functionality', 'Build export UI with date filters', 'Add email delivery for exports'] 
  },
  '23': { 
    done: ['Add advanced filters (status, date range, driver)', 'Implement saved searches'], 
    undone: ['Build search interface', 'Create load history view', 'Add fuzzy search capability'] 
  },
  '24': { 
    done: ['Add password change enforcement', 'Implement audit logging'], 
    undone: ['Implement secure password hashing', 'Add session management', 'Build API authentication'] 
  },
  '25': { 
    done: ['Add tablet-specific layouts', 'Optimize for landscape orientation'], 
    undone: ['Make app responsive to all screen sizes', 'Test on various devices', 'Optimize touch targets'] 
  },
  '26': { 
    done: ['Add error reporting to external service', 'Implement retry mechanisms'], 
    undone: ['Build error boundary components', 'Add user-friendly error messages', 'Implement offline error handling'] 
  },
  '27': { 
    done: ['Add notification preferences', 'Implement notification history'], 
    undone: ['Set up push notification service', 'Create notification triggers', 'Build notification UI'] 
  },
  '28': { 
    done: ['Add geofencing for pickup/delivery alerts', 'Show route history'], 
    undone: ['Implement GPS tracking', 'Build live map view', 'Add location privacy controls'] 
  },
  '29': { 
    done: ['Add OCR for document text extraction', 'Implement document versioning'], 
    undone: ['Create document upload system', 'Build document viewer', 'Add categorization and tagging'] 
  },
  '30': { 
    done: ['Add custom invoice templates', 'Implement automatic email delivery'], 
    undone: ['Build invoice generator', 'Create PDF generation', 'Add invoice numbering system'] 
  },
  '2': { done: ['Add load templates for frequent routes', 'Implement bulk load operations'], undone: ['Create load form', 'Build load list view', 'Add load detail screen'] },
  '3': { done: ['Add odometer history chart', 'Implement mileage alerts'], undone: ['Track odometer at each stage', 'Calculate distances', 'Show odometer verification'] },
  '4': { done: ['Add expense categories', 'Implement receipt scanning'], undone: ['Track all expense types', 'Calculate total expenses', 'Show expense breakdown'] },
  '5': { done: ['Add profit forecasting', 'Implement cost benchmarking'], undone: ['Calculate all costs', 'Show profit margin', 'Compare to payment'] },
  '6': { done: ['Add custom date ranges', 'Implement goal tracking'], undone: ['Build analytics dashboard', 'Show key metrics', 'Add charts and graphs'] },
  '7': { done: ['Add testimonials section', 'Implement pricing calculator'], undone: ['Create hero page', 'Add pricing plans', 'Build feature showcase'] },
  '8': { done: ['Add backup/restore settings', 'Implement settings export'], undone: ['Create settings screens', 'Build configuration UI', 'Add admin controls'] },
  '9': { done: ['Add customizable widgets', 'Implement quick actions'], undone: ['Build role-specific dashboards', 'Show relevant data', 'Add navigation'] },
  '10': { done: ['Add custom workflow stages', 'Implement automation rules'], undone: ['Track load status', 'Show progress timeline', 'Add status updates'] },
  '11': { done: ['Add dispatcher performance metrics', 'Implement team management'], undone: ['Assign dispatchers to drivers', 'Build assignment UI', 'Track relationships'] },
  '12': { done: ['Add AI training for parsing', 'Implement custom formats'], undone: ['Parse dispatch messages', 'Extract load details', 'Auto-fill form'] },
  '13': { done: ['Add fuel price tracking', 'Implement MPG calculation'], undone: ['Track fuel purchases', 'Calculate fuel costs', 'Show fuel efficiency'] },
  '14': { done: ['Add route replay', 'Implement mile verification'], undone: ['Track empty miles', 'Track loaded miles', 'Show mile breakdown'] },
  '15': { done: ['Add cost allocation rules', 'Implement custom rates'], undone: ['Calculate admin costs', 'Allocate by day', 'Include in profit calc'] },
  '16': { done: ['Add cloud sync', 'Implement data encryption'], undone: ['Store data locally', 'Persist across sessions', 'Handle offline mode'] },
  '17': { done: ['Add gesture navigation', 'Implement quick shortcuts'], undone: ['Build footer nav', 'Add key actions', 'Show across app'] },
  '18': { done: ['Add milestone tracking', 'Implement progress reports'], undone: ['Track features', 'Show completion status', 'Monitor progress'] },
};

function generatePrompt(featureTitle: string, description: string, suggestions: string[], status: 'done' | 'undone'): string {
  if (status === 'done') {
    return `I need to improve the "${featureTitle}" feature in my trucking management app.

Current feature: ${description}

Please implement these improvements:
${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Requirements:
- Maintain compatibility with existing functionality
- Follow the current code structure and patterns
- Use TypeScript with proper typing
- Add console logs for debugging
- Test on both mobile and web
- Use React Native components and StyleSheet

Please implement these improvements step by step.`;
  } else {
    return `I need to implement the "${featureTitle}" feature in my trucking management app.

Feature description: ${description}

Key requirements:
${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Technical requirements:
- Use TypeScript with strict typing
- Use React Native and Expo
- Follow mobile-first design patterns
- Use StyleSheet for styling
- Add proper error handling
- Include console logs for debugging
- Make it work on both iOS/Android and web
- Store data in AsyncStorage or context as appropriate

Please implement this feature step by step with all necessary files.`;
  }
}

export default function SuggestionDetail() {
  const { id, type, view } = useLocalSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const { addExecutedPrompt, hasExecutedPrompt, getExecutedPromptsByFeature, getPromptNumberForFeature, getUniquePromptId } = useExecutedPrompts();

  const featureId = Array.isArray(id) ? id[0] : id;
  const featureType = (Array.isArray(type) ? type[0] : type) as 'done' | 'undone';
  const viewMode = (Array.isArray(view) ? view[0] : view) || 'suggestions';

  const businessFeatures: Record<string, { title: string; description: string }> = {
    '1': { title: 'User Authentication', description: 'Multi-role login system with admin, dispatch, and driver roles' },
    '2': { title: 'Load Management', description: 'Add, edit, and track loads with all details' },
    '3': { title: 'Odometer Tracking', description: 'Track odometer readings at dispatch, pickup, and delivery' },
    '4': { title: 'Expense Management', description: 'Track fuel costs, tolls, daily truck expenses, and per-mile surcharges' },
    '5': { title: 'Profit Calculation', description: 'Calculate real profit by deducting all expenses from load payment' },
    '6': { title: 'Analytics Dashboard', description: 'View profit by date range, $/mile, $/day metrics' },
    '7': { title: 'Hero Landing Page', description: 'Marketing page with pricing plans and feature highlights' },
    '8': { title: 'Settings Management', description: 'Admin panel to configure app behavior and features' },
    '9': { title: 'Role-Based Dashboards', description: 'Customized dashboards for admin, dispatch, and driver roles' },
    '10': { title: 'Load Status Workflow', description: 'Track loads through pending, at pickup, in transit, and delivered stages' },
    '11': { title: 'Dispatcher Assignment', description: 'Assign dispatchers to manage specific drivers' },
    '12': { title: 'Dispatch Text Parsing', description: 'Parse load details from dispatcher text messages' },
    '13': { title: 'Fuel Cost Tracking', description: 'Track gallons, price per gallon, and total fuel cost per load' },
    '14': { title: 'Empty vs Loaded Miles', description: 'Differentiate between empty miles to pickup and loaded miles to delivery' },
    '15': { title: 'Admin Cost Allocation', description: 'Automatic daily admin cost calculation ($90/week divided by days)' },
    '16': { title: 'Persistent Data Storage', description: 'Store loads and user data locally with AsyncStorage' },
    '17': { title: 'Footer Navigation', description: 'Persistent bottom navigation for quick access to key features' },
    '18': { title: 'Business Model Tracking', description: 'Track feature completion and project progress' },
    '19': { title: 'Stripe Integration', description: 'Payment processing for subscription plans' },
    '20': { title: 'User Management System', description: 'Create, edit, and delete users with different roles' },
    '21': { title: 'Database Backend', description: 'Connect to real database instead of mock data' },
    '22': { title: 'Data Export', description: 'Export load and analytics data to CSV/Excel' },
    '23': { title: 'Load History & Search', description: 'Search and filter through historical loads' },
    '24': { title: 'Security & Authentication', description: 'Secure password management and session handling' },
    '25': { title: 'Mobile Responsiveness', description: 'Optimize for different screen sizes and orientations' },
    '26': { title: 'Error Handling', description: 'Comprehensive error handling and user feedback' },
    '27': { title: 'Real-time Notifications', description: 'Push notifications for load updates and status changes' },
    '28': { title: 'GPS Tracking', description: 'Track driver location in real-time during loads' },
    '29': { title: 'Document Management', description: 'Upload and manage load documents, BOLs, PODs' },
    '30': { title: 'Invoice Generation', description: 'Automatically generate invoices for completed loads' },
  };

  const feature = businessFeatures[featureId];
  const suggestionData = FEATURE_SUGGESTIONS_MAP[featureId];

  if (!feature || !suggestionData) {
    const suggestion = SYSTEM_SUGGESTIONS.find((s) => s.id === featureId);

    if (!suggestion) {
      return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color="#ffffff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Not Found</Text>
            </View>
          </SafeAreaView>
          <View style={styles.content}>
            <Text style={styles.errorText}>Suggestion not found</Text>
          </View>
        </View>
      );
    }

    return <Text>Feature not yet configured for suggestions</Text>;
  }

  const suggestions = featureType === 'done' ? suggestionData.done : suggestionData.undone;
  const prompt = generatePrompt(feature.title, feature.description, suggestions, featureType);

  const handleCopyPrompt = async () => {
    await Clipboard.setStringAsync(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecutePrompt = () => {
    console.log('[SuggestionDetail] Marking prompt as executed:', featureId, featureType);
    addExecutedPrompt({
      featureId,
      featureTitle: feature.title,
      type: featureType,
      prompt,
      source: 'business-model',
    });
    Alert.alert(
      'Prompt Executed',
      'This prompt has been marked as executed with a timestamp. You can view all executed prompts in the business model screen.',
      [{ text: 'OK' }]
    );
  };

  const isExecuted = hasExecutedPrompt(featureId, featureType);
  const executionHistory = getExecutedPromptsByFeature(featureId, featureType);
  const executedPromptNumber = getPromptNumberForFeature(featureId, featureType);
  const uniquePromptId = getUniquePromptId(featureId, featureType);
  const promptNumber = executedPromptNumber || uniquePromptId;

  const statusColor = featureType === 'done' ? '#22c55e' : '#f59e0b';
  const statusText = featureType === 'done' ? 'Improvement Suggestions' : 'Implementation Suggestions';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{viewMode === 'prompt' ? 'Prompt' : 'Suggestions'}</Text>
          <TouchableOpacity
            onPress={handleCopyPrompt}
            style={styles.headerCopyButton}
            testID="header-copy-button"
          >
            {copied ? (
              <Check size={20} color="#22c55e" />
            ) : (
              <Copy size={20} color="#8b5cf6" />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {viewMode === 'prompt' ? (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.titleSection}>
            <View style={styles.promptIdSection}>
              <View style={styles.promptIdBadge}>
                <Text style={styles.promptIdLabel}>Prompt ID</Text>
                <Text style={styles.promptIdNumber}>#{promptNumber}</Text>
              </View>
              {isExecuted && (
                <View style={styles.executedBadge}>
                  <CheckCheck size={16} color="#22c55e" />
                  <Text style={styles.executedBadgeText}>Executed</Text>
                </View>
              )}
            </View>
            <Text style={styles.title}>{feature.title}</Text>
            <View style={styles.badges}>
              <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
                <Text style={[styles.badgeText, { color: statusColor }]}>
                  {featureType === 'done' ? 'Improvement' : 'Implementation'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{feature.description}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.promptHeader}>
              <View style={styles.promptHeaderLeft}>
                <Zap size={20} color="#8b5cf6" />
                <Text style={styles.sectionTitle}>Implementation Prompt</Text>
              </View>
              <TouchableOpacity
                onPress={handleCopyPrompt}
                style={styles.copyButton}
                testID="copy-prompt-button"
              >
                {copied ? (
                  <>
                    <Check size={18} color="#22c55e" />
                    <Text style={[styles.copyButtonText, { color: '#22c55e' }]}>Copied!</Text>
                  </>
                ) : (
                  <>
                    <Copy size={18} color="#8b5cf6" />
                    <Text style={styles.copyButtonText}>Copy</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.promptContainerFull}>
              <Text style={styles.promptText}>{prompt}</Text>
            </View>
            <Text style={styles.promptHelp}>
              Copy this prompt and paste it in the chat to have the AI implement this feature for you.
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={handleCopyPrompt} style={styles.actionButton}>
              <Copy size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Copy Prompt</Text>
            </TouchableOpacity>
            {isExecuted ? (
              <View style={styles.executedIndicator}>
                <CheckCheck size={20} color="#22c55e" />
                <Text style={styles.executedText}>Already Executed (#{promptNumber})</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={handleExecutePrompt} style={styles.executeButton}>
                <Clock size={20} color="#ffffff" />
                <Text style={styles.executeButtonText}>Mark as Executed (#{promptNumber})</Text>
              </TouchableOpacity>
            )}
          </View>
          {executionHistory.length > 0 && (
            <View style={styles.historySection}>
              <Text style={styles.historyTitle}>Execution History</Text>
              {executionHistory.map((exec, index) => (
                <View key={exec.id} style={styles.historyItem}>
                  <View style={styles.historyNumberBadge}>
                    <Text style={styles.historyNumberText}>#{exec.promptNumber}</Text>
                  </View>
                  <Clock size={16} color="#64748b" />
                  <Text style={styles.historyText}>
                    {new Date(exec.executedAt).toLocaleDateString()} at {new Date(exec.executedAt).toLocaleTimeString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{feature.title}</Text>
            <View style={styles.badges}>
              <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
                <Text style={[styles.badgeText, { color: statusColor }]}>
                  {statusText}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{feature.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {featureType === 'done' ? 'Improvement Ideas' : 'Implementation Steps'}
            </Text>
            <View style={styles.benefitsList}>
              {suggestions.map((suggestion, index) => (
                <View key={index} style={styles.benefitItem}>
                  <CheckCircle size={18} color={statusColor} />
                  <Text style={styles.benefitText}>{suggestion}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.infoCard}>
            <AlertCircle size={20} color="#3b82f6" />
            <Text style={styles.infoText}>
              Click the &quot;Prompt&quot; button to get a ready-to-use prompt that you can copy and paste into the chat.
            </Text>
          </View>
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
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  headerCopyButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 12,
    lineHeight: 34,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    textTransform: 'capitalize',
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#cbd5e1',
    lineHeight: 24,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: '#cbd5e1',
    lineHeight: 22,
  },
  requirementsList: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  requirementText: {
    flex: 1,
    fontSize: 15,
    color: '#cbd5e1',
    lineHeight: 22,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  promptHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  copyButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#8b5cf6',
  },
  promptContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    maxHeight: 300,
  },
  promptContainerFull: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 16,
  },
  promptScroll: {
    maxHeight: 300,
  },
  promptScrollContent: {
    padding: 16,
  },
  promptText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
    fontFamily: 'monospace',
  },
  promptHelp: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 8,
    fontStyle: 'italic',
  },
  actionButtons: {
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  executeButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  executeButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  executedIndicator: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  executedText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#22c55e',
  },
  historySection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  historyNumberBadge: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    minWidth: 36,
    alignItems: 'center',
  },
  historyNumberText: {
    fontSize: 11,
    fontWeight: '800' as const,
    color: '#ffffff',
  },
  historyText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 40,
  },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3b82f6',
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  promptIdSection: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  promptIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  promptIdLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#e9d5ff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promptIdNumber: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#ffffff',
  },
  executedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#065f46',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  executedBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#22c55e',
  },
});
