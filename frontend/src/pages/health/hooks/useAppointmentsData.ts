/**
 * useAppointmentsData Hook
 *
 * Custom hook for fetching and managing appointments data.
 * Handles loading states, error states, and data refreshing.
 *
 * @module pages/health/hooks/useAppointmentsData
 */

import { useState, useEffect, useCallback } from 'react';
import { appointmentsApi } from '../../../services';
import type { AppointmentFilters, UseAppointmentsDataReturn, AppointmentStatistics } from '../types';

/**
 * Fetch and manage appointments data
 *
 * @param filters - Appointment filter configuration
 * @returns Appointments data, loading state, and data management functions
 *
 * @example
 * const { appointments, loading, loadData } = useAppointmentsData(filters);
 */
export function useAppointmentsData(filters: AppointmentFilters): UseAppointmentsDataReturn {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<AppointmentStatistics>({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0,
    todayAppointments: 0,
    upcomingAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  /**
   * Load appointments data from API
   */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch appointments with filters
      const response = await appointmentsApi.getAll(filters);

      // Extract appointments from response
      const appointmentsData = response.data?.appointments || response.appointments || [];
      setAppointments(appointmentsData);

      // Calculate statistics from loaded data
      const stats: AppointmentStatistics = {
        total: appointmentsData.length,
        scheduled: appointmentsData.filter((apt: any) => apt.status === 'SCHEDULED').length,
        completed: appointmentsData.filter((apt: any) => apt.status === 'COMPLETED').length,
        cancelled: appointmentsData.filter((apt: any) => apt.status === 'CANCELLED').length,
        noShow: appointmentsData.filter((apt: any) => apt.status === 'NO_SHOW').length,
        todayAppointments: appointmentsData.filter((apt: any) => {
          const today = new Date().toISOString().split('T')[0];
          const aptDate = new Date(apt.scheduledAt || apt.appointmentDate).toISOString().split('T')[0];
          return aptDate === today;
        }).length,
        upcomingAppointments: appointmentsData.filter((apt: any) => {
          const now = new Date();
          const aptDate = new Date(apt.scheduledAt || apt.appointmentDate);
          return aptDate > now && apt.status === 'SCHEDULED';
        }).length,
      };
      setStatistics(stats);

      // Load waitlist data (optional - may not be available in all implementations)
      try {
        const waitlistResponse = await appointmentsApi.getWaitlist?.();
        setWaitlist(waitlistResponse?.data || waitlistResponse || []);
      } catch (waitlistError) {
        // Waitlist is optional - don't fail if not available
        console.warn('Waitlist not available:', waitlistError);
        setWaitlist([]);
      }
    } catch (err) {
      console.error('Error loading appointments:', err);
      setError(err);
      setAppointments([]);
      setWaitlist([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load data when filters change
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    appointments,
    waitlist,
    statistics,
    loading,
    error,
    loadData,
  };
}
