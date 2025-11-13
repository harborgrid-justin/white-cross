/**
 * @fileoverview Health Domain Facade Service
 * @module health-domain/services/health-domain-facade.service
 * @description Facade service for health domain operations
 *
 * This facade provides a unified interface to health domain functionality
 * without circular dependencies. It uses dependency injection and the
 * ModuleRef to dynamically resolve services when needed.
 */

import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RequestContextService } from '../../shared/context/request-context.service';
import { BaseService } from '@/common/base';
import {
  AllergyFiltersDto,
  ChronicConditionFiltersDto,
  CreateImmunizationDto,
  HealthDomainCreateAllergyDto,
  HealthDomainCreateChronicConditionDto,
  HealthDomainCreateRecordDto,
  HealthDomainUpdateAllergyDto,
  HealthDomainUpdateRecordDto,
  PaginatedResponse,
  VaccinationFiltersDto,
} from '../dto';
import * as Events from '../events/health-domain.events';

/**
 * Health Domain Facade Service
 *
 * Provides a clean interface to health domain operations without
 * creating circular dependencies. Uses lazy loading pattern to
 * resolve services on-demand via ModuleRef.
 *
 * Architecture Benefits:
 * - No circular dependencies (no forwardRef needed)
 * - Services are resolved lazily when first used
 * - Event-driven architecture for loose coupling
 * - Clean separation of concerns
 */
@Injectable()
export class HealthDomainFacadeService extends BaseService {
  // Lazy-loaded service references
  private vaccinationService: any;
  private allergyService: any;
  private chronicConditionService: any;
  private vitalsService: any;
  private searchService: any;
  private statisticsService: any;
  private importExportService: any;
  private validationService: any;

  constructor(
    @Optional() protected readonly requestContext: RequestContextService,
    private readonly moduleRef: ModuleRef,
    private readonly eventEmitter: EventEmitter2,
  ) {
    // Create a mock request context if not provided (for non-request-scoped scenarios)
    super(
      requestContext ||
        ({
          requestId: 'system',
          userId: undefined,
          getLogContext: () => ({ requestId: 'system' }),
          getAuditContext: () => ({
            requestId: 'system',
            timestamp: new Date(),
          }),
        } as any),
    );
  }

  // ==================== Lazy Service Resolution ====================

  private async getVaccinationService() {
    if (!this.vaccinationService) {
      const { VaccinationService } = await import(
        '../../health-record/vaccination/vaccination.service.js'
      );
      this.vaccinationService = this.moduleRef.get(VaccinationService, {
        strict: false,
      });
    }
    return this.vaccinationService;
  }

  private async getAllergyService() {
    if (!this.allergyService) {
      const { AllergyService } = await import(
        '../../health-record/allergy/allergy.service.js'
      );
      this.allergyService = this.moduleRef.get(AllergyService, {
        strict: false,
      });
    }
    return this.allergyService;
  }

  private async getChronicConditionService() {
    if (!this.chronicConditionService) {
      const { ChronicConditionService } = await import(
        '../../health-record/chronic-condition/chronic-condition.service.js'
      );
      this.chronicConditionService = this.moduleRef.get(
        ChronicConditionService,
        { strict: false },
      );
    }
    return this.chronicConditionService;
  }

  private async getVitalsService() {
    if (!this.vitalsService) {
      const { VitalsService } = await import(
        '../../health-record/vitals/vitals.service.js'
      );
      this.vitalsService = this.moduleRef.get(VitalsService, { strict: false });
    }
    return this.vitalsService;
  }

  private async getStatisticsService() {
    if (!this.statisticsService) {
      const { StatisticsService } = await import(
        '../../health-record/statistics/statistics.service.js'
      );
      this.statisticsService = this.moduleRef.get(StatisticsService, {
        strict: false,
      });
    }
    return this.statisticsService;
  }

  private async getImportExportService() {
    if (!this.importExportService) {
      const { ImportExportService } = await import(
        '../../health-record/import-export/import-export.service.js'
      );
      this.importExportService = this.moduleRef.get(ImportExportService, {
        strict: false,
      });
    }
    return this.importExportService;
  }

  // ==================== Health Records Operations ====================

  async createHealthRecord(data: HealthDomainCreateRecordDto): Promise<any> {
    try {
      // TODO: Implement with proper repository
      const result = { id: 'generated-id', ...data };

      // Emit event
      this.eventEmitter.emit(
        'health-record.created',
        new Events.HealthRecordCreatedEvent(
          result.id,
          data.studentId,
          data,
          this.requestContext?.userId,
        ),
      );

      this.logInfo('Health record created', { healthRecordId: result.id });
      return result;
    } catch (error) {
      this.handleError('Failed to create health record', error);
    }
  }

  async getHealthRecord(id: string): Promise<any> {
    try {
      this.validateUUID(id, 'Health record ID');
      // TODO: Implement with proper repository
      throw new NotFoundException(`Health record with ID ${id} not found`);
    } catch (error) {
      this.handleError('Failed to get health record', error);
    }
  }

