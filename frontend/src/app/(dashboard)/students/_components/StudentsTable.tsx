/**
 * Students Table Component
 *
 * Client-side table with prefetching and real-time updates
 *
 * @module app/students/components/StudentsTable
 * @version 1.0.0
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, FileText, Calendar, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useStudents, usePrefetchStudent } from '@/lib/query/hooks/useStudents';
import { ErrorDisplay } from '@/components/ui/errors/ErrorBoundary';
import type { PaginatedStudentsResponse } from '@/types/student.types';

interface StudentsTableProps {
  initialData: PaginatedStudentsResponse;
  searchParams: {
    page?: string;
    search?: string;
    grade?: string;
  };
}

export function StudentsTable({ initialData, searchParams }: StudentsTableProps) {
  const router = useRouter();
  const prefetchStudent = usePrefetchStudent();

  // Use TanStack Query with server data as initial data
  const { data, isLoading, error, refetch } = useStudents(
    {
      page: parseInt(searchParams.page || '1'),
      search: searchParams.search,
      grade: searchParams.grade,
      isActive: true,
    },
    {
      initialData,
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    }
  );

  const students = data?.students || [];
  const pagination = data?.pagination;
  const totalStudents = pagination?.total || 0;

  // Update student count in filters
  useEffect(() => {
    const countEl = document.getElementById('student-count');
    if (countEl) {
      countEl.textContent = `${totalStudents} student${totalStudents !== 1 ? 's' : ''} found`;
    }
  }, [totalStudents]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (error) {
    return <ErrorDisplay error={error instanceof Error ? error : { message: String(error), name: 'Error' }} onRetry={() => refetch()} />;
  }

  const currentPage = parseInt(searchParams.page || '1');
  const totalPages = Math.ceil(totalStudents / 20);
  const startIndex = (currentPage - 1) * 20;

  return (
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              ))
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50"
                  onMouseEnter={() => prefetchStudent(student.id)}
                >
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
                      <Link
                        href={`/students/${student.id}/health-records`}
                        className="text-purple-600 hover:text-purple-900"
                        title="Health Records"
                      >
                        <FileText className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/appointments?studentId=${student.id}`}
                        className="text-green-600 hover:text-green-900"
                        title="Schedule Appointment"
                      >
                        <Calendar className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(startIndex + 20, totalStudents)}</span> of{' '}
                <span className="font-medium">{totalStudents}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
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
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}


