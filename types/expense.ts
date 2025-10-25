export type ExpenseCategory = 
  | 'fuel'
  | 'tolls'
  | 'maintenance'
  | 'food'
  | 'lodging'
  | 'parking'
  | 'scales'
  | 'truck_wash'
  | 'supplies'
  | 'other';

export type ExpenseStatus = 'pending' | 'approved' | 'rejected';

export interface Expense {
  id: string;
  driverId: string;
  loadId?: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  location?: string;
  description?: string;
  receiptPhoto?: string;
  status: ExpenseStatus;
  notes?: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface ExpenseSummary {
  totalExpenses: number;
  byCategory: Record<ExpenseCategory, number>;
  pending: number;
  approved: number;
  rejected: number;
}

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; icon: string }[] = [
  { value: 'fuel', label: 'Fuel', icon: 'Fuel' },
  { value: 'tolls', label: 'Tolls', icon: 'Coins' },
  { value: 'maintenance', label: 'Maintenance', icon: 'Wrench' },
  { value: 'food', label: 'Food', icon: 'UtensilsCrossed' },
  { value: 'lodging', label: 'Lodging', icon: 'Hotel' },
  { value: 'parking', label: 'Parking', icon: 'ParkingCircle' },
  { value: 'scales', label: 'Scales', icon: 'Scale' },
  { value: 'truck_wash', label: 'Truck Wash', icon: 'Droplets' },
  { value: 'supplies', label: 'Supplies', icon: 'Package' },
  { value: 'other', label: 'Other', icon: 'MoreHorizontal' },
];
