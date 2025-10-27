/**
 * @fileoverview Student Medication Schedule Page
 * @module app/(dashboard)/students/[id]/medications/schedule
 *
 * Daily medication schedule view for specific student with time-based grouping.
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StudentMedicationSchedule from '@/components/medications/StudentMedicationSchedule';
import { PageHeader } from '@/components/shared/PageHeader';
import { fetchWithAuth } from '@/lib/server/fetch';
import { API_ENDPOINTS } from '@/constants/api';

export const metadata: Metadata = {
  title: 'Medication Schedule | White Cross',
  description: 'Student medication administration schedule'
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

interface StudentSchedulePageProps {
  params: {
    id: string;
  };
  searchParams: {
    date?: string;
  };
}

/**
 * Fetch student and medication schedule
 */
async function getStudentSchedule(studentId: string, searchParams: any) {
  const date = searchParams.date || new Date().toISOString().split('T')[0];

  try {
    const [studentRes, scheduleRes] = await Promise.all([
      fetchWithAuth(API_ENDPOINTS.STUDENTS.BY_ID(studentId), {
        next: { tags: [`student-${studentId}`] }
      }),
      fetchWithAuth(
        `${API_ENDPOINTS.STUDENTS.BY_ID(studentId)}/medications/schedule?date=${date}`,
        { next: { revalidate: 300 } } // 5 min cache
      )
    ]);

    if (!studentRes.ok) return null;

    const student = await studentRes.json();
    const schedule = scheduleRes.ok ? await scheduleRes.json() : { scheduled: [], byTimeSlot: {}, stats: {} };

    return { student, schedule, date };
  } catch (error) {
    console.error('Error fetching student schedule:', error);
    return null;
  }
}

/**
 * Student Medication Schedule Page
 */
export default async function StudentSchedulePage({ params, searchParams }: StudentSchedulePageProps) {
  const data = await getStudentSchedule(params.id, searchParams);

  if (!data) {
    notFound();
  }

  const { student, schedule, date } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${student.firstName} ${student.lastName} - Medication Schedule`}
        description={`Daily medication schedule for ${new Date(date).toLocaleDateString()}`}
        backLink={`/students/${params.id}/medications`}
        backLabel="Back to Medications"
      />

      {/* Schedule Summary */}
      {schedule.stats && schedule.stats.totalScheduled > 0 && (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                {schedule.stats.totalScheduled} medication{schedule.stats.totalScheduled !== 1 ? 's' : ''} scheduled today
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                {schedule.stats.completed || 0} completed, {schedule.stats.pending || 0} pending, {schedule.stats.overdue || 0} overdue
              </p>
            </div>
          </div>
        </div>
      )}

      {schedule.stats && schedule.stats.totalScheduled === 0 && (
        <div className="rounded-md bg-gray-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-800">No medications scheduled</h3>
              <p className="mt-1 text-sm text-gray-600">
                {student.firstName} has no scheduled medications for this date.
              </p>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<ScheduleLoadingSkeleton />}>
        <StudentMedicationSchedule
          studentId={params.id}
          student={student}
          schedule={schedule}
          selectedDate={date}
        />
      </Suspense>
    </div>
  );
}

function ScheduleLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-6 w-40 rounded bg-gray-200"></div>
          <div className="space-y-2">
            {[...Array(2)].map((_, j) => (
              <div key={j} className="h-24 rounded border border-gray-200 bg-white"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
