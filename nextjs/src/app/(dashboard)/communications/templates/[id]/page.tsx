/**
 * Template Detail Page
 *
 * View and edit template
 */

import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Template | Communications',
  description: 'View template details'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

interface TemplateDetailPageProps {
  params: {
    id: string;
  };
}

export default function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  // For now, redirect to templates list
  // Can be implemented as a detail view later
  redirect('/communications/templates');
}
