import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Calendar, Clock, User, MapPin, Phone, Video, Plus, ChevronRight } from 'lucide-react';

// Types
export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  type: 'consultation' | 'follow-up' | 'procedure' | 'emergency' | 'telehealth';
  title: string;
  description?: string;
  dateTime: Date;
  duration: number; // in minutes
  location?: string;
  provider: {
    name: string;
    role: string;
    department: string;
  };
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  contactMethod?: 'in-person' | 'phone' | 'video';
  notes?: string;
}

interface UpcomingAppointmentsProps {
  className?: string;
  appointments?: Appointment[];
  maxItems?: number;
  showAddButton?: boolean;
  onAppointmentClick?: (appointment: Appointment) => void;
  onAddAppointment?: () => void;
  onViewAll?: () => void;
}

// Mock appointments data
const generateMockAppointments = (): Appointment[] => [
  {
    id: '1',
    patientName: 'Sarah Johnson',
    patientId: 'P-2024-001',
    type: 'consultation',
    title: 'Cardiology Consultation',
    description: 'Initial consultation for chest pain and irregular heartbeat',
    dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    duration: 45,
    location: 'Room 301 - Cardiology Wing',
    provider: {
      name: 'Dr. Michael Smith',
      role: 'Cardiologist',
      department: 'Cardiology',
    },
    status: 'confirmed',
    priority: 'high',
    contactMethod: 'in-person',
    notes: 'Patient reports chest pain for the past week',
  },
  {
    id: '2',
    patientName: 'Robert Davis',
    patientId: 'P-2024-002',
    type: 'follow-up',
    title: 'Post-Surgery Follow-up',
    description: 'Follow-up appointment after knee replacement surgery',
    dateTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    duration: 30,
    location: 'Room 205 - Orthopedics',
    provider: {
      name: 'Dr. Jennifer Martinez',
      role: 'Orthopedic Surgeon',
      department: 'Orthopedics',
    },
    status: 'scheduled',
    priority: 'medium',
    contactMethod: 'in-person',
  },
  {
    id: '3',
    patientName: 'Maria Garcia',
    patientId: 'P-2024-003',
    type: 'telehealth',
    title: 'Diabetes Management',
    description: 'Remote consultation for diabetes monitoring and medication adjustment',
    dateTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    duration: 20,
    provider: {
      name: 'Dr. Anna Chen',
      role: 'Endocrinologist',
      department: 'Endocrinology',
    },
    status: 'confirmed',
    priority: 'medium',
    contactMethod: 'video',
    notes: 'Review recent blood sugar logs',
  },
  {
    id: '4',
    patientName: 'James Miller',
    patientId: 'P-2024-004',
    type: 'procedure',
    title: 'Blood Work & Lab Tests',
    description: 'Routine blood work and comprehensive metabolic panel',
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    duration: 15,
    location: 'Laboratory - Ground Floor',
    provider: {
      name: 'Lab Team',
      role: 'Medical Technician',
      department: 'Laboratory',
    },
    status: 'scheduled',
    priority: 'low',
    contactMethod: 'in-person',
  },
  {
    id: '5',
    patientName: 'David Thompson',
    patientId: 'P-2024-005',
    type: 'emergency',
    title: 'Emergency Assessment',
    description: 'Urgent assessment for severe abdominal pain',
    dateTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    duration: 60,
    location: 'Emergency Room',
    provider: {
      name: 'Dr. Lisa Wilson',
      role: 'Emergency Physician',
      department: 'Emergency Medicine',
    },
    status: 'confirmed',
    priority: 'urgent',
    contactMethod: 'in-person',
    notes: 'URGENT: Patient in severe pain, requires immediate attention',
  },
];

const getTypeIcon = (type: Appointment['type']) => {
  switch (type) {
    case 'telehealth':
      return Video;
    case 'procedure':
      return Calendar;
    case 'emergency':
      return Clock;
    default:
      return User;
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

const getPriorityColor = (priority: Appointment['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'border-l-red-500 bg-red-50';
    case 'high':
      return 'border-l-orange-500 bg-orange-50';
    case 'medium':
      return 'border-l-yellow-500 bg-yellow-50';
    case 'low':
      return 'border-l-green-500 bg-green-50';
    default:
      return 'border-l-gray-500 bg-gray-50';
  }
};

const formatDateTime = (date: Date): { date: string; time: string; isToday: boolean; isUrgent: boolean } => {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isUrgent = date.getTime() - now.getTime() < 2 * 60 * 60 * 1000; // Less than 2 hours

  return {
    date: date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
    time: date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
    isToday,
    isUrgent,
  };
};

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  className,
  appointments = generateMockAppointments(),
  maxItems = 5,
  showAddButton = true,
  onAppointmentClick,
  onAddAppointment,
  onViewAll,
}) => {
  const displayedAppointments = appointments
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
    .slice(0, maxItems);

  return (
    <div className={twMerge(clsx('bg-white rounded-lg border border-gray-200', className))}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
          <div className="flex items-center space-x-2">
            {showAddButton && (
              <button
                onClick={onAddAppointment}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                New
              </button>
            )}
            {onViewAll && (
              <button
                onClick={onViewAll}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="divide-y divide-gray-100">
        {displayedAppointments.length > 0 ? (
          displayedAppointments.map((appointment) => {
            const IconComponent = getTypeIcon(appointment.type);
            const statusColor = getStatusColor(appointment.status);
            const priorityColor = getPriorityColor(appointment.priority);
            const dateTime = formatDateTime(appointment.dateTime);

            return (
              <div
                key={appointment.id}
                className={clsx(
                  'p-6 hover:bg-gray-50 transition-colors duration-150 border-l-4',
                  priorityColor,
                  onAppointmentClick && 'cursor-pointer'
                )}
                onClick={() => onAppointmentClick?.(appointment)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Icon and Status */}
                    <div className="flex-shrink-0">
                      <div className="p-2 bg-white rounded-lg shadow-sm border">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title and Patient */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-base font-medium text-gray-900 truncate">
                            {appointment.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {appointment.patientName} • {appointment.patientId}
                          </p>
                        </div>
                        
                        {/* Status Badge */}
                        <span className={clsx(
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-3',
                          statusColor
                        )}>
                          {appointment.status.replace('-', ' ')}
                        </span>
                      </div>

                      {/* Description */}
                      {appointment.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {appointment.description}
                        </p>
                      )}

                      {/* Date/Time and Duration */}
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className={clsx(
                            dateTime.isToday && 'font-medium text-blue-600',
                            dateTime.isUrgent && 'font-medium text-red-600'
                          )}>
                            {dateTime.date}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className={clsx(
                            dateTime.isUrgent && 'font-medium text-red-600'
                          )}>
                            {dateTime.time}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          ({appointment.duration} min)
                        </span>
                      </div>

                      {/* Provider and Location */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{appointment.provider.name}</span>
                        </div>
                        {appointment.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{appointment.location}</span>
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

                      {/* Notes for urgent appointments */}
                      {appointment.notes && appointment.priority === 'urgent' && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm text-red-700">{appointment.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chevron */}
                  {onAppointmentClick && (
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-2" />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h4>
            <p className="text-sm">All appointments are up to date</p>
            {showAddButton && onAddAppointment && (
              <button
                onClick={onAddAppointment}
                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule New Appointment
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {appointments.length > maxItems && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onViewAll}
            className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            View {appointments.length - maxItems} more appointments
          </button>
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointments;
