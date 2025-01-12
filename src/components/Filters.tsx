import React from 'react';
import { ChevronDown, SortAsc, Filter, Search, X } from 'lucide-react';

interface FiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export function Filters({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
}: FiltersProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSortLabel = (value: string) => {
    const labels: Record<string, string> = {
      'product_name': 'Product Name',
      'nutrition_grades': 'Nutrition Grade',
      'created_t': 'Date Added',
      'popularity_tags': 'Popularity'
    };
    return labels[value] || value;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Active Filters Display */}
        <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Active Filters</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                {selectedCategory}
                <button
                  onClick={() => onCategoryChange('')}
                  className="hover:text-indigo-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              {`Sort: ${getSortLabel(sortBy)} (${sortOrder === 'asc' ? '↑' : '↓'})`}
            </span>
          </div>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center gap-2 px-6 bg-indigo-600 hover:bg-indigo-700 
                   text-white rounded-xl shadow-lg transition-all duration-200 min-w-[160px]"
        >
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filter & Sort</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="relative">
          <div className="absolute inset-x-0 top-0 z-50 bg-white rounded-xl shadow-xl border border-gray-100
                       overflow-hidden animate-slideDown">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Categories Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Categories</h3>
                  {selectedCategory && (
                    <button
                      onClick={() => onCategoryChange('')}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  <div className="grid grid-cols-2 gap-2">
                    {filteredCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`px-3 py-2 rounded-lg text-sm text-left transition-all duration-200
                                 ${selectedCategory === category 
                                   ? 'bg-indigo-600 text-white shadow-md' 
                                   : 'hover:bg-indigo-50 text-gray-700'}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sorting Section */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Sort Products</h3>
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {Object.entries({
                      'product_name': 'Product Name',
                      'nutrition_grades': 'Nutrition Grade',
                      'created_t': 'Date Added',
                      'popularity_tags': 'Popularity'
                    }).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => onSortChange(value)}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm
                                 transition-all duration-200 ${
                                   sortBy === value
                                     ? 'bg-indigo-600 text-white shadow-md'
                                     : 'bg-gray-50 text-gray-700 hover:bg-indigo-50'
                                 }`}
                      >
                        <span>{label}</span>
                        {sortBy === value && (
                          <SortAsc 
                            className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''} 
                                     transition-transform duration-200`}
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 
                               bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <SortAsc 
                        className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''} 
                                 transition-transform duration-200`} 
                      />
                      <span className="text-sm font-medium">
                        {sortOrder === 'asc' ? 'Ascending Order' : 'Descending Order'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}