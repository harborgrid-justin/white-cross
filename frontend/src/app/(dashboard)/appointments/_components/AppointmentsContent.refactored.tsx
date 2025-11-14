/**
 * Appointments Content Component - REFACTORED
 * Main orchestrator for appointments management
 * 
 * This file has been refactored from 763 lines into smaller, focused components:
 * - AppointmentStats: Statistics and metrics
 * - AppointmentFilters: Search and filtering
 * - AppointmentCard: Individual appointment display
 * - AppointmentList: Grid/list view of appointments
 * - ViewModeToggle: Calendar/list/agenda view toggle
 * - appointmentUtils.ts: Utility functions
 * - appointment.types.ts: Type definitions
 */

'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { Plus, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { useToast } from '@/hooks/use-toast';
import {
  getAppointments,
  deleteAppointment
} from '@/lib/actions/appointments.actions';
import type { Appointment } from '@/types/domain/appointments';
import { AppointmentStatus, AppointmentType } from '@/types/domain/appointments';

// Import sub-components
import { AppointmentStats } from './AppointmentStats';
import { AppointmentFilters } from './AppointmentFilters';
import { AppointmentList } from './AppointmentList';
import { ViewModeToggle } from './ViewModeToggle';

// Import utilities
import { 
  filterAppointments, 
  calculateStats 
} from './utils/appointmentUtils';

type ViewMode = 'calendar' | 'list' | 'agenda';

interface AppointmentsContentProps {
  initialAppointments?: Appointment[];
  userRole?: string;
}

const AppointmentsContent: React.FC<AppointmentsContentProps> = ({
  initialAppointments = []
}) => {
  // State management
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [loading, setLoading] = useState(true);
  const [selectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AppointmentType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();

  const { confirm, ConfirmDialog } = useConfirmDialog();
  const { toast } = useToast();

  // Load appointments on mount and when filters change
  useEffect(() => {
    let cancelled = false;

    const loadAppointments = async () => {
      setLoading(true);
      try {
        const filters: Record<string, string> = {};
        
        const dateFrom = selectedDate.toISOString().split('T')[0];
        const dateTo = new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        if (dateFrom) filters.dateFrom = dateFrom;
        if (dateTo) filters.dateTo = dateTo;

        if (statusFilter !== 'all') filters.status = statusFilter;
        if (typeFilter !== 'all') filters.type = typeFilter;

        const result = await getAppointments(filters);

        if (!cancelled) {
          setAppointments(result.appointments);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load appointments:', error);
          setAppointments([]);
          toast({
            title: 'Error',
            description: 'Failed to load appointments. Please try again.',
            variant: 'destructive',
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAppointments();

    return () => {
      cancelled = true;
    };
  }, [selectedDate, statusFilter, typeFilter, toast]);

  // Filter and search appointments
  const filteredAppointments = useMemo(() => {
    return filterAppointments(appointments, {
      searchQuery,
      statusFilter,
      typeFilter,
    });
  }, [appointments, searchQuery, statusFilter, typeFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    return calculateStats(appointments);
  }, [appointments]);

  // Event handlers
  const handleViewAppointment = (id: string) => {
    console.log('View appointment:', id);
    // TODO: Implement appointment detail view
  };

  const handleEditAppointment = (id: string) => {
    console.log('Edit appointment:', id);
    // TODO: Implement appointment edit modal
  };

  const handleCancelAppointment = async (id: string) => {
    const confirmed = await confirm({
      title: 'Cancel Appointment',
      description: 'Are you sure you want to cancel this appointment?',
      confirmText: 'Yes, Cancel',
      cancelText: 'No, Keep',
    });

    if (confirmed) {
      startTransition(async () => {
        try {
          await deleteAppointment(id);
          setAppointments((prev) => prev.filter((apt) => apt.id !== id));
          toast({
            title: 'Success',
            description: 'Appointment cancelled successfully',
          });
        } catch (error) {
          console.error('Failed to cancel appointment:', error);
          toast({
            title: 'Error',
            description: 'Failed to cancel appointment. Please try again.',
            variant: 'destructive',
          });
        }
      });
    }
  };

  const handleSelectAppointment = (id: string) => {
    setSelectedAppointments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setSearchQuery('');
    setShowFilters(false);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (typeFilter !== 'all') count++;
    return count;
  }, [statusFilter, typeFilter]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">
            Manage student health appointments and schedules
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
            Import
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <AppointmentStats stats={stats} />

      {/* Filters and View Toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <AppointmentFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            activeFilterCount={activeFilterCount}
            onClearFilters={handleClearFilters}
          />
        </div>
        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* Appointments List */}
      <AppointmentList
        appointments={filteredAppointments}
        onViewAppointment={handleViewAppointment}
        onEditAppointment={handleEditAppointment}
        onCancelAppointment={handleCancelAppointment}
        selectedAppointments={selectedAppointments}
        onSelectAppointment={handleSelectAppointment}
        loading={loading}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
};

export default AppointmentsContent;
