'use client';

/**
 * WF-SAFETY-003 | StudentPhotoVerification.tsx - Patient Photo Display for Verification
 * Purpose: Display student photo to verify Right Patient before medication administration
 * Upstream: Student API | Dependencies: React, Avatar
 * Downstream: Medication administration safety (Five Rights)
 * Related: AdministrationForm, FiveRightsChecklist
 * Exports: StudentPhotoVerification component
 * Last Updated: 2025-10-27 | File Type: .tsx
 */

import React from 'react';
import { User } from 'lucide-react';

export interface StudentPhotoVerificationProps {
  studentId: string;
  studentName: string;
  studentPhoto?: string | null;
  dateOfBirth?: string;
  studentIdNumber?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: {
    containerSize: 'w-12 h-12',
    textSize: 'text-sm',
    initialsSize: 'text-base',
  },
  md: {
    containerSize: 'w-16 h-16',
    textSize: 'text-base',
    initialsSize: 'text-xl',
  },
  lg: {
    containerSize: 'w-20 h-20',
    textSize: 'text-lg',
    initialsSize: 'text-2xl',
  },
};

export const StudentPhotoVerification: React.FC<
  StudentPhotoVerificationProps
> = ({
  studentId,
  studentName,
  studentPhoto,
  dateOfBirth,
  studentIdNumber,
  className = '',
  size = 'md',
}) => {
  const config = sizeConfig[size];

  // Generate initials from student name
  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(studentName);

  return (
    <div
      className={`bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center gap-4">
        {/* Photo or Avatar */}
        <div
          className={`${config.containerSize} rounded-full overflow-hidden flex-shrink-0 bg-blue-100 dark:bg-blue-800 flex items-center justify-center border-2 border-blue-300 dark:border-blue-700`}
        >
          {studentPhoto ? (
            <img
              src={studentPhoto}
              alt={`Photo of ${studentName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span
                className={`font-bold text-blue-700 dark:text-blue-300 ${config.initialsSize}`}
              >
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* Student Information */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className={`font-bold text-blue-900 dark:text-blue-100 ${config.textSize}`}>
              {studentName}
            </h3>
          </div>

          <div className="space-y-0.5">
            {studentIdNumber && (
              <p className="text-sm text-blue-700 dark:text-blue-300">
                ID: {studentIdNumber}
              </p>
            )}
            {dateOfBirth && (
              <p className="text-sm text-blue-700 dark:text-blue-300">
                DOB: {dateOfBirth}
              </p>
            )}
          </div>

          {!studentPhoto && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 italic">
              No photo on file - verify patient identity using ID
            </p>
          )}
        </div>

        {/* Verification Badge */}
        <div className="flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 border-2 border-blue-300 dark:border-blue-700 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase mb-1">
              Verify
            </p>
            <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
              Patient
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

StudentPhotoVerification.displayName = 'StudentPhotoVerification';

export default StudentPhotoVerification;
