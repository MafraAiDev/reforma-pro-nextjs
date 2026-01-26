import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/types'
import { formatRelativeTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: Post
  variant?: 'featured' | 'large' | 'small'
}

export function PostCard({ post, variant = 'small' }: PostCardProps) {
  const isFeatured = variant === 'featured'
  const isLarge = variant === 'large'

  return (
    <article
      className={cn(
        'card-post group',
        isFeatured && 'col-span-2 row-span-2',
        isLarge && 'col-span-1 row-span-2'
      )}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Image */}
        <div
          className={cn(
            'relative overflow-hidden bg-background-tag',
            isFeatured ? 'h-[400px]' : isLarge ? 'h-[300px]' : 'h-[206px]'
          )}
        >
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10" />
          )}
        </div>

        {/* Content */}
        <div className={cn('p-6', isFeatured ? 'p-10' : isLarge ? 'p-6' : 'p-4')}>
          {/* Category & Title */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3
              className={cn(
                'font-bold text-text group-hover:text-primary transition-colors',
                isFeatured ? 'text-h3' : isLarge ? 'text-h4' : 'text-body font-bold'
              )}
            >
              {post.title}
            </h3>
            <span
              className={cn(
                'text-primary whitespace-nowrap',
                isFeatured ? 'text-body' : 'text-small'
              )}
            >
              {post.category.name}
            </span>
          </div>

          {/* Author & Time */}
          <div className="flex items-center gap-2 text-caption mb-3">
            <span className="text-secondary">{post.author.name}</span>
            <span className="text-text-muted">|</span>
            <span className="text-text-muted">{formatRelativeTime(post.published_at)}</span>
          </div>

          {/* Excerpt */}
          <p
            className={cn(
              'text-text-secondary line-clamp-3',
              isFeatured ? 'text-body' : 'text-small'
            )}
          >
            {post.excerpt}
          </p>
        </div>
      </Link>
    </article>
  )
}
