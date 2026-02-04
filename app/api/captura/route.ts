import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, sobrenome, whatsapp, email } = body

    if (!nome || !email) {
      return NextResponse.json(
        { error: 'Nome e e-mail sao obrigatorios' },
        { status: 400 },
      )
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from('leads_captura').insert({
        nome: `${nome} ${sobrenome}`.trim(),
        email,
        whatsapp: whatsapp || null,
        status: 'completo',
        origem: 'reforma-pro',
      })

      if (error) {
        console.error('[Captura] Supabase error:', error.message)
      }
    } catch (err) {
      // Supabase not configured — log but don't fail
      console.warn('[Captura] Supabase not available, lead not saved:', err)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}
