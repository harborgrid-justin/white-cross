/**
 * Create Student Page - White Cross Healthcare Platform (Next.js)
 * Form for creating new student records
 *
 * @module app/students/new/page
 * @version 1.0.0
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

// UI Components
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/buttons/Button';

// API Client
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';

// Types
import type { CreateStudentData, Gender } from '@/types/student.types';

const GRADES = ['9th', '10th', '11th', '12th'];

export default function NewStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateStudentData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE',
    grade: '',
    studentNumber: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First name and last name are required');
      return;
    }

    if (!formData.dateOfBirth || !formData.grade || !formData.studentNumber) {
      setError('All required fields must be filled');
      return;
    }

    try {
      setLoading(true);

      await apiClient.post(API_ENDPOINTS.students, formData);

      // Redirect to students list
      router.push('/students');
    } catch (err) {
      console.error('Error creating student:', err);
      setError(err instanceof Error ? err.message : 'Failed to create student');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/students">
            <Button variant="secondary" leftIcon={<ArrowLeft />}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Student</h1>
            <p className="mt-1 text-gray-600">Create a new student record</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Student Information</h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* DOB and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value as Gender })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                  <option value="PREFER_NOT_TO_SAY">Prefer Not to Say</option>
                </select>
              </div>
            </div>

            {/* Grade and Student Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                  Grade <span className="text-red-500">*</span>
                </label>
                <select
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Grade</option>
                  {GRADES.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade} Grade
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700">
                  Student Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="studentNumber"
                  value={formData.studentNumber}
                  onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 2024001"
                  required
                />
              </div>
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="enrollmentDate" className="block text-sm font-medium text-gray-700">
                  Enrollment Date
                </label>
                <input
                  type="date"
                  id="enrollmentDate"
                  value={formData.enrollmentDate || ''}
                  onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="medicalRecordNum" className="block text-sm font-medium text-gray-700">
                  Medical Record Number
                </label>
                <input
                  type="text"
                  id="medicalRecordNum"
                  value={formData.medicalRecordNum || ''}
                  onChange={(e) => setFormData({ ...formData, medicalRecordNum: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <Link href="/students">
              <Button variant="secondary" disabled={loading}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" leftIcon={<Save />} disabled={loading}>
              {loading ? 'Creating...' : 'Create Student'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
