/**
 * Students Header Component
 *
 * Displays page title, description, and add student button
 */

import React from 'react';
import { UserPlus } from 'lucide-react';

interface StudentsHeaderProps {
  canCreate: boolean;
  onAddStudent: () => void;
}

/**
 * Header component for Students page
 */
export default function StudentsHeader({
  canCreate,
  onAddStudent,
}: StudentsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1
          className="text-2xl font-bold text-gray-900"
          data-testid="page-title"
        >
          Student Management
        </h1>
        <p className="text-gray-600" data-testid="page-description">
          Manage student profiles, medical records, and emergency contacts
        </p>
      </div>
      {canCreate && (
        <button
          className="btn-primary flex items-center"
          data-testid="add-student-button"
          aria-label="Add new student"
          onClick={onAddStudent}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Student
        </button>
      )}
    </div>
  );
}
