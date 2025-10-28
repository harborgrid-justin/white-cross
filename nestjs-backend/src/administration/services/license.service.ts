import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { License } from '../entities/license.entity';
import { District } from '../entities/district.entity';
import { AuditService } from './audit.service';
import { CreateLicenseDto, UpdateLicenseDto, LicenseQueryDto } from '../dto/license.dto';
import { AuditAction, LicenseType, LicenseStatus } from '../enums/administration.enums';
import { PaginatedResponse, PaginationResult } from '../interfaces/administration.interfaces';

@Injectable()
export class LicenseService {
  private readonly logger = new Logger(LicenseService.name);

  constructor(
    @InjectRepository(License)
    private licenseRepository: Repository<License>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    private auditService: AuditService,
  ) {}

  async createLicense(data: CreateLicenseDto): Promise<License> {
    try {
      if (data.districtId) {
        const district = await this.districtRepository.findOne({ 
          where: { id: data.districtId } 
        });
        if (!district || !district.isActive) {
          throw new BadRequestException('District not found or inactive');
        }
      }

      const normalizedKey = data.licenseKey.toUpperCase().trim();
      const existing = await this.licenseRepository.findOne({ 
        where: { licenseKey: normalizedKey } 
      });

      if (existing) {
        throw new BadRequestException('License key already exists');
      }

      this.validateLicenseType(data);

      const license = this.licenseRepository.create({
        ...data,
        licenseKey: normalizedKey,
        status: LicenseStatus.ACTIVE,
        issuedAt: new Date(),
        activatedAt: new Date(),
      });

      const saved = await this.licenseRepository.save(license);

      await this.auditService.createAuditLog(
        AuditAction.CREATE,
        'License',
        saved.id,
        undefined,
        { licenseKey: saved.licenseKey, type: saved.type },
      );

      this.logger.log('License created');
      return saved;
    } catch (error) {
      this.logger.error('Error creating license:', error);
      throw error;
    }
  }

  private validateLicenseType(data: CreateLicenseDto): void {
    if (data.type === LicenseType.TRIAL) {
      if (!data.maxUsers || data.maxUsers > 10) {
        throw new BadRequestException('Trial license cannot have more than 10 users');
      }
      if (!data.maxSchools || data.maxSchools > 2) {
        throw new BadRequestException('Trial license cannot have more than 2 schools');
      }
      if (!data.expiresAt) {
        throw new BadRequestException('Trial license must have an expiration date');
      }
    }
  }

  async getLicenses(queryDto: LicenseQueryDto): Promise<PaginatedResponse<License>> {
    try {
      const { page = 1, limit = 20, status } = queryDto;
      const offset = (page - 1) * limit;

      const whereClause: any = {};
      if (status) {
        whereClause.status = status;
      }

      const [licenses, total] = await this.licenseRepository.findAndCount({
        where: whereClause,
        skip: offset,
        take: limit,
        relations: ['district'],
        order: { createdAt: 'DESC' },
      });

      const pagination: PaginationResult = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };

      return { data: licenses, pagination };
    } catch (error) {
      this.logger.error('Error fetching licenses:', error);
      throw error;
    }
  }

  async getLicenseById(id: string): Promise<License> {
    try {
      const license = await this.licenseRepository.findOne({
        where: { id },
        relations: ['district'],
      });

      if (!license) {
        throw new NotFoundException('License not found');
      }

      return license;
    } catch (error) {
      this.logger.error('Error fetching license:', error);
      throw error;
    }
  }

  async updateLicense(id: string, data: UpdateLicenseDto): Promise<License> {
    try {
      const license = await this.getLicenseById(id);
      Object.assign(license, data);
      const updated = await this.licenseRepository.save(license);

      await this.auditService.createAuditLog(
        AuditAction.UPDATE,
        'License',
        id,
        undefined,
        data,
      );

      this.logger.log('License updated');
      return updated;
    } catch (error) {
      this.logger.error('Error updating license:', error);
      throw error;
    }
  }

  async deactivateLicense(id: string): Promise<License> {
    try {
      const license = await this.getLicenseById(id);
      license.status = LicenseStatus.SUSPENDED;
      license.deactivatedAt = new Date();
      const updated = await this.licenseRepository.save(license);

      await this.auditService.createAuditLog(
        AuditAction.UPDATE,
        'License',
        id,
        undefined,
        { status: LicenseStatus.SUSPENDED },
      );

      this.logger.log('License deactivated');
      return updated;
    } catch (error) {
      this.logger.error('Error deactivating license:', error);
      throw error;
    }
  }
}
