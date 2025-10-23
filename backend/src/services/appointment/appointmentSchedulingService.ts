/**
 * Appointment Scheduling Service - Smart scheduling with AI-powered conflict detection
 * Author: System
 * Date: 2024
 * Description: Service for intelligent appointment scheduling, conflict detection, and optimization
 */

import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';
import { logger } from '../../utils/logger';

interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  conflicts?: string[];
  score?: number;
}

interface SchedulingConstraints {
  preferredDays?: string[];
  preferredTimes?: string[];
  maxTravelTime?: number;
  providerPreferences?: number[];
}

interface ConflictDetails {
  type: 'provider_busy' | 'room_occupied' | 'patient_conflict' | 'resource_unavailable';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  conflictingAppointmentId?: number;
  suggestedAlternatives?: Date[];
}

interface AppointmentData {
  patientId: number;
  providerId: number;
  appointmentType: string;
  dateTime: Date;
  duration: number;
  notes?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  department?: string;
  roomId?: number;
  reminderPreferences?: {
    email: boolean;
    sms: boolean;
    reminderTimes: number[];
  };
}

class AppointmentSchedulingService {
  constructor() {
    // Using Sequelize instance from config
  }

  async getAvailableSlots(params: {
    providerId: number;
    date: Date;
    duration: number;
    preferredTimes?: string[];
    appointmentType?: string;
  }): Promise<TimeSlot[]> {
    try {
      // Simulate smart slot finding with availability analysis
      const { providerId, date, duration, preferredTimes, appointmentType } = params;
      
      // Generate time slots for the day (9 AM to 5 PM in 30-minute intervals)
      const slots: TimeSlot[] = [];
      const startOfDay = new Date(date);
      startOfDay.setHours(9, 0, 0, 0);
      
      for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const slotStart = new Date(startOfDay);
          slotStart.setHours(hour, minute);
          
          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + duration);
          
          // Skip if slot extends beyond working hours
          if (slotEnd.getHours() >= 17) continue;
          
          // Simulate availability (80% chance available)
          const available = Math.random() > 0.2;
          
          // Higher score for preferred times
          let score = 0.5;
          if (preferredTimes && preferredTimes.includes(`${hour}:${minute.toString().padStart(2, '0')}`)) {
            score = 0.9;
          }
          
          // Simulate some conflicts for demo
          const conflicts = [];
          if (!available) {
            conflicts.push('Provider has existing appointment');
          }
          
          slots.push({
            start: slotStart,
            end: slotEnd,
            available,
            conflicts: conflicts.length > 0 ? conflicts : undefined,
            score
          });
        }
      }
      
      // Return only available slots, sorted by score
      return slots
        .filter(slot => slot.available)
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 10); // Return top 10 slots
        
    } catch (error) {
      console.error('Error getting available slots:', error);
      throw new Error('Failed to get available slots');
    }
  }

  async scheduleAppointment(appointmentData: AppointmentData, userId: number): Promise<any> {
    try {
      // First check for conflicts
      const conflicts = await this.checkConflicts({
        providerId: appointmentData.providerId,
        dateTime: appointmentData.dateTime,
        duration: appointmentData.duration,
        checkPatientConflicts: true,
        checkResourceConflicts: true
      });

      if (conflicts.hasConflicts) {
        throw new Error(`Scheduling conflicts detected: ${conflicts.conflicts.map(c => c.description).join(', ')}`);
      }

      // Simulate appointment creation
      const appointment = {
        id: Math.floor(Math.random() * 10000),
        ...appointmentData,
        status: 'scheduled',
        createdBy: userId,
        createdAt: new Date(),
        confirmationCode: `CONF-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      };

      // In a real implementation, this would save to database
      logger.info('Appointment scheduled', { appointmentId: appointment.id, confirmationCode: appointment.confirmationCode });

      return appointment;
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      throw new Error('Failed to schedule appointment');
    }
  }

  async checkConflicts(params: {
    providerId: number;
    dateTime: Date;
    duration: number;
    excludeAppointmentId?: number;
    roomId?: number;
    checkPatientConflicts?: boolean;
    checkResourceConflicts?: boolean;
  }): Promise<{ hasConflicts: boolean; conflicts: ConflictDetails[] }> {
    try {
      const conflicts: ConflictDetails[] = [];
      
      // Simulate conflict checking
      const { providerId, dateTime, duration, roomId } = params;
      
      // Provider availability check (simulate 20% chance of conflict)
      if (Math.random() < 0.2) {
        conflicts.push({
          type: 'provider_busy',
          severity: 'high',
          description: `Provider ${providerId} has an existing appointment`,
          conflictingAppointmentId: Math.floor(Math.random() * 1000),
          suggestedAlternatives: [
            new Date(dateTime.getTime() + 30 * 60000), // 30 minutes later
            new Date(dateTime.getTime() + 60 * 60000), // 1 hour later
          ]
        });
      }

      // Room availability check (if room specified)
      if (roomId && Math.random() < 0.15) {
        conflicts.push({
          type: 'room_occupied',
          severity: 'medium',
          description: `Room ${roomId} is occupied during requested time`,
          suggestedAlternatives: [
            new Date(dateTime.getTime() + 45 * 60000), // 45 minutes later
          ]
        });
      }

      // Resource conflicts (equipment, etc.)
      if (params.checkResourceConflicts && Math.random() < 0.1) {
        conflicts.push({
          type: 'resource_unavailable',
          severity: 'medium',
          description: 'Required medical equipment is scheduled for maintenance',
          suggestedAlternatives: [
            new Date(dateTime.getTime() + 24 * 60 * 60000), // Next day
          ]
        });
      }

      return {
        hasConflicts: conflicts.length > 0,
        conflicts
      };
    } catch (error) {
      console.error('Error checking conflicts:', error);
      throw new Error('Failed to check conflicts');
    }
  }

  async getSchedulingSuggestions(params: {
    patientId: number;
    appointmentType: string;
    urgency: string;
    constraints?: SchedulingConstraints;
  }): Promise<any> {
    try {
      const { patientId, appointmentType, urgency, constraints } = params;
      
      // Simulate AI-powered suggestions
      const suggestions = [];
      const now = new Date();
      
      // Generate suggestions based on urgency
      let daysAhead = 1;
      switch (urgency) {
        case 'urgent':
          daysAhead = 1;
          break;
        case 'high':
          daysAhead = 3;
          break;
        case 'normal':
          daysAhead = 7;
          break;
        case 'low':
          daysAhead = 14;
          break;
      }

      for (let i = 0; i < 5; i++) {
        const suggestedDate = new Date(now);
        suggestedDate.setDate(now.getDate() + Math.floor(Math.random() * daysAhead) + 1);
        
        // Suggest times based on appointment type
        let suggestedHour = 10; // Default to 10 AM
        if (appointmentType.toLowerCase().includes('follow-up')) {
          suggestedHour = 14; // 2 PM for follow-ups
        } else if (appointmentType.toLowerCase().includes('consultation')) {
          suggestedHour = 9; // 9 AM for consultations
        }
        
        suggestedDate.setHours(suggestedHour + Math.floor(Math.random() * 6), 0, 0, 0);
        
        suggestions.push({
          dateTime: suggestedDate,
          providerId: Math.floor(Math.random() * 10) + 1,
          providerName: `Dr. Provider ${Math.floor(Math.random() * 10) + 1}`,
          department: appointmentType.includes('cardio') ? 'Cardiology' : 'General Medicine',
          estimatedDuration: appointmentType.includes('consultation') ? 60 : 30,
          confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
          reasoning: [
            'Provider specializes in this appointment type',
            'Time slot aligns with patient preferences',
            'Optimal scheduling for department workflow'
          ].slice(0, Math.floor(Math.random() * 3) + 1)
        });
      }

      return {
        suggestions: suggestions.sort((a, b) => b.confidence - a.confidence),
        patientHistory: {
          preferredTimes: ['09:00', '14:00'],
          preferredProviders: [1, 3, 5],
          avgAppointmentDuration: 35,
          noShowRate: 0.05
        },
        optimizationTips: [
          'Consider grouping multiple appointments on the same day',
          'Schedule follow-ups 2-4 weeks after initial consultation',
          'Morning appointments have lower no-show rates for this patient'
        ]
      };
    } catch (error) {
      console.error('Error getting scheduling suggestions:', error);
      throw new Error('Failed to get scheduling suggestions');
    }
  }

  async rescheduleAppointment(appointmentId: number, rescheduleData: any, userId: number): Promise<any> {
    try {
      // Check conflicts for new time
      const conflicts = await this.checkConflicts({
        providerId: rescheduleData.newProviderId || 1, // Would get from existing appointment
        dateTime: rescheduleData.newDateTime,
        duration: rescheduleData.newDuration || 30,
        excludeAppointmentId: appointmentId
      });

      if (conflicts.hasConflicts) {
        throw new Error(`Rescheduling conflicts detected: ${conflicts.conflicts.map(c => c.description).join(', ')}`);
      }

      // Simulate rescheduling
      const rescheduled = {
        appointmentId,
        oldDateTime: new Date(), // Would get from existing appointment
        newDateTime: rescheduleData.newDateTime,
        newDuration: rescheduleData.newDuration,
        newProviderId: rescheduleData.newProviderId,
        reason: rescheduleData.reason,
        rescheduledBy: userId,
        rescheduledAt: new Date(),
        notificationsScheduled: {
          patient: rescheduleData.notifyPatient,
          provider: rescheduleData.notifyProvider
        }
      };

      return rescheduled;
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw new Error('Failed to reschedule appointment');
    }
  }

  async getConflictAnalysis(params: {
    timeRange: string;
    providerId?: number;
    department?: string;
  }): Promise<any> {
    try {
      // Simulate conflict analysis
      const analysis = {
        timeRange: params.timeRange,
        totalConflicts: Math.floor(Math.random() * 20) + 5,
        conflictsByType: {
          provider_busy: Math.floor(Math.random() * 8) + 2,
          room_occupied: Math.floor(Math.random() * 5) + 1,
          patient_conflict: Math.floor(Math.random() * 3),
          resource_unavailable: Math.floor(Math.random() * 4) + 1
        },
        conflictTrends: [
          { date: '2024-10-15', conflicts: 3 },
          { date: '2024-10-16', conflicts: 7 },
          { date: '2024-10-17', conflicts: 4 },
          { date: '2024-10-18', conflicts: 8 },
          { date: '2024-10-19', conflicts: 2 }
        ],
        peakConflictTimes: [
          { time: '09:00-10:00', conflicts: 12 },
          { time: '14:00-15:00', conflicts: 8 },
          { time: '11:00-12:00', conflicts: 6 }
        ],
        resolutionSuggestions: [
          'Add more morning appointment slots',
          'Consider staggered lunch breaks for providers',
          'Implement buffer time between appointments',
          'Cross-train staff to handle multiple appointment types'
        ],
        utilizationMetrics: {
          averageUtilization: 0.78,
          peakUtilization: 0.95,
          lowUtilizationPeriods: ['13:00-14:00', '16:00-17:00']
        }
      };

      return analysis;
    } catch (error) {
      console.error('Error getting conflict analysis:', error);
      throw new Error('Failed to get conflict analysis');
    }
  }

  async optimizeSchedule(params: any): Promise<any> {
    try {
      // Simulate schedule optimization
      const optimization = {
        originalSchedule: {
          totalAppointments: Math.floor(Math.random() * 50) + 30,
          utilizationRate: 0.72,
          avgWaitTime: 18,
          conflicts: 8
        },
        optimizedSchedule: {
          totalAppointments: Math.floor(Math.random() * 55) + 35,
          utilizationRate: 0.89,
          avgWaitTime: 12,
          conflicts: 2
        },
        improvements: {
          utilizationIncrease: '17%',
          waitTimeReduction: '33%',
          conflictReduction: '75%',
          additionalAppointments: 8
        },
        changes: [
          {
            type: 'appointment_moved',
            appointmentId: 123,
            from: '2024-10-18T10:00:00Z',
            to: '2024-10-18T11:30:00Z',
            reason: 'Reduced provider idle time'
          },
          {
            type: 'appointment_moved',
            appointmentId: 124,
            from: '2024-10-18T15:00:00Z',
            to: '2024-10-18T14:30:00Z',
            reason: 'Consolidated afternoon schedule'
          }
        ],
        recommendedActions: [
          'Implement the suggested schedule changes',
          'Set up automatic notifications for affected patients',
          'Review optimization results after 1 week',
          'Consider implementing dynamic scheduling for future appointments'
        ]
      };

      return optimization;
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      throw new Error('Failed to optimize schedule');
    }
  }

  async getProviderAvailability(params: {
    providerId: number;
    startDate: Date;
    endDate: Date;
    includeBlocked?: boolean;
  }): Promise<any> {
    try {
      const { providerId, startDate, endDate, includeBlocked } = params;
      
      // Simulate provider availability calendar
      const availability = [];
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const dayAvailability = {
          date: new Date(currentDate),
          dayOfWeek: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
          isWorkingDay: currentDate.getDay() >= 1 && currentDate.getDay() <= 5, // Mon-Fri
          workingHours: {
            start: '09:00',
            end: '17:00',
            lunchBreak: { start: '12:00', end: '13:00' }
          },
          bookedSlots: [],
          blockedSlots: [],
          availableSlots: []
        };

        // Generate some booked appointments
        if (dayAvailability.isWorkingDay) {
          const numBookedSlots = Math.floor(Math.random() * 6) + 2;
          for (let i = 0; i < numBookedSlots; i++) {
            const startHour = Math.floor(Math.random() * 7) + 9; // 9 AM to 4 PM
            const startMinute = Math.random() < 0.5 ? 0 : 30;
            dayAvailability.bookedSlots.push({
              start: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
              end: `${startHour + (startMinute === 30 ? 1 : 0)}:${startMinute === 30 ? '00' : '30'}`,
              patientName: `Patient ${Math.floor(Math.random() * 100)}`,
              appointmentType: 'Consultation'
            });
          }

          // Generate blocked time (if requested)
          if (includeBlocked && Math.random() < 0.3) {
            dayAvailability.blockedSlots.push({
              start: '15:00',
              end: '16:00',
              reason: 'Administrative tasks',
              type: 'admin'
            });
          }

          // Calculate available slots (simplified)
          dayAvailability.availableSlots = [
            { start: '09:00', end: '09:30' },
            { start: '10:30', end: '11:00' },
            { start: '13:30', end: '14:00' },
            { start: '16:00', end: '16:30' }
          ].filter(slot => 
            !dayAvailability.bookedSlots.some(booked => 
              slot.start === booked.start
            )
          );
        }

        availability.push(dayAvailability);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return {
        providerId,
        provider: {
          name: `Dr. Provider ${providerId}`,
          department: 'General Medicine',
          specialties: ['Internal Medicine', 'Preventive Care']
        },
        dateRange: { startDate, endDate },
        availability,
        summary: {
          totalWorkingDays: availability.filter(day => day.isWorkingDay).length,
          totalAvailableSlots: availability.reduce((sum, day) => sum + day.availableSlots.length, 0),
          utilizationRate: 0.73,
          nextAvailableSlot: availability
            .find(day => day.availableSlots.length > 0)
            ?.availableSlots[0]
        }
      };
    } catch (error) {
      console.error('Error getting provider availability:', error);
      throw new Error('Failed to get provider availability');
    }
  }
}

export const appointmentSchedulingService = new AppointmentSchedulingService();
