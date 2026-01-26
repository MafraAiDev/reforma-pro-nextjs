import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getRelatedPosts } from '@/lib/data'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return { title: 'Post não encontrado' }
  }

  return {
    title: `${post.title} | Blog Reforma PRO`,
    description: post.excerpt || post.meta_description,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category.id, 3)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-6 lg:px-20 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-white text-3xl font-bold">REFORMA</span>
              <div className="bg-[#FFD600] px-2 py-1">
                <span className="text-black text-2xl font-bold">PRO</span>
              </div>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/blog" className="text-white hover:text-[#FFD600] transition-colors">
                ← Blog
              </Link>
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                Site
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="py-12">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="max-w-4xl mx-auto">
            {/* Category & Meta */}
            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-2 bg-[#FFD600] text-black text-sm font-medium rounded-full">
                {post.category.name}
              </span>
              <span className="text-gray-500">
                {post.reading_time_minutes} min de leitura
              </span>
              <span className="text-gray-500">
                {new Date(post.published_at).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-white text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-gray-300 text-xl mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Author */}
            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-gray-800">
              <div className="w-12 h-12 bg-[#FFD600] rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">
                  {post.author.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{post.author.name}</p>
                <p className="text-gray-500 text-sm">Autor</p>
              </div>
            </div>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-12 rounded-2xl overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg prose-invert max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-[#FFD600] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-ul:text-gray-300 prose-ol:text-gray-300
                prose-li:marker:text-[#FFD600]
                prose-blockquote:border-[#FFD600] prose-blockquote:text-gray-400
                prose-code:text-[#FFD600] prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-800">
                <h3 className="text-white font-bold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-900/50">
          <div className="container mx-auto px-6 lg:px-20">
            <h2 className="text-white text-3xl font-bold mb-8 text-center">
              Posts Relacionados
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.id}
                  className="bg-gray-900 rounded-2xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300"
                >
                  <Link href={`/blog/${relatedPost.slug}`}>
                    {relatedPost.featured_image ? (
                      <img
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-[#FFD600] to-yellow-600 flex items-center justify-center">
                        <span className="text-black text-3xl font-bold">R</span>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-white text-lg font-bold line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-[#FFD600]">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <h2 className="text-black text-3xl font-bold mb-4">
            Quer dominar as reformas?
          </h2>
          <p className="text-black text-lg mb-8">
            Adquira o ebook Reforma PRO e transforme seus projetos
          </p>
          <Link
            href="/"
            className="inline-block bg-black text-[#FFD600] font-semibold text-lg px-12 py-4 hover:bg-gray-900 transition-colors"
          >
            Conhecer o Reforma PRO
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 border-t border-gray-800">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <p className="text-gray-400">
            © 2026 Reforma PRO. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
