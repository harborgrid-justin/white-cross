/**
 * @fileoverview Student Profile Component
 * 
 * Detailed profile view component for displaying comprehensive student information.
 * 
 * @module components/pages/Students/StudentProfile
 * @since 1.0.0
 */

'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit, Shield } from 'lucide-react';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  grade: string;
  dateOfBirth: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'transferred';
  email?: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  guardian: {
    name: string;
    relationship: string;
    email: string;
    phone: string;
  };
  medicalInfo?: {
    allergies: string[];
    medications: string[];
    conditions: string[];
  };
}

interface StudentProfileProps {
  student: Student;
  onEdit?: () => void;
  canEdit?: boolean;
}

/**
 * Student Profile Component
 * 
 * Renders comprehensive student information including personal details,
 * contact information, guardian details, and medical information.
 */
export function StudentProfile({ student, onEdit, canEdit = true }: StudentProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'contact' | 'medical'>('overview');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      transferred: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-full p-3">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {student.firstName} {student.lastName}
              </h1>
              <p className="text-blue-100">
                Student ID: {student.studentNumber}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                  {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                </span>
                <span className="text-blue-100">•</span>
                <span className="text-blue-100">Grade {student.grade}</span>
              </div>
            </div>
          </div>
          {canEdit && (
            <button
              onClick={onEdit}
              className="inline-flex items-center px-4 py-2 border border-white border-opacity-20 rounded-md text-sm font-medium text-white hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'contact', label: 'Contact & Guardian', icon: Phone },
            { id: 'medical', label: 'Medical Information', icon: Shield }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'overview' | 'contact' | 'medical')}
              className={`${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                  <dd className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {formatDate(student.dateOfBirth)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Enrollment Date</dt>
                  <dd className="text-sm text-gray-900">
                    {formatDate(student.enrollmentDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Current Grade</dt>
                  <dd className="text-sm text-gray-900">Grade {student.grade}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                <div className="text-sm text-gray-900">
                  <p>{student.address.street}</p>
                  <p>{student.address.city}, {student.address.state} {student.address.zipCode}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Student Contact</h3>
              <dl className="space-y-3">
                {student.email && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {student.email}
                    </dd>
                  </div>
                )}
                {student.phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="text-sm text-gray-900 flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {student.phone}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Guardian Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="text-sm text-gray-900">{student.guardian.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Relationship</dt>
                  <dd className="text-sm text-gray-900">{student.guardian.relationship}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {student.guardian.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="text-sm text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {student.guardian.phone}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {activeTab === 'medical' && (
          <div className="space-y-6">
            {student.medicalInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Allergies</h3>
                  {student.medicalInfo.allergies.length > 0 ? (
                    <ul className="space-y-2">
                      {student.medicalInfo.allergies.map((allergy, index) => (
                        <li key={index} className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                          {allergy}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No known allergies</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Current Medications</h3>
                  {student.medicalInfo.medications.length > 0 ? (
                    <ul className="space-y-2">
                      {student.medicalInfo.medications.map((medication, index) => (
                        <li key={index} className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-md">
                          {medication}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No current medications</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Conditions</h3>
                  {student.medicalInfo.conditions.length > 0 ? (
                    <ul className="space-y-2">
                      {student.medicalInfo.conditions.map((condition, index) => (
                        <li key={index} className="text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-md">
                          {condition}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No known conditions</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No medical information available</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Medical information has not been provided for this student.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
