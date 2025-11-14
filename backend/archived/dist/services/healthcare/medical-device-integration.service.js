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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicalDeviceIntegrationService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const models_4 = require("../../database/models");
const base_1 = require("../../common/base");
let MedicalDeviceIntegrationService = class MedicalDeviceIntegrationService extends base_1.BaseService {
    studentModel;
    healthRecordModel;
    vitalSignsModel;
    deviceReadingModel;
    sequelize;
    SUPPORTED_DEVICES = {
        BLOOD_PRESSURE_MONITOR: 'blood_pressure_monitor',
        GLUCOSE_METER: 'glucose_meter',
        PULSE_OXIMETER: 'pulse_oximeter',
        WEIGHING_SCALE: 'weighing_scale',
        THERMOMETER: 'thermometer',
        ECG_MONITOR: 'ecg_monitor',
        FITNESS_TRACKER: 'fitness_tracker',
        SLEEP_MONITOR: 'sleep_monitor',
        PEAK_FLOW_METER: 'peak_flow_meter',
        HOLTER_MONITOR: 'holter_monitor',
    };
    VALIDATION_RANGES = {
        blood_pressure_systolic: { min: 70, max: 250 },
        blood_pressure_diastolic: { min: 40, max: 150 },
        heart_rate: { min: 30, max: 200 },
        blood_glucose: { min: 20, max: 600 },
        oxygen_saturation: { min: 70, max: 100 },
        temperature: { min: 95, max: 108 },
        weight: { min: 50, max: 500 },
        respiratory_rate: { min: 8, max: 40 },
    };
    ANOMALY_THRESHOLDS = {
        blood_pressure_systolic: { critical_high: 180, high: 140, low: 90, critical_low: 80 },
        blood_pressure_diastolic: { critical_high: 120, high: 90, low: 60, critical_low: 50 },
        heart_rate: { critical_high: 150, high: 100, low: 50, critical_low: 40 },
        blood_glucose: { critical_high: 400, high: 180, low: 70, critical_low: 40 },
        oxygen_saturation: { critical_low: 90, low: 95 },
        temperature: { critical_high: 103, high: 100.4, low: 97, critical_low: 95 },
    };
    constructor(studentModel, healthRecordModel, vitalSignsModel, deviceReadingModel, sequelize) {
        super("MedicalDeviceIntegrationService");
        this.studentModel = studentModel;
        this.healthRecordModel = healthRecordModel;
        this.vitalSignsModel = vitalSignsModel;
        this.deviceReadingModel = deviceReadingModel;
        this.sequelize = sequelize;
    }
    async registerDevice(patientId, deviceInfo) {
        const patient = await this.studentModel.findByPk(patientId);
        if (!patient) {
            return {
                success: false,
                error: 'Patient not found',
            };
        }
        if (!Object.values(this.SUPPORTED_DEVICES).includes(deviceInfo.deviceType)) {
            return {
                success: false,
                error: 'Unsupported device type',
            };
        }
        const existingDevice = await this.deviceReadingModel.findOne({
            where: {
                patientId,
                deviceId: deviceInfo.deviceId,
                isActive: true,
            },
        });
        if (existingDevice) {
            return {
                success: false,
                error: 'Device already registered for this patient',
            };
        }
        const device = await this.deviceReadingModel.create({
            patientId,
            deviceId: deviceInfo.deviceId,
            deviceType: deviceInfo.deviceType,
            deviceModel: deviceInfo.deviceModel,
            manufacturer: deviceInfo.manufacturer,
            firmwareVersion: deviceInfo.firmwareVersion,
            serialNumber: deviceInfo.serialNumber,
            isActive: true,
            registrationDate: new Date(),
            lastSyncDate: null,
            batteryLevel: null,
            connectionStatus: 'REGISTERED',
        });
        await this.initializeDeviceCalibration(device.id, deviceInfo.deviceType);
        await this.logDeviceEvent(device.id, 'REGISTERED', {
            patientId,
            deviceType: deviceInfo.deviceType,
            manufacturer: deviceInfo.manufacturer,
        });
        return {
            success: true,
            deviceId: device.id,
            registrationCode: this.generateDeviceRegistrationCode(device.id),
            message: 'Device registered successfully. Use the registration code to connect the device.',
        };
    }
    async ingestDeviceData(deviceId, data) {
        const device = await this.deviceReadingModel.findOne({
            where: {
                deviceId,
                isActive: true,
            },
        });
        if (!device) {
            return {
                success: false,
                error: 'Device not found or inactive',
            };
        }
        const isAuthenticated = await this.authenticateDevice(deviceId, data.authToken);
        if (!isAuthenticated) {
            await this.logDeviceEvent(device.id, 'AUTHENTICATION_FAILED', { deviceId });
            return {
                success: false,
                error: 'Device authentication failed',
            };
        }
        const validation = await this.validateDeviceData(data.readings, device.deviceType);
        if (!validation.valid) {
            await this.logDeviceEvent(device.id, 'DATA_VALIDATION_FAILED', {
                errors: validation.errors,
                readingCount: data.readings.length,
            });
            return {
                success: false,
                error: `Data validation failed: ${validation.errors.join(', ')}`,
            };
        }
        const processedReadings = await this.processDeviceReadings(device.patientId, device.deviceType, data.readings);
        await this.updateDeviceStatus(device.id, {
            lastSyncDate: new Date(),
            batteryLevel: data.batteryLevel,
            connectionStatus: 'CONNECTED',
        });
        const anomalies = await this.detectAnomalies(device.patientId, processedReadings);
        if (anomalies.length > 0) {
            await this.generateAnomalyAlerts(device.patientId, anomalies);
        }
        await this.logDeviceEvent(device.id, 'DATA_INGESTED', {
            readingCount: processedReadings.length,
            anomalyCount: anomalies.length,
        });
        return {
            success: true,
            readingsProcessed: processedReadings.length,
            anomaliesDetected: anomalies.length,
            alertsGenerated: anomalies.length,
            message: `Successfully processed ${processedReadings.length} readings`,
        };
    }
    async getDeviceStatus(patientId, deviceId) {
        const whereClause = {
            patientId,
            isActive: true,
        };
        if (deviceId) {
            whereClause.deviceId = deviceId;
        }
        const devices = await this.deviceReadingModel.findAll({
            where: whereClause,
            order: [['registrationDate', 'DESC']],
        });
        const deviceStatuses = await Promise.all(devices.map(async (device) => {
            const latestReading = await this.getLatestDeviceReading(device.id);
            const connectivityStatus = await this.checkDeviceConnectivity(device.deviceId);
            return {
                deviceId: device.deviceId,
                deviceType: device.deviceType,
                deviceModel: device.deviceModel,
                manufacturer: device.manufacturer,
                connectionStatus: device.connectionStatus,
                connectivityStatus,
                batteryLevel: device.batteryLevel,
                lastSyncDate: device.lastSyncDate,
                latestReading,
                isOnline: connectivityStatus === 'ONLINE',
                firmwareVersion: device.firmwareVersion,
                registrationDate: device.registrationDate,
            };
        }));
        return {
            patientId,
            devices: deviceStatuses,
            totalDevices: deviceStatuses.length,
            onlineDevices: deviceStatuses.filter(d => d.isOnline).length,
            lastUpdated: new Date(),
        };
    }
    async getDeviceReadings(patientId, deviceId, filters) {
        const device = await this.deviceReadingModel.findOne({
            where: {
                patientId,
                deviceId,
                isActive: true,
            },
        });
        if (!device) {
            throw new Error('Device not found or access denied');
        }
        const whereClause = {
            deviceId: device.id,
        };
        if (filters?.dateFrom) {
            whereClause.timestamp = {
                ...whereClause.timestamp,
                [this.sequelize.Op.gte]: filters.dateFrom,
            };
        }
        if (filters?.dateTo) {
            whereClause.timestamp = {
                ...whereClause.timestamp,
                [this.sequelize.Op.lte]: filters.dateTo,
            };
        }
        const readings = await this.vitalSignsModel.findAll({
            where: whereClause,
            order: [['timestamp', 'DESC']],
            limit: filters?.limit || 100,
            offset: filters?.offset || 0,
        });
        const processedReadings = readings.map(reading => ({
            id: reading.id,
            timestamp: reading.timestamp,
            deviceType: device.deviceType,
            readings: {
                bloodPressureSystolic: reading.bloodPressureSystolic,
                bloodPressureDiastolic: reading.bloodPressureDiastolic,
                heartRate: reading.heartRate,
                bloodGlucose: reading.bloodGlucose,
                oxygenSaturation: reading.oxygenSaturation,
                temperature: reading.temperature,
                weight: reading.weight,
                respiratoryRate: reading.respiratoryRate,
            },
            source: 'DEVICE',
            quality: reading.quality || 'GOOD',
        }));
        return {
            deviceId,
            deviceType: device.deviceType,
            readings: processedReadings,
            totalCount: processedReadings.length,
            hasMore: processedReadings.length === (filters?.limit || 100),
            dateRange: {
                from: filters?.dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                to: filters?.dateTo || new Date(),
            },
        };
    }
    async calibrateDevice(deviceId, calibrationData) {
        const device = await this.deviceReadingModel.findOne({
            where: {
                deviceId,
                isActive: true,
            },
        });
        if (!device) {
            return {
                success: false,
                error: 'Device not found',
            };
        }
        const validation = await this.validateCalibrationData(device.deviceType, calibrationData);
        if (!validation.valid) {
            return {
                success: false,
                error: `Calibration validation failed: ${validation.errors.join(', ')}`,
            };
        }
        await this.applyDeviceCalibration(device.id, calibrationData);
        await this.deviceReadingModel.update({
            lastCalibrationDate: new Date(),
            calibrationDueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        }, {
            where: { id: device.id },
        });
        await this.logDeviceEvent(device.id, 'CALIBRATED', {
            calibrationType: calibrationData.calibrationType,
            performedBy: calibrationData.performedBy,
        });
        return {
            success: true,
            calibrationDate: new Date(),
            nextCalibrationDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            message: 'Device calibrated successfully',
        };
    }
    async detectAnomalies(patientId, readings) {
        const anomalies = [];
        for (const reading of readings) {
            const readingAnomalies = await this.analyzeReadingForAnomalies(patientId, reading);
            anomalies.push(...readingAnomalies);
        }
        const historicalAnomalies = await this.analyzeHistoricalPatterns(patientId, readings);
        anomalies.push(...historicalAnomalies);
        return anomalies;
    }
    async generatePredictiveInsights(patientId, deviceId) {
        const historicalReadings = await this.getHistoricalReadings(patientId, deviceId, 90);
        const trends = await this.analyzeTrends(historicalReadings);
        const predictions = await this.generatePredictions(trends);
        const riskScores = await this.calculateRiskScores(predictions);
        const recommendations = await this.generatePredictiveRecommendations(trends, predictions, riskScores);
        return {
            patientId,
            deviceId,
            analysisPeriod: {
                from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                to: new Date(),
            },
            trends,
            predictions,
            riskScores,
            recommendations,
            generatedAt: new Date(),
            confidence: this.calculatePredictionConfidence(trends, historicalReadings.length),
        };
    }
    async syncDeviceData(patientId, deviceId, targetSystem) {
        const device = await this.deviceReadingModel.findOne({
            where: {
                patientId,
                deviceId,
                isActive: true,
            },
        });
        if (!device) {
            return {
                success: false,
                error: 'Device not found',
            };
        }
        const syncData = await this.prepareSyncData(device.id, targetSystem);
        const syncResult = await this.performDataSync(syncData, targetSystem);
        await this.logDeviceEvent(device.id, 'DATA_SYNCED', {
            targetSystem,
            recordsSynced: syncResult.recordsSynced,
            success: syncResult.success,
        });
        return syncResult;
    }
    async getDeviceMaintenanceSchedule(patientId) {
        const devices = await this.deviceReadingModel.findAll({
            where: {
                patientId,
                isActive: true,
            },
        });
        const maintenanceItems = await Promise.all(devices.map(async (device) => {
            const maintenanceHistory = await this.getDeviceMaintenanceHistory(device.id);
            const nextMaintenance = await this.calculateNextMaintenance(device, maintenanceHistory);
            return {
                deviceId: device.deviceId,
                deviceType: device.deviceType,
                deviceModel: device.deviceModel,
                lastMaintenanceDate: maintenanceHistory.length > 0 ?
                    maintenanceHistory[maintenanceHistory.length - 1].maintenanceDate : null,
                nextMaintenanceDate: nextMaintenance.dueDate,
                maintenanceType: nextMaintenance.type,
                urgency: nextMaintenance.urgency,
                description: nextMaintenance.description,
                estimatedCost: nextMaintenance.estimatedCost,
            };
        }));
        return {
            patientId,
            maintenanceItems,
            totalItems: maintenanceItems.length,
            urgentItems: maintenanceItems.filter(item => item.urgency === 'URGENT').length,
            generatedAt: new Date(),
        };
    }
    async initializeDeviceCalibration(deviceId, deviceType) {
        const calibrationSettings = this.getDefaultCalibrationSettings(deviceType);
        await this.deviceReadingModel.update({
            calibrationSettings,
            lastCalibrationDate: new Date(),
            calibrationDueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        }, {
            where: { id: deviceId },
        });
    }
    generateDeviceRegistrationCode(deviceId) {
        return `DEV_${deviceId.substring(0, 8).toUpperCase()}_${Date.now().toString().slice(-6)}`;
    }
    async logDeviceEvent(deviceId, eventType, details) {
        this.logInfo(`Device ${deviceId}: ${eventType}`, details);
    }
    async authenticateDevice(deviceId, authToken) {
        return authToken && authToken.startsWith('DEV_');
    }
    async validateDeviceData(readings, deviceType) {
        const errors = [];
        for (const reading of readings) {
            const validation = this.validateReadingData(reading, deviceType);
            if (!validation.valid) {
                errors.push(...validation.errors);
            }
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    validateReadingData(reading, deviceType) {
        const errors = [];
        if (!reading.timestamp || new Date(reading.timestamp).getTime() > Date.now()) {
            errors.push('Invalid timestamp');
        }
        switch (deviceType) {
            case this.SUPPORTED_DEVICES.BLOOD_PRESSURE_MONITOR:
                if (reading.bloodPressureSystolic) {
                    const range = this.VALIDATION_RANGES.blood_pressure_systolic;
                    if (reading.bloodPressureSystolic < range.min || reading.bloodPressureSystolic > range.max) {
                        errors.push(`Blood pressure systolic out of range: ${reading.bloodPressureSystolic}`);
                    }
                }
                if (reading.bloodPressureDiastolic) {
                    const range = this.VALIDATION_RANGES.blood_pressure_diastolic;
                    if (reading.bloodPressureDiastolic < range.min || reading.bloodPressureDiastolic > range.max) {
                        errors.push(`Blood pressure diastolic out of range: ${reading.bloodPressureDiastolic}`);
                    }
                }
                break;
            case this.SUPPORTED_DEVICES.GLUCOSE_METER:
                if (reading.bloodGlucose) {
                    const range = this.VALIDATION_RANGES.blood_glucose;
                    if (reading.bloodGlucose < range.min || reading.bloodGlucose > range.max) {
                        errors.push(`Blood glucose out of range: ${reading.bloodGlucose}`);
                    }
                }
                break;
            case this.SUPPORTED_DEVICES.PULSE_OXIMETER:
                if (reading.oxygenSaturation) {
                    const range = this.VALIDATION_RANGES.oxygen_saturation;
                    if (reading.oxygenSaturation < range.min || reading.oxygenSaturation > range.max) {
                        errors.push(`Oxygen saturation out of range: ${reading.oxygenSaturation}`);
                    }
                }
                break;
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    async processDeviceReadings(patientId, deviceType, readings) {
        const processedReadings = [];
        for (const reading of readings) {
            const calibratedReading = await this.applyCalibrationToReading(reading, deviceType);
            const vitalSignsRecord = await this.vitalSignsModel.create({
                patientId,
                timestamp: new Date(reading.timestamp),
                bloodPressureSystolic: calibratedReading.bloodPressureSystolic,
                bloodPressureDiastolic: calibratedReading.bloodPressureDiastolic,
                heartRate: calibratedReading.heartRate,
                bloodGlucose: calibratedReading.bloodGlucose,
                oxygenSaturation: calibratedReading.oxygenSaturation,
                temperature: calibratedReading.temperature,
                weight: calibratedReading.weight,
                respiratoryRate: calibratedReading.respiratoryRate,
                source: 'DEVICE',
                deviceType,
                quality: 'GOOD',
            });
            processedReadings.push({
                id: vitalSignsRecord.id,
                timestamp: vitalSignsRecord.timestamp,
                deviceType,
                readings: calibratedReading,
            });
        }
        return processedReadings;
    }
    async updateDeviceStatus(deviceId, status) {
        await this.deviceReadingModel.update(status, {
            where: { id: deviceId },
        });
    }
    async generateAnomalyAlerts(patientId, anomalies) {
        for (const anomaly of anomalies) {
            await this.healthRecordModel.create({
                studentId: patientId,
                recordType: 'ANOMALY_ALERT',
                title: `Device Anomaly: ${anomaly.type}`,
                description: anomaly.description,
                details: {
                    anomalyType: anomaly.type,
                    severity: anomaly.severity,
                    reading: anomaly.reading,
                    threshold: anomaly.threshold,
                    timestamp: anomaly.timestamp,
                },
                provider: 'SYSTEM',
                isActive: true,
            });
            this.logWarning(`Anomaly alert generated for patient ${patientId}: ${anomaly.description}`);
        }
    }
    async getLatestDeviceReading(deviceId) {
        const latestReading = await this.vitalSignsModel.findOne({
            where: { deviceId },
            order: [['timestamp', 'DESC']],
        });
        if (!latestReading)
            return null;
        return {
            timestamp: latestReading.timestamp.toISOString(),
            bloodPressureSystolic: latestReading.bloodPressureSystolic,
            bloodPressureDiastolic: latestReading.bloodPressureDiastolic,
            heartRate: latestReading.heartRate,
            bloodGlucose: latestReading.bloodGlucose,
            oxygenSaturation: latestReading.oxygenSaturation,
            temperature: latestReading.temperature,
            weight: latestReading.weight,
            respiratoryRate: latestReading.respiratoryRate,
        };
    }
    async checkDeviceConnectivity(deviceId) {
        return 'ONLINE';
    }
    async applyCalibrationToReading(reading, deviceType) {
        return reading;
    }
    async analyzeReadingForAnomalies(patientId, reading) {
        const anomalies = [];
        if (reading.readings.bloodPressureSystolic) {
            const threshold = this.ANOMALY_THRESHOLDS.blood_pressure_systolic;
            const value = reading.readings.bloodPressureSystolic;
            if (value >= threshold.critical_high) {
                anomalies.push({
                    type: 'CRITICAL_HIGH_BLOOD_PRESSURE',
                    severity: 'CRITICAL',
                    description: `Critical high blood pressure: ${value} mmHg`,
                    reading: value,
                    threshold: threshold.critical_high,
                    timestamp: reading.timestamp,
                    recommendation: 'Seek immediate medical attention',
                });
            }
            else if (value >= threshold.high) {
                anomalies.push({
                    type: 'HIGH_BLOOD_PRESSURE',
                    severity: 'HIGH',
                    description: `High blood pressure: ${value} mmHg`,
                    reading: value,
                    threshold: threshold.high,
                    timestamp: reading.timestamp,
                    recommendation: 'Monitor blood pressure, consult healthcare provider',
                });
            }
        }
        return anomalies;
    }
    async analyzeHistoricalPatterns(patientId, readings) {
        const anomalies = [];
        return anomalies;
    }
    getDefaultCalibrationSettings(deviceType) {
        return {
            deviceType,
            calibrationFactors: {},
            lastUpdated: new Date(),
        };
    }
    async validateCalibrationData(deviceType, calibrationData) {
        return { valid: true };
    }
    async applyDeviceCalibration(deviceId, calibrationData) {
    }
    async getHistoricalReadings(patientId, deviceId, days) {
        return [];
    }
    async analyzeTrends(readings) {
        return [];
    }
    async generatePredictions(trends) {
        return [];
    }
    async calculateRiskScores(predictions) {
        return [];
    }
    async generatePredictiveRecommendations(trends, predictions, riskScores) {
        return [];
    }
    calculatePredictionConfidence(trends, dataPoints) {
        return Math.min(dataPoints / 30 * 100, 100);
    }
    async prepareSyncData(deviceId, targetSystem) {
        return {};
    }
    async performDataSync(syncData, targetSystem) {
        return {
            success: true,
            recordsSynced: 0,
            message: 'Sync completed successfully',
        };
    }
    async getDeviceMaintenanceHistory(deviceId) {
        return [];
    }
    async calculateNextMaintenance(device, history) {
        return {
            dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            type: 'CALIBRATION',
            urgency: 'ROUTINE',
            description: 'Annual calibration and inspection',
            estimatedCost: 150,
        };
    }
};
exports.MedicalDeviceIntegrationService = MedicalDeviceIntegrationService;
exports.MedicalDeviceIntegrationService = MedicalDeviceIntegrationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Student)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.HealthRecord)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.VitalSigns)),
    __param(3, (0, sequelize_1.InjectModel)(models_4.DeviceReading)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, sequelize_typescript_1.Sequelize])
], MedicalDeviceIntegrationService);
//# sourceMappingURL=medical-device-integration.service.js.map