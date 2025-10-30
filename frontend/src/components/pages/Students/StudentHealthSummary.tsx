/**
 * @fileoverview Student Health Summary Component
 * 
 * Summary component for displaying student health status and compliance overview.
 * 
 * @module components/pages/Students/StudentHealthSummary
 * @since 1.0.0
 */

'use client';

import { Shield, AlertTriangle, CheckCircle, Clock, Pill, Syringe } from 'lucide-react';

interface HealthRecord {
  id: string;
  type: 'immunization' | 'medication' | 'allergy' | 'condition';
  name: string;
  status: 'current' | 'overdue' | 'upcoming' | 'completed';
  dueDate?: string;
  lastUpdated: string;
}

interface ComplianceStatus {
  immunizations: {
    total: number;
    completed: number;
    overdue: number;
    upcoming: number;
  };
  medications: {
    active: number;
    monitored: number;
  };
  allergies: {
    count: number;
    severity: 'low' | 'medium' | 'high';
  };
  lastPhysical?: string;
  overallStatus: 'compliant' | 'needs_attention' | 'critical';
}

interface StudentHealthSummaryProps {
  studentId: string;
  studentName: string;
  complianceStatus: ComplianceStatus;
  recentRecords: HealthRecord[];
  onViewDetails?: (recordId: string) => void;
}

/**
 * Student Health Summary Component
 * 
 * Displays an overview of student health compliance, recent records,
 * and key health indicators with visual status indicators.
 */
export function StudentHealthSummary({ 
  studentId, 
  studentName, 
  complianceStatus, 
  recentRecords, 
  onViewDetails 
}: StudentHealthSummaryProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      compliant: 'bg-green-100 text-green-800 border-green-200',
      needs_attention: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      critical: 'bg-red-100 text-red-800 border-red-200',
      current: 'text-green-600',
      overdue: 'text-red-600',
      upcoming: 'text-yellow-600',
      completed: 'text-gray-600'
    };
    return colors[status as keyof typeof colors] || colors.completed;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'completed':
      case 'current':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'needs_attention':
      case 'upcoming':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'critical':
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Health Summary</h2>
            <p className="text-sm text-gray-600">{studentName}</p>
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(complianceStatus.overallStatus)}`}>
            {getStatusIcon(complianceStatus.overallStatus)}
            <span className="ml-2 capitalize">
              {complianceStatus.overallStatus.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="px-6 py-4">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Compliance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Immunizations */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Syringe className="h-6 w-6 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-900">Immunizations</p>
                <div className="mt-1">
                  <p className="text-lg font-semibold text-blue-600">
                    {complianceStatus.immunizations.completed}/{complianceStatus.immunizations.total}
                  </p>
                  {complianceStatus.immunizations.overdue > 0 && (
                    <p className="text-xs text-red-600">
                      {complianceStatus.immunizations.overdue} overdue
                    </p>
                  )}
                  {complianceStatus.immunizations.upcoming > 0 && (
                    <p className="text-xs text-yellow-600">
                      {complianceStatus.immunizations.upcoming} upcoming
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Medications */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <Pill className="h-6 w-6 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-900">Medications</p>
                <div className="mt-1">
                  <p className="text-lg font-semibold text-purple-600">
                    {complianceStatus.medications.active}
                  </p>
                  <p className="text-xs text-purple-600">
                    Active prescriptions
                  </p>
                  {complianceStatus.medications.monitored > 0 && (
                    <p className="text-xs text-orange-600">
                      {complianceStatus.medications.monitored} monitored
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-900">Allergies</p>
                <div className="mt-1">
                  <p className="text-lg font-semibold text-red-600">
                    {complianceStatus.allergies.count}
                  </p>
                  <p className="text-xs text-red-600 capitalize">
                    {complianceStatus.allergies.severity} severity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Last Physical */}
        {complianceStatus.lastPhysical && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center text-sm">
              <Shield className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-600">Last Physical Exam:</span>
              <span className="ml-2 font-medium text-gray-900">
                {formatDate(complianceStatus.lastPhysical)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Recent Records */}
      <div className="px-6 py-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Activity</h3>
        {recentRecords.length > 0 ? (
          <div className="space-y-3">
            {recentRecords.slice(0, 5).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => onViewDetails?.(record.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {record.type === 'immunization' && <Syringe className="h-4 w-4 text-blue-500" />}
                    {record.type === 'medication' && <Pill className="h-4 w-4 text-purple-500" />}
                    {record.type === 'allergy' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    {record.type === 'condition' && <Shield className="h-4 w-4 text-gray-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{record.name}</p>
                    <p className="text-xs text-gray-500">
                      Updated {formatDate(record.lastUpdated)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {record.dueDate && (
                    <span className="text-xs text-gray-500">
                      Due {formatDate(record.dueDate)}
                    </span>
                  )}
                  <span className={`text-xs font-medium ${getStatusColor(record.status)}`}>
                    {record.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Shield className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No recent health records</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex space-x-3">
          <button className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            View Full Records
          </button>
          <button className="flex-1 bg-blue-600 border border-transparent rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            Add Record
          </button>
        </div>
      </div>
    </div>
  );
}
