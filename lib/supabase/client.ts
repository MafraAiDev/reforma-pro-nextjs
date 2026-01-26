/**
 * Cliente Supabase - PROJETO 1 (Site + Blog)
 * 
 * Usado para operações client-side no blog.
 * Schema: /supabase/projeto1-site-blog/schema.sql
 */

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Tenant ID para queries multi-tenant
export function getTenantId(): string {
  return process.env.NEXT_PUBLIC_TENANT_ID || 'default'
}
