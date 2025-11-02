/**
 * @fileoverview Student Health Records Page
 * @module app/(dashboard)/students/[id]/health-records/page
 * @category Students - Health Records
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  AlertTriangle,
  Pill,
  Heart,
  Calendar,
  User,
  Download
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Health Records | White Cross',
  description: 'Student health records and medical information',
};

interface HealthRecordsPageProps {
  params: {
    id: string;
  };
}

function HealthRecordsSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Mock data for demonstration - in a real app, this would come from the API
const mockHealthData = {
  student: {
    id: '6a5bbad4-4816-4686-927c-68ddf16ad483',
    firstName: 'John',
    lastName: 'Doe',
    studentNumber: 'STU-2024-001',
    grade: '10th',
    dateOfBirth: '2008-05-15'
  },
  allergies: [
    {
      id: '1',
      allergen: 'Peanuts',
      severity: 'SEVERE',
      reaction: 'Anaphylaxis',
      diagnosedDate: '2020-03-15',
      treatment: 'EpiPen available'
    },
    {
      id: '2',
      allergen: 'Shellfish',
      severity: 'MODERATE',
      reaction: 'Hives, swelling',
      diagnosedDate: '2021-08-22',
      treatment: 'Antihistamines'
    }
  ],
  medications: [
    {
      id: '1',
      name: 'Albuterol Inhaler',
      dosage: '2 puffs',
      frequency: 'As needed',
      startDate: '2023-09-01',
      prescribedBy: 'Dr. Smith',
      instructions: 'Use for asthma symptoms'
    }
  ],
  conditions: [
    {
      id: '1',
      condition: 'Asthma',
      severity: 'MILD',
      diagnosedDate: '2019-11-10',
      managementPlan: 'Inhaler as needed, avoid triggers'
    }
  ],
  appointments: [
    {
      id: '1',
      date: '2024-10-15',
      type: 'Regular Checkup',
      provider: 'School Nurse',
      notes: 'All vitals normal'
    },
    {
      id: '2',
      date: '2024-09-20',
      type: 'Allergy Review',
      provider: 'Dr. Johnson',
      notes: 'Allergy action plan updated'
    }
  ]
};

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'SEVERE':
    case 'LIFE_THREATENING':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'MODERATE':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'MILD':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function calculateAge(dateOfBirth: string): number {
  // Static calculation to avoid Next.js prerendering issues
  const birthYear = new Date(dateOfBirth).getFullYear();
  const currentYear = 2024; // Static year to avoid new Date() issues
  return currentYear - birthYear;
}

export default async function HealthRecordsPage({ params }: HealthRecordsPageProps) {
  // Access params to satisfy Next.js uncached data requirement
  const { id } = await params;
  const { student, allergies, medications, conditions, appointments } = mockHealthData;

  return (
    <>
      <PageHeader
        title={`Health Records - ${student.firstName} ${student.lastName}`}
        description={`Student ID: ${student.studentNumber} • ${student.grade} Grade • Age: ${calculateAge(student.dateOfBirth)}`}
        actions={
          <div className="flex gap-2">
            <Link href={`/students/${params.id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Records
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Health Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Health Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">{allergies.length}</p>
                <p className="text-sm text-red-700">Allergies</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Pill className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{medications.length}</p>
                <p className="text-sm text-blue-700">Medications</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <FileText className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{conditions.length}</p>
                <p className="text-sm text-purple-700">Conditions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Allergies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Allergies
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allergies.length > 0 ? (
              <div className="space-y-4">
                {allergies.map((allergy) => (
                  <div key={allergy.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{allergy.allergen}</h3>
                      <Badge className={getSeverityColor(allergy.severity)}>
                        {allergy.severity}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Reaction:</p>
                        <p className="font-medium">{allergy.reaction}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Treatment:</p>
                        <p className="font-medium">{allergy.treatment}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Diagnosed:</p>
                        <p className="font-medium">{new Date(allergy.diagnosedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No allergies recorded</p>
            )}
          </CardContent>
        </Card>

        {/* Medications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-blue-500" />
              Current Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {medications.length > 0 ? (
              <div className="space-y-4">
                {medications.map((medication) => (
                  <div key={medication.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">{medication.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Dosage:</p>
                        <p className="font-medium">{medication.dosage}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Frequency:</p>
                        <p className="font-medium">{medication.frequency}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Prescribed by:</p>
                        <p className="font-medium">{medication.prescribedBy}</p>
                      </div>
                      <div className="md:col-span-3">
                        <p className="text-gray-600">Instructions:</p>
                        <p className="font-medium">{medication.instructions}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No medications recorded</p>
            )}
          </CardContent>
        </Card>

        {/* Medical Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-500" />
              Medical Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {conditions.length > 0 ? (
              <div className="space-y-4">
                {conditions.map((condition) => (
                  <div key={condition.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{condition.condition}</h3>
                      <Badge className={getSeverityColor(condition.severity)}>
                        {condition.severity}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Diagnosed:</p>
                        <p className="font-medium">{new Date(condition.diagnosedDate).toLocaleDateString()}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600">Management Plan:</p>
                        <p className="font-medium">{condition.managementPlan}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No medical conditions recorded</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              Recent Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{appointment.type}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(appointment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-600">Provider: <span className="font-medium">{appointment.provider}</span></p>
                      <p className="text-gray-600 mt-1">Notes:</p>
                      <p className="font-medium">{appointment.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No appointments recorded</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
