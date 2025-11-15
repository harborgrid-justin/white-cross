/**
 * New Emergency Contact Page
 * Form for adding new emergency contacts to a student
 *
 * @module app/students/[id]/emergency-contacts/new/page
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStudent } from '@/lib/actions/students.actions';
import { EmergencyContactForm } from '@/components/features/emergency-contacts/EmergencyContactForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

/**
 * Generate metadata
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
    title: `Add Emergency Contact - ${student.firstName} ${student.lastName} | White Cross Healthcare`,
    description: `Add a new emergency contact for ${student.firstName} ${student.lastName}`
  };
}

/**
 * New Emergency Contact Page
 */
export default async function NewEmergencyContactPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await getStudent(id);

  if (!student) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link href={`/students/${student.id}/emergency-contacts`}>
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Contacts
          </Button>
        </Link>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Add Emergency Contact
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {student.firstName} {student.lastName} - Grade {student.grade}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact Information</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add a new emergency contact for this student. All fields marked with * are required.
            </p>
          </CardHeader>
          <CardContent>
            <EmergencyContactForm studentId={student.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}