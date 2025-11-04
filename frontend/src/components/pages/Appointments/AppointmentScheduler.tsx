'use client';

import React, { useState, useCallback } from 'react';
import { 
  Calendar,
  Clock,
  User,
  MapPin,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertTriangle,
  Users,
  Video,
  Stethoscope,
  Phone,
  Mail,
  FileText,
  Save,
  RefreshCw
} from 'lucide-react';
import type { Appointment, AppointmentType, AppointmentPriority } from './AppointmentCard';

/**
 * Time slot interface for appointment scheduling
 */
interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  available: boolean;
  providerId: string;
  roomId?: string;
}

/**
 * Provider interface for scheduling
 */
interface Provider {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar?: string;
  specialties: string[];
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

/**
 * Patient interface for scheduling
 */
interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  phone?: string;
  email?: string;
  avatar?: string;
}

/**
 * Room interface for scheduling
 */
interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  equipment: string[];
  isVirtual: boolean;
}

/**
 * Props for the AppointmentScheduler component
 */
interface AppointmentSchedulerProps {
  /** Available providers */
  providers?: Provider[];
  /** Available patients */
  patients?: Patient[];
  /** Available rooms */
  rooms?: Room[];
  /** Existing appointments for conflict checking */
  existingAppointments?: Appointment[];
  /** Default selected date */
  defaultDate?: Date;
  /** Default selected provider */
  defaultProvider?: string;
  /** Default selected patient */
  defaultPatient?: string;
  /** Whether to show patient selection */
  showPatientSelection?: boolean;
  /** Whether to show provider selection */
  showProviderSelection?: boolean;
  /** Whether to show room selection */
  showRoomSelection?: boolean;
  /** Whether to allow virtual appointments */
  allowVirtual?: boolean;
  /** Minimum duration for appointments (in minutes) */
  minDuration?: number;
  /** Maximum duration for appointments (in minutes) */
  maxDuration?: number;
  /** Custom CSS classes */
  className?: string;
  /** Schedule appointment handler */
  onSchedule?: (appointmentData: Partial<Appointment>) => Promise<void>;
  /** Cancel scheduling handler */
  onCancel?: () => void;
  /** Provider selection handler */
  onProviderChange?: (providerId: string) => void;
  /** Patient selection handler */
  onPatientChange?: (patientId: string) => void;
  /** Date change handler */
  onDateChange?: (date: Date) => void;
  /** Load time slots handler */
  onLoadTimeSlots?: (date: Date, providerId: string) => Promise<TimeSlot[]>;
  /** Search patients handler */
  onSearchPatients?: (query: string) => Promise<Patient[]>;
  /** Search providers handler */
  onSearchProviders?: (query: string) => Promise<Provider[]>;
}

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
  // Form state
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);
  const [selectedProvider, setSelectedProvider] = useState<string>(defaultProvider || '');
  const [selectedPatient, setSelectedPatient] = useState<string>(defaultPatient || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('consultation');
  const [appointmentPriority, setAppointmentPriority] = useState<AppointmentPriority>('normal');
  const [duration, setDuration] = useState<number>(30);
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isVirtual, setIsVirtual] = useState<boolean>(false);
  const [preparationInstructions, setPreparationInstructions] = useState<string[]>(['']);
  
  // UI state
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [patientSearchQuery, setPatientSearchQuery] = useState<string>('');
  const [providerSearchQuery, setProviderSearchQuery] = useState<string>('');
  const [patientSearchResults, setPatientSearchResults] = useState<Patient[]>([]);
  const [providerSearchResults, setProviderSearchResults] = useState<Provider[]>([]);
  const [showPatientSearch, setShowPatientSearch] = useState<boolean>(false);
  const [showProviderSearch, setShowProviderSearch] = useState<boolean>(false);
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());

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
   * Formats date for display
   */
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Formats time for display
   */
  const formatTime = (timeString: string): string => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  /**
   * Gets the days of the current week
   */
  const getWeekDays = (): Date[] => {
    const start = new Date(currentWeek);
    const diff = start.getDate() - start.getDay();
    start.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  /**
   * Handles date selection
   */
  const handleDateSelect = useCallback(async (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    onDateChange?.(date);

    if (selectedProvider) {
      setLoading(true);
      try {
        const slots = onLoadTimeSlots 
          ? await onLoadTimeSlots(date, selectedProvider)
          : [];
        setAvailableTimeSlots(slots);
      } catch (error) {
        console.error('Failed to load time slots:', error);
        setAvailableTimeSlots([]);
      } finally {
        setLoading(false);
      }
    }
  }, [selectedProvider, onLoadTimeSlots, onDateChange]);

  /**
   * Handles provider selection
   */
  const handleProviderSelect = useCallback(async (providerId: string) => {
    setSelectedProvider(providerId);
    setSelectedTimeSlot(null);
    onProviderChange?.(providerId);

    if (selectedDate) {
      setLoading(true);
      try {
        const slots = onLoadTimeSlots 
          ? await onLoadTimeSlots(selectedDate, providerId)
          : [];
        setAvailableTimeSlots(slots);
      } catch (error) {
        console.error('Failed to load time slots:', error);
        setAvailableTimeSlots([]);
      } finally {
        setLoading(false);
      }
    }
  }, [selectedDate, onLoadTimeSlots, onProviderChange]);

  /**
   * Handles patient search
   */
  const handlePatientSearch = useCallback(async (query: string) => {
    setPatientSearchQuery(query);
    
    if (query.length >= 2 && onSearchPatients) {
      try {
        const results = await onSearchPatients(query);
        setPatientSearchResults(results);
      } catch (error) {
        console.error('Failed to search patients:', error);
        setPatientSearchResults([]);
      }
    } else {
      setPatientSearchResults([]);
    }
  }, [onSearchPatients]);

  /**
   * Handles provider search
   */
  const handleProviderSearch = useCallback(async (query: string) => {
    setProviderSearchQuery(query);
    
    if (query.length >= 2 && onSearchProviders) {
      try {
        const results = await onSearchProviders(query);
        setProviderSearchResults(results);
      } catch (error) {
        console.error('Failed to search providers:', error);
        setProviderSearchResults([]);
      }
    } else {
      setProviderSearchResults([]);
    }
  }, [onSearchProviders]);

  /**
   * Handles form submission
   */
  const handleSchedule = async (): Promise<void> => {
    if (!selectedPatient || !selectedProvider || !selectedTimeSlot || !reason.trim()) {
      return;
    }

    setSaving(true);
    try {
      const appointmentData: Partial<Appointment> = {
        patient: getSelectedPatient()!,
        provider: getSelectedProvider()!,
        dateTime: `${selectedDate.toISOString().split('T')[0]}T${selectedTimeSlot.startTime}`,
        duration,
        type: appointmentType,
        status: 'scheduled',
        priority: appointmentPriority,
        reason: reason.trim(),
        location: isVirtual 
          ? { isVirtual: true, virtualLink: 'https://example.com/virtual-room' }
          : {
              isVirtual: false,
              room: getSelectedRoom()?.name,
              building: getSelectedRoom()?.building,
              address: getSelectedRoom() ? `${getSelectedRoom()?.name}, ${getSelectedRoom()?.building}` : undefined
            },
        notes: notes.trim() || undefined,
        preparationInstructions: preparationInstructions.filter(inst => inst.trim()).length > 0
          ? preparationInstructions.filter(inst => inst.trim())
          : undefined,
        lastUpdated: new Date().toISOString(),
        createdBy: 'current-user' // This would come from auth context
      };

      await onSchedule?.(appointmentData);
    } catch (error) {
      console.error('Failed to schedule appointment:', error);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Validates the form
   */
  const isFormValid = (): boolean => {
    return !!(
      selectedPatient &&
      selectedProvider &&
      selectedTimeSlot &&
      reason.trim() &&
      (!isVirtual ? selectedRoom : true)
    );
  };

  /**
   * Renders the date picker
   */
  const renderDatePicker = (): React.ReactElement => {
    const weekDays = getWeekDays();

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Select Date</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const newWeek = new Date(currentWeek);
                newWeek.setDate(newWeek.getDate() - 7);
                setCurrentWeek(newWeek);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label="Previous week"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
              {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
            </span>
            <button
              onClick={() => {
                const newWeek = new Date(currentWeek);
                newWeek.setDate(newWeek.getDate() + 7);
                setCurrentWeek(newWeek);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label="Next week"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => {
            const isSelected = day.toDateString() === selectedDate.toDateString();
            const isToday = day.toDateString() === new Date().toDateString();
            const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

            return (
              <button
                key={index}
                onClick={() => !isPast && handleDateSelect(day)}
                disabled={isPast}
                className={`
                  p-3 text-center rounded-lg border-2 transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : isPast
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                  ${isToday && !isSelected ? 'ring-2 ring-blue-200' : ''}
                `}
                aria-label={formatDate(day)}
                aria-pressed={isSelected}
              >
                <div className="text-xs text-gray-500 mb-1">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-lg font-medium">
                  {day.getDate()}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * Renders time slot selection
   */
  const renderTimeSlots = (): React.ReactElement => {
    if (!selectedProvider || !selectedDate) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Available Times</h3>
          <div className="text-center py-8 text-gray-500">
            <Clock size={48} className="mx-auto mb-3 text-gray-300" aria-hidden="true" />
            <p>Select a provider and date to view available times</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Available Times</h3>
          {loading && (
            <RefreshCw size={20} className="text-blue-500 animate-spin" aria-hidden="true" />
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500" role="status" aria-live="polite">
            <Clock size={48} className="mx-auto mb-3 text-gray-300" aria-hidden="true" />
            <p>Loading available times...</p>
          </div>
        ) : availableTimeSlots.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock size={48} className="mx-auto mb-3 text-gray-300" aria-hidden="true" />
            <p>No available times for the selected date</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {availableTimeSlots.map((slot) => {
              const isSelected = selectedTimeSlot?.id === slot.id;
              
              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedTimeSlot(slot)}
                  disabled={!slot.available}
                  className={`
                    p-3 text-center rounded-lg border transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : slot.available
                      ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }
                  `}
                  aria-label={`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}
                  aria-pressed={isSelected}
                >
                  <div className="text-sm font-medium">
                    {formatTime(slot.startTime)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {slot.duration}min
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule Appointment</h1>
            <p className="text-sm text-gray-600 mt-1">
              Create a new appointment for a patient
            </p>
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
          {renderDatePicker()}
          {renderTimeSlots()}
        </div>

        {/* Right Column - Appointment Details */}
        <div className="space-y-6">
          {/* Patient Selection */}
          {showPatientSelection && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4" id="patient-selection-label">Patient</h3>

              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" aria-hidden="true" />
                  <label htmlFor="patient-search-input" className="sr-only">Search for a patient</label>
                  <input
                    type="text"
                    id="patient-search-input"
                    placeholder="Search patients..."
                    value={patientSearchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePatientSearch(e.target.value)}
                    onFocus={() => setShowPatientSearch(true)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md
                             focus:ring-blue-500 focus:border-blue-500 text-sm"
                    aria-labelledby="patient-selection-label"
                    aria-autocomplete="list"
                    aria-controls="patient-search-results"
                    aria-expanded={showPatientSearch && (patientSearchResults.length > 0 || patients.length > 0)}
                  />
                  {patientSearchQuery && (
                    <button
                      onClick={() => {
                        setPatientSearchQuery('');
                        setPatientSearchResults([]);
                        setShowPatientSearch(false);
                      }}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      aria-label="Clear patient search"
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>

                {/* Patient Search Results */}
                {showPatientSearch && (patientSearchResults.length > 0 || patients.length > 0) && (
                  <div
                    id="patient-search-results"
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
                    role="listbox"
                    aria-label="Patient search results"
                  >
                    {(patientSearchResults.length > 0 ? patientSearchResults : patients.slice(0, 10)).map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => {
                          setSelectedPatient(patient.id);
                          setPatientSearchQuery(patient.name);
                          setShowPatientSearch(false);
                          onPatientChange?.(patient.id);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50
                                 focus:outline-none border-b border-gray-100 last:border-b-0"
                        role="option"
                        aria-selected={selectedPatient === patient.id}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            {patient.avatar ? (
                              <img
                                src={patient.avatar}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <User size={16} className="text-blue-600" aria-hidden="true" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {patient.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Patient Display */}
              {selectedPatient && getSelectedPatient() && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {getSelectedPatient()?.avatar ? (
                        <img
                          src={getSelectedPatient()?.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-blue-600" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {getSelectedPatient()?.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        DOB: {getSelectedPatient()?.dateOfBirth && new Date(getSelectedPatient()!.dateOfBirth).toLocaleDateString()}
                      </div>
                      {getSelectedPatient()?.phone && (
                        <div className="text-xs text-gray-600">
                          Phone: {getSelectedPatient()?.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Provider Selection */}
          {showProviderSelection && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4" id="provider-selection-label">Provider</h3>

              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" aria-hidden="true" />
                  <label htmlFor="provider-search-input" className="sr-only">Search for a provider</label>
                  <input
                    type="text"
                    id="provider-search-input"
                    placeholder="Search providers..."
                    value={providerSearchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProviderSearch(e.target.value)}
                    onFocus={() => setShowProviderSearch(true)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md
                             focus:ring-blue-500 focus:border-blue-500 text-sm"
                    aria-labelledby="provider-selection-label"
                    aria-autocomplete="list"
                    aria-controls="provider-search-results"
                    aria-expanded={showProviderSearch && (providerSearchResults.length > 0 || providers.length > 0)}
                  />
                  {providerSearchQuery && (
                    <button
                      onClick={() => {
                        setProviderSearchQuery('');
                        setProviderSearchResults([]);
                        setShowProviderSearch(false);
                      }}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      aria-label="Clear provider search"
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>

                {/* Provider Search Results */}
                {showProviderSearch && (providerSearchResults.length > 0 || providers.length > 0) && (
                  <div
                    id="provider-search-results"
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
                    role="listbox"
                    aria-label="Provider search results"
                  >
                    {(providerSearchResults.length > 0 ? providerSearchResults : providers.slice(0, 10)).map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => {
                          handleProviderSelect(provider.id);
                          setProviderSearchQuery(provider.name);
                          setShowProviderSearch(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50
                                 focus:outline-none border-b border-gray-100 last:border-b-0"
                        role="option"
                        aria-selected={selectedProvider === provider.id}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            {provider.avatar ? (
                              <img
                                src={provider.avatar}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <Stethoscope size={16} className="text-green-600" aria-hidden="true" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {provider.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {provider.title} • {provider.department}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Provider Display */}
              {selectedProvider && getSelectedProvider() && (
                <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      {getSelectedProvider()?.avatar ? (
                        <img
                          src={getSelectedProvider()?.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <Stethoscope size={20} className="text-green-600" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {getSelectedProvider()?.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {getSelectedProvider()?.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {getSelectedProvider()?.department}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Appointment Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Details</h3>
            
            <div className="space-y-4">
              {/* Virtual/In-Person Toggle */}
              {allowVirtual && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Appointment Type
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="appointmentMode"
                        checked={!isVirtual}
                        onChange={() => {
                          setIsVirtual(false);
                          setSelectedRoom('');
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex items-center">
                        <MapPin size={16} className="mr-1" aria-hidden="true" />
                        In-Person
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="appointmentMode"
                        checked={isVirtual}
                        onChange={() => {
                          setIsVirtual(true);
                          setSelectedRoom('');
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 flex items-center">
                        <Video size={16} className="mr-1" aria-hidden="true" />
                        Virtual
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Room Selection (for in-person appointments) */}
              {!isVirtual && showRoomSelection && (
                <div>
                  <label htmlFor="room-select" className="text-sm font-medium text-gray-700 mb-2 block">
                    Room
                  </label>
                  <select
                    id="room-select"
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md
                             focus:ring-blue-500 focus:border-blue-500 text-sm"
                    required={!isVirtual}
                    aria-required={!isVirtual}
                  >
                    <option value="">Select a room...</option>
                    {rooms.filter(room => !room.isVirtual).map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} - {room.building} (Capacity: {room.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Appointment Type */}
              <div>
                <label htmlFor="appointment-type-select" className="text-sm font-medium text-gray-700 mb-2 block">
                  Type
                </label>
                <select
                  id="appointment-type-select"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value as AppointmentType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="procedure">Procedure</option>
                  <option value="emergency">Emergency</option>
                  <option value="screening">Screening</option>
                  <option value="vaccination">Vaccination</option>
                  <option value="therapy">Therapy</option>
                  <option value="surgery">Surgery</option>
                  <option value="diagnostic">Diagnostic</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="appointment-priority-select" className="text-sm font-medium text-gray-700 mb-2 block">
                  Priority
                </label>
                <select
                  id="appointment-priority-select"
                  value={appointmentPriority}
                  onChange={(e) => setAppointmentPriority(e.target.value as AppointmentPriority)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="appointment-duration-input" className="text-sm font-medium text-gray-700 mb-2 block">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="appointment-duration-input"
                  min={minDuration}
                  max={maxDuration}
                  step={15}
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Reason */}
              <div>
                <label htmlFor="appointment-reason-input" className="text-sm font-medium text-gray-700 mb-2 block">
                  Reason for Visit *
                </label>
                <input
                  type="text"
                  id="appointment-reason-input"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for appointment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                  aria-required="true"
                />
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="appointment-notes-textarea" className="text-sm font-medium text-gray-700 mb-2 block">
                  Notes
                </label>
                <textarea
                  id="appointment-notes-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md
                           focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Preparation Instructions */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Preparation Instructions
                </label>
                <div className="space-y-2">
                  {preparationInstructions.map((instruction, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={instruction}
                        onChange={(e) => {
                          const newInstructions = [...preparationInstructions];
                          newInstructions[index] = e.target.value;
                          setPreparationInstructions(newInstructions);
                        }}
                        placeholder="Enter preparation instruction..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md 
                                 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newInstructions = preparationInstructions.filter((_, i) => i !== index);
                          setPreparationInstructions(newInstructions);
                        }}
                        className="p-2 text-red-400 hover:text-red-600 focus:outline-none
                                 focus:ring-2 focus:ring-red-500 rounded-md"
                        aria-label={`Remove preparation instruction ${index + 1}`}
                      >
                        <X size={16} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPreparationInstructions([...preparationInstructions, ''])}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700
                             focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                  >
                    <Plus size={16} className="mr-1" aria-hidden="true" />
                    Add instruction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduler;
