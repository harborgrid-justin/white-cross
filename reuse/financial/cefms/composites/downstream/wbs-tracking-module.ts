/**
 * LOC: CEFMS-WBS-TRACK-DS-004
 * File: /reuse/financial/cefms/composites/downstream/wbs-tracking-module.ts
 * 
 * Complete Work Breakdown Structure (WBS) tracking module for USACE CEFMS
 * with comprehensive cost code management, deliverable tracking, and hierarchical
 * project structure management.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import Decimal from 'decimal.js';

// WBS Element
export interface WBSElement {
  wbsId: string;
  projectId: string;
  parentWbsId?: string;
  wbsCode: string;
  wbsName: string;
  level: number;
  costCode: string;
  description: string;
  budgetedCost: number;
  actualCost: number;
  forecastCost: number;
  percentComplete: number;
  startDate: Date;
  endDate: Date;
  responsiblePerson: string;
  deliverables: string[];
  status: 'not_started' | 'in_progress' | 'complete';
  metadata: Record<string, any>;
}

export const createWBSElementModel = (sequelize: Sequelize) => {
  class WBSElement extends Model {
    public id!: string;
    public wbsId!: string;
    public projectId!: string;
    public parentWbsId!: string | null;
    public wbsCode!: string;
    public wbsName!: string;
    public level!: number;
    public costCode!: string;
    public description!: string;
    public budgetedCost!: number;
    public actualCost!: number;
    public forecastCost!: number;
    public percentComplete!: number;
    public startDate!: Date;
    public endDate!: Date;
    public responsiblePerson!: string;
    public deliverables!: string[];
    public status!: string;
    public metadata!: Record<string, any>;
  }

  WBSElement.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      wbsId: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      projectId: { type: DataTypes.STRING(50), allowNull: false },
      parentWbsId: { type: DataTypes.STRING(50), allowNull: true },
      wbsCode: { type: DataTypes.STRING(50), allowNull: false },
      wbsName: { type: DataTypes.STRING(200), allowNull: false },
      level: { type: DataTypes.INTEGER, allowNull: false },
      costCode: { type: DataTypes.STRING(50), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      budgetedCost: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      actualCost: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      forecastCost: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      percentComplete: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 0 },
      startDate: { type: DataTypes.DATE, allowNull: false },
      endDate: { type: DataTypes.DATE, allowNull: false },
      responsiblePerson: { type: DataTypes.STRING(100), allowNull: false },
      deliverables: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
      status: { type: DataTypes.ENUM('not_started', 'in_progress', 'complete'), allowNull: false, defaultValue: 'not_started' },
      metadata: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
    },
    {
      sequelize,
      tableName: 'cefms_wbs_elements',
      timestamps: true,
      indexes: [
        { fields: ['wbsId'], unique: true },
        { fields: ['projectId'] },
        { fields: ['parentWbsId'] },
        { fields: ['wbsCode'] },
        { fields: ['level'] },
      ],
    },
  );

  return WBSElement;
};

export const createWBSElement = async (
  wbsData: WBSElement,
  WBSModel: any,
  transaction?: Transaction,
): Promise<any> => {
  return WBSModel.create(wbsData, { transaction });
};

export const getWBSHierarchy = async (
  projectId: string,
  WBSModel: any,
): Promise<any> => {
  const elements = await WBSModel.findAll({
    where: { projectId },
    order: [['level', 'ASC'], ['wbsCode', 'ASC']],
  });

  return buildHierarchy(elements);
};

const buildHierarchy = (elements: any[]): any[] => {
  const map = new Map();
  const roots: any[] = [];

  elements.forEach((el: any) => {
    map.set(el.wbsId, { ...el.toJSON(), children: [] });
  });

  elements.forEach((el: any) => {
    const node = map.get(el.wbsId);
    if (el.parentWbsId) {
      const parent = map.get(el.parentWbsId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
};

export const updateWBSProgress = async (
  wbsId: string,
  percentComplete: number,
  actualCost: number,
  WBSModel: any,
  transaction?: Transaction,
): Promise<any> => {
  const wbs = await WBSModel.findOne({ where: { wbsId } });
  if (!wbs) throw new NotFoundException(`WBS ${wbsId} not found`);

  wbs.percentComplete = percentComplete;
  wbs.actualCost = actualCost;

  if (percentComplete >= 100) {
    wbs.status = 'complete';
  } else if (percentComplete > 0) {
    wbs.status = 'in_progress';
  }

  await wbs.save({ transaction });
  return wbs;
};

export const calculateWBSRollup = async (
  projectId: string,
  WBSModel: any,
): Promise<any> => {
  const elements = await WBSModel.findAll({ where: { projectId } });

  let totalBudget = 0;
  let totalActual = 0;
  let totalForecast = 0;

  elements.forEach((el: any) => {
    totalBudget += parseFloat(el.budgetedCost);
    totalActual += parseFloat(el.actualCost);
    totalForecast += parseFloat(el.forecastCost);
  });

  return {
    projectId,
    totalBudget,
    totalActual,
    totalForecast,
    costVariance: totalBudget - totalActual,
    forecastVariance: totalForecast - totalBudget,
  };
};

export const generateWBSDictionary = async (
  projectId: string,
  WBSModel: any,
): Promise<any> => {
  const elements = await WBSModel.findAll({
    where: { projectId },
    order: [['wbsCode', 'ASC']],
  });

  return {
    projectId,
    totalElements: elements.length,
    dictionary: elements.map((el: any) => ({
      wbsCode: el.wbsCode,
      wbsName: el.wbsName,
      costCode: el.costCode,
      description: el.description,
      budgetedCost: parseFloat(el.budgetedCost),
      deliverables: el.deliverables,
    })),
  };
};

@Injectable()
export class WBSTrackingModuleService {
  private readonly logger = new Logger(WBSTrackingModuleService.name);

  constructor(private readonly sequelize: Sequelize) {}

  async createWBS(wbsData: WBSElement) {
    const WBSModel = createWBSElementModel(this.sequelize);
    return this.sequelize.transaction(async (transaction) => {
      return createWBSElement(wbsData, WBSModel, transaction);
    });
  }

  async getHierarchy(projectId: string) {
    const WBSModel = createWBSElementModel(this.sequelize);
    return getWBSHierarchy(projectId, WBSModel);
  }

  async updateProgress(wbsId: string, percentComplete: number, actualCost: number) {
    const WBSModel = createWBSElementModel(this.sequelize);
    return this.sequelize.transaction(async (transaction) => {
      return updateWBSProgress(wbsId, percentComplete, actualCost, WBSModel, transaction);
    });
  }
}

export default {
  createWBSElementModel,
  createWBSElement,
  getWBSHierarchy,
  updateWBSProgress,
  calculateWBSRollup,
  generateWBSDictionary,
  WBSTrackingModuleService,
};
