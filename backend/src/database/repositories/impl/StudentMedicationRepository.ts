/**
 * StudentMedicationRepository Implementation
 * Repository for StudentMedication data access with CRUD operations
 */

import { BaseRepository, RepositoryError } from '../base/BaseRepository';
import { StudentMedication } from '../../models/medication/StudentMedication';
import {
  IStudentMedicationRepository,
  CreateStudentMedicationDTO,
  UpdateStudentMedicationDTO
} from '../interfaces/IStudentMedicationRepository';
import { IAuditLogger } from '../../audit/IAuditLogger';
import { ICacheManager } from '../../cache/ICacheManager';
import { logger } from '../../../utils/logger';

export class StudentMedicationRepository
  extends BaseRepository<StudentMedication, any, any>
  implements IStudentMedicationRepository
{
  constructor(auditLogger: IAuditLogger, cacheManager: ICacheManager) {
    super(StudentMedication, auditLogger, cacheManager, 'StudentMedication');
  }
}
