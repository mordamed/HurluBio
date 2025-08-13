import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    // Commandes par statut
    const statusQuery = `
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status
    `
    
    // Chiffre d'affaires du mois
    const revenueQuery = `
      SELECT SUM(total_amount) as monthly_revenue
      FROM orders 
      WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE)
      AND status = 'delivered'
    `
    
    // Commandes du jour
    const todayQuery = `
      SELECT COUNT(*) as today_orders
      FROM orders 
      WHERE DATE(order_date) = CURRENT_DATE
    `
    
    // Produits en stock faible
    const lowStockQuery = `
      SELECT COUNT(*) as low_stock_count
      FROM products 
      WHERE stock_quantity <= 5 AND stock_quantity > 0
    `
    
    const [statusResult, revenueResult, todayResult, lowStockResult] = await Promise.all([
      pool.query(statusQuery),
      pool.query(revenueQuery),
      pool.query(todayQuery),
      pool.query(lowStockQuery)
    ])
    
    return NextResponse.json({
      ordersByStatus: statusResult.rows.reduce((acc, row) => {
        acc[row.status] = parseInt(row.count)
        return acc
      }, {}),
      monthlyRevenue: parseFloat(revenueResult.rows[0]?.monthly_revenue || 0),
      todayOrders: parseInt(todayResult.rows[0]?.today_orders || 0),
      lowStockCount: parseInt(lowStockResult.rows[0]?.low_stock_count || 0)
    })
  } catch (error) {
    console.error('Erreur récupération stats:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
