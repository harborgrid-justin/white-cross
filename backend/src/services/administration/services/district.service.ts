import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { RequestContextService } from '@/common/context/request-context.service';
import { BaseService } from '@/common/base';
import { District, School, License } from '@/database/models';
import { AuditService } from './audit.service';
import { CreateDistrictDto, DistrictQueryDto, UpdateDistrictDto } from '../dto/district.dto';
import { AuditAction, LicenseStatus } from '../enums/administration.enums';
import { PaginatedResponse, PaginationResult } from '../interfaces/administration.interfaces';

@Injectable()
export class DistrictService extends BaseService {
  constructor(
    protected readonly requestContext: RequestContextService,
    @InjectModel(District)
    private districtModel: typeof District,
    @InjectModel(School)
    private schoolModel: typeof School,
    @InjectModel(License)
    private licenseModel: typeof License,
    private auditService: AuditService,
    private sequelize: Sequelize,
  ) {
    super({
      serviceName: 'DistrictService',
      logger: new Logger(DistrictService.name),
      enableAuditLogging: true,
    });
  }

  async createDistrict(data: CreateDistrictDto): Promise<District> {
    try {
      const normalizedCode = data.code.toUpperCase().trim();
      const existing = await this.districtModel.findOne({
        where: { code: normalizedCode },
      });

      if (existing) {
        throw new BadRequestException(
          `District with code '${normalizedCode}' already exists`,
        );
      }

      const district = await this.districtModel.create({
        ...data,
        code: normalizedCode,
      } as any);

      await this.auditService.createAuditLog(
        AuditAction.CREATE,
        'District',
        district.id,
        undefined,
        { name: district.name, code: district.code },
      );

      this.logger.log(`District created: ${district.name} (${district.code})`);
      return district;
    } catch (error) {
      this.logger.error('Error creating district:', error);
      throw error;
    }
  }

  async getDistricts(
    queryDto: DistrictQueryDto,
  ): Promise<PaginatedResponse<District>> {
    try {
      const { page = 1, limit = 20 } = queryDto;
      const offset = (page - 1) * limit;

      const { rows: districts, count: total } =
        await this.districtModel.findAndCountAll({
          offset,
          limit,
          include: ['schools'],
          order: [['name', 'ASC']],
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
      const district = await this.districtModel.findByPk(id, {
        include: ['schools', 'licenses'],
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
      await district.save();

      await this.auditService.createAuditLog(
        AuditAction.UPDATE,
        'District',
        id,
        undefined,
        data,
      );

      this.logger.log(`District updated: ${district.name} (${id})`);
      return district;
    } catch (error) {
      this.logger.error('Error updating district:', error);
      throw error;
    }
  }

  async deleteDistrict(id: string): Promise<void> {
    const transaction = await this.sequelize.transaction();

    try {
      const district = await this.districtModel.findByPk(id);
      if (!district) {
        throw new NotFoundException('District not found');
      }

      const activeSchools = await this.schoolModel.count({
        where: { districtId: id, isActive: true },
        transaction,
      });

      if (activeSchools > 0) {
        throw new BadRequestException(
          `Cannot delete district with ${activeSchools} active school(s)`,
        );
      }

      const activeLicenses = await this.licenseModel.count({
        where: { districtId: id, status: LicenseStatus.ACTIVE },
        transaction,
      });

      if (activeLicenses > 0) {
        throw new BadRequestException(
          `Cannot delete district with ${activeLicenses} active license(s)`,
        );
      }

      district.isActive = false;
      await district.save({ transaction });

      await this.auditService.createAuditLog(
        AuditAction.DELETE,
        'District',
        id,
        undefined,
        { deactivated: true },
      );

      await transaction.commit();
      this.logger.log(`District deactivated: ${id}`);
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Error deleting district:', error);
      throw error;
    }
  }
}
