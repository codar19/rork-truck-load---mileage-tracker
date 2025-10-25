import { useLoadTemplates } from '@/contexts/LoadTemplateContext';
import { useRouter } from 'expo-router';
import {
  BookmarkPlus,
  MapPin,
  Gauge,
  Trash2,
  ArrowLeft,
  Clock,
  TrendingUp,
  Plus,
  X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TemplatesScreen() {
  const { templates, addTemplate, deleteTemplate, getMostUsedTemplates, getRecentTemplates } = useLoadTemplates();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [claimedMiles, setClaimedMiles] = useState('');
  const [equipment, setEquipment] = useState('');

  const mostUsed = getMostUsedTemplates(3);
  const recent = getRecentTemplates(3);

  const handleAddTemplate = () => {
    console.log('[Templates] Adding new template');
    
    if (!name.trim() || !origin.trim() || !destination.trim() || !claimedMiles.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isNaN(Number(claimedMiles))) {
      Alert.alert('Error', 'Miles must be a valid number');
      return;
    }

    addTemplate({
      name: name.trim(),
      description: description.trim() || undefined,
      origin: origin.trim(),
      destination: destination.trim(),
      claimedMiles: Number(claimedMiles),
      equipment: equipment.trim() || undefined,
    });

    setShowAddModal(false);
    setName('');
    setDescription('');
    setOrigin('');
    setDestination('');
    setClaimedMiles('');
    setEquipment('');
  };

  const handleDeleteTemplate = (id: string, templateName: string) => {
    console.log('[Templates] Attempting to delete template:', id);
    Alert.alert(
      'Delete Template',
      `Are you sure you want to delete "${templateName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('[Templates] Deleting template:', id);
            deleteTemplate(id);
          },
        },
      ]
    );
  };

  const renderTemplateCard = (template: typeof templates[0], showStats: boolean = false) => (
    <View key={template.id} style={styles.templateCard}>
      <View style={styles.templateHeader}>
        <View style={styles.templateTitleContainer}>
          <BookmarkPlus size={20} color="#f59e0b" />
          <Text style={styles.templateName}>{template.name}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteTemplate(template.id, template.name)}
          style={styles.deleteButton}
        >
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {template.description && (
        <Text style={styles.templateDescription}>{template.description}</Text>
      )}

      <View style={styles.routeContainer}>
        <View style={styles.routePoint}>
          <MapPin size={14} color="#3b82f6" />
          <Text style={styles.routeText}>{template.origin}</Text>
        </View>
        <View style={styles.routeArrow}>
          <View style={styles.arrowLine} />
        </View>
        <View style={styles.routePoint}>
          <MapPin size={14} color="#ef4444" />
          <Text style={styles.routeText}>{template.destination}</Text>
        </View>
      </View>

      <View style={styles.templateDetails}>
        <View style={styles.detailItem}>
          <Gauge size={14} color="#64748b" />
          <Text style={styles.detailText}>{template.claimedMiles} mi</Text>
        </View>
        {template.equipment && (
          <View style={styles.detailItem}>
            <Text style={styles.detailText}>{template.equipment}</Text>
          </View>
        )}
      </View>

      {showStats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <TrendingUp size={12} color="#22c55e" />
            <Text style={styles.statText}>Used {template.useCount}x</Text>
          </View>
          {template.lastUsed && (
            <View style={styles.statItem}>
              <Clock size={12} color="#64748b" />
              <Text style={styles.statText}>
                {new Date(template.lastUsed).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#f1f5f9" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Load Templates</Text>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            style={styles.addButton}
          >
            <Plus size={24} color="#f59e0b" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {mostUsed.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color="#22c55e" />
              <Text style={styles.sectionTitle}>Most Used</Text>
            </View>
            {mostUsed.map(template => renderTemplateCard(template, true))}
          </View>
        )}

        {recent.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#3b82f6" />
              <Text style={styles.sectionTitle}>Recently Used</Text>
            </View>
            {recent.map(template => renderTemplateCard(template, true))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookmarkPlus size={20} color="#f59e0b" />
            <Text style={styles.sectionTitle}>All Templates ({templates.length})</Text>
          </View>
          {templates.length === 0 ? (
            <View style={styles.emptyState}>
              <BookmarkPlus size={64} color="#475569" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No Templates Yet</Text>
              <Text style={styles.emptyText}>
                Create templates for your frequent routes to save time
              </Text>
            </View>
          ) : (
            templates.map(template => renderTemplateCard(template, false))
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Template</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Template Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Chicago to Dallas"
                  placeholderTextColor="#64748b"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Optional notes about this route"
                  placeholderTextColor="#64748b"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Origin *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Chicago, IL"
                  placeholderTextColor="#64748b"
                  value={origin}
                  onChangeText={setOrigin}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Destination *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Dallas, TX"
                  placeholderTextColor="#64748b"
                  value={destination}
                  onChangeText={setDestination}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Miles *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="850"
                  placeholderTextColor="#64748b"
                  value={claimedMiles}
                  onChangeText={setClaimedMiles}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Equipment Type</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Dry Van, Reefer"
                  placeholderTextColor="#64748b"
                  value={equipment}
                  onChangeText={setEquipment}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.buttonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleAddTemplate}
              >
                <Text style={styles.buttonPrimaryText}>Create Template</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    padding: 8,
    marginRight: -8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
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
  templateCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    marginRight: -8,
  },
  templateDescription: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 12,
    lineHeight: 18,
  },
  routeContainer: {
    marginBottom: 12,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  routeText: {
    fontSize: 14,
    color: '#cbd5e1',
    fontWeight: '500' as const,
  },
  routeArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 7,
    marginVertical: 2,
  },
  arrowLine: {
    width: 2,
    height: 16,
    backgroundColor: '#334155',
  },
  templateDetails: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500' as const,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500' as const,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#f1f5f9',
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#f1f5f9',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#f59e0b',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#334155',
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  buttonSecondaryText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
