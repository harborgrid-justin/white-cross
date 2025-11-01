/**
 * New Template Page
 *
 * Create a new template
 */

import React from 'react';
import { Metadata } from 'next';
import { NewTemplateContent } from './_components/NewTemplateContent';

export const metadata: Metadata = {
  title: 'New Template | Communications',
  description: 'Create a new message template'
};



export default function NewTemplatePage() {
  return <NewTemplateContent />;
}
