/**
 * WF-INV-001 | InventoryItems.tsx - Enhanced inventory items management interface
 * Purpose: Comprehensive inventory item management with CRUD operations using UI components and Redux
 * Upstream: ../services, ../components/ui, ./store | Dependencies: react, react-redux, UI components
 * Downstream: Inventory management system | Called by: React router, inventory workflow
 * Related: InventoryAlerts.tsx, InventoryTransactions.tsx, InventoryVendors.tsx
 * Exports: default InventoryItems component | Key Features: Redux integration, UI components, real-time data
 * Last Updated: 2025-10-21 | File Type: .tsx
 * Critical Path: Load items → Display with UI components → Redux state management → CRUD operations
 * LLM Context: Enhanced inventory management with proper component composition and Redux integration
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Edit, 
  Trash2,
  Package,
  TrendingDown,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';

// UI Components
import { Button } from '../../components/ui/buttons/Button';
import { Input } from '../../components/ui/inputs/Input';
import { Select } from '../../components/ui/inputs/Select';
import { SearchInput } from '../../components/ui/inputs/SearchInput';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmptyState,
  TableLoadingState
} from '../../components/ui/data/Table';

// Redux
import {
  fetchInventoryItems,
  fetchInventoryItemById,
  selectInventoryItems,
  selectItemsLoading,
  selectItemsError,
  selectPagination,
  selectFilters,
  setFilters,
  clearItemsError,
  inventoryApiService,
  type InventoryFilters,
  type CreateInventoryItemRequest
} from './store/inventorySlice';

// Types
import { AppDispatch, RootState } from '../../store';

// ============================================================================
// INTERFACES
// ============================================================================

interface ItemFormData extends CreateInventoryItemRequest {}

// ============================================================================
// COMPONENT
// ============================================================================

const InventoryItems: React.FC = () => {
  // Navigation and Redux
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux state
  const items = useSelector(selectInventoryItems);
  const loading = useSelector(selectItemsLoading);
  const error = useSelector(selectItemsError);
  const pagination = useSelector(selectPagination);
  const currentFilters = useSelector(selectFilters);

  // Local state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
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
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    // Load initial data
    dispatch(fetchInventoryItems(currentFilters));
  }, [dispatch, currentFilters]);

  useEffect(() => {
    // Clear error on unmount
    return () => {
      dispatch(clearItemsError());
    };
  }, [dispatch]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleFilterChange = (newFilters: Partial<InventoryFilters>) => {
    const updatedFilters = { ...currentFilters, ...newFilters };
    dispatch(setFilters(updatedFilters));

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
      await inventoryApiService.createItem(data);
      setShowCreateModal(false);
      reset();
      dispatch(fetchInventoryItems(currentFilters));
    } catch (err) {
      console.error('Failed to create item:', err);
    }
  };

  const handleEditItem = async (data: ItemFormData) => {
    if (!selectedItem) return;

    try {
      await inventoryApiService.updateItem(selectedItem.id, data);
      setShowEditModal(false);
      setSelectedItem(null);
      reset();
      dispatch(fetchInventoryItems(currentFilters));
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    try {
      await inventoryApiService.deleteItem(selectedItem.id);
      setShowDeleteModal(false);
      setSelectedItem(null);
      dispatch(fetchInventoryItems(currentFilters));
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const openEditModal = (item: any) => {
    setSelectedItem(item);
    setValue('name', item.name);
    setValue('description', item.description || '');
    setValue('category', item.category);
    setValue('unit', item.unit);
    setValue('minQuantity', item.minQuantity);
    setValue('maxQuantity', item.maxQuantity);
    setValue('cost', item.cost);
    setValue('location', item.location);
    setValue('supplier', item.supplier || '');
    setValue('expirationDate', item.expirationDate || '');
    setValue('batchNumber', item.batchNumber || '');
    setShowEditModal(true);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getStatusBadge = (item: any) => {
    if (item.quantity <= item.minQuantity) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Low Stock</span>;
    }
    if (!item.isActive) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      MEDICATION: 'bg-blue-100 text-blue-800',
      SUPPLIES: 'bg-purple-100 text-purple-800',
      EQUIPMENT: 'bg-orange-100 text-orange-800',
    };
    const colorClass = categoryConfig[category as keyof typeof categoryConfig] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {category}
      </span>
    );
  };

  // ============================================================================
  // FORM MODAL COMPONENT
  // ============================================================================

  const ItemFormModal: React.FC<{ isEdit?: boolean }> = ({ isEdit = false }) => {
    const modalTitle = isEdit ? 'Edit Inventory Item' : 'Create New Inventory Item';
    const submitHandler = isEdit ? handleEditItem : handleCreateItem;

    if (!showCreateModal && !showEditModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{modalTitle}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (isEdit) {
                  setShowEditModal(false);
                  setSelectedItem(null);
                } else {
                  setShowCreateModal(false);
                }
                reset();
              }}
            >
              ×
            </Button>
          </div>
          
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Item Name *"
                {...register('name', { required: 'Item name is required' })}
                error={errors.name?.message}
              />
              <Input
                label="Category *"
                {...register('category', { required: 'Category is required' })}
                error={errors.category?.message}
              />
            </div>

            <Input
              label="Description"
              {...register('description')}
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Current Stock *"
                type="number"
                {...register('quantity', { 
                  required: 'Current stock is required',
                  min: { value: 0, message: 'Stock cannot be negative' }
                })}
                error={errors.quantity?.message}
              />
              <Input
                label="Minimum Stock *"
                type="number"
                {...register('minQuantity', { 
                  required: 'Minimum stock is required',
                  min: { value: 0, message: 'Stock cannot be negative' }
                })}
                error={errors.minQuantity?.message}
              />
              <Input
                label="Maximum Stock"
                type="number"
                {...register('maxQuantity')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Unit of Measure *"
                {...register('unit', { required: 'Unit is required' })}
                placeholder="e.g., tablets, pieces, bottles"
                error={errors.unit?.message}
              />
              <Input
                label="Unit Cost *"
                type="number"
                step="0.01"
                {...register('cost', { 
                  required: 'Unit cost is required',
                  min: { value: 0, message: 'Cost cannot be negative' }
                })}
                error={errors.cost?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Location *"
                {...register('location', { required: 'Location is required' })}
                error={errors.location?.message}
              />
              <Input
                label="Supplier"
                {...register('supplier')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiration Date"
                type="date"
                {...register('expirationDate')}
              />
              <Input
                label="Batch Number"
                {...register('batchNumber')}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  if (isEdit) {
                    setShowEditModal(false);
                    setSelectedItem(null);
                  } else {
                    setShowCreateModal(false);
                  }
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
              >
                {isEdit ? 'Update Item' : 'Create Item'}
              </Button>
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
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Delete Inventory Item</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{selectedItem.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedItem(null);
              }}
            >
              Cancel
            </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteItem}
              >
                Delete Item
              </Button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // ERROR STATE
  // ============================================================================

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Items</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => dispatch(fetchInventoryItems(currentFilters))}
              >
                Try Again
              </Button>
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            Inventory Items
          </h1>
          <p className="mt-2 text-gray-600">
            Manage medical supplies, medications, and equipment inventory
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => navigate('/inventory/alerts')}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Low Stock Alerts
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {items.filter(item => item.quantity <= item.minQuantity).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${items.reduce((sum, item) => sum + (item.quantity * item.cost), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Locations</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(items.map(item => item.location)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <SearchInput
            placeholder="Search items..."
            value={currentFilters.search || ''}
            onChange={(value) => handleFilterChange({ search: value })}
          />
          <Select
            value={currentFilters.category || ''}
            onChange={(e) => handleFilterChange({ category: e.target.value })}
            options={[
              { value: '', label: 'All Categories' },
              { value: 'MEDICATION', label: 'Medication' },
              { value: 'SUPPLIES', label: 'Supplies' },
              { value: 'EQUIPMENT', label: 'Equipment' }
            ]}
          />
          <Input
            placeholder="Location..."
            value={currentFilters.location || ''}
            onChange={(e) => handleFilterChange({ location: e.target.value })}
          />
          <Input
            placeholder="Supplier..."
            value={currentFilters.supplier || ''}
            onChange={(e) => handleFilterChange({ supplier: e.target.value })}
          />
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={currentFilters.lowStock || false}
                onChange={(e) => handleFilterChange({ lowStock: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Low Stock Only</span>
            </label>
          </div>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Filter className="w-4 h-4" />}
            onClick={() => dispatch(setFilters({ page: 1, limit: 20 }))}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white shadow rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableLoadingState cols={7} />
            ) : items.length === 0 ? (
              <TableEmptyState 
                cols={7}
                title="No inventory items found"
                description="Try adjusting your search filters or add a new item."
              />
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                            {item.quantity <= item.minQuantity && (
                              <AlertTriangle className="inline-block ml-1 h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          {item.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getCategoryBadge(item.category)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className={`text-sm font-medium ${item.quantity <= item.minQuantity ? 'text-red-600' : 'text-gray-900'}`}>
                        {item.quantity} {item.unit}
                      </div>
                      <div className="text-sm text-gray-500">
                        Min: {item.minQuantity} {item.maxQuantity && `| Max: ${item.maxQuantity}`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        ${(item.quantity * item.cost).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${item.cost.toFixed(2)} per {item.unit}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{item.location}</div>
                    {item.supplier && (
                      <div className="text-sm text-gray-500">{item.supplier}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Edit className="w-4 h-4" />}
                        onClick={() => openEditModal(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Trash2 className="w-4 h-4" />}
                        onClick={() => {
                          setSelectedItem(item);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      {showCreateModal && <ItemFormModal />}
      {showEditModal && <ItemFormModal isEdit />}
      <DeleteConfirmModal />
    </div>
  );
};

export default InventoryItems;
