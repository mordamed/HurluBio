import { prisma } from '@/lib/prisma'

export default async function ProducersPage() {
  let producers: any[] = []

  try {
    producers = await prisma.producer.findMany()
  } catch (error) {
    console.error('Erreur lors du chargement des producteurs:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nos producteurs locaux
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les artisans passionnés qui cultivent et préparent vos produits préférés
          </p>
        </div>

        {producers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {producers.map((producer: any) => (
              <div key={producer.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border">
                {producer.image_url && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={producer.image_url}
                      alt={producer.name}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {producer.name}
                  </h2>
                  
                  {producer.description && (
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {producer.description}
                    </p>
                  )}

                  {producer.location && (
                    <div className="flex items-center text-gray-500 mb-4">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">{producer.location}</span>
                    </div>
                  )}

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-green-800">
                      🌱 Producteur local certifié
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Aucun producteur pour le moment
            </h2>
            <p className="text-gray-600">
              Nous travaillons à référencer de nouveaux producteurs locaux.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
