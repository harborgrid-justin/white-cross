import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from '../entities/school.entity';
import { District } from '../entities/district.entity';
import { AuditService } from './audit.service';
import { CreateSchoolDto, UpdateSchoolDto, SchoolQueryDto } from '../dto/school.dto';
import { AuditAction } from '../enums/administration.enums';
import { PaginatedResponse, PaginationResult } from '../interfaces/administration.interfaces';

@Injectable()
export class SchoolService {
  private readonly logger = new Logger(SchoolService.name);

  constructor(
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    private auditService: AuditService,
  ) {}

  async createSchool(data: CreateSchoolDto): Promise<School> {
    try {
      const district = await this.districtRepository.findOne({ 
        where: { id: data.districtId } 
      });

      if (!district) {
        throw new NotFoundException('District not found');
      }

      if (!district.isActive) {
        throw new BadRequestException('Cannot create school under an inactive district');
      }

      const normalizedCode = data.code.toUpperCase().trim();
      const existing = await this.schoolRepository.findOne({ 
        where: { code: normalizedCode } 
      });

      if (existing) {
        throw new BadRequestException(`School with code '${normalizedCode}' already exists`);
      }

      const school = this.schoolRepository.create({ ...data, code: normalizedCode });
      const saved = await this.schoolRepository.save(school);

      await this.auditService.createAuditLog(
        AuditAction.CREATE,
        'School',
        saved.id,
        undefined,
        { name: saved.name, code: saved.code, districtId: saved.districtId },
      );

      this.logger.log(`School created: ${saved.name} (${saved.code})`);
      return saved;
    } catch (error) {
      this.logger.error('Error creating school:', error);
      throw error;
    }
  }

  async getSchools(queryDto: SchoolQueryDto): Promise<PaginatedResponse<School>> {
    try {
      const { page = 1, limit = 20, districtId } = queryDto;
      const offset = (page - 1) * limit;

      const whereClause: any = {};
      if (districtId) {
        whereClause.districtId = districtId;
      }

      const [schools, total] = await this.schoolRepository.findAndCount({
        where: whereClause,
        skip: offset,
        take: limit,
        relations: ['district'],
        order: { name: 'ASC' },
      });

      const pagination: PaginationResult = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };

      return { data: schools, pagination };
    } catch (error) {
      this.logger.error('Error fetching schools:', error);
      throw error;
    }
  }

  async getSchoolById(id: string): Promise<School> {
    try {
      const school = await this.schoolRepository.findOne({
        where: { id },
        relations: ['district'],
      });

      if (!school) {
        throw new NotFoundException('School not found');
      }

      return school;
    } catch (error) {
      this.logger.error('Error fetching school:', error);
      throw error;
    }
  }

  async updateSchool(id: string, data: UpdateSchoolDto): Promise<School> {
    try {
      const school = await this.getSchoolById(id);
      Object.assign(school, data);
      const updated = await this.schoolRepository.save(school);

      await this.auditService.createAuditLog(
        AuditAction.UPDATE,
        'School',
        id,
        undefined,
        data,
      );

      this.logger.log(`School updated: ${id}`);
      return updated;
    } catch (error) {
      this.logger.error('Error updating school:', error);
      throw error;
    }
  }

  async deleteSchool(id: string): Promise<void> {
    try {
      const school = await this.getSchoolById(id);
      school.isActive = false;
      await this.schoolRepository.save(school);

      await this.auditService.createAuditLog(
        AuditAction.DELETE,
        'School',
        id,
        undefined,
        { deactivated: true },
      );

      this.logger.log(`School deactivated: ${id}`);
    } catch (error) {
      this.logger.error('Error deleting school:', error);
      throw error;
    }
  }
}
