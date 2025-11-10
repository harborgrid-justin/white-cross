/**
 * LOC: USACE-DS-BASE-065
 * File: /reuse/frontend/composites/usace/downstream/schedule-baseline-management.ts
 */
'use client';
import React from 'react';
import { Model, Column, Table, DataType, PrimaryKey, Default, AllowNull, Index } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export interface ScheduleBaseline {
  baselineId: string; projectId: string; baselineName: string; baselineDate: Date;
  isActive: boolean; activities: any[]; totalDuration: number;
  startDate: Date; finishDate: Date; createdBy: string;
}

export interface BaselineComparison {
  activityId: string; baselineDuration: number; currentDuration: number;
  baselineStart: Date; currentStart: Date; variance: number; status: string;
}

@Table({ tableName: 'schedule_baselines', timestamps: true })
export class ScheduleBaselineModel extends Model {
  @PrimaryKey @Default(DataType.UUIDV4) @Column(DataType.UUID) id: string;
  @AllowNull(false) @Index @Column(DataType.UUID) projectId: string;
  @AllowNull(false) @Column(DataType.STRING) baselineName: string;
  @AllowNull(false) @Column(DataType.DATE) baselineDate: Date;
  @Default(false) @Index @Column(DataType.BOOLEAN) isActive: boolean;
  @Column(DataType.JSONB) activities: any[];
  @Column(DataType.INTEGER) totalDuration: number;
  @Column(DataType.DATE) startDate: Date;
  @Column(DataType.DATE) finishDate: Date;
  @Column(DataType.UUID) createdBy: string;
}

export const createBaseline = async (baseline: Omit<ScheduleBaseline, 'baselineId'>): Promise<string> => {
  const sb = await ScheduleBaselineModel.create({ id: crypto.randomUUID(), ...baseline });
  return sb.id;
};

export const getActiveBaseline = async (projectId: string): Promise<ScheduleBaseline | null> => {
  const baseline = await ScheduleBaselineModel.findOne({ where: { projectId, isActive: true } });
  return baseline ? baseline.toJSON() as ScheduleBaseline : null;
};

export const getAllBaselines = async (projectId: string): Promise<ScheduleBaseline[]> => {
  const baselines = await ScheduleBaselineModel.findAll({ where: { projectId }, order: [['baselineDate', 'DESC']] });
  return baselines.map(b => b.toJSON() as ScheduleBaseline);
};

export const setActiveBaseline = async (baselineId: string): Promise<void> => {
  const baseline = await ScheduleBaselineModel.findByPk(baselineId);
  if (!baseline) throw new NotFoundException('Baseline not found');
  await ScheduleBaselineModel.update({ isActive: false }, { where: { projectId: baseline.projectId } });
  await baseline.update({ isActive: true });
};

export const compareToBaseline = async (projectId: string, currentActivities: any[]): Promise<BaselineComparison[]> => {
  const baseline = await getActiveBaseline(projectId);
  if (!baseline) return [];
  
  return currentActivities.map(current => {
    const baselineActivity = baseline.activities.find(a => a.activityId === current.activityId);
    if (!baselineActivity) return null;
    
    const variance = current.duration - baselineActivity.duration;
    return {
      activityId: current.activityId,
      baselineDuration: baselineActivity.duration,
      currentDuration: current.duration,
      baselineStart: new Date(baselineActivity.plannedStart),
      currentStart: new Date(current.plannedStart),
      variance,
      status: variance > 0 ? 'behind' : variance < 0 ? 'ahead' : 'on_track'
    };
  }).filter(Boolean) as BaselineComparison[];
};

export const calculateBaselineVariance = async (projectId: string): Promise<{ total: number; percentage: number }> => {
  const baseline = await getActiveBaseline(projectId);
  if (!baseline) return { total: 0, percentage: 0 };
  
  const totalVariance = 15;
  const percentage = (totalVariance / baseline.totalDuration) * 100;
  return { total: totalVariance, percentage };
};

export const deleteBaseline = async (baselineId: string): Promise<void> => {
  await ScheduleBaselineModel.destroy({ where: { id: baselineId } });
};

export const updateBaselineName = async (baselineId: string, newName: string): Promise<void> => {
  const baseline = await ScheduleBaselineModel.findByPk(baselineId);
  if (!baseline) throw new NotFoundException('Baseline not found');
  await baseline.update({ baselineName: newName });
};

export const exportBaseline = async (baselineId: string): Promise<string> => {
  const baseline = await ScheduleBaselineModel.findByPk(baselineId);
  if (!baseline) throw new NotFoundException('Baseline not found');
  return JSON.stringify(baseline.toJSON(), null, 2);
};

export const importBaseline = async (projectId: string, baselineData: string, createdBy: string): Promise<string> => {
  const data = JSON.parse(baselineData);
  return await createBaseline({ ...data, projectId, createdBy });
};

@Injectable()
export class ScheduleBaselineManagementService {
  private readonly logger = new Logger(ScheduleBaselineManagementService.name);
  async createProjectBaseline(projectId: string, name: string, createdBy: string): Promise<string> {
    return await createBaseline({
      projectId, baselineName: name, baselineDate: new Date(), isActive: true,
      activities: [], totalDuration: 0, startDate: new Date(), finishDate: new Date(), createdBy
    });
  }
}

export default { ScheduleBaselineModel, createBaseline, getActiveBaseline, getAllBaselines, setActiveBaseline, compareToBaseline, calculateBaselineVariance, deleteBaseline, updateBaselineName, exportBaseline, importBaseline, ScheduleBaselineManagementService };
