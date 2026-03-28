import { Load } from '@/types/load';
import { MOCK_DRIVERS } from './users';

const CITIES = [
  'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA',
  'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA', 'Austin, TX',
  'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC', 'San Francisco, CA',
  'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Boston, MA', 'Nashville, TN',
  'Detroit, MI', 'Portland, OR', 'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY',
  'Baltimore, MD', 'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA',
  'Sacramento, CA', 'Atlanta, GA', 'Miami, FL', 'New York, NY', 'Salt Lake City, UT'
];

const generateLoadId = (driverId: string, index: number) => 
  `load-${driverId}-${index}-${Date.now() + index}`;

const getRandomCity = (exclude?: string): string => {
  const available = exclude ? CITIES.filter(c => c !== exclude) : CITIES;
  return available[Math.floor(Math.random() * available.length)];
};

const getRandomMiles = () => Math.floor(Math.random() * 1500) + 300;

const getRandomPay = (miles: number) => {
  const ratePerMile = 1.8 + Math.random() * 0.7;
  return Math.round(miles * ratePerMile * 100) / 100;
};

const getRandomDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const generateCompletedLoad = (driverId: string, dispatchId: string, index: number, daysAgo: number): Load => {
  const origin = getRandomCity();
  const destination = getRandomCity(origin);
  const claimedMiles = getRandomMiles();
  const payAmount = getRandomPay(claimedMiles);
  
  const receivedReading = 100000 + Math.floor(Math.random() * 50000);
  const emptyMiles = Math.floor(Math.random() * 100) + 20;
  const actualLoadedMiles = claimedMiles + Math.floor((Math.random() - 0.5) * 50);
  
  const pickupReading = receivedReading + emptyMiles;
  const deliveryReading = pickupReading + actualLoadedMiles;
  
  const totalMiles = emptyMiles + actualLoadedMiles;
  const fuelGallons = Math.round((totalMiles / 7) * 100) / 100;
  const fuelPrice = 3.5 + Math.random() * 0.5;
  const daysUsed = Math.ceil(totalMiles / 500);
  const dailyTruckCost = 150 + Math.random() * 50;
  
  return {
    id: generateLoadId(driverId, index),
    status: 'delivered',
    driverId,
    dispatchId,
    dispatcherText: `Load from ${origin} to ${destination}. ${claimedMiles} miles. Pay: ${payAmount}`,
    origin,
    destination,
    claimedMiles,
    payAmount,
    odometerReadings: [
      { stage: 'received', reading: receivedReading, timestamp: getRandomDate(daysAgo + 2) },
      { stage: 'pickup', reading: pickupReading, timestamp: getRandomDate(daysAgo + 1) },
      { stage: 'delivery', reading: deliveryReading, timestamp: getRandomDate(daysAgo) }
    ],
    fuel: {
      gallons: fuelGallons,
      pricePerGallon: fuelPrice,
      totalCost: fuelGallons * fuelPrice
    },
    daysUsed,
    dailyTruckCost,
    createdAt: getRandomDate(daysAgo + 3),
    completedAt: getRandomDate(daysAgo)
  };
};

const generateActiveLoad = (driverId: string, dispatchId: string, index: number, status: 'pending' | 'at_pickup'): Load => {
  const origin = getRandomCity();
  const destination = getRandomCity(origin);
  const claimedMiles = getRandomMiles();
  const payAmount = getRandomPay(claimedMiles);
  
  const receivedReading = 100000 + Math.floor(Math.random() * 50000);
  const emptyMiles = Math.floor(Math.random() * 100) + 20;
  const pickupReading = receivedReading + emptyMiles;
  
  const odometerReadings: Load['odometerReadings'] = [
    { stage: 'received', reading: receivedReading, timestamp: getRandomDate(1) }
  ];
  
  if (status === 'at_pickup') {
    odometerReadings.push({
      stage: 'pickup',
      reading: pickupReading,
      timestamp: getRandomDate(0)
    });
  }
  
  return {
    id: generateLoadId(driverId, index),
    status,
    driverId,
    dispatchId,
    dispatcherText: `Load from ${origin} to ${destination}. ${claimedMiles} miles. Pay: ${payAmount}`,
    origin,
    destination,
    claimedMiles,
    payAmount,
    odometerReadings,
    createdAt: getRandomDate(2)
  };
};

export const generateDriverLoads = (driverId: string, dispatchId: string): Load[] => {
  const loads: Load[] = [];
  
  const numCompleted = Math.floor(Math.random() * 5) + 3;
  for (let i = 0; i < numCompleted; i++) {
    loads.push(generateCompletedLoad(driverId, dispatchId, i, Math.floor(Math.random() * 30) + 5));
  }
  
  const hasActiveLoad = Math.random() > 0.3;
  if (hasActiveLoad) {
    const activeStatus = Math.random() > 0.5 ? 'pending' : 'at_pickup';
    loads.push(generateActiveLoad(driverId, dispatchId, numCompleted, activeStatus));
  }
  
  return loads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const MOCK_LOADS: Load[] = [];

MOCK_DRIVERS.forEach(driver => {
  if (driver.dispatchId) {
    const driverLoads = generateDriverLoads(driver.id, driver.dispatchId);
    MOCK_LOADS.push(...driverLoads);
  }
});
