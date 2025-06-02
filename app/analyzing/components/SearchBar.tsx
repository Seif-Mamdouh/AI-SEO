'use client'

import { Search } from 'lucide-react'
import { MedSpa } from './types'

interface SearchBarProps {
  selectedMedspa: MedSpa | null
}

export default function SearchBar({ selectedMedspa }: SearchBarProps) {
  return (
    <div className="absolute top-4 left-4 right-4 z-10">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <div className="flex items-center space-x-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={selectedMedspa?.name || ''}
            readOnly
            className="flex-1 text-sm text-gray-900 bg-transparent border-none outline-none"
            placeholder="Search location..."
          />
        </div>
      </div>
    </div>
  )
} 