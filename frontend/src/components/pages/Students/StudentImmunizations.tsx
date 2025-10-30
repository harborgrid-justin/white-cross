/**
 * @fileoverview Student Immunizations Component
 * 
 * Component for managing and displaying student immunization records and compliance.
 * 
 * @module components/pages/Students/StudentImmunizations
 * @since 1.0.0
 */

'use client';

import { useState } from 'react';
import { Syringe, CheckCircle, AlertTriangle, Clock, Plus, Edit, Trash2, Calendar, Shield } from 'lucide-react';

interface ImmunizationRecord {
  id: string;
  vaccineName: string;
  vaccineCode?: string;
  doseNumber: number;
  totalDoses: number;
  dateAdministered: string;
  nextDueDate?: string;
  administeredBy: string;
  lotNumber?: string;
  manufacturer?: string;
  administrationSite?: string;
  status: 'current' | 'overdue' | 'upcoming' | 'complete';
  exemption?: {
    type: 'medical' | 'religious' | 'philosophical';
    expirationDate?: string;
    notes?: string;
  };
  reactions?: string[];
  notes?: string;
}

interface ComplianceRequirement {
  vaccineName: string;
  requiredDoses: number;
  completedDoses: number;
  status: 'compliant' | 'partial' | 'overdue' | 'exempt';
  nextDueDate?: string;
  exemption?: boolean;
}

interface StudentImmunizationsProps {
  studentId: string;
  studentName: string;
  immunizations: ImmunizationRecord[];
  requirements: ComplianceRequirement[];
  onAddImmunization?: () => void;
  onEditImmunization?: (immunizationId: string) => void;
  onDeleteImmunization?: (immunizationId: string) => void;
  canEdit?: boolean;
}

/**
 * Student Immunizations Component
 * 
 * Displays and manages student immunization records with compliance tracking,
 * due dates, and exemption management.
 */
