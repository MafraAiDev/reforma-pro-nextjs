import Link from 'next/link'
import type { Tag } from '@/types'

interface TagsProps {
  tags: Tag[]
}

export function Tags({ tags }: TagsProps) {
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/tags/${tag.slug}`}
          className="tag hover:bg-background-dark hover:text-white transition-colors"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  )
}
