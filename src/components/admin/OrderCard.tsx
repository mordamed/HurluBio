import { Order } from '@/contexts/AdminContext'
import { useAdmin } from '@/contexts/AdminContext'

interface OrderCardProps {
  order: Order
}

export default function OrderCard({ order }: OrderCardProps) {
  const { updateOrderStatus, deleteOrder } = useAdmin()

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-purple-100 text-purple-800',
    delivering: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }

  const statusLabels = {
    pending: 'En attente',
    preparing: 'Préparation',
    ready: 'Prêt',
    delivering: 'Livraison',
    delivered: 'Livré',
    cancelled: 'Annulé'
  }

  const nextStatus = {
    pending: 'preparing',
    preparing: 'ready',
    ready: 'delivering',
    delivering: 'delivered'
  } as const

  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Commande #{order.id}
          </h3>
          <p className="text-sm text-gray-600">
            {new Date(order.order_date).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
          {statusLabels[order.status]}
        </span>
      </div>

      {/* Infos client */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">👤 Client</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>{order.customer_name}</strong></p>
          <p>📧 {order.customer_email}</p>
          <p>📱 {order.customer_phone}</p>
          <p>📍 {order.customer_address}</p>
        </div>
      </div>

      {/* Articles */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">🛒 Articles</h4>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name} ({item.producerName})
              </span>
              <span className="font-medium">
                {(item.price * item.quantity).toFixed(2)}€
              </span>
            </div>
          ))}
        </div>
        <div className="border-t mt-2 pt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
<span>
  {order.items
    .reduce((sum, item) => sum + (item.quantity * item.price), 0)
    .toFixed(2)}€
</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>📝 Note :</strong> {order.notes}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {nextStatus[order.status as keyof typeof nextStatus] && (
          <button
            onClick={() => updateOrderStatus(order.id, nextStatus[order.status as keyof typeof nextStatus])}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors text-sm font-medium"
          >
            {order.status === 'pending' && '👨‍🍳 Commencer préparation'}
            {order.status === 'preparing' && '✅ Marquer prêt'}
            {order.status === 'ready' && '🚛 Commencer livraison'}
            {order.status === 'delivering' && '📦 Marquer livré'}
          </button>
        )}
        
        {order.status === 'pending' && (
          <button
            onClick={() => updateOrderStatus(order.id, 'cancelled')}
            className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium"
          >
            ❌ Annuler
          </button>
        )}
        
        <button
          onClick={() => deleteOrder(order.id)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
