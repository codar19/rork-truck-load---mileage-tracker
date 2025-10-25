import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import {
  ArrowLeft,
  Lightbulb,
  FileCode,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react-native';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePromptExecution } from '@/contexts/PromptExecutionContext';

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
  '3': { 
    done: [
      'Add odometer history chart', 
      'Implement mileage alerts'
    ], 
    undone: [
      'Track odometer at each stage', 
      'Calculate distances', 
      'Show odometer verification'
    ] 
  },
};

const businessFeatures: Record<string, { title: string; description: string }> = {
  '1': { title: 'User Authentication', description: 'Multi-role login system with admin, dispatch, and driver roles' },
  '2': { title: 'Load Management', description: 'Add, edit, and track loads with all details' },
  '3': { title: 'Odometer Tracking', description: 'Track odometer readings at dispatch, pickup, and delivery' },
  '4': { title: 'Expense Management', description: 'Track fuel costs, tolls, daily truck expenses, and per-mile surcharges' },
};

export default function FeatureSuggestionsScreen() {
  const { featureId } = useLocalSearchParams();
  const router = useRouter();
  const { isPromptExecuted, getLastExecution } = usePromptExecution();

  const id = Array.isArray(featureId) ? featureId[0] : featureId;
  const feature = businessFeatures[id];
  const suggestionData = FEATURE_SUGGESTIONS_MAP[id];

  if (!feature || !suggestionData) {
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
          <Text style={styles.errorText}>Feature not found</Text>
        </View>
      </View>
    );
  }

  const isDoneExecuted = isPromptExecuted(id, 'done');
  const isUndoneExecuted = isPromptExecuted(id, 'undone');
  const doneExecution = getLastExecution(id, 'done');
  const undoneExecution = getLastExecution(id, 'undone');

  const hasNewPrompts = !isDoneExecuted || !isUndoneExecuted;
  const hasExecutedPrompts = isDoneExecuted || isUndoneExecuted;

  const formatExecutionDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Suggestions</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{feature.title}</Text>
          <Text style={styles.description}>{feature.description}</Text>
        </View>

        {hasNewPrompts && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Sparkles size={20} color="#f59e0b" />
              <Text style={styles.sectionTitle}>New Suggestions</Text>
            </View>

            {!isDoneExecuted && suggestionData.done.length > 0 && (
              <View style={styles.promptCard}>
                <View style={styles.promptCardHeader}>
                  <View style={styles.promptCardLeft}>
                    <CheckCircle size={20} color="#22c55e" />
                    <Text style={styles.promptCardTitle}>Improvement Ideas</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: '#22c55e20' }]}>
                    <Text style={[styles.badgeText, { color: '#22c55e' }]}>New</Text>
                  </View>
                </View>
                <Text style={styles.promptCardDescription}>
                  Enhance the existing feature with {suggestionData.done.length} improvement{suggestionData.done.length > 1 ? 's' : ''}
                </Text>
                <View style={styles.actionButtons}>
                  <Link href={`/suggestion/${id}?type=done`} asChild>
                    <TouchableOpacity style={styles.actionButton}>
                      <Lightbulb size={14} color="#f59e0b" />
                      <Text style={styles.actionButtonText}>View Suggestions</Text>
                    </TouchableOpacity>
                  </Link>
                  <Link href={`/suggestion/${id}?type=done&view=prompt`} asChild>
                    <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]}>
                      <FileCode size={14} color="#ffffff" />
                      <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
                        Get Prompt
                      </Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            )}

            {!isUndoneExecuted && suggestionData.undone.length > 0 && (
              <View style={styles.promptCard}>
                <View style={styles.promptCardHeader}>
                  <View style={styles.promptCardLeft}>
                    <Lightbulb size={20} color="#f59e0b" />
                    <Text style={styles.promptCardTitle}>Implementation Ideas</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: '#f59e0b20' }]}>
                    <Text style={[styles.badgeText, { color: '#f59e0b' }]}>New</Text>
                  </View>
                </View>
                <Text style={styles.promptCardDescription}>
                  Build the foundation with {suggestionData.undone.length} implementation step{suggestionData.undone.length > 1 ? 's' : ''}
                </Text>
                <View style={styles.actionButtons}>
                  <Link href={`/suggestion/${id}?type=undone`} asChild>
                    <TouchableOpacity style={styles.actionButton}>
                      <Lightbulb size={14} color="#f59e0b" />
                      <Text style={styles.actionButtonText}>View Suggestions</Text>
                    </TouchableOpacity>
                  </Link>
                  <Link href={`/suggestion/${id}?type=undone&view=prompt`} asChild>
                    <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]}>
                      <FileCode size={14} color="#ffffff" />
                      <Text style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
                        Get Prompt
                      </Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            )}
          </View>
        )}

        {hasExecutedPrompts && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#64748b" />
              <Text style={[styles.sectionTitle, { color: '#94a3b8' }]}>Executed Prompts</Text>
            </View>

            {isDoneExecuted && doneExecution && (
              <View style={[styles.promptCard, styles.executedPromptCard]}>
                <View style={styles.promptCardHeader}>
                  <View style={styles.promptCardLeft}>
                    <CheckCircle size={20} color="#64748b" />
                    <Text style={[styles.promptCardTitle, { color: '#94a3b8' }]}>
                      Improvement Ideas
                    </Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: '#64748b20' }]}>
                    <CheckCircle size={10} color="#64748b" />
                    <Text style={[styles.badgeText, { color: '#64748b' }]}>Executed</Text>
                  </View>
                </View>
                <Text style={[styles.promptCardDescription, { color: '#64748b' }]}>
                  Executed {formatExecutionDate(doneExecution.executedAt)}
                </Text>
                <View style={styles.actionButtons}>
                  <Link href={`/suggestion/${id}?type=done`} asChild>
                    <TouchableOpacity style={styles.actionButton}>
                      <Lightbulb size={14} color="#64748b" />
                      <Text style={styles.actionButtonText}>View Suggestions</Text>
                    </TouchableOpacity>
                  </Link>
                  <Link href={`/suggestion/${id}?type=done&view=prompt`} asChild>
                    <TouchableOpacity style={styles.actionButton}>
                      <FileCode size={14} color="#64748b" />
                      <Text style={styles.actionButtonText}>View Prompt</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            )}

            {isUndoneExecuted && undoneExecution && (
              <View style={[styles.promptCard, styles.executedPromptCard]}>
                <View style={styles.promptCardHeader}>
                  <View style={styles.promptCardLeft}>
                    <Lightbulb size={20} color="#64748b" />
                    <Text style={[styles.promptCardTitle, { color: '#94a3b8' }]}>
                      Implementation Ideas
                    </Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: '#64748b20' }]}>
                    <CheckCircle size={10} color="#64748b" />
                    <Text style={[styles.badgeText, { color: '#64748b' }]}>Executed</Text>
                  </View>
                </View>
                <Text style={[styles.promptCardDescription, { color: '#64748b' }]}>
                  Executed {formatExecutionDate(undoneExecution.executedAt)}
                </Text>
                <View style={styles.actionButtons}>
                  <Link href={`/suggestion/${id}?type=undone`} asChild>
                    <TouchableOpacity style={styles.actionButton}>
                      <Lightbulb size={14} color="#64748b" />
                      <Text style={styles.actionButtonText}>View Suggestions</Text>
                    </TouchableOpacity>
                  </Link>
                  <Link href={`/suggestion/${id}?type=undone&view=prompt`} asChild>
                    <TouchableOpacity style={styles.actionButton}>
                      <FileCode size={14} color="#64748b" />
                      <Text style={styles.actionButtonText}>View Prompt</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            )}
          </View>
        )}

        {!hasNewPrompts && (
          <View style={styles.noNewPromptsCard}>
            <Sparkles size={32} color="#64748b" />
            <Text style={styles.noNewPromptsTitle}>No New Prompts Available</Text>
            <Text style={styles.noNewPromptsDescription}>
              All suggestions for this feature have been executed. Check back later for new recommendations.
            </Text>
          </View>
        )}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 8,
    lineHeight: 34,
  },
  description: {
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#f1f5f9',
  },
  promptCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  executedPromptCard: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
  },
  promptCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  promptCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promptCardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#f1f5f9',
  },
  promptCardDescription: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionButtonPrimary: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#94a3b8',
  },
  actionButtonTextPrimary: {
    color: '#ffffff',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 40,
  },
  noNewPromptsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 32,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    marginTop: 20,
  },
  noNewPromptsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noNewPromptsDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});
