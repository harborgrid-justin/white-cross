import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  FileText,
  User,
  Calendar,
  Stethoscope,
  Building2,
  ClipboardList,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { serverGet } from '@/lib/api/nextjs-client';
import type { ApiResponse } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Fetch health record from backend using our API client
async function getHealthRecord(id: string) {
  try {
    // Use serverGet which handles authentication automatically
    const wrappedResponse = await serverGet<ApiResponse<any>>(
      `/health-record/${id}`,
      undefined,
      {
        cache: 'no-store', // Don't cache for fresh data
      }
    );

    // Extract the health record from the wrapped response
    return wrappedResponse?.data || null;
  } catch (error) {
    console.error('Error fetching health record:', error);
    return null;
  }
}

// Loading skeleton component for the health record detail page
function HealthRecordDetailSkeleton() {
  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-16" />
          <div>
            <Skeleton className="h-8 w-80 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </Card>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <Card className="p-6">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </Card>
          <Card className="p-6">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Async component that fetches the health record data
async function HealthRecordDetailContent({ id }: { id: string }) {
  const record = await getHealthRecord(id);

  if (!record) {
    notFound();
  }

  const getRecordTypeDisplay = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/health-records">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{record.title}</h1>
            <p className="text-gray-600 mt-1">
              {record.student.firstName} {record.student.lastName} • {getRecordTypeDisplay(record.recordType)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/health-records/${id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="outline" className="text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Record Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Record Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="mt-1 text-gray-900">{record.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Record Type</label>
                  <p className="mt-1 text-gray-900">{getRecordTypeDisplay(record.recordType)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Record Date</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(record.recordDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {record.isConfidential && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-900">Confidential Record</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    This record contains sensitive information and should be handled with care.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Medical Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Medical Information</h2>
            </div>

            <div className="space-y-4">
              {record.diagnosis && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Diagnosis</label>
                  <p className="mt-1 text-gray-900">{record.diagnosis}</p>
                  {record.diagnosisCode && (
                    <p className="mt-1 text-sm text-gray-600">Code: {record.diagnosisCode}</p>
                  )}
                </div>
              )}

              {record.treatment && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Treatment</label>
                  <p className="mt-1 text-gray-900">{record.treatment}</p>
                </div>
              )}

              {record.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Additional Notes</label>
                  <p className="mt-1 text-gray-900">{record.notes}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Follow-up Information */}
          {record.followUpRequired && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Follow-up</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Follow-up Required</label>
                    <p className="mt-1 text-gray-900">
                      {record.followUpDate ? (
                        <>
                          Scheduled for {new Date(record.followUpDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </>
                      ) : (
                        'Date to be scheduled'
                      )}
                    </p>
                  </div>
                  {record.followUpCompleted ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Student</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="mt-1 text-gray-900">
                  {record.student.firstName} {record.student.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Student ID</label>
                <p className="mt-1 text-sm text-gray-700 font-mono">{record.studentId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="mt-1 text-gray-900">
                  {new Date(record.student.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Provider Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Provider</h2>
            </div>

            <div className="space-y-3">
              {record.provider && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Provider Name</label>
                  <p className="mt-1 text-gray-900">{record.provider}</p>
                </div>
              )}
              {record.providerNpi && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Provider NPI</label>
                  <p className="mt-1 text-sm text-gray-700 font-mono">{record.providerNpi}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Facility Information */}
          {record.facility && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Facility</h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Facility Name</label>
                  <p className="mt-1 text-gray-900">{record.facility}</p>
                </div>
                {record.facilityNpi && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Facility NPI</label>
                    <p className="mt-1 text-sm text-gray-700 font-mono">{record.facilityNpi}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Record Metadata */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Record Details</h2>

            <div className="space-y-3 text-sm">
              <div>
                <label className="font-medium text-gray-600">Record ID</label>
                <p className="mt-1 text-gray-700 font-mono break-all">{record.id}</p>
              </div>
              <div>
                <label className="font-medium text-gray-600">Created</label>
                <p className="mt-1 text-gray-700">
                  {new Date(record.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="font-medium text-gray-600">Last Updated</label>
                <p className="mt-1 text-gray-700">
                  {new Date(record.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default async function HealthRecordDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!id || id === 'undefined' || id === 'null') {
    notFound();
  }

  return (
    <Suspense fallback={<HealthRecordDetailSkeleton />}>
      <HealthRecordDetailContent id={id} />
    </Suspense>
  );
}
