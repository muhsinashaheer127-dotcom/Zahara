import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? 'https://pfafkiztoqkrvsagvacz.supabase.co',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmYWZraXp0b3FrcnZzYWd2YWN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDM2MTQ0MiwiZXhwIjoyMTA1OTM3NDQyfQ.5uEYH1c7dWMyxuiICra3QYtv6dlN4taK1gBnzE4Ae_A'
    )

    const method = req.method

    if (method === 'GET') {
      const { data, error } = await supabaseClient
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (method === 'POST') {
      const body = await req.json()
      const { data, error } = await supabaseClient
        .from('bookings')
        .insert(body)
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (method === 'PUT') {
      const body = await req.json()
      const { id, ...updates } = body
      const { data, error } = await supabaseClient
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
