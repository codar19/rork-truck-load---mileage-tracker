import { AvailableLoad } from '@/types/offer';

const CITIES = [
  'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA',
  'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA', 'Austin, TX',
  'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC', 'San Francisco, CA',
  'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Boston, MA', 'Nashville, TN',
  'Detroit, MI', 'Portland, OR', 'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY',
  'Baltimore, MD', 'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA',
  'Sacramento, CA', 'Atlanta, GA', 'Miami, FL', 'New York, NY', 'Salt Lake City, UT'
];

const EQUIPMENT_TYPES = [
  'Dry Van', 'Refrigerated', 'Flatbed', 'Step Deck', 'Box Truck', 'Tanker'
];

const COMMODITIES = [
  'General Freight', 'Electronics', 'Food Products', 'Building Materials', 
  'Auto Parts', 'Paper Products', 'Chemicals', 'Machinery', 'Clothing', 'Furniture'
];

const getRandomCity = (exclude?: string): string => {
  const available = exclude ? CITIES.filter(c => c !== exclude) : CITIES;
  return available[Math.floor(Math.random() * available.length)];
};

const getRandomElement = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomMiles = () => Math.floor(Math.random() * 1500) + 300;

const getRandomPay = (miles: number) => {
  const ratePerMile = 1.8 + Math.random() * 0.7;
  return Math.round(miles * ratePerMile * 100) / 100;
};

const getRandomWeight = () => Math.floor(Math.random() * 40000) + 5000;

const getFutureDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

const generateAvailableLoad = (index: number): AvailableLoad => {
  const origin = getRandomCity();
  const destination = getRandomCity(origin);
  const claimedMiles = getRandomMiles();
  const suggestedPay = getRandomPay(claimedMiles);
  const weight = getRandomWeight();
  const equipment = getRandomElement(EQUIPMENT_TYPES);
  const commodity = getRandomElement(COMMODITIES);
  const pickupDate = getFutureDate(Math.floor(Math.random() * 3) + 1);
  const deliveryDate = getFutureDate(Math.floor(Math.random() * 3) + 4);

  return {
    id: `avail-load-${Date.now()}-${index}`,
    origin,
    destination,
    pickupDate,
    deliveryDate,
    claimedMiles,
    suggestedPay,
    weight,
    equipment,
    description: `${commodity} - ${weight.toLocaleString()} lbs. Needs ${equipment}. ${claimedMiles} miles from ${origin} to ${destination}.`,
    dispatchId: 'dispatch-1',
    createdAt: new Date().toISOString(),
  };
};

export const MOCK_AVAILABLE_LOADS: AvailableLoad[] = Array.from(
  { length: 15 },
  (_, i) => generateAvailableLoad(i)
);