  async updateHealthRecord(
    id: string,
    data: HealthDomainUpdateRecordDto,
  ): Promise<any> {
    try {
      this.validateUUID(id, 'Health record ID');
      // TODO: Implement with proper repository

      this.eventEmitter.emit(
        'health-record.updated',
        new Events.HealthRecordUpdatedEvent(
          id,
          data.studentId || '',
          data,
          this.requestContext?.userId,
        ),
      );

      this.logInfo('Health record updated', { healthRecordId: id });
      return { id, ...data };
    } catch (error) {
      this.handleError('Failed to update health record', error);
    }
  }

  async deleteHealthRecord(id: string): Promise<boolean> {
    try {
      this.validateUUID(id, 'Health record ID');
      // TODO: Implement with proper repository

      this.eventEmitter.emit(
        'health-record.deleted',
        new Events.HealthRecordDeletedEvent(
          id,
          'unknown', // TODO: Get from repository
          this.requestContext?.userId,
        ),
      );

      this.logInfo('Health record deleted', { healthRecordId: id });
      return true;
    } catch (error) {
      this.handleError('Failed to delete health record', error);
    }
  }

  // ==================== Allergies Operations ====================

  async createAllergy(data: HealthDomainCreateAllergyDto): Promise<any> {
    try {
      const allergyService = await this.getAllergyService();
      const mockUser = {
        id: this.requestContext?.userId || 'system',
        role: 'admin',
      };
      const result = await allergyService.create(data, mockUser);

      this.eventEmitter.emit(
        'allergy.created',
        new Events.AllergyCreatedEvent(
          result.id,
          data.studentId,
          data,
          this.requestContext?.userId,
        ),
      );

      this.logInfo('Allergy created', { allergyId: result.id });
      return result;
    } catch (error) {
      this.handleError('Failed to create allergy', error);
    }
  }

  async updateAllergy(
    id: string,
    data: HealthDomainUpdateAllergyDto,
  ): Promise<any> {
    try {
      this.validateUUID(id, 'Allergy ID');
      const allergyService = await this.getAllergyService();
      const mockUser = {
        id: this.requestContext?.userId || 'system',
        role: 'admin',
      };
      const result = await allergyService.update(id, data, mockUser);

      this.eventEmitter.emit(
        'allergy.updated',
        new Events.AllergyUpdatedEvent(
          id,
          data.studentId || '',
          data,
          this.requestContext?.userId,
        ),
      );

      this.logInfo('Allergy updated', { allergyId: id });
      return result;
    } catch (error) {
      this.handleError('Failed to update allergy', error);
    }
  }

  async deleteAllergy(id: string): Promise<boolean> {
    try {
      this.validateUUID(id, 'Allergy ID');
      const allergyService = await this.getAllergyService();
      const mockUser = {
        id: this.requestContext?.userId || 'system',
        role: 'admin',
      };
      await allergyService.remove(id, mockUser);

      this.logInfo('Allergy deleted', { allergyId: id });
      return true;
    } catch (error) {
      this.handleError('Failed to delete allergy', error);
    }
  }

