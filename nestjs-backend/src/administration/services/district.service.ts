import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { District } from '../entities/district.entity';
import { School } from '../entities/school.entity';
import { License } from '../entities/license.entity';
import { AuditService } from './audit.service';
import { CreateDistrictDto, UpdateDistrictDto, DistrictQueryDto } from '../dto/district.dto';
import { AuditAction, LicenseStatus } from '../enums/administration.enums';
import { PaginatedResponse, PaginationResult } from '../interfaces/administration.interfaces';

@Injectable()
export class DistrictService {
  private readonly logger = new Logger(DistrictService.name);

  constructor(
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
    @InjectRepository(License)
    private licenseRepository: Repository<License>,
    private auditService: AuditService,
    private dataSource: DataSource,
  ) {}

  async createDistrict(data: CreateDistrictDto): Promise<District> {
    try {
      const normalizedCode = data.code.toUpperCase().trim();
      const existing = await this.districtRepository.findOne({ 
        where: { code: normalizedCode } 
      });

      if (existing) {
        throw new BadRequestException(`District with code '${normalizedCode}' already exists`);
      }

      const district = this.districtRepository.create({ ...data, code: normalizedCode });
      const saved = await this.districtRepository.save(district);

      await this.auditService.createAuditLog(
        AuditAction.CREATE,
        'District',
        saved.id,
        undefined,
        { name: saved.name, code: saved.code },
      );

      this.logger.log(`District created: ${saved.name} (${saved.code})`);
      return saved;
    } catch (error) {
      this.logger.error('Error creating district:', error);
      throw error;
    }
  }

  async getDistricts(queryDto: DistrictQueryDto): Promise<PaginatedResponse<District>> {
    try {
      const { page = 1, limit = 20 } = queryDto;
      const offset = (page - 1) * limit;

      const [districts, total] = await this.districtRepository.findAndCount({
        skip: offset,
        take: limit,
        relations: ['schools'],
        order: { name: 'ASC' },
      });

      const pagination: PaginationResult = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };

      return { data: districts, pagination };
    } catch (error) {
      this.logger.error('Error fetching districts:', error);
      throw error;
    }
  }

  async getDistrictById(id: string): Promise<District> {
    try {
      const district = await this.districtRepository.findOne({
        where: { id },
        relations: ['schools', 'licenses'],
      });

      if (!district) {
        throw new NotFoundException('District not found');
      }

      return district;
    } catch (error) {
      this.logger.error('Error fetching district:', error);
      throw error;
    }
  }

  async updateDistrict(id: string, data: UpdateDistrictDto): Promise<District> {
    try {
      const district = await this.getDistrictById(id);
      Object.assign(district, data);
      const updated = await this.districtRepository.save(district);

      await this.auditService.createAuditLog(
        AuditAction.UPDATE,
        'District',
        id,
        undefined,
        data,
      );

      this.logger.log(`District updated: ${district.name} (${id})`);
      return updated;
    } catch (error) {
      this.logger.error('Error updating district:', error);
      throw error;
    }
  }

  async deleteDistrict(id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const district = await queryRunner.manager.findOne(District, { where: { id } });
      if (!district) {
        throw new NotFoundException('District not found');
      }

      const activeSchools = await queryRunner.manager.count(School, {
        where: { districtId: id, isActive: true },
      });

      if (activeSchools > 0) {
        throw new BadRequestException(
          `Cannot delete district with ${activeSchools} active school(s)`,
        );
      }

      const activeLicenses = await queryRunner.manager.count(License, {
        where: { districtId: id, status: LicenseStatus.ACTIVE },
      });

      if (activeLicenses > 0) {
        throw new BadRequestException(
          `Cannot delete district with ${activeLicenses} active license(s)`,
        );
      }

      district.isActive = false;
      await queryRunner.manager.save(district);

      await this.auditService.createAuditLog(
        AuditAction.DELETE,
        'District',
        id,
        undefined,
        { deactivated: true },
      );

      await queryRunner.commitTransaction();
      this.logger.log(`District deactivated: ${id}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error deleting district:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
