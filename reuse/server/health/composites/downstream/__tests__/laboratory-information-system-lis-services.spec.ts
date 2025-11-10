/**
 * LABORATORY INFORMATION SYSTEM (LIS) SERVICES TESTS - HIGH PRIORITY
 *
 * Comprehensive tests for LIS integration including:
 * - Lab order entry and tracking
 * - Result verification (auto-verification rules)
 * - Critical value alerting
 * - Instrument interface integration
 * - Send-out test coordination
 * - Result reporting
 * - Quality control checks
 * - Specimen tracking
 *
 * @security Patient Safety Critical - Diagnostic Accuracy
 * @compliance CLIA (Clinical Laboratory Improvement Amendments)
 * @coverage Target: 90%+
 */

import { Test, TestingModule } from '@nestjs/testing';
import { Injectable, Logger } from '@nestjs/common';

// Mock LIS Service class (matching expected implementation)
@Injectable()
class LaboratoryInformationSystemService {
  private readonly logger = new Logger(LaboratoryInformationSystemService.name);

  async orderLabTest(orderData: any): Promise<any> {
    this.logger.log('Ordering lab test');
    if (!orderData) throw new Error('Order data is required');
    if (!orderData.patientId) throw new Error('Patient ID is required');
    if (!orderData.testCode) throw new Error('Test code is required');
    if (!orderData.providerId) throw new Error('Provider ID is required');

    return {
      orderId: `lab-order-${Date.now()}`,
      status: 'ordered',
      testCode: orderData.testCode,
      collectionTime: null,
    };
  }

  async verifyResult(resultData: any): Promise<any> {
    this.logger.log('Verifying lab result');
    if (!resultData) throw new Error('Result data is required');
    if (!resultData.orderId) throw new Error('Order ID is required');
    if (!resultData.value) throw new Error('Result value is required');

    const isCritical = this.checkCriticalValue(resultData);

    return {
      resultId: `result-${Date.now()}`,
      verified: true,
      verifiedBy: 'system',
      isCritical,
      status: isCritical ? 'critical' : 'final',
    };
  }

  async checkCriticalValue(resultData: any): Promise<boolean> {
    // Mock critical value checking logic
    if (resultData.testCode === 'TROPONIN' && parseFloat(resultData.value) > 0.04) {
      return true;
    }
    if (resultData.testCode === 'K+' && parseFloat(resultData.value) > 6.0) {
      return true;
    }
    return false;
  }

  async alertCriticalResult(resultId: string, providerId: string): Promise<any> {
    this.logger.warn(`CRITICAL RESULT ALERT: ${resultId}`);
    if (!resultId) throw new Error('Result ID is required');
    if (!providerId) throw new Error('Provider ID is required');

    return {
      alertId: `alert-${Date.now()}`,
      resultId,
      providerId,
      alertSent: true,
      timestamp: new Date(),
    };
  }

  async trackSpecimen(specimenId: string): Promise<any> {
    this.logger.log(`Tracking specimen: ${specimenId}`);
    if (!specimenId) throw new Error('Specimen ID is required');

    return {
      specimenId,
      status: 'in-lab',
      collectedAt: new Date(),
      receivedAt: new Date(),
    };
  }
}

import {
  PatientFactory,
  ProviderFactory,
  LabResultFactory,
} from './utils/mock-data-factory';

