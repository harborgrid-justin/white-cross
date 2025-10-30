/**
 * Health Record Detail Page - White Cross Healthcare Platform (Next.js)
 * Detailed view of individual health record
 *
 * @module app/health-records/[id]/page
 * @version 1.0.0
 */

'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/layout/Card';
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';
import {
  HealthRecordHeader,
  StudentInfoCard,
  RecordDetailsCard,
  HipaaComplianceNotice
} from '@/components/pages/HealthRecords';

interface HealthRecord {
  id: string;
  studentId: string;
  recordType: string;
  recordDate: string;
  provider?: string;
  description?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    grade: string;
    dateOfBirth: string;
  };
}

/**
 * Health Record Detail Page Component
 * 
 * Client component that displays detailed health record information using modular components.
 * Now refactored for better maintainability and reusability.
 * 
 * @param props.params - Promise that resolves to route parameters
 */
export default function HealthRecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: recordId } = use(params);
  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecord = async () => {
      if (!recordId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get<any>(
          API_ENDPOINTS.healthRecordById(recordId)
        );

        if (response.data && !Array.isArray(response.data)) {
          setRecord(response.data);
        } else {
          setRecord(response);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading health record:', err);
        setError(err instanceof Error ? err.message : 'Failed to load health record');
        setLoading(false);
      }
    };

    loadRecord();
  }, [recordId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading health record...</span>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Record</h3>
          <p className="text-gray-600 mb-4">{error || 'Health record not found'}</p>
          <Link href="/health-records">
            <Button variant="secondary">Back to Health Records</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HealthRecordHeader recordId={record.id} recordDate={record.recordDate} />

      {record.student && <StudentInfoCard student={record.student} />}

      <RecordDetailsCard record={record} />

      {/* Metadata Card */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Record Metadata</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(record.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(record.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <HipaaComplianceNotice />
    </div>
  );
}
