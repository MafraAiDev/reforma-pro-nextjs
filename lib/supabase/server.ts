import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    // Return a mock client for development
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => ({
              limit: () => ({ data: null, error: new Error('Supabase not configured') }),
            }),
            single: () => ({ data: null, error: new Error('Supabase not configured') }),
          }),
          order: () => ({
            limit: () => ({ data: null, error: new Error('Supabase not configured') }),
          }),
          neq: () => ({
            eq: () => ({
              order: () => ({
                limit: () => ({ data: null, error: new Error('Supabase not configured') }),
              }),
            }),
          }),
        }),
      }),
    } as any
  }

  return createSupabaseClient(supabaseUrl, supabaseKey)
}
