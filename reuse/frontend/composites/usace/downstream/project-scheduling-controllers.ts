/**
 * LOC: USACE-DS-SCHED-062
 * File: /reuse/frontend/composites/usace/downstream/project-scheduling-controllers.ts
 */
'use client';
import React from 'react';
import { Model, Column, Table, DataType, PrimaryKey, Default, AllowNull, Index } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export type ActivityType = 'task' | 'milestone' | 'summary';
export interface ProjectActivity {
  activityId: string; projectId: string; activityCode: string; activityName: string;
  activityType: ActivityType; duration: number; plannedStart: Date; plannedFinish: Date;
  status: 'not_started' | 'in_progress' | 'completed'; percentComplete: number;
  isCritical: boolean; totalFloat: number;
}

@Table({ tableName: 'project_activities', timestamps: true })
export class ProjectActivityModel extends Model {
  @PrimaryKey @Default(DataType.UUIDV4) @Column(DataType.UUID) id: string;
  @AllowNull(false) @Index @Column(DataType.UUID) projectId: string;
  @AllowNull(false) @Column(DataType.STRING) activityCode: string;
  @AllowNull(false) @Column(DataType.STRING) activityName: string;
  @Column(DataType.ENUM('task', 'milestone', 'summary')) activityType: string;
  @Column(DataType.INTEGER) duration: number;
  @Column(DataType.DATE) plannedStart: Date;
  @Column(DataType.DATE) plannedFinish: Date;
  @Column(DataType.ENUM('not_started', 'in_progress', 'completed')) status: string;
  @Default(0) @Column(DataType.FLOAT) percentComplete: number;
  @Default(false) @Column(DataType.BOOLEAN) isCritical: boolean;
  @Default(0) @Column(DataType.FLOAT) totalFloat: number;
}

export const createProjectActivity = async (activity: Omit<ProjectActivity, 'activityId'>): Promise<string> => {
  const pa = await ProjectActivityModel.create({ id: crypto.randomUUID(), ...activity });
  return pa.id;
};

export const getProjectActivities = async (projectId: string): Promise<ProjectActivity[]> => {
  const activities = await ProjectActivityModel.findAll({ where: { projectId } });
  return activities.map(a => a.toJSON() as ProjectActivity);
};

export const updateActivityProgress = async (activityId: string, percentComplete: number): Promise<void> => {
  const activity = await ProjectActivityModel.findByPk(activityId);
  if (!activity) throw new NotFoundException('Activity not found');
  await activity.update({ percentComplete, status: percentComplete === 100 ? 'completed' : 'in_progress' });
};

export const getCriticalActivities = async (projectId: string): Promise<ProjectActivity[]> => {
  const activities = await ProjectActivityModel.findAll({ where: { projectId, isCritical: true } });
  return activities.map(a => a.toJSON() as ProjectActivity);
};

export const calculateProjectDuration = async (projectId: string): Promise<number> => {
  const activities = await getProjectActivities(projectId);
  return activities.reduce((max, a) => Math.max(max, a.duration), 0);
};

export const getActivitiesByStatus = async (projectId: string, status: string): Promise<ProjectActivity[]> => {
  const activities = await ProjectActivityModel.findAll({ where: { projectId, status } });
  return activities.map(a => a.toJSON() as ProjectActivity);
};

export const updateActivityDates = async (activityId: string, start: Date, finish: Date): Promise<void> => {
  const activity = await ProjectActivityModel.findByPk(activityId);
  if (!activity) throw new NotFoundException('Activity not found');
  await activity.update({ plannedStart: start, plannedFinish: finish });
};

export const deleteProjectActivity = async (activityId: string): Promise<void> => {
  await ProjectActivityModel.destroy({ where: { id: activityId } });
};

export const cloneActivity = async (activityId: string): Promise<string> => {
  const original = await ProjectActivityModel.findByPk(activityId);
  if (!original) throw new NotFoundException('Activity not found');
  const clone = await ProjectActivityModel.create({ ...original.toJSON(), id: crypto.randomUUID(), activityCode: original.activityCode + '-COPY' });
  return clone.id;
};

export const getMilestones = async (projectId: string): Promise<ProjectActivity[]> => {
  const activities = await ProjectActivityModel.findAll({ where: { projectId, activityType: 'milestone' } });
  return activities.map(a => a.toJSON() as ProjectActivity);
};

@Injectable()
export class ProjectSchedulingControllersService {
  private readonly logger = new Logger(ProjectSchedulingControllersService.name);
  async getProjectSchedule(projectId: string): Promise<ProjectActivity[]> {
    return await getProjectActivities(projectId);
  }
}

export default { ProjectActivityModel, createProjectActivity, getProjectActivities, updateActivityProgress, getCriticalActivities, calculateProjectDuration, getActivitiesByStatus, updateActivityDates, deleteProjectActivity, cloneActivity, getMilestones, ProjectSchedulingControllersService };
