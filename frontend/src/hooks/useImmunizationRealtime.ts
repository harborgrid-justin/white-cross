/**
 * @fileoverview Real-time Immunization Updates Hook
 * @module hooks/useImmunizationRealtime
 *
 * WebSocket integration for live immunization dashboard updates.
 * Provides real-time notifications and cache invalidation.
 */

'use client';

import { useEffect, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket, useWebSocketEvent, useWebSocketChannel } from '@/services/websocket/useWebSocket';
import { WebSocketEvent } from '@/services/websocket/WebSocketService';

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
  const { isConnected } = useWebSocket();
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Subscribe to immunization channel
  useWebSocketChannel('immunizations', enabled && isConnected);

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
  // WEBSOCKET EVENT SUBSCRIPTIONS
  // ==========================================

  // Handle immunization administered events
  useWebSocketEvent('immunization:administered', (data: ImmunizationEventData) => {
    handleImmunizationEvent('administered', data);
  }, [handleImmunizationEvent]);

  // Handle immunization scheduled events
  useWebSocketEvent('immunization:scheduled', (data: ImmunizationEventData) => {
    handleImmunizationEvent('scheduled', data);
  }, [handleImmunizationEvent]);

  // Handle immunization overdue events
  useWebSocketEvent('immunization:overdue', (data: ImmunizationEventData) => {
    handleImmunizationEvent('overdue', data);
  }, [handleImmunizationEvent]);

  // Handle immunization cancelled events
  useWebSocketEvent('immunization:cancelled', (data: ImmunizationEventData) => {
    handleImmunizationEvent('cancelled', data);
  }, [handleImmunizationEvent]);

  // Handle health notifications that might be immunization-related
  useWebSocketEvent(WebSocketEvent.HEALTH_NOTIFICATION, (data: any) => {
    if (data.type === 'immunization') {
      handleImmunizationEvent(data.action, data);
    }
  }, [handleImmunizationEvent]);

  // ==========================================
  // CONNECTION STATUS TRACKING
  // ==========================================

  useEffect(() => {
    setIsSubscribed(enabled && isConnected);
  }, [enabled, isConnected]);

  // ==========================================
  // HOOK RETURN
  // ==========================================

  return {
    isConnected,
    isSubscribed,
    handleEvent: handleImmunizationEvent
  };
}