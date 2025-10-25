import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Load, LoadCalculations, MileageAlert, LoadStatus } from '@/types/load';
import { MOCK_LOADS } from '@/mocks/loads';

const STORAGE_KEY = 'loads';
const FIXED_MILEAGE_SURCHARGE = 0.15;
const WEEKLY_ADMIN_COST = 90;
const DAYS_IN_WEEK = 7;
const DAILY_ADMIN_COST = WEEKLY_ADMIN_COST / DAYS_IN_WEEK;

export const [LoadProvider, useLoads] = createContextHook(() => {
  const [loads, setLoads] = useState<Load[]>([]);

  const loadsQuery = useQuery({
    queryKey: ['loads'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_LOADS));
      return MOCK_LOADS;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (updatedLoads: Load[]) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLoads));
      return updatedLoads;
    }
  });

  const { mutate } = saveMutation;

  useEffect(() => {
    if (loadsQuery.data) {
      setLoads(loadsQuery.data);
    }
  }, [loadsQuery.data]);

  const saveLoads = useCallback((updatedLoads: Load[]) => {
    setLoads(updatedLoads);
    mutate(updatedLoads);
  }, [mutate]);

  const calculateMileageAlerts = useCallback((load: Load): MileageAlert[] => {
    console.log('[LoadContext] Calculating mileage alerts for load:', load.id);
    const alerts: MileageAlert[] = [];

    const receivedReading = load.odometerReadings.find(r => r.stage === 'received');
    const pickupReading = load.odometerReadings.find(r => r.stage === 'pickup');
    const deliveryReading = load.odometerReadings.find(r => r.stage === 'delivery');

    if (!receivedReading) {
      return alerts;
    }

    let emptyMiles = 0;
    let loadedMiles = 0;
    let actualMiles = 0;

    if (receivedReading && pickupReading) {
      emptyMiles = pickupReading.reading - receivedReading.reading;
    }

    if (pickupReading && deliveryReading) {
      loadedMiles = deliveryReading.reading - pickupReading.reading;
    }

    actualMiles = emptyMiles + loadedMiles;

    const EMPTY_MILES_WARNING_THRESHOLD = 100;
    const EMPTY_MILES_ERROR_THRESHOLD = 200;
    const MILEAGE_VARIANCE_WARNING_PERCENT = 10;
    const MILEAGE_VARIANCE_ERROR_PERCENT = 20;
    const HIGH_TOTAL_MILES_THRESHOLD = 1000;

    if (emptyMiles > EMPTY_MILES_ERROR_THRESHOLD) {
      alerts.push({
        type: 'excessive_empty_miles',
        message: `Excessive empty miles detected: ${emptyMiles} miles. This significantly impacts profitability.`,
        severity: 'error',
        value: emptyMiles,
        threshold: EMPTY_MILES_ERROR_THRESHOLD,
      });
      console.log('[LoadContext] Alert: Excessive empty miles (error):', emptyMiles);
    } else if (emptyMiles > EMPTY_MILES_WARNING_THRESHOLD) {
      alerts.push({
        type: 'excessive_empty_miles',
        message: `High empty miles: ${emptyMiles} miles. Consider optimizing routing.`,
        severity: 'warning',
        value: emptyMiles,
        threshold: EMPTY_MILES_WARNING_THRESHOLD,
      });
      console.log('[LoadContext] Alert: High empty miles (warning):', emptyMiles);
    }

    if (actualMiles > 0 && load.claimedMiles > 0) {
      const variance = actualMiles - load.claimedMiles;
      const variancePercent = Math.abs((variance / load.claimedMiles) * 100);

      if (variancePercent > MILEAGE_VARIANCE_ERROR_PERCENT) {
        alerts.push({
          type: 'mileage_variance',
          message: `Large mileage variance: ${variance > 0 ? '+' : ''}${variance} miles (${variancePercent.toFixed(1)}%). Actual: ${actualMiles}, Claimed: ${load.claimedMiles}.`,
          severity: 'error',
          value: variance,
          threshold: MILEAGE_VARIANCE_ERROR_PERCENT,
        });
        console.log('[LoadContext] Alert: Large mileage variance (error):', variance);
      } else if (variancePercent > MILEAGE_VARIANCE_WARNING_PERCENT) {
        alerts.push({
          type: 'mileage_variance',
          message: `Mileage variance detected: ${variance > 0 ? '+' : ''}${variance} miles (${variancePercent.toFixed(1)}%). Review route.`,
          severity: 'warning',
          value: variance,
          threshold: MILEAGE_VARIANCE_WARNING_PERCENT,
        });
        console.log('[LoadContext] Alert: Mileage variance (warning):', variance);
      }
    }

    if (actualMiles > HIGH_TOTAL_MILES_THRESHOLD) {
      alerts.push({
        type: 'high_total_miles',
        message: `High total mileage: ${actualMiles} miles. Ensure adequate rest and compliance with HOS regulations.`,
        severity: 'warning',
        value: actualMiles,
        threshold: HIGH_TOTAL_MILES_THRESHOLD,
      });
      console.log('[LoadContext] Alert: High total miles:', actualMiles);
    }

    console.log('[LoadContext] Total alerts generated:', alerts.length);
    return alerts;
  }, []);

  const addLoad = useCallback((load: Omit<Load, 'id' | 'createdAt'>) => {
    const newLoad: Load = {
      ...load,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newLoad, ...loads];
    saveLoads(updated);
    return newLoad.id;
  }, [loads, saveLoads]);

  const updateLoad = useCallback((id: string, updates: Partial<Load>) => {
    console.log('[LoadContext] Updating load:', id, 'with updates:', Object.keys(updates));
    const updated = loads.map(load => {
      if (load.id === id) {
        const updatedLoad = { ...load, ...updates };
        
        if (updates.odometerReadings) {
          console.log('[LoadContext] Odometer readings updated, recalculating alerts');
          const alerts = calculateMileageAlerts(updatedLoad);
          updatedLoad.mileageAlerts = alerts;
        }
        
        return updatedLoad;
      }
      return load;
    });
    saveLoads(updated);
  }, [loads, saveLoads, calculateMileageAlerts]);

  const deleteLoad = useCallback((id: string) => {
    const updated = loads.filter(load => load.id !== id);
    saveLoads(updated);
  }, [loads, saveLoads]);

  const getLoad = useCallback((id: string) => {
    return loads.find(load => load.id === id);
  }, [loads]);

  const calculateLoadMetrics = useCallback((load: Load): LoadCalculations => {
    const receivedReading = load.odometerReadings.find(r => r.stage === 'received');
    const pickupReading = load.odometerReadings.find(r => r.stage === 'pickup');
    const deliveryReading = load.odometerReadings.find(r => r.stage === 'delivery');

    let actualMiles = 0;
    let emptyMiles = 0;
    let loadedMiles = 0;

    if (receivedReading && pickupReading) {
      emptyMiles = pickupReading.reading - receivedReading.reading;
    }

    if (pickupReading && deliveryReading) {
      loadedMiles = deliveryReading.reading - pickupReading.reading;
    }

    actualMiles = emptyMiles + loadedMiles;

    const fuelCost = load.fuel ? load.fuel.totalCost : 0;
    
    const mileageSurcharge = actualMiles * FIXED_MILEAGE_SURCHARGE;
    
    const daysUsed = load.daysUsed || 0;
    const dailyTruckCost = load.dailyTruckCost || 0;
    const dailyCosts = daysUsed * dailyTruckCost;
    
    const adminCosts = daysUsed * DAILY_ADMIN_COST;
    
    const tolls = load.tolls || 0;
    
    const totalExpenses = fuelCost + mileageSurcharge + dailyCosts + adminCosts + tolls;
    
    const grossPay = load.payAmount;
    const netProfit = grossPay - totalExpenses;

    return {
      actualMiles,
      emptyMiles,
      loadedMiles,
      fuelCost,
      mileageSurcharge,
      dailyCosts,
      adminCosts,
      totalExpenses,
      grossPay,
      netProfit,
    };
  }, []);

  const bulkDeleteLoads = useCallback((loadIds: string[]) => {
    console.log('[LoadContext] Bulk deleting loads:', loadIds.length);
    const updated = loads.filter(load => !loadIds.includes(load.id));
    saveLoads(updated);
  }, [loads, saveLoads]);

  const bulkUpdateStatus = useCallback((loadIds: string[], newStatus: LoadStatus) => {
    console.log('[LoadContext] Bulk updating status for loads:', loadIds.length, 'to', newStatus);
    const updated = loads.map(load => 
      loadIds.includes(load.id) ? { ...load, status: newStatus } : load
    );
    saveLoads(updated);
  }, [loads, saveLoads]);

  const bulkAssignDriver = useCallback((loadIds: string[], driverId: string) => {
    console.log('[LoadContext] Bulk assigning driver:', driverId, 'to loads:', loadIds.length);
    const updated = loads.map(load => 
      loadIds.includes(load.id) ? { ...load, driverId } : load
    );
    saveLoads(updated);
  }, [loads, saveLoads]);

  return useMemo(() => ({
    loads,
    addLoad,
    updateLoad,
    deleteLoad,
    getLoad,
    calculateLoadMetrics,
    calculateMileageAlerts,
    bulkDeleteLoads,
    bulkUpdateStatus,
    bulkAssignDriver,
    isLoading: loadsQuery.isLoading,
  }), [
    loads,
    addLoad,
    updateLoad,
    deleteLoad,
    getLoad,
    calculateLoadMetrics,
    calculateMileageAlerts,
    bulkDeleteLoads,
    bulkUpdateStatus,
    bulkAssignDriver,
    loadsQuery.isLoading,
  ]);
});
