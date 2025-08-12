'use client'

import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'

export default function FloatingCartButton() {
  const { cart, getCartItemsCount, getTotalPrice } = useCart()
  
  const itemCount = getCartItemsCount()
  
  // Ne pas afficher si le panier est vide
  if (itemCount === 0) {
    return null
  }

  return (
    <Link href="/cart">
      <div className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105 z-50">
        <div className="flex items-center space-x-3 px-4 py-3">
          {/* Icône panier */}
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4-8L3 3H2M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6"
              />
            </svg>
            
            {/* Badge avec nombre d'articles */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {itemCount}
            </span>
          </div>
          
          {/* Prix total */}
          <div className="hidden sm:block">
            <div className="text-sm font-medium">
              {getTotalPrice().toFixed(2)}€
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
