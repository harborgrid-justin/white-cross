/**
 * @fileoverview Custom Hook for Inventory Item Form Management
 * @module app/(dashboard)/inventory/items/[id]/edit/_components/useInventoryItemForm
 *
 * Manages form state, validation, and submission for inventory item editing.
 */

import { useState, useEffect, useCallback } from 'react';
import type { InventoryItem, InventoryItemErrors, UseInventoryItemForm } from './types';

/**
 * Custom hook for managing inventory item form state and operations
 *
 * @param itemId - ID of the inventory item to edit
 * @returns Form state and handlers
 *
 * @example
 * ```tsx
 * const {
 *   formData,
 *   errors,
 *   handleChange,
 *   handleSubmit,
 *   isLoading
 * } = useInventoryItemForm('123');
 * ```
 */
export function useInventoryItemForm(itemId?: string): UseInventoryItemForm {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({});
  const [originalData, setOriginalData] = useState<Partial<InventoryItem>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<InventoryItemErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /**
   * Load inventory item data from API
   */
  useEffect(() => {
    const loadItem = async () => {
      setIsLoading(true);

      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data - replace with API response
        const mockItem: InventoryItem = {
          id: itemId || '1',
          name: 'Acetaminophen 500mg',
          sku: 'MED-001',
          category: 'Pain Relief',
          type: 'medication',
          description: 'Over-the-counter pain reliever and fever reducer',
          manufacturer: 'Generic Pharmaceuticals',
          ndcCode: '12345-678-90',
          lotNumber: 'LOT2024-001',
          expirationDate: '2025-12-31',
          location: 'Cabinet A, Shelf 2',
          currentStock: 100,
          minStockLevel: 20,
          maxStockLevel: 200,
          reorderPoint: 40,
          unitOfMeasure: 'tablet',
          unitCost: 0.15,
          isControlledSubstance: false,
          requiresPrescription: false,
          storageRequirements: 'Store at room temperature',
          notes: 'Common OTC medication',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        };

        setFormData(mockItem);
        setOriginalData(mockItem);
      } catch (error) {
        console.error('Error loading inventory item:', error);
        setErrors({ name: 'Failed to load inventory item. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    };

    loadItem();
  }, [itemId]);

  /**
   * Validates form data
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: InventoryItemErrors = {};

    // Required field validations
    if (!formData.name?.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.sku?.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.location) {
      newErrors.location = 'Storage location is required';
    }

    // Stock level validations
    if (formData.minStockLevel !== undefined && formData.minStockLevel < 0) {
      newErrors.minStockLevel = 'Minimum stock level cannot be negative';
    }

    if (
      formData.maxStockLevel !== undefined &&
      formData.minStockLevel !== undefined &&
      formData.maxStockLevel < formData.minStockLevel
    ) {
      newErrors.maxStockLevel = 'Maximum stock level must be greater than minimum';
    }

    if (
      formData.reorderPoint !== undefined &&
      formData.minStockLevel !== undefined &&
      formData.reorderPoint < formData.minStockLevel
    ) {
      newErrors.reorderPoint = 'Reorder point should be at or above minimum stock level';
    }

    // Medication-specific validations
    if (formData.type === 'medication' && !formData.ndcCode) {
      newErrors.ndcCode = 'NDC code is required for medications';
    }

    // Unit cost validation
    if (formData.unitCost !== undefined && formData.unitCost < 0) {
      newErrors.unitCost = 'Unit cost cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * Handles form field changes
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;

      setFormData(prev => ({
        ...prev,
        [name]:
          type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : type === 'number'
            ? parseFloat(value) || 0
            : value,
      }));

      // Clear error for this field when user starts typing
      if (errors[name as keyof InventoryItem]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Updating inventory item:', formData);

        setSubmitSuccess(true);
        setOriginalData(formData);

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } catch (error) {
        console.error('Error updating inventory item:', error);
        setErrors({ name: 'Failed to update inventory item. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm]
  );

  /**
   * Checks if form has unsaved changes
   */
  const hasChanges = useCallback(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  return {
    formData,
    originalData,
    isLoading,
    errors,
    isSubmitting,
    submitSuccess,
    handleChange,
    handleSubmit,
    hasChanges,
  };
}
