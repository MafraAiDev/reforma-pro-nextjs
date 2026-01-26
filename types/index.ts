export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export interface Author {
  id: string
  name: string
  avatar?: string
  bio?: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  featured_image?: string
  category: Category
  author: Author
  tags: Tag[]
  published_at: string
  created_at: string
  updated_at: string
  is_featured: boolean
  reading_time_minutes: number
  meta_title?: string
  meta_description?: string
}

export interface Comment {
  id: string
  post_id: string
  author_name: string
  author_email: string
  content: string
  created_at: string
  is_approved: boolean
}
