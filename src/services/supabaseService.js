import { supabase } from '../lib/supabase'

const supabaseService = {
  // Products
  products: {
    getAll: async (params = {}) => {
      let query = supabase.from('products').select('*')
      
      if (params.category) {
        query = query.eq('category', params.category)
      }
      if (params.featured) {
        query = query.eq('is_featured', true)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    
    getById: async (id) => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    
    create: async (data) => {
      const { data: result, error } = await supabase
        .from('products')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return result
    },
    
    update: async (id, data) => {
      const { data: result, error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return result
    },
    
    remove: async (id) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      if (error) throw error
      return { success: true }
    }
  },

  // Categories
  categories: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      if (error) throw error
      return data
    },
    
    create: async (data) => {
      const { data: result, error } = await supabase
        .from('categories')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return result
    },
    
    update: async (id, data) => {
      const { data: result, error } = await supabase
        .from('categories')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return result
    },
    
    remove: async (id) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
      if (error) throw error
      return { success: true }
    }
  },

  // Users
  users: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    
    getById: async (id) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    
    updateProfile: async (id, data) => {
      const { data: result, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return result
    },
    
    updateStatus: async (id, status) => {
      const { data: result, error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return result
    },
    
    remove: async (id) => {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)
      if (error) throw error
      return { success: true }
    }
  },

  // Bookings
  bookings: {
    getAll: async (params = {}) => {
      let query = supabase.from('bookings').select('*')
      
      if (params.userId) {
        query = query.eq('user_id', params.userId)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    
    getById: async (id) => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    
    create: async (data) => {
      const { data: result, error } = await supabase
        .from('bookings')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return result
    },
    
    updateStatus: async (id, status, paymentStatus) => {
      const { data: result, error } = await supabase
        .from('bookings')
        .update({ status, payment_status: paymentStatus })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return result
    }
  },

  // Orders
  orders: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    
    updateStatus: async (id, status) => {
      const { data: result, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return result
    }
  },

  // Payments
  payments: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    
    updateStatus: async (id, status) => {
      const { data: result, error } = await supabase
        .from('payments')
        .update({ payment_status: status })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return result
    }
  },

  // Reviews
  reviews: {
    getAll: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    
    create: async (data) => {
      const { data: result, error } = await supabase
        .from('reviews')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return result
    },
    
    updateStatus: async (id, status) => {
      const { data: result, error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return result
    },
    
    remove: async (id) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)
      if (error) throw error
      return { success: true }
    }
  },

  // Settings
  settings: {
    get: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('custom_id', 'settings_global')
        .single()
      if (error) throw error
      return data
    },
    
    save: async (data) => {
      const { data: result, error } = await supabase
        .from('settings')
        .upsert(data)
        .select()
        .single()
      if (error) throw error
      return result
    }
  },

  // Auth
  auth: {
    login: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()
      
      return { user: data.user, profile: userData }
    },
    
    register: async (data) => {
      const { email, password, name, phone } = data
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (authError) throw authError
      
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email,
            name,
            phone,
            role: 'customer',
            status: 'active',
          })
        
        if (profileError) throw profileError
      }
      
      return { user: authData.user }
    },
    
    logout: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    },
    
    getCurrentUser: async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    }
  },

  // Health check
  health: async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('id')
        .limit(1)
      
      return {
        status: 'healthy',
        database: { isConnected: !error }
      }
    } catch (err) {
      return {
        status: 'offline',
        error: err.message,
        database: { isConnected: false }
      }
    }
  }
}

export default supabaseService
