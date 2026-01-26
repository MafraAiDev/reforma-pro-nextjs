import { createClient } from '@/lib/supabase/server'
import type { Post, Comment, Category } from '@/types'

// Mock data for development
const mockPosts: Post[] = [
  {
    id: '1',
    slug: 'marketing-digital-para-medicos',
    title: 'Marketing Digital para Medicos',
    excerpt: 'Descubra as melhores estrategias de marketing digital para destacar sua clinica e atrair mais pacientes.',
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>',
    featured_image: '',
    category: { id: '1', name: 'Marketing', slug: 'marketing' },
    author: { id: '1', name: 'Dr. Silva' },
    tags: [
      { id: '1', name: 'marketing', slug: 'marketing' },
      { id: '2', name: 'digital', slug: 'digital' },
    ],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_featured: true,
    reading_time_minutes: 5,
  },
  {
    id: '2',
    slug: 'seo-para-clinicas',
    title: 'SEO para Clinicas',
    excerpt: 'Aprenda como otimizar seu site para aparecer nas primeiras posicoes do Google.',
    content: '<p>Lorem ipsum dolor sit amet...</p>',
    featured_image: '',
    category: { id: '2', name: 'SEO', slug: 'seo' },
    author: { id: '1', name: 'Dr. Silva' },
    tags: [{ id: '3', name: 'seo', slug: 'seo' }],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_featured: true,
    reading_time_minutes: 8,
  },
  {
    id: '3',
    slug: 'redes-sociais-para-saude',
    title: 'Redes Sociais para Saude',
    excerpt: 'Como usar Instagram, Facebook e LinkedIn para conquistar mais pacientes.',
    content: '<p>Lorem ipsum dolor sit amet...</p>',
    featured_image: '',
    category: { id: '1', name: 'Marketing', slug: 'marketing' },
    author: { id: '2', name: 'Dra. Santos' },
    tags: [{ id: '4', name: 'redes sociais', slug: 'redes-sociais' }],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_featured: false,
    reading_time_minutes: 6,
  },
]

export async function getFeaturedPosts(limit = 2): Promise<Post[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:authors(*),
        tags:post_tags(tag:tags(*))
      `)
      .eq('is_featured', true)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error || !data) {
      console.warn('Using mock data for featured posts')
      return mockPosts.filter((p) => p.is_featured).slice(0, limit)
    }

    return data.map(transformPost)
  } catch {
    return mockPosts.filter((p) => p.is_featured).slice(0, limit)
  }
}

export async function getPostsByCategory(categoryId: string, limit?: number): Promise<Post[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:authors(*),
        tags:post_tags(tag:tags(*))
      `)
      .eq('category_id', categoryId)
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error || !data) {
      console.warn('Using mock data for category posts')
      const filtered = mockPosts.filter((p) => p.category.id === categoryId)
      return limit ? filtered.slice(0, limit) : filtered
    }

    return data.map(transformPost)
  } catch {
    const filtered = mockPosts.filter((p) => p.category.id === categoryId)
    return limit ? filtered.slice(0, limit) : filtered
  }
}

export async function getRecentPosts(limit = 6): Promise<Post[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:authors(*),
        tags:post_tags(tag:tags(*))
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error || !data) {
      console.warn('Using mock data for recent posts')
      return mockPosts.slice(0, limit)
    }

    return data.map(transformPost)
  } catch {
    return mockPosts.slice(0, limit)
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:authors(*),
        tags:post_tags(tag:tags(*))
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !data) {
      console.warn('Using mock data for post')
      return mockPosts.find((p) => p.slug === slug) || null
    }

    return transformPost(data)
  } catch {
    return mockPosts.find((p) => p.slug === slug) || null
  }
}

export async function getRelatedPosts(postId: string, categoryId: string, limit = 3): Promise<Post[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:authors(*),
        tags:post_tags(tag:tags(*))
      `)
      .eq('category_id', categoryId)
      .neq('id', postId)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error || !data) {
      console.warn('Using mock data for related posts')
      return mockPosts.filter((p) => p.id !== postId).slice(0, limit)
    }

    return data.map(transformPost)
  } catch {
    return mockPosts.filter((p) => p.id !== postId).slice(0, limit)
  }
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false })

    if (error || !data) {
      return []
    }

    return data
  } catch {
    return []
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:authors(*),
        tags:post_tags(tag:tags(*))
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error || !data) {
      console.warn('Using mock data for all posts')
      return mockPosts
    }

    return data.map(transformPost)
  } catch {
    return mockPosts
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const mockCategories: Category[] = [
    { id: '1', name: 'Marketing', slug: 'marketing', description: 'Estrategias de marketing digital para profissionais da saude' },
    { id: '2', name: 'SEO', slug: 'seo', description: 'Otimizacao para mecanismos de busca' },
  ]

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      console.warn('Using mock data for category')
      return mockCategories.find((c) => c.slug === slug) || null
    }

    return data
  } catch {
    return mockCategories.find((c) => c.slug === slug) || null
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error || !data) {
      return [
        { id: '1', name: 'Marketing', slug: 'marketing' },
        { id: '2', name: 'SEO', slug: 'seo' },
      ]
    }

    return data
  } catch {
    return [
      { id: '1', name: 'Marketing', slug: 'marketing' },
      { id: '2', name: 'SEO', slug: 'seo' },
    ]
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformPost(data: any): Post {
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt || '',
    content: data.content || '',
    featured_image: data.featured_image,
    category: data.category || { id: '', name: '', slug: '' },
    author: data.author || { id: '', name: '' },
    tags: data.tags?.map((t: { tag: { id: string; name: string; slug: string } }) => t.tag) || [],
    published_at: data.published_at,
    created_at: data.created_at,
    updated_at: data.updated_at,
    is_featured: data.is_featured || false,
    reading_time_minutes: data.reading_time_minutes || 5,
    meta_title: data.meta_title,
    meta_description: data.meta_description,
  }
}
