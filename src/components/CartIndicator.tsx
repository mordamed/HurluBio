'use client'

import { useCart } from '@/contexts/CartContext'

export default function CartIndicator() {
  const { cart, getCartItemsCount } = useCart()

  // Protection contre les erreurs
  if (!cart) {
    return (
      <div className="flex items-center space-x-1">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3m0 0L2 1M7 13l-4-1.5M9 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
        <span>Panier</span>
      </div>
    )
  }

  const itemCount = getCartItemsCount()

  return (
    <div className="relative flex items-center space-x-1">
      {/* Icône du panier */}
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4-8L3 3H2M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6M7 13l-2.293-2.293c0 0 0 0 0 0A1 1 0 004 9V6a1 1 0 011-1h1m15 5a2 2 0 01-2 2H9"
        />
      </svg>
      
      <span className="hidden sm:inline">Panier</span>
      
      {/* Badge avec nombre d'articles - seulement si il y a des articles */}
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
          {itemCount}
        </span>
      )}
    </div>
  )
}
