'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StudentStatusBadge } from './StudentStatusBadge';
import { Eye, Edit, Trash2, Phone, Mail, Calendar, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Student } from './StudentList';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * StudentCard props
 */
export interface StudentCardProps {
  /** Student data */
  student: Student;
  /** View handler */
  onView?: (student: Student) => void;
  /** Edit handler */
  onEdit?: (student: Student) => void;
  /** Delete handler */
  onDelete?: (student: Student) => void;
  /** Enable selection */
  selectable?: boolean;
  /** Selected state */
  selected?: boolean;
  /** Selection handler */
  onSelect?: (selected: boolean) => void;
  /** Compact mode */
  compact?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * StudentCard - Display student information in card format
 *
 * @example
 * ```tsx
 * <StudentCard
 *   student={student}
 *   onView={handleViewStudent}
 *   onEdit={handleEditStudent}
 *   selectable
 *   selected={selectedIds.has(student.id)}
 *   onSelect={(selected) => handleSelection(student.id, selected)}
 * />
 * ```
 */
export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onView,
  onEdit,
  onDelete,
  selectable = false,
  selected = false,
  onSelect,
  compact = false,
  className
}) => {
  const hasHealthAlerts = student.hasAllergies || student.hasMedications || student.hasChronicConditions;

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
        selected ? 'ring-2 ring-primary-500 border-primary-500' : undefined,
        onView ? 'cursor-pointer' : undefined,
        className
      )}
      onClick={onView ? () => onView(student) : undefined}
    >
      <div className="p-4 space-y-4">
        {/* Header with Photo and Selection */}
        <div className="flex items-start gap-3">
          {selectable && (
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect?.(e.target.checked);
              }}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800"
              aria-label={`Select ${student.firstName} ${student.lastName}`}
            />
          )}

          {/* Photo */}
          <div className="flex-shrink-0">
            {student.photoUrl ? (
              <img
                src={student.photoUrl}
                alt={`${student.firstName} ${student.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary-700 dark:text-primary-400">
                  {student.firstName[0]}{student.lastName[0]}
                </span>
              </div>
            )}
          </div>

          {/* Name and Status */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
              {student.firstName} {student.lastName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" size="sm">
                {student.grade}
              </Badge>
              <StudentStatusBadge status={student.status} size="sm" />
            </div>
          </div>

          {/* Health Alert Indicator */}
          {hasHealthAlerts && !compact && (
            <div className="flex-shrink-0">
              <div
                className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center"
                title="Has health alerts"
              >
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        {!compact && (
          <div className="space-y-2 text-sm">
            {/* School */}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{student.school}</span>
            </div>

            {/* Guardian */}
            {student.guardianName && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">{student.guardianName}</span>
                </div>
                {student.guardianPhone && (
                  <div className="pl-6 text-gray-500 dark:text-gray-400 text-xs">
                    {student.guardianPhone}
                  </div>
                )}
              </div>
            )}

            {/* Email */}
            {student.email && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">{student.email}</span>
              </div>
            )}

            {/* Health Alerts */}
            {hasHealthAlerts && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-1">
                  {student.hasAllergies && (
                    <Badge variant="warning" size="sm">
                      Allergies
                    </Badge>
                  )}
                  {student.hasMedications && (
                    <Badge variant="info" size="sm">
                      Medications
                    </Badge>
                  )}
                  {student.hasChronicConditions && (
                    <Badge variant="error" size="sm">
                      Chronic Conditions
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {(onView || onEdit || onDelete) && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            {onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(student);
                }}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(student);
                }}
                aria-label={`Edit ${student.firstName} ${student.lastName}`}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(student);
                }}
                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                aria-label={`Delete ${student.firstName} ${student.lastName}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

StudentCard.displayName = 'StudentCard';

export default React.memo(StudentCard);




