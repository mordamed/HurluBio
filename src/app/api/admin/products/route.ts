import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// GET - Récupérer tous les produits avec info producteur
export async function GET() {
  try {
    const query = `
      SELECT 
        p.*,
        pr.name as producer_name
      FROM products p
      LEFT JOIN producers pr ON p.producer_id = pr.id
      ORDER BY p.name
    `
    
    const result = await pool.query(query)
    
    return NextResponse.json({ products: result.rows })
  } catch (error) {
    console.error('Erreur récupération produits:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
