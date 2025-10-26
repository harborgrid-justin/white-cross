/**
 * StudentDetails Component
 * Comprehensive student detail view with demographics, emergency contacts, and health summary
 *
 * @module components/features/students/StudentDetails
 */

'use client';

import React from 'react';
import Link from 'next/link';
import type { Student } from '@/types/student.types';
import { Card } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';
import { Button } from '@/components/ui/buttons/Button';
import { StudentStatusBadge } from './StudentStatusBadge';
import {
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Edit,
  FileText,
  AlertTriangle,
  Heart,
  Pill,
  Shield,
  Activity,
  Users
} from 'lucide-react';

/**
 * StudentDetails props
 */
export interface StudentDetailsProps {
  /** Student data */
  student: Student;
  /** Edit handler */
  onEdit?: () => void;
  /** Show emergency contacts */
  showEmergencyContacts?: boolean;
  /** Show health summary */
  showHealthSummary?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * StudentDetails - Comprehensive student information display
 *
 * @example
 * ```tsx
 * <StudentDetails
 *   student={studentData}
 *   onEdit={() => router.push(`/students/${student.id}/edit`)}
 *   showEmergencyContacts
 *   showHealthSummary
 * />
 * ```
 */
export const StudentDetails: React.FC<StudentDetailsProps> = ({
  student,
  onEdit,
  showEmergencyContacts = true,
  showHealthSummary = true,
  className
}) => {
  const age = calculateAge(student.dateOfBirth);

  // Health alerts
  const hasAllergies = student.allergies && student.allergies.length > 0;
  const hasMedications = student.medications && student.medications.length > 0;
  const hasConditions = student.chronicConditions && student.chronicConditions.length > 0;

  return (
    <div className={className}>
      {/* Header Card */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Student Photo */}
            <div className="flex-shrink-0">
              {student.photo ? (
                <img
                  src={student.photo}
                  alt={`${student.firstName} ${student.lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center border-4 border-gray-200 dark:border-gray-700">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {student.firstName[0]}{student.lastName[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Student Info */}
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {student.firstName} {student.lastName}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <Badge variant="secondary">
                      {student.studentNumber}
                    </Badge>
                    <StudentStatusBadge status={student.isActive ? 'active' : 'inactive'} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Grade {student.grade}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Age {age}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {onEdit && (
                    <Button variant="primary" size="sm" onClick={onEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  <Link href={`/students/${student.id}/health-records`}>
                    <Button variant="secondary" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Health Records
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Health Alerts */}
              {(hasAllergies || hasMedications || hasConditions) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {hasAllergies && (
                    <Badge variant="warning" size="sm">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {student.allergies!.length} Allerg{student.allergies!.length === 1 ? 'y' : 'ies'}
                    </Badge>
                  )}
                  {hasMedications && (
                    <Badge variant="info" size="sm">
                      <Pill className="h-3 w-3 mr-1" />
                      {student.medications!.length} Medication{student.medications!.length === 1 ? '' : 's'}
                    </Badge>
                  )}
                  {hasConditions && (
                    <Badge variant="error" size="sm">
                      <Heart className="h-3 w-3 mr-1" />
                      {student.chronicConditions!.length} Condition{student.chronicConditions!.length === 1 ? '' : 's'}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demographics Card */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Demographics
            </h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Date of Birth</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">{formatDate(student.dateOfBirth)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Age</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">{age} years</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Gender</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">
                  {student.gender.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Grade</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">{student.grade}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Enrollment Date</dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">
                  {student.enrollmentDate ? formatDate(student.enrollmentDate) : 'Not specified'}
                </dd>
              </div>
              {student.medicalRecordNum && (
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Medical Record #</dt>
                  <dd className="text-sm text-gray-900 dark:text-gray-100">{student.medicalRecordNum}</dd>
                </div>
              )}
            </dl>
          </div>
        </Card>

        {/* Emergency Contacts Card */}
        {showEmergencyContacts && (
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between">
                <span className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Emergency Contacts
                </span>
                <Link href={`/students/${student.id}/emergency-contacts`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </h2>

              {student.emergencyContacts && student.emergencyContacts.length > 0 ? (
                <div className="space-y-4">
                  {student.emergencyContacts.slice(0, 3).map((contact, index) => (
                    <div key={contact.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {contact.firstName} {contact.lastName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {contact.relationship}
                          </p>
                        </div>
                        <Badge variant={contact.priority === 'PRIMARY' ? 'primary' : 'secondary'} size="sm">
                          {contact.priority}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Phone className="h-3 w-3 mr-2" />
                          {contact.phoneNumber}
                        </div>
                        {contact.email && (
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Mail className="h-3 w-3 mr-2" />
                            {contact.email}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {student.emergencyContacts.length > 3 && (
                    <Link href={`/students/${student.id}/emergency-contacts`}>
                      <Button variant="ghost" size="sm" className="w-full">
                        View all {student.emergencyContacts.length} contacts
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    No emergency contacts added
                  </p>
                  <Link href={`/students/${student.id}/emergency-contacts/new`}>
                    <Button variant="secondary" size="sm">
                      Add Contact
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Health Summary Card */}
        {showHealthSummary && (
          <Card className="lg:col-span-2">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Health Summary
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Allergies */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
                    Allergies
                  </h3>
                  {hasAllergies ? (
                    <ul className="space-y-2">
                      {student.allergies!.map((allergy) => (
                        <li key={allergy.id} className="flex items-start">
                          <Badge variant="warning" size="sm">
                            {allergy.severity}
                          </Badge>
                          <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                            {allergy.allergen}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No known allergies</p>
                  )}
                </div>

                {/* Medications */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <Pill className="h-4 w-4 mr-2 text-blue-600" />
                    Medications
                  </h3>
                  {hasMedications ? (
                    <ul className="space-y-2">
                      {student.medications!.filter(m => m.isActive).map((medication) => (
                        <li key={medication.id} className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {medication.medication?.name || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {medication.dosage} - {medication.frequency}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No active medications</p>
                  )}
                </div>

                {/* Chronic Conditions */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-red-600" />
                    Chronic Conditions
                  </h3>
                  {hasConditions ? (
                    <ul className="space-y-2">
                      {student.chronicConditions!.filter(c => c.active).map((condition) => (
                        <li key={condition.id} className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {condition.conditionName}
                          </p>
                          {condition.diagnosisDate && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Diagnosed: {formatDate(condition.diagnosisDate)}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No chronic conditions</p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link href={`/students/${student.id}/health-records`}>
                  <Button variant="secondary" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    View Complete Health Records
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

StudentDetails.displayName = 'StudentDetails';

export default StudentDetails;
