'use client'

import { useState, useEffect } from 'react'
import { 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Package
} from 'lucide-react'

interface Order {
  id: string
  customer_name: string
  total_amount: number
  status: string
  order_date: string
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 📊 Charger les commandes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/admin/orders')
        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders || [])
        } else {
          // Si l'API n'existe pas encore, utiliser des données de test
          setOrders([
            {
              id: '1',
              customer_name: 'Marie Dubois',
              total_amount: 45.50,
              status: 'pending',
              order_date: new Date().toISOString()
            },
            {
              id: '2',
              customer_name: 'Pierre Martin',
              total_amount: 32.00,
              status: 'delivered',
              order_date: new Date().toISOString()
            }
          ])
        }
      } catch (err) {
        console.log('API pas encore disponible, utilisation données test')
        setOrders([
          {
            id: '1',
            customer_name: 'Marie Dubois',
            total_amount: 45.50,
            status: 'pending',
            order_date: new Date().toISOString()
          },
          {
            id: '2',
            customer_name: 'Pierre Martin',
            total_amount: 32.00,
            status: 'delivered',
            order_date: new Date().toISOString()
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // 📈 Calculs simples
  const todaysOrders = orders.filter(order => {
    const today = new Date().toDateString()
    const orderDate = new Date(order.order_date).toDateString()
    return today === orderDate
  })

  const pendingOrders = orders.filter(order => order.status === 'pending')
  const deliveredOrders = orders.filter(order => order.status === 'delivered')
  const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.total_amount, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tableau de bord Admin
              </h1>
              <p className="mt-1 text-gray-600">
                Gestion de la ferme collaborative
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Commandes du jour */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Commandes aujourd'hui
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {todaysOrders.length}
                </p>
              </div>
            </div>
          </div>

          {/* Revenus */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Revenus totaux
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalRevenue.toFixed(2)}€
                </p>
              </div>
            </div>
          </div>

          {/* Commandes en attente */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  En attente
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingOrders.length}
                </p>
              </div>
            </div>
          </div>

          {/* Commandes livrées */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Livrées
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {deliveredOrders.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium">Voir les commandes</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium">Gérer les stocks</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
                  <span className="font-medium">Stocks faibles</span>
                </div>
              </button>
            </div>
          </div>

          {/* Activité récente */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Commandes récentes</h3>
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.order_date).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{order.total_amount.toFixed(2)}€</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
