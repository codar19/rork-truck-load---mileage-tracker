import { User } from '@/types/auth';

export const MOCK_ADMIN: User = {
  id: 'admin-1',
  email: 'admin@loadboard.com',
  name: 'System Admin',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00.000Z',
};

export const MOCK_DISPATCHERS: User[] = [
  {
    id: 'dispatch-1',
    email: 'dispatch1@loadboard.com',
    name: 'John Martinez',
    role: 'dispatch',
    createdAt: '2024-01-05T00:00:00.000Z',
  },
  {
    id: 'dispatch-2',
    email: 'dispatch2@loadboard.com',
    name: 'Sarah Johnson',
    role: 'dispatch',
    createdAt: '2024-01-10T00:00:00.000Z',
  },
  {
    id: 'dispatch-3',
    email: 'dispatch3@loadboard.com',
    name: 'Michael Chen',
    role: 'dispatch',
    createdAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 'dispatch-4',
    email: 'dispatch4@loadboard.com',
    name: 'Emily Rodriguez',
    role: 'dispatch',
    createdAt: '2024-01-20T00:00:00.000Z',
  },
  {
    id: 'dispatch-5',
    email: 'dispatch5@loadboard.com',
    name: 'David Williams',
    role: 'dispatch',
    createdAt: '2024-02-01T00:00:00.000Z',
  },
];

