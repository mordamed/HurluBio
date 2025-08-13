'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    producerName: string
  }>
  total_amount: number
  status: 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled'
  order_date: string
  delivery_date?: string
  notes?: string
}

export interface AdminProduct {
  id: string
  name: string
  price: number
  stock_quantity: number
  category: string
  producer_name: string
  description: string
  image_url: string
  is_available: boolean
}

interface AdminStats {
  ordersByStatus: Record<string, number>
  monthlyRevenue: number
  todayOrders: number
  lowStockCount: number
}

interface AdminContextType {
  orders: Order[]
  products: AdminProduct[]
  stats: AdminStats
  loading: boolean
  updateOrderStatus: (orderId: string, status: Order['status'], deliveryDate?: string) => Promise<void>
  deleteOrder: (orderId: string) => Promise<void>
  updateProductStock: (productId: string, stockQuantity: number) => Promise<void>
  toggleProductAvailability: (productId: string) => Promise<void>
  refreshData: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [stats, setStats] = useState<AdminStats>({
    ordersByStatus: {},
    monthlyRevenue: 0,
    todayOrders: 0,
    lowStockCount: 0
  })
  const [loading, setLoading] = useState(true)

  // Charger les données
  const refreshData = async () => {
    try {
      setLoading(true)
      
      const [ordersRes, productsRes, statsRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/products'),
        fetch('/api/admin/stats')
      ])
      
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData.orders)
      }
      
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData.products)
      }
      
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Erreur chargement données admin:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = async (orderId: string, status: Order['status'], deliveryDate?: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status, 
          deliveryDate: status === 'delivered' ? new Date().toISOString() : deliveryDate 
        })
      })
      
      if (res.ok) {
        await refreshData() // Recharger les données
      }
    } catch (error) {
      console.error('Erreur mise à jour commande:', error)
    }
  }

  // Supprimer une commande
  const deleteOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        setOrders(prev => prev.filter(order => order.id !== orderId))
      }
    } catch (error) {
      console.error('Erreur suppression commande:', error)
    }
  }

  // Mettre à jour le stock d'un produit
  const updateProductStock = async (productId: string, stockQuantity: number) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_quantity: stockQuantity })
      })
      
      if (res.ok) {
        setProducts(prev => 
          prev.map(product => 
            product.id === productId 
              ? { ...product, stock_quantity: stockQuantity }
              : product
          )
        )
      }
    } catch (error) {
      console.error('Erreur mise à jour stock:', error)
    }
  }

  // Activer/désactiver un produit
  const toggleProductAvailability = async (productId: string) => {
    try {
      const product = products.find(p => p.id === productId)
      if (!product) return
      
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_available: !product.is_available })
      })
      
      if (res.ok) {
        setProducts(prev => 
          prev.map(p => 
            p.id === productId 
              ? { ...p, is_available: !p.is_available }
              : p
          )
        )
      }
    } catch (error) {
      console.error('Erreur mise à jour disponibilité:', error)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  // Recharger les stats toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <AdminContext.Provider value={{
      orders,
      products,
      stats,
      loading,
      updateOrderStatus,
      deleteOrder,
      updateProductStock,
      toggleProductAvailability,
      refreshData
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
