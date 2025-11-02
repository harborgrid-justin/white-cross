'use client';

/**
 * NewInventoryItemContent Component
 *
 * Form for creating new inventory items in the healthcare system.
 * Handles medications, medical supplies, and equipment with proper tracking fields.
 *
 * @module NewInventoryItemContent
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

// Zod schema for form validation
const inventoryItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['medication', 'supply', 'equipment'], {
    required_error: 'Please select a type',
  }),
  description: z.string().optional(),
  manufacturer: z.string().optional(),
  ndcCode: z.string().optional(),
  lotNumber: z.string().optional(),
  expirationDate: z.string().optional(),
  location: z.string().min(1, 'Storage location is required'),
  minStockLevel: z.coerce.number().min(0, 'Minimum stock level cannot be negative'),
  maxStockLevel: z.coerce.number().min(0, 'Maximum stock level cannot be negative'),
  reorderPoint: z.coerce.number().min(0, 'Reorder point cannot be negative'),
  unitOfMeasure: z.string().min(1, 'Unit of measure is required'),
  unitCost: z.coerce.number().min(0, 'Unit cost cannot be negative'),
  isControlledSubstance: z.boolean().default(false),
  requiresPrescription: z.boolean().default(false),
  storageRequirements: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => data.maxStockLevel >= data.minStockLevel, {
  message: 'Maximum stock level must be greater than or equal to minimum',
  path: ['maxStockLevel'],
}).refine((data) => data.reorderPoint >= data.minStockLevel, {
  message: 'Reorder point should be at or above minimum stock level',
  path: ['reorderPoint'],
}).refine((data) => {
  if (data.type === 'medication' && !data.ndcCode) {
    return false;
  }
  return true;
}, {
  message: 'NDC code is required for medications',
  path: ['ndcCode'],
});

type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;

/**
 * Form component for creating new inventory items
 */
export default function NewInventoryItemContent() {
  const router = useRouter();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm<InventoryItemFormData>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: '',
      sku: '',
      category: '',
      type: 'supply',
      description: '',
      manufacturer: '',
      ndcCode: '',
      lotNumber: '',
      expirationDate: '',
      location: '',
      minStockLevel: 0,
      maxStockLevel: 0,
      reorderPoint: 0,
      unitOfMeasure: 'unit',
      unitCost: 0,
      isControlledSubstance: false,
      requiresPrescription: false,
      storageRequirements: '',
      notes: '',
    },
  });

  const watchType = form.watch('type');

  /**
   * Handles form submission
   */
  const onSubmit = async (data: InventoryItemFormData) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Creating inventory item:', data);

      setSubmitSuccess(true);

      // Reset form and redirect after success
      setTimeout(() => {
        router.push('/inventory/items');
      }, 2000);
    } catch (error) {
      console.error('Error creating inventory item:', error);
      form.setError('root', {
        type: 'manual',
        message: 'Failed to create inventory item. Please try again.',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Inventory Item</h1>
        <p className="text-muted-foreground mt-2">
          Create a new inventory item for tracking medical supplies, medications, or equipment.
        </p>
      </div>

      {submitSuccess && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Inventory item created successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      {form.formState.errors.root && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {form.formState.errors.root.message}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Acetaminophen 500mg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., MED-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="supply">Medical Supply</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Pain Relief" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of the item"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchType === 'medication' && (
                <FormField
                  control={form.control}
                  name="ndcCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NDC Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="00000-0000-00" {...field} />
                      </FormControl>
                      <FormDescription>
                        National Drug Code (required for medications)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="lotNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lot Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Stock Management */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Management</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Cabinet A, Shelf 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitOfMeasure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit of Measure</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="unit">Unit</SelectItem>
                        <SelectItem value="bottle">Bottle</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="ml">mL</SelectItem>
                        <SelectItem value="mg">mg</SelectItem>
                        <SelectItem value="piece">Piece</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minStockLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Stock Level</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxStockLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Stock Level</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reorderPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reorder Point</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Cost ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Regulatory & Safety */}
          <Card>
            <CardHeader>
              <CardTitle>Regulatory & Safety</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="isControlledSubstance"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Controlled Substance (requires DEA tracking)
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requiresPrescription"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Requires Prescription
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storageRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Requirements</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Store at room temperature, keep away from moisture"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional notes or special instructions"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Creating...' : 'Create Item'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
