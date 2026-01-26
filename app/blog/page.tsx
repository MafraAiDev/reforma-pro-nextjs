import Link from 'next/link'
import { getRecentPosts, getCategories } from '@/lib/data'

export const metadata = {
  title: 'Blog | Reforma PRO',
  description: 'Dicas, tutoriais e conteúdo exclusivo sobre reformas de apartamentos',
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getRecentPosts(9),
    getCategories(),
  ])

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
            <nav>
              <Link href="/" className="text-white hover:text-[#FFD600] transition-colors">
                ← Voltar ao site
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#FFD600] py-16">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <h1 className="text-black text-4xl lg:text-6xl font-bold mb-4">
            Blog Reforma PRO
          </h1>
          <p className="text-black text-xl max-w-2xl mx-auto">
            Dicas, tutoriais e conteúdo exclusivo para você dominar a arte das reformas
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-black py-8 border-b border-gray-800">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/blog"
              className="px-4 py-2 bg-[#FFD600] text-black font-medium rounded-full hover:bg-yellow-400 transition-colors"
            >
              Todos
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/categoria/${category.slug}`}
                className="px-4 py-2 bg-gray-800 text-white font-medium rounded-full hover:bg-gray-700 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-20">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl mb-4">Nenhum post publicado ainda.</p>
              <p className="text-gray-500">Em breve teremos conteúdo incrível para você!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-gray-900 rounded-2xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300"
                >
                  <Link href={`/blog/${post.slug}`}>
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-[#FFD600] to-yellow-600 flex items-center justify-center">
                        <span className="text-black text-4xl font-bold">R</span>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-[#FFD600] text-black text-xs font-medium rounded-full">
                          {post.category.name}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {post.reading_time_minutes} min de leitura
                        </span>
                      </div>
                      <h2 className="text-white text-xl font-bold mb-2 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-400 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
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
