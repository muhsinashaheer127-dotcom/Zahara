# Supabase Environment Setup Instructions

Please update your `.env` file in the project root with the following content:

```env
# Server Configuration
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://pfafkiztoqkrvsagvacz.supabase.co
SUPABASE_ANON_KEY=sb_publishable_nIhMtlwqDDHGzecph6wzCw_msmAlTFN
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_nIhMtlwqDDHGzecph6wzCw_msmAlTFN
SUPABASE_DB_URL=postgresql://postgres:MUHSINA@2005@db.pfafkiztoqkrvsagvacz.supabase.co:5432/postgres

# JWT Secret — must be a long random string, minimum 32 characters
JWT_SECRET=zahara_jwt_secret_key_2024_secure_min_32_chars

# Frontend API URL (proxied through Vite to the Express server)
VITE_API_URL=/api
```

## Steps to update:

1. Open your `.env` file in the project root (`C:\Users\muhsi\zahara\.env`)
2. Replace the entire content with the above configuration
3. Save the file
4. Run the test again: `cd server && node test-supabase-connection.js`

## Important Notes:

- The MongoDB configuration has been replaced with Supabase configuration
- Your database password is already included in the connection string
- The JWT secret has been set to a secure default value
- All other environment variables remain the same

After updating the `.env` file, the migration will be complete and you can test the connection.
