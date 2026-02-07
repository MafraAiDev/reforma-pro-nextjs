'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'

function generateSessionId() {
  return 'rp_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
}

export default function CapturaPage() {
  const [form, setForm] = useState({
    nome: '',
    whatsapp: '',
    email: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const sessionIdRef = useRef(generateSessionId())
  const formRef = useRef(form)
  const savedDataRef = useRef('')
  const submittedRef = useRef(false)

  // Manter formRef sincronizado com state
  useEffect(() => {
    formRef.current = form
  }, [form])

  const savePartial = useCallback((formData: typeof form, leadStatus: string) => {
    const hasData = formData.nome || formData.email || formData.whatsapp
    if (!hasData || submittedRef.current) return

    const payload = {
      ...formData,
      session_id: sessionIdRef.current,
      status: leadStatus,
    }

    // sendBeacon para abandonado (página fechando) - mais confiável
    if (leadStatus === 'abandonado') {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
      navigator.sendBeacon('/api/captura', blob)
      return
    }

    // Não salvar se dados não mudaram
    const dataKey = JSON.stringify(formData)
    if (dataKey === savedDataRef.current) return
    savedDataRef.current = dataKey

    fetch('/api/captura', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {})
  }, [])

  // Salvar como abandonado ao fechar/esconder página
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !submittedRef.current) {
        savePartial(formRef.current, 'abandonado')
      }
    }

    const handleBeforeUnload = () => {
      if (!submittedRef.current) {
        savePartial(formRef.current, 'abandonado')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [savePartial])

  // Salvar parcial no blur de cada campo
  function handleBlur() {
    savePartial(form, 'parcial')
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('idle')
    setErrorMsg('')

    // Validar nome e sobrenome
    const parts = form.nome.trim().split(/\s+/)
    if (parts.length < 2) {
      setErrorMsg('Por favor, informe seu nome e sobrenome.')
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/captura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          session_id: sessionIdRef.current,
          status: 'completo',
        }),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error || 'Erro ao enviar')
      }

      submittedRef.current = true
      setStatus('success')
      setForm({ nome: '', whatsapp: '', email: '' })
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao enviar')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-6 lg:px-20 pt-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-white text-3xl font-bold tracking-tight">REFORMA</span>
          <div className="bg-[#FFD600] px-2 py-1">
            <span className="text-black text-2xl font-bold">PRO</span>
          </div>
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-white text-3xl lg:text-4xl font-bold leading-tight mb-4">
              Receba nosso{' '}
              <span className="text-[#FFD600]">conteudo exclusivo</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Preencha seus dados e tenha acesso a dicas, guias e novidades sobre reformas.
            </p>
          </div>

          {status === 'success' ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-white text-2xl font-bold mb-2">Cadastro realizado!</h2>
              <p className="text-gray-400 mb-6">
                Em breve voce recebera nosso conteudo exclusivo.
              </p>
              <Link
                href="/"
                className="inline-block bg-[#FFD600] text-black font-semibold px-8 py-3 hover:bg-yellow-400 transition-colors"
              >
                Voltar ao site
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nome e Sobrenome */}
              <div>
                <label htmlFor="nome" className="block text-gray-400 text-sm mb-1.5">
                  Nome e Sobrenome
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  value={form.nome}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Seu nome completo"
                  className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] transition-colors"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label htmlFor="whatsapp" className="block text-gray-400 text-sm mb-1.5">
                  WhatsApp
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  required
                  value={form.whatsapp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] transition-colors"
                />
              </div>

              {/* E-mail */}
              <div>
                <label htmlFor="email" className="block text-gray-400 text-sm mb-1.5">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="seu@email.com"
                  className="w-full bg-white/5 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] transition-colors"
                />
              </div>

              {/* Error */}
              {status === 'error' && (
                <p className="text-red-400 text-sm text-center">{errorMsg}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#FFD600] text-black font-semibold text-lg py-4 hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Enviando...' : 'QUERO RECEBER'}
              </button>

              <p className="text-gray-600 text-xs text-center">
                Seus dados estao seguros. Nao compartilhamos suas informacoes.
              </p>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-800">
        <div className="container mx-auto px-6 lg:px-20">
          <p className="text-gray-500 text-sm text-center">
            &copy; 2026 Reforma PRO. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
