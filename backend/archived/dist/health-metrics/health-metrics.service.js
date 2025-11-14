"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthMetricsService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../common/base");
let HealthMetricsService = class HealthMetricsService extends base_1.BaseService {
    constructor() {
        super('HealthMetricsService');
    }
    async getMetricsOverview(timeRange = '24h', department, refresh = false) {
        try {
            const totalPatients = Math.floor(Math.random() * 500) + 100;
            const activeAppointments = Math.floor(Math.random() * 50) + 10;
            const criticalAlerts = Math.floor(Math.random() * 5);
            const avgWaitTime = Math.floor(Math.random() * 30) + 15;
            const bedOccupancy = {
                occupied: Math.floor(Math.random() * 80) + 20,
                total: 100,
                percentage: 0,
            };
            bedOccupancy.percentage = Math.round((bedOccupancy.occupied / bedOccupancy.total) * 100);
            const vitalStats = {
                avgHeartRate: Math.floor(Math.random() * 20) + 65,
                avgBloodPressure: `${Math.floor(Math.random() * 20) + 110}/${Math.floor(Math.random() * 15) + 70}`,
                avgTemperature: +(Math.random() * 2 + 97.5).toFixed(1),
                avgOxygenSaturation: Math.floor(Math.random() * 5) + 95,
            };
            const departments = [
                'Emergency',
                'ICU',
                'General Medicine',
                'Surgery',
                'Pediatrics',
            ];
            const departmentMetrics = departments.map((dept) => ({
                department: dept,
                patientCount: Math.floor(Math.random() * 50) + 10,
                avgWaitTime: Math.floor(Math.random() * 45) + 10,
                status: Math.random() > 0.8
                    ? 'high_alert'
                    : Math.random() > 0.5
                        ? 'moderate'
                        : 'normal',
            }));
            return {
                totalPatients,
                activeAppointments,
                criticalAlerts,
                avgWaitTime,
                bedOccupancy,
                vitalStats,
                departmentMetrics,
                timestamp: new Date(),
            };
        }
        catch (error) {
            this.logError('Error fetching metrics overview:', error);
            throw new Error('Failed to fetch metrics overview');
        }
    }
    async getLiveVitals(patientIds, department, critical = false, limit = 20) {
        try {
            const vitals = [];
            const numRecords = Math.min(limit, 20);
            for (let i = 0; i < numRecords; i++) {
                const heartRate = Math.floor(Math.random() * 60) + 60;
                const systolicBp = Math.floor(Math.random() * 60) + 100;
                const diastolicBp = Math.floor(Math.random() * 30) + 60;
                const temperature = +(Math.random() * 4 + 97).toFixed(1);
                const oxygenSaturation = Math.floor(Math.random() * 10) + 90;
                const isCritical = heartRate > 100 ||
                    heartRate < 60 ||
                    systolicBp > 140 ||
                    systolicBp < 90 ||
                    temperature > 100.4 ||
                    temperature < 96.8 ||
                    oxygenSaturation < 95;
                if (critical && !isCritical)
                    continue;
                vitals.push({
                    id: i + 1,
                    patient_id: Math.floor(Math.random() * 1000) + 1,
                    first_name: `Patient${i + 1}`,
                    last_name: `Last${i + 1}`,
                    patient_number: `P${String(i + 1).padStart(4, '0')}`,
                    department: department ||
                        ['Emergency', 'ICU', 'General'][Math.floor(Math.random() * 3)],
                    heart_rate: heartRate,
                    systolic_bp: systolicBp,
                    diastolic_bp: diastolicBp,
                    temperature: temperature,
                    oxygen_saturation: oxygenSaturation,
                    recorded_at: new Date(Date.now() - Math.random() * 3600000),
                    is_critical: isCritical,
                });
            }
            return vitals;
        }
        catch (error) {
            this.logError('Error fetching live vitals:', error);
            throw new Error('Failed to fetch live vitals');
        }
    }
    async getPatientTrends(patientId, metrics, timeRange, granularity) {
        try {
            const trends = [];
            const numPoints = granularity === 'hour' ? 24 : granularity === 'day' ? 7 : 4;
            for (let i = 0; i < numPoints; i++) {
                const dataPoint = {
                    time_period: new Date(Date.now() -
                        (numPoints - i) *
                            (granularity === 'hour'
                                ? 3600000
                                : granularity === 'day'
                                    ? 86400000
                                    : 604800000)),
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
        }
        catch (error) {
            this.logError('Error fetching patient trends:', error);
            throw new Error('Failed to fetch patient trends');
        }
    }
    async getDepartmentPerformance(timeRange, includeHistorical = false) {
        try {
            const departments = [
                'Emergency',
                'ICU',
                'General Medicine',
                'Surgery',
                'Pediatrics',
                'Cardiology',
            ];
            return departments.map((dept) => ({
                department: dept,
                total_patients: Math.floor(Math.random() * 100) + 20,
                total_appointments: Math.floor(Math.random() * 150) + 30,
                avg_wait_time: Math.floor(Math.random() * 60) + 10,
                critical_alerts: Math.floor(Math.random() * 8),
                high_alerts: Math.floor(Math.random() * 15) + 5,
                avg_heart_rate: Math.floor(Math.random() * 20) + 65,
                avg_oxygen_saturation: Math.floor(Math.random() * 5) + 95,
                completion_rate: Math.floor(Math.random() * 20) + 80,
            }));
        }
        catch (error) {
            this.logError('Error fetching department performance:', error);
            throw new Error('Failed to fetch department performance');
        }
    }
    async recordVitals(data) {
        try {
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
                recorded_at: new Date(),
            };
            await this.checkForCriticalVitals(vitalRecord);
            return vitalRecord;
        }
        catch (error) {
            this.logError('Error recording vitals:', error);
            throw new Error('Failed to record vital signs');
        }
    }
    async getHealthAlerts(severity, department, status = 'active', limit = 50) {
        try {
            const alertTypes = [
                'tachycardia',
                'bradycardia',
                'hypertension',
                'fever',
                'hypoxemia',
            ];
            const severities = severity || ['low', 'medium', 'high', 'critical'];
            const departments = ['Emergency', 'ICU', 'General Medicine', 'Surgery'];
            const alerts = [];
            const numAlerts = Math.min(limit, Math.floor(Math.random() * 20) + 5);
            for (let i = 0; i < numAlerts; i++) {
                const alertSeverity = severities[Math.floor(Math.random() * severities.length)];
                const alertDept = department ||
                    departments[Math.floor(Math.random() * departments.length)];
                const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
                alerts.push({
                    id: i + 1,
                    patientId: Math.floor(Math.random() * 1000) + 1,
                    patientName: `Patient ${i + 1} Last${i + 1}`,
                    alertType: alertType,
                    severity: alertSeverity,
                    message: this.generateAlertMessage(alertType, alertSeverity),
                    department: alertDept,
                    status: status,
                    createdAt: new Date(Date.now() - Math.random() * 86400000),
                    acknowledgedAt: status === 'acknowledged' ? new Date() : undefined,
                    acknowledgedBy: status === 'acknowledged'
                        ? Math.floor(Math.random() * 100) + 1
                        : undefined,
                });
            }
            return alerts;
        }
        catch (error) {
            this.logError('Error fetching health alerts:', error);
            throw new Error('Failed to fetch health alerts');
        }
    }
    async updateAlertStatus(alertId, updateData) {
        try {
            return {
                id: alertId,
                status: updateData.status,
                notes: updateData.notes,
                acknowledged_by: updateData.acknowledgedBy,
                acknowledged_at: new Date(),
                updated_at: new Date(),
            };
        }
        catch (error) {
            this.logError('Error updating alert status:', error);
            throw new Error('Failed to update alert status');
        }
    }
    async checkForCriticalVitals(vitalRecord) {
        try {
            const alerts = [];
            if (vitalRecord.heart_rate) {
                if (vitalRecord.heart_rate > 100) {
                    alerts.push({
                        type: 'tachycardia',
                        severity: vitalRecord.heart_rate > 120 ? 'critical' : 'high',
                        message: `Heart rate elevated: ${vitalRecord.heart_rate} bpm`,
                    });
                }
                else if (vitalRecord.heart_rate < 60) {
                    alerts.push({
                        type: 'bradycardia',
                        severity: vitalRecord.heart_rate < 50 ? 'critical' : 'high',
                        message: `Heart rate low: ${vitalRecord.heart_rate} bpm`,
                    });
                }
            }
            if (vitalRecord.systolic_bp && vitalRecord.diastolic_bp) {
                if (vitalRecord.systolic_bp > 140 || vitalRecord.diastolic_bp > 90) {
                    alerts.push({
                        type: 'hypertension',
                        severity: vitalRecord.systolic_bp > 160 || vitalRecord.diastolic_bp > 100
                            ? 'critical'
                            : 'high',
                        message: `Blood pressure elevated: ${vitalRecord.systolic_bp}/${vitalRecord.diastolic_bp} mmHg`,
                    });
                }
            }
            if (vitalRecord.temperature) {
                if (vitalRecord.temperature > 100.4) {
                    alerts.push({
                        type: 'fever',
                        severity: vitalRecord.temperature > 102 ? 'critical' : 'medium',
                        message: `Temperature elevated: ${vitalRecord.temperature}°F`,
                    });
                }
                else if (vitalRecord.temperature < 96.8) {
                    alerts.push({
                        type: 'hypothermia',
                        severity: vitalRecord.temperature < 95 ? 'critical' : 'medium',
                        message: `Temperature low: ${vitalRecord.temperature}°F`,
                    });
                }
            }
            if (vitalRecord.oxygen_saturation && vitalRecord.oxygen_saturation < 95) {
                alerts.push({
                    type: 'hypoxemia',
                    severity: vitalRecord.oxygen_saturation < 90 ? 'critical' : 'high',
                    message: `Oxygen saturation low: ${vitalRecord.oxygen_saturation}%`,
                });
            }
            this.logInfo(`Critical vitals detected: ${JSON.stringify(alerts)}`);
        }
        catch (error) {
            this.logError('Error checking for critical vitals:', error);
        }
    }
    generateAlertMessage(alertType, severity) {
        const messages = {
            tachycardia: `${severity === 'critical' ? 'CRITICAL' : 'High'} heart rate detected`,
            bradycardia: `${severity === 'critical' ? 'CRITICAL' : 'Low'} heart rate detected`,
            hypertension: `${severity === 'critical' ? 'CRITICAL' : 'Elevated'} blood pressure detected`,
            fever: `${severity === 'critical' ? 'CRITICAL' : 'Elevated'} temperature detected`,
            hypoxemia: `${severity === 'critical' ? 'CRITICAL' : 'Low'} oxygen saturation detected`,
        };
        return (messages[alertType] || 'Health alert detected');
    }
    getTimeRangeFilter(timeRange) {
        switch (timeRange) {
            case '1h':
                return '1 hour';
            case '6h':
                return '6 hours';
            case '24h':
                return '24 hours';
            case '7d':
                return '7 days';
            case '30d':
                return '30 days';
            case '90d':
                return '90 days';
            default:
                return '24 hours';
        }
    }
    getGranularityGroupBy(granularity) {
        switch (granularity) {
            case 'hour':
                return "DATE_TRUNC('hour', recorded_at)";
            case 'day':
                return "DATE_TRUNC('day', recorded_at)";
            case 'week':
                return "DATE_TRUNC('week', recorded_at)";
            default:
                return "DATE_TRUNC('day', recorded_at)";
        }
    }
};
exports.HealthMetricsService = HealthMetricsService;
exports.HealthMetricsService = HealthMetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], HealthMetricsService);
//# sourceMappingURL=health-metrics.service.js.map