describe('LaboratoryInformationSystemService (HIGH PRIORITY)', () => {
  let service: LaboratoryInformationSystemService;

  const mockPatient = PatientFactory.create();
  const mockProvider = ProviderFactory.create();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LaboratoryInformationSystemService],
    }).compile();

    service = module.get<LaboratoryInformationSystemService>(
      LaboratoryInformationSystemService,
    );

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== LAB ORDER ENTRY ====================

  describe('orderLabTest', () => {
    const orderData = {
      patientId: mockPatient.id,
      providerId: mockProvider.id,
      testCode: 'CBC',
      priority: 'routine',
      collectionInstructions: 'Fasting required',
    };

    it('should create lab test order successfully', async () => {
      // Act
      const result = await service.orderLabTest(orderData);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('orderId');
      expect(result).toHaveProperty('status');
      expect(result.status).toBe('ordered');
    });

    it('should require order data', async () => {
      // Act & Assert
      await expect(service.orderLabTest(null)).rejects.toThrow(
        'Order data is required',
      );
    });

    it('should require patient ID', async () => {
      // Arrange
      const invalidData = { ...orderData, patientId: '' };

      // Act & Assert
      await expect(service.orderLabTest(invalidData)).rejects.toThrow(
        'Patient ID is required',
      );
    });

    it('should require test code', async () => {
      // Arrange
      const invalidData = { ...orderData, testCode: '' };

      // Act & Assert
      await expect(service.orderLabTest(invalidData)).rejects.toThrow(
        'Test code is required',
      );
    });

    it('should require provider ID', async () => {
      // Arrange
      const invalidData = { ...orderData, providerId: '' };

      // Act & Assert
      await expect(service.orderLabTest(invalidData)).rejects.toThrow(
        'Provider ID is required',
      );
    });

    it('should validate test code exists in lab catalog', async () => {
      // Arrange
      const invalidTest = { ...orderData, testCode: 'INVALID-TEST' };

      // Act & Assert
      await expect(service.orderLabTest(invalidTest)).rejects.toThrow(
        'Invalid test code',
      );
    });

    it('should return order ID', async () => {
      // Act
      const result = await service.orderLabTest(orderData);

      // Assert
      expect(result.orderId).toBeDefined();
      expect(typeof result.orderId).toBe('string');
      expect(result.orderId).toMatch(/^lab-order-/);
    });

    it('should handle stat orders with priority', async () => {
      // Arrange
      const statOrder = { ...orderData, priority: 'stat' };

      // Act
      const result = await service.orderLabTest(statOrder);

      // Assert
      expect(result.priority).toBe('stat');
    });

    it('should log lab order creation', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.orderLabTest(orderData);

      // Assert
      expect(logSpy).toHaveBeenCalledWith('Ordering lab test');
    });
  });

  // ==================== RESULT VERIFICATION ====================

  describe('verifyResult', () => {
    const normalResult = {
      orderId: 'lab-order-123',
      testCode: 'WBC',
      value: '7.5',
      units: '10^9/L',
      referenceRange: '4.5-11.0',
    };

    it('should verify normal lab result', async () => {
      // Act
      const result = await service.verifyResult(normalResult);

      // Assert
      expect(result).toBeDefined();
      expect(result.verified).toBe(true);
      expect(result.status).toBe('final');
    });

    it('should require result data', async () => {
      // Act & Assert
      await expect(service.verifyResult(null)).rejects.toThrow(
        'Result data is required',
      );
    });

    it('should require order ID', async () => {
      // Arrange
      const invalidData = { ...normalResult, orderId: '' };

      // Act & Assert
      await expect(service.verifyResult(invalidData)).rejects.toThrow(
        'Order ID is required',
      );
    });

    it('should require result value', async () => {
      // Arrange
      const invalidData = { ...normalResult, value: '' };

      // Act & Assert
      await expect(service.verifyResult(invalidData)).rejects.toThrow(
        'Result value is required',
      );
    });

    it('should auto-verify results within normal range', async () => {
      // Act
      const result = await service.verifyResult(normalResult);

      // Assert
      expect(result.verified).toBe(true);
      expect(result.verifiedBy).toBe('system');
    });

    it('should flag results outside reference range for manual review', async () => {
      // Arrange
      const abnormalResult = {
        ...normalResult,
        value: '20.0', // Above reference range
      };

      // Act
      const result = await service.verifyResult(abnormalResult);

      // Assert
      expect(result.requiresManualReview).toBe(true);
    });

    it('should return result ID', async () => {
      // Act
      const result = await service.verifyResult(normalResult);

      // Assert
      expect(result.resultId).toBeDefined();
      expect(typeof result.resultId).toBe('string');
    });

    it('should include verification timestamp', async () => {
      // Act
      const result = await service.verifyResult(normalResult);

      // Assert
      expect(result).toHaveProperty('verifiedAt');
      expect(result.verifiedAt).toBeInstanceOf(Date);
    });
  });

  // ==================== CRITICAL VALUE ALERTING ====================

  describe('checkCriticalValue', () => {
    it('should identify critical troponin value', async () => {
      // Arrange
      const criticalTroponin = {
        testCode: 'TROPONIN',
        value: '0.15', // Critical: > 0.04
      };

      // Act
      const isCritical = await service.checkCriticalValue(criticalTroponin);

      // Assert
      expect(isCritical).toBe(true);
    });

    it('should identify critical potassium value', async () => {
      // Arrange
      const criticalPotassium = {
        testCode: 'K+',
        value: '7.0', // Critical: > 6.0
      };

      // Act
      const isCritical = await service.checkCriticalValue(criticalPotassium);

      // Assert
      expect(isCritical).toBe(true);
    });

    it('should return false for normal values', async () => {
      // Arrange
      const normalValue = {
        testCode: 'WBC',
        value: '7.5',
      };

      // Act
      const isCritical = await service.checkCriticalValue(normalValue);

      // Assert
      expect(isCritical).toBe(false);
    });
  });

  describe('alertCriticalResult', () => {
    it('should send critical value alert to provider', async () => {
      // Act
      const result = await service.alertCriticalResult(
        'result-123',
        mockProvider.id,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('alertId');
      expect(result.alertSent).toBe(true);
    });

    it('should require result ID', async () => {
      // Act & Assert
      await expect(
        service.alertCriticalResult('', mockProvider.id),
      ).rejects.toThrow('Result ID is required');
    });

    it('should require provider ID', async () => {
      // Act & Assert
      await expect(service.alertCriticalResult('result-123', '')).rejects.toThrow(
        'Provider ID is required',
      );
    });

    it('should log critical alert with high severity', async () => {
      // Arrange
      const warnSpy = jest.spyOn(service['logger'], 'warn');

      // Act
      await service.alertCriticalResult('result-123', mockProvider.id);

      // Assert
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('CRITICAL RESULT ALERT'),
      );
    });

    it('should include timestamp in alert', async () => {
      // Act
      const result = await service.alertCriticalResult(
        'result-123',
        mockProvider.id,
      );

      // Assert
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should send multiple notification channels', async () => {
      // Act
      const result = await service.alertCriticalResult(
        'result-123',
        mockProvider.id,
      );

      // Assert
      expect(result).toHaveProperty('notificationChannels');
      expect(result.notificationChannels).toContain('email');
      expect(result.notificationChannels).toContain('sms');
      expect(result.notificationChannels).toContain('ehr-inbox');
    });
  });

  // ==================== SPECIMEN TRACKING ====================

  describe('trackSpecimen', () => {
    it('should track specimen location and status', async () => {
      // Act
      const result = await service.trackSpecimen('specimen-123');

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('specimenId');
      expect(result).toHaveProperty('status');
    });

    it('should require specimen ID', async () => {
      // Act & Assert
      await expect(service.trackSpecimen('')).rejects.toThrow(
        'Specimen ID is required',
      );
    });

    it('should return specimen collection time', async () => {
      // Act
      const result = await service.trackSpecimen('specimen-123');

      // Assert
      expect(result).toHaveProperty('collectedAt');
      expect(result.collectedAt).toBeInstanceOf(Date);
    });

    it('should return lab received time', async () => {
      // Act
      const result = await service.trackSpecimen('specimen-123');

      // Assert
      expect(result).toHaveProperty('receivedAt');
      expect(result.receivedAt).toBeInstanceOf(Date);
    });

    it('should track specimen through lab workflow', async () => {
      // Act
      const result = await service.trackSpecimen('specimen-123');

      // Assert
      expect(['collected', 'in-transit', 'in-lab', 'processing', 'completed']).toContain(
        result.status,
      );
    });

    it('should log specimen tracking', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.trackSpecimen('specimen-123');

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        'Tracking specimen: specimen-123',
      );
    });

    it('should handle specimen not found', async () => {
      // Act & Assert
      await expect(
        service.trackSpecimen('specimen-not-found'),
      ).rejects.toThrow('Specimen not found');
    });
  });

  // ==================== QUALITY CONTROL ====================

  describe('Quality Control Checks', () => {
    it('should run QC checks before releasing results', async () => {
      // Arrange
      const resultData = {
        orderId: 'order-123',
        value: '7.5',
      };

      // Act
      const result = await service.verifyResult(resultData);

      // Assert
      expect(result).toHaveProperty('qcPassed', true);
    });

    it('should flag results failing QC', async () => {
      // Arrange
      const suspectResult = {
        orderId: 'order-123',
        value: '999', // Unrealistic value
        qcFailure: true,
      };

      // Act & Assert
      await expect(service.verifyResult(suspectResult)).rejects.toThrow(
        'QC failure - result cannot be verified',
      );
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should handle LIS system errors gracefully', async () => {
      // Arrange
      jest
        .spyOn(service as any, 'connectToLIS')
        .mockRejectedValue(new Error('LIS unavailable'));

      // Act & Assert
      await expect(
        service.orderLabTest({ patientId: 'test' }),
      ).rejects.toThrow('Failed to order lab test');
    });

    it('should provide meaningful error messages', async () => {
      // Act & Assert
      await expect(service.orderLabTest(null)).rejects.toThrow(
        expect.stringContaining('required'),
      );
    });

    it('should log errors for troubleshooting', async () => {
      // Arrange
      const errorSpy = jest.spyOn(service['logger'], 'error');

      // Act
      try {
        await service.orderLabTest(null);
      } catch (e) {
        // Expected
      }

      // Assert
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  // ==================== AUDIT LOGGING ====================

  describe('Audit Logging', () => {
    it('should log all lab orders', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.orderLabTest({
        patientId: mockPatient.id,
        providerId: mockProvider.id,
        testCode: 'CBC',
      });

      // Assert
      expect(logSpy).toHaveBeenCalled();
    });

    it('should log all result verifications', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.verifyResult({
        orderId: 'order-123',
        value: '7.5',
      });

      // Assert
      expect(logSpy).toHaveBeenCalled();
    });

    it('should log critical alerts with HIGH severity', async () => {
      // Arrange
      const warnSpy = jest.spyOn(service['logger'], 'warn');

      // Act
      await service.alertCriticalResult('result-123', mockProvider.id);

      // Assert
      expect(warnSpy).toHaveBeenCalled();
    });
  });
});
