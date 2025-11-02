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
import { Eye, FileText, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableEmptyState,
  TableLoadingState,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useStudents, usePrefetchStudent } from '@/lib/query/hooks/useStudents';
import { ErrorDisplay } from '@/components/shared/errors/ErrorBoundary';
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

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first, last, and current with ellipsis
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-4">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Guardian</TableHead>
              <TableHead>Medical Info</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoadingState colSpan={5} />
            ) : students.length === 0 ? (
              <TableEmptyState colSpan={5} message="No students found" />
            ) : (
              students.map((student) => (
                <TableRow
                  key={student.id}
                  onMouseEnter={() => prefetchStudent(student.id)}
                >
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {student.studentNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{student.grade}</Badge>
                  </TableCell>
                  <TableCell>
                    {student.emergencyContacts && student.emergencyContacts.length > 0 ? (
                      <div className="space-y-1">
                        <div className="text-sm">
                          {student.emergencyContacts[0].firstName}{' '}
                          {student.emergencyContacts[0].lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {student.emergencyContacts[0].phoneNumber}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No contact</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {student.chronicConditions &&
                        student.chronicConditions.map((condition) => (
                          <Badge
                            key={condition.id}
                            variant="destructive"
                            className="text-xs"
                          >
                            {condition.conditionName}
                          </Badge>
                        ))}
                      {student.allergies &&
                        student.allergies.map((allergy) => (
                          <Badge
                            key={allergy.id}
                            className="bg-orange-100 text-orange-800 hover:bg-orange-200 text-xs"
                          >
                            {allergy.allergen}
                          </Badge>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="View Details"
                      >
                        <Link href={`/students/${student.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="Health Records"
                      >
                        <Link href={`/students/${student.id}/health-records`}>
                          <FileText className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        title="Schedule Appointment"
                      >
                        <Link href={`/appointments?studentId=${student.id}`}>
                          <Calendar className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
            <span className="font-medium">{Math.min(startIndex + 20, totalStudents)}</span> of{' '}
            <span className="font-medium">{totalStudents}</span> results
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}


