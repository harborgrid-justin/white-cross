/**
 * Templates Page
 *
 * View and manage message templates
 */

import React from 'react';
import { Metadata } from 'next';
import { TemplatesContent } from './TemplatesContent';

export const metadata: Metadata = {
  title: 'Templates | Communications',
  description: 'Manage message and broadcast templates'
};

export default function TemplatesPage() {
  return <TemplatesContent />;
}
