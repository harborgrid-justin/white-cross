'use client';

/**
 * Force dynamic rendering for real-time appointment data
 * Appointment schedules change frequently and require current information
 */
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { fetchAppointmentsDashboardData } from './data';
import { type Appointment } from '@/types/appointments';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Search, Filter, Plus, Users } from 'lucide-react';

/**
 * Appointments Main Page
 * 
 * Comprehensive appointment management dashboard for scheduling,
 * tracking, and managing student appointments.
 */
export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const { toast } = useToast();

  /**
   * Load appointments data from API
   */
  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      
      try {
        const filters = {
          search: searchTerm.trim() || undefined,
          status: selectedStatus || undefined,
          date: selectedDate || undefined
        };
        
        const { appointments: appointmentsData, error } = 
          await fetchAppointmentsDashboardData(filters);
        
        setAppointments(appointmentsData);
        
        if (error) {
          toast({
            title: 'Error',
            description: error,
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Failed to load appointments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load appointments. Please try again.',
          variant: 'destructive',
        });
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [searchTerm, selectedStatus, selectedDate, toast]);

  const handleCreateAppointment = () => {
    window.location.href = '/dashboard/appointments/new';
  };

  const handleViewAppointment = (appointment: Appointment) => {
    window.location.href = `/dashboard/appointments/${appointment.id}`;
  };

  const handleScheduleAppointment = () => {
    window.location.href = '/dashboard/appointments/schedule';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      'no-show': 'bg-yellow-100 text-yellow-800',
      rescheduled: 'bg-purple-100 text-purple-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.scheduled}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeStyles = {
      'routine-checkup': 'bg-blue-100 text-blue-800',
      'medication-review': 'bg-green-100 text-green-800',
      'health-screening': 'bg-yellow-100 text-yellow-800',
      'injury-assessment': 'bg-red-100 text-red-800',
      'follow-up': 'bg-purple-100 text-purple-800',
      'emergency': 'bg-red-200 text-red-900',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeStyles[type as keyof typeof typeStyles] || typeStyles['routine-checkup']}`}>
        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const getTodayAppointments = () => {
    const today = new Date().toDateString();
    return appointments.filter(apt => 
      new Date(apt.scheduledAt).toDateString() === today
    ).length;
  };

  const getUpcomingAppointments = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return appointments.filter(apt => {
      const aptDate = new Date(apt.scheduledAt);
      return aptDate >= tomorrow && aptDate <= nextWeek;
    }).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
              <p className="text-gray-600 mt-2">Schedule and manage student health appointments</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleScheduleAppointment}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Appointment
              </button>
              <button
                onClick={handleCreateAppointment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700">Today's Appointments</h3>
            <p className="text-2xl font-bold text-blue-600">{getTodayAppointments()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-700">This Week</h3>
            <p className="text-2xl font-bold text-green-600">{getUpcomingAppointments()}</p>
          </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-700">Completed</h3>
              <p className="text-2xl font-bold text-gray-600">
                {appointments.filter(apt => apt.status === 'COMPLETED').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-sm font-medium text-gray-700">Cancelled</h3>
              <p className="text-2xl font-bold text-red-600">
                {appointments.filter(apt => apt.status === 'CANCELLED').length}
              </p>
            </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                Search Appointments
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                placeholder="Search by student name, type..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Status
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by scheduling a new appointment or adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleViewAppointment(appointment)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {appointment.student?.firstName} {appointment.student?.lastName}
                        </h3>
                        {getTypeBadge(appointment.type)}
                        {getStatusBadge(appointment.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(appointment.scheduledAt)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(appointment.scheduledAt)}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {appointment.nurse?.firstName} {appointment.nurse?.lastName}
                        </div>
                      </div>
                      {appointment.reason && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          Reason: {appointment.reason}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {appointment.duration} min
                      </p>
                      {appointment.type === 'EMERGENCY' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                          Emergency
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
