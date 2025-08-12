import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  // Récupérer quelques légumes pour l'aperçu
  const vegetables = await prisma.vegetable.findMany({
    take: 6,
    include: {
      producer: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-green-600">🥕 HurluBio</h1>
            <nav className="space-x-4">
              <Link href="/vegetables" className="text-green-600 hover:text-green-800">
                Légumes
              </Link>
              <Link href="/orders" className="text-green-600 hover:text-green-800">
                Commander
              </Link>
              <Link href="/admin" className="text-green-600 hover:text-green-800">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-400 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Légumes bio locaux livrés chez vous
          </h2>
          <p className="text-xl mb-8">
            Commandez directement auprès de nos producteurs locaux
          </p>
          <Link 
            href="/vegetables"
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Voir nos légumes
          </Link>
        </div>
      </section>

      {/* Légumes en vedette */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Légumes frais du jour</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vegetables.map((vegetable) => (
              <div key={vegetable.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                  <span className="text-4xl">🥕</span>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-2">{vegetable.name}</h4>
                  <p className="text-gray-600 mb-2">{vegetable.description}</p>
                  <p className="text-sm text-green-600 mb-2">
                    Par {vegetable.producer.name}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      {vegetable.price}€/{vegetable.unit}
                    </span>
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
