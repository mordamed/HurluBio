import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  // Récupérer quelques produits pour l'aperçu
  const products = await prisma.product.findMany({  // ← CORRIGÉ : product au lieu de vegetable
    take: 6,
    include: {
      producer: true
    }
  })

  return (
    <div className="min-h-screen bg-green-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            🌱 HurluBio
          </h1>
          <p className="text-xl mb-8">
            Des produits bio locaux, directement du producteur à votre assiette
          </p>
          <button className="bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors">
            Découvrir nos produits
          </button>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            🥕 Nos Produits Frais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                  <span className="text-6xl">🥬</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-3">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      {product.price}€/{product.unit}
                    </span>
                    <span className="text-sm text-gray-500">
                      Par {product.producer.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Aucun produit disponible pour le moment.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
