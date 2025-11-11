/**
 * Appointment Card Component
 * Displays individual appointment information in a card format
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  User, 
  FileText, 
  Edit, 
  Eye, 
  XCircle 
} from 'lucide-react';
import type { Appointment } from '@/types/domain/appointments';
import { AppointmentStatus } from '@/types/domain/appointments';
import { formatAppointmentTime, getAppointmentDuration } from './utils/appointmentUtils';

interface AppointmentCardProps {
  appointment: Appointment;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onView,
  onEdit,
  onCancel,
  isSelected = false,
  onSelect
}) => {
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      'no-show': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      'check-up': 'bg-purple-50 text-purple-700',
      vaccination: 'bg-blue-50 text-blue-700',
      medication: 'bg-green-50 text-green-700',
      screening: 'bg-yellow-50 text-yellow-700',
      consultation: 'bg-indigo-50 text-indigo-700',
      'follow-up': 'bg-pink-50 text-pink-700',
      other: 'bg-gray-50 text-gray-700',
    };
    return colors[type] || 'bg-gray-50 text-gray-700';
  };

  return (
    <Card className={`p-4 hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="space-y-3">
        {/* Header with Time and Status */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {onSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(appointment.id)}
                className="rounded border-gray-300 text-blue-600"
                aria-label={`Select appointment ${appointment.id}`}
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" aria-hidden="true" />
                <span className="font-medium text-gray-900">
                  {formatAppointmentTime(appointment.scheduledAt)}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                Duration: {getAppointmentDuration(appointment)}
              </span>
            </div>
          </div>
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status}
          </Badge>
        </div>

        {/* Student Information */}
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" aria-hidden="true" />
          <span className="text-sm font-medium text-gray-900">
            {appointment.student?.firstName} {appointment.student?.lastName}
          </span>
        </div>

        {/* Appointment Type */}
        <div>
          <Badge className={getTypeColor(appointment.type)}>
            {appointment.type.replace(/_/g, ' ')}
          </Badge>
        </div>

        {/* Notes Preview */}
        {appointment.notes && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <p className="line-clamp-2">{appointment.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(appointment.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
            View
          </Button>
          {appointment.status !== AppointmentStatus.COMPLETED && appointment.status !== AppointmentStatus.CANCELLED && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(appointment.id)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(appointment.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4" aria-hidden="true" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
