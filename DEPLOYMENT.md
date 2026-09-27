# Zahara Rental Jewellery - Deployment Guide

## Architecture Overview

```
🌐 INTERNET
     │
     ▼
┌──────────────┐
│    Vercel    │
│ React + Vite │
└──────┬───────┘
     │
     ▼
┌──────────────┐
│   Supabase   │
│              │
│ Edge         │
│ Functions    │
│      ↓       │
│ PostgreSQL   │
│ Auth         │
│ Storage      │
└──────────────┘
```

## Deployment Steps

### 1. Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up Database Schema**
   - Run the SQL schema from `supabase/schema.sql`
   - This creates tables for: products, categories, users, bookings, payments, reviews, settings

3. **Configure Edge Functions**
   - Navigate to Edge Functions in Supabase dashboard
   - Deploy the functions from `supabase/functions/` directory:
     - `products/index.ts`
     - `categories/index.ts`
     - `bookings/index.ts`
     - `auth/index.ts`
     - `settings/index.ts`
     - `users/index.ts`
     - `payments/index.ts`
     - `reviews/index.ts`
     - `health/index.ts`

4. **Set Environment Variables in Supabase**
   - Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions

### 2. Vercel Deployment

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```
   Or connect your GitHub repository to Vercel for automatic deployments

3. **Configure Environment Variables in Vercel**
   Add these in Vercel Project Settings → Environment Variables:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_USE_SUPABASE=true
   ```

4. **Configure Rewrites** (already in vercel.json)
   - API routes are proxied to Supabase Edge Functions
   - Example: `/api/products` → `https://your-project.supabase.co/functions/v1/products`

### 3. Local Development

For local development with Express server:

1. **Copy environment variables**
   ```bash
   cp .env.example .env
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development servers**
   ```bash
   # Frontend only
   npm run dev

   # Backend only
   npm run server:dev

   # Both frontend and backend
   npm run dev:all
   ```

For local development with Supabase:

1. **Set environment variables**
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_USE_SUPABASE=true
   ```

2. **Run frontend**
   ```bash
   npm run dev
   ```

## Environment Variables

### Production (Vercel + Supabase)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_USE_SUPABASE=true
```

### Development (Express + MongoDB)
```
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_DB_URL=postgresql://...
JWT_SECRET=your_jwt_secret
VITE_API_URL=/api
```

## Service Configuration

### API Service Switching

The application automatically switches between Express backend and Supabase based on the `VITE_USE_SUPABASE` environment variable:

- `VITE_USE_SUPABASE=true` → Uses Supabase client and Edge Functions
- `VITE_USE_SUPABASE=false` or not set → Uses Express backend API

### Supabase Client

Located in `src/lib/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### API Services

Located in `src/services/supabaseService.js`:
- Direct Supabase client operations
- Replaces Express API calls in production
- Maintains same interface as Express services

## Edge Functions

### Available Functions

1. **products** - CRUD operations for products
2. **categories** - CRUD operations for categories
3. **bookings** - Booking management
4. **auth** - User authentication (register, login)
5. **settings** - Site settings management
6. **users** - User management
7. **payments** - Payment tracking
8. **reviews** - Review management
9. **health** - Health check endpoint

### Edge Function Structure

All functions follow this pattern:
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  // Process request
  // Return response
})
```

## Database Schema

Key tables:
- `products` - Jewellery items
- `categories` - Product categories
- `users` - User profiles
- `bookings` - Rental bookings
- `payments` - Payment records
- `reviews` - Customer reviews
- `settings` - Site configuration

See `supabase/schema.sql` for complete schema.

## Troubleshooting

### CORS Issues
- Ensure Edge Functions have proper CORS headers
- Check Vercel rewrites configuration

### Authentication
- Verify Supabase Auth is enabled
- Check JWT configuration in development mode

### Database Connection
- Verify Supabase project is active
- Check environment variables are correctly set
- Ensure Edge Functions have service role key

### Build Issues
- Clear Vercel cache: `vercel --force`
- Check build logs in Vercel dashboard
- Verify all dependencies are installed

## Migration from Express to Supabase

1. **Database Migration**
   - Export data from MongoDB
   - Import to Supabase PostgreSQL
   - Update data structure to match new schema

2. **Authentication Migration**
   - Create users in Supabase Auth
   - Migrate user profiles to `users` table
   - Update password hashing if needed

3. **File Storage**
   - Upload images to Supabase Storage
   - Update image URLs in database
   - Configure storage buckets

## Performance Optimization

1. **Edge Functions**
   - Enable caching where appropriate
   - Optimize database queries
   - Use indexes on frequently queried columns

2. **Frontend**
   - Implement lazy loading for images
   - Use code splitting for large components
   - Enable compression in Vercel

3. **Database**
   - Regular maintenance and vacuuming
   - Monitor query performance
   - Use connection pooling

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to git
   - Use Vercel environment variables
   - Rotate keys regularly

2. **API Security**
   - Enable Row Level Security (RLS) in Supabase
   - Validate all inputs
   - Rate limit API calls

3. **Authentication**
   - Use secure password policies
   - Implement session timeout
   - Enable 2FA for admin accounts

## Monitoring

1. **Vercel Analytics**
   - Enable in project settings
   - Monitor performance metrics
   - Track error rates

2. **Supabase Dashboard**
   - Monitor database performance
   - Track Edge Function invocations
   - Review auth logs

3. **Error Tracking**
   - Consider integrating Sentry or similar
   - Set up alerting for critical errors
   - Regular log review

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Check Vercel documentation: https://vercel.com/docs
- Review project-specific documentation in code comments
