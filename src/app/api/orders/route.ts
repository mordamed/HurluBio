import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function POST(request: NextRequest) {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    
    const { customerInfo, items, total } = await request.json()
    
    // Créer la commande
    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, total_amount, status, order_date)
       VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
       RETURNING id`,
      [customerInfo.name, customerInfo.email, customerInfo.phone, customerInfo.address, total]
    )
    
    const orderId = orderResult.rows[0].id
    
    // Ajouter les items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.id, item.quantity, item.price]
      )
      
      // Réduire le stock
      await client.query(
        `UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2`,
        [item.quantity, item.id]
      )
    }
    
    await client.query('COMMIT')
    
    return NextResponse.json({ success: true, orderId })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Erreur création commande:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  } finally {
    client.release()
  }
}
