'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTenant } from '@/components/TenantThemeProvider'

export function Footer() {
  const { theme, config } = useTenant()

  return (
    <footer className="bg-background-dark mt-auto">
      <div className="container-blog py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="font-logo text-logo text-white flex items-center gap-2">
            {theme.logo_url ? (
              <Image src={theme.logo_url} alt={theme.logo_text} width={150} height={40} className="h-10 w-auto brightness-0 invert" />
            ) : (
              theme.logo_text
            )}
          </Link>

          {/* Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {config.footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body-sm font-bold text-white hover:text-secondary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-body-sm text-white/80 text-center md:text-right">
            &copy; {config.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
