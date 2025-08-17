'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import OrderCard from '@/components/admin/OrderCard'
import { useAdmin } from '@/contexts/AdminContext'
import { useState } from 'react'

export default function AdminOrders() {
  const { orders, getOrdersByStatus } = useAdmin()
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const statusOptions = [
    { value: 'all', label: 'Toutes les commandes', count: orders.length },
    { value: 'pending', label: 'En attente', count: getOrdersByStatus('pending').length },
    { value: 'preparing', label: 'Préparation', count: getOrdersByStatus('preparing').length },
    { value: 'ready', label: 'Prêtes', count: getOrdersByStatus('ready').length },
    { value: 'delivering', label: 'Livraison', count: getOrdersByStatus('delivering').length },
    { value: 'delivered', label: 'Livrées', count: getOrdersByStatus('delivered').length },
    { value: 'cancelled', label: 'Annulées', count: getOrdersByStatus('cancelled').length },
  ]

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : getOrdersByStatus(selectedStatus as any)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des commandes
          </h1>
          <p className="text-gray-600">
            Suivez et gérez toutes les commandes
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filtrer par statut</h2>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === option.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="grid gap-4">
          {filteredOrders.length > 0 ? (
            filteredOrders
              .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
              .map(order => (
                <OrderCard key={order.id} order={order} />
              ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-xl text-gray-600 mb-2">Aucune commande trouvée</p>
              <p className="text-gray-500">
                {selectedStatus === 'all' 
                  ? 'Aucune commande pour le moment'
                  : `Aucune commande avec le statut "${statusOptions.find(s => s.value === selectedStatus)?.label}"`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
