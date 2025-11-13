/**
 * Cache Warming Service
 * Proactively loads frequently accessed health data into cache
 * HIPAA Compliance: Only warms cache for authorized data access patterns
 */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Op } from 'sequelize';
import { HealthDataCacheService } from './health-data-cache.service';
import { Student   } from '@/database/models';
import { Vaccination   } from '@/database/models';
import { Allergy   } from '@/database/models';
import { ChronicCondition   } from '@/database/models';

import { BaseService } from '@/common/base';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '@/common/base';
import { LoggerService } from '@/common/logging/logger.service';
import { Inject } from '@nestjs/common';
@Injectable()
export class CacheWarmingService implements OnModuleInit {
  private isWarming = false;

  constructor(
    private readonly cacheService: HealthDataCacheService,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectModel(Vaccination)
    private readonly vaccinationModel: typeof Vaccination,
    @InjectModel(Allergy)
    private readonly allergyModel: typeof Allergy,
    @InjectModel(ChronicCondition)
    private readonly chronicConditionModel: typeof ChronicCondition,
  ) {}

  async onModuleInit() {
    // Enable cache warming based on environment variable
    const warmingEnabled = process.env.CACHE_WARMING_ENABLED === 'true';

    if (warmingEnabled) {
      this.logInfo('Cache warming enabled - initial warm starting');
      // Warm cache on startup (after a short delay)
      setTimeout(() => this.warmCriticalData(), 5000);
    } else {
      this.logInfo('Cache warming disabled');
    }
  }

  /**
   * Warm cache with critical data every hour
   */
  @Cron(CronExpression.EVERY_HOUR)
  async scheduledCacheWarming() {
    const warmingEnabled = process.env.CACHE_WARMING_ENABLED === 'true';

    if (!warmingEnabled || this.isWarming) {
      return;
    }

    await this.warmCriticalData();
  }

  /**
   * Warm cache with critical health data
   */
  async warmCriticalData(): Promise<void> {
    if (this.isWarming) {
      this.logWarning('Cache warming already in progress, skipping');
      return;
    }

    this.isWarming = true;
    const startTime = Date.now();

    try {
      this.logInfo('Starting cache warming for critical health data');

      // Warm cache in parallel for efficiency
      const [
        activeStudentsWarmed,
        allergiesWarmed,
        chronicConditionsWarmed,
        vaccinationsWarmed,
      ] = await Promise.all([
        this.warmActiveStudents(),
        this.warmCriticalAllergies(),
        this.warmActiveChronicConditions(),
        this.warmRecentVaccinations(),
      ]);

      const duration = Date.now() - startTime;
      this.logInfo(
        `Cache warming completed in ${duration}ms: ` +
          `${activeStudentsWarmed} students, ` +
          `${allergiesWarmed} allergies, ` +
          `${chronicConditionsWarmed} conditions, ` +
          `${vaccinationsWarmed} vaccinations`,
      );
    } catch (error) {
      this.logError('Error during cache warming:', error);
    } finally {
      this.isWarming = false;
    }
  }

  /**
   * Warm cache for active students with health records
   */
  private async warmActiveStudents(): Promise<number> {
    try {
      // Get active students with recent health activity
      const students = await this.studentModel.findAll({
        where: {
          isActive: true,
        },
        attributes: ['id'],
        limit: 500, // Limit to most recent/active students
        order: [['updatedAt', 'DESC']],
      });

      let warmedCount = 0;

      // Warm cache for each student in batches
      const batchSize = 50;
      for (let i = 0; i < students.length; i += batchSize) {
        const batch = students.slice(i, i + batchSize);

        await Promise.all(
          batch.map(async (student) => {
            try {
              await this.warmStudentHealthData(student.id);
              warmedCount++;
            } catch (error) {
              this.logError(
                `Error warming cache for student ${student.id}:`,
                error,
              );
            }
          }),
        );
      }

      return warmedCount;
    } catch (error) {
      this.logError('Error warming active students cache:', error);
      return 0;
    }
  }

