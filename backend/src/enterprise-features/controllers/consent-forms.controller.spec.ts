import { Test, TestingModule } from '@nestjs/testing';
import { ConsentFormsController } from './consent-forms.controller';
import { ConsentFormManagementService } from '../consent-form-management.service';
import {
  ConsentFormResponseDto,
  CreateConsentFormDto,
  RenewConsentFormDto,
  RevokeConsentDto,
  SignFormDto,
  VerifySignatureDto,
} from '../dto';

describe('ConsentFormsController', () => {
  let controller: ConsentFormsController;
  let service: jest.Mocked<ConsentFormManagementService>;

  const mockConsentFormService = {
    createConsentForm: jest.fn(),
    signForm: jest.fn(),
    verifySignature: jest.fn(),
    revokeConsent: jest.fn(),
    renewConsentForm: jest.fn(),
    getConsentFormsByStudent: jest.fn(),
    getConsentFormHistory: jest.fn(),
    sendReminderForUnsignedForms: jest.fn(),
    generateConsentFormTemplate: jest.fn(),
    checkFormsExpiringSoon: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsentFormsController],
      providers: [
        {
          provide: ConsentFormManagementService,
          useValue: mockConsentFormService,
        },
      ],
    }).compile();

    controller = module.get<ConsentFormsController>(ConsentFormsController);
    service = module.get(ConsentFormManagementService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createConsentForm', () => {
    it('should create consent form successfully', async () => {
      const dto: CreateConsentFormDto = {
        studentId: '123e4567-e89b-12d3-a456-426614174000',
        formType: 'MEDICAL_TREATMENT',
        content: 'Consent form content',
        expiresAt: '2025-12-31T00:00:00.000Z',
      };

      const expectedResult: Partial<ConsentFormResponseDto> = {
        id: 'form-123',
        studentId: dto.studentId,
        formType: dto.formType,
        content: dto.content,
        status: 'UNSIGNED',
      };

      mockConsentFormService.createConsentForm.mockResolvedValue(expectedResult);

      const result = await controller.createConsentForm(dto);

      expect(service.createConsentForm).toHaveBeenCalledWith(
        dto.studentId,
        dto.formType,
        dto.content,
        new Date(dto.expiresAt),
      );
      expect(result).toEqual(expectedResult);
    });

    it('should create consent form without expiration date', async () => {
      const dto: CreateConsentFormDto = {
        studentId: '123e4567-e89b-12d3-a456-426614174000',
        formType: 'PHOTO_RELEASE',
        content: 'Photo release content',
      };

      mockConsentFormService.createConsentForm.mockResolvedValue({} as ConsentFormResponseDto);

      await controller.createConsentForm(dto);

      expect(service.createConsentForm).toHaveBeenCalledWith(
        dto.studentId,
        dto.formType,
        dto.content,
        undefined,
      );
    });

    it('should handle service errors', async () => {
      const dto: CreateConsentFormDto = {
        studentId: 'invalid-id',
        formType: 'MEDICAL_TREATMENT',
        content: 'Content',
      };

      mockConsentFormService.createConsentForm.mockRejectedValue(
        new Error('Student not found'),
      );

      await expect(controller.createConsentForm(dto)).rejects.toThrow('Student not found');
    });
  });

  describe('signForm', () => {
    it('should sign form successfully', async () => {
      const formId = 'form-123';
      const dto: SignFormDto = {
        signedBy: 'parent-456',
        signature: 'base64-signature-data',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
      };

      const expectedResult = { success: true };
      mockConsentFormService.signForm.mockResolvedValue(expectedResult);

      const result = await controller.signForm(formId, dto);

      expect(service.signForm).toHaveBeenCalledWith(
        formId,
        dto.signedBy,
        dto.signature,
        dto.ipAddress,
        dto.userAgent,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle invalid form ID', async () => {
      const formId = 'nonexistent-form';
      const dto: SignFormDto = {
        signedBy: 'parent-456',
        signature: 'signature',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
      };

      mockConsentFormService.signForm.mockRejectedValue(new Error('Form not found'));

      await expect(controller.signForm(formId, dto)).rejects.toThrow('Form not found');
    });
  });

  describe('verifySignature', () => {
    it('should verify signature successfully', async () => {
      const formId = 'form-123';
      const dto: VerifySignatureDto = {
        signature: 'base64-signature-data',
      };

      const expectedResult = { valid: true, verified: true };
      mockConsentFormService.verifySignature.mockResolvedValue(expectedResult);

      const result = await controller.verifySignature(formId, dto);

      expect(service.verifySignature).toHaveBeenCalledWith(formId, dto.signature);
      expect(result).toEqual(expectedResult);
    });

    it('should return invalid for mismatched signature', async () => {
      const formId = 'form-123';
      const dto: VerifySignatureDto = {
        signature: 'wrong-signature',
      };

      const expectedResult = { valid: false, verified: false };
      mockConsentFormService.verifySignature.mockResolvedValue(expectedResult);

      const result = await controller.verifySignature(formId, dto);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('revokeConsent', () => {
    it('should revoke consent successfully', async () => {
      const formId = 'form-123';
      const dto: RevokeConsentDto = {
        revokedBy: 'parent-456',
        reason: 'Changed mind about medical treatment',
      };

      const expectedResult = { success: true, status: 'REVOKED' };
      mockConsentFormService.revokeConsent.mockResolvedValue(expectedResult);

      const result = await controller.revokeConsent(formId, dto);

      expect(service.revokeConsent).toHaveBeenCalledWith(formId, dto.revokedBy, dto.reason);
      expect(result).toEqual(expectedResult);
    });

    it('should handle already revoked form', async () => {
      const formId = 'form-123';
      const dto: RevokeConsentDto = {
        revokedBy: 'parent-456',
        reason: 'Duplicate revocation',
      };

      mockConsentFormService.revokeConsent.mockRejectedValue(
        new Error('Form already revoked'),
      );

      await expect(controller.revokeConsent(formId, dto)).rejects.toThrow(
        'Form already revoked',
      );
    });
  });

  describe('renewConsentForm', () => {
    it('should renew consent form successfully', async () => {
      const formId = 'form-123';
      const dto: RenewConsentFormDto = {
        extendedBy: 'admin-789',
        additionalYears: 2,
      };

      const expectedResult = {
        success: true,
        newExpirationDate: '2027-12-31T00:00:00.000Z',
      };
      mockConsentFormService.renewConsentForm.mockResolvedValue(expectedResult);

      const result = await controller.renewConsentForm(formId, dto);

      expect(service.renewConsentForm).toHaveBeenCalledWith(
        formId,
        dto.extendedBy,
        dto.additionalYears,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle renewal with zero years', async () => {
      const formId = 'form-123';
      const dto: RenewConsentFormDto = {
        extendedBy: 'admin-789',
        additionalYears: 0,
      };

      mockConsentFormService.renewConsentForm.mockRejectedValue(
        new Error('Additional years must be positive'),
      );

      await expect(controller.renewConsentForm(formId, dto)).rejects.toThrow(
        'Additional years must be positive',
      );
    });
  });

  describe('getConsentFormsByStudent', () => {
    it('should retrieve all consent forms for student', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedForms: Partial<ConsentFormResponseDto>[] = [
        { id: 'form-1', studentId, formType: 'MEDICAL_TREATMENT', status: 'SIGNED' },
        { id: 'form-2', studentId, formType: 'PHOTO_RELEASE', status: 'UNSIGNED' },
      ];

      mockConsentFormService.getConsentFormsByStudent.mockResolvedValue(expectedForms);

      const result = await controller.getConsentFormsByStudent(studentId);

      expect(service.getConsentFormsByStudent).toHaveBeenCalledWith(studentId, undefined);
      expect(result).toEqual(expectedForms);
    });

    it('should filter consent forms by status', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const status = 'SIGNED';
      const expectedForms: Partial<ConsentFormResponseDto>[] = [
        { id: 'form-1', studentId, formType: 'MEDICAL_TREATMENT', status: 'SIGNED' },
      ];

      mockConsentFormService.getConsentFormsByStudent.mockResolvedValue(expectedForms);

      const result = await controller.getConsentFormsByStudent(studentId, status);

      expect(service.getConsentFormsByStudent).toHaveBeenCalledWith(studentId, status);
      expect(result).toEqual(expectedForms);
    });

    it('should return empty array for student with no forms', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';

      mockConsentFormService.getConsentFormsByStudent.mockResolvedValue([]);

      const result = await controller.getConsentFormsByStudent(studentId);

      expect(result).toEqual([]);
    });
  });

  describe('getConsentFormHistory', () => {
    it('should retrieve form history successfully', async () => {
      const formId = 'form-123';
      const expectedHistory = {
        formId,
        changes: [
          { timestamp: '2025-01-01', action: 'CREATED', by: 'admin-1' },
          { timestamp: '2025-01-15', action: 'SIGNED', by: 'parent-456' },
        ],
      };

      mockConsentFormService.getConsentFormHistory.mockResolvedValue(expectedHistory);

      const result = await controller.getConsentFormHistory(formId);

      expect(service.getConsentFormHistory).toHaveBeenCalledWith(formId);
      expect(result).toEqual(expectedHistory);
    });

    it('should handle form with no history', async () => {
      const formId = 'form-123';

      mockConsentFormService.getConsentFormHistory.mockResolvedValue({ formId, changes: [] });

      const result = await controller.getConsentFormHistory(formId);

      expect(result.changes).toEqual([]);
    });
  });

  describe('sendReminderForUnsignedForms', () => {
    it('should send reminders successfully', async () => {
      const expectedResult = {
        remindersSent: 5,
        failedReminders: 0,
      };

      mockConsentFormService.sendReminderForUnsignedForms.mockResolvedValue(expectedResult);

      const result = await controller.sendReminderForUnsignedForms();

      expect(service.sendReminderForUnsignedForms).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should handle case with no unsigned forms', async () => {
      mockConsentFormService.sendReminderForUnsignedForms.mockResolvedValue({
        remindersSent: 0,
        failedReminders: 0,
      });

      const result = await controller.sendReminderForUnsignedForms();

      expect(result.remindersSent).toBe(0);
    });
  });

  describe('generateConsentFormTemplate', () => {
    it('should generate template successfully', async () => {
      const formType = 'MEDICAL_TREATMENT';
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedTemplate = {
        formType,
        studentId,
        template: 'Generated template content with student-specific data',
        fields: ['studentName', 'parentName', 'treatmentType'],
      };

      mockConsentFormService.generateConsentFormTemplate.mockResolvedValue(expectedTemplate);

      const result = await controller.generateConsentFormTemplate(formType, studentId);

      expect(service.generateConsentFormTemplate).toHaveBeenCalledWith(formType, studentId);
      expect(result).toEqual(expectedTemplate);
    });

    it('should handle invalid form type', async () => {
      const formType = 'INVALID_TYPE';
      const studentId = '123e4567-e89b-12d3-a456-426614174000';

      mockConsentFormService.generateConsentFormTemplate.mockRejectedValue(
        new Error('Invalid form type'),
      );

      await expect(
        controller.generateConsentFormTemplate(formType, studentId),
      ).rejects.toThrow('Invalid form type');
    });
  });

  describe('checkFormsExpiringSoon', () => {
    it('should retrieve expiring forms with default days', async () => {
      const expectedForms: Partial<ConsentFormResponseDto>[] = [
        {
          id: 'form-1',
          formType: 'MEDICAL_TREATMENT',
          expiresAt: new Date('2025-02-15'),
          daysUntilExpiration: 25,
        },
      ];

      mockConsentFormService.checkFormsExpiringSoon.mockResolvedValue(expectedForms);

      const result = await controller.checkFormsExpiringSoon();

      expect(service.checkFormsExpiringSoon).toHaveBeenCalledWith(30);
      expect(result).toEqual(expectedForms);
    });

    it('should retrieve expiring forms with custom days', async () => {
      const days = 60;
      const expectedForms: Partial<ConsentFormResponseDto>[] = [
        {
          id: 'form-1',
          formType: 'MEDICAL_TREATMENT',
          expiresAt: new Date('2025-03-15'),
          daysUntilExpiration: 50,
        },
        {
          id: 'form-2',
          formType: 'PHOTO_RELEASE',
          expiresAt: new Date('2025-02-28'),
          daysUntilExpiration: 35,
        },
      ];

      mockConsentFormService.checkFormsExpiringSoon.mockResolvedValue(expectedForms);

      const result = await controller.checkFormsExpiringSoon(days);

      expect(service.checkFormsExpiringSoon).toHaveBeenCalledWith(60);
      expect(result).toEqual(expectedForms);
    });

    it('should handle string days parameter', async () => {
      const days = '45';
      mockConsentFormService.checkFormsExpiringSoon.mockResolvedValue([]);

      await controller.checkFormsExpiringSoon(days as unknown as number);

      expect(service.checkFormsExpiringSoon).toHaveBeenCalledWith(45);
    });

    it('should return empty array when no forms expiring', async () => {
      mockConsentFormService.checkFormsExpiringSoon.mockResolvedValue([]);

      const result = await controller.checkFormsExpiringSoon();

      expect(result).toEqual([]);
    });
  });
});
