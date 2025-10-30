'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Clock, 
  Calendar, 
  User, 
  AlertTriangle,
  Pill,
  MapPin,
  FileText,
  Activity,
  MoreVertical
} from 'lucide-react';

/**
 * Interface for medication data
 */
interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  route: string;
  status: 'active' | 'inactive' | 'discontinued' | 'on-hold';
  prescribedBy: string;
  prescribedDate: string;
  startDate: string;
  endDate?: string;
  nextDose?: string;
  indication: string;
  instructions?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  refillsRemaining?: number;
  pharmacy?: string;
  lastAdministered?: string;
  complianceRate?: number;
  sideEffects?: string[];
  contraindications?: string[];
  interactions?: string[];
  notes?: string;
}

/**
 * Interface for administration record
 */
interface AdministrationRecord {
  id: string;
  medicationId: string;
  administeredBy: string;
  administeredAt: string;
  dosageGiven: string;
  notes?: string;
  studentReaction?: string;
  status: 'completed' | 'missed' | 'refused' | 'late';
}

/**
 * Props for the MedicationDetail component
 */
interface MedicationDetailProps {
  /** Medication data to display */
  medication: Medication;
  /** Administration history */
  administrationHistory?: AdministrationRecord[];
  /** Loading state */
  loading?: boolean;
  /** Callback when back button is clicked */
  onBack?: () => void;
  /** Callback when edit is clicked */
  onEdit?: (medication: Medication) => void;
  /** Callback when delete is clicked */
  onDelete?: (medication: Medication) => void;
  /** Callback when administer is clicked */
  onAdminister?: (medication: Medication) => void;
  /** Callback when record administration is clicked */
  onRecordAdministration?: (medication: Medication) => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * MedicationDetail Component
 * 
 * Displays detailed information about a medication including administration
 * history, compliance tracking, and management actions.
 * 
 * @component
 * @example
 * ```tsx
 * <MedicationDetail 
 *   medication={selectedMedication}
 *   administrationHistory={history}
 *   onBack={handleBack}
 *   onEdit={handleEdit}
 * />
 * ```
 */
export const MedicationDetail = ({
  medication,
  administrationHistory = [],
  loading = false,
  onBack,
  onEdit,
  onDelete,
  onAdminister,
  onRecordAdministration,
  className = ''
}: MedicationDetailProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'compliance'>('overview');
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: Medication['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'discontinued':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Medication['priority']) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${formatTime(dateTimeString)}`;
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading medication details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Pill className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{medication.name}</h1>
                {medication.genericName && (
                  <p className="text-sm text-gray-600">Generic: {medication.genericName}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`
              inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border
              ${getStatusColor(medication.status)}
            `}>
              {medication.status.replace('-', ' ')}
            </span>
            
            {medication.priority !== 'low' && (
              <div className="flex items-center">
                <AlertTriangle className={`w-4 h-4 mr-1 ${getPriorityColor(medication.priority)}`} />
                <span className={`text-sm font-medium ${getPriorityColor(medication.priority)}`}>
                  {medication.priority} priority
                </span>
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="More actions"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {showActions && (
                <>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      {onEdit && (
                        <button
                          onClick={() => {
                            onEdit(medication);
                            setShowActions(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Medication
                        </button>
                      )}
                      {onRecordAdministration && (
                        <button
                          onClick={() => {
                            onRecordAdministration(medication);
                            setShowActions(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <Activity className="w-4 h-4 mr-2" />
                          Record Administration
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => {
                            onDelete(medication);
                            setShowActions(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Medication
                        </button>
                      )}
                    </div>
                  </div>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowActions(false)}
                    aria-hidden="true"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Next dose alert */}
        {medication.nextDose && medication.status === 'active' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Next Dose: {formatTime(medication.nextDose)}
                  </p>
                  <p className="text-xs text-blue-700">
                    {formatDate(medication.nextDose)}
                  </p>
                </div>
              </div>
              {onAdminister && (
                <button
                  onClick={() => onAdminister(medication)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Administer Now
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="px-6">
          <div className="flex space-x-8">
            {(['overview', 'history', 'compliance'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Tab content */}
      <div className="px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Medication Details</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Pill className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Dosage:</span>
                    <span className="text-sm font-medium text-gray-900">{medication.dosage}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Frequency:</span>
                    <span className="text-sm font-medium text-gray-900">{medication.frequency}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Route:</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{medication.route}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Indication:</span>
                    <span className="text-sm font-medium text-gray-900">{medication.indication}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Prescription Info</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Prescribed by:</span>
                    <span className="text-sm font-medium text-gray-900">{medication.prescribedBy}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Start date:</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(medication.startDate)}</span>
                  </div>
                  
                  {medication.endDate && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">End date:</span>
                      <span className="text-sm font-medium text-gray-900">{formatDate(medication.endDate)}</span>
                    </div>
                  )}
                  
                  {medication.pharmacy && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Pharmacy:</span>
                      <span className="text-sm font-medium text-gray-900">{medication.pharmacy}</span>
                    </div>
                  )}
                  
                  {medication.refillsRemaining !== undefined && (
                    <div className="flex items-center space-x-2">
                      <Pill className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Refills remaining:</span>
                      <span className="text-sm font-medium text-gray-900">{medication.refillsRemaining}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Instructions */}
            {medication.instructions && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Instructions</h4>
                <p className="text-sm text-gray-700">{medication.instructions}</p>
              </div>
            )}

            {/* Additional Information */}
            {(medication.sideEffects?.length || medication.contraindications?.length || medication.interactions?.length) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Safety Information</h3>
                
                {medication.sideEffects?.length && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Side Effects</h4>
                    <div className="flex flex-wrap gap-2">
                      {medication.sideEffects.map((effect, index) => (
                        <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {medication.contraindications?.length && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Contraindications</h4>
                    <div className="flex flex-wrap gap-2">
                      {medication.contraindications.map((contraindication, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          {contraindication}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {medication.interactions?.length && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Drug Interactions</h4>
                    <div className="flex flex-wrap gap-2">
                      {medication.interactions.map((interaction, index) => (
                        <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                          {interaction}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {medication.notes && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-700">{medication.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Administration History</h3>
            
            {administrationHistory.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No administration records found</p>
                <p className="text-sm text-gray-500 mt-1">Records will appear here once medication is administered</p>
              </div>
            ) : (
              <div className="space-y-3">
                {administrationHistory.map((record) => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`
                            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                            ${record.status === 'completed' ? 'bg-green-100 text-green-800' :
                              record.status === 'missed' ? 'bg-red-100 text-red-800' :
                              record.status === 'refused' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }
                          `}>
                            {record.status}
                          </span>
                          <span className="text-sm text-gray-600">{formatDateTime(record.administeredAt)}</span>
                        </div>
                        
                        <p className="text-sm text-gray-900 mb-1">
                          <span className="font-medium">Dosage:</span> {record.dosageGiven}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Administered by:</span> {record.administeredBy}
                        </p>
                        
                        {record.notes && (
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="font-medium">Notes:</span> {record.notes}
                          </p>
                        )}
                        
                        {record.studentReaction && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Student reaction:</span> {record.studentReaction}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Compliance Tracking</h3>
            
            {medication.complianceRate !== undefined && (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Overall Compliance</h4>
                  <span className="text-2xl font-bold text-gray-900">{medication.complianceRate}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      medication.complianceRate >= 90 ? 'bg-green-500' :
                      medication.complianceRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${medication.complianceRate}%` }}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {administrationHistory.filter(r => r.status === 'completed').length}
                    </p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {administrationHistory.filter(r => r.status === 'missed').length}
                    </p>
                    <p className="text-sm text-gray-600">Missed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {administrationHistory.filter(r => r.status === 'refused').length}
                    </p>
                    <p className="text-sm text-gray-600">Refused</p>
                  </div>
                </div>
              </div>
            )}
            
            {medication.lastAdministered && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-1">Last Administration</h4>
                <p className="text-sm text-blue-700">{formatDateTime(medication.lastAdministered)}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationDetail;
