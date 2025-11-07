/**
 * @fileoverview Health Record Allergy Service
 * @module health-record/allergy
 * @description Allergy management within health records context
 * HIPAA Compliance: All allergy data is PHI and requires audit logging
 */

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import {
  Allergy,
  AllergySeverity,
  AllergyType,
} from '../../database/models/allergy.model';
import { Student } from '../../database/models/student.model';
import { CreateAllergyDto, UpdateAllergyDto, AllergyFilterDto } from './dto';
import { AuthenticatedUser } from '../../shared/types';

@Injectable()
export class AllergyService {
  private readonly logger = new Logger(AllergyService.name);

  constructor(
    @InjectModel(Allergy)
    private readonly allergyModel: typeof Allergy,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
  ) {}

  async addAllergy(allergyData: CreateAllergyDto): Promise<Allergy> {
    this.logger.log(`Adding allergy for student ${allergyData.studentId}`);

    // Verify student exists
    const student = await this.studentModel.findByPk(allergyData.studentId);
    if (!student) {
      throw new BadRequestException(
        `Student with ID ${allergyData.studentId} not found`,
      );
    }

    const allergy = await this.allergyModel.create({
      ...allergyData,
      active: true,
      verified: false,
    } as any);

    this.logger.log(
      `PHI Created: Allergy record created for student ${allergyData.studentId}`,
    );
    return allergy;
  }

  async findOne(id: string, user: AuthenticatedUser): Promise<Allergy> {
    this.logger.log(`Finding allergy ${id} for user ${user.id}`);
    const allergy = await this.allergyModel.findByPk(id, {
      include: [
        {
          model: Student,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    if (!allergy) {
      throw new NotFoundException(`Allergy with ID ${id} not found`);
    }

    return allergy;
  }

  async findByStudent(
    studentId: string,
    user: AuthenticatedUser,
  ): Promise<Allergy[]> {
    this.logger.log(
      `Finding allergies for student ${studentId} by user ${user.id}`,
    );

    // Verify student exists
    const student = await this.studentModel.findByPk(studentId);
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return await this.allergyModel.findAll({
      where: {
        studentId,
        active: true,
      },
      order: [
        ['severity', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });
  }

  async create(
    createDto: CreateAllergyDto,
    user: AuthenticatedUser,
  ): Promise<Allergy> {
    this.logger.log(
      `Creating allergy for student ${createDto.studentId} by user ${user.id}`,
    );

    // Verify student exists
    const student = await this.studentModel.findByPk(createDto.studentId);
    if (!student) {
      throw new BadRequestException(
        `Student with ID ${createDto.studentId} not found`,
      );
    }

    const allergy = await this.allergyModel.create({
      ...createDto,
      createdBy: user.id,
      active: true,
      verified: false,
    } as any);

    this.logger.log(
      `PHI Created: Allergy record created for student ${createDto.studentId}`,
    );
    return allergy;
  }

  async update(
    id: string,
    updateDto: UpdateAllergyDto,
    user: AuthenticatedUser,
  ): Promise<Allergy> {
    const allergy = await this.allergyModel.findByPk(id);
    if (!allergy) {
      throw new NotFoundException(`Allergy with ID ${id} not found`);
    }

    await allergy.update({
      ...updateDto,
      updatedBy: user.id,
    } as any);

    this.logger.log(`PHI Updated: Allergy ${id} updated by user ${user.id}`);
    return allergy;
  }

  async remove(id: string, user: AuthenticatedUser): Promise<void> {
    const allergy = await this.allergyModel.findByPk(id);
    if (!allergy) {
      throw new NotFoundException(`Allergy with ID ${id} not found`);
    }

    // Soft delete by setting active to false
    await allergy.update({
      active: false,
      updatedBy: user.id,
    });

    this.logger.log(
      `PHI Deleted: Allergy ${id} deactivated by user ${user.id}`,
    );
  }

  async getAllergies(studentId: string): Promise<Allergy[]> {
    this.logger.log(`Getting all allergies for student ${studentId}`);
    return await this.allergyModel.findAll({
      where: {
        studentId,
        active: true,
      },
      order: [
        ['severity', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });
  }

  async checkMedicationInteractions(
    studentId: string,
    medication: string,
  ): Promise<any> {
    this.logger.log(
      `Checking medication interactions for student ${studentId} with ${medication}`,
    );

    const allergies = await this.allergyModel.findAll({
      where: {
        studentId,
        active: true,
        allergyType: AllergyType.MEDICATION,
      },
    });

    const interactions = allergies.filter(
      (allergy) =>
        allergy.allergen.toLowerCase().includes(medication.toLowerCase()) ||
        medication.toLowerCase().includes(allergy.allergen.toLowerCase()),
    );

    return {
      hasInteractions: interactions.length > 0,
      interactions: interactions.map((a) => ({
        allergen: a.allergen,
        severity: a.severity,
        reaction: a.symptoms,
      })),
    };
  }

  /**
   * Find critical allergies for emergency alerts
   */
  async findCritical(): Promise<Allergy[]> {
    this.logger.log('Finding critical allergies');
    return await this.allergyModel.findAll({
      where: {
        active: true,
        severity: {
          [Op.in]: [AllergySeverity.SEVERE, AllergySeverity.LIFE_THREATENING],
        },
      },
      include: [
        {
          model: Student,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['severity', 'DESC']],
    });
  }

  /**
   * Verify allergy by healthcare provider
   */
  async verify(id: string, verifiedBy: string): Promise<Allergy> {
    this.logger.log(`Verifying allergy ${id} by ${verifiedBy}`);
    const allergy = await this.allergyModel.findByPk(id);
    if (!allergy) {
      throw new NotFoundException(`Allergy with ID ${id} not found`);
    }

    await allergy.update({
      verified: true,
      verifiedBy,
      verificationDate: new Date(),
    });

    return allergy;
  }

  /**
   * Create multiple allergies (bulk operation)
   */
  async createMany(
    allergies: CreateAllergyDto[],
    user: AuthenticatedUser,
  ): Promise<Allergy[]> {
    this.logger.log(
      `Creating ${allergies.length} allergies in bulk by user ${user.id}`,
    );

    const allergyData = allergies.map((allergy) => ({
      ...allergy,
      createdBy: user.id,
      active: true,
      verified: false,
    }));

    const created = await this.allergyModel.bulkCreate(allergyData as any);
    this.logger.log(
      `PHI Created: ${created.length} allergy records created in bulk`,
    );
    return created;
  }

  /**
   * Search allergies with filters
   */
  async search(
    query: string,
    filters: AllergyFilterDto = {},
  ): Promise<Allergy[]> {
    this.logger.log(`Searching allergies with query: ${query}`);

    const whereClause: any = { active: true };

    // Text search
    if (query) {
      whereClause[Op.or] = [
        { allergen: { [Op.iLike]: `%${query}%` } },
        { symptoms: { [Op.iLike]: `%${query}%` } },
        { notes: { [Op.iLike]: `%${query}%` } },
      ];
    }

    // Apply filters
    if (filters.severity) {
      whereClause.severity = filters.severity;
    }
    if (filters.allergyType) {
      whereClause.allergyType = filters.allergyType;
    }
    if (filters.studentId) {
      whereClause.studentId = filters.studentId;
    }

    return await this.allergyModel.findAll({
      where: whereClause,
      include: [
        {
          model: Student,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [
        ['severity', 'DESC'],
        ['createdAt', 'DESC'],
      ],
    });
  }
}
