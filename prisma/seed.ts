import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // Nettoyer les données existantes
  await prisma.vegetable.deleteMany()
  await prisma.producer.deleteMany()
  
  console.log('🧹 Données existantes supprimées')

  // Créer les producteurs
  const producers = await Promise.all([
    prisma.producer.create({
      data: {
        name: 'Ferme des Collines Vertes',
        description: 'Exploitation familiale bio depuis 3 générations',
        location: 'Savoie',
        email: 'contact@collines-vertes.fr',
        phone: '04 79 12 34 56',
        certifications: JSON.stringify(['AB', 'Nature & Progrès'])
      }
    }),
    
    prisma.producer.create({
      data: {
        name: 'Les Jardins de Marie',
        description: 'Maraîchage biologique en permaculture',
        location: 'Haute-Savoie',
        email: 'marie@jardins-marie.fr',
        phone: '04 50 87 65 43',
        certifications: JSON.stringify(['AB', 'Demeter'])
      }
    }),
    
    prisma.producer.create({
      data: {
        name: 'Potager du Mont-Blanc',
        description: 'Légumes de montagne cultivés naturellement',
        location: 'Chamonix',
        email: 'info@potager-montblanc.fr',
        phone: '04 50 12 98 76',
        certifications: JSON.stringify(['AB'])
      }
    }),
    
    prisma.producer.create({
      data: {
        name: 'Eco-Ferme du Lac',
        description: 'Agriculture raisonnée au bord du lac d\'Annecy',
        location: 'Annecy',
        email: 'contact@ecoferme-lac.fr',
        phone: '04 50 33 44 55',
        certifications: JSON.stringify(['AB', 'HVE'])
      }
    }),
    
    prisma.producer.create({
      data: {
        name: 'Les Serres Alpines',
        description: 'Production sous serre chauffée au bois local',
        location: 'Albertville',
        email: 'serres@alpines.fr',
        phone: '04 79 55 66 77',
        certifications: JSON.stringify(['AB'])
      }
    })
  ])

  console.log(`✅ ${producers.length} producteurs créés`)

  // Créer les légumes
  const vegetables = [
    // Légumes racines - Ferme des Collines Vertes
    {
      name: 'Carottes bio',
      description: 'Carottes croquantes et sucrées, parfaites en crudités ou cuites',
      price: 3.50,
      unit: 'kg',
      category: 'Légumes racines',
      season: 'Toute l\'année',
      producerId: producers[0].id,
      inStock: true
    },
    {
      name: 'Radis roses',
      description: 'Radis roses croquants et piquants',
      price: 2.80,
      unit: 'botte',
      category: 'Légumes racines',
      season: 'Printemps-Été',
      producerId: producers[0].id,
      inStock: true
    },
    {
      name: 'Navets',
      description: 'Navets tendres et sucrés',
      price: 3.20,
      unit: 'kg',
      category: 'Légumes racines',
      season: 'Automne-Hiver',
      producerId: producers[0].id,
      inStock: true
    },
    {
      name: 'Betteraves',
      description: 'Betteraves rouges sucrées',
      price: 3.80,
      unit: 'kg',
      category: 'Légumes racines',
      season: 'Automne-Hiver',
      producerId: producers[0].id,
      inStock: false // En rupture
    },

    // Légumes verts - Les Jardins de Marie
    {
      name: 'Salade verte',
      description: 'Mélange de jeunes pousses fraîches',
      price: 4.20,
      unit: 'barquette',
      category: 'Légumes verts',
      season: 'Toute l\'année',
      producerId: producers[1].id,
      inStock: true
    },
    {
      name: 'Épinards',
      description: 'Jeunes épinards tendres',
      price: 5.50,
      unit: 'kg',
      category: 'Légumes verts',
      season: 'Automne-Printemps',
      producerId: producers[1].id,
      inStock: true
    },
    {
      name: 'Blettes',
      description: 'Blettes colorées aux tiges croquantes',
      price: 4.80,
      unit: 'kg',
      category: 'Légumes verts',
      season: 'Été-Automne',
      producerId: producers[1].id,
      inStock: true
    },
    {
      name: 'Roquette',
      description: 'Roquette sauvage au goût piquant',
      price: 8.50,
      unit: 'barquette',
      category: 'Légumes verts',
      season: 'Printemps-Automne',
      producerId: producers[1].id,
      inStock: true
    },

    // Légumes fruits - Potager du Mont-Blanc
    {
      name: 'Tomates cerises',
      description: 'Petites tomates sucrées et parfumées',
      price: 6.80,
      unit: 'barquette',
      category: 'Légumes fruits',
      season: 'Été',
      producerId: producers[2].id,
      inStock: true
    },
    {
      name: 'Courgettes',
      description: 'Courgettes vertes tendres',
      price: 3.90,
      unit: 'kg',
      category: 'Légumes fruits',
      season: 'Été',
      producerId: producers[2].id,
      inStock: true
    },
    {
      name: 'Aubergines',
      description: 'Aubergines violettes brillantes',
      price: 5.20,
      unit: 'kg',
      category: 'Légumes fruits',
      season: 'Été',
      producerId: producers[2].id,
      inStock: false // Hors saison
    },
    {
      name: 'Concombres',
      description: 'Concombres croquants et rafraîchissants',
      price: 4.50,
      unit: 'kg',
      category: 'Légumes fruits',
      season: 'Été',
      producerId: producers[2].id,
      inStock: true
    }
  ]

  // Insérer tous les légumes
  for (const vegetable of vegetables) {
    await prisma.vegetable.create({
      data: vegetable
    })
  }

  console.log(`✅ ${vegetables.length} légumes créés`)
  console.log('🎉 Seeding terminé avec succès !')
  
  // Afficher un résumé
  const totalVegetables = await prisma.vegetable.count()
  const totalProducers = await prisma.producer.count()
  const inStockCount = await prisma.vegetable.count({ where: { inStock: true } })
  
  console.log(`📊 Résumé :`)
  console.log(`   - ${totalProducers} producteurs`)
  console.log(`   - ${totalVegetables} légumes`)
  console.log(`   - ${inStockCount} en stock`)
  console.log(`   - ${totalVegetables - inStockCount} en rupture`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
