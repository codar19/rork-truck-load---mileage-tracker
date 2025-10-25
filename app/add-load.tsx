import { useLoads } from '@/contexts/LoadContext';
import { useLoadTemplates } from '@/contexts/LoadTemplateContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { 
  Sparkles, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Gauge,
  ChevronRight,
  ChevronLeft,
  Check,
  Truck,
  BookmarkPlus,
} from 'lucide-react-native';
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

type StepId = 'method' | 'template' | 'dispatch' | 'details' | 'odometer' | 'review';

interface Step {
  id: StepId;
  title: string;
  icon: React.ReactNode;
}

export default function AddLoadScreen() {
  const [currentStep, setCurrentStep] = useState<StepId>('method');
  const [method, setMethod] = useState<'ai' | 'manual' | 'template' | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  
  const [dispatcherText, setDispatcherText] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [claimedMiles, setClaimedMiles] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [odometerReading, setOdometerReading] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { addLoad } = useLoads();
  const { templates, incrementTemplateUsage, addTemplate, getRecentTemplates } = useLoadTemplates();
  const { user } = useAuth();
  const router = useRouter();

  const recentTemplates = getRecentTemplates(5);

  const steps: Step[] = [
    { id: 'method', title: 'Choose Method', icon: <Sparkles size={20} color="#f59e0b" /> },
    ...(method === 'template'
      ? [{ id: 'template' as StepId, title: 'Select Template', icon: <BookmarkPlus size={20} color="#f59e0b" /> }]
      : method === 'ai' 
      ? [{ id: 'dispatch' as StepId, title: 'Dispatch Text', icon: <Truck size={20} color="#f59e0b" /> }]
      : [{ id: 'details' as StepId, title: 'Load Details', icon: <MapPin size={20} color="#f59e0b" /> }]
    ),
    { id: 'odometer' as StepId, title: 'Odometer', icon: <Gauge size={20} color="#f59e0b" /> },
    { id: 'review' as StepId, title: 'Review', icon: <Check size={20} color="#f59e0b" /> },
  ];

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);

  const handleParseDispatch = async () => {
    if (!dispatcherText.trim()) {
      Alert.alert('Error', 'Please paste the dispatcher text');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('[AddLoad] Parsing dispatcher text with AI');
      const parsed = await generateObject({
        messages: [
          {
            role: 'user',
            content: `Parse this trucking load information and extract the key details:\n\n${dispatcherText}`,
          },
        ],
        schema: LoadSchema,
      });

      console.log('[AddLoad] Parsed load data:', parsed);
      setOrigin(parsed.origin);
      setDestination(parsed.destination);
      setClaimedMiles(parsed.claimedMiles.toString());
      setPayAmount(parsed.payAmount.toString());
      setPickupDate(parsed.pickupDate || '');
      setDeliveryDate(parsed.deliveryDate || '');
      
      setCurrentStep('odometer');
    } catch (error) {
      console.error('[AddLoad] Error parsing load:', error);
      Alert.alert('Error', 'Failed to parse load information. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = async () => {
    console.log('[AddLoad] Moving to next step from:', currentStep);
    
    if (currentStep === 'method') {
      if (!method) {
        Alert.alert('Error', 'Please select a method');
        return;
      }
      if (method === 'template') {
        setCurrentStep('template');
      } else {
        setCurrentStep(method === 'ai' ? 'dispatch' : 'details');
      }
    } else if (currentStep === 'template') {
      if (!selectedTemplateId) {
        Alert.alert('Error', 'Please select a template');
        return;
      }
      const template = templates.find(t => t.id === selectedTemplateId);
      if (template) {
        console.log('[AddLoad] Applying template:', template.name);
        setOrigin(template.origin);
        setDestination(template.destination);
        setClaimedMiles(template.claimedMiles.toString());
        setPayAmount('');
        incrementTemplateUsage(template.id);
      }
      setCurrentStep('details');
    } else if (currentStep === 'dispatch') {
      await handleParseDispatch();
    } else if (currentStep === 'details') {
      if (!origin.trim() || !destination.trim() || !claimedMiles.trim() || !payAmount.trim()) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      if (isNaN(Number(claimedMiles)) || isNaN(Number(payAmount))) {
        Alert.alert('Error', 'Miles and pay amount must be valid numbers');
        return;
      }
      setCurrentStep('odometer');
    } else if (currentStep === 'odometer') {
      if (!odometerReading.trim() || isNaN(Number(odometerReading))) {
        Alert.alert('Error', 'Please enter a valid odometer reading');
        return;
      }
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    console.log('[AddLoad] Going back from:', currentStep);
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleSubmit = () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    console.log('[AddLoad] Submitting load');

    if (saveAsTemplate && templateName.trim()) {
      console.log('[AddLoad] Saving as template:', templateName);
      addTemplate({
        name: templateName.trim(),
        origin: origin.trim(),
        destination: destination.trim(),
        claimedMiles: Number(claimedMiles),
      });
    }
    
    const loadId = addLoad({
      dispatcherText: method === 'ai' ? dispatcherText.trim() : `Manual: ${origin} → ${destination}`,
      driverId: user.id,
      dispatchId: user.dispatchId || user.id,
      origin: origin.trim(),
      destination: destination.trim(),
      claimedMiles: Number(claimedMiles),
      payAmount: Number(payAmount),
      pickupDate: pickupDate || undefined,
      deliveryDate: deliveryDate || undefined,
      status: 'pending',
      odometerReadings: [
        {
          stage: 'received',
          reading: Number(odometerReading),
          timestamp: new Date().toISOString(),
        },
      ],
    });

    console.log('[AddLoad] Load added with ID:', loadId);

    router.back();
    router.push({ pathname: '/load/[id]', params: { id: loadId } });
  };

  const renderStepIndicator = () => {
    const currentIndex = getCurrentStepIndex();
    
    return (
      <View style={styles.stepIndicator}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <View style={styles.stepItem}>
              <View style={[
                styles.stepCircle,
                index <= currentIndex && styles.stepCircleActive,
                index < currentIndex && styles.stepCircleCompleted,
              ]}>
                {index < currentIndex ? (
                  <Check size={16} color="#ffffff" strokeWidth={3} />
                ) : (
                  <Text style={[
                    styles.stepNumber,
                    index <= currentIndex && styles.stepNumberActive,
                  ]}>
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text style={[
                styles.stepLabel,
                index <= currentIndex && styles.stepLabelActive,
              ]}>
                {step.title}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View style={[
                styles.stepLine,
                index < currentIndex && styles.stepLineActive,
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const renderMethodStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.header}>
        <Sparkles size={32} color="#f59e0b" />
        <Text style={styles.title}>How would you like to add this load?</Text>
        <Text style={styles.subtitle}>Choose your preferred input method</Text>
      </View>

      <View style={styles.methodContainer}>
        <TouchableOpacity
          style={[styles.methodCard, method === 'ai' && styles.methodCardActive]}
          onPress={() => setMethod('ai')}
        >
          <View style={styles.methodIcon}>
            <Sparkles size={32} color={method === 'ai' ? '#f59e0b' : '#64748b'} />
          </View>
          <Text style={[styles.methodTitle, method === 'ai' && styles.methodTitleActive]}>
            AI Parse
          </Text>
          <Text style={styles.methodDescription}>
            Paste dispatcher text and let AI extract the details automatically
          </Text>
          {method === 'ai' && (
            <View style={styles.selectedBadge}>
              <Check size={16} color="#ffffff" />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodCard, method === 'manual' && styles.methodCardActive]}
          onPress={() => setMethod('manual')}
        >
          <View style={styles.methodIcon}>
            <MapPin size={32} color={method === 'manual' ? '#f59e0b' : '#64748b'} />
          </View>
          <Text style={[styles.methodTitle, method === 'manual' && styles.methodTitleActive]}>
            Manual Entry
          </Text>
          <Text style={styles.methodDescription}>
            Enter load details manually field by field
          </Text>
          {method === 'manual' && (
            <View style={styles.selectedBadge}>
              <Check size={16} color="#ffffff" />
            </View>
          )}
        </TouchableOpacity>

        {templates.length > 0 && (
          <TouchableOpacity
            style={[styles.methodCard, method === 'template' && styles.methodCardActive]}
            onPress={() => setMethod('template')}
          >
            <View style={styles.methodIcon}>
              <BookmarkPlus size={32} color={method === 'template' ? '#f59e0b' : '#64748b'} />
            </View>
            <Text style={[styles.methodTitle, method === 'template' && styles.methodTitleActive]}>
              From Template
            </Text>
            <Text style={styles.methodDescription}>
              Use a saved template for frequent routes ({templates.length} available)
            </Text>
            {method === 'template' && (
              <View style={styles.selectedBadge}>
                <Check size={16} color="#ffffff" />
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderDispatchStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.header}>
        <Truck size={32} color="#f59e0b" />
        <Text style={styles.title}>Paste Dispatcher Message</Text>
        <Text style={styles.subtitle}>Copy and paste the message from your dispatcher</Text>
      </View>

      <View style={styles.formSection}>
        <TextInput
          style={styles.textArea}
          placeholder="Example: Load from Chicago, IL to Dallas, TX. 850 miles. $1,800. Pickup tomorrow 8am..."
          placeholderTextColor="#64748b"
          multiline
          numberOfLines={12}
          value={dispatcherText}
          onChangeText={setDispatcherText}
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  const renderDetailsStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.header}>
        <MapPin size={32} color="#f59e0b" />
        <Text style={styles.title}>Load Details</Text>
        <Text style={styles.subtitle}>Enter the load information manually</Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.inputGroup}>
          <View style={styles.inputLabel}>
            <MapPin size={18} color="#f59e0b" />
            <Text style={styles.label}>Origin *</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="e.g., Chicago, IL"
            placeholderTextColor="#64748b"
            value={origin}
            onChangeText={setOrigin}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputLabel}>
            <MapPin size={18} color="#f59e0b" />
            <Text style={styles.label}>Destination *</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="e.g., Dallas, TX"
            placeholderTextColor="#64748b"
            value={destination}
            onChangeText={setDestination}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <View style={styles.inputLabel}>
              <Gauge size={18} color="#f59e0b" />
              <Text style={styles.label}>Miles *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="850"
              placeholderTextColor="#64748b"
              value={claimedMiles}
              onChangeText={setClaimedMiles}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <View style={styles.inputLabel}>
              <DollarSign size={18} color="#f59e0b" />
              <Text style={styles.label}>Pay *</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="1800"
              placeholderTextColor="#64748b"
              value={payAmount}
              onChangeText={setPayAmount}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <View style={styles.inputLabel}>
              <Calendar size={18} color="#64748b" />
              <Text style={styles.label}>Pickup Date</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Optional"
              placeholderTextColor="#64748b"
              value={pickupDate}
              onChangeText={setPickupDate}
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <View style={styles.inputLabel}>
              <Calendar size={18} color="#64748b" />
              <Text style={styles.label}>Delivery Date</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Optional"
              placeholderTextColor="#64748b"
              value={deliveryDate}
              onChangeText={setDeliveryDate}
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderOdometerStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.header}>
        <Gauge size={32} color="#f59e0b" />
        <Text style={styles.title}>Current Odometer</Text>
        <Text style={styles.subtitle}>Enter your current odometer reading</Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.odometerCard}>
          <View style={styles.odometerDisplay}>
            <Text style={styles.odometerValue}>
              {odometerReading || '000000'}
            </Text>
            <Text style={styles.odometerLabel}>MILES</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, styles.odometerInput]}
            placeholder="Enter odometer reading"
            placeholderTextColor="#64748b"
            value={odometerReading}
            onChangeText={setOdometerReading}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  const renderReviewStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.header}>
        <Check size={32} color="#f59e0b" />
        <Text style={styles.title}>Review Load</Text>
        <Text style={styles.subtitle}>Verify all information before submitting</Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.reviewCard}>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Origin</Text>
            <Text style={styles.reviewValue}>{origin}</Text>
          </View>
          <View style={styles.reviewDivider} />
          
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Destination</Text>
            <Text style={styles.reviewValue}>{destination}</Text>
          </View>
          <View style={styles.reviewDivider} />
          
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Miles</Text>
            <Text style={styles.reviewValue}>{claimedMiles} mi</Text>
          </View>
          <View style={styles.reviewDivider} />
          
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Pay Amount</Text>
            <Text style={styles.reviewValue}>${payAmount}</Text>
          </View>
          <View style={styles.reviewDivider} />
          
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Odometer</Text>
            <Text style={styles.reviewValue}>{odometerReading} mi</Text>
          </View>
          
          {(pickupDate || deliveryDate) && (
            <>
              <View style={styles.reviewDivider} />
              {pickupDate && (
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Pickup Date</Text>
                  <Text style={styles.reviewValue}>{pickupDate}</Text>
                </View>
              )}
              {deliveryDate && (
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Delivery Date</Text>
                  <Text style={styles.reviewValue}>{deliveryDate}</Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );

  const renderTemplateStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.header}>
        <BookmarkPlus size={32} color="#f59e0b" />
        <Text style={styles.title}>Select a Template</Text>
        <Text style={styles.subtitle}>Choose from your saved routes</Text>
      </View>

      <View style={styles.templateList}>
        {(recentTemplates.length > 0 ? recentTemplates : templates.slice(0, 10)).map(template => (
          <TouchableOpacity
            key={template.id}
            style={[
              styles.templateOption,
              selectedTemplateId === template.id && styles.templateOptionActive,
            ]}
            onPress={() => setSelectedTemplateId(template.id)}
          >
            <View style={styles.templateOptionContent}>
              <View style={styles.templateOptionHeader}>
                <Text style={[
                  styles.templateOptionName,
                  selectedTemplateId === template.id && styles.templateOptionNameActive,
                ]}>
                  {template.name}
                </Text>
                {selectedTemplateId === template.id && (
                  <View style={styles.templateCheckBadge}>
                    <Check size={14} color="#ffffff" />
                  </View>
                )}
              </View>
              <View style={styles.templateOptionRoute}>
                <Text style={styles.templateOptionText} numberOfLines={1}>
                  {template.origin} → {template.destination}
                </Text>
              </View>
              <View style={styles.templateOptionDetails}>
                <Text style={styles.templateOptionSubtext}>{template.claimedMiles} mi</Text>
                {template.useCount > 0 && (
                  <Text style={styles.templateOptionSubtext}>• Used {template.useCount}x</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {templates.length > 10 && (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => router.push('/templates')}
          >
            <Text style={styles.viewAllText}>View All Templates ({templates.length})</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'method':
        return renderMethodStep();
      case 'template':
        return renderTemplateStep();
      case 'dispatch':
        return renderDispatchStep();
      case 'details':
        return renderDetailsStep();
      case 'odometer':
        return renderOdometerStep();
      case 'review':
        return renderReviewStep();
      default:
        return null;
    }
  };

  const isLastStep = currentStep === 'review';
  const isFirstStep = getCurrentStepIndex() === 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {renderStepIndicator()}
          {renderCurrentStep()}
        </ScrollView>

        <View style={styles.footer}>
          {!isFirstStep && (
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleBack}
              disabled={isProcessing}
            >
              <ChevronLeft size={20} color="#f59e0b" />
              <Text style={styles.buttonSecondaryText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.button, 
              styles.buttonPrimary,
              isFirstStep && styles.buttonFullWidth,
              isProcessing && styles.buttonDisabled,
            ]}
            onPress={isLastStep ? handleSubmit : handleNext}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text style={styles.buttonPrimaryText}>
                  {isLastStep ? 'Submit Load' : 'Continue'}
                </Text>
                {!isLastStep && <ChevronRight size={20} color="#ffffff" />}
              </>
            )}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  stepItem: {
    alignItems: 'center',
    gap: 6,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  stepCircleActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  stepCircleCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#64748b',
  },
  stepNumberActive: {
    color: '#ffffff',
  },
  stepLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600' as const,
  },
  stepLabelActive: {
    color: '#f1f5f9',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#334155',
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: '#10b981',
  },
  stepContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginTop: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  methodContainer: {
    gap: 16,
  },
  methodCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#334155',
    position: 'relative' as const,
  },
  methodCardActive: {
    borderColor: '#f59e0b',
    backgroundColor: '#1e293b',
  },
  methodIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 8,
  },
  methodTitleActive: {
    color: '#f59e0b',
  },
  methodDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  selectedBadge: {
    position: 'absolute' as const,
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSection: {
    gap: 20,
  },
  textArea: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#f1f5f9',
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#334155',
    lineHeight: 22,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  odometerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  odometerDisplay: {
    alignItems: 'center',
    gap: 8,
  },
  odometerValue: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: '#f59e0b',
    letterSpacing: 4,
  },
  odometerLabel: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#94a3b8',
    letterSpacing: 2,
  },
  odometerInput: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600' as const,
  },
  reviewCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  reviewLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600' as const,
  },
  reviewValue: {
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '600' as const,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: '#334155',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
  },
  buttonPrimary: {
    backgroundColor: '#f59e0b',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  buttonFullWidth: {
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  buttonSecondaryText: {
    color: '#f59e0b',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  templateList: {
    gap: 12,
  },
  templateOption: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#334155',
  },
  templateOptionActive: {
    borderColor: '#f59e0b',
    backgroundColor: '#1e293b',
  },
  templateOptionContent: {
    gap: 8,
  },
  templateOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateOptionName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    flex: 1,
  },
  templateOptionNameActive: {
    color: '#f59e0b',
  },
  templateCheckBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateOptionRoute: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  templateOptionText: {
    fontSize: 14,
    color: '#cbd5e1',
    fontWeight: '500' as const,
  },
  templateOptionDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  templateOptionSubtext: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500' as const,
  },
  viewAllButton: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#f59e0b',
  },
});
