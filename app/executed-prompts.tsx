import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, CheckCheck, Trash2 } from 'lucide-react-native';
import React from 'react';
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
import { useExecutedPrompts } from '@/contexts/ExecutedPromptsContext';

export default function ExecutedPromptsScreen() {
  const router = useRouter();
  const { getAllExecutedPrompts, clearExecutedPrompts } = useExecutedPrompts();

  const executedPrompts = getAllExecutedPrompts();

  console.log('[ExecutedPromptsScreen] Executed prompts count:', executedPrompts.length);

  const handleClearAll = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to clear all executed prompt history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearExecutedPrompts();
            console.log('[ExecutedPromptsScreen] All executed prompts cleared');
          },
        },
      ]
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Executed Prompts</Text>
          {executedPrompts.length > 0 && (
            <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
              <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {executedPrompts.length === 0 ? (
          <View style={styles.emptyState}>
            <CheckCheck size={64} color="#334155" />
            <Text style={styles.emptyTitle}>No Executed Prompts Yet</Text>
            <Text style={styles.emptyText}>
              When you mark prompts as executed from the business model screen, they will appear here with timestamps.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            <View style={styles.statsBar}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{executedPrompts.length}</Text>
                <Text style={styles.statLabel}>Total Executed</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {executedPrompts.filter(p => p.type === 'done').length}
                </Text>
                <Text style={styles.statLabel}>Improvements</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {executedPrompts.filter(p => p.type === 'undone').length}
                </Text>
                <Text style={styles.statLabel}>New Features</Text>
              </View>
            </View>

            {executedPrompts.map((prompt) => (
              <View key={prompt.id} style={styles.promptCard}>
                <View style={styles.promptHeader}>
                  <View style={styles.promptHeaderLeft}>
                    <CheckCheck size={20} color="#22c55e" />
                    <View style={styles.promptInfo}>
                      <Text style={styles.promptTitle}>{prompt.featureTitle}</Text>
                      <View style={styles.promptMeta}>
                        <View
                          style={[
                            styles.typeBadge,
                            {
                              backgroundColor:
                                prompt.type === 'done' ? '#22c55e20' : '#f59e0b20',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.typeBadgeText,
                              {
                                color: prompt.type === 'done' ? '#22c55e' : '#f59e0b',
                              },
                            ]}
                          >
                            {prompt.type === 'done' ? 'Improvement' : 'Implementation'}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.sourceBadge,
                            { backgroundColor: '#8b5cf620' },
                          ]}
                        >
                          <Text style={[styles.sourceBadgeText, { color: '#8b5cf6' }]}>
                            {prompt.source === 'business-model'
                              ? 'Business Model'
                              : 'System Suggestion'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.timestampRow}>
                  <Clock size={16} color="#64748b" />
                  <Text style={styles.timestampText}>{formatTimestamp(prompt.executedAt)}</Text>
                </View>

                <View style={styles.promptPreview}>
                  <Text style={styles.promptPreviewText} numberOfLines={3}>
                    {prompt.prompt}
                  </Text>
                </View>
              </View>
            ))}
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
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  list: {
    gap: 16,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#8b5cf6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#334155',
  },
  promptCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  promptHeaderLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  promptInfo: {
    flex: 1,
    gap: 8,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    lineHeight: 22,
  },
  promptMeta: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  sourceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sourceBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timestampText: {
    fontSize: 13,
    color: '#64748b',
  },
  promptPreview: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
  },
  promptPreviewText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 20,
    fontFamily: 'monospace',
  },
});
