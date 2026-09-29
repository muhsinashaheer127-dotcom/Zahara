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

    const { name, email, password, phone, address } = await readBody(req)
    if (!name?.trim() || !email?.trim() || !password || password.length < 4) {
      return json(res, 400, { success: false, message: 'Name, email, and password (min 4 characters) are required.' })
    }

    const cleanEmail = String(email).toLowerCase().trim()
    const { data: existing } = await supabase.from('users').select('id').eq('email', cleanEmail).maybeSingle()
    if (existing) {
      return json(res, 409, { success: false, message: 'An account with this email address already exists.' })
    }

    const hashed = await bcrypt.hash(password, 12)
    const { data: user, error } = await supabase.from('users').insert({
      custom_id: `usr_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: hashed,
      phone: phone || '',
      address: address || '',
      role: 'user',
      account_status: 'Active',
      member_since: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    }).select().single()

    if (error) throw error

    const secret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET
    const token = jwt.sign(
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

    const { password: _pw, ...rest } = user
    return json(res, 201, {
      success: true,
      token,
      user: {
        ...rest,
        customId: rest.custom_id || rest.customId,
        accountStatus: rest.account_status || rest.accountStatus || 'Active',
        memberSince: rest.member_since || rest.memberSince || '',
        registrationDate: rest.registration_date || rest.registrationDate || '',
        totalBookings: rest.total_bookings ?? rest.totalBookings ?? 0,
      },
    })
  } catch (err) {
    return json(res, 500, { success: false, message: err.message || 'Registration failed.' })
  }
}
