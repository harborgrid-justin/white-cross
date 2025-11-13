import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateFollowUpActionDto } from '../dto/create-follow-up-action.dto';
import { CreateIncidentReportDto } from '../dto/create-incident-report.dto';
import { CreateWitnessStatementDto } from '../dto/create-witness-statement.dto';
import { ActionPriority } from '../enums/action-priority.enum';
import { ActionStatus } from '../enums/action-status.enum';
import { IncidentType } from '../enums/incident-type.enum';

import { BaseService } from '@/common/base';
@Injectable()
export class IncidentValidationService extends BaseService {
  /**
   * Validate incident report data before creation
   */
  async validateIncidentReportData(
    data: CreateIncidentReportDto,
  ): Promise<void> {
    // 1. Validate incident time is not in the future
    const occurredAt = new Date(data.occurredAt);
    if (occurredAt > new Date()) {
      throw new BadRequestException('Incident time cannot be in the future');
    }

    // 2. Validate description minimum length (already validated by DTO, but double-check)
    if (data.description.length < 20) {
      throw new BadRequestException(
        'Description must be at least 20 characters for proper documentation',
      );
    }

    // 3. Validate location is provided for safety incidents
    if (!data.location || data.location.trim().length < 3) {
      throw new BadRequestException(
        'Location is required for safety documentation (minimum 3 characters)',
      );
    }

    // 4. Validate actions taken is documented
    if (!data.actionsTaken || data.actionsTaken.trim().length < 10) {
      throw new BadRequestException(
        'Actions taken must be documented for all incidents (minimum 10 characters)',
      );
    }

    // 5. Auto-set follow-up required for INJURY type
    if (data.type === IncidentType.INJURY && !data.followUpRequired) {
      data.followUpRequired = true;
      this.logInfo('Auto-setting followUpRequired=true for INJURY incident');
    }

    // 6. Validate medication errors have detailed description
    if (
      data.type === IncidentType.MEDICATION_ERROR &&
      data.description.length < 50
    ) {
      throw new BadRequestException(
        'Medication error incidents require detailed description (minimum 50 characters)',
      );
    }

    this.logInfo('Incident report validation passed');
  }

  /**
   * Validate witness statement data
   */
  validateWitnessStatementData(data: CreateWitnessStatementDto): void {
    // Validate witness statement minimum length
    if (!data.statement || data.statement.trim().length < 20) {
      throw new BadRequestException(
        'Witness statement must be at least 20 characters for proper documentation',
      );
    }

    // Validate witness name minimum length
    if (!data.witnessName || data.witnessName.trim().length < 2) {
      throw new BadRequestException(
        'Witness name must be at least 2 characters',
      );
    }

    this.logInfo('Witness statement validation passed');
  }

  /**
   * Validate follow-up action data
   */
  validateFollowUpActionData(data: CreateFollowUpActionDto): void {
    // Validate action description minimum length
    if (!data.action || data.action.trim().length < 5) {
      throw new BadRequestException(
        'Follow-up action must be at least 5 characters',
      );
    }

    // Validate due date is in the future
    const dueDate = new Date(data.dueDate);
    if (dueDate <= new Date()) {
      throw new BadRequestException('Due date must be in the future');
    }

    // Validate priority is set
    if (!data.priority) {
      throw new BadRequestException(
        'Priority is required for follow-up actions',
      );
    }

    // Warn if URGENT priority but due date is more than 24 hours away
    if (data.priority === ActionPriority.URGENT) {
      const now = new Date();
      const hoursDiff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        this.logWarning(
          `URGENT priority action with due date more than 24 hours away`,
        );
      }
    }

    this.logInfo('Follow-up action validation passed');
  }

  /**
   * Validate follow-up action status update
   */
  validateFollowUpActionStatusUpdate(
    status: ActionStatus,
    completedBy?: string,
    notes?: string,
  ): void {
    // Validate COMPLETED status requires completedBy
    if (status === ActionStatus.COMPLETED) {
      if (!completedBy) {
        throw new BadRequestException(
          'Completed actions must have a completedBy user',
        );
      }
      if (!notes || notes.trim().length === 0) {
        this.logWarning('Follow-up action completed without notes');
      }
    }

    this.logInfo('Follow-up action status update validation passed');
  }

  /**
   * Validate evidence URLs
   */
  validateEvidenceUrls(urls: string[]): void {
    if (!urls || urls.length === 0) {
      throw new BadRequestException('Evidence URLs are required');
    }

    const invalidUrls = urls.filter((url) => !this.isValidUrl(url));
    if (invalidUrls.length > 0) {
      throw new BadRequestException(
        `Invalid URLs detected: ${invalidUrls.join(', ')}`,
      );
    }

    this.logInfo('Evidence URL validation passed');
  }

  /**
   * Validate if a URL is properly formatted
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      // If it's not a full URL, check if it's a valid file path
      return Boolean(
        url && url.length > 0 && !url.includes('..') && !url.startsWith('/'),
      );
    }
  }
}
