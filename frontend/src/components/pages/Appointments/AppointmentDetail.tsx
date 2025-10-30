'use client';

import React, { useState } from 'react';
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RotateCcw,
  MessageSquare,
  Video,
  Users,
  AlertTriangle,
  Stethoscope,
  ClipboardList,
  Camera,
  Download,
  Share2,
  Bell,
  History
} from 'lucide-react';
import type { Appointment } from './AppointmentCard';

/**
 * Appointment status configuration
 */
const statusConfig = {
  scheduled: {
    label: 'Scheduled',
    color: 'blue',
    icon: Calendar,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  confirmed: {
    label: 'Confirmed',
    color: 'green',
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
  'checked-in': {
    label: 'Checked In',
    color: 'yellow',
    icon: Users,
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200'
  },
  'in-progress': {
    label: 'In Progress',
    color: 'amber',
    icon: Clock,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200'
  },
  completed: {
    label: 'Completed',
    color: 'emerald',
    icon: CheckCircle,
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'red',
    icon: XCircle,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  },
  'no-show': {
    label: 'No Show',
    color: 'gray',
    icon: AlertTriangle,
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200'
  },
  rescheduled: {
    label: 'Rescheduled',
    color: 'indigo',
    icon: RotateCcw,
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200'
  }
} as const;

/**
 * Priority configuration
 */
const priorityConfig = {
  low: { label: 'Low', color: 'text-green-600', bgColor: 'bg-green-50' },
  normal: { label: 'Normal', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  high: { label: 'High', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  urgent: { label: 'Urgent', color: 'text-red-600', bgColor: 'bg-red-50' }
} as const;

/**
 * Props for the AppointmentDetail component
 */
interface AppointmentDetailProps {
  /** Appointment data to display */
  appointment: Appointment;
  /** Whether the component is in read-only mode */
  readOnly?: boolean;
  /** Whether to show patient information */
  showPatient?: boolean;
  /** Whether to show provider information */
  showProvider?: boolean;
  /** Whether to show action buttons */
  showActions?: boolean;
  /** Whether to show notes section */
  showNotes?: boolean;
  /** Whether to show attachments section */
  showAttachments?: boolean;
  /** Whether to show history section */
  showHistory?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Edit appointment handler */
  onEdit?: (appointment: Appointment) => void;
  /** Delete appointment handler */
  onDelete?: (appointmentId: string) => void;
  /** Cancel appointment handler */
  onCancel?: (appointmentId: string) => void;
  /** Confirm appointment handler */
  onConfirm?: (appointmentId: string) => void;
  /** Reschedule appointment handler */
  onReschedule?: (appointment: Appointment) => void;
  /** Check-in appointment handler */
  onCheckIn?: (appointmentId: string) => void;
  /** Complete appointment handler */
  onComplete?: (appointmentId: string) => void;
  /** Start appointment handler */
  onStart?: (appointmentId: string) => void;
  /** Join virtual appointment handler */
  onJoinVirtual?: (virtualLink: string) => void;
  /** Send message handler */
  onMessage?: (appointment: Appointment) => void;
  /** Share appointment handler */
  onShare?: (appointment: Appointment) => void;
  /** Print appointment handler */
  onPrint?: (appointment: Appointment) => void;
  /** Download attachment handler */
  onDownloadAttachment?: (attachmentId: string) => void;
  /** Add note handler */
  onAddNote?: (appointmentId: string, note: string) => void;
}

/**
 * AppointmentDetail Component
 * 
 * A comprehensive detail view component for displaying appointment information
 * including patient details, provider information, scheduling details, notes,
 * attachments, and action buttons. Supports different modes and customization.
 * 
 * @param props - AppointmentDetail component props
 * @returns JSX element representing the appointment detail view
 */
const AppointmentDetail: React.FC<AppointmentDetailProps> = ({
  appointment,
  readOnly = false,
  showPatient = true,
  showProvider = true,
  showActions = true,
  showNotes = true,
  showAttachments = true,
  showHistory = false,
  className = '',
  onEdit,
  onDelete,
  onCancel,
  onConfirm,
  onReschedule,
  onCheckIn,
  onComplete,
  onStart,
  onJoinVirtual,
  onMessage,
  onShare,
  onPrint,
  onDownloadAttachment,
  onAddNote
}) => {
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'attachments' | 'history'>('details');

  const statusInfo = statusConfig[appointment.status];
  const priorityInfo = priorityConfig[appointment.priority];
  const StatusIcon = statusInfo.icon;

  /**
   * Handles note submission
   */
  const handleSubmitNote = (): void => {
    if (!newNote.trim() || !onAddNote) return;
    
    onAddNote(appointment.id, newNote.trim());
    setNewNote('');
    setShowAddNote(false);
  };

  /**
   * Formats date and time
   */
  const formatDateTime = (dateString: string): { date: string; time: string } => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  /**
   * Gets appointment duration
   */
  const getDuration = (): string => {
    const minutes = appointment.duration;
    
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  /**
   * Renders action buttons
   */
  const renderActions = (): React.ReactNode => {
    if (!showActions || readOnly) return null;

    const actions = [];

    // Status-specific actions
    switch (appointment.status) {
      case 'scheduled':
        actions.push(
          { key: 'confirm', label: 'Confirm', icon: CheckCircle, onClick: () => onConfirm?.(appointment.id), color: 'green' },
          { key: 'checkin', label: 'Check In', icon: Users, onClick: () => onCheckIn?.(appointment.id), color: 'blue' }
        );
        break;
      case 'confirmed':
        actions.push(
          { key: 'checkin', label: 'Check In', icon: Users, onClick: () => onCheckIn?.(appointment.id), color: 'blue' },
          { key: 'start', label: 'Start', icon: Clock, onClick: () => onStart?.(appointment.id), color: 'green' }
        );
        break;
      case 'in-progress':
        actions.push(
          { key: 'complete', label: 'Complete', icon: CheckCircle, onClick: () => onComplete?.(appointment.id), color: 'green' }
        );
        break;
    }

    // Virtual appointment action
    if (appointment.type === 'virtual' && appointment.location.virtualLink) {
      actions.push(
        { key: 'join', label: 'Join Virtual', icon: Video, onClick: () => onJoinVirtual?.(appointment.location.virtualLink!), color: 'purple' }
      );
    }

    // Common actions
    if (appointment.status !== 'completed' && appointment.status !== 'cancelled') {
      actions.push(
        { key: 'edit', label: 'Edit', icon: Edit, onClick: () => onEdit?.(appointment), color: 'gray' },
        { key: 'reschedule', label: 'Reschedule', icon: RotateCcw, onClick: () => onReschedule?.(appointment), color: 'yellow' },
        { key: 'cancel', label: 'Cancel', icon: XCircle, onClick: () => onCancel?.(appointment.id), color: 'red' }
      );
    }

    // Communication actions
    actions.push(
      { key: 'message', label: 'Message', icon: MessageSquare, onClick: () => onMessage?.(appointment), color: 'blue' }
    );

    // Utility actions
    actions.push(
      { key: 'share', label: 'Share', icon: Share2, onClick: () => onShare?.(appointment), color: 'gray' },
      { key: 'print', label: 'Print', icon: Download, onClick: () => onPrint?.(appointment), color: 'gray' }
    );

    if (appointment.status !== 'cancelled') {
      actions.push(
        { key: 'delete', label: 'Delete', icon: Trash2, onClick: () => onDelete?.(appointment.id), color: 'red' }
      );
    }

    return (
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {actions.map(({ key, label, icon: Icon, onClick, color }) => (
            <button
              key={key}
              onClick={onClick}
              className={`
                inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${color === 'green' ? 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500' :
                  color === 'blue' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-500' :
                  color === 'purple' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 focus:ring-purple-500' :
                  color === 'yellow' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:ring-yellow-500' :
                  color === 'red' ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500' :
                  'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500'
                }
              `}
              aria-label={label}
            >
              <Icon size={16} className="mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renders tab navigation
   */
  const renderTabs = (): React.ReactNode => {
    const tabs = [
      { key: 'details' as const, label: 'Details', icon: FileText },
      ...(showNotes ? [{ key: 'notes' as const, label: 'Notes', icon: ClipboardList }] : []),
      ...(showAttachments ? [{ key: 'attachments' as const, label: 'Attachments', icon: Camera }] : []),
      ...(showHistory ? [{ key: 'history' as const, label: 'History', icon: History }] : [])
    ];

    if (tabs.length <= 1) return null;

    return (
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`
                flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                ${activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={activeTab === key ? 'page' : undefined}
            >
              <Icon size={16} className="mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>
    );
  };

  /**
   * Renders details tab content
   */
  const renderDetailsTab = (): React.ReactNode => {
    const { date, time } = formatDateTime(appointment.dateTime);

    return (
      <div className="p-6 space-y-6">
        {/* Status and Priority */}
        <div className="flex items-center justify-between">
          <div className={`
            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor} border
          `}>
            <StatusIcon size={16} className="mr-2" />
            {statusInfo.label}
          </div>
          
          <div className={`
            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${priorityInfo.bgColor} ${priorityInfo.color}
          `}>
            <AlertTriangle size={16} className="mr-2" />
            {priorityInfo.label} Priority
          </div>
        </div>

        {/* Appointment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">{date}</div>
                <div className="text-sm text-gray-600">{time}</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">Duration</div>
                <div className="text-sm text-gray-600">{getDuration()}</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Stethoscope className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">Appointment Type</div>
                <div className="text-sm text-gray-600 capitalize">{appointment.type.replace('-', ' ')}</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">Location</div>
                <div className="text-sm text-gray-600">
                  {appointment.location.room && `${appointment.location.room}${appointment.location.building ? `, ${appointment.location.building}` : ''}`}
                  {appointment.location.address && !appointment.location.room && appointment.location.address}
                  {appointment.location.isVirtual && 'Virtual Appointment'}
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">Reason</div>
                <div className="text-sm text-gray-600">{appointment.reason}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {showPatient && (
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Patient</div>
                  <div className="text-sm text-gray-600">{appointment.patient.name}</div>
                  {appointment.patient.email && <div className="text-sm text-gray-500">{appointment.patient.email}</div>}
                  {appointment.patient.phone && <div className="text-sm text-gray-500">{appointment.patient.phone}</div>}
                </div>
              </div>
            )}

            {showProvider && (
              <div className="flex items-start space-x-3">
                <Stethoscope className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Provider</div>
                  <div className="text-sm text-gray-600">{appointment.provider.name}</div>
                  <div className="text-sm text-gray-500">{appointment.provider.title}</div>
                  <div className="text-sm text-gray-500">{appointment.provider.department}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {appointment.notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              {appointment.notes}
            </p>
          </div>
        )}

        {/* Preparation Instructions */}
        {appointment.preparationInstructions && appointment.preparationInstructions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Preparation Instructions</h4>
            <ul className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md border-l-4 border-blue-200 list-disc list-inside space-y-1">
              {appointment.preparationInstructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Insurance Information */}
        {appointment.insurance && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Insurance Information</h4>
            <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-md space-y-1">
              <div><strong>Provider:</strong> {appointment.insurance.provider}</div>
              <div><strong>Policy Number:</strong> {appointment.insurance.policyNumber}</div>
              {appointment.insurance.groupNumber && (
                <div><strong>Group Number:</strong> {appointment.insurance.groupNumber}</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  /**
   * Renders notes tab content
   */
  const renderNotesTab = (): React.ReactNode => {
    if (!showNotes) return null;

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Notes</h3>
          {!readOnly && (
            <button
              onClick={() => setShowAddNote(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
                       font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ClipboardList size={16} className="mr-2" />
              Add Note
            </button>
          )}
        </div>

        {/* Add Note Form */}
        {showAddNote && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                       focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <div className="mt-3 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddNote(false);
                  setNewNote('');
                }}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300
                         rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2
                         focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitNote}
                disabled={!newNote.trim()}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent
                         rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                         focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Note
              </button>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <ClipboardList size={48} className="mx-auto mb-3 text-gray-300" />
            <p>Additional notes feature coming soon</p>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders attachments tab content
   */
  const renderAttachmentsTab = (): React.ReactNode => {
    if (!showAttachments) return null;

    return (
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Attachments</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="col-span-full text-center py-8 text-gray-500">
            <Camera size={48} className="mx-auto mb-3 text-gray-300" />
            <p>Attachments feature coming soon</p>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders history tab content
   */
  const renderHistoryTab = (): React.ReactNode => {
    if (!showHistory) return null;

    return (
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">History</h3>
        
        <div className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <History size={48} className="mx-auto mb-3 text-gray-300" />
            <p>History tracking feature coming soon</p>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders tab content based on active tab
   */
  const renderTabContent = (): React.ReactNode => {
    switch (activeTab) {
      case 'details':
        return renderDetailsTab();
      case 'notes':
        return renderNotesTab();
      case 'attachments':
        return renderAttachmentsTab();
      case 'history':
        return renderHistoryTab();
      default:
        return renderDetailsTab();
    }
  };

  return (
    <div className={`bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Appointment Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {appointment.patient.name} • {formatDateTime(appointment.dateTime).date}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-sm text-gray-600">
              <Bell size={16} className="mr-1" />
              {appointment.priority === 'urgent' ? 'Urgent Priority' : 'Standard Priority'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {renderTabs()}

      {/* Content */}
      {renderTabContent()}

      {/* Actions */}
      {renderActions()}
    </div>
  );
};

export default AppointmentDetail;
