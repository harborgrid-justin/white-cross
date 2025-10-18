/**
 * Health Metrics Service - Real-time health metrics tracking and analytics
 * Author: System
 * Date: 2024
 * Description: Service for managing real-time health metrics, vital signs, and dashboard analytics
 */

import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';

interface VitalSigns {
  heartRate?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  temperature?: number;
  oxygenSaturation?: number;
  respiratoryRate?: number;
  weight?: number;
  height?: number;
}

interface MetricsOverview {
  totalPatients: number;
  activeAppointments: number;
  criticalAlerts: number;
  avgWaitTime: number;
  bedOccupancy: {
    occupied: number;
    total: number;
    percentage: number;
  };
  vitalStats: {
    avgHeartRate: number;
    avgBloodPressure: string;
    avgTemperature: number;
    avgOxygenSaturation: number;
  };
  departmentMetrics: Array<{
    department: string;
    patientCount: number;
    avgWaitTime: number;
    status: string;
  }>;
  timestamp: Date;
}

interface HealthAlert {
  id: number;
  patientId: number;
  patientName: string;
  alertType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  department: string;
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: number;
  notes?: string;
}

class HealthMetricsService {
  constructor() {
    // Using Sequelize instance from config
  }

  async getMetricsOverview(timeRange: string = '24h', department?: string, refresh: boolean = false): Promise<MetricsOverview> {
    try {
      // Simulate real-time health metrics for demo purposes
      // In production, these would query actual database tables
      
      const totalPatients = Math.floor(Math.random() * 500) + 100;
      const activeAppointments = Math.floor(Math.random() * 50) + 10;
      const criticalAlerts = Math.floor(Math.random() * 5);
      const avgWaitTime = Math.floor(Math.random() * 30) + 15;

      const bedOccupancy = {
        occupied: Math.floor(Math.random() * 80) + 20,
        total: 100,
        percentage: 0
      };
      bedOccupancy.percentage = Math.round((bedOccupancy.occupied / bedOccupancy.total) * 100);

      const vitalStats = {
        avgHeartRate: Math.floor(Math.random() * 20) + 65,
        avgBloodPressure: `${Math.floor(Math.random() * 20) + 110}/${Math.floor(Math.random() * 15) + 70}`,
        avgTemperature: +(Math.random() * 2 + 97.5).toFixed(1),
        avgOxygenSaturation: Math.floor(Math.random() * 5) + 95
      };

      const departments = ['Emergency', 'ICU', 'General Medicine', 'Surgery', 'Pediatrics'];
      const departmentMetrics = departments.map(dept => ({
        department: dept,
        patientCount: Math.floor(Math.random() * 50) + 10,
        avgWaitTime: Math.floor(Math.random() * 45) + 10,
        status: Math.random() > 0.8 ? 'high_alert' : Math.random() > 0.5 ? 'moderate' : 'normal'
      }));

      return {
        totalPatients,
        activeAppointments,
        criticalAlerts,
        avgWaitTime,
        bedOccupancy,
        vitalStats,
        departmentMetrics,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error fetching metrics overview:', error);
      throw new Error('Failed to fetch metrics overview');
    }
  }

  async getLiveVitals(patientIds?: number[], department?: string, critical: boolean = false, limit: number = 20) {
    try {
      // Simulate live vital signs data
      const vitals = [];
      const numRecords = Math.min(limit, 20);

      for (let i = 0; i < numRecords; i++) {
        const heartRate = Math.floor(Math.random() * 60) + 60;
        const systolicBp = Math.floor(Math.random() * 60) + 100;
        const diastolicBp = Math.floor(Math.random() * 30) + 60;
        const temperature = +(Math.random() * 4 + 97).toFixed(1);
        const oxygenSaturation = Math.floor(Math.random() * 10) + 90;

        const isCritical = heartRate > 100 || heartRate < 60 || 
                          systolicBp > 140 || systolicBp < 90 ||
                          temperature > 100.4 || temperature < 96.8 ||
                          oxygenSaturation < 95;

        if (critical && !isCritical) continue;

        vitals.push({
          id: i + 1,
          patient_id: Math.floor(Math.random() * 1000) + 1,
          first_name: `Patient${i + 1}`,
          last_name: `Last${i + 1}`,
          patient_number: `P${String(i + 1).padStart(4, '0')}`,
          department: department || ['Emergency', 'ICU', 'General'][Math.floor(Math.random() * 3)],
          heart_rate: heartRate,
          systolic_bp: systolicBp,
          diastolic_bp: diastolicBp,
          temperature: temperature,
          oxygen_saturation: oxygenSaturation,
          recorded_at: new Date(Date.now() - Math.random() * 3600000),
          is_critical: isCritical
        });
      }

      return vitals;
    } catch (error) {
      console.error('Error fetching live vitals:', error);
      throw new Error('Failed to fetch live vitals');
    }
  }

  async getPatientTrends(patientId: number, metrics: string[], timeRange: string, granularity: string) {
    try {
      // Simulate patient trend data
      const trends = [];
      const numPoints = granularity === 'hour' ? 24 : granularity === 'day' ? 7 : 4;

      for (let i = 0; i < numPoints; i++) {
        const dataPoint: any = {
          time_period: new Date(Date.now() - (numPoints - i) * (granularity === 'hour' ? 3600000 : granularity === 'day' ? 86400000 : 604800000))
        };

        if (metrics.includes('heart_rate')) {
          dataPoint.heart_rate = Math.floor(Math.random() * 30) + 60;
        }
        if (metrics.includes('blood_pressure')) {
          dataPoint.systolic_bp = Math.floor(Math.random() * 40) + 100;
          dataPoint.diastolic_bp = Math.floor(Math.random() * 20) + 60;
        }
        if (metrics.includes('temperature')) {
          dataPoint.temperature = +(Math.random() * 3 + 97).toFixed(1);
        }
        if (metrics.includes('oxygen_saturation')) {
          dataPoint.oxygen_saturation = Math.floor(Math.random() * 8) + 92;
        }

        trends.push(dataPoint);
      }

      return trends;
    } catch (error) {
      console.error('Error fetching patient trends:', error);
      throw new Error('Failed to fetch patient trends');
    }
  }

  async getDepartmentPerformance(timeRange: string, includeHistorical: boolean = false) {
    try {
      // Simulate department performance data
      const departments = ['Emergency', 'ICU', 'General Medicine', 'Surgery', 'Pediatrics', 'Cardiology'];
      
      return departments.map(dept => ({
        department: dept,
        total_patients: Math.floor(Math.random() * 100) + 20,
        total_appointments: Math.floor(Math.random() * 150) + 30,
        avg_wait_time: Math.floor(Math.random() * 60) + 10,
        critical_alerts: Math.floor(Math.random() * 8),
        high_alerts: Math.floor(Math.random() * 15) + 5,
        avg_heart_rate: Math.floor(Math.random() * 20) + 65,
        avg_oxygen_saturation: Math.floor(Math.random() * 5) + 95,
        completion_rate: Math.floor(Math.random() * 20) + 80
      }));
    } catch (error) {
      console.error('Error fetching department performance:', error);
      throw new Error('Failed to fetch department performance');
    }
  }

  async recordVitals(data: any) {
    try {
      // Simulate recording vitals
      const vitalRecord = {
        id: Math.floor(Math.random() * 10000),
        patient_id: data.patientId,
        heart_rate: data.vitals.heartRate,
        systolic_bp: data.vitals.bloodPressure?.systolic,
        diastolic_bp: data.vitals.bloodPressure?.diastolic,
        temperature: data.vitals.temperature,
        oxygen_saturation: data.vitals.oxygenSaturation,
        respiratory_rate: data.vitals.respiratoryRate,
        weight: data.vitals.weight,
        height: data.vitals.height,
        device_id: data.deviceId,
        notes: data.notes,
        recorded_by: data.recordedBy,
        recorded_at: new Date()
      };

      // Check for critical values and create alerts if needed
      await this.checkForCriticalVitals(vitalRecord);
      
      return vitalRecord;
    } catch (error) {
      console.error('Error recording vitals:', error);
      throw new Error('Failed to record vital signs');
    }
  }

  async getHealthAlerts(severity?: string[], department?: string, status: string = 'active', limit: number = 50): Promise<HealthAlert[]> {
    try {
      // Simulate health alerts
      const alertTypes = ['tachycardia', 'bradycardia', 'hypertension', 'fever', 'hypoxemia'];
      const severities = severity || ['low', 'medium', 'high', 'critical'];
      const departments = ['Emergency', 'ICU', 'General Medicine', 'Surgery'];
      
      const alerts: HealthAlert[] = [];
      const numAlerts = Math.min(limit, Math.floor(Math.random() * 20) + 5);

      for (let i = 0; i < numAlerts; i++) {
        const alertSeverity = severities[Math.floor(Math.random() * severities.length)] as any;
        const alertDept = department || departments[Math.floor(Math.random() * departments.length)];
        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];

        alerts.push({
          id: i + 1,
          patientId: Math.floor(Math.random() * 1000) + 1,
          patientName: `Patient ${i + 1} Last${i + 1}`,
          alertType: alertType,
          severity: alertSeverity,
          message: this.generateAlertMessage(alertType, alertSeverity),
          department: alertDept,
          status: status as any,
          createdAt: new Date(Date.now() - Math.random() * 86400000),
          acknowledgedAt: status === 'acknowledged' ? new Date() : undefined,
          acknowledgedBy: status === 'acknowledged' ? Math.floor(Math.random() * 100) + 1 : undefined
        });
      }

      return alerts;
    } catch (error) {
      console.error('Error fetching health alerts:', error);
      throw new Error('Failed to fetch health alerts');
    }
  }

