/**
 * Appointment List Component
 * Displays a list or grid of appointments
 */

'use client';

import React from 'react';
import { AppointmentCard } from './AppointmentCard';
import { EmptyState } from '@/components/ui/empty-state';
import { CalendarDays } from 'lucide-react';
import type { Appointment } from '@/types/domain/appointments';

interface AppointmentListProps {
  appointments: Appointment[];
  onViewAppointment: (id: string) => void;
  onEditAppointment: (id: string) => void;
  onCancelAppointment: (id: string) => void;
  selectedAppointments?: Set<string>;
  onSelectAppointment?: (id: string) => void;
  loading?: boolean;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  onViewAppointment,
  onEditAppointment,
  onCancelAppointment,
  selectedAppointments,
  onSelectAppointment,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse bg-gray-200 rounded-lg h-48"
          />
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No Appointments Found"
        description="There are no appointments matching your current filters."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onView={onViewAppointment}
          onEdit={onEditAppointment}
          onCancel={onCancelAppointment}
          isSelected={selectedAppointments?.has(appointment.id)}
          onSelect={onSelectAppointment}
        />
      ))}
    </div>
  );
};
