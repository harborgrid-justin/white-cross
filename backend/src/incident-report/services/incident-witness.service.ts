import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IncidentReport, WitnessStatement } from '@/database';
import { CreateWitnessStatementDto } from '../dto/create-witness-statement.dto';
import { UpdateWitnessStatementDto } from '../dto/update-witness-statement.dto';
import { IncidentValidationService } from './incident-validation.service';

import { BaseService } from '@/common/base';
@Injectable()
export class IncidentWitnessService extends BaseService {
  constructor(
    @InjectModel(WitnessStatement)
    private witnessStatementModel: typeof WitnessStatement,
    @InjectModel(IncidentReport)
    private incidentReportModel: typeof IncidentReport,
    private validationService: IncidentValidationService,
  ) {}

  /**
   * Add witness statement to incident report with validation
   */
  async addWitnessStatement(
    incidentReportId: string,
    dto: CreateWitnessStatementDto,
  ): Promise<WitnessStatement> {
    try {
      const report = await this.incidentReportModel.findByPk(incidentReportId);

      if (!report) {
        throw new NotFoundException('Incident report not found');
      }

      // Validate witness statement data
      this.validationService.validateWitnessStatementData(dto);

      const savedStatement = await this.witnessStatementModel.create({
        incidentReportId,
        ...dto,
        verified: false,
      } as any);

      this.logInfo(
        `Witness statement added to incident ${incidentReportId}`,
      );
      return savedStatement;
    } catch (error) {
      this.logError('Error adding witness statement:', error);
      throw error;
    }
  }

  /**
   * Verify witness statement
   */
  async verifyWitnessStatement(
    statementId: string,
    verifiedBy: string,
  ): Promise<WitnessStatement> {
    try {
      const statement = await this.witnessStatementModel.findByPk(statementId);

      if (!statement) {
        throw new NotFoundException('Witness statement not found');
      }

      statement.verified = true;
      statement.verifiedBy = verifiedBy;
      statement.verifiedAt = new Date();

      const updatedStatement = await statement.save();

      this.logInfo(
        `Witness statement ${statementId} verified by ${verifiedBy}`,
      );
      return updatedStatement;
    } catch (error) {
      this.logError('Error verifying witness statement:', error);
      throw error;
    }
  }

  /**
   * Get witness statements for an incident
   */
  async getWitnessStatements(
    incidentReportId: string,
  ): Promise<WitnessStatement[]> {
    try {
      return await this.witnessStatementModel.findAll({
        where: { incidentReportId },
        order: [['createdAt', 'ASC']],
      });
    } catch (error) {
      this.logError('Error fetching witness statements:', error);
      throw error;
    }
  }

  /**
   * Update witness statement
   */
  async updateWitnessStatement(
    statementId: string,
    data: UpdateWitnessStatementDto,
  ): Promise<WitnessStatement> {
    try {
      const statement = await this.witnessStatementModel.findByPk(statementId);

      if (!statement) {
        throw new NotFoundException('Witness statement not found');
      }

      // Validate if statement is being updated
      if (data.statement) {
        this.validationService.validateWitnessStatementData({
          witnessName: data.witnessName || statement.witnessName,
          witnessType: data.witnessType || statement.witnessType,
          witnessContact: data.witnessContact || statement.witnessContact,
          statement: data.statement,
        });
      }

      Object.assign(statement, data);

      const updatedStatement = await statement.save();

      this.logInfo(`Witness statement ${statementId} updated`);
      return updatedStatement;
    } catch (error) {
      this.logError('Error updating witness statement:', error);
      throw error;
    }
  }

  /**
   * Delete witness statement
   */
  async deleteWitnessStatement(statementId: string): Promise<boolean> {
    try {
      const statement = await this.witnessStatementModel.findByPk(statementId);

      if (!statement) {
        throw new NotFoundException('Witness statement not found');
      }

      await statement.destroy();

      this.logInfo(`Witness statement ${statementId} deleted`);
      return true;
    } catch (error) {
      this.logError('Error deleting witness statement:', error);
      throw error;
    }
  }

  /**
   * Get unverified witness statements
   */
  async getUnverifiedStatements(): Promise<WitnessStatement[]> {
    try {
      return await this.witnessStatementModel.findAll({
        where: { verified: false },
        order: [['createdAt', 'ASC']],
      });
    } catch (error) {
      this.logError('Error fetching unverified witness statements:', error);
      throw error;
    }
  }
}
