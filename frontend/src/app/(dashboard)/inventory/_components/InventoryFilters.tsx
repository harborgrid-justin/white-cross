/**
 * @fileoverview Inventory Filters Component - Advanced filtering for inventory management
 * @module app/(dashboard)/inventory/_components/InventoryFilters
 * @category Inventory - Components
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Search,
  Filter,
  X,
  Calendar,
  Package,
  MapPin,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface InventoryFiltersProps {
  totalItems?: number;
  activeFilters?: number;
}

interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

const CATEGORY_OPTIONS: FilterOption[] = [
  { id: 'medications', label: 'Medications', value: 'MEDICATIONS', count: 234 },
  { id: 'medical_supplies', label: 'Medical Supplies', value: 'MEDICAL_SUPPLIES', count: 456 },
  { id: 'equipment', label: 'Equipment', value: 'EQUIPMENT', count: 123 },
  { id: 'consumables', label: 'Consumables', value: 'CONSUMABLES', count: 434 }
];

const STATUS_OPTIONS: FilterOption[] = [
  { id: 'in_stock', label: 'In Stock', value: 'IN_STOCK', count: 1089 },
  { id: 'low_stock', label: 'Low Stock', value: 'LOW_STOCK', count: 23 },
  { id: 'out_of_stock', label: 'Out of Stock', value: 'OUT_OF_STOCK', count: 5 },
  { id: 'expired', label: 'Expired', value: 'EXPIRED', count: 3 },
  { id: 'expiring_soon', label: 'Expiring Soon', value: 'EXPIRING_SOON', count: 12 }
];

const LOCATION_OPTIONS: FilterOption[] = [
  { id: 'main_office', label: 'Main Office', value: 'MAIN_OFFICE', count: 678 },
  { id: 'nurse_station_a', label: 'Nurse Station A', value: 'NURSE_STATION_A', count: 234 },
  { id: 'nurse_station_b', label: 'Nurse Station B', value: 'NURSE_STATION_B', count: 189 },
  { id: 'storage_room', label: 'Storage Room', value: 'STORAGE_ROOM', count: 146 }
];

const SORT_OPTIONS: FilterOption[] = [
  { id: 'name_asc', label: 'Name (A-Z)', value: 'name:asc' },
  { id: 'name_desc', label: 'Name (Z-A)', value: 'name:desc' },
  { id: 'quantity_asc', label: 'Quantity (Low to High)', value: 'quantity:asc' },
  { id: 'quantity_desc', label: 'Quantity (High to Low)', value: 'quantity:desc' },
  { id: 'expiry_asc', label: 'Expiry Date (Earliest)', value: 'expiry_date:asc' },
  { id: 'expiry_desc', label: 'Expiry Date (Latest)', value: 'expiry_date:desc' },
  { id: 'created_desc', label: 'Recently Added', value: 'created_at:desc' },
  { id: 'updated_desc', label: 'Recently Updated', value: 'updated_at:desc' }
];

export function InventoryFilters({ totalItems = 0, activeFilters = 0 }: InventoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateSearchParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset to first page when filters change
    if (Object.keys(updates).some(key => key !== 'page')) {
      params.delete('page');
    }

    router.push(`?${params.toString()}`);
  }, [searchParams, router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ search: searchQuery });
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const currentValue = searchParams.get(filterType);
    if (currentValue === value) {
      updateSearchParams({ [filterType]: null });
    } else {
      updateSearchParams({ [filterType]: value });
    }
  };

  const handleSortChange = (sortValue: string) => {
    const [sortBy, sortOrder] = sortValue.split(':');
    updateSearchParams({ sortBy, sortOrder });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    router.push('?');
  };

  const currentCategory = searchParams.get('category');
  const currentStatus = searchParams.get('status');
  const currentLocation = searchParams.get('location');
  const currentSort = `${searchParams.get('sortBy') || 'name'}:${searchParams.get('sortOrder') || 'asc'}`;

  return (
    <Card>
      <div className="p-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search inventory items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button type="submit" variant="outline">
            <Search className="h-4 w-4" />
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilters > 0 && (
              <Badge variant="primary" className="ml-2 text-xs">
                {activeFilters}
              </Badge>
            )}
          </Button>
        </form>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {totalItems.toLocaleString()} items
            </span>
            {activeFilters > 0 && (
              <>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-blue-600">
                  {activeFilters} filter{activeFilters !== 1 ? 's' : ''} applied
                </span>
              </>
            )}
          </div>
          {activeFilters > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Package className="h-4 w-4 mr-1" />
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleFilterChange('category', option.value)}
                    className={`
                      px-3 py-1 rounded-full text-sm border transition-colors
                      ${currentCategory === option.value
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {option.label}
                    {option.count && (
                      <span className="ml-1 text-xs opacity-75">
                        ({option.count})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleFilterChange('status', option.value)}
                    className={`
                      px-3 py-1 rounded-full text-sm border transition-colors
                      ${currentStatus === option.value
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {option.label}
                    {option.count && (
                      <span className="ml-1 text-xs opacity-75">
                        ({option.count})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Location
              </label>
              <div className="flex flex-wrap gap-2">
                {LOCATION_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleFilterChange('location', option.value)}
                    className={`
                      px-3 py-1 rounded-full text-sm border transition-colors
                      ${currentLocation === option.value
                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {option.label}
                    {option.count && (
                      <span className="ml-1 text-xs opacity-75">
                        ({option.count})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <RefreshCw className="h-4 w-4 mr-1" />
                Sort by
              </label>
              <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                aria-label="Sort inventory items"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Expiry Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="From"
                />
                <span className="px-2 py-2 text-gray-500">to</span>
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="To"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}