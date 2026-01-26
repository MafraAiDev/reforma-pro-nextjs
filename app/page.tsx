import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://api.builder.io/api/v1/image/assets/TEMP/cdca8505c0dfcd4d972c1858343e05a1750eff86?width=3840')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative container mx-auto px-6 lg:px-20 pt-12 lg:pt-16">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-16 lg:mb-24">
            <h1 className="text-white text-5xl lg:text-7xl font-bold tracking-tight">
              REFORMA
            </h1>
            <div className="bg-[#FFD600] px-3 py-2">
              <span className="text-black text-5xl lg:text-6xl font-bold">
                PRO
              </span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="max-w-xl lg:max-w-2xl pb-20">
            <h2 className="text-white text-3xl lg:text-[42px] font-normal leading-tight mb-8">
              Garanta o{" "}
              <span className="text-[#FFD600] font-bold">
                sucesso das suas reformas
              </span>{" "}
              com o Reforma Pro ou Receba Seu Dinheiro de Volta!
            </h2>

            <p className="text-white text-xl lg:text-[33px] font-normal leading-snug mb-12">
              Domine a Arte das Reformas de Apartamentos com Nosso Guia
              Exclusivo e Eleve Seus Projetos a um Novo Patamar
            </p>

            <button className="bg-[#FFD600] text-black font-semibold text-lg lg:text-xl px-16 py-5 hover:bg-yellow-400 transition-colors w-full lg:w-auto">
              QUERO COMPRAR AGORA
            </button>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#FFD600] rounded-full opacity-50 blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-[#FFD600] rounded-full opacity-30 blur-2xl"></div>
      </section>

      {/* Logo Divider */}
      <div className="bg-[#FFD600] py-6 overflow-hidden">
        <div className="flex gap-8 whitespace-nowrap animate-pulse">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <span className="text-black text-2xl font-bold">REFORMA</span>
              <div className="bg-black px-2 py-1">
                <span className="text-[#FFD600] text-2xl font-bold">PRO</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Section */}
      <section className="bg-black py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-[#FFD600] rounded-3xl overflow-hidden aspect-video">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/da8cc737e07268ba2fcb62ed9358a4c9c0f21e14?width=3840"
                alt="Video thumbnail"
                className="w-full h-full object-cover mix-blend-luminosity opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-2"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="bg-[#FFD600] py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-black text-4xl lg:text-7xl font-bold leading-tight mb-12">
              O que você aprenderá no
            </h2>

            <div className="flex items-center gap-2 mb-16">
              <span className="text-black text-5xl lg:text-7xl font-bold">
                REFORMA
              </span>
              <div className="bg-black px-4 py-2">
                <span className="text-[#FFD600] text-5xl lg:text-6xl font-bold">
                  PRO
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {[
                { num: "01", text: "Como resolver os problemas mais comuns que podem surgir durante a reforma de apartamento." },
                { num: "02", text: "Estratégias eficazes para lidar com desafios específicos encontrados durante o processo de reforma." },
                { num: "03", text: "Métodos para planejar e organizar uma reforma de apartamento de forma eficiente e econômica." },
                { num: "04", text: "Técnicas para escolher os materiais certos e garantir a qualidade do trabalho realizado." },
                { num: "05", text: "Como coordenar e gerenciar equipes de trabalho para garantir o progresso suave da reforma." },
              ].map((item, index) => (
                <div key={index} className="flex gap-6">
                  <span className="text-black text-4xl font-bold flex-shrink-0">
                    {item.num}
                  </span>
                  <p className="text-black text-xl lg:text-[29px] font-light leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-black py-16 lg:py-24 relative">
        <div className="container mx-auto px-6 lg:px-20 relative">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-white text-center text-2xl lg:text-[33px] font-normal leading-tight mb-12">
              Não perca esta{" "}
              <span className="text-[#FFD600] font-bold">oportunidade</span>{" "}
              única de aprender tudo sobre reforma de apartamentos.
            </h2>

            <div className="bg-black/30 backdrop-blur-sm border border-[#FFD600] rounded-3xl p-8 lg:p-12">
              {/* Logo */}
              <div className="flex items-center justify-center gap-2 mb-12">
                <span className="text-white text-5xl lg:text-7xl font-bold">
                  REFORMA
                </span>
                <div className="bg-[#FFD600] px-3 py-2">
                  <span className="text-black text-5xl lg:text-6xl font-bold">
                    PRO
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <p className="text-white text-3xl mb-2">
                  12X{" "}
                  <span className="text-[#FFD600] text-6xl lg:text-8xl font-semibold">
                    R$5,92
                  </span>
                </p>
                <p className="text-white text-xl lg:text-2xl">
                  Ou <span className="font-semibold">R$59,00</span> à vista
                </p>
              </div>

              <div className="w-full h-px bg-white mb-8"></div>

              {/* CTA Button */}
              <button className="w-full bg-green-500 text-black font-semibold text-xl lg:text-2xl py-6 hover:bg-green-400 transition-colors shadow-lg shadow-green-500/50 flex items-center justify-center gap-3">
                Quero me inscrever
                <svg className="w-7 h-7" viewBox="0 0 31 31" fill="none">
                  <path
                    d="M8.20916 23.1436L6.41333 21.3436L18.7276 9.00106H7.69607V6.42969H23.0889V21.8579H20.5235V10.801L8.20916 23.1436Z"
                    fill="black"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 border-t border-gray-800">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 Reforma PRO. Todos os direitos reservados.
            </p>
            <a 
              href="/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 text-sm hover:text-gray-400 transition-colors"
            >
              Blog
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
// force rebuild Mon Jan 26 22:09:09 UTC 2026