export const MOCK_DRIVERS: User[] = [
  { id: 'driver-1', email: 'driver1@loadboard.com', name: 'Robert Thompson', role: 'driver', dispatchId: 'dispatch-1', createdAt: '2024-02-01T00:00:00.000Z' },
  { id: 'driver-2', email: 'driver2@loadboard.com', name: 'James Anderson', role: 'driver', dispatchId: 'dispatch-1', createdAt: '2024-02-02T00:00:00.000Z' },
  { id: 'driver-3', email: 'driver3@loadboard.com', name: 'Patricia Davis', role: 'driver', dispatchId: 'dispatch-1', createdAt: '2024-02-03T00:00:00.000Z' },
  { id: 'driver-4', email: 'driver4@loadboard.com', name: 'Linda Garcia', role: 'driver', dispatchId: 'dispatch-1', createdAt: '2024-02-04T00:00:00.000Z' },
  { id: 'driver-5', email: 'driver5@loadboard.com', name: 'William Martinez', role: 'driver', dispatchId: 'dispatch-1', createdAt: '2024-02-05T00:00:00.000Z' },
  { id: 'driver-6', email: 'driver6@loadboard.com', name: 'Barbara Wilson', role: 'driver', dispatchId: 'dispatch-1', createdAt: '2024-02-06T00:00:00.000Z' },
  
  { id: 'driver-7', email: 'driver7@loadboard.com', name: 'Richard Moore', role: 'driver', dispatchId: 'dispatch-2', createdAt: '2024-02-07T00:00:00.000Z' },
  { id: 'driver-8', email: 'driver8@loadboard.com', name: 'Susan Taylor', role: 'driver', dispatchId: 'dispatch-2', createdAt: '2024-02-08T00:00:00.000Z' },
  { id: 'driver-9', email: 'driver9@loadboard.com', name: 'Joseph Brown', role: 'driver', dispatchId: 'dispatch-2', createdAt: '2024-02-09T00:00:00.000Z' },
  { id: 'driver-10', email: 'driver10@loadboard.com', name: 'Margaret Jackson', role: 'driver', dispatchId: 'dispatch-2', createdAt: '2024-02-10T00:00:00.000Z' },
  { id: 'driver-11', email: 'driver11@loadboard.com', name: 'Thomas White', role: 'driver', dispatchId: 'dispatch-2', createdAt: '2024-02-11T00:00:00.000Z' },
  { id: 'driver-12', email: 'driver12@loadboard.com', name: 'Dorothy Harris', role: 'driver', dispatchId: 'dispatch-2', createdAt: '2024-02-12T00:00:00.000Z' },
  
  { id: 'driver-13', email: 'driver13@loadboard.com', name: 'Charles Clark', role: 'driver', dispatchId: 'dispatch-3', createdAt: '2024-02-13T00:00:00.000Z' },
  { id: 'driver-14', email: 'driver14@loadboard.com', name: 'Jessica Lewis', role: 'driver', dispatchId: 'dispatch-3', createdAt: '2024-02-14T00:00:00.000Z' },
  { id: 'driver-15', email: 'driver15@loadboard.com', name: 'Daniel Walker', role: 'driver', dispatchId: 'dispatch-3', createdAt: '2024-02-15T00:00:00.000Z' },
  { id: 'driver-16', email: 'driver16@loadboard.com', name: 'Sarah Hall', role: 'driver', dispatchId: 'dispatch-3', createdAt: '2024-02-16T00:00:00.000Z' },
  { id: 'driver-17', email: 'driver17@loadboard.com', name: 'Matthew Allen', role: 'driver', dispatchId: 'dispatch-3', createdAt: '2024-02-17T00:00:00.000Z' },
  { id: 'driver-18', email: 'driver18@loadboard.com', name: 'Nancy Young', role: 'driver', dispatchId: 'dispatch-3', createdAt: '2024-02-18T00:00:00.000Z' },
  
  { id: 'driver-19', email: 'driver19@loadboard.com', name: 'Anthony King', role: 'driver', dispatchId: 'dispatch-4', createdAt: '2024-02-19T00:00:00.000Z' },
  { id: 'driver-20', email: 'driver20@loadboard.com', name: 'Betty Wright', role: 'driver', dispatchId: 'dispatch-4', createdAt: '2024-02-20T00:00:00.000Z' },
  { id: 'driver-21', email: 'driver21@loadboard.com', name: 'Mark Lopez', role: 'driver', dispatchId: 'dispatch-4', createdAt: '2024-02-21T00:00:00.000Z' },
  { id: 'driver-22', email: 'driver22@loadboard.com', name: 'Helen Hill', role: 'driver', dispatchId: 'dispatch-4', createdAt: '2024-02-22T00:00:00.000Z' },
  { id: 'driver-23', email: 'driver23@loadboard.com', name: 'Paul Scott', role: 'driver', dispatchId: 'dispatch-4', createdAt: '2024-02-23T00:00:00.000Z' },
  { id: 'driver-24', email: 'driver24@loadboard.com', name: 'Sandra Green', role: 'driver', dispatchId: 'dispatch-4', createdAt: '2024-02-24T00:00:00.000Z' },
  
  { id: 'driver-25', email: 'driver25@loadboard.com', name: 'Steven Adams', role: 'driver', dispatchId: 'dispatch-5', createdAt: '2024-02-25T00:00:00.000Z' },
  { id: 'driver-26', email: 'driver26@loadboard.com', name: 'Donna Baker', role: 'driver', dispatchId: 'dispatch-5', createdAt: '2024-02-26T00:00:00.000Z' },
  { id: 'driver-27', email: 'driver27@loadboard.com', name: 'Andrew Nelson', role: 'driver', dispatchId: 'dispatch-5', createdAt: '2024-02-27T00:00:00.000Z' },
  { id: 'driver-28', email: 'driver28@loadboard.com', name: 'Carol Carter', role: 'driver', dispatchId: 'dispatch-5', createdAt: '2024-02-28T00:00:00.000Z' },
  { id: 'driver-29', email: 'driver29@loadboard.com', name: 'Joshua Mitchell', role: 'driver', dispatchId: 'dispatch-5', createdAt: '2024-03-01T00:00:00.000Z' },
  { id: 'driver-30', email: 'driver30@loadboard.com', name: 'Michelle Perez', role: 'driver', dispatchId: 'dispatch-5', createdAt: '2024-03-02T00:00:00.000Z' },
];

export const ALL_USERS = [MOCK_ADMIN, ...MOCK_DISPATCHERS, ...MOCK_DRIVERS];
