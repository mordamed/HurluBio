'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import OrderCard from '@/components/admin/OrderCard'
import { useAdmin } from '@/contexts/AdminContext'

export default function AdminOrders() {
  const { orders } = useAdmin()
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  // ✅ Statuts corrigés en minuscules
  const statusOptions = [
    { value: 'all', label: 'Toutes', count: orders.length },
    { value: 'pending', label: 'En attente', count: orders.filter(o => o.status === 'pending').length },
    { value: 'preparing', label: 'En préparation', count: orders.filter(o => o.status === 'preparing').length },
    { value: 'ready', label: 'Prêtes', count: orders.filter(o => o.status === 'ready').length },
    { value: 'delivering', label: 'En livraison', count: orders.filter(o => o.status === 'delivering').length },
    { value: 'delivered', label: 'Livrées', count: orders.filter(o => o.status === 'delivered').length },
    { value: 'cancelled', label: 'Annulées', count: orders.filter(o => o.status === 'cancelled').length },
  ]

  // ✅ Fonction locale pour filtrer
  const getFilteredOrders = () => {
    if (selectedStatus === 'all') return orders
    return orders.filter(order => order.status === selectedStatus)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des commandes</h1>
          <p className="text-gray-600">Suivez et gérez toutes les commandes</p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === status.value
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status.label} ({status.count})
              </button>
            ))}
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="space-y-4">
          {getFilteredOrders().length > 0 ? (
            getFilteredOrders().map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-gray-600">Aucune commande trouvée pour ce filtre</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
