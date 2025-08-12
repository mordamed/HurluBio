'use client'

import { useCart } from '@/contexts/CartContext'
import Image from 'next/image'

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, getCartItemsCount } = useCart()

  // Affichage de chargement si le panier n'est pas encore prêt
  if (!cart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mon panier</h1>
        <div className="text-center py-8">
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  // Si le panier est vide
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mon panier</h1>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-xl text-gray-600 mb-4">Votre panier est vide</p>
          <a
            href="/"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Continuer mes achats
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Mon panier ({getCartItemsCount()} articles)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
              {/* Image du produit */}
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-3xl">🥬</span>
              </div>

              {/* Informations du produit */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-600">{item.producerName}</p>
                <p className="text-green-600 font-medium">
                  {item.price.toFixed(2)}€ / {item.unit}
                </p>
              </div>

              {/* Contrôles quantité */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                
                <span className="font-medium w-8 text-center">{item.quantity}</span>
                
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
                >
                  +
                </button>
              </div>

              {/* Prix total pour cet article */}
              <div className="text-right">
                <p className="font-semibold text-lg">
                  {(item.price * item.quantity).toFixed(2)}€
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm mt-1"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé de la commande */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Résumé</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Articles ({getCartItemsCount()})</span>
                <span>{getTotalPrice().toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="text-green-600">Gratuite</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{getTotalPrice().toFixed(2)}€</span>
              </div>
            </div>

            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
              Commander
            </button>

            <a
              href="/"
              className="block text-center text-green-600 hover:text-green-700 mt-4"
            >
              Continuer mes achats
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
