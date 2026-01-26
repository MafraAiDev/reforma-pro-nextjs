import { createClient } from '@/lib/supabase/server'
import type { Post, Category } from '@/types'

// Mock data for development
const mockCategories: Category[] = [
  { id: '1', name: 'Reformas', slug: 'reformas', description: 'Dicas sobre reformas de apartamentos' },
  { id: '2', name: 'Materiais', slug: 'materiais', description: 'Como escolher os melhores materiais' },
  { id: '3', name: 'Planejamento', slug: 'planejamento', description: 'Organize sua reforma' },
]

const mockPosts: Post[] = [
  {
    id: '1',
    slug: 'como-planejar-reforma-apartamento',
    title: 'Como Planejar uma Reforma de Apartamento do Zero',
    excerpt: 'Descubra o passo a passo completo para planejar sua reforma sem dor de cabeça e dentro do orçamento.',
    content: '<p>Planejar uma reforma de apartamento pode parecer assustador, mas com as dicas certas você consegue fazer tudo de forma organizada...</p><h2>1. Defina seu orçamento</h2><p>O primeiro passo é saber quanto você pode gastar...</p>',
    featured_image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    category: mockCategories[2],
    author: { id: '1', name: 'Robson Cleyton' },
    tags: [
      { id: '1', name: 'planejamento', slug: 'planejamento' },
      { id: '2', name: 'orçamento', slug: 'orcamento' },
    ],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_featured: true,
    reading_time_minutes: 8,
  },
  {
    id: '2',
    slug: 'melhores-materiais-para-banheiro',
    title: 'Os Melhores Materiais para Reforma de Banheiro',
    excerpt: 'Aprenda a escolher revestimentos, metais e louças que combinam qualidade e bom preço.',
    content: '<p>A escolha dos materiais certos faz toda diferença no resultado final da sua reforma de banheiro...</p>',
    featured_image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
    category: mockCategories[1],
    author: { id: '1', name: 'Robson Cleyton' },
    tags: [
      { id: '3', name: 'banheiro', slug: 'banheiro' },
      { id: '4', name: 'materiais', slug: 'materiais' },
    ],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_featured: true,
    reading_time_minutes: 6,
  },
  {
    id: '3',
    slug: 'erros-comuns-em-reformas',
    title: '10 Erros Comuns em Reformas e Como Evitá-los',
    excerpt: 'Conheça os principais erros que as pessoas cometem ao reformar e saiba como não repetir.',
    content: '<p>Reformar um apartamento envolve muitas decisões e é normal cometer erros no caminho...</p>',
    featured_image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800',
    category: mockCategories[0],
    author: { id: '1', name: 'Robson Cleyton' },
    tags: [
      { id: '5', name: 'dicas', slug: 'dicas' },
      { id: '6', name: 'erros', slug: 'erros' },
    ],
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_featured: false,
    reading_time_minutes: 10,
  },
]

export async function getRecentPosts(limit = 9): Promise<Post[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:authors(*)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error || !data || data.length === 0) {
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
        author:authors(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !data) {
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
        author:authors(*)
      `)
      .eq('category_id', categoryId)
      .neq('id', postId)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error || !data || data.length === 0) {
      return mockPosts.filter((p) => p.id !== postId).slice(0, limit)
    }

    return data.map(transformPost)
  } catch {
    return mockPosts.filter((p) => p.id !== postId).slice(0, limit)
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error || !data || data.length === 0) {
      return mockCategories
    }

    return data
  } catch {
    return mockCategories
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
    author: data.author || { id: '', name: 'Autor' },
    tags: data.tags || [],
    published_at: data.published_at,
    created_at: data.created_at,
    updated_at: data.updated_at,
    is_featured: data.is_featured || false,
    reading_time_minutes: data.reading_time_minutes || 5,
    meta_title: data.meta_title,
    meta_description: data.meta_description,
  }
}
