/**
 * Seed Supabase PostgreSQL and apply public-read RLS for products/categories.
 * Handles DB passwords that contain '@' (common in connection strings).
 */
import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env') })

function createClient() {
  const raw = process.env.SUPABASE_DB_URL
  if (!raw) throw new Error('SUPABASE_DB_URL is missing in .env')

  const match = raw.match(/^postgresql:\/\/([^:]+):(.+)@([^:/]+):(\d+)\/([^?]+)/)
  if (!match) {
    return new pg.Client({ connectionString: raw, ssl: { rejectUnauthorized: false } })
  }

  return new pg.Client({
    user: match[1],
    password: match[2],
    host: match[3],
    port: Number(match[4]),
    database: match[5],
    ssl: { rejectUnauthorized: false },
  })
}

async function main() {
  const client = createClient()
  console.log('Connecting to Supabase PostgreSQL...')
  await client.connect()
  console.log('Connected.')

  // Ensure schema matches Express store (category column + jsonb specs)
  await client.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS categories (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      custom_id VARCHAR(255) UNIQUE,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      image TEXT DEFAULT '',
      description TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      custom_id VARCHAR(255) UNIQUE,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      category VARCHAR(255) NOT NULL,
      occasion VARCHAR(255),
      price DECIMAL(10, 2) NOT NULL,
      duration INTEGER DEFAULT 3,
      deposit DECIMAL(10, 2) DEFAULT 0,
      market_value DECIMAL(10, 2) DEFAULT 0,
      rating DECIMAL(2, 1) DEFAULT 5,
      reviews INTEGER DEFAULT 0,
      is_new_item BOOLEAN DEFAULT FALSE,
      is_best_seller BOOLEAN DEFAULT FALSE,
      is_featured BOOLEAN DEFAULT FALSE,
      offer_badge VARCHAR(100) DEFAULT '',
      availability VARCHAR(50) DEFAULT 'available',
      available_quantity INTEGER DEFAULT 1,
      estimated_delivery VARCHAR(100) DEFAULT '2-3 days',
      sizes TEXT[],
      images TEXT[],
      description TEXT DEFAULT '',
      specifications JSONB DEFAULT '{}'::jsonb,
      customer_reviews JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      custom_id VARCHAR(255) UNIQUE,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(50) DEFAULT '',
      address TEXT DEFAULT '',
      role VARCHAR(20) DEFAULT 'user',
      account_status VARCHAR(20) DEFAULT 'Active',
      avatar TEXT DEFAULT '',
      member_since VARCHAR(50) DEFAULT '',
      registration_date DATE DEFAULT CURRENT_DATE,
      total_bookings INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS settings (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      custom_id VARCHAR UNIQUE DEFAULT 'settings_global',
      site_name VARCHAR DEFAULT 'Zahara Rental Jewellery',
      admin_email VARCHAR DEFAULT 'zahararental@gmail.com',
      contact_phone VARCHAR DEFAULT '+91 7510484236',
      currency VARCHAR DEFAULT '₹',
      min_rental_days INTEGER DEFAULT 3,
      max_rental_days INTEGER DEFAULT 14,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `)

  // Public read for catalog (needed for Vercel + anon key)
  await client.query(`
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
    ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Public read products" ON products;
    DROP POLICY IF EXISTS "Public read categories" ON categories;
    DROP POLICY IF EXISTS "Public read settings" ON settings;

    CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
    CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
    CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Public write products" ON products;
    DROP POLICY IF EXISTS "Public write categories" ON categories;
    DROP POLICY IF EXISTS "Public write settings" ON settings;
    CREATE POLICY "Public write products" ON products FOR ALL USING (true) WITH CHECK (true);
    CREATE POLICY "Public write categories" ON categories FOR ALL USING (true) WITH CHECK (true);
    CREATE POLICY "Public write settings" ON settings FOR ALL USING (true) WITH CHECK (true);

    GRANT SELECT, INSERT, UPDATE, DELETE ON products TO anon, authenticated;
    GRANT SELECT, INSERT, UPDATE, DELETE ON categories TO anon, authenticated;
    GRANT SELECT, INSERT, UPDATE, DELETE ON settings TO anon, authenticated;
  `)
  console.log('RLS public-read policies applied.')

  const { SEED_CATEGORIES } = await import('./data/categories.js')
  const { SEED_PRODUCTS } = await import('./data/products.js')
  const { SEED_USERS } = await import('./data/users.js')

  for (const category of SEED_CATEGORIES) {
    await client.query(
      `INSERT INTO categories (custom_id, name, slug, image, description)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         image = EXCLUDED.image,
         description = EXCLUDED.description,
         custom_id = EXCLUDED.custom_id`,
      [category.customId, category.name, category.slug, category.image, category.description]
    )
  }
  console.log(`Categories: ${SEED_CATEGORIES.length}`)

  for (const product of SEED_PRODUCTS) {
    await client.query(
      `INSERT INTO products (
         custom_id, name, slug, category, occasion, price, duration, deposit, market_value,
         rating, reviews, is_new_item, is_best_seller, is_featured, offer_badge, availability,
         available_quantity, estimated_delivery, sizes, images, description, specifications, customer_reviews
       ) VALUES (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23
       )
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         category = EXCLUDED.category,
         price = EXCLUDED.price,
         images = EXCLUDED.images,
         description = EXCLUDED.description,
         is_featured = EXCLUDED.is_featured,
         availability = EXCLUDED.availability`,
      [
        product.customId,
        product.name,
        product.slug,
        product.category,
        product.occasion || '',
        product.price,
        product.duration || 3,
        product.deposit || 0,
        product.marketValue || 0,
        product.rating || 5,
        product.reviews || 0,
        product.isNewItem || false,
        product.isBestSeller || false,
        product.isFeatured || false,
        product.offerBadge || '',
        product.availability || 'available',
        product.availableQuantity || 1,
        product.estimatedDelivery || '2-3 days',
        product.sizes || [],
        product.images || [],
        product.description || '',
        JSON.stringify(product.specifications || {}),
        JSON.stringify(product.customerReviews || []),
      ]
    )
  }
  console.log(`Products: ${SEED_PRODUCTS.length}`)

  for (const user of SEED_USERS) {
    const hashed = await bcrypt.hash(user.password, 12)
    await client.query(
      `INSERT INTO users (custom_id, name, email, password, phone, address, role, account_status, avatar, member_since, registration_date, total_bookings)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         password = EXCLUDED.password,
         role = EXCLUDED.role,
         account_status = EXCLUDED.account_status`,
      [
        user.customId,
        user.name,
        user.email,
        hashed,
        user.phone || '',
        user.address || '',
        user.role || 'user',
        user.accountStatus || 'Active',
        user.avatar || '',
        user.memberSince || '',
        user.registrationDate || new Date().toISOString().split('T')[0],
        user.totalBookings || 0,
      ]
    )
  }
  console.log(`Users: ${SEED_USERS.length}`)

  await client.query(
    `INSERT INTO settings (custom_id, site_name, admin_email)
     VALUES ('settings_global', 'Zahara Rental Jewellery', 'admin@zahara.com')
     ON CONFLICT (custom_id) DO NOTHING`
  )

  const counts = await client.query(
    `SELECT
       (SELECT COUNT(*)::int FROM products) AS products,
       (SELECT COUNT(*)::int FROM categories) AS categories,
       (SELECT COUNT(*)::int FROM users) AS users`
  )
  console.log('Done.', counts.rows[0])
  await client.end()
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
