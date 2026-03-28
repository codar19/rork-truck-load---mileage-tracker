import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { AvailableLoad, LoadOffer } from '@/types/offer';
import { MOCK_AVAILABLE_LOADS } from '@/mocks/availableLoads';

const AVAILABLE_LOADS_KEY = 'available_loads';
const OFFERS_KEY = 'load_offers';

export const [OfferProvider, useOffers] = createContextHook(() => {
  const [availableLoads, setAvailableLoads] = useState<AvailableLoad[]>([]);
  const [offers, setOffers] = useState<LoadOffer[]>([]);

  const availableLoadsQuery = useQuery({
    queryKey: ['available_loads'],
    queryFn: async () => {
      console.log('[OfferContext] Loading available loads from storage');
      const stored = await AsyncStorage.getItem(AVAILABLE_LOADS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      await AsyncStorage.setItem(AVAILABLE_LOADS_KEY, JSON.stringify(MOCK_AVAILABLE_LOADS));
      return MOCK_AVAILABLE_LOADS;
    }
  });

  const offersQuery = useQuery({
    queryKey: ['load_offers'],
    queryFn: async () => {
      console.log('[OfferContext] Loading offers from storage');
      const stored = await AsyncStorage.getItem(OFFERS_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  });

  const saveAvailableLoadsMutation = useMutation({
    mutationFn: async (loads: AvailableLoad[]) => {
      console.log('[OfferContext] Saving available loads to storage');
      await AsyncStorage.setItem(AVAILABLE_LOADS_KEY, JSON.stringify(loads));
      return loads;
    }
  });

  const saveOffersMutation = useMutation({
    mutationFn: async (updatedOffers: LoadOffer[]) => {
      console.log('[OfferContext] Saving offers to storage');
      await AsyncStorage.setItem(OFFERS_KEY, JSON.stringify(updatedOffers));
      return updatedOffers;
    }
  });

  const { mutate: saveOffers } = saveOffersMutation;

  useEffect(() => {
    if (availableLoadsQuery.data) {
      setAvailableLoads(availableLoadsQuery.data);
    }
  }, [availableLoadsQuery.data]);

  useEffect(() => {
    if (offersQuery.data) {
      setOffers(offersQuery.data);
    }
  }, [offersQuery.data]);

  const submitOffer = useCallback((
    loadId: string,
    driverId: string,
    driverName: string,
    offerAmount: number,
    message: string
  ) => {
    console.log('[OfferContext] Submitting offer for load:', loadId);
    const newOffer: LoadOffer = {
      id: `offer-${Date.now()}`,
      loadId,
      driverId,
      driverName,
      offerAmount,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    const updatedOffers = [...offers, newOffer];
    setOffers(updatedOffers);
    saveOffers(updatedOffers);
    return newOffer.id;
  }, [offers, saveOffers]);

  const withdrawOffer = useCallback((offerId: string) => {
    console.log('[OfferContext] Withdrawing offer:', offerId);
    const updatedOffers = offers.map(offer =>
      offer.id === offerId ? { ...offer, status: 'withdrawn' as const } : offer
    );
    setOffers(updatedOffers);
    saveOffers(updatedOffers);
  }, [offers, saveOffers]);

  const respondToOffer = useCallback((
    offerId: string,
    status: 'accepted' | 'rejected',
    responseMessage: string
  ) => {
    console.log('[OfferContext] Responding to offer:', offerId, 'with status:', status);
    const updatedOffers = offers.map(offer =>
      offer.id === offerId
        ? {
            ...offer,
            status,
            responseMessage,
            respondedAt: new Date().toISOString(),
          }
        : offer
    );
    setOffers(updatedOffers);
    saveOffers(updatedOffers);
  }, [offers, saveOffers]);

  const getOffersByDriver = useCallback((driverId: string) => {
    return offers.filter(offer => offer.driverId === driverId);
  }, [offers]);

  const getOffersByLoad = useCallback((loadId: string) => {
    return offers.filter(offer => offer.loadId === loadId);
  }, [offers]);

  const hasDriverOfferedOnLoad = useCallback((driverId: string, loadId: string) => {
    return offers.some(
      offer => offer.driverId === driverId && 
               offer.loadId === loadId && 
               offer.status === 'pending'
    );
  }, [offers]);

  return useMemo(() => ({
    availableLoads,
    offers,
    submitOffer,
    withdrawOffer,
    respondToOffer,
    getOffersByDriver,
    getOffersByLoad,
    hasDriverOfferedOnLoad,
    isLoading: availableLoadsQuery.isLoading || offersQuery.isLoading,
  }), [
    availableLoads,
    offers,
    submitOffer,
    withdrawOffer,
    respondToOffer,
    getOffersByDriver,
    getOffersByLoad,
    hasDriverOfferedOnLoad,
    availableLoadsQuery.isLoading,
    offersQuery.isLoading,
  ]);
});
