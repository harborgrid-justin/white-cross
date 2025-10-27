/**
 * Appointment Edit Page
 *
 * Full appointment editing interface with all editable fields.
 * Separate from the inline edit mode in AppointmentDetail.
 *
 * Features:
 * - Edit all appointment fields (type, date/time, duration, reason, notes)
 * - Field-level validation
 * - HIPAA-compliant audit logging
 * - Cancel/Save with loading states
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, Clock, User, FileText, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { appointmentsApi, studentsApi } from '@/services';
import { PROTECTED_ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { LoadingSpinner } from '@/components/ui/feedback/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import type { Appointment, UpdateAppointmentData } from '@/types/appointments';
import { AppointmentType } from '@/types/appointments';
import type { Student } from '@/types/student.types';

const appointmentTypes: AppointmentType[] = [
  AppointmentType.ROUTINE_CHECKUP,
  AppointmentType.MEDICATION_ADMINISTRATION,
  AppointmentType.INJURY_ASSESSMENT,
  AppointmentType.ILLNESS_EVALUATION,
  AppointmentType.FOLLOW_UP,
  AppointmentType.SCREENING,
];

const AppointmentEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Data state
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [student, setStudent] = useState<Student | null>(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<UpdateAppointmentData>({});
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

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
      const appointmentData = response.appointment;
      setAppointment(appointmentData);

      // Parse scheduled datetime
      const scheduledAt = parseISO(appointmentData.scheduledAt);
      setScheduledDate(format(scheduledAt, 'yyyy-MM-dd'));
      setScheduledTime(format(scheduledAt, 'HH:mm'));

      // Initialize form data
      setFormData({
        type: appointmentData.type,
        duration: appointmentData.duration,
        reason: appointmentData.reason,
        notes: appointmentData.notes || '',
        status: appointmentData.status,
      });

      // Load student info
      if (appointmentData.studentId) {
        const student = await studentsApi.getById(appointmentData.studentId);
        setStudent(student);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load appointment');
      toast({
        title: 'Error',
        description: 'Failed to load appointment details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!appointment || !id) return;

    // Validate required fields
    if (!formData.type || !formData.reason || !scheduledDate || !scheduledTime) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      // Combine date and time into ISO datetime
      const scheduledAt = `${scheduledDate}T${scheduledTime}:00.000Z`;

      const updateData: UpdateAppointmentData = {
        ...formData,
        scheduledAt,
      };

      await appointmentsApi.update(id, updateData);

      toast({
        title: 'Success',
        description: 'Appointment updated successfully',
        variant: 'default',
      });

      // Navigate back to detail view
      navigate(`${PROTECTED_ROUTES.APPOINTMENTS}/${id}`);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update appointment',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`${PROTECTED_ROUTES.APPOINTMENTS}/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-red-900 font-medium">Error Loading Appointment</h3>
              <p className="text-red-700 text-sm mt-1">{error || 'Appointment not found'}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate(PROTECTED_ROUTES.APPOINTMENTS)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Appointments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`${PROTECTED_ROUTES.APPOINTMENTS}/${id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Appointment
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Appointment</h1>
        {student && (
          <p className="text-gray-600 mt-2">
            Student: {student.firstName} {student.lastName}
          </p>
        )}
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type || ''}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as AppointmentType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select type...</option>
              {appointmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time <span className="text-red-500">*</span>
              </label>
              <Input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <Input
              type="number"
              min="15"
              max="240"
              step="15"
              value={formData.duration || 30}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
              className="w-full"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={formData.reason || ''}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
              className="w-full"
              placeholder="Enter the reason for this appointment..."
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <Textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full"
              placeholder="Additional notes or observations..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="min-w-[120px]"
            >
              {saving ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentEdit;