export function StudentImmunizations({
  studentId,
  studentName,
  immunizations,
  requirements,
  onAddImmunization,
  onEditImmunization,
  onDeleteImmunization,
  canEdit = true
}: StudentImmunizationsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'records' | 'compliance'>('overview');
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  const getComplianceColor = (status: string) => {
    const colors = {
      compliant: 'bg-green-100 text-green-800 border-green-200',
      partial: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      overdue: 'bg-red-100 text-red-800 border-red-200',
      exempt: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status as keyof typeof colors] || colors.partial;
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'partial':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'exempt':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      current: 'bg-green-100 text-green-800',
      complete: 'bg-blue-100 text-blue-800',
      overdue: 'bg-red-100 text-red-800',
      upcoming: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || colors.upcoming;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const toggleExpanded = (recordId: string) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  const overallCompliance = requirements.every(req => req.status === 'compliant' || req.status === 'exempt');
  const overdueCount = requirements.filter(req => req.status === 'overdue').length;
  const upcomingCount = immunizations.filter(imm => imm.status === 'upcoming').length;

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Immunizations</h2>
            <p className="text-sm text-gray-600">{studentName}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${overallCompliance ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
              {overallCompliance ? (
                <CheckCircle className="h-4 w-4 mr-1" />
              ) : (
                <AlertTriangle className="h-4 w-4 mr-1" />
              )}
              {overallCompliance ? 'Compliant' : 'Non-Compliant'}
            </div>
            {canEdit && (
              <button
                onClick={onAddImmunization}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Shield },
              { id: 'records', label: 'Records', icon: Syringe, count: immunizations.length },
              { id: 'compliance', label: 'Compliance', icon: CheckCircle }
            ].map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
                {count !== undefined && <span className="ml-1">({count})</span>}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Alerts */}
      {(overdueCount > 0 || upcomingCount > 0) && (
        <div className="px-6 py-3 border-b border-gray-200">
          {overdueCount > 0 && (
            <div className="mb-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-sm text-red-700">
                  <span className="font-medium">{overdueCount}</span> immunization(s) are overdue
                </p>
              </div>
            </div>
          )}
          {upcomingCount > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">{upcomingCount}</span> immunization(s) are due soon
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Syringe className="h-6 w-6 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-900">Total Records</p>
                    <p className="text-lg font-semibold text-blue-600">{immunizations.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-900">Compliant</p>
                    <p className="text-lg font-semibold text-green-600">
                      {requirements.filter(r => r.status === 'compliant' || r.status === 'exempt').length}/{requirements.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-900">Overdue</p>
                    <p className="text-lg font-semibold text-red-600">{overdueCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Records */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Immunizations</h3>
              {immunizations.slice(0, 3).map((record) => (
                <div key={record.id} className="mb-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{record.vaccineName}</h4>
                      <p className="text-sm text-gray-600">
                        Dose {record.doseNumber} of {record.totalDoses} • {formatDate(record.dateAdministered)}
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-4">
            {immunizations.length > 0 ? (
              immunizations.map((record) => {
                const isExpanded = expandedRecord === record.id;

                return (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Syringe className="h-5 w-5 text-blue-500" />
                          <div>
                            <h3 className="font-medium text-gray-900">{record.vaccineName}</h3>
                            <p className="text-sm text-gray-600">
                              Dose {record.doseNumber} of {record.totalDoses}
                            </p>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </div>

                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Date Given:</span> {formatDate(record.dateAdministered)}
                          </div>
                          <div>
                            <span className="font-medium">Administered by:</span> {record.administeredBy}
                          </div>
                          {record.nextDueDate && (
                            <div>
                              <span className="font-medium">Next Due:</span> {formatDate(record.nextDueDate)}
                            </div>
                          )}
                        </div>

                        {record.exemption && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-md">
                            <div className="flex items-center text-sm text-blue-800">
                              <Shield className="h-4 w-4 mr-1" />
                              <span className="font-medium">Exemption:</span>
                              <span className="ml-1 capitalize">{record.exemption.type}</span>
                            </div>
                          </div>
                        )}

                        {isExpanded && (
                          <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                            {record.vaccineCode && (
                              <div>
                                <span className="text-sm font-medium text-gray-700">Vaccine Code:</span>
                                <span className="ml-2 text-sm text-gray-600">{record.vaccineCode}</span>
                              </div>
                            )}
                            {record.lotNumber && (
                              <div>
                                <span className="text-sm font-medium text-gray-700">Lot Number:</span>
                                <span className="ml-2 text-sm text-gray-600">{record.lotNumber}</span>
                              </div>
                            )}
                            {record.manufacturer && (
                              <div>
                                <span className="text-sm font-medium text-gray-700">Manufacturer:</span>
                                <span className="ml-2 text-sm text-gray-600">{record.manufacturer}</span>
                              </div>
                            )}
                            {record.administrationSite && (
                              <div>
                                <span className="text-sm font-medium text-gray-700">Administration Site:</span>
                                <span className="ml-2 text-sm text-gray-600">{record.administrationSite}</span>
                              </div>
                            )}
                            {record.reactions && record.reactions.length > 0 && (
                              <div>
                                <span className="text-sm font-medium text-gray-700">Reactions:</span>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {record.reactions.map((reaction, index) => (
                                    <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-md">
                                      {reaction}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {record.notes && (
                              <div>
                                <span className="text-sm font-medium text-gray-700">Notes:</span>
                                <p className="mt-1 text-sm text-gray-600">{record.notes}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => toggleExpanded(record.id)}
                          className="text-gray-400 hover:text-gray-600 text-sm"
                        >
                          {isExpanded ? 'Less' : 'More'}
                        </button>
                        {canEdit && (
                          <>
                            <button
                              onClick={() => onEditImmunization?.(record.id)}
                              className="text-blue-600 hover:text-blue-800"
                              aria-label={`Edit ${record.vaccineName}`}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onDeleteImmunization?.(record.id)}
                              className="text-red-600 hover:text-red-800"
                              aria-label={`Delete ${record.vaccineName}`}
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
              <div className="text-center py-8">
                <Syringe className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No immunization records</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add immunization records to track vaccination history and compliance.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-4">
            {requirements.map((requirement, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getComplianceIcon(requirement.status)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{requirement.vaccineName}</h3>
                      <p className="text-sm text-gray-600">
                        {requirement.completedDoses} of {requirement.requiredDoses} doses completed
                      </p>
                      {requirement.nextDueDate && (
                        <p className="text-sm text-gray-500">
                          Next due: {formatDate(requirement.nextDueDate)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getComplianceColor(requirement.status)}`}>
                      {requirement.status === 'exempt' ? 'Exempt' : requirement.status}
                    </span>
                    {requirement.exemption && (
                      <Shield className="h-4 w-4 text-blue-500" title="Exemption on file" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
