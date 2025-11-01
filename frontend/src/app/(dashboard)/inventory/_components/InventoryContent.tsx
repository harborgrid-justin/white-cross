/**
 * @fileoverview Inventory Content Component - Main content area for inventory management
 * @module app/(dashboard)/inventory/_components/InventoryContent
 * @category Inventory - Components
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { InventoryFilters } from './InventoryFilters';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
  Package,
  Package2,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Plus,
  Download,
  Eye,
  Edit,
  Pill,
  Stethoscope,
  Thermometer,
  Bandage
} from 'lucide-react';

export interface InventoryItem {
  id: string;
  name: string;
  category: 'MEDICAL_SUPPLIES' | 'MEDICATIONS' | 'GENERAL_SUPPLIES' | 'EQUIPMENT' | 'CONSUMABLES';
  sku: string;
  currentStock: number;
  reorderLevel: number;
  maxStock: number;
  unitCost: number;
  totalValue: number;
  location: string;
  supplier: string;
  expirationDate?: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED' | 'EXPIRING_SOON';
  lastRestocked: string;
  description?: string;
  isControlledSubstance: boolean;
  requiresPrescription: boolean;
  storageRequirements?: string;
}

interface InventoryContentProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    status?: string;
    location?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

// Mock data for demonstration
const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Acetaminophen 500mg',
    category: 'MEDICATIONS',
    sku: 'MED-ACE-500',
    currentStock: 250,
    reorderLevel: 50,
    maxStock: 500,
    unitCost: 0.15,
    totalValue: 37.50,
    location: 'Main Office - Medicine Cabinet A',
    supplier: 'MedSupply Corp',
    expirationDate: '2025-06-15',
    status: 'IN_STOCK',
    lastRestocked: '2024-10-15T10:30:00Z',
    description: 'Pain reliever and fever reducer',
    isControlledSubstance: false,
    requiresPrescription: false,
    storageRequirements: 'Store at room temperature'
  },
  {
    id: '2',
    name: 'Digital Thermometer',
    category: 'EQUIPMENT',
    sku: 'EQP-THERM-001',
    currentStock: 15,
    reorderLevel: 5,
    maxStock: 25,
    unitCost: 12.99,
    totalValue: 194.85,
    location: 'Main Office - Supply Closet B',
    supplier: 'HealthTech Solutions',
    status: 'IN_STOCK',
    lastRestocked: '2024-09-20T14:15:00Z',
    description: 'Fast-reading digital thermometer',
    isControlledSubstance: false,
    requiresPrescription: false,
    storageRequirements: 'Store in dry place'
  },
  {
    id: '3',
    name: 'Bandages - Assorted Sizes',
    category: 'MEDICAL_SUPPLIES',
    sku: 'MED-BAND-AST',
    currentStock: 8,
    reorderLevel: 20,
    maxStock: 100,
    unitCost: 0.25,
    totalValue: 2.00,
    location: 'Main Office - First Aid Station',
    supplier: 'Medical Supply Plus',
    status: 'LOW_STOCK',
    lastRestocked: '2024-08-30T09:00:00Z',
    description: 'Sterile adhesive bandages',
    isControlledSubstance: false,
    requiresPrescription: false,
    storageRequirements: 'Keep in sterile packaging'
  },
  {
    id: '4',
    name: 'Albuterol Inhaler',
    category: 'MEDICATIONS',
    sku: 'MED-ALB-INH',
    currentStock: 2,
    reorderLevel: 5,
    maxStock: 15,
    unitCost: 45.00,
    totalValue: 90.00,
    location: 'Main Office - Emergency Kit',
    supplier: 'PharmaCorp',
    expirationDate: '2024-12-01',
    status: 'EXPIRING_SOON',
    lastRestocked: '2024-06-01T11:45:00Z',
    description: 'Rescue inhaler for asthma attacks',
    isControlledSubstance: false,
    requiresPrescription: true,
    storageRequirements: 'Store at room temperature, protect from light'
  }
];

function getStatusBadgeVariant(status: InventoryItem['status']) {
  switch (status) {
    case 'IN_STOCK': return 'success';
    case 'LOW_STOCK': return 'warning';
    case 'OUT_OF_STOCK': return 'danger';
    case 'EXPIRED': return 'danger';
    case 'EXPIRING_SOON': return 'warning';
    default: return 'secondary';
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'MEDICATIONS': return Pill;
    case 'MEDICAL_SUPPLIES': return Stethoscope;
    case 'EQUIPMENT': return Thermometer;
    case 'CONSUMABLES': return Bandage;
    default: return Package;
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'MEDICATIONS': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'MEDICAL_SUPPLIES': return 'bg-green-100 text-green-800 border-green-200';
    case 'EQUIPMENT': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'CONSUMABLES': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function calculateDaysUntilExpiration(expirationDate?: string): number | null {
  if (!expirationDate) return null;
  
  const today = new Date();
  const expiry = new Date(expirationDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function InventoryContent({ searchParams }: InventoryContentProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setItems(mockInventoryItems);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((item: InventoryItem) => item.id)));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <Skeleton className="h-6 w-16 mb-2" />
                  <Skeleton className="h-8 w-12" />
                </div>
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  const totalItems = items.length;
  const totalValue = items.reduce((sum: number, item: InventoryItem) => sum + item.totalValue, 0);
  const lowStockItems = items.filter((item: InventoryItem) => item.status === 'LOW_STOCK' || item.status === 'OUT_OF_STOCK').length;
  const expiringItems = items.filter((item: InventoryItem) => {
    const days = calculateDaysUntilExpiration(item.expirationDate);
    return days !== null && days <= 30;
  }).length;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <InventoryFilters 
        totalItems={totalItems} 
        activeFilters={Object.keys(searchParams).filter(key => 
          key !== 'page' && key !== 'limit' && searchParams[key as keyof typeof searchParams]
        ).length} 
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">${totalValue.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{lowStockItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-red-600">{expiringItems}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Inventory Items</h2>
            <div className="flex items-center gap-2">
              {selectedItems.size > 0 && (
                <>
                  <span className="text-sm text-gray-600">
                    {selectedItems.size} selected
                  </span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </>
              )}
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === items.length && items.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                      aria-label="Select all inventory items"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value & Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => {
                  const CategoryIcon = getCategoryIcon(item.category);
                  const daysUntilExpiration = calculateDaysUntilExpiration(item.expirationDate);
                  const stockPercentage = (item.currentStock / item.maxStock) * 100;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="rounded border-gray-300"
                          aria-label={`Select ${item.name}`}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              <CategoryIcon className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              SKU: {item.sku}
                            </div>
                            <div className="mt-1">
                              <Badge 
                                variant="secondary"
                                className={getCategoryColor(item.category)}
                              >
                                {item.category.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-900">
                            {item.currentStock} / {item.maxStock}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                stockPercentage <= 25 ? 'bg-red-600' :
                                stockPercentage <= 50 ? 'bg-orange-600' : 'bg-green-600'
                              }`}
                              data-width={`${Math.min(stockPercentage, 100)}%`}
                            />
                          </div>
                          <div className="text-xs text-gray-500">
                            Reorder at: {item.reorderLevel}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            ${item.totalValue.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Unit: ${item.unitCost.toFixed(2)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <Badge variant={getStatusBadgeVariant(item.status)}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                          <div className="text-xs text-gray-500">
                            {item.location}
                          </div>
                          {item.expirationDate && daysUntilExpiration !== null && (
                            <div className={`text-xs ${
                              daysUntilExpiration <= 7 ? 'text-red-600 font-medium' :
                              daysUntilExpiration <= 30 ? 'text-orange-600' : 'text-gray-500'
                            }`}>
                              {daysUntilExpiration > 0 
                                ? `Expires in ${daysUntilExpiration} days`
                                : 'Expired'
                              }
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Package2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {items.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first inventory item.
              </p>
              <div className="mt-6">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}