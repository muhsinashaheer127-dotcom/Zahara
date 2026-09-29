import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const DEFAULT_JWT_SECRET = 'zahara_super_secret_jwt_key_change_in_production_2025'
const DEFAULT_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmYWZraXp0b3FrcnZzYWd2YWN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDM2MTQ0MiwiZXhwIjoyMTA1OTM3NDQyfQ.5uEYH1c7dWMyxuiICra3QYtv6dlN4taK1gBnzE4Ae_A'

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'https://pfafkiztoqkrvsagvacz.supabase.co'

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  DEFAULT_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

const json = (res, status, body) => {
  setCorsHeaders(res)
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

const readBody = async (req) => {
  if (req.body) {
    if (typeof req.body === 'object') return req.body
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body)
      } catch {
        return {}
      }
    }
  }
  try {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    const raw = Buffer.concat(chunks).toString('utf8')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const signToken = (user) => {
  const secret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET
  return jwt.sign(
    {
      id: user.id,
      customId: user.custom_id || user.customId,
      email: user.email,
      role: user.role || 'user',
      name: user.name,
    },
    secret,
    { expiresIn: '7d' }
  )
}

const publicUser = (user) => {
  const { password, ...rest } = user
  return {
    ...rest,
    customId: rest.custom_id || rest.customId,
    accountStatus: rest.account_status || rest.accountStatus || 'Active',
    memberSince: rest.member_since || rest.memberSince || '',
    registrationDate: rest.registration_date || rest.registrationDate || '',
    totalBookings: rest.total_bookings ?? rest.totalBookings ?? 0,
  }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res)
    res.statusCode = 204
    res.end()
    return
  }

  try {
    if (req.method !== 'POST') {
      return json(res, 405, { success: false, message: 'Method not allowed' })
    }

    const { email, password } = await readBody(req)
    if (!email || !password) {
      return json(res, 400, { success: false, message: 'Email and password are required.' })
    }

    const cleanEmail = String(email).toLowerCase().trim()
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle()

    if (error) throw error
    if (!user) {
      return json(res, 401, { success: false, message: 'No account found with this email address.' })
    }
    if (user.account_status === 'Blocked' || user.accountStatus === 'Blocked') {
      return json(res, 403, { success: false, message: 'Your account has been blocked.' })
    }

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return json(res, 401, { success: false, message: 'Incorrect password. Please try again.' })
    }

    const token = signToken(user)
    return json(res, 200, { success: true, token, user: publicUser(user) })
  } catch (err) {
    return json(res, 500, { success: false, message: err.message || 'Login failed.' })
  }
}
