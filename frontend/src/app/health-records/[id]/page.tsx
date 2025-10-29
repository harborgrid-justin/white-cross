/**
 * Health Record Detail Page - White Cross Healthcare Platform (Next.js)
 * Detailed view of individual health record
 *
 * @module app/health-records/[id]/page
 * @version 1.0.0
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit, FileText, Calendar, User, Trash2, AlertTriangle } from 'lucide-react';

// UI Components
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/display/Badge';

// API Client
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';

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

export default function HealthRecordDetailPage() {
  const params = useParams();
  const recordId = params?.id as string;

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

        console.log('[HealthRecordDetail] API response:', response);

        // Handle different response structures
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/health-records">
            <Button variant="secondary" leftIcon={<ArrowLeft />}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Record</h1>
            <p className="mt-1 text-gray-600">
              {new Date(record.recordDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link href={`/health-records/${record.id}/edit`}>
            <Button leftIcon={<Edit />}>Edit Record</Button>
          </Link>
          <Button variant="destructive" leftIcon={<Trash2 />}>
            Delete
          </Button>
        </div>
      </div>

      {/* Student Information */}
      {record.student && (
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Student Information</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Student Name</p>
                <Link
                  href={`/students/${record.student.id}`}
                  className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  {record.student.firstName} {record.student.lastName}
                </Link>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Student Number</p>
                <p className="mt-1 text-sm text-gray-900">{record.student.studentNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Grade</p>
                <p className="mt-1 text-sm text-gray-900">{record.student.grade}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Record Details */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Record Details</h2>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Record Type</p>
              <div className="mt-1">
                <Badge variant="info">{record.recordType.replace('_', ' ')}</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Record Date</p>
              <div className="mt-1 flex items-center text-sm text-gray-900">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {new Date(record.recordDate).toLocaleDateString()}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Healthcare Provider</p>
              <p className="mt-1 text-sm text-gray-900">{record.provider || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Follow-up Required</p>
              <div className="mt-1">
                <Badge variant={record.followUpRequired ? 'warning' : 'success'}>
                  {record.followUpRequired ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </div>

          {record.followUpRequired && record.followUpDate && (
            <div>
              <p className="text-sm font-medium text-gray-500">Follow-up Date</p>
              <div className="mt-1 flex items-center text-sm text-gray-900">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {new Date(record.followUpDate).toLocaleDateString()}
              </div>
            </div>
          )}

          {record.description && (
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {record.description}
              </p>
            </div>
          )}

          {record.diagnosis && (
            <div>
              <p className="text-sm font-medium text-gray-500">Diagnosis</p>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{record.diagnosis}</p>
            </div>
          )}

          {record.treatment && (
            <div>
              <p className="text-sm font-medium text-gray-500">Treatment</p>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{record.treatment}</p>
            </div>
          )}

          {record.notes && (
            <div>
              <p className="text-sm font-medium text-gray-500">Additional Notes</p>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{record.notes}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Metadata */}
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

      {/* HIPAA Compliance Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <FileText className="h-5 w-5 text-blue-600 mr-2" />
          <div>
            <p className="text-sm font-medium text-blue-800">HIPAA Compliance</p>
            <p className="text-sm text-blue-700 mt-1">
              This health record contains Protected Health Information (PHI). Access and disclosure
              are logged for compliance purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
