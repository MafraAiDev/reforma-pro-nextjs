import type { SiteConfig } from '@/types'

export const siteConfig: SiteConfig = {
  logo: 'Logo',
  menuItems: [
    { label: 'Home', href: '/' },
    { label: 'Categorias', href: '/categorias' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Contato', href: '/contato' },
  ],
  footerLinks: [
    { label: 'Termos de Uso', href: '/termos' },
    { label: 'Politica de Privacidade', href: '/privacidade' },
    { label: 'FAQ', href: '/faq' },
  ],
  socialLinks: [
    { platform: 'facebook', url: 'https://facebook.com' },
    { platform: 'twitter', url: 'https://twitter.com' },
    { platform: 'instagram', url: 'https://instagram.com' },
  ],
  copyright: 'Dominio Lucrativo 2025. Todos os direitos reservados.',
}
