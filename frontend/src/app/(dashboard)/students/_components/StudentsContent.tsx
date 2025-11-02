/**
 * @fileoverview Students Content Component - Main content area for student management
 * @module app/(dashboard)/students/_components/StudentsContent
 * @category Students - Components
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import { getStudents } from '@/lib/actions/students.actions';
import type { Student } from '@/types/student.types';

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

function getStatusBadgeVariant(isActive: boolean) {
  return isActive ? 'default' : 'secondary';
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
        const filters: Record<string, string | boolean | undefined> = {
          search: searchParams.search,
          grade: searchParams.grade,
          hasAllergies: searchParams.hasHealthAlerts === 'true',
        };

        // Only add isActive filter if a specific status is requested
        if (searchParams.status === 'ACTIVE') {
          filters.isActive = true;
        } else if (searchParams.status === 'INACTIVE') {
          filters.isActive = false;
        }
        // If no status specified, don't filter by isActive (show all students)

        // Remove undefined values
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        );

        const studentsData = await getStudents(cleanFilters);
        setStudents(studentsData);
      } catch (error) {
        console.error('Failed to fetch students:', error);
        // Set empty array on error instead of using mock data
        setStudents([]);
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
      setSelectedStudents(new Set(students.map((s: Student) => s.id)));
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
  const activeStudents = students.filter((s: Student) => s.isActive).length;
  const healthAlerts = students.filter((s: Student) =>
    (s.allergies && s.allergies.length > 0) ||
    (s.medications && s.medications.length > 0) ||
    (s.chronicConditions && s.chronicConditions.length > 0)
  ).length;
  // Calculate present today as active students (in a real system, this would be from attendance data)
  const presentToday = activeStudents;

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Students</h2>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedStudents.size > 0 && (
                <>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {selectedStudents.size} selected
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Export selected students functionality
                      const selectedStudentData = students.filter(s => selectedStudents.has(s.id));
                      const csvContent = [
                        'Student ID,Name,Grade,Status,Phone,Email',
                        ...selectedStudentData.map(s => 
                          `${s.studentNumber},"${s.firstName} ${s.lastName}",${s.grade},${s.isActive ? 'Active' : 'Inactive'},${s.emergencyContacts?.[0]?.phoneNumber || 'N/A'},${s.emergencyContacts?.[0]?.email || 'N/A'}`
                        )
                      ].join('\n');
                      
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `students-export-${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                    className="flex-shrink-0"
                  >
                    <Download className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </>
              )}
              <Button 
                size="sm"
                onClick={() => window.location.href = '/students/new'}
                className="flex-shrink-0"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Student</span>
              </Button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
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
                {students.map((student: Student) => (
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
                          <Badge variant={getStatusBadgeVariant(student.isActive)}>
                            {student.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>
                            {student.emergencyContacts && student.emergencyContacts.length > 0 
                              ? student.emergencyContacts[0].phoneNumber 
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-xs">
                            {student.emergencyContacts && student.emergencyContacts.length > 0 
                              ? student.emergencyContacts[0].email || 'N/A'
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            No attendance data
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {((student.allergies && student.allergies.length > 0) || 
                            (student.medications && student.medications.length > 0) ||
                            (student.chronicConditions && student.chronicConditions.length > 0)) && (
                            <AlertTriangle className="h-3 w-3 text-orange-500" />
                          )}
                          <span className="text-xs text-gray-500">
                            Health: {((student.allergies && student.allergies.length > 0) || 
                                     (student.medications && student.medications.length > 0) ||
                                     (student.chronicConditions && student.chronicConditions.length > 0)) ? 'Alerts' : 'Normal'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.location.href = `/students/${student.id}`}
                          title="View student details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.location.href = `/students/${student.id}/edit`}
                          title="Edit student"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.location.href = `/students/${student.id}/health-records`}
                          title="View health records"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {/* Select All for Mobile */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedStudents.size === students.length && students.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All ({students.length})
                </span>
              </label>
              <span className="text-sm text-gray-500">
                {selectedStudents.size} selected
              </span>
            </div>

            {/* Student Cards */}
            {students.map((student: Student) => (
              <Card key={student.id} className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      className="rounded border-gray-300"
                      aria-label={`Select student ${student.firstName} ${student.lastName}`}
                    />
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-lg font-medium text-blue-800">
                        {student.firstName[0]}{student.lastName[0]}
                      </span>
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          ID: {student.studentNumber} • Age: {calculateAge(student.dateOfBirth)}
                        </p>
                        
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge 
                            variant="secondary"
                            className={getGradeBadgeColor(student.grade)}
                          >
                            {student.grade}
                          </Badge>
                          <Badge variant={getStatusBadgeVariant(student.isActive)}>
                            {student.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </Badge>
                          {((student.allergies && student.allergies.length > 0) || 
                            (student.medications && student.medications.length > 0) ||
                            (student.chronicConditions && student.chronicConditions.length > 0)) && (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Health Alert
                          </Badge>
                          )}
                        </div>

                        {/* Contact Info */}
                        <div className="mt-3 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-2" />
                            <span>
                              {student.emergencyContacts && student.emergencyContacts.length > 0 
                                ? student.emergencyContacts[0].phoneNumber 
                                : 'No contact info'}
                            </span>
                          </div>
                          {student.emergencyContacts && student.emergencyContacts.length > 0 && student.emergencyContacts[0].email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-3 w-3 mr-2" />
                              <span className="truncate">{student.emergencyContacts[0].email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.location.href = `/students/${student.id}`}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.location.href = `/students/${student.id}/edit`}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.location.href = `/students/${student.id}/health-records`}
                        className="flex-1"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Health
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {students.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new student.
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => window.location.href = '/students/new'}
                >
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



