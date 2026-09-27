import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Import all Mongoose models
import { User } from '../server/models/User.js';
import { Category } from '../server/models/Category.js';
import { Product } from '../server/models/Product.js';
import { Booking } from '../server/models/Booking.js';
import { Order } from '../server/models/Order.js';
import { Payment } from '../server/models/Payment.js';
import { Review } from '../server/models/Review.js';
import { Settings } from '../server/models/Settings.js';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!MONGO_URI || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function migrate() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    // 1. Migrate Categories
    console.log("Migrating Categories...");
    const categories = await Category.find({});
    for (const cat of categories) {
      await supabase.from('categories').upsert({
        custom_id: cat.customId || cat._id.toString(),
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
        description: cat.description,
      });
    }

    // 2. Migrate Users
    console.log("Migrating Users...");
    const users = await User.find({});
    for (const user of users) {
      await supabase.from('users').upsert({
        custom_id: user.customId || user._id.toString(),
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        address: user.address,
        role: user.role,
        account_status: user.accountStatus,
        avatar: user.avatar,
        member_since: user.memberSince,
        total_bookings: user.totalBookings,
      });
    }

    // 3. Migrate Products
    console.log("Migrating Products...");
    const products = await Product.find({});
    for (const prod of products) {
      await supabase.from('products').upsert({
        custom_id: prod.customId || prod._id.toString(),
        name: prod.name,
        slug: prod.slug,
        category_id: prod.category,
        occasion: prod.occasion,
        price: prod.price,
        duration: prod.duration,
        deposit: prod.deposit,
        market_value: prod.marketValue,
        rating: prod.rating,
        reviews: prod.reviews,
        is_new_item: prod.isNewItem,
        is_best_seller: prod.isBestSeller,
        is_featured: prod.isFeatured,
        offer_badge: prod.offerBadge,
        availability: prod.availability,
        available_quantity: prod.availableQuantity,
        estimated_delivery: prod.estimatedDelivery,
        sizes: prod.sizes,
        images: prod.images,
        description: prod.description,
        spec_material: prod.specifications?.material,
        spec_stones: prod.specifications?.stones,
        spec_weight: prod.specifications?.weight,
        spec_care: prod.specifications?.care,
        spec_finish: prod.specifications?.finish,
        spec_insurance: prod.specifications?.insurance,
      });
    }

    // Add similar loops for Bookings, Orders, Payments, Reviews, Settings
    console.log("Migration script base complete. Run this to migrate base data.");
    console.log("To migrate the rest of the tables, add them to this script following the same pattern.");
    
    process.exit(0);
  } catch (err) {
    console.error("Migration Error:", err);
    process.exit(1);
  }
}

migrate();
