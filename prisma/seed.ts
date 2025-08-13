import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // Nettoyer les données existantes
  await prisma.product.deleteMany()    // ← Changé de vegetable à product
  await prisma.producer.deleteMany()

  console.log('🧹 Données existantes supprimées')

  // Créer les producteurs
  const producer1 = await prisma.producer.create({
    data: {
      name: 'Ferme des Collines Vertes',
      description: 'Exploitation familiale bio depuis 3 générations',
      location: 'Savoie',
      email: 'contact@collines-vertes.fr',
      phone: '04 79 12 34 56',
      certifications: JSON.stringify(['AB', 'Nature & Progrès'])
    }
  })

  // Créer des produits
  await prisma.product.createMany({
    data: [
      {
        name: 'Tomates cerises bio',
        description: 'Tomates cerises cultivées sans pesticides',
        price: 4.50,
        unit: 'kg',
        category: 'Légumes',
        producerId: producer1.id
      },
      {
        name: 'Salade verte bio',
        description: 'Salade fraîche du jour',
        price: 2.20,
        unit: 'pièce',
        category: 'Légumes',
        producerId: producer1.id
      }
    ]
  })

  console.log('✅ Seeding terminé !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
