export type UserRole = 'admin' | 'dispatch' | 'driver';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  dispatchId?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
