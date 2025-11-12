/**
 * @fileoverview Health Record Chronic Condition Service
 * @module health-record/chronic-condition
 * @description Chronic condition tracking with care plan management
 * HIPAA Compliance: All chronic condition data is PHI and requires audit logging
 */

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ChronicCondition, ConditionStatus   } from "../../database/models";
import { Student   } from "../../database/models";

@Injectable()
export class ChronicConditionService {
  private readonly logger = new Logger(ChronicConditionService.name);

  constructor(
    @InjectModel(ChronicCondition)
    private readonly chronicConditionModel: typeof ChronicCondition,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {}

  async addChronicCondition(conditionData: any): Promise<ChronicCondition> {
    this.logger.log(
      `Adding chronic condition for student ${conditionData.studentId}`,
    );

    // Verify student exists
    const student = await this.studentModel.findByPk(conditionData.studentId);
    if (!student) {
      throw new BadRequestException(
        `Student with ID ${conditionData.studentId} not found`,
      );
    }

    const condition = await this.chronicConditionModel.create({
      ...conditionData,
      status: ConditionStatus.ACTIVE,
      isActive: true,
    });

    this.logger.log(
      `PHI Created: Chronic condition record created for student ${conditionData.studentId}`,
    );
    return condition;
  }

  async getChronicConditions(studentId?: string): Promise<ChronicCondition[]> {
    this.logger.log(
      `Getting chronic conditions${studentId ? ` for student ${studentId}` : ''}`,
    );

    const whereClause: any = { isActive: true };
    if (studentId) {
      whereClause.studentId = studentId;
    }

    return await this.chronicConditionModel.findAll({
      where: whereClause,
      include: [
        {
          model: Student,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [
        ['status', 'ASC'],
        ['nextReviewDate', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    });
  }

  async findOne(id: string, user: any): Promise<ChronicCondition> {
    this.logger.log(`Finding chronic condition ${id} for user ${user.id}`);
    const condition = await this.chronicConditionModel.findByPk(id, {
      include: [
        {
          model: Student,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    if (!condition) {
      throw new NotFoundException(`Chronic condition with ID ${id} not found`);
    }

    return condition;
  }

  async findByStudent(
    studentId: string,
    user: any,
  ): Promise<ChronicCondition[]> {
    this.logger.log(
      `Finding chronic conditions for student ${studentId} by user ${user.id}`,
    );

    // Verify student exists
    const student = await this.studentModel.findByPk(studentId);
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return await this.chronicConditionModel.findAll({
      where: {
        studentId,
        isActive: true,
      },
      order: [
        ['status', 'ASC'],
        ['nextReviewDate', 'ASC'],
      ],
    });
  }

  async create(createDto: any, user: any): Promise<ChronicCondition> {
    this.logger.log(
      `Creating chronic condition for student ${createDto.studentId} by user ${user.id}`,
    );

    // Verify student exists
    const student = await this.studentModel.findByPk(createDto.studentId);
    if (!student) {
      throw new BadRequestException(
        `Student with ID ${createDto.studentId} not found`,
      );
    }

    const condition = await this.chronicConditionModel.create({
      ...createDto,
      status: ConditionStatus.ACTIVE,
      isActive: true,
      createdBy: user.id,
    });

    this.logger.log(
      `PHI Created: Chronic condition record created for student ${createDto.studentId}`,
    );
    return condition;
  }

  async update(
    id: string,
    updateDto: any,
    user: any,
  ): Promise<ChronicCondition> {
    const condition = await this.chronicConditionModel.findByPk(id);
    if (!condition) {
      throw new NotFoundException(`Chronic condition with ID ${id} not found`);
    }

    await condition.update({
      ...updateDto,
      updatedBy: user.id,
    });

    this.logger.log(
      `PHI Updated: Chronic condition ${id} updated by user ${user.id}`,
    );
    return condition;
  }

  async remove(id: string, user: any): Promise<void> {
    const condition = await this.chronicConditionModel.findByPk(id);
    if (!condition) {
      throw new NotFoundException(`Chronic condition with ID ${id} not found`);
    }

    // Soft delete by setting isActive to false
    await condition.update({
      isActive: false,
      status: ConditionStatus.RESOLVED,
    });

    this.logger.log(
      `PHI Deleted: Chronic condition ${id} deactivated by user ${user.id}`,
    );
  }

  async findActive(studentId?: string): Promise<ChronicCondition[]> {
    this.logger.log(
      `Finding active chronic conditions${studentId ? ` for student ${studentId}` : ''}`,
    );

    const whereClause: any = {
      isActive: true,
      status: ConditionStatus.ACTIVE,
    };

    if (studentId) {
      whereClause.studentId = studentId;
    }

    return await this.chronicConditionModel.findAll({
      where: whereClause,
      include: [
        {
          model: Student,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [
        ['nextReviewDate', 'ASC'],
        ['severity', 'DESC'],
      ],
    });
  }

  async updateCarePlan(
    conditionId: string,
    plan: any,
    user: any,
  ): Promise<ChronicCondition> {
    this.logger.log(
      `Updating care plan for chronic condition ${conditionId} by user ${user.id}`,
    );

    const condition = await this.chronicConditionModel.findByPk(conditionId);
    if (!condition) {
      throw new NotFoundException(
        `Chronic condition with ID ${conditionId} not found`,
      );
    }

    await condition.update({
      carePlan: plan,
      lastReviewDate: new Date(),
    });

    this.logger.log(
      `PHI Updated: Care plan updated for chronic condition ${conditionId}`,
    );
    return condition;
  }

  async search(query: string, filters: any = {}): Promise<ChronicCondition[]> {
    this.logger.log(`Searching chronic conditions with query: ${query}`);

    const whereClause: any = { isActive: true };

    // Text search
    if (query) {
      whereClause[Op.or] = [
        { condition: { [Op.iLike]: `%${query}%` } },
        { diagnosis: { [Op.iLike]: `%${query}%` } },
        { icdCode: { [Op.iLike]: `%${query}%` } },
        { notes: { [Op.iLike]: `%${query}%` } },
      ];
    }

    // Apply filters
    if (filters.status) {
      whereClause.status = filters.status;
    }
    if (filters.severity) {
      whereClause.severity = filters.severity;
    }
    if (filters.studentId) {
      whereClause.studentId = filters.studentId;
    }
    if (filters.requiresIEP !== undefined) {
      whereClause.requiresIEP = filters.requiresIEP;
    }
    if (filters.requires504 !== undefined) {
      whereClause.requires504 = filters.requires504;
    }

    return await this.chronicConditionModel.findAll({
      where: whereClause,
      include: [
        {
          model: Student,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [
        ['status', 'ASC'],
        ['nextReviewDate', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    });
  }

  /**
   * Get conditions requiring review
   */
  async getConditionsRequiringReview(): Promise<ChronicCondition[]> {
    this.logger.log('Getting chronic conditions requiring review');

    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(now.getMonth() + 1);

    return await this.chronicConditionModel.findAll({
      where: {
        isActive: true,
        nextReviewDate: {
          [Op.lte]: nextMonth,
        },
      },
      include: [
        {
          model: Student,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['nextReviewDate', 'ASC']],
    });
  }

  /**
   * Get conditions by ICD code
   */
  async getConditionsByICDCode(icdCode: string): Promise<ChronicCondition[]> {
    this.logger.log(`Getting chronic conditions with ICD code: ${icdCode}`);

    return await this.chronicConditionModel.findAll({
      where: {
        isActive: true,
        icdCode: {
          [Op.iLike]: `%${icdCode}%`,
        },
      },
      include: [
        {
          model: Student,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['condition', 'ASC']],
    });
  }

  /**
   * Get conditions requiring accommodations
   */
  async getConditionsRequiringAccommodations(): Promise<ChronicCondition[]> {
    this.logger.log('Getting chronic conditions requiring accommodations');

    return await this.chronicConditionModel.findAll({
      where: {
        isActive: true,
        [Op.or]: [{ requiresIEP: true }, { requires504: true }],
      },
      include: [
        {
          model: Student,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['condition', 'ASC']],
    });
  }
}
