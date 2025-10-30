/**
 * @fileoverview Student Medications Component
 * 
 * Component for managing and displaying student medication information and schedules.
 * 
 * @module components/pages/Students/StudentMedications
 * @since 1.0.0
 */

'use client';

import { useState } from 'react';
import { Pill, Clock, AlertTriangle, CheckCircle, Plus, Edit, Trash2, Calendar } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  route: 'oral' | 'topical' | 'injection' | 'inhaler' | 'other';
  prescribedBy: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'discontinued' | 'completed';
  instructions: string;
  sideEffects?: string[];
  schoolAdministration: boolean;
  administrationTimes?: string[];
  notes?: string;
  refillDate?: string;
  quantity?: number;
  refillsRemaining?: number;
}

interface StudentMedicationsProps {
  studentId: string;
  studentName: string;
  medications: Medication[];
  onAddMedication?: () => void;
  onEditMedication?: (medicationId: string) => void;
  onDeleteMedication?: (medicationId: string) => void;
  onAdministerMedication?: (medicationId: string) => void;
  canEdit?: boolean;
  canAdminister?: boolean;
}

/**
 * Student Medications Component
 * 
 * Displays and manages student medication information including schedules,
 * administration tracking, and prescription details.
 */
export function StudentMedications({
  studentId,
  studentName,
  medications,
  onAddMedication,
  onEditMedication,
  onDeleteMedication,
  onAdministerMedication,
  canEdit = true,
  canAdminister = false
}: StudentMedicationsProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('active');
  const [expandedMedication, setExpandedMedication] = useState<string | null>(null);

  const filteredMedications = medications.filter(med => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return med.status === 'active';
    if (filterStatus === 'inactive') return med.status !== 'active';
    return true;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      discontinued: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'discontinued':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'inactive':
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRouteIcon = (route: string) => {
    // For simplicity, using Pill icon for all routes
    return <Pill className="h-4 w-4 text-purple-500" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const toggleExpanded = (medicationId: string) => {
    setExpandedMedication(expandedMedication === medicationId ? null : medicationId);
  };

  const schoolMedications = filteredMedications.filter(med => med.schoolAdministration);

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Medications</h2>
            <p className="text-sm text-gray-600">{studentName}</p>
          </div>
          <div className="flex items-center space-x-3">
            {canEdit && (
              <button
                onClick={onAddMedication}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-4">
          <nav className="flex space-x-8">
            {[
              { id: 'active', label: 'Active', count: medications.filter(m => m.status === 'active').length },
              { id: 'inactive', label: 'Inactive', count: medications.filter(m => m.status !== 'active').length },
              { id: 'all', label: 'All', count: medications.length }
            ].map(({ id, label, count }) => (
              <button
                key={id}
                onClick={() => setFilterStatus(id as 'all' | 'active' | 'inactive')}
                className={`${
                  filterStatus === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm`}
              >
                {label} ({count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* School Administration Alert */}
      {schoolMedications.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-600 mr-2" />
            <p className="text-sm text-blue-700">
              <span className="font-medium">{schoolMedications.length}</span> medication(s) require school administration
            </p>
          </div>
        </div>
      )}

      {/* Medication List */}
      <div className="divide-y divide-gray-200">
        {filteredMedications.length > 0 ? (
          filteredMedications.map((medication) => {
            const isExpanded = expandedMedication === medication.id;

            return (
              <div key={medication.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Medication Header */}
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getRouteIcon(medication.route)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(medication.status)}`}>
                            {getStatusIcon(medication.status)}
                            <span className="ml-1 capitalize">{medication.status}</span>
                          </span>
                          {medication.schoolAdministration && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              School Admin Required
                            </span>
                          )}
                        </div>
                        
                        {medication.genericName && (
                          <p className="text-sm text-gray-600">Generic: {medication.genericName}</p>
                        )}

                        {/* Basic Info */}
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Dosage:</span> {medication.dosage}
                          </div>
                          <div>
                            <span className="font-medium">Frequency:</span> {medication.frequency}
                          </div>
                          <div>
                            <span className="font-medium">Route:</span> {medication.route}
                          </div>
                          <div>
                            <span className="font-medium">Prescribed by:</span> {medication.prescribedBy}
                          </div>
                        </div>

                        {/* Administration Times */}
                        {medication.administrationTimes && medication.administrationTimes.length > 0 && (
                          <div className="mt-3">
                            <span className="text-sm font-medium text-gray-700">Administration Times:</span>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {medication.administrationTimes.map((time, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatTime(time)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pl-7 space-y-4">
                        {/* Instructions */}
                        <div>
                          <label className="text-sm font-medium text-gray-700">Instructions</label>
                          <p className="mt-1 text-sm text-gray-600">{medication.instructions}</p>
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Start Date</label>
                            <div className="mt-1 flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              {formatDate(medication.startDate)}
                            </div>
                          </div>
                          {medication.endDate && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">End Date</label>
                              <div className="mt-1 flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                {formatDate(medication.endDate)}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Side Effects */}
                        {medication.sideEffects && medication.sideEffects.length > 0 && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Potential Side Effects</label>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {medication.sideEffects.map((effect, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  {effect}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Prescription Info */}
                        {(medication.quantity || medication.refillsRemaining || medication.refillDate) && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Prescription Information</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                              {medication.quantity && (
                                <div>
                                  <span className="font-medium">Quantity:</span> {medication.quantity}
                                </div>
                              )}
                              {medication.refillsRemaining !== undefined && (
                                <div>
                                  <span className="font-medium">Refills:</span> {medication.refillsRemaining}
                                </div>
                              )}
                              {medication.refillDate && (
                                <div>
                                  <span className="font-medium">Next Refill:</span> {formatDate(medication.refillDate)}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {medication.notes && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Notes</label>
                            <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                              <p className="text-sm text-yellow-800">{medication.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleExpanded(medication.id)}
                      className="text-gray-400 hover:text-gray-600 text-sm"
                    >
                      {isExpanded ? 'Less' : 'More'}
                    </button>
                    {canAdminister && medication.schoolAdministration && medication.status === 'active' && (
                      <button
                        onClick={() => onAdministerMedication?.(medication.id)}
                        className="text-purple-600 hover:text-purple-800 text-sm"
                      >
                        Administer
                      </button>
                    )}
                    {canEdit && (
                      <>
                        <button
                          onClick={() => onEditMedication?.(medication.id)}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label={`Edit ${medication.name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteMedication?.(medication.id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label={`Delete ${medication.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-6 py-8 text-center">
            <Pill className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {filterStatus === 'all' ? 'No medications recorded' : `No ${filterStatus} medications`}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filterStatus === 'all' 
                ? 'Add medications to track prescriptions and administration schedules.'
                : `Switch to "All" to see medications with other statuses.`
              }
            </p>
            {canEdit && filterStatus === 'all' && (
              <div className="mt-6">
                <button
                  onClick={onAddMedication}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Medication
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Important Notice */}
      {medications.length > 0 && (
        <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-200">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-900">Medication Safety Notice</h4>
              <p className="mt-1 text-sm text-yellow-700">
                Always verify medication details with healthcare providers. 
                School administration of medications requires proper authorization and trained personnel. 
                Report any adverse reactions immediately.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
