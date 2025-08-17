'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import OrderCard from '@/components/admin/OrderCard'
import { useAdmin } from '@/contexts/AdminContext'

export default function AdminDeliveries() {
  const { getOrdersByStatus } = useAdmin()

  const readyOrders = getOrdersByStatus('ready')
  const deliveringOrders = getOrdersByStatus('delivering')
  const deliveredToday = getOrdersByStatus('delivered').filter(order => {
    const today = new Date().toDateString()
    return order.deliveryDate && new Date(order.deliveryDate).toDateString() === today
  })

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des livraisons
          </h1>
          <p className="text-gray-600">
            Organisez vos tournées de livraison
          </p>
        </div>

        {/* Stats livraisons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500 text-white text-2xl">
                📦
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Prêtes à livrer</p>
                <p className="text-2xl font-semibold text-gray-900">{readyOrders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-500 text-white text-2xl">
                🚛
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En livraison</p>
                <p className="text-2xl font-semibold text-gray-900">{deliveringOrders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500 text-white text-2xl">
                ✅
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Livrées aujourd'hui</p>
                <p className="text-2xl font-semibold text-gray-900">{deliveredToday.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Commandes prêtes */}
        {readyOrders.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📦 Commandes prêtes à livrer
            </h2>
            <div className="grid gap-4">
              {readyOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {/* Livraisons en cours */}
        {deliveringOrders.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🚛 Livraisons en cours
            </h2>
            <div className="grid gap-4">
              {deliveringOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {/* Si aucune livraison */}
        {readyOrders.length === 0 && deliveringOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">🚛</div>
            <p className="text-xl text-gray-600 mb-2">Aucune livraison en cours</p>
            <p className="text-gray-500">Toutes les commandes sont livrées ! 🎉</p>
          </div>
        )}

        {/* Livraisons du jour */}
        {deliveredToday.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ✅
        {/* Livraisons du jour */}
        {deliveredToday.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ✅ Livraisons réalisées aujourd'hui
            </h2>
            <div className="grid gap-4">
              {deliveredToday.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {/* Planificateur de tournées */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🗺️ Optimisation des tournées
          </h2>
          
          {readyOrders.length > 0 ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Voici les adresses à livrer par secteur :
              </p>
              
              {/* Regroupement par arrondissement */}
              <div className="grid gap-4">
                {Object.entries(
                  readyOrders.reduce((acc, order) => {
                    // Extraction de l'arrondissement depuis l'adresse
                    const match = order.customerAddress.match(/750(\d{2})/);
                    const arrondissement = match ? `${match[1]}ème` : 'Autre';
                    
                    if (!acc[arrondissement]) {
                      acc[arrondissement] = [];
                    }
                    acc[arrondissement].push(order);
                    return acc;
                  }, {} as Record<string, typeof readyOrders>)
                ).map(([arrondissement, orders]) => (
                  <div key={arrondissement} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">
                      📍 {arrondissement} arrondissement ({orders.length} commande{orders.length > 1 ? 's' : ''})
                    </h3>
                    <div className="space-y-2">
                      {orders.map(order => (
                        <div key={order.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-gray-600">{order.customerAddress}</p>
                            <p className="text-sm text-gray-500">{order.customerPhone}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{order.total.toFixed(2)}€</p>
                            <p className="text-sm text-gray-500">{order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Action pour la tournée */}
                    <div className="mt-3 flex gap-2">
                      <button 
                        onClick={() => {
                          orders.forEach(order => {
                            useAdmin().updateOrderStatus(order.id, 'delivering');
                          });
                        }}
                        className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors text-sm font-medium"
                      >
                        🚛 Commencer tournée ({orders.length})
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-medium">
                        🗺️ Voir sur la carte
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Conseils d'optimisation */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Conseils d'optimisation</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Commencez par les commandes les plus éloignées</li>
                  <li>• Regroupez les livraisons par secteur géographique</li>
                  <li>• Prévoyez les créneaux de livraison demandés</li>
                  <li>• Vérifiez les notes spéciales des clients</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-gray-600">Aucune commande prête pour la tournée</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