  async updateAlertStatus(alertId: number, updateData: any) {
    try {
      // Simulate updating alert status
      return {
        id: alertId,
        status: updateData.status,
        notes: updateData.notes,
        acknowledged_by: updateData.acknowledgedBy,
        acknowledged_at: new Date(),
        updated_at: new Date()
      };
    } catch (error) {
      console.error('Error updating alert status:', error);
      throw new Error('Failed to update alert status');
    }
  }

  private async checkForCriticalVitals(vitalRecord: any) {
    try {
      const alerts = [];
      
      // Heart rate alerts
      if (vitalRecord.heart_rate) {
        if (vitalRecord.heart_rate > 100) {
          alerts.push({
            type: 'tachycardia',
            severity: vitalRecord.heart_rate > 120 ? 'critical' : 'high',
            message: `Heart rate elevated: ${vitalRecord.heart_rate} bpm`
          });
        } else if (vitalRecord.heart_rate < 60) {
          alerts.push({
            type: 'bradycardia',
            severity: vitalRecord.heart_rate < 50 ? 'critical' : 'high',
            message: `Heart rate low: ${vitalRecord.heart_rate} bpm`
          });
        }
      }

      // Blood pressure alerts
      if (vitalRecord.systolic_bp && vitalRecord.diastolic_bp) {
        if (vitalRecord.systolic_bp > 140 || vitalRecord.diastolic_bp > 90) {
          alerts.push({
            type: 'hypertension',
            severity: (vitalRecord.systolic_bp > 160 || vitalRecord.diastolic_bp > 100) ? 'critical' : 'high',
            message: `Blood pressure elevated: ${vitalRecord.systolic_bp}/${vitalRecord.diastolic_bp} mmHg`
          });
        }
      }

      // Temperature alerts
      if (vitalRecord.temperature) {
        if (vitalRecord.temperature > 100.4) {
          alerts.push({
            type: 'fever',
            severity: vitalRecord.temperature > 102 ? 'critical' : 'medium',
            message: `Temperature elevated: ${vitalRecord.temperature}°F`
          });
        } else if (vitalRecord.temperature < 96.8) {
          alerts.push({
            type: 'hypothermia',
            severity: vitalRecord.temperature < 95 ? 'critical' : 'medium',
            message: `Temperature low: ${vitalRecord.temperature}°F`
          });
        }
      }

      // Oxygen saturation alerts
      if (vitalRecord.oxygen_saturation && vitalRecord.oxygen_saturation < 95) {
        alerts.push({
          type: 'hypoxemia',
          severity: vitalRecord.oxygen_saturation < 90 ? 'critical' : 'high',
          message: `Oxygen saturation low: ${vitalRecord.oxygen_saturation}%`
        });
      }

      // In a real implementation, these alerts would be saved to the database
      console.log('Critical vitals detected:', alerts);
    } catch (error) {
      console.error('Error checking for critical vitals:', error);
    }
  }

