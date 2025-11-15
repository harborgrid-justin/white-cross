/**
 * @fileoverview Student Health Records Page
 * @module app/(dashboard)/students/[id]/health-records/page
 * @category Students - Health Records
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getStudent } from '@/lib/actions/students.actions';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import { 
  getStudentHealthSummary, 
  transformHealthRecordsForDisplay,
  getAllergySeverityProps
} from '@/lib/services/health';

/**
 * Generate page metadata
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const student = await getStudent(id);

  if (!student) {
    return {
      title: 'Student Not Found | White Cross Healthcare'
    };
  }

  return {
    title: `Health Records - ${student.firstName} ${student.lastName} | White Cross Healthcare`,
    description: `Health records for ${student.firstName} ${student.lastName} - Grade ${student.grade}`
  };
}

interface HealthRecordsPageProps {
  params: Promise<{
    id: string;
  }>;
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

function getSeverityColor(severity: string) {
  const props = getAllergySeverityProps(severity);
  return props.className;
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

export default async function HealthRecordsPage({ params }: HealthRecordsPageProps) {
  // Access params to satisfy Next.js uncached data requirement
  const { id } = await params;
  
  // Fetch the actual student data
  const student = await getStudent(id);
  
  // Handle not found
  if (!student) {
    notFound();
  }
  
  // Fetch real health data
  let healthData;
  try {
    healthData = await getStudentHealthSummary(id);
  } catch (error) {
    console.error('Error loading health data:', error);
    // Fallback to empty data structure
    healthData = {
      allergies: [],
      medications: [],
      healthRecords: [],
      summary: {
        totalRecords: 0,
        totalAllergies: 0,
        totalMedications: 0,
        recentVisits: 0
      }
    };
  }
  
  // Transform health records for display
  const { appointments, conditions } = transformHealthRecordsForDisplay(healthData.healthRecords || []);
  const { allergies, medications } = healthData;

  return (
    <>
      <PageHeader
        title={`Health Records - ${student.firstName} ${student.lastName}`}
        description={`${student.studentNumber ? `Student ID: ${student.studentNumber} • ` : ''}Grade ${student.grade} • Age: ${calculateAge(student.dateOfBirth)}`}
        actions={
          <div className="flex gap-2">
            <Link href={`/students/${id}`}>
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
                <p className="text-2xl font-bold text-red-600">{allergies?.length || 0}</p>
                <p className="text-sm text-red-700">Allergies</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Pill className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{medications?.length || 0}</p>
                <p className="text-sm text-blue-700">Medications</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <FileText className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{conditions?.length || 0}</p>
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
            {(allergies?.length || 0) > 0 ? (
              <div className="space-y-4">
                {(allergies || []).map((allergy) => (
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
                        <p className="font-medium">{allergy.symptoms || allergy.reaction || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Treatment:</p>
                        <p className="font-medium">{allergy.treatment || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Diagnosed:</p>
                        <p className="font-medium">{allergy.diagnosedDate ? new Date(allergy.diagnosedDate).toLocaleDateString() : 'Unknown'}</p>
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
            {(medications?.length || 0) > 0 ? (
              <div className="space-y-4">
                {(medications || []).map((studentMed) => {
                  const medication = studentMed.medication || studentMed;
                  return (
                    <div key={studentMed.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">{medication.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Dosage:</p>
                          <p className="font-medium">{studentMed.dosage}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Frequency:</p>
                          <p className="font-medium">{studentMed.frequency}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Prescribed by:</p>
                          <p className="font-medium">{studentMed.prescribedBy}</p>
                        </div>
                        <div className="md:col-span-3">
                          <p className="text-gray-600">Instructions:</p>
                          <p className="font-medium">{studentMed.instructions || 'No special instructions'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
            {(conditions?.length || 0) > 0 ? (
              <div className="space-y-4">
                {(conditions || []).map((condition) => (
                  <div key={condition.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{condition.diagnosis || condition.condition || condition.title}</h3>
                      <Badge className={getSeverityColor('MODERATE')}>
                        {'MODERATE'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Diagnosed:</p>
                        <p className="font-medium">{condition.recordDate ? new Date(condition.recordDate).toLocaleDateString() : condition.diagnosedDate ? new Date(condition.diagnosedDate).toLocaleDateString() : 'Unknown'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-600">Management Plan:</p>
                        <p className="font-medium">{condition.treatment || condition.managementPlan || condition.description || 'No management plan specified'}</p>
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
            {(appointments?.length || 0) > 0 ? (
              <div className="space-y-4">
                {(appointments || []).map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{appointment.title || appointment.type || appointment.recordType}</h3>
                      <span className="text-sm text-gray-500">
                        {appointment.recordDate ? new Date(appointment.recordDate).toLocaleDateString() : appointment.date ? new Date(appointment.date).toLocaleDateString() : 'No date'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-600">Provider: <span className="font-medium">{appointment.provider || 'Unknown'}</span></p>
                      <p className="text-gray-600 mt-1">Notes:</p>
                      <p className="font-medium">{appointment.notes || appointment.description || 'No notes available'}</p>
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
