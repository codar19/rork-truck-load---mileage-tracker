import { useLoads } from '@/contexts/LoadContext';
import { useLocalSearchParams, Stack } from 'expo-router';
import {
  MapPin,
  CheckCircle2,
  Clock,
  FileText,
  Fuel,
  Calendar,
  Receipt,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react-native';
import OdometerHistoryChart from '@/components/OdometerHistoryChart';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';


export default function LoadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLoad, updateLoad, calculateLoadMetrics } = useLoads();

  const load = getLoad(id);

  const [pickupOdometer, setPickupOdometer] = useState('');
  const [deliveryOdometer, setDeliveryOdometer] = useState('');
  const [fuelGallons, setFuelGallons] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [daysUsed, setDaysUsed] = useState('');
  const [dailyCost, setDailyCost] = useState('');
  const [tolls, setTolls] = useState('');

  if (!load) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Load not found</Text>
      </View>
    );
  }

  const hasPickupReading = load.odometerReadings.some(r => r.stage === 'pickup');
  const hasDeliveryReading = load.odometerReadings.some(r => r.stage === 'delivery');
  const metrics = calculateLoadMetrics(load);

  const handleAddPickupReading = () => {
    if (!pickupOdometer.trim() || isNaN(Number(pickupOdometer))) {
      Alert.alert('Error', 'Please enter a valid odometer reading');
      return;
    }

    const receivedReading = load.odometerReadings.find(r => r.stage === 'received');
    if (receivedReading && Number(pickupOdometer) < receivedReading.reading) {
      Alert.alert('Error', 'Pickup odometer must be greater than received odometer');
      return;
    }

    updateLoad(id, {
      odometerReadings: [
        ...load.odometerReadings,
        {
          stage: 'pickup',
          reading: Number(pickupOdometer),
          timestamp: new Date().toISOString(),
        },
      ],
      status: 'at_pickup',
    });

    setPickupOdometer('');
    Alert.alert('Success', 'Pickup odometer reading added');
  };

  const handleAddDeliveryReading = () => {
    if (!deliveryOdometer.trim() || isNaN(Number(deliveryOdometer))) {
      Alert.alert('Error', 'Please enter a valid odometer reading');
      return;
    }

    const pickupReading = load.odometerReadings.find(r => r.stage === 'pickup');
    if (pickupReading && Number(deliveryOdometer) < pickupReading.reading) {
      Alert.alert('Error', 'Delivery odometer must be greater than pickup odometer');
      return;
    }

    updateLoad(id, {
      odometerReadings: [
        ...load.odometerReadings,
        {
          stage: 'delivery',
          reading: Number(deliveryOdometer),
          timestamp: new Date().toISOString(),
        },
      ],
      status: 'delivered',
      completedAt: new Date().toISOString(),
    });

    setDeliveryOdometer('');
    Alert.alert('Success', 'Delivery completed! You can now add expenses and view the report.');
  };

  const handleSaveExpenses = () => {
    const gallons = Number(fuelGallons);
    const price = Number(fuelPrice);
    const days = Number(daysUsed);
    const dailyTruckCost = Number(dailyCost);

    if (fuelGallons && (!gallons || gallons <= 0)) {
      Alert.alert('Error', 'Please enter valid fuel gallons');
      return;
    }

    if (fuelPrice && (!price || price <= 0)) {
      Alert.alert('Error', 'Please enter valid fuel price');
      return;
    }

    if (daysUsed && (!days || days <= 0)) {
      Alert.alert('Error', 'Please enter valid number of days');
      return;
    }

    if (dailyCost && (!dailyTruckCost || dailyTruckCost < 0)) {
      Alert.alert('Error', 'Please enter valid daily cost');
      return;
    }

    const updates: any = {};

    if (fuelGallons && fuelPrice) {
      updates.fuel = {
        gallons,
        pricePerGallon: price,
        totalCost: gallons * price,
      };
    }

    if (daysUsed) {
      updates.daysUsed = days;
    }

    if (dailyCost) {
      updates.dailyTruckCost = dailyTruckCost;
    }

    if (tolls) {
      const tollsAmount = Number(tolls);
      if (!tollsAmount || tollsAmount < 0) {
        Alert.alert('Error', 'Please enter valid tolls amount');
        return;
      }
      updates.tolls = tollsAmount;
    }

    if (Object.keys(updates).length > 0) {
      updateLoad(id, updates);
      Alert.alert('Success', 'Expenses saved');
    }
  };

  const renderMileageAlerts = () => {
    console.log('[LoadDetailScreen] Rendering mileage alerts for load:', id);
    
    if (!load.mileageAlerts || load.mileageAlerts.length === 0) {
      console.log('[LoadDetailScreen] No mileage alerts to display');
      return null;
    }

    console.log('[LoadDetailScreen] Displaying', load.mileageAlerts.length, 'alerts');

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mileage Alerts</Text>
        {load.mileageAlerts.map((alert, index) => {
          const isError = alert.severity === 'error';
          const icon = isError ? AlertCircle : AlertTriangle;
          const iconColor = isError ? '#ef4444' : '#f59e0b';
          const bgColor = isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)';
          const borderColor = isError ? '#ef4444' : '#f59e0b';

          console.log('[LoadDetailScreen] Alert', index, ':', alert.type, alert.severity);

          return (
            <View
              key={`${alert.type}-${index}`}
              style={[
                styles.alertCard,
                { backgroundColor: bgColor, borderColor: borderColor },
              ]}
            >
              <View style={styles.alertIcon}>
                {icon({ size: 20, color: iconColor })}
              </View>
              <View style={styles.alertContent}>
                <Text style={[styles.alertTitle, { color: iconColor }]}>
                  {alert.severity === 'error' ? 'Critical Alert' : 'Warning'}
                </Text>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <View style={styles.alertStats}>
                  <Text style={styles.alertStatText}>
                    Value: {alert.value} | Threshold: {alert.threshold}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderOdometerTimeline = () => {
    const receivedReading = load.odometerReadings.find(r => r.stage === 'received');
    const pickupReading = load.odometerReadings.find(r => r.stage === 'pickup');
    const deliveryReading = load.odometerReadings.find(r => r.stage === 'delivery');

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Odometer Timeline</Text>

        <View style={styles.timelineItem}>
          <View style={styles.timelineIconContainer}>
            <CheckCircle2 size={20} color="#22c55e" />
          </View>
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTitle}>Load Received</Text>
            <Text style={styles.timelineValue}>{receivedReading?.reading.toLocaleString()} mi</Text>
            <Text style={styles.timelineDate}>
              {new Date(receivedReading!.timestamp).toLocaleString()}
            </Text>
          </View>
        </View>

        {!hasPickupReading ? (
          <View style={styles.inputSection}>
            <View style={styles.timelineIconContainer}>
              <Clock size={20} color="#f59e0b" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>At Pickup</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter odometer reading"
                placeholderTextColor="#64748b"
                value={pickupOdometer}
                onChangeText={setPickupOdometer}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.smallButton} onPress={handleAddPickupReading}>
                <Text style={styles.smallButtonText}>Add Pickup Reading</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.timelineItem}>
            <View style={styles.timelineIconContainer}>
              <CheckCircle2 size={20} color="#22c55e" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>At Pickup</Text>
              <Text style={styles.timelineValue}>{pickupReading?.reading.toLocaleString()} mi</Text>
              <Text style={styles.timelineDate}>
                {new Date(pickupReading!.timestamp).toLocaleString()}
              </Text>
              {metrics.emptyMiles > 0 && (
                <Text style={styles.milesInfo}>Empty miles: {metrics.emptyMiles} mi</Text>
              )}
            </View>
          </View>
        )}

        {hasPickupReading && !hasDeliveryReading && (
          <View style={styles.inputSection}>
            <View style={styles.timelineIconContainer}>
              <Clock size={20} color="#f59e0b" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Delivered</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter odometer reading"
                placeholderTextColor="#64748b"
                value={deliveryOdometer}
                onChangeText={setDeliveryOdometer}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.smallButton} onPress={handleAddDeliveryReading}>
                <Text style={styles.smallButtonText}>Complete Delivery</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {hasDeliveryReading && (
          <View style={styles.timelineItem}>
            <View style={styles.timelineIconContainer}>
              <CheckCircle2 size={20} color="#22c55e" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Delivered</Text>
              <Text style={styles.timelineValue}>{deliveryReading?.reading.toLocaleString()} mi</Text>
              <Text style={styles.timelineDate}>
                {new Date(deliveryReading!.timestamp).toLocaleString()}
              </Text>
              {metrics.loadedMiles > 0 && (
                <Text style={styles.milesInfo}>Loaded miles: {metrics.loadedMiles} mi</Text>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderExpenses = () => {
    if (!hasDeliveryReading) {
      return null;
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expenses</Text>

        <View style={styles.expenseInputGroup}>
          <View style={styles.labelRow}>
            <Fuel size={16} color="#f59e0b" />
            <Text style={styles.inputLabel}>Fuel</Text>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Gallons"
              placeholderTextColor="#64748b"
              value={fuelGallons}
              onChangeText={setFuelGallons}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Price/gal"
              placeholderTextColor="#64748b"
              value={fuelPrice}
              onChangeText={setFuelPrice}
              keyboardType="numeric"
            />
          </View>
          {load.fuel && (
            <Text style={styles.currentValue}>
              Current: {load.fuel.gallons} gal @ ${load.fuel.pricePerGallon.toFixed(2)} = $
              {load.fuel.totalCost.toFixed(2)}
            </Text>
          )}
        </View>

        <View style={styles.expenseInputGroup}>
          <View style={styles.labelRow}>
            <Calendar size={16} color="#f59e0b" />
            <Text style={styles.inputLabel}>Truck Usage</Text>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Days used"
              placeholderTextColor="#64748b"
              value={daysUsed}
              onChangeText={setDaysUsed}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Cost/day"
              placeholderTextColor="#64748b"
              value={dailyCost}
              onChangeText={setDailyCost}
              keyboardType="numeric"
            />
          </View>
          {load.daysUsed && load.dailyTruckCost && (
            <Text style={styles.currentValue}>
              Current: {load.daysUsed} days @ ${load.dailyTruckCost.toFixed(2)} = $
              {(load.daysUsed * load.dailyTruckCost).toFixed(2)}
            </Text>
          )}
        </View>

        <View style={styles.expenseInputGroup}>
          <View style={styles.labelRow}>
            <Receipt size={16} color="#f59e0b" />
            <Text style={styles.inputLabel}>Tolls</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Total tolls amount"
            placeholderTextColor="#64748b"
            value={tolls}
            onChangeText={setTolls}
            keyboardType="numeric"
          />
          {load.tolls !== undefined && (
            <Text style={styles.currentValue}>
              Current: ${load.tolls.toFixed(2)}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSaveExpenses}>
          <Text style={styles.buttonText}>Save Expenses</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderReport = () => {
    if (!hasDeliveryReading) {
      return null;
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profit Report</Text>

        <View style={styles.reportCard}>
          <View style={styles.reportRow}>
            <Text style={styles.reportLabel}>Claimed Miles</Text>
            <Text style={styles.reportValue}>{load.claimedMiles}</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={styles.reportLabel}>Actual Miles</Text>
            <Text style={styles.reportValue}>{metrics.actualMiles}</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={styles.reportLabel}>Empty Miles</Text>
            <Text style={[styles.reportValue, styles.warningText]}>{metrics.emptyMiles}</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={styles.reportLabel}>Loaded Miles</Text>
            <Text style={[styles.reportValue, styles.successText]}>{metrics.loadedMiles}</Text>
          </View>
        </View>

        <View style={styles.reportCard}>
          <View style={styles.reportRow}>
            <Text style={styles.reportLabel}>Gross Pay</Text>
            <Text style={[styles.reportValue, styles.successText]}>
              ${metrics.grossPay.toFixed(2)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.reportRow}>
            <Text style={styles.reportLabelSmall}>Fuel Cost</Text>
            <Text style={styles.reportValueSmall}>-${metrics.fuelCost.toFixed(2)}</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={styles.reportLabelSmall}>Mileage Surcharge ($0.15/mi)</Text>
            <Text style={styles.reportValueSmall}>-${metrics.mileageSurcharge.toFixed(2)}</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={styles.reportLabelSmall}>Daily Truck Costs</Text>
            <Text style={styles.reportValueSmall}>-${metrics.dailyCosts.toFixed(2)}</Text>
          </View>
          <View style={styles.reportRow}>
            <Text style={styles.reportLabelSmall}>Admin Costs</Text>
            <Text style={styles.reportValueSmall}>-${metrics.adminCosts.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.reportRow}>
            <Text style={styles.reportLabel}>Total Expenses</Text>
            <Text style={[styles.reportValue, styles.dangerText]}>
              -${metrics.totalExpenses.toFixed(2)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.reportRow}>
            <Text style={styles.reportLabelBold}>Net Profit</Text>
            <Text
              style={[
                styles.reportValueBold,
                metrics.netProfit >= 0 ? styles.successText : styles.dangerText,
              ]}
            >
              ${metrics.netProfit.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () =>
            hasDeliveryReading ? (
              <TouchableOpacity onPress={() => {}}>
                <FileText size={22} color="#f59e0b" />
              </TouchableOpacity>
            ) : null,
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.routeContainer}>
            <View style={styles.routeRow}>
              <MapPin size={20} color="#64748b" />
              <Text style={styles.routeText}>{load.origin}</Text>
            </View>
            <View style={styles.routeArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
            <View style={styles.routeRow}>
              <MapPin size={20} color="#ef4444" />
              <Text style={styles.routeText}>{load.destination}</Text>
            </View>
          </View>

          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Pay</Text>
              <Text style={styles.statValue}>${load.payAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Claimed Miles</Text>
              <Text style={styles.statValue}>{load.claimedMiles}</Text>
            </View>
          </View>
        </View>

        {renderMileageAlerts()}
        {hasDeliveryReading && (
          <View style={styles.section}>
            <OdometerHistoryChart
              readings={load.odometerReadings}
              claimedMiles={load.claimedMiles}
            />
          </View>
        )}
        {renderOdometerTimeline()}
        {renderExpenses()}
        {renderReport()}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  routeContainer: {
    marginBottom: 16,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  routeText: {
    fontSize: 16,
    color: '#cbd5e1',
    fontWeight: '500' as const,
  },
  routeArrow: {
    paddingLeft: 28,
    marginVertical: 4,
  },
  arrowText: {
    fontSize: 18,
    color: '#475569',
  },
  headerStats: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#22c55e',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#f1f5f9',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineIconContainer: {
    width: 40,
    alignItems: 'center',
    paddingTop: 2,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  timelineValue: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#f1f5f9',
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: '#64748b',
  },
  milesInfo: {
    fontSize: 13,
    color: '#f59e0b',
    marginTop: 4,
  },
  inputSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  smallButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  smallButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  expenseInputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#cbd5e1',
    fontWeight: '500' as const,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputHalf: {
    flex: 1,
  },
  currentValue: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#f59e0b',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  reportCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  reportLabel: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  reportLabelSmall: {
    fontSize: 13,
    color: '#94a3b8',
  },
  reportLabelBold: {
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '700' as const,
  },
  reportValue: {
    fontSize: 14,
    color: '#f1f5f9',
    fontWeight: '600' as const,
  },
  reportValueSmall: {
    fontSize: 13,
    color: '#cbd5e1',
  },
  reportValueBold: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  successText: {
    color: '#22c55e',
  },
  warningText: {
    color: '#f59e0b',
  },
  dangerText: {
    color: '#ef4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 8,
  },
  alertCard: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  alertIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 18,
    marginBottom: 6,
  },
  alertStats: {
    marginTop: 4,
  },
  alertStatText: {
    fontSize: 11,
    color: '#94a3b8',
  },
});
