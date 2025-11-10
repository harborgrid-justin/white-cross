/**
 * Portfolio Risk Management Systems
 * Bloomberg Terminal-Level Credit Risk and Portfolio Risk Management
 */

import React from 'react';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Injectable
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import {
  CreditRating,
  CreditExposure,
  calculateProbabilityOfDefault,
  calculateLossGivenDefault,
  calculateExpectedLoss,
  performCreditVaR,
  analyzeCreditMigration,
  calculateCreditSpread,
  performStressTesting,
  analyzeCounterpartyRisk,
  calculateCVA,
  calculateDVA,
  performCreditPortfolioAnalysis,
  optimizeCreditPortfolio,
  monitorCreditLimits,
  generateCreditRiskReport,
  analyzeConcentrationRisk,
  calculateEconomicCapital,
  performRegulatoryCapital,
  analyzeWrongWayRisk,
  calculatePFE,
  performCreditHedging,
  initializeCreditRiskModels
} from '../credit-risk-analysis-composite';

@Injectable()
export class PortfolioRiskManagementService {
  async analyzeCreditRisk(portfolioId: string) {
    const pd = await calculateProbabilityOfDefault(portfolioId);
    const lgd = await calculateLossGivenDefault(portfolioId);
    const expectedLoss = await calculateExpectedLoss(portfolioId);
    const creditVar = await performCreditVaR(portfolioId);
    
    return { probabilityOfDefault: pd, lossGivenDefault: lgd, expectedLoss, creditVar };
  }

  async manageCounterpartyRisk(portfolioId: string) {
    const counterparty = await analyzeCounterpartyRisk(portfolioId);
    const cva = await calculateCVA(portfolioId);
    const dva = await calculateDVA(portfolioId);
    const pfe = await calculatePFE(portfolioId);
    const wrongWay = await analyzeWrongWayRisk(portfolioId);
    
    return { counterparty, cva, dva, potentialFutureExposure: pfe, wrongWay };
  }

  async calculateCapitalRequirements(portfolioId: string) {
    const economic = await calculateEconomicCapital(portfolioId);
    const regulatory = await performRegulatoryCapital(portfolioId);
    const concentration = await analyzeConcentrationRisk(portfolioId);
    const limits = await monitorCreditLimits(portfolioId);
    
    return { economicCapital: economic, regulatoryCapital: regulatory, concentration, limits };
  }

  async performCreditAnalysis(portfolioId: string) {
    const migration = await analyzeCreditMigration(portfolioId);
    const spread = await calculateCreditSpread(portfolioId);
    const stressTest = await performStressTesting(portfolioId);
    const portfolio = await performCreditPortfolioAnalysis(portfolioId);
    const optimization = await optimizeCreditPortfolio(portfolioId);
    
    return { migration, spread, stressTest, portfolioAnalysis: portfolio, optimization };
  }
}

@ApiTags('portfolio-risk')
@Controller('portfolio-risk')
export class PortfolioRiskController {
  constructor(private readonly service: PortfolioRiskManagementService) {}

  @Get(':portfolioId/credit-risk')
  @ApiOperation({ summary: 'Analyze credit risk' })
  async analyzeCreditRisk(@Param('portfolioId') id: string) {
    return await this.service.analyzeCreditRisk(id);
  }

  @Get(':portfolioId/counterparty')
  @ApiOperation({ summary: 'Manage counterparty risk' })
  async manageCounterparty(@Param('portfolioId') id: string) {
    return await this.service.manageCounterpartyRisk(id);
  }

  @Get(':portfolioId/capital')
  @ApiOperation({ summary: 'Calculate capital requirements' })
  async calculateCapital(@Param('portfolioId') id: string) {
    return await this.service.calculateCapitalRequirements(id);
  }

  @Post(':portfolioId/credit-analysis')
  @ApiOperation({ summary: 'Perform credit analysis' })
  async performAnalysis(@Param('portfolioId') id: string) {
    return await this.service.performCreditAnalysis(id);
  }
}

export default {
  controllers: [PortfolioRiskController],
  providers: [PortfolioRiskManagementService]
};
