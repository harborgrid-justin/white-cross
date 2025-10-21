/**
 * WF-INV-001 | InventoryItems.tsx - Inventory items management interface
 * Purpose: Comprehensive inventory item management with CRUD operations and search
 * Upstream: ../services/modules/health/inventoryApi, ../types/inventory | Dependencies: react, react-hook-form
 * Downstream: Inventory management system | Called by: React router, inventory workflow
 * Related: InventoryAlerts.tsx, InventoryTransactions.tsx, InventoryVendors.tsx
 * Exports: default InventoryItems component | Key Features: Item listing, search, filters, CRUD operations
 * Last Updated: 2025-10-21 | File Type: .tsx
 * Critical Path: Load items → Display list → Search/filter → Manage items
 * LLM Context: Inventory item management interface with comprehensive CRUD and search functionality
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../contexts/AuthContext';
import { PROTECTED_ROUTES } from '../../constants/routes';

// ============================================================================
// INTERFACES
// ============================================================================

interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  sku: string;
  barcode?: string;
  unitOfMeasure: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitCost: number;
  totalValue: number;
  location: string;
  vendor?: string;
  expirationDate?: string;
  batchNumber?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  lastUpdated: string;
  lowStockAlert: boolean;
}

interface ItemFilters {
  search?: string;
  category?: string;
  status?: string;
  lowStock?: boolean;
  location?: string;
  vendor?: string;
}

interface ItemFormData {
  name: string;
  description?: string;
  category: string;
  sku: string;
  barcode?: string;
  unitOfMeasure: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitCost: number;
  location: string;
  vendor?: string;
  expirationDate?: string;
  batchNumber?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
}

// ============================================================================
// COMPONENT
// ============================================================================

const InventoryItems: React.FC = () => {
  // Navigation and auth
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthContext();

  // State management
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filters and search
  const [filters, setFilters] = useState<ItemFilters>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || '',
    lowStock: searchParams.get('lowStock') === 'true',
    location: searchParams.get('location') || '',
    vendor: searchParams.get('vendor') || '',
  });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form management
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ItemFormData>();

  // ============================================================================
  // MOCK DATA (Replace with actual API calls)
  // ============================================================================

  const mockItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Acetaminophen 500mg',
      description: 'Pain reliever and fever reducer tablets',
      category: 'MEDICATION',
      sku: 'MED-ACE-500',
      barcode: '123456789012',
      unitOfMeasure: 'tablets',
      currentStock: 150,
      minimumStock: 50,
      maximumStock: 500,
      unitCost: 0.25,
      totalValue: 37.50,
      location: 'Pharmacy Cabinet A',
      vendor: 'MedSupply Inc',
      expirationDate: '2025-12-31',
      batchNumber: 'ACE-2024-001',
      status: 'ACTIVE',
      lastUpdated: '2025-10-20T10:30:00Z',
      lowStockAlert: false,
    },
    {
      id: '2',
      name: 'Bandages - Adhesive',
      description: 'Self-adhesive bandages for wound care',
      category: 'SUPPLIES',
      sku: 'SUP-BAN-ADH',
      unitOfMeasure: 'pieces',
      currentStock: 25,
      minimumStock: 100,
      maximumStock: 1000,
      unitCost: 0.15,
      totalValue: 3.75,
      location: 'First Aid Station',
      vendor: 'Healthcare Supply Co',
      status: 'ACTIVE',
      lastUpdated: '2025-10-19T14:20:00Z',
      lowStockAlert: true,
    },
    {
      id: '3',
      name: 'Digital Thermometer',
      description: 'Electronic thermometer for temperature measurement',
      category: 'EQUIPMENT',
      sku: 'EQP-THM-DIG',
      unitOfMeasure: 'units',
      currentStock: 8,
      minimumStock: 5,
      maximumStock: 20,
      unitCost: 15.99,
      totalValue: 127.92,
      location: 'Nurse Office - Drawer 1',
      vendor: 'MedTech Solutions',
      status: 'ACTIVE',
      lastUpdated: '2025-10-18T09:15:00Z',
      lowStockAlert: false,
    },
  ];

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredItems = mockItems;

      // Apply filters
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredItems = filteredItems.filter(item =>
          item.name.toLowerCase().includes(searchLower) ||
          item.sku.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
        );
      }

      if (filters.category) {
        filteredItems = filteredItems.filter(item => item.category === filters.category);
      }

      if (filters.status) {
        filteredItems = filteredItems.filter(item => item.status === filters.status);
      }

      if (filters.lowStock) {
        filteredItems = filteredItems.filter(item => item.lowStockAlert);
      }

      if (filters.location) {
        filteredItems = filteredItems.filter(item =>
          item.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      if (filters.vendor) {
        filteredItems = filteredItems.filter(item =>
          item.vendor?.toLowerCase().includes(filters.vendor!.toLowerCase())
        );
      }

      setItems(filteredItems);
      setTotalCount(filteredItems.length);
    } catch (err) {
      console.error('Failed to load inventory items:', err);
      setError('Failed to load inventory items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [filters]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleFilterChange = (newFilters: Partial<ItemFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value && value !== '' && value !== false) {
        params.set(key, String(value));
      }
    });
    setSearchParams(params);
  };

  const handleCreateItem = async (data: ItemFormData) => {
    try {
      // Mock API call - replace with actual implementation
      console.log('Creating item:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowCreateModal(false);
      reset();
      await loadItems();
    } catch (err) {
      console.error('Failed to create item:', err);
      setError('Failed to create item. Please try again.');
    }
  };

  const handleEditItem = async (data: ItemFormData) => {
    try {
      // Mock API call - replace with actual implementation
      console.log('Updating item:', selectedItem?.id, data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowEditModal(false);
      setSelectedItem(null);
      reset();
      await loadItems();
    } catch (err) {
      console.error('Failed to update item:', err);
      setError('Failed to update item. Please try again.');
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    try {
      // Mock API call - replace with actual implementation
      console.log('Deleting item:', selectedItem.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowDeleteModal(false);
      setSelectedItem(null);
      await loadItems();
    } catch (err) {
      console.error('Failed to delete item:', err);
      setError('Failed to delete item. Please try again.');
    }
  };

  const openEditModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setValue('name', item.name);
    setValue('description', item.description || '');
    setValue('category', item.category);
    setValue('sku', item.sku);
    setValue('barcode', item.barcode || '');
    setValue('unitOfMeasure', item.unitOfMeasure);
    setValue('currentStock', item.currentStock);
    setValue('minimumStock', item.minimumStock);
    setValue('maximumStock', item.maximumStock);
    setValue('unitCost', item.unitCost);
    setValue('location', item.location);
    setValue('vendor', item.vendor || '');
    setValue('expirationDate', item.expirationDate || '');
    setValue('batchNumber', item.batchNumber || '');
    setValue('status', item.status);
    setShowEditModal(true);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-yellow-100 text-yellow-800',
      DISCONTINUED: 'bg-red-100 text-red-800',
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      MEDICATION: 'bg-blue-100 text-blue-800',
      SUPPLIES: 'bg-purple-100 text-purple-800',
      EQUIPMENT: 'bg-orange-100 text-orange-800',
    };
    return categoryConfig[category as keyof typeof categoryConfig] || 'bg-gray-100 text-gray-800';
  };

  // ============================================================================
  // FORM MODAL COMPONENT
  // ============================================================================

  const ItemFormModal: React.FC<{ isEdit?: boolean }> = ({ isEdit = false }) => {
    const modalTitle = isEdit ? 'Edit Inventory Item' : 'Create New Inventory Item';
    const submitHandler = isEdit ? handleEditItem : handleCreateItem;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{modalTitle}</h3>
          
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <input
                  {...register('name', { required: 'Item name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU *
                </label>
                <input
                  {...register('sku', { required: 'SKU is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.sku && (
                  <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category...</option>
                  <option value="MEDICATION">Medication</option>
                  <option value="SUPPLIES">Supplies</option>
                  <option value="EQUIPMENT">Equipment</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit of Measure *
                </label>
                <input
                  {...register('unitOfMeasure', { required: 'Unit of measure is required' })}
                  placeholder="e.g., tablets, pieces, bottles"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.unitOfMeasure && (
                  <p className="mt-1 text-sm text-red-600">{errors.unitOfMeasure.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stock *
                </label>
                <input
                  type="number"
                  {...register('currentStock', { 
                    required: 'Current stock is required',
                    min: { value: 0, message: 'Stock cannot be negative' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.currentStock && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentStock.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Stock *
                </label>
                <input
                  type="number"
                  {...register('minimumStock', { 
                    required: 'Minimum stock is required',
                    min: { value: 0, message: 'Stock cannot be negative' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.minimumStock && (
                  <p className="mt-1 text-sm text-red-600">{errors.minimumStock.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Stock *
                </label>
                <input
                  type="number"
                  {...register('maximumStock', { 
                    required: 'Maximum stock is required',
                    min: { value: 1, message: 'Maximum stock must be at least 1' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.maximumStock && (
                  <p className="mt-1 text-sm text-red-600">{errors.maximumStock.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Cost *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('unitCost', { 
                    required: 'Unit cost is required',
                    min: { value: 0, message: 'Cost cannot be negative' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.unitCost && (
                  <p className="mt-1 text-sm text-red-600">{errors.unitCost.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  {...register('location', { required: 'Location is required' })}
                  placeholder="e.g., Pharmacy Cabinet A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor
                </label>
                <input
                  {...register('vendor')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="DISCONTINUED">Discontinued</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Barcode
                </label>
                <input
                  {...register('barcode')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  {...register('expirationDate')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Batch Number
              </label>
              <input
                {...register('batchNumber')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  if (isEdit) {
                    setShowEditModal(false);
                    setSelectedItem(null);
                  } else {
                    setShowCreateModal(false);
                  }
                  reset();
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : (isEdit ? 'Update Item' : 'Create Item')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ============================================================================
  // DELETE CONFIRMATION MODAL
  // ============================================================================

  const DeleteConfirmModal: React.FC = () => {
    if (!showDeleteModal || !selectedItem) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Inventory Item</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{selectedItem.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedItem(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteItem}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Item
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // LOADING & ERROR STATES
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading inventory items...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Items</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => loadItems()}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Items</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage medical supplies, medications, and equipment inventory
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(PROTECTED_ROUTES.INVENTORY_ALERTS)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Low Stock Alerts
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search items..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange({ category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Categories</option>
              <option value="MEDICATION">Medication</option>
              <option value="SUPPLIES">Supplies</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>
          <div>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DISCONTINUED">Discontinued</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Location..."
              value={filters.location || ''}
              onChange={(e) => handleFilterChange({ location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Vendor..."
              value={filters.vendor || ''}
              onChange={(e) => handleFilterChange({ vendor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.lowStock || false}
                onChange={(e) => handleFilterChange({ lowStock: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Low Stock Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-700">
          Showing {items.length} of {totalCount} items
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option>Name A-Z</option>
            <option>Name Z-A</option>
            <option>Stock Level</option>
            <option>Last Updated</option>
          </select>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                          {item.lowStockAlert && (
                            <svg className="inline-block ml-1 h-4 w-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{item.sku}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadge(item.category)}`}>
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className={`text-sm font-medium ${item.lowStockAlert ? 'text-red-600' : 'text-gray-900'}`}>
                      {item.currentStock} {item.unitOfMeasure}
                    </div>
                    <div className="text-sm text-gray-500">
                      Min: {item.minimumStock} | Max: {item.maximumStock}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      ${item.totalValue.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${item.unitCost.toFixed(2)} per {item.unitOfMeasure.slice(0, -1)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m6-8v2m0 0v2m0-2h2m-2 0H8" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory items found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {Object.values(filters).some(v => v) 
                ? 'Try adjusting your search filters.'
                : 'Get started by adding your first inventory item.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && <ItemFormModal />}
      {showEditModal && <ItemFormModal isEdit />}
      <DeleteConfirmModal />
    </div>
  );
};

export default InventoryItems;
