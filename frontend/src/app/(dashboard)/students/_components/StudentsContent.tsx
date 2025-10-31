/**
 * @fileoverview Students Content Component - Main content area for student management
 * @module app/(dashboard)/students/_components/StudentsContent
 * @category Students - Components
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
  Users, 
  GraduationCap, 
  Plus,
  Download,
  Eye,
  Edit,
  Phone,
  Mail,
  AlertTriangle,
  FileText,
  UserCheck,
  UserX
} from 'lucide-react';
import { 
  getStudents, 
  getStudentCount,
  getStudentStatistics,
  exportStudentData
} from '../../students/actions';

export interface Student {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: '9th' | '10th' | '11th' | '12th';
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  phone?: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContacts: {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    isPrimary: boolean;
  }[];
  healthInfo: {
    hasAllergies: boolean;
    hasMedications: boolean;
    hasConditions: boolean;
    lastCheckup?: string;
  };
  attendance: {
    presentToday: boolean;
    absencesThisMonth: number;
    tardiesThisMonth: number;
  };
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'TRANSFERRED';
  enrollmentDate: string;
  lastUpdated: string;
  recordedBy: string;
}

interface StudentsContentProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    grade?: string;
    status?: string;
    hasHealthAlerts?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

// Mock data for demonstration
const mockStudents: Student[] = [
  {
    id: '1',
    studentNumber: 'WC2024001',
    firstName: 'Emma',
    lastName: 'Johnson',
    dateOfBirth: '2007-03-15',
    grade: '11th',
    gender: 'FEMALE',
    phone: '(555) 123-4567',
    email: 'emma.johnson@student.whitecross.edu',
    address: {
      street: '123 Oak Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701'
    },
    emergencyContacts: [
      {
        id: 'ec1',
        name: 'Sarah Johnson',
        relationship: 'Mother',
        phone: '(555) 123-4567',
        email: 'sarah.johnson@email.com',
        isPrimary: true
      }
    ],
    healthInfo: {
      hasAllergies: true,
      hasMedications: false,
      hasConditions: false,
      lastCheckup: '2024-08-15'
    },
    attendance: {
      presentToday: true,
      absencesThisMonth: 2,
      tardiesThisMonth: 1
    },
    status: 'ACTIVE',
    enrollmentDate: '2022-08-20',
    lastUpdated: '2024-01-15T10:30:00Z',
    recordedBy: 'Nancy Wilson'
  },
  {
    id: '2',
    studentNumber: 'WC2024002',
    firstName: 'Michael',
    lastName: 'Chen',
    dateOfBirth: '2006-11-22',
    grade: '12th',
    gender: 'MALE',
    phone: '(555) 987-6543',
    email: 'michael.chen@student.whitecross.edu',
    address: {
      street: '456 Pine Avenue',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702'
    },
    emergencyContacts: [
      {
        id: 'ec2',
        name: 'Lisa Chen',
        relationship: 'Mother',
        phone: '(555) 987-6543',
        isPrimary: true
      }
    ],
    healthInfo: {
      hasAllergies: false,
      hasMedications: true,
      hasConditions: true,
      lastCheckup: '2024-09-02'
    },
    attendance: {
      presentToday: false,
      absencesThisMonth: 0,
      tardiesThisMonth: 3
    },
    status: 'ACTIVE',
    enrollmentDate: '2021-08-18',
    lastUpdated: '2024-01-14T14:45:00Z',
    recordedBy: 'Nancy Wilson'
  },
  {
    id: '3',
    studentNumber: 'WC2024003',
    firstName: 'Sophia',
    lastName: 'Rodriguez',
    dateOfBirth: '2008-07-08',
    grade: '10th',
    gender: 'FEMALE',
    phone: '(555) 555-0123',
    email: 'sophia.rodriguez@student.whitecross.edu',
    address: {
      street: '789 Maple Drive',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62703'
    },
    emergencyContacts: [
      {
        id: 'ec3',
        name: 'Maria Rodriguez',
        relationship: 'Mother',
        phone: '(555) 555-0123',
        isPrimary: true
      }
    ],
    healthInfo: {
      hasAllergies: true,
      hasMedications: true,
      hasConditions: false,
      lastCheckup: '2024-07-20'
    },
    attendance: {
      presentToday: true,
      absencesThisMonth: 1,
      tardiesThisMonth: 0
    },
    status: 'ACTIVE',
    enrollmentDate: '2023-08-22',
    lastUpdated: '2024-01-13T09:15:00Z',
    recordedBy: 'Nancy Wilson'
  }
];

function getStatusBadgeVariant(status: Student['status']) {
  switch (status) {
    case 'ACTIVE': return 'success';
    case 'INACTIVE': return 'warning';
    case 'GRADUATED': return 'info';
    case 'TRANSFERRED': return 'secondary';
    default: return 'secondary';
  }
}

function getGradeBadgeColor(grade: string) {
  switch (grade) {
    case '9th': return 'bg-blue-100 text-blue-800 border-blue-200';
    case '10th': return 'bg-green-100 text-green-800 border-green-200';
    case '11th': return 'bg-purple-100 text-purple-800 border-purple-200';
    case '12th': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
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

export function StudentsContent({ searchParams }: StudentsContentProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        
        // Build filters from searchParams
        const filters = {
          search: searchParams.search,
          grade: searchParams.grade,
          status: searchParams.status,
          hasHealthAlerts: searchParams.hasHealthAlerts === 'true',
        };

        // Remove undefined values
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        );

        const studentsData = await getStudents(cleanFilters);
        setStudents(studentsData);
      } catch (error) {
        console.error('Failed to fetch students:', error);
        // Fall back to mock data on error
        setStudents(mockStudents);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, [searchParams]);

  const handleSelectStudent = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map(s => s.id)));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <Skeleton className="h-6 w-16 mb-2" />
                  <Skeleton className="h-8 w-12" />
                </div>
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  const totalStudents = students.length;
  const presentToday = students.filter(s => s.attendance.presentToday).length;
  const healthAlerts = students.filter(s => s.healthInfo.hasAllergies || s.healthInfo.hasMedications || s.healthInfo.hasConditions).length;
  const activeStudents = students.filter(s => s.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Present Today</p>
                <p className="text-2xl font-bold text-green-600">{presentToday}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Health Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{healthAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-blue-600">{activeStudents}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Students</h2>
            <div className="flex items-center gap-2">
              {selectedStudents.size > 0 && (
                <>
                  <span className="text-sm text-gray-600">
                    {selectedStudents.size} selected
                  </span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </>
              )}
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedStudents.size === students.length && students.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                      aria-label="Select all students"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Health & Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedStudents.has(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                        className="rounded border-gray-300"
                        aria-label={`Select student ${student.firstName} ${student.lastName}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-800">
                              {student.firstName[0]}{student.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {student.studentNumber} • Age: {calculateAge(student.dateOfBirth)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <Badge 
                          variant="secondary"
                          className={getGradeBadgeColor(student.grade)}
                        >
                          {student.grade}
                        </Badge>
                        <div>
                          <Badge variant={getStatusBadgeVariant(student.status)}>
                            {student.status}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{student.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-xs">{student.email || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {student.attendance.presentToday ? (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          ) : (
                            <UserX className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-xs">
                            {student.attendance.presentToday ? 'Present' : 'Absent'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {(student.healthInfo.hasAllergies || student.healthInfo.hasMedications || student.healthInfo.hasConditions) && (
                            <AlertTriangle className="h-3 w-3 text-orange-500" />
                          )}
                          <span className="text-xs text-gray-500">
                            Health: {student.healthInfo.hasAllergies || student.healthInfo.hasMedications || student.healthInfo.hasConditions ? 'Alerts' : 'Normal'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {students.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new student.
              </p>
              <div className="mt-6">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
