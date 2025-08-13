import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'

interface SearchParams {
  search?: string
  category?: string
  producer?: string
  minPrice?: string
  maxPrice?: string
}

interface Props {
  searchParams: SearchParams
}

export default async function ProductsPage({ searchParams }: Props) {  // ← Renommé VegetablesPage
  const { search, category, producer, minPrice, maxPrice } = searchParams

  // Construire les filtres
  const where: any = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }

  if (category) {
    where.category = category
  }

  if (producer) {
    where.producer = {
      name: { contains: producer, mode: 'insensitive' }
    }
  }

  if (minPrice) {
    where.price = { ...where.price, gte: parseFloat(minPrice) }
  }

  if (maxPrice) {
    where.price = { ...where.price, lte: parseFloat(maxPrice) }
  }

  // Récupérer les données
  const [productsData, producersData] = await Promise.all([  // ← Renommé vegetablesData
    prisma.product.findMany({  // ← Changé de vegetable à product
      where,
      include: {
        producer: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.producer.findMany({
      select: {
        name: true
      }
    })
  ])

  const categories = ['Légumes', 'Fruits', 'Herbes', 'Racines']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          🥕 Nos Produits Bio
        </h1>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Recherche */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <input
                type="text"
                name="search"
                placeholder="Nom du produit..."
                defaultValue={search}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                name="category"
                defaultValue={category}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Toutes</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Producteur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Producteur
              </label>
              <select
                name="producer"
                defaultValue={producer}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Tous</option>
                {producersData.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Prix min */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix min (€)
              </label>
              <input
                type="number"
                name="minPrice"
                step="0.1"
                defaultValue={minPrice}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Prix max */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix max (€)
              </label>
              <input
                type="number"
                name="maxPrice"
                step="0.1"
                defaultValue={maxPrice}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Bouton */}
            <div className="md:col-span-2 lg:col-span-5">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Filtrer
              </button>
            </div>
          </form>
        </div>

        {/* Grille des produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productsData.map((product) => (  // ← Changé de vegetablesData à productsData
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                <span className="text-6xl">🥬</span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold text-green-600">
                    {product.price}€/{product.unit}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Par {product.producer.name}
                </p>
                <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>

        {productsData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
