# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Note down your project URL and anon key

## 2. Set Environment Variables

Add these to your `.env` file (create it if it doesn't exist):

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Create Database Tables

Go to your Supabase project dashboard → SQL Editor and run these queries:

### Create Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('driver', 'dispatcher', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### Create Loads Table

```sql
CREATE TABLE loads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_location TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  pickup_date TIMESTAMPTZ NOT NULL,
  delivery_date TIMESTAMPTZ NOT NULL,
  cargo_weight NUMERIC NOT NULL,
  cargo_type TEXT NOT NULL,
  rate NUMERIC NOT NULL,
  distance NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_transit', 'delivered', 'cancelled')),
  driver_id UUID REFERENCES users(id),
  odometer_dispatch NUMERIC,
  odometer_pickup NUMERIC,
  odometer_delivery NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE loads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Loads are viewable by everyone" ON loads
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert loads" ON loads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update loads" ON loads
  FOR UPDATE USING (true);

-- Create index for better performance
CREATE INDEX idx_loads_status ON loads(status);
CREATE INDEX idx_loads_driver_id ON loads(driver_id);
CREATE INDEX idx_loads_created_at ON loads(created_at DESC);
```

### Create Offers Table

```sql
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  load_id UUID NOT NULL REFERENCES loads(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  offered_rate NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(load_id, driver_id)
);

-- Enable Row Level Security
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Offers are viewable by everyone" ON offers
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert offers" ON offers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update offers" ON offers
  FOR UPDATE USING (true);

-- Create indexes
CREATE INDEX idx_offers_load_id ON offers(load_id);
CREATE INDEX idx_offers_driver_id ON offers(driver_id);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_created_at ON offers(created_at DESC);
```

### Create Updated At Trigger

```sql
-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for loads table
CREATE TRIGGER update_loads_updated_at
  BEFORE UPDATE ON loads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for offers table
CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 4. Seed Data (Optional)

You can insert some test data to get started:

```sql
-- Insert test users
INSERT INTO users (id, email, name, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'driver1@example.com', 'John Driver', 'driver'),
  ('550e8400-e29b-41d4-a716-446655440002', 'dispatcher@example.com', 'Jane Dispatcher', 'dispatcher'),
  ('550e8400-e29b-41d4-a716-446655440003', 'admin@example.com', 'Admin User', 'admin');

-- Insert test loads
INSERT INTO loads (pickup_location, delivery_location, pickup_date, delivery_date, cargo_weight, cargo_type, rate, distance, status) VALUES
  ('Los Angeles, CA', 'Phoenix, AZ', NOW() + INTERVAL '2 days', NOW() + INTERVAL '3 days', 42000, 'Electronics', 2500, 373, 'pending'),
  ('Chicago, IL', 'Detroit, MI', NOW() + INTERVAL '1 day', NOW() + INTERVAL '2 days', 38000, 'Auto Parts', 1800, 283, 'pending'),
  ('Houston, TX', 'Dallas, TX', NOW() + INTERVAL '3 days', NOW() + INTERVAL '4 days', 35000, 'Furniture', 1200, 239, 'pending');
```

## 5. Test the Connection

Restart your development server after setting up the environment variables:

```bash
npm start
```

The app should now connect to Supabase and you can use the tRPC endpoints to interact with your data.

## Available tRPC Endpoints

### Loads
- `trpc.loads.getAll.useQuery({ status?, sortBy?, sortOrder? })` - Get all loads
- `trpc.loads.getById.useQuery({ id })` - Get a specific load
- `trpc.loads.create.useMutation()` - Create a new load
- `trpc.loads.update.useMutation()` - Update a load

### Offers
- `trpc.offers.getAll.useQuery({ driver_id?, load_id?, status? })` - Get all offers
- `trpc.offers.create.useMutation()` - Create a new offer
- `trpc.offers.update.useMutation()` - Update an offer

## Security Notes

- The current RLS policies are permissive for development
- You should implement proper authentication before production
- Update RLS policies to restrict access based on user roles
- Consider implementing Supabase Auth for user authentication
