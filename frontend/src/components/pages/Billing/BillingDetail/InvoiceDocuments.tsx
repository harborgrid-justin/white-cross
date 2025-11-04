'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import type { InvoiceDocumentsProps } from './types';

/**
 * InvoiceDocuments Component
 *
 * Displays and manages related documents for an invoice including uploads,
 * downloads, and document metadata.
 *
 * @param props - InvoiceDocuments component props
 * @returns JSX element representing the invoice documents
 */
const InvoiceDocuments: React.FC<InvoiceDocumentsProps> = ({ invoice }) => {
  // TODO: Implement document management when backend API is available
  // This component will support:
  // - List of related documents
  // - Document upload functionality
  // - Document download/view
  // - Document metadata (name, size, upload date, user)

  return (
    <div className="text-center py-12">
      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600">Related documents will be displayed here.</p>
      <p className="text-sm text-gray-500 mt-2">
        Upload, view, and manage invoice-related documents
      </p>
    </div>
  );
};

export default InvoiceDocuments;
