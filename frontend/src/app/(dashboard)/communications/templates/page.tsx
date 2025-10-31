/**
 * Templates Page
 *
 * View and manage message templates
 */

import React from 'react';
import { Metadata } from 'next';
import { TemplatesContent } from './_components/TemplatesContent';

export const metadata: Metadata = {
  title: 'Templates | Communications',
  description: 'Manage message and broadcast templates'
};

// Force dynamic rendering due to auth requirements
export const dynamic = 'force-dynamic';

export default function TemplatesPage() {
  return <TemplatesContent />;
}
