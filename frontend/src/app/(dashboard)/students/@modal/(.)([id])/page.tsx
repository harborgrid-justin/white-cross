import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { API_ENDPOINTS } from '@/lib/api-client';

interface ModalStudentPageProps {
  params: Promise<{ id: string }>;
}

interface StudentData {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  school?: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  medicalInfo?: {
    allergies: string[];
    medications: string[];
    conditions: string[];
  };
  emergencyContacts?: Array<{
    name: string;
    relationship: string;
    phone: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fetch student details for modal
 */
async function fetchStudentDetails(id: string): Promise<StudentData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const url = `${baseUrl}${API_ENDPOINTS.STUDENTS.BY_ID(id)}`;
  
  try {
    const response = await fetch(url, {
      next: {
        revalidate: 300, // Cache for 5 minutes
        tags: ['students', `student-${id}`],
      },
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.API_KEY && { 'x-api-key': process.env.API_KEY }),
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch student: ${response.status}`);
    }

    const student = await response.json();
    return student;

  } catch (error) {
    console.error('Error fetching student details:', error);
    return null;
  }
}

function StudentDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: StudentData['status'] }) {
  const statusConfig = {
    active: { color: 'bg-green-100 text-green-800', label: 'Active' },
    inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
    graduated: { color: 'bg-blue-100 text-blue-800', label: 'Graduated' },
    transferred: { color: 'bg-yellow-100 text-yellow-800', label: 'Transferred' },
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Modal page component for student details
 */
export default async function ModalStudentPage({ params }: ModalStudentPageProps) {
  const { id } = await params;
  const student = await fetchStudentDetails(id);

  if (!student) {
    notFound();
  }

  // Type assertion after null check - student is guaranteed to be non-null here
  const safeStudent = student as StudentData;

  return (
    <Modal>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {safeStudent.firstName} {safeStudent.lastName}
            </CardTitle>
            <StatusBadge status={safeStudent.status} />
          </div>
          <p className="text-sm text-gray-600">
            Student ID: {safeStudent.studentId} • Grade {safeStudent.grade}
          </p>
        </CardHeader>

        <CardContent>
          <Suspense fallback={<StudentDetailsSkeleton />}>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="text-base text-gray-900">
                    {formatDate(safeStudent.dateOfBirth)} (Age {calculateAge(safeStudent.dateOfBirth)})
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">School</label>
                  <p className="text-base text-gray-900">
                    {safeStudent.school || 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-base text-gray-900">
                    {safeStudent.email || 'Not provided'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-base text-gray-900">
                    {safeStudent.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Medical Information */}
              {safeStudent.medicalInfo && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Medical Information</h3>

                  {safeStudent.medicalInfo.allergies && safeStudent.medicalInfo.allergies.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-red-600">Allergies</label>
                      <p className="text-base text-gray-900">
                        {safeStudent.medicalInfo.allergies.join(', ')}
                      </p>
                    </div>
                  )}

                  {safeStudent.medicalInfo.medications && safeStudent.medicalInfo.medications.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-blue-600">Medications</label>
                      <p className="text-base text-gray-900">
                        {safeStudent.medicalInfo.medications.join(', ')}
                      </p>
                    </div>
                  )}

                  {safeStudent.medicalInfo.conditions && safeStudent.medicalInfo.conditions.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-orange-600">Conditions</label>
                      <p className="text-base text-gray-900">
                        {safeStudent.medicalInfo.conditions.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Emergency Contacts */}
              {safeStudent.emergencyContacts && safeStudent.emergencyContacts.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600 border-b pb-2 block mb-3">Emergency Contacts</label>
                  <div className="space-y-2">
                    {safeStudent.emergencyContacts.map((contact, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.relationship}</p>
                        <p className="text-sm text-blue-600">{contact.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                {safeStudent.createdAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Enrolled</label>
                    <p className="text-sm text-gray-700">
                      {new Date(safeStudent.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {safeStudent.updatedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Updated</label>
                    <p className="text-sm text-gray-700">
                      {new Date(safeStudent.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <a
                  href={`/students/${safeStudent.id}/edit`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  Edit Student
                </a>

                <a
                  href={`/students/${safeStudent.id}`}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                >
                  Full Profile
                </a>

                <a
                  href={`/health-records?studentId=${safeStudent.id}`}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  Health Records
                </a>
              </div>
            </div>
          </Suspense>
        </CardContent>
      </Card>
    </Modal>
  );
}