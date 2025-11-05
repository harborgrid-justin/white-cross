/**
 * @fileoverview Vaccine-Specific Compliance Detail Page - Dynamic Route
 * @module app/(dashboard)/immunizations/compliance/[vaccineType]/page
 * @category Healthcare Compliance
 *
 * Dynamic route for detailed vaccine-specific compliance tracking.
 * Demonstrates advanced Next.js routing with params and searchParams.
 */

import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Users, CheckCircle, AlertTriangle, Calendar, Download, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

// Define the PageProps using Next.js route props helpers pattern
interface VaccineCompliancePageProps {
  params: Promise<{ vaccineType: string }>;
  searchParams: Promise<{
    grade?: string;
    status?: 'all' | 'compliant' | 'overdue' | 'exempt';
    period?: 'current' | 'last30' | 'last90' | 'year';
    view?: 'summary' | 'detailed' | 'timeline';
    sortBy?: 'name' | 'grade' | 'status' | 'date';
    sortOrder?: 'asc' | 'desc';
  }>;
}

// Vaccine type mapping for display names and descriptions
const VACCINE_INFO = {
  'covid19': {
    name: 'COVID-19',
    description: 'SARS-CoV-2 Vaccination',
    category: 'Pandemic Response',
    ageRequirements: 'All ages (per CDC guidance)',
    schedule: 'Primary series + boosters as recommended'
  },
  'flu': {
    name: 'Influenza',
    description: 'Seasonal Influenza Vaccine',
    category: 'Annual',
    ageRequirements: '6+ months',
    schedule: 'Annual vaccination before flu season'
  },
  'mmr': {
    name: 'MMR',
    description: 'Measles, Mumps, Rubella',
    category: 'Childhood',
    ageRequirements: '12+ months',
    schedule: '2 doses: 12-15 months, 4-6 years'
  },
  'tdap': {
    name: 'Tdap',
    description: 'Tetanus, Diphtheria, Pertussis',
    category: 'Childhood/Adolescent',
    ageRequirements: '11+ years',
    schedule: 'Single dose at 11-12 years, boosters every 10 years'
  },
  'hepatitis_b': {
    name: 'Hepatitis B',
    description: 'Hepatitis B Vaccine',
    category: 'Childhood',
    ageRequirements: 'Birth+',
    schedule: '3 doses: birth, 1-2 months, 6-18 months'
  },
  'varicella': {
    name: 'Varicella',
    description: 'Chickenpox Vaccine',
    category: 'Childhood',
    ageRequirements: '12+ months',
    schedule: '2 doses: 12-15 months, 4-6 years'
  }
} as const;

// Generate metadata dynamically based on vaccine type
export async function generateMetadata(
  { params }: VaccineCompliancePageProps
): Promise<Metadata> {
  const { vaccineType } = await params;
  const vaccineInfo = VACCINE_INFO[vaccineType as keyof typeof VACCINE_INFO];
  
  if (!vaccineInfo) {
    return {
      title: 'Vaccine Not Found',
      description: 'The requested vaccine type was not found',
    };
  }
  
  return {
    title: `${vaccineInfo.name} Compliance - White Cross Healthcare`,
    description: `Detailed compliance tracking for ${vaccineInfo.description}`,
  };
}

// Mock data generation for vaccine-specific compliance
const getVaccineComplianceData = async (
  vaccineType: string, 
  searchParams: Awaited<VaccineCompliancePageProps['searchParams']>
) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const vaccineInfo = VACCINE_INFO[vaccineType as keyof typeof VACCINE_INFO];
  if (!vaccineInfo) {
    return null;
  }

  const { grade, status = 'all' } = searchParams;

  // Mock student data for this vaccine
  const mockStudents = [
    {
      id: 'std-001',
      name: 'Emma Johnson',
      grade: '3rd Grade',
      status: 'compliant',
      lastVaccination: '2024-09-15',
      nextDue: null,
      doses: 2,
      requiredDoses: 2,
      exemptionType: null,
      notes: 'Completed primary series'
    },
    {
      id: 'std-002', 
      name: 'Michael Chen',
      grade: '4th Grade',
      status: 'overdue',
      lastVaccination: '2023-08-10',
      nextDue: '2024-08-10',
      doses: 1,
      requiredDoses: 2,
      exemptionType: null,
      notes: 'Missing second dose'
    },
    {
      id: 'std-003',
      name: 'Sarah Williams',
      grade: '2nd Grade', 
      status: 'exempt',
      lastVaccination: null,
      nextDue: null,
      doses: 0,
      requiredDoses: 2,
      exemptionType: 'Medical',
      notes: 'Medical exemption due to allergies'
    },
    {
      id: 'std-004',
      name: 'David Martinez',
      grade: '5th Grade',
      status: 'compliant',
      lastVaccination: '2024-10-01',
      nextDue: '2025-10-01',
      doses: 1,
      requiredDoses: 1,
      exemptionType: null,
      notes: 'Annual vaccination up to date'
    }
  ];

  // Apply filters based on searchParams
  const filteredStudents = mockStudents.filter(student => {
    if (grade && grade !== 'all' && !student.grade.toLowerCase().includes(grade.toLowerCase())) {
      return false;
    }
    if (status !== 'all' && student.status !== status) {
      return false;
    }
    return true;
  });

  // Calculate compliance statistics
  const totalStudents = filteredStudents.length;
  const compliantCount = filteredStudents.filter(s => s.status === 'compliant').length;
  const overdueCount = filteredStudents.filter(s => s.status === 'overdue').length;
  const exemptCount = filteredStudents.filter(s => s.status === 'exempt').length;
  const complianceRate = totalStudents > 0 ? (compliantCount / totalStudents) * 100 : 0;

  return {
    vaccineInfo,
    students: filteredStudents,
    statistics: {
      totalStudents,
      compliantCount,
      overdueCount,
      exemptCount,
      complianceRate,
      trendPercentage: 2.3 // Mock trend data
    },
    gradeBreakdown: [
      { grade: 'Kindergarten', total: 45, compliant: 43, rate: 95.6 },
      { grade: '1st Grade', total: 52, compliant: 48, rate: 92.3 },
      { grade: '2nd Grade', total: 48, compliant: 44, rate: 91.7 },
      { grade: '3rd Grade', total: 51, compliant: 47, rate: 92.2 },
      { grade: '4th Grade', total: 49, compliant: 45, rate: 91.8 },
      { grade: '5th Grade', total: 46, compliant: 42, rate: 91.3 }
    ]
  };
};

