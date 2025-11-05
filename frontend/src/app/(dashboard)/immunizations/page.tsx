/**
 * @fileoverview Immunizations Dashboard - CDC-Compliant Vaccine Management System
 * @module app/(dashboard)/immunizations/page
 * @category Healthcare - Immunizations
 *
 * Production-grade immunization management dashboard providing comprehensive vaccine tracking,
 * CDC/ACIP compliance monitoring, and healthcare regulatory compliance with beautiful UI.
 *
 * **Healthcare Management Features:**
 * - Real-time immunization compliance tracking with visual indicators
 * - CDC-compliant vaccination schedule management
 * - VAERS adverse event reporting and monitoring
 * - VIS (Vaccine Information Statement) compliance tracking
 * - State immunization registry integration
 * - Automated compliance alerts and reminders
 *
 * **Dashboard Components:**
 * - Interactive statistics cards with real-time updates
 * - Quick action navigation for common immunization tasks
 * - Visual compliance overview with color-coded status indicators
 * - Recent activity timeline and upcoming deadlines
 * - Advanced filtering and search capabilities
 *
 * **Production Features:**
 * - HIPAA-compliant data handling with audit logging
 * - Role-based access control for healthcare staff
 * - Comprehensive error handling and loading states
 * - Mobile-responsive design for clinical workflows
 * - Real-time updates via WebSocket integration
 *
 * **Integration Points:**
 * - Student health records system integration
 * - Inventory management for vaccine stock tracking
 * - Reporting system for compliance documentation
 * - Communication system for parent/guardian notifications
 *
 * @requires Authentication - Healthcare professional role required
 * @requires Permissions - VIEW_IMMUNIZATIONS, MANAGE_IMMUNIZATIONS
 *
 * @see {@link https://www.cdc.gov/vaccines/schedules/index.html | CDC Vaccination Schedules}
 * @see {@link https://www.cdc.gov/vaccines/hcp/vis/index.html | Vaccine Information Statements}
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ImmunizationsContent } from './_components/ImmunizationsContent';

export const metadata: Metadata = {
  title: 'Immunization Management | White Cross Healthcare',
  description: 'Comprehensive immunization management dashboard with CDC-compliant vaccine tracking, compliance monitoring, real-time analytics, and healthcare regulatory compliance.',
  keywords: [
    'immunization management',
    'vaccine tracking',
    'CDC compliance',
    'vaccination schedules',
    'VAERS reporting',
    'healthcare compliance',
    'student health',
    'vaccine inventory',
    'immunization records',
    'vaccination compliance'
  ],
};

interface ImmunizationsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    vaccineType?: string;
    studentId?: string;
    dateFrom?: string;
    dateTo?: string;
    compliance?: string;
    priority?: string;
  };
}

/**
 * Immunizations Dashboard - Main page component
 */
export default function ImmunizationsPage({ searchParams }: ImmunizationsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading immunizations dashboard...</div>}>
        <ImmunizationsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}



