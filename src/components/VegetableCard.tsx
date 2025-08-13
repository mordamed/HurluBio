'use client'

import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'

interface Vegetable {
  id: string
  name: string
  description: string | null
  price: number
  unit: string
  category: string
  season: string
  inStock: boolean
  producer: {
    id: string
    name: string
  }
}

interface VegetableCardProps {
  vegetable: Vegetable
}

export default function VegetableCard({ vegetable }: VegetableCardProps) {
const { addToCart } = useCart()  // ← Utilisez addToCart
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      'Légumes racines': '🥕',
      'Légumes verts': '🥬',
      'Légumes fruits': '🍅',
      'Courges': '🎃',
      'Herbes': '🌿',
      'Alliums': '🧅'
    }
    return emojis[category] || '🥬'
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    
addToCart({
  id: vegetable.id,
  name: vegetable.name,
  price: vegetable.price,
  unit: vegetable.unit,
  producerName: vegetable.producer.name  // Ajoutez cette ligne
})

    // Animation feedback
    setTimeout(() => {
      setIsAdding(false)
      setQuantity(1)
    }, 500)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
      {/* Header avec emoji et statut */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{getCategoryEmoji(vegetable.category)}</span>
          <div className="flex flex-col items-end">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              vegetable.inStock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {vegetable.inStock ? 'En stock' : 'Rupture'}
            </span>
          </div>
        </div>
        
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {vegetable.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2">
          {vegetable.producer.name}
        </p>
      </div>

      {/* Description */}
      <div className="px-4 pb-3">
        {vegetable.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {vegetable.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span className="bg-gray-100 px-2 py-1 rounded">
            {vegetable.category}
          </span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
            🗓️ {vegetable.season}
          </span>
        </div>
      </div>

      {/* Prix et actions */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-green-600">
            {vegetable.price.toFixed(2)}€
            <span className="text-sm font-normal text-gray-500">
              /{vegetable.unit}
            </span>
          </div>
        </div>

        {vegetable.inStock ? (
          <div className="flex items-center gap-2">
            {/* Sélecteur de quantité */}
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-50 transition-colors"
                disabled={quantity <= 1}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="px-3 py-2 min-w-[3rem] text-center font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>

            {/* Bouton ajouter au panier */}
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                isAdding
                  ? 'bg-green-100 text-green-700'
                  : 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
              }`}
            >
              {isAdding ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ajouté !
                </span>
              ) : (
                'Ajouter au panier'
              )}
            </button>
          </div>
        ) : (
          <button
            disabled
            className="w-full py-2.5 px-4 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed"
          >
            Non disponible
          </button>
        )}
      </div>
    </div>
  )
}
