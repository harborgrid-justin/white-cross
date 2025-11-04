/**
 * @fileoverview Immunization Data Hook
 * @module app/immunizations/components/hooks
 *
 * Custom hook for fetching and managing immunization data.
 * Handles data loading, transformation, and state management.
 */

import { useState, useEffect } from 'react';
import {
  getImmunizationRecords,
  type ImmunizationRecord,
} from '@/lib/actions/immunizations.actions';
import type { Immunization, ImmunizationType, ImmunizationStatus, ImmunizationPriority } from '../types/immunization.types';

/**
 * Transform server ImmunizationRecord to UI Immunization format
 * @param record - Server immunization record
 * @returns UI immunization object
 */
const transformImmunizationRecord = (record: ImmunizationRecord): Immunization => {
  return {
    id: record.id,
    studentId: record.studentId,
    studentName: record.studentName || 'Unknown Student',
    vaccineName: record.vaccineName,
    immunizationType: (record.vaccineType?.toLowerCase() || 'covid19') as ImmunizationType,
    scheduledDate: undefined, // Not available in ImmunizationRecord
    administeredDate: record.administeredDate,
    dueDate: record.nextDueDate || new Date().toISOString().split('T')[0],
    status: record.administeredDate ? 'administered' : ('scheduled' as ImmunizationStatus),
    priority: 'medium' as ImmunizationPriority,
    seriesPosition: record.doseNumber ? `${record.doseNumber}` : '1',
    notes: record.notes,
    lotNumber: record.lotNumber,
    manufacturer: record.manufacturer,
    administeredBy: record.administeredByName || record.administeredBy,
    nextDue: record.nextDueDate,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

/**
 * Hook return type
 */
interface UseImmunizationDataReturn {
  immunizations: Immunization[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for managing immunization data
 * @param initialImmunizations - Optional initial data to prevent fetching
 * @returns Immunization data, loading state, error state, and refetch function
 */
export const useImmunizationData = (
  initialImmunizations: Immunization[] = []
): UseImmunizationDataReturn => {
  const [immunizations, setImmunizations] = useState<Immunization[]>(initialImmunizations);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchImmunizations = async () => {
    let isMounted = true;

    try {
      if (isMounted) {
        setLoading(true);
        setError(null);
      }

      // Load immunizations from server actions
      const immunizationRecords = await getImmunizationRecords();

      // Only update state if component is still mounted
      if (!isMounted) return;

      // Transform server data to UI format
      const transformedData = immunizationRecords.map(transformImmunizationRecord);

      setImmunizations(transformedData);
    } catch (err) {
      console.error('Failed to load immunizations:', err);
      if (isMounted) {
        setError(err instanceof Error ? err : new Error('Failed to load immunizations'));
        setImmunizations([]);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {
    if (initialImmunizations.length > 0) {
      setImmunizations(initialImmunizations);
      setLoading(false);
    } else {
      fetchImmunizations();
    }
  }, [initialImmunizations]);

  // Fallback to mock data if no real data loaded
  useEffect(() => {
    if (initialImmunizations.length === 0 && immunizations.length === 0 && !loading) {
      const now = new Date();
      const mockImmunizations: Immunization[] = [
        {
          id: 'imm-001',
          studentId: 'student-001',
          studentName: 'Emily Johnson',
          vaccineName: 'COVID-19 Pfizer-BioNTech',
          immunizationType: 'covid19',
          scheduledDate: now.toISOString().split('T')[0],
          dueDate: now.toISOString().split('T')[0],
          status: 'scheduled',
          priority: 'high',
          seriesPosition: '2 of 2',
          notes: 'Student has no known allergies',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: 'imm-002',
          studentId: 'student-002',
          studentName: 'Michael Chen',
          vaccineName: 'Influenza Quadrivalent',
          immunizationType: 'flu',
          administeredDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          dueDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          status: 'administered',
          priority: 'medium',
          lotNumber: 'FL2024-001',
          manufacturer: 'Sanofi Pasteur',
          administeredBy: 'Nurse Williams',
          seriesPosition: '1 of 1',
          nextDue: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: 'imm-003',
          studentId: 'student-003',
          studentName: 'Sarah Martinez',
          vaccineName: 'MMR (Measles, Mumps, Rubella)',
          immunizationType: 'measles',
          dueDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          status: 'overdue',
          priority: 'urgent',
          seriesPosition: '2 of 2',
          notes: 'Parent requested delay, follow up needed',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: 'imm-004',
          studentId: 'student-004',
          studentName: 'David Thompson',
          vaccineName: 'Hepatitis B',
          immunizationType: 'hepatitis_b',
          scheduledDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          status: 'scheduled',
          priority: 'medium',
          seriesPosition: '3 of 3',
          notes: 'Final dose in series',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: 'imm-005',
          studentId: 'student-005',
          studentName: 'Jessica Lee',
          vaccineName: 'Tdap (Tetanus, Diphtheria, Pertussis)',
          immunizationType: 'tetanus',
          dueDate: now.toISOString().split('T')[0],
          status: 'declined',
          priority: 'high',
          seriesPosition: '1 of 1',
          notes: 'Religious exemption on file',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: 'imm-006',
          studentId: 'student-006',
          studentName: 'Alexander Brown',
          vaccineName: 'Varicella (Chickenpox)',
          immunizationType: 'varicella',
          administeredDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          dueDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          status: 'administered',
          priority: 'medium',
          lotNumber: 'VAR2024-089',
          manufacturer: 'Merck',
          administeredBy: 'Nurse Johnson',
          seriesPosition: '2 of 2',
          reactions: ['Mild soreness at injection site'],
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      ];

      setImmunizations(mockImmunizations);
    }
  }, [initialImmunizations, immunizations.length, loading]);

  return {
    immunizations,
    loading,
    error,
    refetch: fetchImmunizations,
  };
};
