'use client';

/**
 * Student Detail Page - Next.js App Router
 *
 * Migrated from frontend/src/pages/students/StudentHealthRecords.tsx
 *
 * Displays detailed information about a specific student including:
 * - Demographics
 * - Emergency contacts
 * - Health records
 * - Medications
 * - Appointments
 * - Incident reports
 *
 * @remarks
 * Dynamic route: /students/[id]
 * Client Component for interactivity
 */

import { use } from 'react';
import StudentHealthRecords from '@/pages-old/students/StudentHealthRecords';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StudentDetailPage({ params }: PageProps) {
  const { id } = use(params);

  return <StudentHealthRecords studentId={id} />;
}
