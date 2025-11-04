/**
 * Health Records Query Keys
 *
 * Query key factories for React Query caching and invalidation.
 */

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
