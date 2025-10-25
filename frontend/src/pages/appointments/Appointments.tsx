/**
 * Appointments Management Page
 * 
 * Features:
 * - View all appointments
 * - Schedule new appointments
 * - Filter and search appointments
 * - Calendar view
 * - Role-based access control
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Search, Filter, Clock, User, FileText, Edit, XCircle, AlertTriangle } from 'lucide-react';
import { appointmentsApi } from '../../services';
import { PROTECTED_ROUTES, buildAppointmentRoute } from '../../constants/routes';
import { useAuth } from '../../contexts/AuthContext';

interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  appointmentType: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  provider: string;
  reason: string;
  notes?: string;
  createdAt: string;
}

interface AppointmentFilters {
  status?: string;
  type?: string;
  provider?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AppointmentFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  // Load appointments
  useEffect(() => {
    loadAppointments();
  }, [filters]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await appointmentsApi.getAll({
        ...filters,
        search: searchTerm
      });
      
      setAppointments(response.data || []);
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleFilterChange = (key: keyof AppointmentFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const handleCancelClick = (appointment: Appointment, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      setCancelLoading(true);
      await appointmentsApi.cancel(selectedAppointment.id, cancelReason || undefined);
      setShowCancelModal(false);
      setSelectedAppointment(null);
      setCancelReason('');
      setCancelLoading(false);

      // Reload appointments list
      await loadAppointments();
    } catch (err) {
      setError('Failed to cancel appointment');
      console.error('Failed to cancel appointment:', err);
      setCancelLoading(false);
    }
  };

  const canCancelAppointments = user?.role === 'ADMIN' || user?.role === 'NURSE' || user?.role === 'SCHOOL_ADMIN';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'NO_SHOW': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateTime = new Date(`${date}T${time}`);
      return {
        date: dateTime.toLocaleDateString(),
        time: dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } catch {
      return { date: date, time: time };
    }
  };

  // Permission check
  const canCreateAppointments = user?.role === 'ADMIN' || user?.role === 'NURSE';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">
            Manage student appointments and healthcare visits
          </p>
        </div>
        
        <div className="flex gap-3">
          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'calendar' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Calendar
            </button>
          </div>

          {canCreateAppointments && (
            <Link
              to={PROTECTED_ROUTES.APPOINTMENTS_CREATE}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Schedule Appointment
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by student name, provider, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No Show</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="ROUTINE">Routine Check</option>
                <option value="MEDICATION">Medication Review</option>
                <option value="FOLLOW_UP">Follow-up</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-4 flex gap-2">
              <button
                onClick={clearFilters}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Appointments List */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || Object.keys(filters).length > 0
                  ? 'No appointments match your search criteria.'
                  : 'No appointments have been scheduled yet.'}
              </p>
              {canCreateAppointments && (
                <Link
                  to={PROTECTED_ROUTES.APPOINTMENTS_CREATE}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Schedule First Appointment
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => {
                    const { date, time } = formatDateTime(appointment.scheduledDate, appointment.scheduledTime);
                    
                    return (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.studentName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {appointment.studentId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                              <div>{date}</div>
                              <div className="text-gray-500">{time}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appointment.appointmentType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appointment.provider}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <Link
                              to={buildAppointmentRoute(appointment.id)}
                              className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                              title="View Details"
                            >
                              <FileText className="w-4 h-4" />
                            </Link>
                            {canCancelAppointments && appointment.status === 'SCHEDULED' && (
                              <button
                                onClick={(e) => handleCancelClick(appointment, e)}
                                className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                title="Cancel Appointment"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Calendar View - Placeholder */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
            <p className="text-gray-600">
              Calendar view implementation coming soon. Use list view to manage appointments.
            </p>
          </div>
        </div>
      )}

      {/* Cancel Appointment Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => {
                if (!cancelLoading) {
                  setShowCancelModal(false);
                  setSelectedAppointment(null);
                  setCancelReason('');
                }
              }}
            ></div>

            {/* Center modal */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Cancel Appointment
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to cancel the appointment for <strong>{selectedAppointment.studentName}</strong> scheduled for{' '}
                      {new Date(selectedAppointment.scheduledDate).toLocaleDateString()}?
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      This action cannot be undone.
                    </p>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cancellation Reason (Optional)
                      </label>
                      <textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter reason for cancellation..."
                        disabled={cancelLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCancelAppointment}
                  disabled={cancelLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {cancelLoading ? 'Cancelling...' : 'Cancel Appointment'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedAppointment(null);
                    setCancelReason('');
                  }}
                  disabled={cancelLoading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Keep Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
