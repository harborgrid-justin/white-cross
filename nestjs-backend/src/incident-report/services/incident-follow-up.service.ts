import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, LessThanOrEqual } from 'typeorm';
import { FollowUpAction } from '../entities/follow-up-action.entity';
import { IncidentReport } from '../entities/incident-report.entity';
import { CreateFollowUpActionDto } from '../dto/create-follow-up-action.dto';
import { UpdateFollowUpActionDto } from '../dto/update-follow-up-action.dto';
import { IncidentValidationService } from './incident-validation.service';
import { ActionStatus, ActionPriority } from '../enums';

@Injectable()
export class IncidentFollowUpService {
  private readonly logger = new Logger(IncidentFollowUpService.name);

  constructor(
    @InjectRepository(FollowUpAction)
    private followUpActionRepository: Repository<FollowUpAction>,
    @InjectRepository(IncidentReport)
    private incidentReportRepository: Repository<IncidentReport>,
    private validationService: IncidentValidationService,
  ) {}

  /**
   * Add follow-up action to incident report with validation
   */
  async addFollowUpAction(
    incidentReportId: string,
    dto: CreateFollowUpActionDto,
  ): Promise<FollowUpAction> {
    try {
      const report = await this.incidentReportRepository.findOne({
        where: { id: incidentReportId },
      });

      if (!report) {
        throw new NotFoundException('Incident report not found');
      }

      // Validate follow-up action data
      this.validationService.validateFollowUpActionData(dto);

      const followUpAction = this.followUpActionRepository.create({
        incidentReportId,
        ...dto,
        status: ActionStatus.PENDING,
      });

      const savedAction = await this.followUpActionRepository.save(followUpAction);

      this.logger.log(`Follow-up action added to incident ${incidentReportId}`);
      return savedAction;
    } catch (error) {
      this.logger.error('Error adding follow-up action:', error);
      throw error;
    }
  }

  /**
   * Update follow-up action status with validation
   */
  async updateFollowUpAction(
    actionId: string,
    dto: UpdateFollowUpActionDto,
  ): Promise<FollowUpAction> {
    try {
      const action = await this.followUpActionRepository.findOne({
        where: { id: actionId },
      });

      if (!action) {
        throw new NotFoundException('Follow-up action not found');
      }

      // Validate status update if provided
      if (dto.status) {
        this.validationService.validateFollowUpActionStatusUpdate(
          dto.status,
          dto.completedBy,
          dto.notes,
        );

        if (dto.status === ActionStatus.COMPLETED) {
          action.completedAt = new Date();
        }
      }

      // Merge updates
      Object.assign(action, dto);

      const updatedAction = await this.followUpActionRepository.save(action);

      this.logger.log(`Follow-up action ${actionId} updated`);
      return updatedAction;
    } catch (error) {
      this.logger.error('Error updating follow-up action:', error);
      throw error;
    }
  }

  /**
   * Get follow-up actions for an incident
   */
  async getFollowUpActions(incidentReportId: string): Promise<FollowUpAction[]> {
    try {
      const actions = await this.followUpActionRepository.find({
        where: { incidentReportId },
        order: { dueDate: 'ASC' },
      });

      return actions;
    } catch (error) {
      this.logger.error('Error fetching follow-up actions:', error);
      throw error;
    }
  }

  /**
   * Get overdue follow-up actions
   */
  async getOverdueActions(): Promise<FollowUpAction[]> {
    try {
      const now = new Date();
      const actions = await this.followUpActionRepository.find({
        where: {
          status: ActionStatus.PENDING,
          dueDate: LessThan(now),
        },
        order: { dueDate: 'ASC' },
      });

      return actions;
    } catch (error) {
      this.logger.error('Error fetching overdue actions:', error);
      throw error;
    }
  }

  /**
   * Get pending follow-up actions assigned to a user
   */
  async getUserPendingActions(assignedTo: string): Promise<FollowUpAction[]> {
    try {
      const actions = await this.followUpActionRepository.find({
        where: {
          assignedTo,
          status: ActionStatus.PENDING,
        },
        order: { dueDate: 'ASC' },
      });

      return actions;
    } catch (error) {
      this.logger.error('Error fetching user pending actions:', error);
      throw error;
    }
  }

  /**
   * Get urgent follow-up actions (due within 24 hours)
   */
  async getUrgentActions(): Promise<FollowUpAction[]> {
    try {
      const tomorrow = new Date();
      tomorrow.setHours(tomorrow.getHours() + 24);

      const actions = await this.followUpActionRepository.find({
        where: {
          status: ActionStatus.PENDING,
          dueDate: LessThanOrEqual(tomorrow),
          priority: ActionPriority.URGENT,
        },
        order: { dueDate: 'ASC' },
      });

      return actions;
    } catch (error) {
      this.logger.error('Error fetching urgent actions:', error);
      throw error;
    }
  }

  /**
   * Delete follow-up action
   */
  async deleteFollowUpAction(actionId: string): Promise<boolean> {
    try {
      const action = await this.followUpActionRepository.findOne({
        where: { id: actionId },
      });

      if (!action) {
        throw new NotFoundException('Follow-up action not found');
      }

      // Don't allow deleting completed actions
      if (action.status === ActionStatus.COMPLETED) {
        throw new BadRequestException('Cannot delete completed follow-up actions');
      }

      await this.followUpActionRepository.remove(action);

      this.logger.log(`Follow-up action ${actionId} deleted`);
      return true;
    } catch (error) {
      this.logger.error('Error deleting follow-up action:', error);
      throw error;
    }
  }

  /**
   * Get follow-up action statistics
   */
  async getFollowUpStatistics(dateFrom?: Date, dateTo?: Date) {
    try {
      const whereClause: any = {};

      if (dateFrom || dateTo) {
        whereClause.createdAt = {};
        if (dateFrom) {
          whereClause.createdAt = { ...whereClause.createdAt, gte: dateFrom };
        }
        if (dateTo) {
          whereClause.createdAt = { ...whereClause.createdAt, lte: dateTo };
        }
      }

      const [total, pending, completed, overdue] = await Promise.all([
        this.followUpActionRepository.count({ where: whereClause }),
        this.followUpActionRepository.count({
          where: { ...whereClause, status: ActionStatus.PENDING },
        }),
        this.followUpActionRepository.count({
          where: { ...whereClause, status: ActionStatus.COMPLETED },
        }),
        this.followUpActionRepository.count({
          where: {
            ...whereClause,
            status: ActionStatus.PENDING,
            dueDate: LessThan(new Date()),
          },
        }),
      ]);

      return {
        total,
        pending,
        completed,
        overdue,
        completionRate: total > 0 ? (completed / total) * 100 : 0,
      };
    } catch (error) {
      this.logger.error('Error fetching follow-up statistics:', error);
      throw error;
    }
  }
}
