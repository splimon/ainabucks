import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search as SearchIcon } from 'lucide-react'

interface SearchProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onSortClick: () => void
}

const Search = ({ searchQuery, onSearchChange, onSortClick }: SearchProps) => {
  return (
    <div className="flex gap-4 mb-8 max-w-7xl mx-auto">
      <div className="flex-1 relative">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Browse Volunteer Events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 py-6 text-base bg-white border-gray-300 rounded-xl"
        />
      </div>
      <Button
        onClick={onSortClick}
        variant="outline"
        className="px-8 py-6 text-base font-medium border-gray-300 rounded-xl hover:bg-gray-50"
      >
        Sort By
      </Button>
    </div>
  )
}

export default Search