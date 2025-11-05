/**
 * @fileoverview Student Immunization Detail Page - Dynamic Route Implementation
 * @module app/(dashboard)/immunizations/student/[studentId]/page
 * @category Healthcare - Student Records
 *
 * Dynamic route for viewing individual student immunization records and compliance status.
 * Implements Next.js routing patterns with searchParams and dynamic segments.
 */

import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, CheckCircle, Clock, AlertTriangle, Plus, FileText, Edit, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Define the PageProps using Next.js route props helpers pattern
interface StudentImmunizationPageProps {
  params: Promise<{ studentId: string }>;
  searchParams: Promise<{ 
    tab?: string;
    filter?: string;
    view?: 'timeline' | 'grid' | 'list';
    status?: 'all' | 'complete' | 'overdue' | 'upcoming';
  }>;
}

// Generate metadata for SEO and page title
export async function generateMetadata(
  { params }: StudentImmunizationPageProps
): Promise<Metadata> {
  const { studentId } = await params;
  
  // In production, this would fetch student data
  // const student = await getStudentById(studentId);
  
  return {
    title: `Student Immunizations - ${studentId}`,
    description: `Immunization records and compliance status for student ${studentId}`,
  };
}

// Mock data - in production this would come from the backend
const getStudentImmunizationData = async (studentId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    student: {
      id: studentId,
      name: 'Emma Johnson',
      grade: '3rd Grade',
      dateOfBirth: '2015-08-15',
      allergies: ['Eggs'],
      medicalNotes: 'No known adverse reactions to vaccines'
    },
    immunizations: [
      {
        id: 'imm-001',
        vaccineName: 'COVID-19 (Pfizer)',
        vaccineType: 'covid19',
        status: 'administered',
        dateAdministered: '2024-09-15',
        nextDue: null,
        administeredBy: 'Nurse Johnson',
        lotNumber: 'COVID-2024-A',
        site: 'Left deltoid',
        notes: 'No adverse reactions observed'
      },
      {
        id: 'imm-002',
        vaccineName: 'Influenza (Quadrivalent)',
        vaccineType: 'flu',
        status: 'administered',
        dateAdministered: '2024-10-01',
        nextDue: '2025-10-01',
        administeredBy: 'Nurse Smith',
        lotNumber: 'FLU-2024-B',
        site: 'Right deltoid',
        notes: 'Seasonal flu vaccine - annual requirement'
      },
      {
        id: 'imm-003',
        vaccineName: 'MMR (Measles, Mumps, Rubella)',
        vaccineType: 'mmr',
        status: 'overdue',
        dateAdministered: null,
        nextDue: '2024-08-01',
        administeredBy: null,
        lotNumber: null,
        site: null,
        notes: 'Second dose required for school entry'
      },
      {
        id: 'imm-004',
        vaccineName: 'Tdap (Tetanus, Diphtheria, Pertussis)',
        vaccineType: 'tdap',
        status: 'upcoming',
        dateAdministered: null,
        nextDue: '2024-12-15',
        administeredBy: null,
        lotNumber: null,
        site: null,
        notes: 'Due for routine booster'
      }
    ],
    complianceStatus: {
      overall: 'warning',
      completeCount: 2,
      overdueCount: 1,
      upcomingCount: 1,
      totalRequired: 4
    }
  };
};

// Loading component for Suspense boundary
function StudentImmunizationSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}

// Main content component
async function StudentImmunizationContent({ 
  studentId, 
  searchParams 
}: { 
  studentId: string;
  searchParams: Awaited<StudentImmunizationPageProps['searchParams']>;
}) {
  const data = await getStudentImmunizationData(studentId);
  const { view = 'list', status = 'all' } = searchParams;

  if (!data) {
    notFound();
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'administered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'upcoming':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      administered: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      upcoming: 'bg-orange-100 text-orange-800',
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Filter immunizations based on searchParams
  const filteredImmunizations = data.immunizations.filter(imm => {
    if (status === 'all') return true;
    return imm.status === status;
  });

  return (
    <div className="space-y-6">
      {/* Header with student info and actions */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href="/immunizations"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Immunizations
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{data.student.name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
            <span>{data.student.grade}</span>
            <span>•</span>
            <span>DOB: {new Date(data.student.dateOfBirth).toLocaleDateString()}</span>
            <span>•</span>
            <span>Student ID: {studentId}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export Records
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Immunization
          </Button>
        </div>
      </div>

      {/* Compliance Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Complete</p>
              <p className="text-2xl font-bold text-green-600">{data.complianceStatus.completeCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{data.complianceStatus.overdueCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-orange-600">{data.complianceStatus.upcomingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round((data.complianceStatus.completeCount / data.complianceStatus.totalRequired) * 100)}%
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Filter Tabs using searchParams */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        {[
          { key: 'all', label: 'All Immunizations', count: data.immunizations.length },
          { key: 'administered', label: 'Complete', count: data.complianceStatus.completeCount },
          { key: 'overdue', label: 'Overdue', count: data.complianceStatus.overdueCount },
          { key: 'upcoming', label: 'Upcoming', count: data.complianceStatus.upcomingCount },
        ].map((filterOption) => (
          <Link
            key={filterOption.key}
            href={`/immunizations/student/${studentId}?status=${filterOption.key}&view=${view}`}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              status === filterOption.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {filterOption.label}
            <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
              {filterOption.count}
            </span>
          </Link>
        ))}
      </div>

      {/* Immunization Records */}
      <div className="space-y-4">
        {filteredImmunizations.length === 0 ? (
          <Card className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No immunizations found</h3>
            <p className="text-gray-600">No immunizations match the selected filter criteria.</p>
          </Card>
        ) : (
          filteredImmunizations.map((immunization) => (
            <Card key={immunization.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getStatusIcon(immunization.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{immunization.vaccineName}</h3>
                      {getStatusBadge(immunization.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      {immunization.dateAdministered && (
                        <div>
                          <span className="font-medium">Date Administered:</span>
                          <br />
                          {new Date(immunization.dateAdministered).toLocaleDateString()}
                        </div>
                      )}
                      
                      {immunization.nextDue && (
                        <div>
                          <span className="font-medium">Next Due:</span>
                          <br />
                          {new Date(immunization.nextDue).toLocaleDateString()}
                        </div>
                      )}
                      
                      {immunization.administeredBy && (
                        <div>
                          <span className="font-medium">Administered By:</span>
                          <br />
                          {immunization.administeredBy}
                        </div>
                      )}
                    </div>
                    
                    {immunization.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{immunization.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Main page component with proper Next.js patterns
export default async function StudentImmunizationPage(props: StudentImmunizationPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  return (
    <Suspense fallback={<StudentImmunizationSkeleton />}>
      <StudentImmunizationContent 
        studentId={params.studentId} 
        searchParams={searchParams}
      />
    </Suspense>
  );
}