'use client';

import React, { useState, useCallback } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import CalendarView from './CalendarView';
import TimeSlotPicker from './TimeSlotPicker';
import ProviderSelector from './ProviderSelector';
import PatientSelector from './PatientSelector';
import RoomBooking from './RoomBooking';
import SchedulerForm from './SchedulerForm';
import { useTimeSlots, useSearch, useSchedulerForm } from './hooks';
import type {
  AppointmentSchedulerProps,
  TimeSlot,
  Provider,
  Patient,
  Room,
  Appointment,
  AppointmentType,
  AppointmentPriority
} from './types';

/**
 * AppointmentScheduler Component
 *
 * A comprehensive scheduling interface for creating new appointments with
 * provider availability checking, time slot selection, patient search,
 * and room assignment. Supports both in-person and virtual appointments.
 *
 * @param props - AppointmentScheduler component props
 * @returns JSX element representing the appointment scheduler
 */
const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({
  providers = [],
  patients = [],
  rooms = [],
  existingAppointments = [],
  defaultDate = new Date(),
  defaultProvider,
  defaultPatient,
  showPatientSelection = true,
  showProviderSelection = true,
  showRoomSelection = true,
  allowVirtual = true,
  minDuration = 15,
  maxDuration = 240,
  className = '',
  onSchedule,
  onCancel,
  onProviderChange,
  onPatientChange,
  onDateChange,
  onLoadTimeSlots,
  onSearchPatients,
  onSearchProviders
}) => {
  // Date and selection state
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);
  const [selectedProvider, setSelectedProvider] = useState<string>(defaultProvider || '');
  const [selectedPatient, setSelectedPatient] = useState<string>(defaultPatient || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [saving, setSaving] = useState<boolean>(false);

  // Custom hooks for managing complex state
  const { availableTimeSlots, loading, loadTimeSlots } = useTimeSlots(onLoadTimeSlots);
  const patientSearch = useSearch<Patient>(onSearchPatients);
  const providerSearch = useSearch<Provider>(onSearchProviders);
  const formState = useSchedulerForm();

  /**
   * Gets the selected provider object
   */
  const getSelectedProvider = (): Provider | undefined => {
    return providers.find(p => p.id === selectedProvider);
  };

  /**
   * Gets the selected patient object
   */
  const getSelectedPatient = (): Patient | undefined => {
    return patients.find(p => p.id === selectedPatient);
  };

  /**
   * Gets the selected room object
   */
  const getSelectedRoom = (): Room | undefined => {
    return rooms.find(r => r.id === selectedRoom);
  };

  /**
   * Handles date selection
   */
  const handleDateSelect = useCallback(
    async (date: Date) => {
      setSelectedDate(date);
      setSelectedTimeSlot(null);
      onDateChange?.(date);

      if (selectedProvider) {
        await loadTimeSlots(date, selectedProvider);
      }
    },
    [selectedProvider, loadTimeSlots, onDateChange]
  );

  /**
   * Handles provider selection
   */
  const handleProviderSelect = useCallback(
    async (providerId: string, providerName: string) => {
      setSelectedProvider(providerId);
      setSelectedTimeSlot(null);
      providerSearch.setSearchQuery(providerName);
      providerSearch.setShowResults(false);
      onProviderChange?.(providerId);

      if (selectedDate) {
        await loadTimeSlots(selectedDate, providerId);
      }
    },
    [selectedDate, loadTimeSlots, onProviderChange, providerSearch]
  );

  /**
   * Handles patient selection
   */
  const handlePatientSelect = useCallback(
    (patientId: string, patientName: string) => {
      setSelectedPatient(patientId);
      patientSearch.setSearchQuery(patientName);
      patientSearch.setShowResults(false);
      onPatientChange?.(patientId);
    },
    [onPatientChange, patientSearch]
  );

  /**
   * Handles virtual mode change
   */
  const handleModeChange = useCallback((isVirtual: boolean) => {
    formState.setIsVirtual(isVirtual);
    if (isVirtual) {
      setSelectedRoom('');
    }
  }, [formState]);

  /**
   * Validates the form
   */
  const isFormValid = (): boolean => {
    return !!(
      selectedPatient &&
      selectedProvider &&
      selectedTimeSlot &&
      formState.reason.trim() &&
      (formState.isVirtual || selectedRoom)
    );
  };

  /**
   * Handles form submission
   */
  const handleSchedule = async (): Promise<void> => {
    if (!isFormValid()) {
      return;
    }

    setSaving(true);
    try {
      const appointmentData: Partial<Appointment> = {
        patient: getSelectedPatient()!,
        provider: getSelectedProvider()!,
        dateTime: `${selectedDate.toISOString().split('T')[0]}T${selectedTimeSlot!.startTime}`,
        duration: formState.duration,
        type: formState.appointmentType as AppointmentType,
        status: 'scheduled',
        priority: formState.appointmentPriority as AppointmentPriority,
        reason: formState.reason.trim(),
        location: formState.isVirtual
          ? { isVirtual: true, virtualLink: 'https://example.com/virtual-room' }
          : {
              isVirtual: false,
              room: getSelectedRoom()?.name,
              building: getSelectedRoom()?.building,
              address: getSelectedRoom()
                ? `${getSelectedRoom()?.name}, ${getSelectedRoom()?.building}`
                : undefined
            },
        notes: formState.notes.trim() || undefined,
        preparationInstructions:
          formState.preparationInstructions.filter(inst => inst.trim()).length > 0
            ? formState.preparationInstructions.filter(inst => inst.trim())
            : undefined,
        lastUpdated: new Date().toISOString(),
        createdBy: 'current-user'
      };

      await onSchedule?.(appointmentData);
    } catch (error) {
      console.error('Failed to schedule appointment:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule Appointment</h1>
            <p className="text-sm text-gray-600 mt-1">Create a new appointment for a patient</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300
                       rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2
                       focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              disabled={!isFormValid() || saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent
                       rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                       focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
                       inline-flex items-center"
            >
              {saving ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" aria-hidden="true" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" aria-hidden="true" />
                  Schedule Appointment
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Date and Time Selection */}
        <div className="lg:col-span-2 space-y-6">
          <CalendarView
            selectedDate={selectedDate}
            currentWeek={currentWeek}
            onDateSelect={handleDateSelect}
            onWeekChange={setCurrentWeek}
          />
          <TimeSlotPicker
            selectedProvider={selectedProvider}
            selectedDate={selectedDate}
            timeSlots={availableTimeSlots}
            selectedSlot={selectedTimeSlot}
            loading={loading}
            onSlotSelect={setSelectedTimeSlot}
          />
        </div>

        {/* Right Column - Appointment Details */}
        <div className="space-y-6">
          {/* Patient Selection */}
          {showPatientSelection && (
            <PatientSelector
              patients={patients}
              selectedPatientId={selectedPatient}
              searchQuery={patientSearch.searchQuery}
              searchResults={patientSearch.searchResults}
              showResults={patientSearch.showResults}
              onPatientSelect={handlePatientSelect}
              onSearchChange={patientSearch.handleSearch}
              onSearchFocus={() => patientSearch.setShowResults(true)}
              onClearSearch={patientSearch.clearSearch}
            />
          )}

          {/* Provider Selection */}
          {showProviderSelection && (
            <ProviderSelector
              providers={providers}
              selectedProviderId={selectedProvider}
              searchQuery={providerSearch.searchQuery}
              searchResults={providerSearch.searchResults}
              showResults={providerSearch.showResults}
              onProviderSelect={handleProviderSelect}
              onSearchChange={providerSearch.handleSearch}
              onSearchFocus={() => providerSearch.setShowResults(true)}
              onClearSearch={providerSearch.clearSearch}
            />
          )}

          {/* Appointment Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <RoomBooking
              rooms={rooms}
              selectedRoomId={selectedRoom}
              isVirtual={formState.isVirtual}
              allowVirtual={allowVirtual}
              onRoomSelect={setSelectedRoom}
              onModeChange={handleModeChange}
            />
          </div>

          <SchedulerForm
            appointmentType={formState.appointmentType as AppointmentType}
            appointmentPriority={formState.appointmentPriority as AppointmentPriority}
            duration={formState.duration}
            reason={formState.reason}
            notes={formState.notes}
            preparationInstructions={formState.preparationInstructions}
            minDuration={minDuration}
            maxDuration={maxDuration}
            onTypeChange={(type) => formState.setAppointmentType(type)}
            onPriorityChange={(priority) => formState.setAppointmentPriority(priority)}
            onDurationChange={formState.setDuration}
            onReasonChange={formState.setReason}
            onNotesChange={formState.setNotes}
            onInstructionsChange={formState.setPreparationInstructions}
          />
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduler;
