import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WitnessStatement } from '../entities/witness-statement.entity';
import { IncidentReport } from '../entities/incident-report.entity';
import { CreateWitnessStatementDto } from '../dto/create-witness-statement.dto';
import { IncidentValidationService } from './incident-validation.service';

@Injectable()
export class IncidentWitnessService {
  private readonly logger = new Logger(IncidentWitnessService.name);

  constructor(
    @InjectRepository(WitnessStatement)
    private witnessStatementRepository: Repository<WitnessStatement>,
    @InjectRepository(IncidentReport)
    private incidentReportRepository: Repository<IncidentReport>,
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
      const report = await this.incidentReportRepository.findOne({
        where: { id: incidentReportId },
      });

      if (!report) {
        throw new NotFoundException('Incident report not found');
      }

      // Validate witness statement data
      this.validationService.validateWitnessStatementData(dto);

      const witnessStatement = this.witnessStatementRepository.create({
        incidentReportId,
        ...dto,
        verified: false,
      });

      const savedStatement = await this.witnessStatementRepository.save(witnessStatement);

      this.logger.log(`Witness statement added to incident ${incidentReportId}`);
      return savedStatement;
    } catch (error) {
      this.logger.error('Error adding witness statement:', error);
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
      const statement = await this.witnessStatementRepository.findOne({
        where: { id: statementId },
      });

      if (!statement) {
        throw new NotFoundException('Witness statement not found');
      }

      statement.verified = true;
      statement.verifiedBy = verifiedBy;
      statement.verifiedAt = new Date();

      const updatedStatement = await this.witnessStatementRepository.save(statement);

      this.logger.log(`Witness statement ${statementId} verified by ${verifiedBy}`);
      return updatedStatement;
    } catch (error) {
      this.logger.error('Error verifying witness statement:', error);
      throw error;
    }
  }

  /**
   * Get witness statements for an incident
   */
  async getWitnessStatements(incidentReportId: string): Promise<WitnessStatement[]> {
    try {
      const statements = await this.witnessStatementRepository.find({
        where: { incidentReportId },
        order: { createdAt: 'ASC' },
      });

      return statements;
    } catch (error) {
      this.logger.error('Error fetching witness statements:', error);
      throw error;
    }
  }

  /**
   * Update witness statement
   */
  async updateWitnessStatement(
    statementId: string,
    data: Partial<CreateWitnessStatementDto>,
  ): Promise<WitnessStatement> {
    try {
      const statement = await this.witnessStatementRepository.findOne({
        where: { id: statementId },
      });

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

      const updatedStatement = await this.witnessStatementRepository.save(statement);

      this.logger.log(`Witness statement ${statementId} updated`);
      return updatedStatement;
    } catch (error) {
      this.logger.error('Error updating witness statement:', error);
      throw error;
    }
  }

  /**
   * Delete witness statement
   */
  async deleteWitnessStatement(statementId: string): Promise<boolean> {
    try {
      const statement = await this.witnessStatementRepository.findOne({
        where: { id: statementId },
      });

      if (!statement) {
        throw new NotFoundException('Witness statement not found');
      }

      await this.witnessStatementRepository.remove(statement);

      this.logger.log(`Witness statement ${statementId} deleted`);
      return true;
    } catch (error) {
      this.logger.error('Error deleting witness statement:', error);
      throw error;
    }
  }

  /**
   * Get unverified witness statements
   */
  async getUnverifiedStatements(): Promise<WitnessStatement[]> {
    try {
      const statements = await this.witnessStatementRepository.find({
        where: { verified: false },
        order: { createdAt: 'ASC' },
      });

      return statements;
    } catch (error) {
      this.logger.error('Error fetching unverified witness statements:', error);
      throw error;
    }
  }
}
