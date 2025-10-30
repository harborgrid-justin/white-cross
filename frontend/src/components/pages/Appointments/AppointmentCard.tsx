'use client';

import React from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Edit,
  Trash2,
  MessageSquare,
  Video,
  FileText
} from 'lucide-react';

/**
 * Represents an appointment in the healthcare system
 */
export interface Appointment {
  /** Unique identifier for the appointment */
  id: string;
  /** Patient information */
  patient: {
    id: string;
    name: string;
    dateOfBirth: string;
    avatar?: string;
    phone?: string;
    email?: string;
  };
  /** Healthcare provider information */
  provider: {
    id: string;
    name: string;
    title: string;
    avatar?: string;
    department: string;
  };
  /** Appointment date and time */
  dateTime: string;
  /** Duration in minutes */
  duration: number;
  /** Type of appointment */
  type: AppointmentType;
  /** Current status of the appointment */
  status: AppointmentStatus;
  /** Priority level */
  priority: AppointmentPriority;
  /** Reason for the appointment */
  reason: string;
  /** Location details */
  location: {
    room?: string;
    building?: string;
    address?: string;
    isVirtual: boolean;
    virtualLink?: string;
  };
  /** Special notes or instructions */
  notes?: string;
  /** Associated insurance information */
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
  /** Estimated cost */
  estimatedCost?: number;
  /** Whether patient needs to arrive early */
  arrivalBuffer?: number;
  /** Preparation instructions */
  preparationInstructions?: string[];
  /** Last updated timestamp */
  lastUpdated: string;
  /** Created by user */
  createdBy: string;
}

/**
 * Types of appointments available
 */
export type AppointmentType = 
  | 'consultation'
  | 'follow-up'
  | 'procedure'
  | 'emergency'
  | 'screening'
  | 'vaccination'
  | 'therapy'
  | 'surgery'
  | 'diagnostic'
  | 'virtual';

/**
 * Possible appointment statuses
 */
export type AppointmentStatus = 
  | 'scheduled'
  | 'confirmed'
  | 'checked-in'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'no-show'
  | 'rescheduled';

/**
 * Priority levels for appointments
 */
export type AppointmentPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Props for the AppointmentCard component
 */
interface AppointmentCardProps {
  /** Appointment data to display */
  appointment: Appointment;
  /** Whether the card is in compact mode */
  compact?: boolean;
  /** Whether to show patient information */
  showPatient?: boolean;
  /** Whether to show provider information */
  showProvider?: boolean;
  /** Whether actions are available */
  showActions?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Click handler for the card */
  onClick?: (appointment: Appointment) => void;
  /** Edit handler */
  onEdit?: (appointment: Appointment) => void;
  /** Delete handler */
  onDelete?: (appointmentId: string) => void;
  /** Cancel handler */
  onCancel?: (appointmentId: string) => void;
  /** Reschedule handler */
  onReschedule?: (appointment: Appointment) => void;
  /** Check-in handler */
  onCheckIn?: (appointmentId: string) => void;
  /** Complete handler */
  onComplete?: (appointmentId: string) => void;
  /** Message handler */
  onMessage?: (appointment: Appointment) => void;
  /** Join virtual appointment handler */
  onJoinVirtual?: (virtualLink: string) => void;
}

/**
 * AppointmentCard Component
 * 
 * A comprehensive card component for displaying appointment information with
 * support for different layouts, status indicators, and action buttons.
 * Includes accessibility features and responsive design.
 * 
 * @param props - AppointmentCard component props
 * @returns JSX element representing an appointment card
 */
