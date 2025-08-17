import { prisma } from '@/lib/prisma'

export default async function ProducersPage() {
  let producers = []
  
  try {
    producers = await prisma.producer.findMany({
      include: {
        vegetables: {
          where: { available: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })
  } catch (error) {
    console.log('Database not ready:', error)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-green-600">
        Nos Producteurs 👨‍🌾
      </h1>
      
      {producers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">
            Aucun producteur enregistré pour le moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {producers.map((producer) => (
            <div key={producer.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{producer.name}</h3>
              <p className="text-gray-600 mb-4">{producer.description}</p>
              <div className="mb-4">
                <p className="text-sm text-gray-500">📍 {producer.location}</p>
                <p className="text-sm text-gray-500">📧 {producer.email}</p>
                {producer.phone && (
                  <p className="text-sm text-gray-500">📞 {producer.phone}</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Légumes disponibles ({producer.vegetables.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {producer.vegetables.map((vegetable) => (
                    <span 
                      key={vegetable.id}
                      className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                    >
                      {vegetable.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
