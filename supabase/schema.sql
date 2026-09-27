-- Zahara Supabase PostgreSQL Schema
-- Run this directly in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  custom_id VARCHAR UNIQUE,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL, -- Hashed passwords
  phone VARCHAR DEFAULT '',
  address TEXT DEFAULT '',
  role VARCHAR DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  account_status VARCHAR DEFAULT 'Active' CHECK (account_status IN ('Active', 'Blocked', 'Pending')),
  avatar VARCHAR DEFAULT '',
  member_since VARCHAR,
  registration_date DATE DEFAULT CURRENT_DATE,
  total_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  custom_id VARCHAR UNIQUE,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  image TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  custom_id VARCHAR UNIQUE,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  category_id VARCHAR NOT NULL, -- references category slug or custom_id
  occasion VARCHAR,
  price NUMERIC NOT NULL CHECK (price >= 0),
  duration INTEGER DEFAULT 3,
  deposit NUMERIC DEFAULT 0,
  market_value NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 5 CHECK (rating >= 0 AND rating <= 5),
  reviews INTEGER DEFAULT 0,
  is_new_item BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  offer_badge VARCHAR DEFAULT '',
  availability VARCHAR DEFAULT 'available' CHECK (availability IN ('available', 'limited', 'out_of_stock', 'rented', 'maintenance', 'reserved', 'unavailable')),
  available_quantity INTEGER DEFAULT 1,
  estimated_delivery VARCHAR DEFAULT '2-3 days',
  sizes TEXT[], -- Array of strings
  images TEXT[], -- Array of strings
  description TEXT DEFAULT '',
  spec_material VARCHAR DEFAULT '',
  spec_stones VARCHAR DEFAULT '',
  spec_weight VARCHAR DEFAULT '',
  spec_care VARCHAR DEFAULT '',
  spec_finish VARCHAR DEFAULT '',
  spec_insurance VARCHAR DEFAULT 'Included',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- REVIEWS TABLE (Includes Product Reviews)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  custom_id VARCHAR UNIQUE,
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR NOT NULL,
  product_id VARCHAR NOT NULL,
  product_name VARCHAR NOT NULL,
  booking_id VARCHAR DEFAULT '',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  date DATE DEFAULT CURRENT_DATE,
  comment TEXT NOT NULL,
  status VARCHAR DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  custom_id VARCHAR UNIQUE,
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR NOT NULL,
  customer_phone VARCHAR DEFAULT '',
  product_id VARCHAR,
  product_name VARCHAR NOT NULL,
  product_image TEXT DEFAULT '',
  start_date VARCHAR NOT NULL,
  end_date VARCHAR NOT NULL,
  rental_days INTEGER DEFAULT 3,
  rental_amount NUMERIC NOT NULL,
  security_deposit NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  delivery_address JSONB DEFAULT '{}'::jsonb,
  status VARCHAR DEFAULT 'Confirmed' CHECK (status IN ('Pending', 'Confirmed', 'Active', 'Returned', 'Cancelled')),
  payment_status VARCHAR DEFAULT 'Paid' CHECK (payment_status IN ('Pending', 'Paid', 'Refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  custom_id VARCHAR UNIQUE,
  booking_id VARCHAR NOT NULL,
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR NOT NULL,
  product_name VARCHAR NOT NULL,
  product_id VARCHAR,
  dispatch_date VARCHAR DEFAULT '',
  delivery_date VARCHAR NOT NULL,
  return_date VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'Packed' CHECK (status IN ('Packed', 'Ready for Dispatch', 'In Transit', 'Delivered', 'Return Initiated', 'Returned', 'Cancelled')),
  is_overdue BOOLEAN DEFAULT FALSE,
  tracking_code VARCHAR DEFAULT '',
  delivery_address JSONB DEFAULT '{}'::jsonb,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  custom_id VARCHAR UNIQUE,
  booking_id VARCHAR NOT NULL,
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR NOT NULL,
  amount NUMERIC NOT NULL,
  rental_amount NUMERIC DEFAULT 0,
  deposit_amount NUMERIC DEFAULT 0,
  payment_date VARCHAR NOT NULL,
  payment_method VARCHAR DEFAULT 'UPI / GPay' CHECK (payment_method IN ('UPI / GPay', 'UPI / PhonePe', 'UPI / Paytm', 'Credit Card', 'Debit Card', 'Net Banking', 'Bank Transfer', 'Cash', 'Other')),
  payment_status VARCHAR DEFAULT 'Pending' CHECK (payment_status IN ('Paid', 'Pending', 'Refunded', 'Failed', 'Partial')),
  transaction_id VARCHAR DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  custom_id VARCHAR UNIQUE DEFAULT 'settings_global',
  site_name VARCHAR DEFAULT 'Zahara Rental Jewellery',
  admin_email VARCHAR DEFAULT 'zahararental@gmail.com',
  contact_phone VARCHAR DEFAULT '+91 7510484236',
  currency VARCHAR DEFAULT '₹',
  min_rental_days INTEGER DEFAULT 3,
  max_rental_days INTEGER DEFAULT 14,
  deposit_multiplier NUMERIC DEFAULT 1.0,
  late_fee_per_day NUMERIC DEFAULT 500,
  delivery_charge NUMERIC DEFAULT 0,
  free_delivery_above NUMERIC DEFAULT 1000,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_alerts BOOLEAN DEFAULT TRUE,
  sms_alerts BOOLEAN DEFAULT FALSE,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  payment_gateway_test_mode BOOLEAN DEFAULT FALSE,
  allowed_payment_methods TEXT[],
  instagram_url VARCHAR DEFAULT '',
  whatsapp_number VARCHAR DEFAULT '',
  address TEXT DEFAULT 'Kerala, India',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for all tables
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_modtime BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_modtime BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_modtime BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_modtime BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_modtime BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
