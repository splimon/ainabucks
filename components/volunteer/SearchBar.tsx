import React from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSortClick: () => void;
}

const Search = ({ searchQuery, onSearchChange }: SearchProps) => {
  return (
    <div className="w-full">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        <Input
          type="text"
          placeholder="Search events by name, category, or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 pr-4 py-6 text-base bg-white border-2 border-gray-200 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-50 transition-all shadow-sm hover:shadow-md w-full"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
