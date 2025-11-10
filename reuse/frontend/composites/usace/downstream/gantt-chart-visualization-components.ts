/**
 * LOC: USACE-DS-GANTT-063
 * File: /reuse/frontend/composites/usace/downstream/gantt-chart-visualization-components.ts
 */
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Injectable, Logger } from '@nestjs/common';

export interface GanttTask {
  id: string; name: string; start: Date; end: Date; progress: number;
  dependencies: string[]; isCritical: boolean; resources: string[];
}

export interface GanttChartConfig {
  viewMode: 'day' | 'week' | 'month' | 'quarter';
  showCriticalPath: boolean; showProgress: boolean; showDependencies: boolean;
  zoomLevel: number; startDate: Date; endDate: Date;
}

export const useGanttChart = (tasks: GanttTask[], config: GanttChartConfig) => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [viewport, setViewport] = useState({ start: config.startDate, end: config.endDate });
  
  const visibleTasks = useMemo(() => {
    return tasks.filter(task => task.end >= viewport.start && task.start <= viewport.end);
  }, [tasks, viewport]);
  
  const criticalPath = useMemo(() => {
    return config.showCriticalPath ? tasks.filter(t => t.isCritical) : [];
  }, [tasks, config.showCriticalPath]);
  
  return { selectedTask, setSelectedTask, visibleTasks, criticalPath, viewport, setViewport };
};

export const calculateTaskPosition = (task: GanttTask, config: GanttChartConfig): { left: number; width: number } => {
  const totalDays = (config.endDate.getTime() - config.startDate.getTime()) / (1000 * 60 * 60 * 24);
  const taskStart = (task.start.getTime() - config.startDate.getTime()) / (1000 * 60 * 60 * 24);
  const taskDuration = (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24);
  return { left: (taskStart / totalDays) * 100, width: (taskDuration / totalDays) * 100 };
};

export const renderGanttTimeline = (config: GanttChartConfig): string[] => {
  const timeline = [];
  let current = new Date(config.startDate);
  while (current <= config.endDate) {
    timeline.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + (config.viewMode === 'day' ? 1 : config.viewMode === 'week' ? 7 : 30));
  }
  return timeline;
};

export const detectTaskCollisions = (tasks: GanttTask[]): Array<{ task1: string; task2: string }> => {
  const collisions = [];
  for (let i = 0; i < tasks.length; i++) {
    for (let j = i + 1; j < tasks.length; j++) {
      if (tasks[i].start <= tasks[j].end && tasks[i].end >= tasks[j].start) {
        collisions.push({ task1: tasks[i].id, task2: tasks[j].id });
      }
    }
  }
  return collisions;
};

export const exportGanttToImage = async (tasks: GanttTask[], config: GanttChartConfig): Promise<string> => {
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
};

export const exportGanttToPDF = async (tasks: GanttTask[]): Promise<Blob> => {
  return new Blob(['Gantt Chart PDF'], { type: 'application/pdf' });
};

export const zoomGanttChart = (config: GanttChartConfig, factor: number): GanttChartConfig => {
  return { ...config, zoomLevel: config.zoomLevel * factor };
};

export const panGanttChart = (config: GanttChartConfig, days: number): GanttChartConfig => {
  const newStart = new Date(config.startDate);
  newStart.setDate(newStart.getDate() + days);
  const newEnd = new Date(config.endDate);
  newEnd.setDate(newEnd.getDate() + days);
  return { ...config, startDate: newStart, endDate: newEnd };
};

export const highlightCriticalPath = (tasks: GanttTask[]): string[] => {
  return tasks.filter(t => t.isCritical).map(t => t.id);
};

export const renderDependencyLines = (tasks: GanttTask[]): Array<{ from: string; to: string; type: string }> => {
  const lines = [];
  for (const task of tasks) {
    for (const depId of task.dependencies) {
      lines.push({ from: depId, to: task.id, type: 'FS' });
    }
  }
  return lines;
};

@Injectable()
export class GanttChartVisualizationComponentsService {
  private readonly logger = new Logger(GanttChartVisualizationComponentsService.name);
  async generateGanttData(projectId: string): Promise<GanttTask[]> {
    return [];
  }
}

export default { useGanttChart, calculateTaskPosition, renderGanttTimeline, detectTaskCollisions, exportGanttToImage, exportGanttToPDF, zoomGanttChart, panGanttChart, highlightCriticalPath, renderDependencyLines, GanttChartVisualizationComponentsService };
