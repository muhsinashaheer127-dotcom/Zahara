# Zahara Rental Jewellery

Premium luxury jewellery rentals for every special moment. Experience elegance without compromise.

## 🌟 Features

- **Product Catalog**: Browse and filter luxury jewellery collections
- **Rental System**: Flexible rental durations with secure deposits
- **User Authentication**: Secure login/registration with role-based access
- **Admin Dashboard**: Complete admin panel for managing products, bookings, and users
- **Responsive Design**: Beautiful UI that works on all devices
- **WhatsApp Integration**: Direct customer support via WhatsApp

## 🏗️ Architecture

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

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for production)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd zahara
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`

### Development

#### With Express Backend (Local Development)
```bash
# Run both frontend and backend
npm run dev:all

# Or run separately
npm run dev          # Frontend only
npm run server:dev   # Backend only
```

#### With Supabase (Production-like)
```bash
# Set environment variables
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_USE_SUPABASE=true

# Run frontend
npm run dev
```

### Build for Production

```bash
npm run build
```

## 📦 Deployment

### Vercel + Supabase (Recommended)

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

Quick steps:
1. Set up Supabase project and deploy Edge Functions
2. Connect repository to Vercel
3. Configure environment variables in Vercel
4. Deploy

### Environment Variables

**Production (Vercel + Supabase):**
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_USE_SUPABASE=true
```

**Development (Express + MongoDB):**
```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=/api
```

## 📁 Project Structure

```
zahara/
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── services/       # API services (Supabase/Express)
│   ├── lib/            # Utilities and clients
│   ├── data/           # Static data
│   └── utils/          # Helper functions
├── server/             # Express backend (development)
├── supabase/           # Supabase configuration
│   ├── functions/      # Edge Functions
│   └── schema.sql      # Database schema
├── public/             # Static assets
└── vercel.json         # Vercel configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start Vite development server
- `npm run server` - Start Express backend
- `npm run server:dev` - Start Express with hot reload
- `npm run dev:all` - Run both frontend and backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run seed` - Seed database with sample data

## 🎨 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion
- **Backend**: Express.js (development), Supabase Edge Functions (production)
- **Database**: MongoDB (development), PostgreSQL/Supabase (production)
- **Authentication**: JWT (development), Supabase Auth (production)
- **Deployment**: Vercel

## 📞 Contact

- **Phone**: +91 7510484236
- **WhatsApp**: +91 7510484236
- **Email**: zahararentaljewellery@gmail.com
- **Instagram**: @zahara_rental_jewellery

## 📄 License

This project is proprietary software. All rights reserved.

---

For detailed deployment and configuration information, please refer to [DEPLOYMENT.md](./DEPLOYMENT.md). 
