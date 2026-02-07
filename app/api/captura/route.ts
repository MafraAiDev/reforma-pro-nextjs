import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, whatsapp, email } = body

    if (!nome || !email) {
      return NextResponse.json(
        { error: 'Nome e e-mail sao obrigatorios' },
        { status: 400 },
      )
    }

    const sessionId = 'rp_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)

    const result = await pool.query(
      `INSERT INTO leads_captura (nome, email, whatsapp, session_id, status, source, updated_at)
       VALUES ($1, $2, $3, $4, 'completo', 'reforma-pro', NOW())
       RETURNING *`,
      [nome.trim(), email, whatsapp || '', sessionId]
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