  /**
   * Warm cache for student health data
   */
  async warmStudentHealthData(studentId: string): Promise<void> {
    try {
      // Load all health data in parallel
      const [vaccinations, allergies, chronicConditions] = await Promise.all([
        this.vaccinationModel.findAll({
          where: { studentId },
          order: [['administrationDate', 'DESC']],
          limit: 50,
        }),
        this.allergyModel.findAll({
          where: { studentId, active: true },
          order: [['diagnosedDate', 'DESC']],
        }),
        this.chronicConditionModel.findAll({
          where: { studentId, status: 'ACTIVE' },
          order: [['diagnosedDate', 'DESC']],
        }),
      ]);

      // Cache the data
      await Promise.all([
        this.cacheService.cacheVaccinations(studentId, vaccinations),
        this.cacheService.cacheAllergies(studentId, allergies),
        this.cacheService.cacheChronicConditions(studentId, chronicConditions),
      ]);

      // Cache health summary
      const healthSummary = {
        studentId,
        vaccinationCount: vaccinations.length,
        allergyCount: allergies.length,
        chronicConditionCount: chronicConditions.length,
        hasLifeThreateningAllergy: allergies.some(
          (a) => a.severity === 'LIFE_THREATENING',
        ),
        latestVaccination: vaccinations[0]?.administrationDate,
        updatedAt: new Date(),
      };

      await this.cacheService.cacheStudentHealthSummary(
        studentId,
        healthSummary,
      );
    } catch (error) {
      this.logError(
        `Error warming health data for student ${studentId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Warm cache for critical allergies (SEVERE and LIFE_THREATENING)
   */
  private async warmCriticalAllergies(): Promise<number> {
    try {
      const criticalAllergies = await this.allergyModel.findAll({
        where: {
          active: true,
          severity: {
            [Op.in]: ['SEVERE', 'LIFE_THREATENING'],
          },
        },
        include: [
          {
            model: Student,
            as: 'student',
            where: { isActive: true },
            attributes: ['id'],
            required: true,
          },
        ],
        attributes: ['studentId', 'allergen', 'severity'],
      });

      // Group by student and cache
      const allergyMap = new Map<string, any[]>();
      criticalAllergies.forEach((allergy) => {
        const studentId = allergy.studentId;
        if (!allergyMap.has(studentId)) {
          allergyMap.set(studentId, []);
        }
        allergyMap.get(studentId)?.push(allergy);
      });

      // Cache critical allergies for each student
      await Promise.all(
        Array.from(allergyMap.entries()).map(([studentId, allergies]) =>
          this.cacheService.cacheAllergies(studentId, allergies),
        ),
      );

      return allergyMap.size;
    } catch (error) {
      this.logError('Error warming critical allergies cache:', error);
      return 0;
    }
  }

  /**
   * Warm cache for active chronic conditions
   */
  private async warmActiveChronicConditions(): Promise<number> {
    try {
      const activeConditions = await this.chronicConditionModel.findAll({
        where: {
          status: 'ACTIVE',
          isActive: true,
        },
        include: [
          {
            model: Student,
            as: 'student',
            where: { isActive: true },
            attributes: ['id'],
            required: true,
          },
        ],
        attributes: ['studentId', 'condition', 'severity', 'carePlan'],
      });

      // Group by student and cache
      const conditionMap = new Map<string, any[]>();
      activeConditions.forEach((condition) => {
        const studentId = condition.studentId;
        if (!conditionMap.has(studentId)) {
          conditionMap.set(studentId, []);
        }
        conditionMap.get(studentId)?.push(condition);
      });

      // Cache conditions for each student
      await Promise.all(
        Array.from(conditionMap.entries()).map(([studentId, conditions]) =>
          this.cacheService.cacheChronicConditions(studentId, conditions),
        ),
      );

      return conditionMap.size;
    } catch (error) {
      this.logError('Error warming chronic conditions cache:', error);
      return 0;
    }
  }

  /**
   * Warm cache for recent vaccinations (last 6 months)
   */
  private async warmRecentVaccinations(): Promise<number> {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const recentVaccinations = await this.vaccinationModel.findAll({
        where: {
          administrationDate: {
            [Op.gte]: sixMonthsAgo,
          },
        },
        include: [
          {
            model: Student,
            as: 'student',
            where: { isActive: true },
            attributes: ['id'],
            required: true,
          },
        ],
        order: [['administrationDate', 'DESC']],
      });

      // Group by student and cache
      const vaccinationMap = new Map<string, any[]>();
      recentVaccinations.forEach((vaccination) => {
        const studentId = vaccination.studentId;
        if (!vaccinationMap.has(studentId)) {
          vaccinationMap.set(studentId, []);
        }
        vaccinationMap.get(studentId)?.push(vaccination);
      });

      // Cache vaccinations for each student
      await Promise.all(
        Array.from(vaccinationMap.entries()).map(([studentId, vaccinations]) =>
          this.cacheService.cacheVaccinations(studentId, vaccinations),
        ),
      );

      return vaccinationMap.size;
    } catch (error) {
      this.logError('Error warming vaccinations cache:', error);
      return 0;
    }
  }

  /**
   * Warm cache for specific student on-demand
   */
  async warmStudent(studentId: string): Promise<boolean> {
    try {
      await this.warmStudentHealthData(studentId);
      this.logInfo(`Cache warmed for student ${studentId}`);
      return true;
    } catch (error) {
      this.logError(
        `Failed to warm cache for student ${studentId}:`,
        error,
      );
      return false;
    }
  }

  /**
   * Get warming status
   */
  getWarmingStatus(): { isWarming: boolean; enabled: boolean } {
    return {
      isWarming: this.isWarming,
      enabled: process.env.CACHE_WARMING_ENABLED === 'true',
    };
  }
}
