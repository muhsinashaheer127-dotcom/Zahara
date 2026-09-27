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

    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET is not configured')
    const token = jwt.sign(
      { id: user.id, customId: user.custom_id, email: user.email, role: user.role, name: user.name },
      secret,
      { expiresIn: '7d' }
    )

    const { password: _pw, ...rest } = user
    return json(res, 201, {
      success: true,
      token,
      user: { ...rest, customId: rest.custom_id, accountStatus: rest.account_status },
    })
  } catch (err) {
    return json(res, 500, { success: false, message: err.message || 'Registration failed.' })
  }
}
