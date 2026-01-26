import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  moreLink?: string
  moreText?: string
}

export function SectionHeader({ title, moreLink, moreText = 'More' }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-h1 text-text dark:text-gray-100">{title}</h2>
      {moreLink && (
        <Link
          href={moreLink}
          className="flex items-center gap-2 text-h3 font-normal text-primary-dark hover:text-primary transition-colors"
        >
          {moreText}
          <ArrowRight className="w-5 h-5" />
        </Link>
      )}
    </div>
  )
}
