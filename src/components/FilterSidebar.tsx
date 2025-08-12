'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface FilterSidebarProps {
  producers: { id: string; name: string }[]
  categories: string[]
  seasons: string[]
  currentFilters: {
    category?: string
    producer?: string
    season?: string
    search?: string
  }
}

export default function FilterSidebar({ 
  producers, 
  categories, 
  seasons, 
  currentFilters 
}: FilterSidebarProps) {
  const searchParams = useSearchParams()
  
  const buildFilterUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    return `/vegetables?${params.toString()}`
  }

  const clearAllFilters = () => {
    return '/vegetables'
  }

  const hasActiveFilters = Object.values(currentFilters).some(Boolean)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
        {hasActiveFilters && (
          <Link
            href={clearAllFilters()}
            className="text-sm text-green-600 hover:text-green-800"
          >
            Tout effacer
          </Link>
        )}
      </div>

      {/* Catégories */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Catégories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={buildFilterUrl('category', category)}
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                currentFilters.category === category
                  ? 'bg-green-100 text-green-800 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      {/* Producteurs */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Producteurs</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {producers.map((producer) => (
            <Link
              key={producer.id}
              href={buildFilterUrl('producer', producer.id)}
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                currentFilters.producer === producer.id
                  ? 'bg-green-100 text-green-800 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {producer.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Saisons */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Saisons</h3>
        <div className="space-y-2">
          {seasons.map((season) => (
            <Link
              key={season}
              href={buildFilterUrl('season', season)}
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                currentFilters.season === season
                  ? 'bg-green-100 text-green-800 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              🗓️ {season}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
