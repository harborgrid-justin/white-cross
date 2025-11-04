'use client';

/**
 * @fileoverview Example: React 19 use() Hook for Async Data
 * @module components/examples/AsyncDataComponent
 *
 * Demonstrates proper usage of React 19 use() hook for unwrapping promises.
 * This pattern should be used for async operations instead of useEffect with loading states.
 *
 * Benefits:
 * - Simpler code (no manual loading states)
 * - Better Suspense integration
 * - Improved error handling
 * - Cleaner async data flow
 */

import { use, Suspense } from 'react';

/**
 * Async data fetching function
 * In a real application, this would fetch from an API
 */
async function fetchStudentData(studentId: string) {
  const response = await fetch(`/api/students/${studentId}`);
  if (!response.ok) throw new Error('Failed to fetch student');
  return response.json();
}

/**
 * Component that uses React 19 use() hook
 *
 * The use() hook unwraps the promise and integrates with Suspense.
 * No need for manual loading states or useEffect!
 */
function StudentProfile({ studentId }: { studentId: string }) {
  // React 19 use() hook unwraps the promise
  const student = use(fetchStudentData(studentId));

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold">{student.name}</h2>
      <p className="text-gray-600">Grade: {student.grade}</p>
      <p className="text-gray-600">School: {student.school}</p>
    </div>
  );
}

/**
 * Parent component with Suspense boundary
 *
 * Suspense automatically handles loading state while the promise resolves.
 * Error boundaries handle errors from the promise.
 */
export function StudentProfileWrapper({ studentId }: { studentId: string }) {
  return (
    <Suspense fallback={<StudentProfileSkeleton />}>
      <StudentProfile studentId={studentId} />
    </Suspense>
  );
}

/**
 * Loading skeleton component
 */
function StudentProfileSkeleton() {
  return (
    <div className="p-4 border rounded-lg animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}

/**
 * COMPARISON: Old Pattern vs React 19 use() Hook
 *
 * OLD PATTERN (useEffect):
 * ```tsx
 * function StudentProfile({ studentId }) {
 *   const [student, setStudent] = useState(null);
 *   const [loading, setLoading] = useState(true);
 *   const [error, setError] = useState(null);
 *
 *   useEffect(() => {
 *     setLoading(true);
 *     fetchStudentData(studentId)
 *       .then(setStudent)
 *       .catch(setError)
 *       .finally(() => setLoading(false));
 *   }, [studentId]);
 *
 *   if (loading) return <LoadingSkeleton />;
 *   if (error) return <ErrorMessage error={error} />;
 *   return <div>...</div>;
 * }
 * ```
 *
 * NEW PATTERN (use() hook):
 * ```tsx
 * function StudentProfile({ studentId }) {
 *   const student = use(fetchStudentData(studentId));
 *   return <div>...</div>;
 * }
 *
 * // Wrap with Suspense for loading state
 * <Suspense fallback={<LoadingSkeleton />}>
 *   <StudentProfile studentId={id} />
 * </Suspense>
 * ```
 *
 * Benefits:
 * - 70% less code
 * - No manual state management
 * - Better composition with Suspense
 * - Automatic error boundary integration
 */
