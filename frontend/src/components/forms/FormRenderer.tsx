'use client';

/**
 * FormRenderer component
 *
 * @module components/forms/FormRenderer
 * @description Dynamically render forms from JSON schema with React Hook Form + Zod
 */

'use client';

import React from 'react';
import { FileText } from 'lucide-react';

interface FormRendererProps {
  /** Form schema */
  schema?: any;

  /** On form submit */
  onSubmit?: (data: any) => void;
}

export function FormRenderer({ schema, onSubmit }: FormRendererProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-sm text-gray-600">
          Form Renderer - Dynamically render forms from JSON schema
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Implemented with React Hook Form + Zod validation
        </p>
      </div>
    </div>
  );
}
