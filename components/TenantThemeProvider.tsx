'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import type { TenantTheme, TenantConfig } from '@/types'

interface TenantContextValue {
  theme: TenantTheme
  config: TenantConfig
}

const TenantContext = createContext<TenantContextValue | null>(null)

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within a TenantThemeProvider')
  }
  return context
}

interface TenantThemeProviderProps {
  children: ReactNode
  config: TenantConfig
  fontsUrl: string
}

export function TenantThemeProvider({ children, config, fontsUrl }: TenantThemeProviderProps) {
  const { theme } = config

  useEffect(() => {
    // Inject CSS variables into :root
    const root = document.documentElement
    root.style.setProperty('--tenant-primary', theme.primary_color)
    root.style.setProperty('--tenant-primary-hover', theme.primary_hover_color)
    root.style.setProperty('--tenant-secondary', theme.secondary_color)
    root.style.setProperty('--tenant-text', theme.text_color)
    root.style.setProperty('--tenant-text-secondary', theme.text_secondary_color)
    root.style.setProperty('--tenant-background', theme.background_color)
    root.style.setProperty('--tenant-font-logo', `'${theme.font_logo}', serif`)
    root.style.setProperty('--tenant-font-body', `'${theme.font_body}', sans-serif`)

    // Cleanup on unmount
    return () => {
      root.style.removeProperty('--tenant-primary')
      root.style.removeProperty('--tenant-primary-hover')
      root.style.removeProperty('--tenant-secondary')
      root.style.removeProperty('--tenant-text')
      root.style.removeProperty('--tenant-text-secondary')
      root.style.removeProperty('--tenant-background')
      root.style.removeProperty('--tenant-font-logo')
      root.style.removeProperty('--tenant-font-body')
    }
  }, [theme])

  useEffect(() => {
    // Load Google Fonts dynamically
    const existingLink = document.querySelector(`link[href="${fontsUrl}"]`)
    if (!existingLink) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = fontsUrl
      document.head.appendChild(link)
    }
  }, [fontsUrl])

  return (
    <TenantContext.Provider value={{ theme, config }}>
      {children}
    </TenantContext.Provider>
  )
}
