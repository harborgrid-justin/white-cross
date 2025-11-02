'use client';

/**
 * InventoryItemsContent Component
 *
 * Main inventory items list/table view with search, filtering, and sorting.
 * Displays all inventory items with stock status and quick actions.
 *
 * @module InventoryItemsContent
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableEmptyState,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Plus, ArrowUpDown } from 'lucide-react';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  type: 'medication' | 'supply' | 'equipment';
  currentStock: number;
  minStockLevel: number;
  reorderPoint: number;
  unitOfMeasure: string;
  location: string;
  expirationDate?: string;
  isControlledSubstance: boolean;
}

/**
 * Inventory items list component with search and filtering
 *
 * @returns Rendered inventory items table
 */
export function InventoryItemsContent() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'sku'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  /**
   * Load inventory items
   */
  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);

      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data
        const mockItems: InventoryItem[] = [
          {
            id: '1',
            name: 'Acetaminophen 500mg',
            sku: 'MED-001',
            category: 'Pain Relief',
            type: 'medication',
            currentStock: 100,
            minStockLevel: 20,
            reorderPoint: 40,
            unitOfMeasure: 'tablet',
            location: 'Cabinet A, Shelf 2',
            expirationDate: '2025-12-31',
            isControlledSubstance: false,
          },
          {
            id: '2',
            name: 'Bandages (Adhesive)',
            sku: 'SUP-101',
            category: 'First Aid',
            type: 'supply',
            currentStock: 15,
            minStockLevel: 25,
            reorderPoint: 30,
            unitOfMeasure: 'box',
            location: 'Cabinet B, Shelf 1',
            isControlledSubstance: false,
          },
          {
            id: '3',
            name: 'Digital Thermometer',
            sku: 'EQP-201',
            category: 'Diagnostic Equipment',
            type: 'equipment',
            currentStock: 5,
            minStockLevel: 3,
            reorderPoint: 4,
            unitOfMeasure: 'unit',
            location: 'Equipment Cabinet',
            isControlledSubstance: false,
          },
          {
            id: '4',
            name: 'Ibuprofen 200mg',
            sku: 'MED-002',
            category: 'Pain Relief',
            type: 'medication',
            currentStock: 0,
            minStockLevel: 20,
            reorderPoint: 40,
            unitOfMeasure: 'tablet',
            location: 'Cabinet A, Shelf 3',
            expirationDate: '2025-06-30',
            isControlledSubstance: false,
          },
          {
            id: '5',
            name: 'Alcohol Swabs',
            sku: 'SUP-102',
            category: 'First Aid',
            type: 'supply',
            currentStock: 200,
            minStockLevel: 50,
            reorderPoint: 75,
            unitOfMeasure: 'piece',
            location: 'Cabinet B, Shelf 2',
            isControlledSubstance: false,
          },
        ];

        setItems(mockItems);
        setFilteredItems(mockItems);
      } catch (error) {
        console.error('Error loading inventory items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  /**
   * Filter and sort items when filters change
   */
  useEffect(() => {
    let filtered = [...items];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    // Stock status filter
    if (stockFilter === 'low') {
      filtered = filtered.filter(item => item.currentStock <= item.minStockLevel);
    } else if (stockFilter === 'reorder') {
      filtered = filtered.filter(item => item.currentStock <= item.reorderPoint);
    } else if (stockFilter === 'out') {
      filtered = filtered.filter(item => item.currentStock === 0);
    }

    // Sort
    filtered.sort((a, b) => {
      let compareValue = 0;

      if (sortBy === 'name') {
        compareValue = a.name.localeCompare(b.name);
      } else if (sortBy === 'sku') {
        compareValue = a.sku.localeCompare(b.sku);
      } else if (sortBy === 'stock') {
        compareValue = a.currentStock - b.currentStock;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    setFilteredItems(filtered);
  }, [items, searchQuery, selectedCategory, selectedType, stockFilter, sortBy, sortOrder]);

  /**
   * Gets stock status with color coding
   */
  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return { label: 'Out of Stock', color: 'red' };
    } else if (item.currentStock <= item.minStockLevel) {
      return { label: 'Low Stock', color: 'orange' };
    } else if (item.currentStock <= item.reorderPoint) {
      return { label: 'Reorder', color: 'yellow' };
    } else {
      return { label: 'In Stock', color: 'green' };
    }
  };

  /**
   * Get unique categories
   */
  const categories = Array.from(new Set(items.map(item => item.category))).sort();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Items</h1>
          <p className="text-muted-foreground mt-1">Manage all inventory items and stock levels</p>
        </div>
        <Button asChild>
          <Link href="/inventory/items/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Items</p>
            <p className="text-2xl font-bold">{items.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Low Stock</p>
            <p className="text-2xl font-bold text-orange-600">
              {items.filter(item => item.currentStock <= item.minStockLevel).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Needs Reorder</p>
            <p className="text-2xl font-bold text-yellow-600">
              {items.filter(item => item.currentStock <= item.reorderPoint && item.currentStock > item.minStockLevel).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Out of Stock</p>
            <p className="text-2xl font-bold text-destructive">
              {items.filter(item => item.currentStock === 0).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search by name, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="medication">Medications</SelectItem>
                <SelectItem value="supply">Supplies</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
              </SelectContent>
            </Select>

            {/* Stock Filter */}
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Stock Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock Levels</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="reorder">Needs Reorder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Controls */}
          <div className="flex gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'name' | 'stock' | 'sku')}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="sku">SKU</SelectItem>
                  <SelectItem value="stock">Stock Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
            <div className="ml-auto text-sm text-muted-foreground flex items-center">
              Showing {filteredItems.length} of {items.length} items
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : filteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg font-semibold mb-2">No items found</p>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== 'all' || selectedType !== 'all' || stockFilter !== 'all'
                ? "Try adjusting your filters to find what you're looking for"
                : "Get started by adding your first inventory item"}
            </p>
            {searchQuery || selectedCategory !== 'all' || selectedType !== 'all' || stockFilter !== 'all' ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setStockFilter('all');
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button asChild>
                <Link href="/inventory/items/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const status = getStockStatus(item);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{item.name}</p>
                        {item.isControlledSubstance && (
                          <Badge variant="destructive" className="text-xs">
                            Controlled
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {item.sku}
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{item.currentStock}</span>{' '}
                      <span className="text-muted-foreground">{item.unitOfMeasure}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          status.color === 'red' ? 'destructive' :
                          status.color === 'orange' ? 'default' :
                          status.color === 'yellow' ? 'secondary' :
                          'outline'
                        }
                        className={
                          status.color === 'orange' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' :
                          status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                          status.color === 'green' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''
                        }
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{item.location}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/inventory/items/${item.id}`}>
                          View
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/inventory/items/${item.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