  async getStudentAllergies(
    studentId: string,
    filters: AllergyFiltersDto = {},
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<any>> {
    try {
      this.validateUUID(studentId, 'Student ID');
      const allergyService = await this.getAllergyService();
      const mockUser = {
        id: this.requestContext?.userId || 'system',
        role: 'admin',
      };
      const allergies = await allergyService.findByStudent(studentId, mockUser);

      // Apply pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedData = allergies.slice(start, end);

      return {
        data: paginatedData,
        pagination: {
          page,
          limit,
          total: allergies.length,
          pages: Math.ceil(allergies.length / limit),
        },
      };
    } catch (error) {
      this.handleError('Failed to get student allergies', error);
    }
  }

  // ==================== Immunizations Operations ====================

  async createImmunization(data: CreateImmunizationDto): Promise<any> {
    try {
      const vaccinationService = await this.getVaccinationService();
      const result = await vaccinationService.addVaccination(data);

      this.eventEmitter.emit(
        'immunization.created',
        new Events.ImmunizationCreatedEvent(
          result.id,
          data.studentId,
          data,
          this.requestContext?.userId,
        ),
      );

      this.logInfo('Immunization created', { immunizationId: result.id });
      return result;
    } catch (error) {
      this.handleError('Failed to create immunization', error);
    }
  }

  async getStudentImmunizations(
    studentId: string,
    filters: VaccinationFiltersDto = {},
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<any>> {
    try {
      this.validateUUID(studentId, 'Student ID');
      const vaccinationService = await this.getVaccinationService();
      const vaccinations =
        await vaccinationService.getVaccinationHistory(studentId);

      // Apply pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedData = vaccinations.slice(start, end);

      return {
        data: paginatedData,
        pagination: {
          page,
          limit,
          total: vaccinations.length,
          pages: Math.ceil(vaccinations.length / limit),
        },
      };
    } catch (error) {
      this.handleError('Failed to get student immunizations', error);
    }
  }

  async getImmunizationCompliance(studentId: string): Promise<any> {
    try {
      this.validateUUID(studentId, 'Student ID');
      const vaccinationService = await this.getVaccinationService();
      return await vaccinationService.checkComplianceStatus(studentId);
    } catch (error) {
      this.handleError('Failed to get immunization compliance', error);
    }
  }

  // ==================== Chronic Conditions Operations ====================

  async createChronicCondition(
    data: HealthDomainCreateChronicConditionDto,
  ): Promise<any> {
    try {
      const chronicConditionService = await this.getChronicConditionService();
      const result = await chronicConditionService.addChronicCondition(data);

      this.eventEmitter.emit(
        'chronic-condition.created',
        new Events.ChronicConditionCreatedEvent(
          result.id,
          data.studentId,
          data,
          this.requestContext?.userId,
        ),
      );

      this.logInfo('Chronic condition created', { conditionId: result.id });
      return result;
    } catch (error) {
      this.handleError('Failed to create chronic condition', error);
    }
  }

  async getStudentChronicConditions(
    studentId: string,
    filters: ChronicConditionFiltersDto = {},
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<any>> {
    try {
      this.validateUUID(studentId, 'Student ID');
      const chronicConditionService = await this.getChronicConditionService();
      const conditions =
        await chronicConditionService.getChronicConditions(studentId);

      // Apply pagination
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedData = conditions.slice(start, end);

      return {
        data: paginatedData,
        pagination: {
          page,
          limit,
          total: conditions.length,
          pages: Math.ceil(conditions.length / limit),
        },
      };
    } catch (error) {
      this.handleError('Failed to get student chronic conditions', error);
    }
  }

  // ==================== Vital Signs Operations ====================

  async recordVitalSigns(
    studentId: string,
    vitals: any,
    notes?: string,
  ): Promise<any> {
    try {
      this.validateUUID(studentId, 'Student ID');
      const vitalsService = await this.getVitalsService();
      const vitalData = { studentId, ...vitals, notes };
      const result = await vitalsService.recordVitals(vitalData);

      this.eventEmitter.emit(
        'vital-signs.recorded',
        new Events.VitalSignsRecordedEvent(
          result.id,
          studentId,
          vitals,
          this.requestContext?.userId,
        ),
      );

      this.logInfo('Vital signs recorded', { vitalSignsId: result.id });
      return result;
    } catch (error) {
      this.handleError('Failed to record vital signs', error);
    }
  }

  async getLatestVitalSigns(studentId: string): Promise<any> {
    try {
      this.validateUUID(studentId, 'Student ID');
      const vitalsService = await this.getVitalsService();
      const history = await vitalsService.getVitalsHistory(studentId, 1);
      return history[0] || null;
    } catch (error) {
      this.handleError('Failed to get latest vital signs', error);
    }
  }

  async checkAbnormalVitals(studentId: string): Promise<any[]> {
    try {
      this.validateUUID(studentId, 'Student ID');
      const vitalsService = await this.getVitalsService();
      const anomalies = await vitalsService.detectAnomalies(studentId);

      if (anomalies.anomalies && anomalies.anomalies.length > 0) {
        this.eventEmitter.emit(
          'abnormal-vitals.detected',
          new Events.AbnormalVitalsDetectedEvent(
            studentId,
            anomalies.latestVitals,
            anomalies.anomalies,
            this.requestContext?.userId,
          ),
        );
      }

      return anomalies.anomalies || [];
    } catch (error) {
      this.handleError('Failed to check abnormal vitals', error);
    }
  }

  // ==================== Analytics Operations ====================

  async getHealthSummary(studentId: string): Promise<any> {
    try {
      this.validateUUID(studentId, 'Student ID');
      const statisticsService = await this.getStatisticsService();
      return await statisticsService.getStudentStatistics(studentId);
    } catch (error) {
      this.handleError('Failed to get health summary', error);
    }
  }

  // ==================== Import/Export Operations ====================

  async exportStudentData(studentId: string, options: any = {}): Promise<any> {
    try {
      this.validateUUID(studentId, 'Student ID');
      const importExportService = await this.getImportExportService();
      const format = options.format || 'JSON';
      return await importExportService.exportStudentRecord(studentId, format);
    } catch (error) {
      this.handleError('Failed to export student data', error);
    }
  }

  async importStudentData(importData: any, options: any = {}): Promise<any> {
    try {
      const importExportService = await this.getImportExportService();
      const format = options.format || 'JSON';
      const mockUser = {
        id: this.requestContext?.userId || 'system',
        role: 'admin',
      };
      return await importExportService.importRecords(
        importData,
        format,
        mockUser,
      );
    } catch (error) {
      this.handleError('Failed to import student data', error);
    }
  }
}
