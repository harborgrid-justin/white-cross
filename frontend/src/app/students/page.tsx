/**
 * Students List Page - White Cross Healthcare Platform (Next.js)
 * Comprehensive student management with CRUD operations
 *
 * @module app/students/page
 * @version 1.0.0
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Download,
  Users,
  Edit,
  Eye,
  FileText,
  Calendar,
  Phone,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

// UI Components
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';

// API Client
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';

// Types
import type {
  Student,
  PaginatedStudentsResponse,
  UpdateStudentData,
} from '@/types/student.types';

const GRADES = ['9th', '10th', '11th', '12th'];
const ITEMS_PER_PAGE = 20;

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load students data
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: Record<string, string | number | boolean> = {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          isActive: true,
        };

        if (searchQuery) {
          params.search = searchQuery;
        }

        if (selectedGrade !== 'all') {
          params.grade = selectedGrade;
        }

        const response = await apiClient.get<PaginatedStudentsResponse>(
          API_ENDPOINTS.students,
          params
        );

        setStudents(response.students);
        setTotalStudents(response.pagination.total);
        setLoading(false);
      } catch (err) {
        console.error('Error loading students:', err);
        setError(err instanceof Error ? err.message : 'Failed to load students');
        setLoading(false);
      }
    };

    loadStudents();
  }, [currentPage, searchQuery, selectedGrade]);

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;

    try {
      setDeleteLoading(true);
      await apiClient.post(API_ENDPOINTS.studentDeactivate(selectedStudent.id), {});
      setShowDeleteModal(false);
      setSelectedStudent(null);
      setDeleteLoading(false);

      // Reload students list
      const params: Record<string, string | number | boolean> = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        isActive: true,
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedGrade !== 'all') params.grade = selectedGrade;

      const response = await apiClient.get<PaginatedStudentsResponse>(
        API_ENDPOINTS.students,
        params
      );
      setStudents(response.students);
      setTotalStudents(response.pagination.total);
    } catch (err) {
      console.error('Failed to delete student:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete student');
      setDeleteLoading(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting students data...');
  };

  // Pagination calculations
  const totalPages = Math.ceil(totalStudents / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  // Permission checks (TODO: integrate with auth context)
  const canCreate = true; // Replace with actual permission check
  const canEdit = true;
  const canDelete = true;
  const canViewHealth = true;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading students...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Students</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Deactivate Student</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to deactivate {selectedStudent.firstName}{' '}
              {selectedStudent.lastName}? This will remove them from the active student list.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedStudent(null);
                }}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteStudent} disabled={deleteLoading}>
                {deleteLoading ? 'Deactivating...' : 'Deactivate Student'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="mt-1 text-gray-600">Manage student records and information</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={handleExport} leftIcon={<Download />}>
            Export
          </Button>
          {canCreate && (
            <Link href="/students/new">
              <Button leftIcon={<Plus />}>Add Student</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Grade Filter */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Grades</option>
              {GRADES.map((grade) => (
                <option key={grade} value={grade}>
                  {grade} Grade
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2" />
            {totalStudents} student{totalStudents !== 1 ? 's' : ''} found
          </div>
        </div>
      </Card>

      {/* Students Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guardian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medical Info
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{student.studentNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      {student.emergencyContacts && student.emergencyContacts.length > 0 ? (
                        <>
                          <div className="text-sm text-gray-900">
                            {student.emergencyContacts[0].firstName}{' '}
                            {student.emergencyContacts[0].lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.emergencyContacts[0].phoneNumber}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-400">No contact</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {student.chronicConditions &&
                        student.chronicConditions.map((condition) => (
                          <span
                            key={condition.id}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                          >
                            {condition.conditionName}
                          </span>
                        ))}
                      {student.allergies &&
                        student.allergies.map((allergy) => (
                          <span
                            key={allergy.id}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                          >
                            {allergy.allergen}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/students/${student.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {canViewHealth && (
                        <Link
                          href={`/health-records?studentId=${student.id}`}
                          className="text-purple-600 hover:text-purple-900"
                          title="Health Records"
                        >
                          <FileText className="h-4 w-4" />
                        </Link>
                      )}
                      <Link
                        href={`/appointments?studentId=${student.id}`}
                        className="text-green-600 hover:text-green-900"
                        title="Schedule Appointment"
                      >
                        <Calendar className="h-4 w-4" />
                      </Link>
                      {canDelete && (
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Deactivate Student"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + ITEMS_PER_PAGE, totalStudents)}
                  </span>{' '}
                  of <span className="font-medium">{totalStudents}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
