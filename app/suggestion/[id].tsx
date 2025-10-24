import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Clock,
  Zap,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { SYSTEM_SUGGESTIONS } from '@/mocks/suggestions';

export default function SuggestionDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const suggestion = SYSTEM_SUGGESTIONS.find((s) => s.id === id);

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

  const handleCopyPrompt = async () => {
    await Clipboard.setStringAsync(suggestion.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoryColors = {
    feature: '#3b82f6',
    enhancement: '#8b5cf6',
    integration: '#22c55e',
    optimization: '#f59e0b',
  };

  const priorityColors = {
    low: '#64748b',
    medium: '#f59e0b',
    high: '#ef4444',
  };

  const categoryColor = categoryColors[suggestion.category];
  const priorityColor = priorityColors[suggestion.priority];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Suggestion Details</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{suggestion.title}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: categoryColor + '20' }]}>
              <Text style={[styles.badgeText, { color: categoryColor }]}>
                {suggestion.category}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: priorityColor + '20' }]}>
              <Text style={[styles.badgeText, { color: priorityColor }]}>
                {suggestion.priority} priority
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <Clock size={18} color="#f59e0b" />
            <Text style={styles.metaText}>{suggestion.estimatedTime}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{suggestion.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          <View style={styles.benefitsList}>
            {suggestion.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <CheckCircle size={18} color="#22c55e" />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {suggestion.requirements && suggestion.requirements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            <View style={styles.requirementsList}>
              {suggestion.requirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  <AlertCircle size={18} color="#f59e0b" />
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

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
          <View style={styles.promptContainer}>
            <ScrollView
              style={styles.promptScroll}
              contentContainerStyle={styles.promptScrollContent}
            >
              <Text style={styles.promptText}>{suggestion.prompt}</Text>
            </ScrollView>
          </View>
          <Text style={styles.promptHelp}>
            Copy this prompt and paste it in the chat to have the AI implement this feature for
            you.
          </Text>
        </View>

        <TouchableOpacity onPress={handleCopyPrompt} style={styles.actionButton}>
          <Copy size={20} color="#ffffff" />
          <Text style={styles.actionButtonText}>Copy Prompt & Get Started</Text>
        </TouchableOpacity>
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
  actionButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 40,
  },
});
