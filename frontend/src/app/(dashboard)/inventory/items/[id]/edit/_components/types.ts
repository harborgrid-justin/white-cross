/**
 * @fileoverview Shared Types for Inventory Item Editing
 * @module app/(dashboard)/inventory/items/[id]/edit/_components/types
 */

/**
 * Complete inventory item data structure
 */
export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  type: 'medication' | 'supply' | 'equipment';
  description: string;
  manufacturer: string;
  ndcCode?: string;
  lotNumber?: string;
  expirationDate?: string;
  location: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  unitOfMeasure: string;
  unitCost: number;
  isControlledSubstance: boolean;
  requiresPrescription: boolean;
  storageRequirements?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Form field validation errors
 */
export type InventoryItemErrors = Partial<Record<keyof InventoryItem, string>>;

/**
 * Props for section components
 */
export interface SectionProps {
  formData: Partial<InventoryItem>;
  errors: InventoryItemErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

/**
 * Hook return type for form management
 */
export interface UseInventoryItemForm {
  formData: Partial<InventoryItem>;
  originalData: Partial<InventoryItem>;
  isLoading: boolean;
  errors: InventoryItemErrors;
  isSubmitting: boolean;
  submitSuccess: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  hasChanges: () => boolean;
}
