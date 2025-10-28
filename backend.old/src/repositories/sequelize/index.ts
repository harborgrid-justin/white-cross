/**
 * Sequelize Repository Implementations - Barrel Export
 * @description Exports all Sequelize repository implementations and factory
 */

export { SequelizeMedicationRepository } from './SequelizeMedicationRepository';
export { SequelizeHealthRecordRepository } from './SequelizeHealthRecordRepository';
export { SequelizeStudentRepository } from './SequelizeStudentRepository';
export { SequelizeIncidentReportRepository } from './SequelizeIncidentReportRepository';
export { SequelizeInventoryRepository } from './SequelizeInventoryRepository';

export {
  RepositoryFactory,
  medicationRepository,
  healthRecordRepository,
  studentRepository,
  incidentReportRepository,
  inventoryRepository
} from './RepositoryFactory';
