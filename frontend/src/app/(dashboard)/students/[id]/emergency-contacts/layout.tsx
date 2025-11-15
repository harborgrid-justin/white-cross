/**
 * Emergency Contacts Layout
 * Layout for emergency contact management pages
 *
 * @module app/students/[id]/emergency-contacts/layout
 */

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

/**
 * Generate metadata for emergency contacts pages
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Emergency Contacts | White Cross Healthcare',
    description: 'Manage student emergency contacts'
  };
}

/**
 * Emergency Contacts Layout
 */
export default async function EmergencyContactsLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Link
            href="/students"
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Students
          </Link>
          <span>/</span>
          <Link
            href={`/students/${id}`}
            className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Student Details
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            Emergency Contacts
          </span>
        </div>
      </nav>

      {children}
    </div>
  );
}