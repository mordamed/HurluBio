import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import VegetableCard from '@/components/VegetableCard'
import FilterSidebar from '@/components/FilterSidebar'
import SearchAndSort from '@/components/SearchAndSort'

interface SearchParams {
  category?: string
  producer?: string
  season?: string
  search?: string
  sort?: string
}

interface VegetablesPageProps {
  searchParams: SearchParams
}

export default async function VegetablesPage({ searchParams }: VegetablesPageProps) {
  // Construire les filtres
  const where: any = {}
  
  if (searchParams.category) {
    where.category = searchParams.category
  }
  
  if (searchParams.producer) {
    where.producerId = searchParams.producer
  }
  
  if (searchParams.season) {
    where.season = {
      contains: searchParams.season
    }
  }
  
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } }
    ]
  }

  // Définir l'ordre de tri
  let orderBy: any = { createdAt: 'desc' }
  
  switch (searchParams.sort) {
    case 'price-asc':
      orderBy = { price: 'asc' }
      break
    case 'price-desc':
      orderBy = { price: 'desc' }
      break
    case 'name':
      orderBy = { name: 'asc' }
      break
    case 'producer':
      orderBy = { producer: { name: 'asc' } }
      break
  }

  // Récupérer les légumes avec filtres
  const [vegetables, producers, categories, seasons] = await Promise.all([
    prisma.vegetable.findMany({
      where,
      include: {
        producer: true
      },
      orderBy
    }),
    
    prisma.producer.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    
    prisma.vegetable.findMany({
      select: { category: true },
      distinct: ['category']
    }),
    
    prisma.vegetable.findMany({
      select: { season: true },
      distinct: ['season']
    })
  ])

  const uniqueCategories = categories.map(v => v.category).filter(Boolean)
  const uniqueSeasons = seasons.map(v => v.season).filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-green-600">
              🥕 HurluBio
            </Link>
            <nav className="flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-green-600">
                Accueil
              </Link>
              <Link href="/vegetables" className="text-green-600 font-medium">
                Légumes
              </Link>
              <Link href="/orders" className="text-gray-600 hover:text-green-600">
                Mes commandes
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Titre et compteur */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Catalogue des légumes bio
          </h1>
          <p className="text-gray-600">
            {vegetables.length} légume{vegetables.length > 1 ? 's' : ''} disponible{vegetables.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar des filtres */}
          <aside className="lg:w-64">
            <FilterSidebar 
              producers={producers}
              categories={uniqueCategories}
              seasons={uniqueSeasons}
              currentFilters={searchParams}
            />
          </aside>

          {/* Liste des légumes */}
          <main className="flex-1">
            {/* Barre de recherche et tri */}
            <div className="mb-6">
              <SearchAndSort 
                currentSearch={searchParams.search}
                currentSort={searchParams.sort}
              />
            </div>

            {/* Grille des légumes */}
            {vegetables.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vegetables.map((vegetable) => (
                  <VegetableCard key={vegetable.id} vegetable={vegetable} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Aucun légume trouvé
                </h3>
                <p className="text-gray-500">
                  Essayez d'ajuster vos filtres de recherche
                </p>
                <Link 
                  href="/vegetables"
                  className="inline-block mt-4 text-green-600 hover:text-green-800"
                >
                  Réinitialiser les filtres
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
