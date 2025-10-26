/**
 * Appointment Detail Page
 * 
 * Features:
 * - View appointment details
 * - Edit appointment
 * - Update status
 * - Add notes
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, User, FileText, Edit, ArrowLeft, Save } from 'lucide-react';
import { appointmentsApi } from '../../services';
import { PROTECTED_ROUTES, buildAppointmentEditRoute } from '../../constants/routes';
import { useAuth } from '../../contexts/AuthContext';
import { AppointmentStatus } from '../../types/appointments';

// Use the Appointment type from types
import type { Appointment } from '../../types/appointments';

const AppointmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<AppointmentStatus>(AppointmentStatus.SCHEDULED);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadAppointment();
    }
  }, [id]);

  const loadAppointment = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await appointmentsApi.getById(id);
      setAppointment(response.appointment);
      setNotes(response.appointment.notes || '');
      setStatus(response.appointment.status);
    } catch (err) {
      setError('Failed to load appointment details');
      console.error('Error loading appointment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!appointment) return;

    try {
      setSaving(true);
      
      await appointmentsApi.update(appointment.id, {
        status,
        notes: notes.trim() || undefined
      });
      
      // Reload appointment data
      await loadAppointment();
      setEditing(false);
    } catch (err) {
      console.error('Error saving changes:', err);
    } finally {
      setSaving(false);
    }
  };

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateTime = new Date(`${date}T${time}`);
      return {
        date: dateTime.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        time: dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } catch {
      return { date: date, time: time };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      case 'NO_SHOW': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canEdit = user?.role === 'ADMIN' || user?.role === 'NURSE';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Appointment not found'}
          </h2>
          <button
            onClick={() => navigate(PROTECTED_ROUTES.APPOINTMENTS)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  const scheduledDate = new Date(appointment.scheduledAt);
  const { date, time } = formatDateTime(
    scheduledDate.toISOString().split('T')[0],
    scheduledDate.toTimeString().slice(0, 5)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(PROTECTED_ROUTES.APPOINTMENTS)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointment Details</h1>
            <p className="text-gray-600 mt-1">
              {appointment.student?.firstName} {appointment.student?.lastName} - {date}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          {canEdit && (
            <>
              {editing ? (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <Link
                    to={buildAppointmentEditRoute(appointment.id)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Full Edit
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Appointment Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Student</label>
              <div className="flex items-center mt-1">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-900 font-medium">{appointment.student?.firstName} {appointment.student?.lastName}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">ID: {appointment.studentId}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Date & Time</label>
              <div className="flex items-center mt-1">
                <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-gray-900 font-medium">{date}</div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {time}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Type</label>
              <div className="mt-1 text-gray-900 font-medium">{appointment.type?.replace(/_/g, ' ')}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Provider</label>
              <div className="mt-1 text-gray-900 font-medium">{appointment.nurse?.firstName} {appointment.nurse?.lastName}</div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                {editing ? (
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="NO_SHOW">No Show</option>
                  </select>
                ) : (
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(appointment.status)}`}>
                    {appointment.status.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reason & Notes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Details & Notes</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Reason for Visit</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-900">
                {appointment.reason}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Notes</label>
              {editing ? (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Add notes about this appointment..."
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-900 min-h-[100px]">
                  {appointment.notes || (
                    <span className="text-gray-500 italic">No notes added</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Metadata</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="font-medium text-gray-500">Created</label>
            <div className="text-gray-900">
              {new Date(appointment.createdAt).toLocaleString()}
            </div>
          </div>
          <div>
            <label className="font-medium text-gray-500">Last Updated</label>
            <div className="text-gray-900">
              {new Date(appointment.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;
