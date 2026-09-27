import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
)

const json = (res, status, body) => {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

const readBody = async (req) => {
  if (req.body && typeof req.body === 'object') return req.body
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

const signToken = (user) => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not configured')
  return jwt.sign(
    {
      id: user.id,
      customId: user.custom_id,
      email: user.email,
      role: user.role,
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
    customId: rest.custom_id,
    accountStatus: rest.account_status,
    memberSince: rest.member_since,
    registrationDate: rest.registration_date,
    totalBookings: rest.total_bookings,
  }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
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
    if (user.account_status === 'Blocked') {
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
