'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface SearchAndSortProps {
  currentSearch?: string
  currentSort?: string
}

export default function SearchAndSort({ currentSearch, currentSort }: SearchAndSortProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(currentSearch || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchValue.trim()) {
      params.set('search', searchValue.trim())
    } else {
      params.delete('search')
    }
    
    router.push(`/vegetables?${params.toString()}`)
  }

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (sortValue) {
      params.set('sort', sortValue)
    } else {
      params.delete('sort')
    }
    
    router.push(`/vegetables?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Barre de recherche */}
      <div className="flex-1">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Rechercher des légumes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Sélecteur de tri */}
      <div className="sm:w-48">
        <select
          value={currentSort || ''}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
        >
          <option value="">Trier par...</option>
          <option value="name">Nom A-Z</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="producer">Producteur</option>
        </select>
      </div>
    </div>
  )
}
