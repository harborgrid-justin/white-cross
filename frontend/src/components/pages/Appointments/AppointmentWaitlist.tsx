'use client';

import React, { useState, useMemo } from 'react';
import { 
  Clock,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Bell,
  UserPlus,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Eye,
  PhoneCall,
  MessageSquare,
  Star
} from 'lucide-react';
import type { Appointment } from './AppointmentCard';

/**
 * Waitlist entry priority levels
 */
type WaitlistPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Waitlist entry status
 */
type WaitlistStatus = 'active' | 'contacted' | 'scheduled' | 'cancelled' | 'expired';

/**
 * Patient contact preference
 */
type ContactPreference = 'phone' | 'email' | 'sms' | 'any';

/**
 * Waitlist entry data
 */
interface WaitlistEntry {
  id: string;
  patient: {
    id: string;
    name: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    avatar?: string;
  };
  requestedProvider?: {
    id: string;
    name: string;
  };
  requestedDate?: Date;
  preferredTimeSlots: string[];
  appointmentType: string;
  reason: string;
  priority: WaitlistPriority;
  status: WaitlistStatus;
  contactPreference: ContactPreference;
  notes?: string;
  addedDate: Date;
  lastContactDate?: Date;
  scheduledAppointmentId?: string;
  estimatedWaitTime?: number;
  position: number;
}

/**
 * Waitlist statistics
 */
interface WaitlistStats {
  totalEntries: number;
  activeEntries: number;
  contactedEntries: number;
  scheduledEntries: number;
  averageWaitTime: number;
  conversionRate: number;
}

/**
 * Props for the AppointmentWaitlist component
 */
interface AppointmentWaitlistProps {
  /** Waitlist entries */
  entries?: WaitlistEntry[];
  /** Waitlist statistics */
  stats?: WaitlistStats;
  /** Available providers for filtering */
  providers?: Array<{ id: string; name: string; }>;
  /** Available appointment types */
  appointmentTypes?: string[];
  /** Whether user can manage waitlist */
  canManageWaitlist?: boolean;
  /** Whether user can contact patients */
  canContactPatients?: boolean;
  /** Whether user can view patient details */
  canViewPatientDetails?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Entry add handler */
  onAddEntry?: (entry: Omit<WaitlistEntry, 'id' | 'addedDate' | 'position'>) => void;
  /** Entry update handler */
  onUpdateEntry?: (entryId: string, updates: Partial<WaitlistEntry>) => void;
  /** Entry delete handler */
  onDeleteEntry?: (entryId: string) => void;
  /** Entry schedule handler */
  onScheduleEntry?: (entryId: string, appointmentSlot: { date: Date; time: string; providerId: string; }) => void;
  /** Contact patient handler */
  onContactPatient?: (entryId: string, method: ContactPreference, message?: string) => void;
  /** Priority change handler */
  onChangePriority?: (entryId: string, priority: WaitlistPriority) => void;
  /** Position change handler */
  onChangePosition?: (entryId: string, direction: 'up' | 'down') => void;
}

/**
 * AppointmentWaitlist Component
 * 
 * A comprehensive waitlist management system for appointments with patient
 * prioritization, contact tracking, automated notifications, and scheduling
 * capabilities. Supports filtering, searching, and bulk operations.
 * 
 * @param props - AppointmentWaitlist component props
 * @returns JSX element representing the appointment waitlist interface
 */
