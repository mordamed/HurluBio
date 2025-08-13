'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
  producerName: string
  description: string
  image: string
  isAvailable: boolean
}

const demoProducts: Product[] = [
  {
    id: '1',
    name: 'Carottes',
    price: 3.50,
    stock: 25,
    category: 'Racines',
    producerName: 'Ferme Martin',
    description: 'Carottes bio fraîches du jour',
    image: '/images/carottes.jpg',
    isAvailable: true
  },
  {
    id: '2',
    name: 'Tomates',
    price: 4.20,
    stock: 8,
    category: 'Fruits',
    producerName: 'Bio Jardins',
    description: 'Tomates cerises bio',
    image: '/images/tomates.jpg',
    isAvailable: true
  },
  {
    id: '3',
    name: 'Courgettes',
    price: 2.80,
    stock: 0,
    category: 'Légumes',
    producerName: 'Potager Bio',
    description: 'Courgettes vertes bio',
    image: '/images/courgettes.jpg',
    isAvailable: false
  }
]

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(demoProducts)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]
  
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  const toggleAvailability = (productId: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, isAvailable: !product.isAvailable }
          : product
      )
    )
  }

  const updateStock = (productId: string, newStock: number) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, stock: Math.max(0, newStock) }
          : product
      )
    )
  }

  const lowStockProducts = products.filter(p => p.stock <= 5 && p.stock > 0)
  const outOfStockProducts = products.filter(p => p.stock === 0)

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des produits
          </h1>
          <p className="text-gray-600">
            Gérez votre catalogue et les stocks
          </p>
        </div>

        {/* Alertes stock */}
        {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
          <div className="space-y-4">
            {outOfStockProducts.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-red-800 font-medium mb-2">
                  ⚠️ Produits en rupture de stock ({outOfStockProducts.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {outOfStockProducts.map(product => (
                    <span key={product.id} className="bg-red-200 text-red-800 px-2 py-1 rounded text-sm">
                      {product.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {lowStockProducts.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-yellow-800 font-medium mb-2">
                  🔔 Stock faible ({lowStockProducts.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {lowStockProducts.map(product => (
                    <span key={product.id} className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-sm">
                      {product.name} ({product.stock} restants)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filtrer par catégorie</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Tous' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des produits */}
        <div className="grid gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                      🥬
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-gray-600">{product.description}</p>
                      <p className="text-sm text-gray-500">
                        Par {product.producerName}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Prix</p>
                      <p className="font-semibold text-green-600">
                        {product.price.toFixed(2)}€
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Stock</p>
                      <p className={`font-semibold ${
                        product.stock === 0 ? 'text-red-600' : 
                        product.stock <= 5 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {product.stock} unités
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Catégorie</p>
                      <p className="font-medium">{product.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Statut</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.isAvailable ? 'Disponible' : 'Indisponible'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  <button
                    onClick={() => toggleAvailability(product.id)}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      product.isAvailable
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {product.isAvailable ? '❌ Masquer' : '✅ Activer'}
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateStock(product.id, product.stock - 1)}
                      className="w-8 h-8 bg-red-100 text-red-600 rounded hover:bg-red-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={product.stock}
                      onChange={(e) => updateStock(product.id, parseInt(e.target.value) || 0)}
                      className="w-16 text-center border rounded px-2 py-1"
                      min="0"
                    />
                    <button
                      onClick={() => updateStock(product.id, product.stock + 1)}
                      className="w-8 h-8 bg-green-100 text-green-600 rounded hover:bg-green-200 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
