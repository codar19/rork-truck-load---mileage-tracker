export type LoadStatus = 'pending' | 'at_pickup' | 'in_transit' | 'delivered';

export interface OdometerReading {
  stage: 'received' | 'pickup' | 'delivery';
  reading: number;
  timestamp: string;
}

export interface FuelExpense {
  gallons: number;
  pricePerGallon: number;
  totalCost: number;
}

export interface Load {
  id: string;
  status: LoadStatus;
  
  driverId: string;
  dispatchId: string;
  
  dispatcherText: string;
  
  origin: string;
  destination: string;
  pickupDate?: string;
  deliveryDate?: string;
  
  claimedMiles: number;
  payAmount: number;
  
  odometerReadings: OdometerReading[];
  
  fuel?: FuelExpense;
  daysUsed?: number;
  dailyTruckCost?: number;
  
  createdAt: string;
  completedAt?: string;
}

export interface LoadCalculations {
  actualMiles: number;
  emptyMiles: number;
  loadedMiles: number;
  
  fuelCost: number;
  mileageSurcharge: number;
  dailyCosts: number;
  adminCosts: number;
  totalExpenses: number;
  
  grossPay: number;
  netProfit: number;
}
