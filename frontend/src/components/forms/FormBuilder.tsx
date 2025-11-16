'use client';

/**
 * FormBuilder component
 *
 * @module components/forms/FormBuilder
 * @description Professional drag-and-drop page builder interface with modern UX patterns
 */

import React from 'react';
import { PageBuilderLayout } from '@/components/page-builder';

interface FormBuilderProps {
  /** Form ID (undefined for new form) */
  formId?: string;

  /** On save success */
  onSaveSuccess?: (formId: string) => void;
}

export function FormBuilder({ formId, onSaveSuccess }: FormBuilderProps) {
  const handleSave = (pageData: any) => {
    console.log('Saving page:', pageData);
    // TODO: Implement save logic with server action
    onSaveSuccess?.(formId || 'new-form-id');
  };

  const handlePublish = (pageData: any) => {
    console.log('Publishing page:', pageData);
    // TODO: Implement publish logic
  };

  return (
    <PageBuilderLayout
      initialPageData={undefined}
      onSave={handleSave}
      onPublish={handlePublish}
    />
  );
}
