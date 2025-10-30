'use client';

import React, { useState } from 'react';
import { 
  FileText,
  Plus,
  Trash2,
  Save,
  Send,
  Eye,
  Calculator,
  User,
  Building,
  Calendar,
  DollarSign,
  Percent,
  Edit3,
  Copy,
  Download
} from 'lucide-react';
import { InvoiceLineItem, BillingInvoice } from './BillingCard';

/**
 * Props for the BillingInvoiceBuilder component
 */
interface BillingInvoiceBuilderProps {
  /** Existing invoice to edit */
  invoice?: Partial<BillingInvoice>;
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Save invoice handler */
  onSaveInvoice?: (invoice: Partial<BillingInvoice>) => void;
  /** Send invoice handler */
  onSendInvoice?: (invoice: Partial<BillingInvoice>) => void;
  /** Preview invoice handler */
  onPreviewInvoice?: (invoice: Partial<BillingInvoice>) => void;
  /** Cancel handler */
  onCancel?: () => void;
}

/**
 * BillingInvoiceBuilder Component
 * 
 * A comprehensive invoice builder component for creating and editing invoices
 * with line items, tax calculations, discounts, and patient information.
 * 
 * @param props - BillingInvoiceBuilder component props
 * @returns JSX element representing the invoice builder interface
 */
const BillingInvoiceBuilder = ({
  invoice,
  loading = false,
  className = '',
  onSaveInvoice,
  onSendInvoice,
  onPreviewInvoice,
  onCancel
}: BillingInvoiceBuilderProps) => {
  // State
  const [invoiceData, setInvoiceData] = useState({
    patientName: invoice?.patientName || '',
    patientEmail: invoice?.patientEmail || '',
    patientPhone: invoice?.patientPhone || '',
    serviceDate: invoice?.serviceDate || new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate || '',
    notes: invoice?.notes || '',
    terms: invoice?.terms || 'Payment due within 30 days',
    lineItems: invoice?.lineItems || [
      {
        id: '1',
        description: '',
        category: 'consultation' as const,
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        taxRate: 0,
        total: 0
      }
    ],
    taxRate: 8.5,
    discountAmount: 0
  });

  /**
   * Formats currency amount
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  /**
   * Calculates line item total
   */
  const calculateLineItemTotal = (item: InvoiceLineItem) => {
    const subtotal = item.quantity * item.unitPrice - item.discount;
    const taxAmount = subtotal * (item.taxRate / 100);
    return subtotal + taxAmount;
  };

  /**
   * Updates line item
   */
  const updateLineItem = (index: number, field: keyof InvoiceLineItem, value: any) => {
    const updatedItems = [...invoiceData.lineItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate total
    updatedItems[index].total = calculateLineItemTotal(updatedItems[index]);
    
    setInvoiceData(prev => ({ ...prev, lineItems: updatedItems }));
  };

  /**
   * Adds new line item
   */
  const addLineItem = () => {
    const newItem: InvoiceLineItem = {
      id: Date.now().toString(),
      description: '',
      category: 'consultation',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: invoiceData.taxRate,
      total: 0
    };
    
    setInvoiceData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem]
    }));
  };

  /**
   * Removes line item
   */
  const removeLineItem = (index: number) => {
    if (invoiceData.lineItems.length > 1) {
      setInvoiceData(prev => ({
        ...prev,
        lineItems: prev.lineItems.filter((_, i) => i !== index)
      }));
    }
  };

  /**
   * Calculates invoice totals
   */
  const calculateTotals = () => {
    const subtotal = invoiceData.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalDiscount = invoiceData.lineItems.reduce((sum, item) => sum + item.discount, 0) + invoiceData.discountAmount;
    const taxableAmount = subtotal - totalDiscount;
    const taxAmount = invoiceData.lineItems.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice - item.discount;
      return sum + (itemSubtotal * (item.taxRate / 100));
    }, 0);
    const total = subtotal - totalDiscount + taxAmount;
    
    return {
      subtotal,
      totalDiscount,
      taxAmount,
      total
    };
  };

  const totals = calculateTotals();

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {invoice ? 'Edit Invoice' : 'Create New Invoice'}
                </h1>
                <p className="text-gray-600">
                  Build and customize invoice details
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <button
              onClick={() => onPreviewInvoice?.(invoiceData)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
            
            <button
              onClick={() => onSaveInvoice?.(invoiceData)}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white 
                       bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </button>
            
            <button
              onClick={() => onSendInvoice?.(invoiceData)}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                       bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" />
              Save & Send
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Invoice Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                  <input
                    id="patientName"
                    type="text"
                    value={invoiceData.patientName}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, patientName: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="patientEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    id="patientEmail"
                    type="email"
                    value={invoiceData.patientEmail}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, patientEmail: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="patientPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    id="patientPhone"
                    type="tel"
                    value={invoiceData.patientPhone}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, patientPhone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="serviceDate" className="block text-sm font-medium text-gray-700 mb-1">Service Date *</label>
                  <input
                    id="serviceDate"
                    type="date"
                    value={invoiceData.serviceDate}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, serviceDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Services & Line Items</h3>
                <button
                  onClick={addLineItem}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 
                           bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </button>
              </div>
              
              <div className="space-y-4">
                {invoiceData.lineItems.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      <div className="md:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          placeholder="Service description"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={item.category}
                          onChange={(e) => updateLineItem(index, 'category', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="consultation">Consultation</option>
                          <option value="treatment">Treatment</option>
                          <option value="medication">Medication</option>
                          <option value="supplies">Supplies</option>
                          <option value="equipment">Equipment</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 1)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                        <div className="text-sm font-medium text-gray-900 py-2">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                      
                      <div>
                        <button
                          onClick={() => removeLineItem(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                          disabled={invoiceData.lineItems.length === 1}
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes and Terms */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    id="notes"
                    value={invoiceData.notes}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    placeholder="Additional notes or special instructions"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                  <textarea
                    id="terms"
                    value={invoiceData.terms}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, terms: e.target.value }))}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Invoice Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Summary</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{formatCurrency(totals.subtotal)}</span>
                </div>
                
                {totals.totalDiscount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">-{formatCurrency(totals.totalDiscount)}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">{formatCurrency(totals.taxAmount)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
              
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  id="dueDate"
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingInvoiceBuilder;
