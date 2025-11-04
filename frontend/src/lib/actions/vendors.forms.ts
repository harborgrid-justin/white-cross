/**
 * @fileoverview Vendor Form Handling
 * @module lib/actions/vendors/forms
 *
 * Form data handling and parsing for vendor operations.
 * Provides form-friendly wrappers around core CRUD actions.
 */

'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Types
import type {
  ActionResult,
  Vendor,
  CreateVendorData,
  UpdateVendorData
} from './vendors.types';

// CRUD operations
import { createVendorAction, updateVendorAction } from './vendors.crud';

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create vendor from form data
 * Form-friendly wrapper for createVendorAction
 */
export async function createVendorFromForm(formData: FormData): Promise<ActionResult<Vendor>> {
  const vendorData: CreateVendorData = {
    name: formData.get('name') as string,
    code: formData.get('code') as string || undefined,
    description: formData.get('description') as string || undefined,
    type: formData.get('type') as Vendor['type'],
    contactInfo: {
      primaryContact: formData.get('primaryContact') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: {
        street: formData.get('address.street') as string,
        city: formData.get('address.city') as string,
        state: formData.get('address.state') as string,
        zipCode: formData.get('address.zipCode') as string,
        country: formData.get('address.country') as string || 'US',
      },
      website: formData.get('website') as string || undefined,
    },
    businessInfo: {
      taxId: formData.get('taxId') as string || undefined,
      dunsNumber: formData.get('dunsNumber') as string || undefined,
      businessLicense: formData.get('businessLicense') as string || undefined,
    },
    compliance: {
      hipaaCompliant: formData.get('hipaaCompliant') === 'true',
      fdaRegistered: formData.get('fdaRegistered') === 'true',
      deaRegistered: formData.get('deaRegistered') === 'true',
      certifications: (formData.get('certifications') as string)?.split(',').filter(Boolean) || [],
    },
    financials: {
      paymentTerms: parseInt(formData.get('paymentTerms') as string) || 30,
      currency: formData.get('currency') as string || 'USD',
      taxRate: parseFloat(formData.get('taxRate') as string) || undefined,
    },
  };

  const result = await createVendorAction(vendorData);

  if (result.success && result.data) {
    redirect(`/vendors/${result.data.id}`);
  }

  return result;
}

/**
 * Update vendor from form data
 * Form-friendly wrapper for updateVendorAction
 */
export async function updateVendorFromForm(
  vendorId: string,
  formData: FormData
): Promise<ActionResult<Vendor>> {
  const vendorData: UpdateVendorData = {
    name: formData.get('name') as string || undefined,
    description: formData.get('description') as string || undefined,
    type: formData.get('type') as Vendor['type'] || undefined,
    status: formData.get('status') as Vendor['status'] || undefined,
    priority: formData.get('priority') as Vendor['priority'] || undefined,
  };

  // Handle nested contact info updates
  if (formData.get('primaryContact') || formData.get('email') || formData.get('phone')) {
    vendorData.contactInfo = {
      primaryContact: formData.get('primaryContact') as string || undefined,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
    };
  }

  // Filter out undefined values
  const filteredData = Object.entries(vendorData).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof UpdateVendorData] = value;
    }
    return acc;
  }, {} as UpdateVendorData);

  const result = await updateVendorAction(vendorId, filteredData);

  if (result.success && result.data) {
    revalidatePath(`/vendors/${vendorId}`, 'page');
  }

  return result;
}
