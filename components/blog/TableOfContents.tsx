'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { TableOfContentsItem } from '@/types'

interface TableOfContentsProps {
  items: TableOfContentsItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -80% 0px' }
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <aside className="sticky top-24">
      <div className="border-l-2 border-secondary pl-4">
        <h4 className="text-h2 text-text mb-4">Table of Contents</h4>
        <nav className="flex flex-col gap-2">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                'text-body text-primary hover:text-primary-hover transition-colors',
                item.level > 2 && 'ml-4',
                item.level > 3 && 'ml-8',
                activeId === item.id && 'font-bold'
              )}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}
