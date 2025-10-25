export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export interface AvailableLoad {
  id: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  claimedMiles: number;
  suggestedPay: number;
  weight: number;
  equipment: string;
  description: string;
  dispatchId: string;
  createdAt: string;
}

export interface LoadOffer {
  id: string;
  loadId: string;
  driverId: string;
  driverName: string;
  offerAmount: number;
  message: string;
  status: OfferStatus;
  createdAt: string;
  respondedAt?: string;
  responseMessage?: string;
}
