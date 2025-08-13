'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { useAdmin } from '@/contexts/AdminContext'

export default function AdminDeliveries() {
  const { orders, updateOrderStatus } = useAdmin()

  const readyOrders = orders.filter(order => order.status === 'ready')
  const deliveringOrders = orders.filter(order => order.status === 'delivering')

  const handleStartDelivery = (orderId: string) => {
    updateOrderStatus(orderId, 'delivering')
  }

  const handleCompleteDelivery = (orderId: string) => {
    updateOrderStatus(orderId, 'delivered')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des livraisons</h1>
          <p className="text-gray-600">Organisez et suivez les livraisons</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Commandes prêtes */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b bg-blue-50">
              <h2 className="text-lg font-semibold text-blue-800">
                Prêtes pour livraison ({readyOrders.length})
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {readyOrders.length > 0 ? (
                readyOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">Commande #{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer_name}</p>
                        <p className="text-sm text-gray-600">{order.customer_phone}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {order.total_amount}€
                      </span>
                    </div>

                    <button
                      onClick={() => handleStartDelivery(order.id)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                    >
                      🚚 Commencer la livraison
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📦</div>
                  <p>Aucune commande prête</p>
                </div>
              )}
            </div>
          </div>

          {/* Commandes en livraison */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b bg-orange-50">
              <h2 className="text-lg font-semibold text-orange-800">
                En cours de livraison ({deliveringOrders.length})
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {deliveringOrders.length > 0 ? (
                deliveringOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">Commande #{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer_name}</p>
                        <p className="text-sm text-gray-600">{order.customer_phone}</p>
                      </div>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                        {order.total_amount}€
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center space-x-2 text-sm text-orange-600">
                        <span className="animate-pulse">🚚</span>
                        <span>En cours de livraison...</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCompleteDelivery(order.id)}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                    >
                      ✅ Marquer comme livrée
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🚚</div>
                  <p>Aucune livraison en cours</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
