/**
 * Appointments Management Page
 * Main dashboard for viewing and managing appointments
 *
 * @module app/appointments/page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, User, Plus, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-client';

interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  appointmentType: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reason?: string;
  notes?: string;
}

interface AppointmentStats {
  todayTotal: number;
  upcomingTotal: number;
  completedThisWeek: number;
  cancelledThisWeek: number;
}

/**
 * Appointments Management Page Component
 */
export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AppointmentStats>({
    todayTotal: 0,
    upcomingTotal: 0,
    completedThisWeek: 0,
    cancelledThisWeek: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');

  useEffect(() => {
    fetchAppointments();
  }, [filterStatus, filterDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      // Build query params
      const params: any = {};
      if (filterStatus && filterStatus !== 'all') {
        params.status = filterStatus;
      }
      if (filterDate) {
        params.date = filterDate;
      }

      // Fetch appointments
      const response = await apiClient.get<any>(
        API_ENDPOINTS.APPOINTMENTS.BASE,
        params
      );

      // Handle response structure
      const appointmentsData = response.data || response.appointments || [];
      setAppointments(appointmentsData);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = appointmentsData.filter((a: Appointment) =>
        a.date === today && a.status === 'scheduled'
      );
      const upcomingAppts = appointmentsData.filter((a: Appointment) =>
        a.date >= today && a.status === 'scheduled'
      );
      const completedAppts = appointmentsData.filter((a: Appointment) =>
        a.status === 'completed'
      );
      const cancelledAppts = appointmentsData.filter((a: Appointment) =>
        a.status === 'cancelled'
      );

      setStats({
        todayTotal: todayAppts.length,
        upcomingTotal: upcomingAppts.length,
        completedThisWeek: completedAppts.length,
        cancelledThisWeek: cancelledAppts.length,
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        appointment.studentName?.toLowerCase().includes(query) ||
        appointment.appointmentType?.toLowerCase().includes(query) ||
        appointment.reason?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Appointments
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage student appointments and schedules
          </p>
        </div>
        <Link href="/appointments/new">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Schedule Appointment
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Today's Appointments</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.todayTotal}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.upcomingTotal}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed This Week</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.completedThisWeek}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cancelled This Week</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.cancelledThisWeek}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Appointments List */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          All Appointments
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No appointments found</p>
            <Link href="/appointments/new">
              <Button variant="outline" className="mt-4">
                Schedule First Appointment
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => router.push(`/appointments/${appointment.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {appointment.studentName || 'Unknown Student'}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(appointment.date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {appointment.time} ({appointment.duration} min)
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {appointment.appointmentType}
                      </div>
                    </div>

                    {appointment.reason && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <strong>Reason:</strong> {appointment.reason}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
