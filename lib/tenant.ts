import { createClient } from '@/lib/supabase/server'
import type { TenantTheme, TenantConfig, MenuItem, FooterLink, SocialLink } from '@/types'

// Default theme (fallback when no tenant is configured)
export const defaultTheme: TenantTheme = {
  id: 'default',
  tenant_id: 'default',
  logo_text: 'Logo',
  primary_color: '#18A0FB',
  primary_hover_color: '#1590E0',
  secondary_color: '#6DE4EA',
  text_color: '#000000',
  text_secondary_color: 'rgba(0, 0, 0, 0.8)',
  background_color: '#FFFFFF',
  font_logo: 'Cinzel Decorative',
  font_body: 'Montserrat',
  site_name: 'Dominio Lucrativo',
  site_description: 'Conteudo especializado para profissionais da saude',
}

const defaultMenuItems: MenuItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Categorias', href: '/categorias' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Contato', href: '/contato' },
]

const defaultFooterLinks: FooterLink[] = [
  { label: 'Termos de Uso', href: '/termos' },
  { label: 'Politica de Privacidade', href: '/privacidade' },
  { label: 'FAQ', href: '/faq' },
]

const defaultSocialLinks: SocialLink[] = [
  { platform: 'facebook', url: 'https://facebook.com' },
  { platform: 'twitter', url: 'https://twitter.com' },
  { platform: 'instagram', url: 'https://instagram.com' },
]

export const defaultConfig: TenantConfig = {
  theme: defaultTheme,
  menuItems: defaultMenuItems,
  footerLinks: defaultFooterLinks,
  socialLinks: defaultSocialLinks,
  copyright: 'Dominio Lucrativo 2025. Todos os direitos reservados.',
}

/**
 * Get tenant ID from environment or hostname
 * In production, this would be determined by the subdomain or custom domain
 */
export function getTenantId(): string {
  // Check environment variable first
  if (process.env.TENANT_ID) {
    return process.env.TENANT_ID
  }
  // Default tenant
  return 'default'
}

/**
 * Fetch tenant theme from Supabase
 */
export async function getTenantTheme(tenantId?: string): Promise<TenantTheme> {
  const id = tenantId || getTenantId()

  if (id === 'default') {
    return defaultTheme
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('tenant_themes')
      .select('*')
      .eq('tenant_id', id)
      .single()

    if (error || !data) {
      console.warn(`Tenant theme not found for ${id}, using default`)
      return defaultTheme
    }

    return data as TenantTheme
  } catch (error) {
    console.error('Error fetching tenant theme:', error)
    return defaultTheme
  }
}

/**
 * Fetch full tenant configuration including theme, menu, and links
 */
export async function getTenantConfig(tenantId?: string): Promise<TenantConfig> {
  const id = tenantId || getTenantId()

  if (id === 'default') {
    return defaultConfig
  }

  try {
    const supabase = await createClient()

    // Fetch theme
    const { data: theme } = await supabase
      .from('tenant_themes')
      .select('*')
      .eq('tenant_id', id)
      .single()

    // Fetch menu items
    const { data: menuItems } = await supabase
      .from('tenant_menu_items')
      .select('label, href')
      .eq('tenant_id', id)
      .order('order', { ascending: true })

    // Fetch footer links
    const { data: footerLinks } = await supabase
      .from('tenant_footer_links')
      .select('label, href')
      .eq('tenant_id', id)
      .order('order', { ascending: true })

    // Fetch social links
    const { data: socialLinks } = await supabase
      .from('tenant_social_links')
      .select('platform, url')
      .eq('tenant_id', id)

    return {
      theme: (theme as TenantTheme) || defaultTheme,
      menuItems: (menuItems as MenuItem[]) || defaultMenuItems,
      footerLinks: (footerLinks as FooterLink[]) || defaultFooterLinks,
      socialLinks: (socialLinks as SocialLink[]) || defaultSocialLinks,
      copyright: theme?.site_name
        ? `${theme.site_name} ${new Date().getFullYear()}. Todos os direitos reservados.`
        : defaultConfig.copyright,
    }
  } catch (error) {
    console.error('Error fetching tenant config:', error)
    return defaultConfig
  }
}

/**
 * Generate CSS variables from tenant theme
 */
export function generateThemeCssVariables(theme: TenantTheme): string {
  return `
    --tenant-primary: ${theme.primary_color};
    --tenant-primary-hover: ${theme.primary_hover_color};
    --tenant-secondary: ${theme.secondary_color};
    --tenant-text: ${theme.text_color};
    --tenant-text-secondary: ${theme.text_secondary_color};
    --tenant-background: ${theme.background_color};
    --tenant-font-logo: '${theme.font_logo}', serif;
    --tenant-font-body: '${theme.font_body}', sans-serif;
  `.trim()
}

/**
 * Get Google Fonts URL for tenant fonts
 */
export function getGoogleFontsUrl(theme: TenantTheme): string {
  const fonts = new Set([theme.font_logo, theme.font_body])
  const fontParams = Array.from(fonts)
    .map(font => {
      const encodedFont = encodeURIComponent(font)
      // Common weights for flexibility
      return `family=${encodedFont}:wght@400;500;700`
    })
    .join('&')

  return `https://fonts.googleapis.com/css2?${fontParams}&display=swap`
}
