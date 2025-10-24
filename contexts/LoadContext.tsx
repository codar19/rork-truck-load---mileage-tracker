import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Load, LoadCalculations } from '@/types/load';
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
    const updated = loads.map(load =>
      load.id === id ? { ...load, ...updates } : load
    );
    saveLoads(updated);
  }, [loads, saveLoads]);

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
    
    const totalExpenses = fuelCost + mileageSurcharge + dailyCosts + adminCosts;
    
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

  return useMemo(() => ({
    loads,
    addLoad,
    updateLoad,
    deleteLoad,
    getLoad,
    calculateLoadMetrics,
    isLoading: loadsQuery.isLoading,
  }), [loads, addLoad, updateLoad, deleteLoad, getLoad, calculateLoadMetrics, loadsQuery.isLoading]);
});
