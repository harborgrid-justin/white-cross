/**
 * Health Records React Query Hooks
 *
 * Custom hooks for fetching and managing health records data with React Query.
 * Provides type-safe data fetching with automatic caching, loading, and error states.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthRecordsApi } from '../../../services/modules/healthRecordsApi';
import type {
  HealthRecord,
  Allergy,
  ChronicCondition,
  Vaccination,
  VitalSigns,
  GrowthMeasurement,
  Screening,
  HealthRecordFilters,
  HealthRecordCreate,
  HealthRecordUpdate,
  AllergyCreate,
  AllergyUpdate,
  ChronicConditionCreate,
  ChronicConditionUpdate,
  VaccinationCreate,
  VaccinationUpdate,
  VitalSignsCreate,
  VitalSignsUpdate,
  GrowthMeasurementCreate,
  GrowthMeasurementUpdate,
  ScreeningCreate,
  ScreeningUpdate,
} from '../../../services/modules/healthRecordsApi';
import { HEALTH_RECORD_META } from '../../../config/queryClient';
import toast from 'react-hot-toast';

// ==========================================
// QUERY KEYS
// ==========================================

export const healthRecordsKeys = {
  all: ['health-records'] as const,
  records: (studentId: string) => [...healthRecordsKeys.all, 'records', studentId] as const,
  record: (id: string) => [...healthRecordsKeys.all, 'record', id] as const,
  allergies: (studentId: string) => [...healthRecordsKeys.all, 'allergies', studentId] as const,
  conditions: (studentId: string) => [...healthRecordsKeys.all, 'conditions', studentId] as const,
  vaccinations: (studentId: string) => [...healthRecordsKeys.all, 'vaccinations', studentId] as const,
  vitalSigns: (studentId: string) => [...healthRecordsKeys.all, 'vital-signs', studentId] as const,
  growthMeasurements: (studentId: string) => [...healthRecordsKeys.all, 'growth', studentId] as const,
  screenings: (studentId: string) => [...healthRecordsKeys.all, 'screenings', studentId] as const,
  summary: (studentId: string) => [...healthRecordsKeys.all, 'summary', studentId] as const,
};

// ==========================================
// HEALTH RECORDS QUERIES
// ==========================================

/**
 * Fetch all health records for a student
 */
export function useHealthRecords(studentId: string, filters?: HealthRecordFilters) {
  return useQuery({
    queryKey: [...healthRecordsKeys.records(studentId), filters],
    queryFn: () => healthRecordsApi.getRecords(studentId, filters),
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Fetch a single health record by ID
 */
export function useHealthRecord(id: string) {
  return useQuery({
    queryKey: healthRecordsKeys.record(id),
    queryFn: () => healthRecordsApi.getRecordById(id),
    enabled: !!id,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new health record
 */
export function useCreateHealthRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HealthRecordCreate) => healthRecordsApi.createRecord(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.records(variables.studentId) });
      toast.success('Health record created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create health record');
    },
  });
}

/**
 * Update a health record
 */
export function useUpdateHealthRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: HealthRecordUpdate }) =>
      healthRecordsApi.updateRecord(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.records(result.studentId) });
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.record(result.id) });
      toast.success('Health record updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update health record');
    },
  });
}

/**
 * Delete a health record
 */
export function useDeleteHealthRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => healthRecordsApi.deleteRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Health record deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete health record');
    },
  });
}

// ==========================================
// ALLERGIES QUERIES
// ==========================================

/**
 * Fetch all allergies for a student
 */
export function useAllergies(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.allergies(studentId),
    queryFn: () => healthRecordsApi.getAllergies(studentId),
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new allergy
 */
export function useCreateAllergy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AllergyCreate) => healthRecordsApi.createAllergy(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.allergies(variables.studentId) });
      toast.success('Allergy added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add allergy');
    },
  });
}

/**
 * Update an allergy
 */
export function useUpdateAllergy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AllergyUpdate }) =>
      healthRecordsApi.updateAllergy(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.allergies(result.studentId) });
      toast.success('Allergy updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update allergy');
    },
  });
}

/**
 * Delete an allergy
 */
export function useDeleteAllergy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => healthRecordsApi.deleteAllergy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Allergy deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete allergy');
    },
  });
}

// ==========================================
// CHRONIC CONDITIONS QUERIES
// ==========================================

/**
 * Fetch all chronic conditions for a student
 */
export function useConditions(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.conditions(studentId),
    queryFn: () => healthRecordsApi.getConditions(studentId),
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new chronic condition
 */
export function useCreateCondition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChronicConditionCreate) => healthRecordsApi.createCondition(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.conditions(variables.studentId) });
      toast.success('Chronic condition added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add chronic condition');
    },
  });
}

