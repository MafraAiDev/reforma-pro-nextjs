import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/types'

interface MorePostsProps {
  posts: Post[]
  title?: string
}

export function MorePosts({ posts, title = 'More Posts' }: MorePostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="mt-12">
      <h3 className="text-h3 font-normal text-text-secondary mb-6">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group"
          >
            {/* Image */}
            <div className="relative h-[166px] rounded-card overflow-hidden bg-background-tag mb-3">
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
            {/* Title */}
            <h4 className="text-h4 text-text-secondary group-hover:text-primary transition-colors">
              {post.title}
            </h4>
          </Link>
        ))}
      </div>
    </section>
  )
}
