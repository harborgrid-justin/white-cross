'use client';

import React, { useState, useMemo, useCallback } from 'react';
import type { Appointment } from './AppointmentCard';
import type {
  AppointmentCalendarProps,
  CalendarFilters,
  CalendarView,
} from './types/calendarTypes';
import {
  getMonthCells,
  getWeekAppointments,
  getDayAppointments,
  getAppointmentStatusColor,
} from './utils/calendarUtils';
import CalendarToolbar from './components/CalendarToolbar';
import CalendarMonthView from './components/CalendarMonthView';
import CalendarWeekView from './components/CalendarWeekView';
import CalendarDayView from './components/CalendarDayView';

/**
 * AppointmentCalendar Component
 *
 * A comprehensive calendar component for viewing and managing appointments
 * with support for different views (month, week, day), filtering, and
 * appointment management features.
 *
 * @param props - AppointmentCalendar component props
 * @returns JSX element representing the appointment calendar
 */
const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments = [],
  defaultView = 'month',
  defaultDate = new Date(),
  showFilters = true,
  showToolbar = true,
  showAppointmentCount = true,
  editable = true,
  highlightWeekends = true,
  workingHours = { start: '08:00', end: '18:00' },
  className = '',
  onDateChange,
  onViewChange,
  onAppointmentClick,
  onCreateAppointment,
  onEditAppointment,
  onDeleteAppointment,
  onExportCalendar,
  onImportCalendar,
  onRefresh,
  onFilterChange,
}) => {
  // State
  const [currentDate, setCurrentDate] = useState<Date>(defaultDate);
  const [currentView, setCurrentView] = useState<CalendarView>(defaultView);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filters, setFilters] = useState<CalendarFilters>({});
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Memoized calendar cells for month view
   */
  const monthCells = useMemo(
    () => getMonthCells(currentDate, appointments, selectedDate),
    [currentDate, appointments, selectedDate]
  );

  /**
   * Memoized appointments for week view
   */
  const weekAppointments = useMemo(
    () => getWeekAppointments(currentDate, appointments),
    [currentDate, appointments]
  );

  /**
   * Memoized appointments for day view
   */
  const dayAppointments = useMemo(
    () => getDayAppointments(currentDate, appointments),
    [currentDate, appointments]
  );

  /**
   * Handles navigation (previous/next)
   */
  const handleNavigation = useCallback(
    (direction: 'prev' | 'next') => {
      const newDate = new Date(currentDate);

      switch (currentView) {
        case 'month':
          newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
          break;
        case 'week':
          newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
          break;
        case 'day':
          newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
          break;
      }

      setCurrentDate(newDate);
      onDateChange?.(newDate);
    },
    [currentDate, currentView, onDateChange]
  );

  /**
   * Handles view change
   */
  const handleViewChange = useCallback(
    (view: CalendarView) => {
      setCurrentView(view);
      onViewChange?.(view);
    },
    [onViewChange]
  );

  /**
   * Handles date selection
   */
  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setCurrentDate(date);
      onDateChange?.(date);
    },
    [onDateChange]
  );

  /**
   * Handles today button click
   */
  const handleTodayClick = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    onDateChange?.(today);
  }, [onDateChange]);

  /**
   * Handles filter menu toggle
   */
  const handleFilterMenuToggle = useCallback(() => {
    setShowFilterMenu(!showFilterMenu);
  }, [showFilterMenu]);

  /**
   * Handles filter changes
   */
  const handleFilterChange = useCallback(
    (newFilters: CalendarFilters) => {
      setFilters(newFilters);
      onFilterChange?.(newFilters);
    },
    [onFilterChange]
  );

  /**
   * Handles refresh
   */
  const handleRefresh = useCallback(() => {
    setLoading(true);
    onRefresh?.();
    setTimeout(() => setLoading(false), 1000);
  }, [onRefresh]);

  /**
   * Handles create appointment
   */
  const handleCreateAppointment = useCallback(() => {
    onCreateAppointment?.(selectedDate || currentDate);
  }, [selectedDate, currentDate, onCreateAppointment]);

  /**
   * Renders the current view based on currentView state
   */
  const renderCurrentView = () => {
    switch (currentView) {
      case 'week':
        return (
          <CalendarWeekView
            currentDate={currentDate}
            appointments={weekAppointments}
            onAppointmentClick={onAppointmentClick}
            onCreateAppointment={onCreateAppointment}
            getAppointmentStatusColor={getAppointmentStatusColor}
          />
        );
      case 'day':
        return (
          <CalendarDayView
            currentDate={currentDate}
            appointments={dayAppointments}
            editable={editable}
            onAppointmentClick={onAppointmentClick}
            onEditAppointment={onEditAppointment}
            onDeleteAppointment={onDeleteAppointment}
            onCreateAppointment={onCreateAppointment}
            getAppointmentStatusColor={getAppointmentStatusColor}
          />
        );
      default:
        return (
          <CalendarMonthView
            cells={monthCells}
            highlightWeekends={highlightWeekends}
            showAppointmentCount={showAppointmentCount}
            onDateSelect={handleDateSelect}
            onAppointmentClick={onAppointmentClick}
            getAppointmentStatusColor={getAppointmentStatusColor}
          />
        );
    }
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 ${className}`}>
      {/* Toolbar */}
      {showToolbar && (
        <CalendarToolbar
          currentDate={currentDate}
          currentView={currentView}
          selectedDate={selectedDate}
          filters={filters}
          showFilterMenu={showFilterMenu}
          showFilters={showFilters}
          editable={editable}
          loading={loading}
          onNavigate={handleNavigation}
          onViewChange={handleViewChange}
          onTodayClick={handleTodayClick}
          onFilterMenuToggle={handleFilterMenuToggle}
          onFilterChange={handleFilterChange}
          onRefresh={handleRefresh}
          onCreateAppointment={handleCreateAppointment}
        />
      )}

      {/* Calendar View */}
      {renderCurrentView()}

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
          <span>Scheduled</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
          <span>Confirmed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
