import { supabase } from '../lib/supabase'
import {
  normalizeProduct,
  normalizeCategory,
  normalizeUser,
  toCamel,
} from '../utils/supabaseNormalize'

const throwIf = (error) => {
  if (error) throw new Error(error.message || 'Supabase request failed')
}

const matchId = (query, id) =>
  query.or(`custom_id.eq.${id},slug.eq.${id},id.eq.${id}`)

export const supabaseProductService = {
  getAll: async (params = {}) => {
    let query = supabase.from('products').select('*')
    if (params.category) query = query.eq('category', params.category)
    if (params.occasion) query = query.eq('occasion', params.occasion)
    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`)
    }
    const { data, error } = await query.order('created_at', { ascending: false })
    throwIf(error)
    return (data || []).map(normalizeProduct)
  },
  getById: async (id) => {
    const { data, error } = await matchId(supabase.from('products').select('*'), id).maybeSingle()
    throwIf(error)
    if (!data) throw new Error('Product not found.')
    return normalizeProduct(data)
  },
  create: async (payload) => {
    const row = {
      custom_id: payload.customId || payload.id || `prod_${Date.now()}`,
      name: payload.name,
      slug: payload.slug,
      category: payload.category,
      occasion: payload.occasion || '',
      price: payload.price,
      duration: payload.duration ?? 3,
      deposit: payload.deposit ?? 0,
      market_value: payload.marketValue ?? 0,
      is_featured: payload.isFeatured ?? false,
      availability: payload.availability || 'available',
      available_quantity: payload.availableQuantity ?? 1,
      images: payload.images || [],
      description: payload.description || '',
      specifications: payload.specifications || {},
    }
    const { data, error } = await supabase.from('products').insert(row).select().single()
    throwIf(error)
    return normalizeProduct(data)
  },
  update: async (id, payload) => {
    const row = {}
    const map = {
      name: 'name', slug: 'slug', category: 'category', occasion: 'occasion',
      price: 'price', duration: 'duration', deposit: 'deposit',
      marketValue: 'market_value', isFeatured: 'is_featured',
      availability: 'availability', availableQuantity: 'available_quantity',
      images: 'images', description: 'description', specifications: 'specifications',
    }
    Object.entries(map).forEach(([from, to]) => {
      if (payload[from] !== undefined) row[to] = payload[from]
    })
    const { data, error } = await matchId(supabase.from('products').update(row).select(), id).maybeSingle()
    throwIf(error)
    return normalizeProduct(data)
  },
  remove: async (id) => {
    const { error } = await matchId(supabase.from('products').delete(), id)
    throwIf(error)
    return { success: true, id }
  },
}

export const supabaseCategoryService = {
  getAll: async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name')
    throwIf(error)
    return (data || []).map(normalizeCategory)
  },
  create: async (payload) => {
    const { data, error } = await supabase.from('categories').insert({
      custom_id: payload.customId || payload.slug,
      name: payload.name,
      slug: payload.slug,
      image: payload.image || '',
      description: payload.description || '',
    }).select().single()
    throwIf(error)
    return normalizeCategory(data)
  },
  update: async (id, payload) => {
    const row = {}
    if (payload.name !== undefined) row.name = payload.name
    if (payload.slug !== undefined) row.slug = payload.slug
    if (payload.image !== undefined) row.image = payload.image
    if (payload.description !== undefined) row.description = payload.description
    const { data, error } = await matchId(supabase.from('categories').update(row).select(), id).maybeSingle()
    throwIf(error)
    return normalizeCategory(data)
  },
  remove: async (id) => {
    const { error } = await matchId(supabase.from('categories').delete(), id)
    throwIf(error)
    return { success: true, id }
  },
}

export const supabaseUserService = {
  getAll: async () => {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false })
    throwIf(error)
    return (data || []).map((u) => {
      const n = normalizeUser(u)
      delete n.password
      return n
    })
  },
  getById: async (id) => {
    const { data, error } = await matchId(supabase.from('users').select('*'), id).maybeSingle()
    throwIf(error)
    const n = normalizeUser(data)
    if (n) delete n.password
    return n
  },
  updateProfile: async (id, payload) => {
    const row = {}
    if (payload.name !== undefined) row.name = payload.name
    if (payload.phone !== undefined) row.phone = payload.phone
    if (payload.address !== undefined) row.address = payload.address
    if (payload.avatar !== undefined) row.avatar = payload.avatar
    const { data, error } = await matchId(supabase.from('users').update(row).select(), id).maybeSingle()
    throwIf(error)
    const n = normalizeUser(data)
    if (n) delete n.password
    return { user: n }
  },
  updateStatus: async (id, status) => {
    const { data, error } = await matchId(
      supabase.from('users').update({ account_status: status }).select(),
      id
    ).maybeSingle()
    throwIf(error)
    const n = normalizeUser(data)
    if (n) delete n.password
    return n
  },
  remove: async (id) => {
    const { error } = await matchId(supabase.from('users').delete(), id)
    throwIf(error)
    return { success: true }
  },
}

export const supabaseBookingService = {
  getAll: async (params = {}) => {
    let query = supabase.from('bookings').select('*')
    if (params.userId) query = query.or(`customer_email.eq.${params.userId},user_id.eq.${params.userId}`)
    const { data, error } = await query.order('created_at', { ascending: false })
    throwIf(error)
    return (data || []).map(toCamel)
  },
  getById: async (id) => {
    const { data, error } = await matchId(supabase.from('bookings').select('*'), id).maybeSingle()
    throwIf(error)
    return toCamel(data)
  },
  create: async (payload) => {
    const row = {
      custom_id: payload.customId || `ZH-BK-${Date.now()}`,
      customer_name: payload.customerName || payload.customer,
      customer_email: payload.customerEmail || payload.email,
      customer_phone: payload.customerPhone || payload.phone || '',
      product_id: payload.productId || null,
      product_name: payload.productName || payload.product,
      product_image: payload.productImage || '',
      start_date: payload.startDate,
      end_date: payload.endDate,
      rental_days: payload.rentalDays || payload.duration || 3,
      rental_amount: payload.rentalAmount || payload.price,
      security_deposit: payload.securityDeposit || payload.deposit || 0,
      total_amount: payload.totalAmount || (Number(payload.price || 0) + Number(payload.deposit || 0)),
      status: payload.status || 'Confirmed',
      payment_status: payload.paymentStatus || 'Paid',
    }
    const { data, error } = await supabase.from('bookings').insert(row).select().single()
    throwIf(error)
    return toCamel(data)
  },
  updateStatus: async (id, status, paymentStatus) => {
    const row = { status }
    if (paymentStatus) row.payment_status = paymentStatus
    const { data, error } = await matchId(supabase.from('bookings').update(row).select(), id).maybeSingle()
    throwIf(error)
    return toCamel(data)
  },
}

export const supabaseOrderService = {
  getAll: async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    throwIf(error)
    return (data || []).map(toCamel)
  },
  updateStatus: async (id, status) => {
    const { data, error } = await matchId(supabase.from('orders').update({ status }).select(), id).maybeSingle()
    throwIf(error)
    return toCamel(data)
  },
}

export const supabasePaymentService = {
  getAll: async () => {
    const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false })
    throwIf(error)
    return (data || []).map(toCamel)
  },
  updateStatus: async (id, status) => {
    const { data, error } = await matchId(
      supabase.from('payments').update({ payment_status: status }).select(),
      id
    ).maybeSingle()
    throwIf(error)
    return toCamel(data)
  },
}

export const supabaseReviewService = {
  getAll: async () => {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
    throwIf(error)
    return (data || []).map(toCamel)
  },
  create: async (payload) => {
    const { data, error } = await supabase.from('reviews').insert({
      custom_id: payload.customId || `rev_${Date.now()}`,
      customer_name: payload.customerName || payload.customer,
      customer_email: payload.customerEmail || payload.email,
      product_id: payload.productId,
      product_name: payload.productName || payload.product,
      rating: payload.rating,
      comment: payload.comment || payload.text,
      status: payload.status || 'Pending',
    }).select().single()
    throwIf(error)
    return toCamel(data)
  },
  updateStatus: async (id, status) => {
    const { data, error } = await matchId(supabase.from('reviews').update({ status }).select(), id).maybeSingle()
    throwIf(error)
    return toCamel(data)
  },
  remove: async (id) => {
    const { error } = await matchId(supabase.from('reviews').delete(), id)
    throwIf(error)
    return { success: true }
  },
}

export const supabaseSettingsService = {
  get: async () => {
    const { data, error } = await supabase.from('settings').select('*').eq('custom_id', 'settings_global').maybeSingle()
    if (error && error.code !== 'PGRST116') throwIf(error)
    return toCamel(data) || {}
  },
  save: async (payload) => {
    const { data, error } = await supabase.from('settings').upsert({
      custom_id: 'settings_global',
      ...payload,
    }).select().single()
    throwIf(error)
    return toCamel(data)
  },
}

export const supabaseHealth = async () => {
  const { error } = await supabase.from('products').select('id').limit(1)
  return {
    status: error ? 'offline' : 'ok',
    database: { isConnected: !error, host: 'supabase' },
    error: error?.message,
  }
}
