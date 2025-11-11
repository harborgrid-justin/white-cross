'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle,
  X,
  Eye,
  DollarSign,
  Tag,
  History,
  FileText,
  Share2,
  Trash2
} from 'lucide-react';
import { BillingInvoice, PaymentRecord, InvoiceLineItem } from './BillingCard';
import { BillingDetailProps, BillingDetailTab, TabConfig } from './BillingDetail/types';
import { TAB_CONFIGS } from './BillingDetail/utils';
import OverviewTab from './BillingDetail/OverviewTab';
import PaymentsTab from './BillingDetail/PaymentsTab';
import ServicesTab from './BillingDetail/ServicesTab';

/**
 * BillingDetail Component
 * 
 * A comprehensive detail view component for billing invoices with tabbed interface,
 * complete invoice information, payment tracking, service breakdown, and document
 * management. Features full CRUD operations and workflow support.
 * 
 * @param props - BillingDetail component props
 * @returns JSX element representing the detailed billing invoice view
 */
const BillingDetail = ({
  invoice,
  loading = false,
  activeTab = 'overview',
  className = '',
  onTabChange,
  onEditInvoice,
  onDeleteInvoice,
  onDownloadInvoice,
  onSendInvoice,
  onPrintInvoice,
  onShareInvoice,
  onRecordPayment,
  onEditPayment,
  onDeletePayment,
  onAddService,
  onEditService,
  onDeleteService,
  onViewPatient,
  onViewProvider,
  onBack
}: BillingDetailProps) => {
  // State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Invoice Not Found</h3>
          <p className="text-gray-600">The requested invoice could not be found.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as BillingDetailTab, label: 'Overview', icon: Eye },
    { id: 'payments' as BillingDetailTab, label: 'Payments', icon: DollarSign },
    { id: 'services' as BillingDetailTab, label: 'Services', icon: Tag },
    { id: 'history' as BillingDetailTab, label: 'History', icon: History },
    { id: 'documents' as BillingDetailTab, label: 'Documents', icon: FileText }
  ];

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
                aria-label="Go back"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Invoice #{invoice.invoiceNumber}
              </h1>
              <p className="text-sm text-gray-600">
                Issued {new Date(invoice.issueDate).toLocaleDateString()} • 
                Service {new Date(invoice.serviceDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onShareInvoice?.(invoice)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
              aria-label="Share invoice"
            >
              <Share2 className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-400 hover:text-red-600 rounded-md"
              aria-label="Delete invoice"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <OverviewTab
            invoice={invoice}
            onEditInvoice={onEditInvoice}
            onDownloadInvoice={onDownloadInvoice}
            onPrintInvoice={onPrintInvoice}
            onSendInvoice={onSendInvoice}
            onRecordPayment={onRecordPayment}
            onViewPatient={onViewPatient}
          />
        )}
        {activeTab === 'payments' && (
          <PaymentsTab
            invoice={invoice}
            onRecordPayment={onRecordPayment}
            onEditPayment={onEditPayment}
            onDeletePayment={onDeletePayment}
          />
        )}
        {activeTab === 'services' && (
          <ServicesTab
            invoice={invoice}
            onAddService={onAddService}
            onEditService={onEditService}
            onDeleteService={onDeleteService}
          />
        )}
        {activeTab === 'history' && (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Invoice history will be displayed here.</p>
          </div>
        )}
        {activeTab === 'documents' && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Related documents will be displayed here.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Invoice
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete invoice #{invoice.invoiceNumber}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    onDeleteInvoice?.(invoice);
                    setShowDeleteConfirm(false);
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingDetail;
