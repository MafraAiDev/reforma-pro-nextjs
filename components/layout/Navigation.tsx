'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Search, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTenant } from '@/components/TenantThemeProvider'

export function Navigation() {
  const { theme, config } = useTenant()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/busca?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 transition-colors">
      <nav className="container-blog h-nav flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-logo text-logo text-primary flex items-center gap-2">
          {theme.logo_url ? (
            <Image src={theme.logo_url} alt={theme.logo_text} width={150} height={40} className="h-10 w-auto" />
          ) : (
            theme.logo_text
          )}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {config.menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-body-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Search + Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'h-10 border border-primary rounded-l-button px-4 text-body-sm outline-none transition-all',
                'focus:ring-2 focus:ring-primary/20 bg-white dark:bg-gray-800 dark:text-gray-100'
              )}
            />
            <button
              type="submit"
              className="h-10 px-6 bg-primary text-white font-medium text-body-sm rounded-r-button hover:bg-primary-hover transition-colors"
            >
              Search
            </button>
          </form>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-primary"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-primary"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Search */}
      {isSearchOpen && (
        <div className="md:hidden container-blog pb-4">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-10 border border-primary rounded-l-button px-4 text-body-sm outline-none"
            />
            <button
              type="submit"
              className="h-10 px-4 bg-primary text-white font-medium text-body-sm rounded-r-button"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-secondary dark:border-gray-700">
          <div className="container-blog py-4 flex flex-col gap-4">
            {config.menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-body font-medium text-primary py-2"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="divider mx-4 lg:mx-20 dark:border-gray-700" />
    </header>
  )
}