const AppointmentWaitlist = ({
  entries = [],
  stats,
  providers = [],
  appointmentTypes = [],
  canManageWaitlist = true,
  canContactPatients = true,
  canViewPatientDetails = true,
  className = '',
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onScheduleEntry,
  onContactPatient,
  onChangePriority,
  onChangePosition
}: AppointmentWaitlistProps) => {
  // State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<WaitlistPriority | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<WaitlistStatus | 'all'>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [contactMessage, setContactMessage] = useState<string>('');

  /**
   * Gets priority color and icon
   */
  const getPriorityInfo = (priority: WaitlistPriority) => {
    const priorityInfo = {
      low: { color: 'text-gray-600 bg-gray-100', icon: ArrowDown, label: 'Low' },
      normal: { color: 'text-blue-600 bg-blue-100', icon: Clock, label: 'Normal' },
      high: { color: 'text-orange-600 bg-orange-100', icon: ArrowUp, label: 'High' },
      urgent: { color: 'text-red-600 bg-red-100', icon: AlertCircle, label: 'Urgent' }
    };
    return priorityInfo[priority];
  };

  /**
   * Gets status color and icon
   */
  const getStatusInfo = (status: WaitlistStatus) => {
    const statusInfo = {
      active: { color: 'text-blue-600 bg-blue-100', icon: Clock, label: 'Active' },
      contacted: { color: 'text-yellow-600 bg-yellow-100', icon: Phone, label: 'Contacted' },
      scheduled: { color: 'text-green-600 bg-green-100', icon: CheckCircle, label: 'Scheduled' },
      cancelled: { color: 'text-red-600 bg-red-100', icon: XCircle, label: 'Cancelled' },
      expired: { color: 'text-gray-600 bg-gray-100', icon: AlertCircle, label: 'Expired' }
    };
    return statusInfo[status];
  };

  /**
   * Gets contact preference icon
   */
  const getContactIcon = (preference: ContactPreference) => {
    const icons = {
      phone: Phone,
      email: Mail,
      sms: MessageSquare,
      any: Bell
    };
    return icons[preference];
  };

  /**
   * Filters waitlist entries based on search and filters
   */
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearch = searchQuery === '' || 
        entry.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.appointmentType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPriority = selectedPriority === 'all' || entry.priority === selectedPriority;
      const matchesStatus = selectedStatus === 'all' || entry.status === selectedStatus;
      const matchesProvider = selectedProvider === 'all' || entry.requestedProvider?.id === selectedProvider;
      const matchesType = selectedType === 'all' || entry.appointmentType === selectedType;
      
      return matchesSearch && matchesPriority && matchesStatus && matchesProvider && matchesType;
    }).sort((a, b) => {
      // Sort by priority first, then by position
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.position - b.position;
    });
  }, [entries, searchQuery, selectedPriority, selectedStatus, selectedProvider, selectedType]);

  /**
   * Handles entry scheduling
   */
  const handleScheduleEntry = (entry: WaitlistEntry) => {
    // In a real implementation, this would open a scheduling modal
    const appointmentSlot = {
      date: new Date(),
      time: '09:00',
      providerId: entry.requestedProvider?.id || providers[0]?.id || ''
    };
    onScheduleEntry?.(entry.id, appointmentSlot);
  };

  /**
   * Handles patient contact
   */
  const handleContactPatient = (entry: WaitlistEntry, method: ContactPreference) => {
    setSelectedEntry(entry);
    setShowContactModal(true);
  };

  /**
   * Submits contact message
   */
  const submitContactMessage = () => {
    if (selectedEntry) {
      onContactPatient?.(selectedEntry.id, selectedEntry.contactPreference, contactMessage);
      setShowContactModal(false);
      setContactMessage('');
      setSelectedEntry(null);
    }
  };

  /**
   * Renders waitlist statistics
   */
  const renderStats = () => {
    if (!stats) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalEntries}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-3xl font-bold text-blue-600">{stats.activeEntries}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Wait Time</p>
              <p className="text-3xl font-bold text-orange-600">{stats.averageWaitTime}d</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-3xl font-bold text-green-600">{stats.conversionRate}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders entry actions
   */
  const renderEntryActions = (entry: WaitlistEntry) => (
    <div className="flex items-center space-x-2">
      {canContactPatients && entry.status === 'active' && (
        <button
          onClick={() => handleContactPatient(entry, entry.contactPreference)}
          className="p-1 text-gray-400 hover:text-blue-600"
          title="Contact Patient"
        >
          {(() => {
            const ContactIcon = getContactIcon(entry.contactPreference);
            return <ContactIcon size={16} />;
          })()}
        </button>
      )}
      
      {canManageWaitlist && entry.status === 'active' && (
        <button
          onClick={() => handleScheduleEntry(entry)}
          className="p-1 text-gray-400 hover:text-green-600"
          title="Schedule Appointment"
        >
          <Calendar size={16} />
        </button>
      )}
      
      {canManageWaitlist && (
        <>
          <button
            onClick={() => onChangePosition?.(entry.id, 'up')}
            disabled={entry.position === 1}
            className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
            title="Move Up"
          >
            <ArrowUp size={16} />
          </button>
          <button
            onClick={() => onChangePosition?.(entry.id, 'down')}
            className="p-1 text-gray-400 hover:text-blue-600"
            title="Move Down"
          >
            <ArrowDown size={16} />
          </button>
        </>
      )}
      
      {canViewPatientDetails && (
        <button
          onClick={() => setSelectedEntry(entry)}
          className="p-1 text-gray-400 hover:text-indigo-600"
          title="View Details"
        >
          <Eye size={16} />
        </button>
      )}
      
      {canManageWaitlist && (
        <button
          onClick={() => onDeleteEntry?.(entry.id)}
          className="p-1 text-gray-400 hover:text-red-600"
          title="Remove from Waitlist"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );

  return (
    <div className={`max-w-7xl mx-auto p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointment Waitlist</h1>
          <p className="text-gray-600 mt-1">Manage patient waitlist and scheduling requests</p>
        </div>
        {canManageWaitlist && (
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                     bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Waitlist
          </button>
        )}
      </div>

      {/* Statistics */}
      {renderStats()}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients, reasons, or types..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select
            value={selectedPriority}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPriority(e.target.value as WaitlistPriority | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value as WaitlistStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Scheduled</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>
          
          <select
            value={selectedProvider}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedProvider(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Providers</option>
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
          
          <select
            value={selectedType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            {appointmentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Waitlist Entries */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Waitlist Entries ({filteredEntries.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => {
              const priorityInfo = getPriorityInfo(entry.priority);
              const statusInfo = getStatusInfo(entry.status);
              const PriorityIcon = priorityInfo.icon;
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={entry.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Position Badge */}
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
                        #{entry.position}
                      </div>
                      
                      {/* Patient Info */}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{entry.patient.name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{entry.appointmentType}</span>
                            {entry.requestedProvider && (
                              <>
                                <span>•</span>
                                <span>{entry.requestedProvider.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Priority */}
                      <div className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${priorityInfo.color}`}>
                        <PriorityIcon className="w-3 h-3 mr-1" />
                        {priorityInfo.label}
                      </div>
                      
                      {/* Status */}
                      <div className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </div>
                      
                      {/* Wait Time */}
                      <div className="text-sm text-gray-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {Math.ceil((new Date().getTime() - entry.addedDate.getTime()) / (1000 * 60 * 60 * 24))}d
                      </div>
                      
                      {/* Actions */}
                      {renderEntryActions(entry)}
                    </div>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="mt-3 ml-12">
                    <p className="text-sm text-gray-700">{entry.reason}</p>
                    {entry.notes && (
                      <p className="text-sm text-gray-500 mt-1">Note: {entry.notes}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Added: {entry.addedDate.toLocaleDateString()}</span>
                      {entry.lastContactDate && (
                        <span>Last Contact: {entry.lastContactDate.toLocaleDateString()}</span>
                      )}
                      <span>Contact: {entry.contactPreference}</span>
                      {entry.preferredTimeSlots.length > 0 && (
                        <span>Preferred: {entry.preferredTimeSlots.join(', ')}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No waitlist entries</h3>
              <p className="text-gray-600">
                {searchQuery || selectedPriority !== 'all' || selectedStatus !== 'all' 
                  ? 'No entries match your current filters.' 
                  : 'The waitlist is currently empty.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Contact {selectedEntry.patient.name}
              </h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Contact via: {selectedEntry.contactPreference}
              </p>
              <div className="text-sm text-gray-800">
                {selectedEntry.contactPreference === 'phone' && (
                  <p><Phone className="w-4 h-4 inline mr-1" />{selectedEntry.patient.phone}</p>
                )}
                {selectedEntry.contactPreference === 'email' && (
                  <p><Mail className="w-4 h-4 inline mr-1" />{selectedEntry.patient.email}</p>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={contactMessage}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContactMessage(e.target.value)}
                rows={3}
                placeholder="Add a personal message..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={submitContactMessage}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Contact Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentWaitlist;