/**
 * Update a chronic condition
 */
export function useUpdateCondition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChronicConditionUpdate }) =>
      healthRecordsApi.updateCondition(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.conditions(result.studentId) });
      toast.success('Chronic condition updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update chronic condition');
    },
  });
}

/**
 * Delete a chronic condition
 */
export function useDeleteCondition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => healthRecordsApi.deleteCondition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Chronic condition deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete chronic condition');
    },
  });
}

// ==========================================
// VACCINATIONS QUERIES
// ==========================================

/**
 * Fetch all vaccinations for a student
 */
export function useVaccinations(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.vaccinations(studentId),
    queryFn: () => healthRecordsApi.getVaccinations(studentId),
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new vaccination
 */
export function useCreateVaccination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VaccinationCreate) => healthRecordsApi.createVaccination(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.vaccinations(variables.studentId) });
      toast.success('Vaccination added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add vaccination');
    },
  });
}

/**
 * Update a vaccination
 */
export function useUpdateVaccination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VaccinationUpdate }) =>
      healthRecordsApi.updateVaccination(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.vaccinations(result.studentId) });
      toast.success('Vaccination updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update vaccination');
    },
  });
}

/**
 * Delete a vaccination
 */
export function useDeleteVaccination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => healthRecordsApi.deleteVaccination(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Vaccination deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete vaccination');
    },
  });
}

// ==========================================
// VITAL SIGNS QUERIES
// ==========================================

/**
 * Fetch vital signs for a student
 */
export function useVitalSigns(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.vitalSigns(studentId),
    queryFn: () => healthRecordsApi.getVitalSigns(studentId),
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create new vital signs record
 */
export function useCreateVitalSigns() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VitalSignsCreate) => healthRecordsApi.createVitalSigns(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.vitalSigns(variables.studentId) });
      toast.success('Vital signs recorded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to record vital signs');
    },
  });
}

/**
 * Update vital signs
 */
export function useUpdateVitalSigns() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VitalSignsUpdate }) =>
      healthRecordsApi.updateVitalSigns(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.vitalSigns(result.studentId) });
      toast.success('Vital signs updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update vital signs');
    },
  });
}

/**
 * Delete vital signs
 */
export function useDeleteVitalSigns() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => healthRecordsApi.deleteVitalSigns(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Vital signs deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete vital signs');
    },
  });
}

// ==========================================
// GROWTH MEASUREMENTS QUERIES
// ==========================================

/**
 * Fetch growth measurements for a student
 */
export function useGrowthMeasurements(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.growthMeasurements(studentId),
    queryFn: () => healthRecordsApi.getGrowthMeasurements(studentId),
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new growth measurement
 */
export function useCreateGrowthMeasurement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GrowthMeasurementCreate) => healthRecordsApi.createGrowthMeasurement(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.growthMeasurements(variables.studentId) });
      toast.success('Growth measurement added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add growth measurement');
    },
  });
}

/**
 * Update a growth measurement
 */
export function useUpdateGrowthMeasurement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GrowthMeasurementUpdate }) =>
      healthRecordsApi.updateGrowthMeasurement(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.growthMeasurements(result.studentId) });
      toast.success('Growth measurement updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update growth measurement');
    },
  });
}

/**
 * Delete a growth measurement
 */
export function useDeleteGrowthMeasurement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => healthRecordsApi.deleteGrowthMeasurement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Growth measurement deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete growth measurement');
    },
  });
}

// ==========================================
// SCREENINGS QUERIES
// ==========================================

/**
 * Fetch screenings for a student
 */
export function useScreenings(studentId: string) {
  return useQuery({
    queryKey: healthRecordsKeys.screenings(studentId),
    queryFn: () => healthRecordsApi.getScreenings(studentId),
    enabled: !!studentId,
    meta: HEALTH_RECORD_META,
  });
}

/**
 * Create a new screening
 */
export function useCreateScreening() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScreeningCreate) => healthRecordsApi.createScreening(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.screenings(variables.studentId) });
      toast.success('Screening added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add screening');
    },
  });
}

/**
 * Update a screening
 */
export function useUpdateScreening() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ScreeningUpdate }) =>
      healthRecordsApi.updateScreening(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.screenings(result.studentId) });
      toast.success('Screening updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update screening');
    },
  });
}

/**
 * Delete a screening
 */
export function useDeleteScreening() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => healthRecordsApi.deleteScreening(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: healthRecordsKeys.all });
      toast.success('Screening deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete screening');
    },
  });
}
