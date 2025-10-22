import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Video, 
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2
} from 'lucide-react';
import { Appointment } from './UpcomingAppointments';

interface AppointmentCardProps {
  appointment: Appointment;
  className?: string;
  compact?: boolean;
  showActions?: boolean;
  onClick?: (appointment: Appointment) => void;
  onEdit?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onConfirm?: (appointment: Appointment) => void;
}

const getTypeIcon = (type: Appointment['type']) => {
  switch (type) {
    case 'telehealth':
      return Video;
    case 'procedure':
      return Calendar;
    case 'emergency':
      return AlertCircle;
    default:
      return User;
  }
};

const getTypeColor = (type: Appointment['type']) => {
  switch (type) {
    case 'emergency':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'telehealth':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'procedure':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'follow-up':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'consultation':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusColor = (status: Appointment['status']) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'no-show':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityIndicator = (priority: Appointment['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'border-l-4 border-l-red-500';
    case 'high':
      return 'border-l-4 border-l-orange-500';
    case 'medium':
      return 'border-l-4 border-l-yellow-500';
    case 'low':
      return 'border-l-4 border-l-green-500';
    default:
      return 'border-l-4 border-l-gray-300';
  }
};

const formatDateTime = (date: Date): { 
  date: string; 
  time: string; 
  isToday: boolean; 
  isUrgent: boolean;
  dayName: string;
} => {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isUrgent = date.getTime() - now.getTime() < 2 * 60 * 60 * 1000;

  return {
    date: date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    }),
    time: date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
    dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
    isToday,
    isUrgent,
  };
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  className,
  compact = false,
  showActions = true,
  onClick,
  onEdit,
  onCancel,
  onConfirm,
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  const IconComponent = getTypeIcon(appointment.type);
  const typeColor = getTypeColor(appointment.type);
  const statusColor = getStatusColor(appointment.status);
  const priorityIndicator = getPriorityIndicator(appointment.priority);
  const dateTime = formatDateTime(appointment.dateTime);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const canConfirm = appointment.status === 'scheduled';
  const canCancel = ['scheduled', 'confirmed'].includes(appointment.status);

  return (
    <div
      className={twMerge(
        clsx(
          'bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200',
          priorityIndicator,
          compact ? 'p-4' : 'p-6',
          onClick && 'cursor-pointer',
          className
        )
      )}
      onClick={() => onClick?.(appointment)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Type Icon */}
          <div className={clsx(
            'flex-shrink-0 p-2 rounded-lg border',
            typeColor
          )}>
            <IconComponent className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className={clsx(
                  'font-semibold text-gray-900 truncate',
                  compact ? 'text-sm' : 'text-base'
                )}>
                  {appointment.title}
                </h3>
                <p className={clsx(
                  'text-gray-600 truncate',
                  compact ? 'text-xs' : 'text-sm'
                )}>
                  {appointment.patientName}
                </p>
              </div>
              
              {/* Status Badge */}
              <span className={clsx(
                'inline-flex items-center px-2 py-1 rounded-full font-medium ml-2',
                compact ? 'text-xs' : 'text-xs',
                statusColor
              )}>
                {appointment.status.replace('-', ' ')}
              </span>
            </div>

            {/* Description */}
            {!compact && appointment.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {appointment.description}
              </p>
            )}

            {/* Date and Time */}
            <div className={clsx(
              'flex items-center space-x-4 mb-3',
              compact && 'mb-2'
            )}>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className={clsx(
                  dateTime.isToday && 'font-medium text-blue-600',
                  dateTime.isUrgent && 'font-medium text-red-600'
                )}>
                  {dateTime.dayName}, {dateTime.date}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className={clsx(
                  dateTime.isUrgent && 'font-medium text-red-600'
                )}>
                  {dateTime.time}
                </span>
              </div>
              {!compact && (
                <span className="text-xs text-gray-400">
                  ({appointment.duration} min)
                </span>
              )}
            </div>

            {/* Provider and Location */}
            {!compact && (
              <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{appointment.provider.name}</span>
                </div>
                {appointment.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{appointment.location}</span>
                  </div>
                )}
                {appointment.contactMethod && (
                  <div className="flex items-center">
                    {appointment.contactMethod === 'video' && <Video className="h-4 w-4 mr-1" />}
                    {appointment.contactMethod === 'phone' && <Phone className="h-4 w-4 mr-1" />}
                    {appointment.contactMethod === 'in-person' && <MapPin className="h-4 w-4 mr-1" />}
                    <span className="capitalize">{appointment.contactMethod.replace('-', ' ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Urgent Notes */}
            {appointment.notes && appointment.priority === 'urgent' && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-xs text-red-700">{appointment.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        {showActions && (
          <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(appointment);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Appointment
                  </button>
                )}
                
                {onConfirm && canConfirm && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onConfirm(appointment);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm
                  </button>
                )}
                
                {onCancel && canCancel && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancel(appointment);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
