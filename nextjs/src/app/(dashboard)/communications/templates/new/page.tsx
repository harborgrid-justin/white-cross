/**
 * New Template Page
 *
 * Create a new template
 */

import React from 'react';
import { Metadata } from 'next';
import { NewTemplateContent } from './NewTemplateContent';

export const metadata: Metadata = {
  title: 'New Template | Communications',
  description: 'Create a new message template'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function NewTemplatePage() {
  return <NewTemplateContent />;
}
