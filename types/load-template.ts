export interface LoadTemplate {
  id: string;
  name: string;
  description?: string;
  
  origin: string;
  destination: string;
  claimedMiles: number;
  
  equipment?: string;
  
  createdAt: string;
  lastUsed?: string;
  useCount: number;
}

export interface BulkLoadOperation {
  type: 'delete' | 'status_update' | 'assign_driver';
  loadIds: string[];
  newStatus?: string;
  newDriverId?: string;
}
