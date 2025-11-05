/**
 * @fileoverview Real-time Immunization Updates Hook
 * @module hooks/useImmunizationRealtime
 *
 * WebSocket integration for live immunization dashboard updates.
 * Provides real-time notifications and cache invalidation.
 */

'use client';

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// ==========================================
// REALTIME TYPES
// ==========================================

export interface ImmunizationEvent {
  type: 'administered' | 'scheduled' | 'overdue' | 'cancelled';
  studentId: string;
  vaccineType: string;
  vaccineName: string;
  timestamp: string;
  administeredBy?: string;
  notes?: string;
}

interface ImmunizationEventData {
  studentId: string;
  vaccineType: string;
  vaccineName: string;
  timestamp?: string;
  administeredBy?: string;
  notes?: string;
}

// ==========================================
// HOOK CONFIGURATION
// ==========================================

interface UseImmunizationRealtimeOptions {
  enabled?: boolean;
  studentId?: string; // Filter events for specific student
  onEvent?: (event: ImmunizationEvent) => void;
  onError?: (error: Error) => void;
}

// ==========================================
// HOOK IMPLEMENTATION
// ==========================================

/**
 * Real-time immunization updates hook
 * Connects to WebSocket for live dashboard updates
 */
export function useImmunizationRealtime(options: UseImmunizationRealtimeOptions = {}) {
  const {
    enabled = true,
    studentId,
    onEvent,
    onError
  } = options;

  const queryClient = useQueryClient();

  // ==========================================
  // EVENT HANDLERS
  // ==========================================

  const handleImmunizationEvent = useCallback((eventType: string, data: ImmunizationEventData) => {
    try {
      const event: ImmunizationEvent = {
        type: eventType as ImmunizationEvent['type'],
        studentId: data.studentId,
        vaccineType: data.vaccineType,
        vaccineName: data.vaccineName,
        timestamp: data.timestamp || new Date().toISOString(),
        administeredBy: data.administeredBy,
        notes: data.notes
      };

      // Filter by student if specified
      if (studentId && event.studentId !== studentId) {
        return;
      }

      // Trigger callback
      onEvent?.(event);

      // Invalidate relevant queries based on event type
      switch (eventType) {
        case 'administered':
          queryClient.invalidateQueries({ queryKey: ['immunizations', 'stats'] });
          queryClient.invalidateQueries({ queryKey: ['immunizations', 'activity'] });
          queryClient.invalidateQueries({ queryKey: ['immunizations', 'compliance'] });
          break;
        case 'scheduled':
          queryClient.invalidateQueries({ queryKey: ['immunizations', 'activity'] });
          break;
        case 'overdue':
          queryClient.invalidateQueries({ queryKey: ['immunizations', 'stats'] });
          break;
      }

      console.log(`[ImmunizationRealtime] ${eventType} event:`, event);
    } catch (error) {
      console.error(`[ImmunizationRealtime] Error handling ${eventType} event:`, error);
      onError?.(error as Error);
    }
  }, [queryClient, studentId, onEvent, onError]);

  // ==========================================
  // WEBSOCKET INTEGRATION
  // ==========================================

  useEffect(() => {
    if (!enabled) return;

    console.log('[ImmunizationRealtime] Initializing real-time updates');

    // Mock WebSocket connection for development
    // TODO: Replace with actual WebSocket service integration
    const mockEvents = [
      'immunization_administered',
      'immunization_scheduled', 
      'immunization_overdue'
    ];

    // Simulate periodic updates for development
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const eventType = mockEvents[Math.floor(Math.random() * mockEvents.length)];
        const mockData = {
          studentId: `student-${Math.floor(Math.random() * 100)}`,
          vaccineType: ['covid19', 'flu', 'measles', 'hepatitis_b'][Math.floor(Math.random() * 4)],
          vaccineName: ['COVID-19', 'Influenza', 'MMR', 'Hepatitis B'][Math.floor(Math.random() * 4)],
          timestamp: new Date().toISOString(),
          administeredBy: 'Nurse Johnson'
        };

        handleImmunizationEvent(eventType.replace('immunization_', ''), mockData);
      }
    }, 30000); // Every 30 seconds

    // Cleanup
    return () => {
      clearInterval(interval);
      console.log('[ImmunizationRealtime] Cleaned up real-time connections');
    };
  }, [enabled, handleImmunizationEvent]);

  // ==========================================
  // HOOK RETURN
  // ==========================================

  return {
    isConnected: enabled, // Mock connection status
    handleEvent: handleImmunizationEvent
  };
}