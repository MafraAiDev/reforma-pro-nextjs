import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, whatsapp, email, session_id, status = 'completo' } = body

    if (status === 'completo') {
      if (!nome || !email) {
        return NextResponse.json(
          { error: 'Nome e e-mail sao obrigatorios' },
          { status: 400 },
        )
      }
    } else {
      // Parcial/abandonado: precisa de pelo menos um campo
      if (!nome && !email && !whatsapp) {
        return NextResponse.json(
          { error: 'Pelo menos um campo é obrigatório' },
          { status: 400 },
        )
      }
    }

    const sid = session_id || 'rp_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)

    const result = await pool.query(
      `INSERT INTO leads_captura (nome, email, whatsapp, session_id, status, source, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'reforma-pro', NOW())
       ON CONFLICT (session_id)
       DO UPDATE SET
         nome = COALESCE(NULLIF($1, ''), leads_captura.nome),
         email = COALESCE(NULLIF($2, ''), leads_captura.email),
         whatsapp = COALESCE(NULLIF($3, ''), leads_captura.whatsapp),
         status = $5,
         updated_at = NOW()
       RETURNING *`,
      [(nome || '').trim(), email || '', whatsapp || '', sid, status]
    )

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error: any) {
    console.error('[Captura] Error:', error.message)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}
