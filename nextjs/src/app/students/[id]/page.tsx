/**
 * Student Details Page - White Cross Healthcare Platform (Next.js)
 * Comprehensive view of individual student information
 *
 * @module app/students/[id]/page
 * @version 1.0.0
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  Calendar,
  FileText,
  AlertTriangle,
  Activity,
  Heart,
  Users,
} from 'lucide-react';

// UI Components
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/buttons/Button';
import { Badge } from '@/components/ui/display/Badge';

// API Client
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';

// Types
import type { Student } from '@/types/student.types';

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params?.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStudent = async () => {
      if (!studentId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get<Student>(
          API_ENDPOINTS.studentById(studentId)
        );

        setStudent(response);
        setLoading(false);
      } catch (err) {
        console.error('Error loading student:', err);
        setError(err instanceof Error ? err.message : 'Failed to load student');
        setLoading(false);
      }
    };

    loadStudent();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading student details...</span>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Student</h3>
          <p className="text-gray-600 mb-4">{error || 'Student not found'}</p>
          <Link href="/students">
            <Button variant="secondary">Back to Students</Button>
          </Link>
        </div>
      </div>
    );
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/students">
            <Button variant="secondary" leftIcon={<ArrowLeft />}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {student.firstName} {student.lastName}
            </h1>
            <p className="mt-1 text-gray-600">Student #{student.studentNumber}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link href={`/students/${student.id}/edit`}>
            <Button leftIcon={<Edit />}>Edit Student</Button>
          </Link>
          <Link href={`/health-records?studentId=${student.id}`}>
            <Button variant="secondary" leftIcon={<FileText />}>
              Health Records
            </Button>
          </Link>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(student.dateOfBirth).toLocaleDateString()} (Age:{' '}
                {calculateAge(student.dateOfBirth)})
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Gender</p>
              <p className="mt-1 text-sm text-gray-900">{student.gender}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Grade</p>
              <p className="mt-1 text-sm text-gray-900">{student.grade}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Enrollment Date</p>
              <p className="mt-1 text-sm text-gray-900">
                {student.enrollmentDate
                  ? new Date(student.enrollmentDate).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Medical Record Number</p>
              <p className="mt-1 text-sm text-gray-900">{student.medicalRecordNum || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <div className="mt-1">
                <Badge variant={student.isActive ? 'success' : 'error'}>
                  {student.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Emergency Contacts</h2>
            </div>
            <Link href={`/emergency-contacts?studentId=${student.id}`}>
              <Button variant="secondary" size="sm">
                Manage Contacts
              </Button>
            </Link>
          </div>
        </div>
        <div className="p-6">
          {student.emergencyContacts && student.emergencyContacts.length > 0 ? (
            <div className="space-y-4">
              {student.emergencyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {contact.firstName} {contact.lastName}
                      {contact.isPrimary && (
                        <Badge variant="info" className="ml-2">
                          Primary
                        </Badge>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{contact.relationship}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {contact.phoneNumber}
                      </div>
                      {contact.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {contact.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No emergency contacts on file</p>
          )}
        </div>
      </Card>

      {/* Medical Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Allergies */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Allergies</h2>
            </div>
          </div>
          <div className="p-6">
            {student.allergies && student.allergies.length > 0 ? (
              <div className="space-y-3">
                {student.allergies.map((allergy) => (
                  <div key={allergy.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{allergy.allergen}</p>
                        <p className="text-sm text-gray-600">{allergy.allergyType}</p>
                      </div>
                      <Badge
                        variant={
                          allergy.severity === 'LIFE_THREATENING'
                            ? 'error'
                            : allergy.severity === 'SEVERE'
                            ? 'warning'
                            : 'info'
                        }
                      >
                        {allergy.severity}
                      </Badge>
                    </div>
                    {allergy.reaction && (
                      <p className="mt-2 text-sm text-gray-600">Reaction: {allergy.reaction}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No known allergies</p>
            )}
          </div>
        </Card>

        {/* Chronic Conditions */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Heart className="h-5 w-5 text-red-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Chronic Conditions</h2>
            </div>
          </div>
          <div className="p-6">
            {student.chronicConditions && student.chronicConditions.length > 0 ? (
              <div className="space-y-3">
                {student.chronicConditions.map((condition) => (
                  <div key={condition.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="font-medium text-gray-900">{condition.conditionName}</p>
                    {condition.notes && (
                      <p className="mt-1 text-sm text-gray-600">{condition.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No chronic conditions</p>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href={`/health-records?studentId=${student.id}`}
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
            >
              <FileText className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Health Records</p>
                <p className="text-sm text-gray-600">View all records</p>
              </div>
            </Link>

            <Link
              href={`/appointments?studentId=${student.id}`}
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
            >
              <Calendar className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Appointments</p>
                <p className="text-sm text-gray-600">Schedule visit</p>
              </div>
            </Link>

            <Link
              href={`/medications?studentId=${student.id}`}
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200"
            >
              <Activity className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Medications</p>
                <p className="text-sm text-gray-600">Manage meds</p>
              </div>
            </Link>

            <Link
              href={`/incident-reports?studentId=${student.id}`}
              className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
            >
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Incidents</p>
                <p className="text-sm text-gray-600">View reports</p>
              </div>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
