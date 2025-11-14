/**
 * Health Record DTOs Barrel Export
 * Provides centralized exports for health record DTOs
 */

export { HealthRecordCreateDto } from './create-health-record.dto';
export { HealthRecordFilterDto } from './health-record-filter.dto';
export { HealthRecordUpdateDto } from './update-health-record.dto';
export { ImportHealthRecordsDto } from './import-health-records.dto';

// Response DTOs
export {
  HealthRecordResponseDto,
  HealthRecordSummaryDto,
  HealthRecordListResponseDto,
  HealthSummaryDto,
  StudentSummaryDto,
  HealthRecordType,
  mapHealthRecordToResponseDto,
  mapHealthRecordToSummaryDto,
} from './health-record-response.dto';