  private generateAlertMessage(alertType: string, severity: string): string {
    const messages = {
      tachycardia: `${severity === 'critical' ? 'CRITICAL' : 'High'} heart rate detected`,
      bradycardia: `${severity === 'critical' ? 'CRITICAL' : 'Low'} heart rate detected`,
      hypertension: `${severity === 'critical' ? 'CRITICAL' : 'Elevated'} blood pressure detected`,
      fever: `${severity === 'critical' ? 'CRITICAL' : 'Elevated'} temperature detected`,
      hypoxemia: `${severity === 'critical' ? 'CRITICAL' : 'Low'} oxygen saturation detected`
    };
    
    return messages[alertType as keyof typeof messages] || 'Health alert detected';
  }

  private getTimeRangeFilter(timeRange: string): string {
    switch (timeRange) {
      case '1h': return '1 hour';
      case '6h': return '6 hours';
      case '24h': return '24 hours';
      case '7d': return '7 days';
      case '30d': return '30 days';
      case '90d': return '90 days';
      default: return '24 hours';
    }
  }

  private getGranularityGroupBy(granularity: string): string {
    switch (granularity) {
      case 'hour': return "DATE_TRUNC('hour', recorded_at)";
      case 'day': return "DATE_TRUNC('day', recorded_at)";
      case 'week': return "DATE_TRUNC('week', recorded_at)";
      default: return "DATE_TRUNC('day', recorded_at)";
    }
  }
}

export const healthMetricsService = new HealthMetricsService();