// Loading skeleton component
function VaccineComplianceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64" />
        </div>
      </div>
    </div>
  );
}

// Filter controls component
function ComplianceFilters({ 
  vaccineType, 
  searchParams 
}: { 
  vaccineType: string;
  searchParams: Awaited<VaccineCompliancePageProps['searchParams']>; 
}) {
  const { status, view } = searchParams;

  const buildFilterUrl = (newParams: Record<string, string>) => {
    const params = new URLSearchParams();
    
    // Preserve existing params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    // Apply new params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    return `/immunizations/compliance/${vaccineType}?${params.toString()}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 pb-1">
      {/* Status Filter Tabs */}
      {[
        { key: 'all', label: 'All Students' },
        { key: 'compliant', label: 'Compliant' },
        { key: 'overdue', label: 'Overdue' },
        { key: 'exempt', label: 'Exempt' },
      ].map((filterOption) => (
        <Link
          key={filterOption.key}
          href={buildFilterUrl({ status: filterOption.key })}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            (status || 'all') === filterOption.key
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {filterOption.label}
        </Link>
      ))}
      
      {/* View Toggle */}
      <div className="ml-auto flex items-center gap-2">
        <select 
          title="Select view type"
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          value={view || 'summary'}
          onChange={(e) => window.location.href = buildFilterUrl({ view: e.target.value })}
        >
          <option value="summary">Summary View</option>
          <option value="detailed">Detailed View</option>
          <option value="timeline">Timeline View</option>
        </select>
      </div>
    </div>
  );
}

// Main content component
async function VaccineComplianceContent({
  vaccineType,
  searchParams
}: {
  vaccineType: string;
  searchParams: Awaited<VaccineCompliancePageProps['searchParams']>;
}) {
  const data = await getVaccineComplianceData(vaccineType, searchParams);

  if (!data) {
    notFound();
  }

  const { vaccineInfo, students, statistics, gradeBreakdown } = data;

  const getStatusBadge = (status: string) => {
    const variants = {
      compliant: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      exempt: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600';
      case 'overdue':
        return 'text-red-600';
      case 'exempt':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href="/immunizations/compliance"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Compliance Overview
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{vaccineInfo.name} Compliance</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
            <span>{vaccineInfo.description}</span>
            <span>•</span>
            <span>{vaccineInfo.category}</span>
            <span>•</span>
            <span>Age: {vaccineInfo.ageRequirements}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Vaccine Information Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">Vaccination Schedule</h3>
            <p className="text-blue-800 text-sm">{vaccineInfo.schedule}</p>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliant</p>
              <p className="text-2xl font-bold text-green-600">{statistics.compliantCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{statistics.overdueCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-blue-600">{statistics.complianceRate.toFixed(1)}%</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{statistics.trendPercentage}%
                </div>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </Card>
      </div>

      {/* Filter Controls */}
      <ComplianceFilters vaccineType={vaccineType} searchParams={searchParams} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Student Records ({students.length})
          </h3>
          
          {students.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">No students match the selected filter criteria.</p>
            </Card>
          ) : (
            students.map((student) => (
              <Card key={student.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link 
                        href={`/immunizations/student/${student.id}`}
                        className="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {student.name}
                      </Link>
                      {getStatusBadge(student.status)}
                      <span className="text-sm text-gray-500">{student.grade}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Doses:</span>
                        <br />
                        <span className={getStatusColor(student.status)}>
                          {student.doses} of {student.requiredDoses}
                        </span>
                      </div>
                      
                      {student.lastVaccination && (
                        <div>
                          <span className="font-medium">Last Vaccination:</span>
                          <br />
                          <span>{new Date(student.lastVaccination).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {student.nextDue && (
                        <div>
                          <span className="font-medium">Next Due:</span>
                          <br />
                          <span>{new Date(student.nextDue).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {student.exemptionType && (
                        <div>
                          <span className="font-medium">Exemption:</span>
                          <br />
                          <span>{student.exemptionType}</span>
                        </div>
                      )}
                    </div>
                    
                    {student.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
                        {student.notes}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Grade Breakdown Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance by Grade</h3>
            <div className="space-y-4">
              {gradeBreakdown.map((grade) => (
                <div key={grade.grade}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{grade.grade}</span>
                    <span className="text-sm text-gray-600">{grade.rate.toFixed(1)}%</span>
                  </div>
                  <Progress 
                    value={grade.rate} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{grade.compliant} compliant</span>
                    <span>{grade.total} total</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Vaccine Clinic
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Send Overdue Reminders
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Main page component with proper Next.js patterns
export default async function VaccineCompliancePage(props: VaccineCompliancePageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  return (
    <Suspense fallback={<VaccineComplianceSkeleton />}>
      <VaccineComplianceContent 
        vaccineType={params.vaccineType}
        searchParams={searchParams}
      />
    </Suspense>
  );
}