const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  compact = false,
  showPatient = true,
  showProvider = true,
  showActions = true,
  className = '',
  onClick,
  onEdit,
  onDelete,
  onCancel,
  onReschedule,
  onCheckIn,
  onComplete,
  onMessage,
  onJoinVirtual
}) => {
  /**
   * Formats date and time for display
   */
  const formatDateTime = (dateTime: string): { date: string; time: string } => {
    const dt = new Date(dateTime);
    const date = dt.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
    const time = dt.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
    return { date, time };
  };

  /**
   * Gets appropriate status styling
   */
  const getStatusStyle = (status: AppointmentStatus): string => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      'checked-in': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      'no-show': 'bg-orange-100 text-orange-800 border-orange-200',
      rescheduled: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return styles[status] || styles.scheduled;
  };

  /**
   * Gets appropriate priority styling
   */
  const getPriorityStyle = (priority: AppointmentPriority): string => {
    const styles = {
      low: 'border-l-gray-300',
      normal: 'border-l-blue-400',
      high: 'border-l-orange-400',
      urgent: 'border-l-red-500'
    };
    return styles[priority];
  };

  /**
   * Gets status icon component
   */
  const getStatusIcon = (status: AppointmentStatus): React.ReactNode => {
    const iconProps = { size: 16, className: 'inline' };
    
    switch (status) {
      case 'completed':
        return <CheckCircle {...iconProps} className="text-green-600" />;
      case 'cancelled':
      case 'no-show':
        return <XCircle {...iconProps} className="text-red-600" />;
      case 'in-progress':
        return <AlertCircle {...iconProps} className="text-purple-600" />;
      default:
        return <Clock {...iconProps} className="text-blue-600" />;
    }
  };

  /**
   * Handles card click
   */
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.(appointment);
  };

  /**
   * Handles action button clicks
   */
  const handleAction = (
    e: React.MouseEvent,
    action: () => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  const { date, time } = formatDateTime(appointment.dateTime);
  const isVirtual = appointment.location.isVirtual;
  const canCheckIn = appointment.status === 'confirmed';
  const canComplete = appointment.status === 'in-progress';
  const canCancel = !['completed', 'cancelled', 'no-show'].includes(appointment.status);

  return (
    <div
      className={`
        bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md
        transition-all duration-200 cursor-pointer border-l-4
        ${getPriorityStyle(appointment.priority)}
        ${compact ? 'p-4' : 'p-6'}
        ${className}
      `}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(appointment);
        }
      }}
      aria-label={`Appointment with ${appointment.provider.name} on ${date} at ${time}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {getStatusIcon(appointment.status)}
            <span className="font-semibold text-gray-900">
              {appointment.reason}
            </span>
          </div>
          {isVirtual && (
            <div className="flex items-center space-x-1 text-blue-600">
              <Video size={16} />
              <span className="text-sm font-medium">Virtual</span>
            </div>
          )}
        </div>
        
        <div className={`
          px-3 py-1 rounded-full text-xs font-medium border
          ${getStatusStyle(appointment.status)}
        `}>
          {appointment.status.replace('-', ' ').toUpperCase()}
        </div>
      </div>

      {/* DateTime and Duration */}
      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Calendar size={16} />
          <span>{date}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock size={16} />
          <span>{time} ({appointment.duration}min)</span>
        </div>
        {appointment.location.room && (
          <div className="flex items-center space-x-1">
            <MapPin size={16} />
            <span>{appointment.location.room}</span>
          </div>
        )}
      </div>

      {/* Patient and Provider Info */}
      <div className={`grid ${compact ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-4'} mb-4`}>
        {showPatient && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              {appointment.patient.avatar ? (
                <img
                  src={appointment.patient.avatar}
                  alt={appointment.patient.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User size={20} className="text-blue-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {appointment.patient.name}
              </p>
              <p className="text-xs text-gray-500">
                Patient
              </p>
            </div>
          </div>
        )}

        {showProvider && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              {appointment.provider.avatar ? (
                <img
                  src={appointment.provider.avatar}
                  alt={appointment.provider.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User size={20} className="text-green-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {appointment.provider.name}
              </p>
              <p className="text-xs text-gray-500">
                {appointment.provider.title}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Notes and Preparation */}
      {!compact && (appointment.notes || appointment.preparationInstructions) && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          {appointment.notes && (
            <p className="text-sm text-gray-700 mb-2">
              <strong>Notes:</strong> {appointment.notes}
            </p>
          )}
          {appointment.preparationInstructions && appointment.preparationInstructions.length > 0 && (
            <div className="text-sm text-gray-700">
              <strong>Preparation:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {appointment.preparationInstructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            {canCheckIn && (
              <button
                onClick={(e) => handleAction(e, () => onCheckIn?.(appointment.id))}
                className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-md 
                         hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Check in patient"
              >
                Check In
              </button>
            )}
            
            {canComplete && (
              <button
                onClick={(e) => handleAction(e, () => onComplete?.(appointment.id))}
                className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-md 
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Complete appointment"
              >
                Complete
              </button>
            )}

            {isVirtual && appointment.location.virtualLink && (
              <button
                onClick={(e) => handleAction(e, () => onJoinVirtual?.(appointment.location.virtualLink!))}
                className="px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-md 
                         hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Join virtual appointment"
              >
                Join Call
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {appointment.patient.phone && (
              <button
                onClick={(e) => handleAction(e, () => window.open(`tel:${appointment.patient.phone}`))}
                className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none 
                         focus:ring-2 focus:ring-blue-500 rounded-md"
                aria-label="Call patient"
              >
                <Phone size={16} />
              </button>
            )}

            <button
              onClick={(e) => handleAction(e, () => onMessage?.(appointment))}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label="Send message"
            >
              <MessageSquare size={16} />
            </button>

            <button
              onClick={(e) => handleAction(e, () => onEdit?.(appointment))}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label="Edit appointment"
            >
              <Edit size={16} />
            </button>

            {canCancel && (
              <button
                onClick={(e) => handleAction(e, () => onCancel?.(appointment.id))}
                className="p-2 text-gray-400 hover:text-red-600 focus:outline-none 
                         focus:ring-2 focus:ring-red-500 rounded-md"
                aria-label="Cancel appointment"
              >
                <XCircle size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
