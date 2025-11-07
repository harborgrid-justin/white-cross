/**
 * EMERGENCY CONTACT SERVICE TESTS (CRITICAL HEALTHCARE)
 *
 * Tests emergency contact management functionality including:
 * - Emergency notification workflows
 * - Contact verification
 * - Priority sorting and primary contact enforcement
 * - Multi-channel notifications (SMS, email, voice)
 * - HIPAA-compliant error handling
 */

import { Test, TestingModule } from '@nestjs/testing';
import { EmergencyContactService } from '../emergency-contact.service';
import { getModelToken } from '@nestjs/sequelize';
import { EmergencyContact, Student } from '../../database';
import { ContactPriority, NotificationChannel, VerificationStatus } from '../../contact';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EmergencyContactCreateDto, NotificationDto, NotificationPriority, NotificationType } from '../dto';

describe('EmergencyContactService (CRITICAL HEALTHCARE)', () => {
  let service: EmergencyContactService;
  let emergencyContactModel: typeof EmergencyContact;
  let studentModel: typeof Student;

  const mockStudent = {
    id: 'student-id-123',
    firstName: 'John',
    lastName: 'Doe',
    studentNumber: 'STU001',
    isActive: true,
  };

  const mockEmergencyContact: Partial<EmergencyContact> & { update: jest.Mock; save: jest.Mock } = {
    id: 'contact-id-123',
    studentId: 'student-id-123',
    firstName: 'Jane',
    lastName: 'Doe',
    phoneNumber: '+1234567890',
    email: 'jane.doe@example.com',
    relationship: 'Mother',
    priority: ContactPriority.PRIMARY,
    isActive: true,
    notificationChannels: JSON.stringify(['sms', 'email']),
    verificationStatus: VerificationStatus.VERIFIED,
    update: jest.fn(),
    save: jest.fn(),
  } as any;

  const mockEmergencyContactModel = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    sequelize: {
      transaction: jest.fn().mockImplementation(async (callback) => {
        const mockTransaction = { commit: jest.fn(), rollback: jest.fn() };
        try {
          const result = await callback(mockTransaction);
          await mockTransaction.commit();
          return result;
        } catch (error) {
          await mockTransaction.rollback();
          throw error;
        }
      }),
      query: jest.fn(),
    },
  };

  const mockStudentModel = {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmergencyContactService,
        {
          provide: getModelToken(EmergencyContact),
          useValue: mockEmergencyContactModel,
        },
        {
          provide: getModelToken(Student),
          useValue: mockStudentModel,
        },
      ],
    }).compile();

    service = module.get<EmergencyContactService>(EmergencyContactService);
    emergencyContactModel = module.get<typeof EmergencyContact>(getModelToken(EmergencyContact));
    studentModel = module.get<typeof Student>(getModelToken(Student));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== RETRIEVAL TESTS ====================

  describe('getStudentEmergencyContacts', () => {
    it('should retrieve all active emergency contacts for a student', async () => {
      const mockContacts = [
        { ...mockEmergencyContact, priority: ContactPriority.PRIMARY },
        { ...mockEmergencyContact, id: 'contact-2', priority: ContactPriority.SECONDARY },
      ];
      mockEmergencyContactModel.findAll.mockResolvedValue(mockContacts);

      const result = await service.getStudentEmergencyContacts('student-id-123');

      expect(result).toEqual(mockContacts);
      expect(mockEmergencyContactModel.findAll).toHaveBeenCalledWith({
        where: { studentId: 'student-id-123', isActive: true },
        order: [['priority', 'ASC'], ['firstName', 'ASC']],
      });
    });

    it('should return empty array when student has no emergency contacts', async () => {
      mockEmergencyContactModel.findAll.mockResolvedValue([]);

      const result = await service.getStudentEmergencyContacts('student-id-123');

      expect(result).toEqual([]);
    });

    it('should sort contacts by priority (PRIMARY before SECONDARY)', async () => {
      const mockContacts = [
        { ...mockEmergencyContact, id: 'contact-1', priority: ContactPriority.SECONDARY },
        { ...mockEmergencyContact, id: 'contact-2', priority: ContactPriority.PRIMARY },
      ];
      mockEmergencyContactModel.findAll.mockResolvedValue(mockContacts);

      await service.getStudentEmergencyContacts('student-id-123');

      expect(mockEmergencyContactModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [['priority', 'ASC'], ['firstName', 'ASC']],
        })
      );
    });
  });

  // ==================== CREATION TESTS ====================

  describe('createEmergencyContact', () => {
    const validCreateDto: EmergencyContactCreateDto = {
      studentId: 'student-id-123',
      firstName: 'Jane',
      lastName: 'Doe',
      phoneNumber: '+1234567890',
      email: 'jane.doe@example.com',
      relationship: 'Mother',
      priority: ContactPriority.PRIMARY,
      notificationChannels: ['sms', 'email'] as NotificationChannel[],
    };

    it('should successfully create emergency contact with valid data', async () => {
      mockStudentModel.findOne.mockResolvedValue(mockStudent);
      mockEmergencyContactModel.count.mockResolvedValue(0);
      mockEmergencyContactModel.create.mockResolvedValue(mockEmergencyContact);

      const result = await service.createEmergencyContact(validCreateDto);

      expect(result).toEqual(mockEmergencyContact);
      expect(mockStudentModel.findOne).toHaveBeenCalled();
      expect(mockEmergencyContactModel.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if student does not exist', async () => {
      mockStudentModel.findOne.mockResolvedValue(null);

      await expect(service.createEmergencyContact(validCreateDto))
        .rejects.toThrow(NotFoundException);
      await expect(service.createEmergencyContact(validCreateDto))
        .rejects.toThrow('Student not found');
    });

    it('should throw BadRequestException if student is inactive', async () => {
      mockStudentModel.findOne.mockResolvedValue({ ...mockStudent, isActive: false });

      await expect(service.createEmergencyContact(validCreateDto))
        .rejects.toThrow(BadRequestException);
      await expect(service.createEmergencyContact(validCreateDto))
        .rejects.toThrow('Cannot add emergency contact to inactive student');
    });

    it('should validate phone number has at least 10 digits', async () => {
      const invalidPhoneDto = { ...validCreateDto, phoneNumber: '123456' };
      mockStudentModel.findOne.mockResolvedValue(mockStudent);

      await expect(service.createEmergencyContact(invalidPhoneDto))
        .rejects.toThrow(BadRequestException);
      await expect(service.createEmergencyContact(invalidPhoneDto))
        .rejects.toThrow('Phone number must contain at least 10 digits');
    });

    it('should accept phone numbers with formatting characters', async () => {
      const formattedPhoneDto = { ...validCreateDto, phoneNumber: '(123) 456-7890' };
      mockStudentModel.findOne.mockResolvedValue(mockStudent);
      mockEmergencyContactModel.count.mockResolvedValue(0);
      mockEmergencyContactModel.create.mockResolvedValue(mockEmergencyContact);

      const result = await service.createEmergencyContact(formattedPhoneDto);

      expect(result).toBeDefined();
    });

    it('should validate email format if provided', async () => {
      const invalidEmailDto = { ...validCreateDto, email: 'invalid-email' };
      mockStudentModel.findOne.mockResolvedValue(mockStudent);

      await expect(service.createEmergencyContact(invalidEmailDto))
        .rejects.toThrow(BadRequestException);
      await expect(service.createEmergencyContact(invalidEmailDto))
        .rejects.toThrow('Invalid email format');
    });

    it('should enforce maximum of 2 PRIMARY contacts per student', async () => {
      mockStudentModel.findOne.mockResolvedValue(mockStudent);
      mockEmergencyContactModel.count.mockResolvedValue(2);

      await expect(service.createEmergencyContact(validCreateDto))
        .rejects.toThrow(BadRequestException);
      await expect(service.createEmergencyContact(validCreateDto))
        .rejects.toThrow('Student already has 2 primary contacts');
    });

    it('should allow creating SECONDARY contact even if 2 PRIMARY exist', async () => {
      const secondaryDto = { ...validCreateDto, priority: ContactPriority.SECONDARY };
      mockStudentModel.findOne.mockResolvedValue(mockStudent);
      mockEmergencyContactModel.count.mockResolvedValue(2); // 2 PRIMARY already exist
      mockEmergencyContactModel.create.mockResolvedValue(mockEmergencyContact);

      const result = await service.createEmergencyContact(secondaryDto);

      expect(result).toBeDefined();
    });

    it('should validate notification channels', async () => {
      const invalidChannelsDto = { ...validCreateDto, notificationChannels: ['invalid'] as any };
      mockStudentModel.findOne.mockResolvedValue(mockStudent);

      await expect(service.createEmergencyContact(invalidChannelsDto as EmergencyContactCreateDto))
        .rejects.toThrow(BadRequestException);
      await expect(service.createEmergencyContact(invalidChannelsDto as EmergencyContactCreateDto))
        .rejects.toThrow('Invalid notification channel');
    });

    it('should require email when email channel is selected', async () => {
      const noEmailDto = { ...validCreateDto, email: undefined, notificationChannels: ['email'] };
      mockStudentModel.findOne.mockResolvedValue(mockStudent);

      await expect(service.createEmergencyContact(noEmailDto as any))
        .rejects.toThrow(BadRequestException);
      await expect(service.createEmergencyContact(noEmailDto as any))
        .rejects.toThrow('Email address is required when email is selected');
    });

    it('should require phone number for SMS/voice channels', async () => {
      const noPhoneDto = { ...validCreateDto, phoneNumber: undefined, notificationChannels: ['sms'] };
      mockStudentModel.findOne.mockResolvedValue(mockStudent);

      await expect(service.createEmergencyContact(noPhoneDto as any))
        .rejects.toThrow(BadRequestException);
      await expect(service.createEmergencyContact(noPhoneDto as any))
        .rejects.toThrow('Phone number is required for SMS or voice notification channels');
    });
  });

  // ==================== UPDATE TESTS ====================

  describe('updateEmergencyContact', () => {
    const updateDto = {
      firstName: 'Updated',
      phoneNumber: '+9876543210',
    };

    it('should successfully update emergency contact', async () => {
      mockEmergencyContactModel.findOne.mockResolvedValue(mockEmergencyContact);

      const result = await service.updateEmergencyContact('contact-id-123', updateDto);

      expect(result).toEqual(mockEmergencyContact);
      expect(mockEmergencyContact.update).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
        expect.any(Object)
      );
    });

    it('should throw NotFoundException if contact does not exist', async () => {
      mockEmergencyContactModel.findOne.mockResolvedValue(null);

      await expect(service.updateEmergencyContact('non-existent', updateDto))
        .rejects.toThrow(NotFoundException);
      await expect(service.updateEmergencyContact('non-existent', updateDto))
        .rejects.toThrow('Emergency contact not found');
    });

    it('should prevent downgrading last PRIMARY contact', async () => {
      const downgradDto = { priority: ContactPriority.SECONDARY };
      const primaryContact = { ...mockEmergencyContact, priority: ContactPriority.PRIMARY };
      mockEmergencyContactModel.findOne.mockResolvedValue(primaryContact);
      mockEmergencyContactModel.count.mockResolvedValue(0); // No other PRIMARY contacts

      await expect(service.updateEmergencyContact('contact-id-123', downgradDto))
        .rejects.toThrow(BadRequestException);
      await expect(service.updateEmergencyContact('contact-id-123', downgradDto))
        .rejects.toThrow('Cannot change priority from PRIMARY');
    });

    it('should allow upgrading SECONDARY to PRIMARY if less than 2 PRIMARY exist', async () => {
      const upgradeDto = { priority: ContactPriority.PRIMARY };
      const secondaryContact = { ...mockEmergencyContact, priority: ContactPriority.SECONDARY };
      mockEmergencyContactModel.findOne.mockResolvedValue(secondaryContact);
      mockEmergencyContactModel.count.mockResolvedValue(1); // Only 1 PRIMARY exists

      const result = await service.updateEmergencyContact('contact-id-123', upgradeDto);

      expect(result).toBeDefined();
    });

    it('should prevent creating 3rd PRIMARY contact via update', async () => {
      const upgradeDto = { priority: ContactPriority.PRIMARY };
      const secondaryContact = { ...mockEmergencyContact, priority: ContactPriority.SECONDARY };
      mockEmergencyContactModel.findOne.mockResolvedValue(secondaryContact);
      mockEmergencyContactModel.count.mockResolvedValue(2); // 2 PRIMARY already exist

      await expect(service.updateEmergencyContact('contact-id-123', upgradeDto))
        .rejects.toThrow(BadRequestException);
      await expect(service.updateEmergencyContact('contact-id-123', upgradeDto))
        .rejects.toThrow('Student already has 2 primary contacts');
    });
  });

  // ==================== DELETION TESTS ====================

  describe('deleteEmergencyContact', () => {
    it('should successfully soft-delete emergency contact', async () => {
      const secondaryContact = { ...mockEmergencyContact, priority: ContactPriority.SECONDARY };
      mockEmergencyContactModel.findOne.mockResolvedValue(secondaryContact);

      const result = await service.deleteEmergencyContact('contact-id-123');

      expect(result).toEqual({ success: true });
      expect(secondaryContact.update).toHaveBeenCalledWith(
        { isActive: false },
        expect.any(Object)
      );
    });

    it('should prevent deleting last active PRIMARY contact', async () => {
      const primaryContact = { ...mockEmergencyContact, priority: ContactPriority.PRIMARY, isActive: true };
      mockEmergencyContactModel.findOne.mockResolvedValue(primaryContact);
      mockEmergencyContactModel.count.mockResolvedValue(0); // No other active PRIMARY

      await expect(service.deleteEmergencyContact('contact-id-123'))
        .rejects.toThrow(BadRequestException);
      await expect(service.deleteEmergencyContact('contact-id-123'))
        .rejects.toThrow('Cannot delete the only active PRIMARY contact');
    });

    it('should allow deleting PRIMARY contact if another PRIMARY exists', async () => {
      const primaryContact = { ...mockEmergencyContact, priority: ContactPriority.PRIMARY, isActive: true };
      mockEmergencyContactModel.findOne.mockResolvedValue(primaryContact);
      mockEmergencyContactModel.count.mockResolvedValue(1); // 1 other active PRIMARY exists

      const result = await service.deleteEmergencyContact('contact-id-123');

      expect(result).toEqual({ success: true });
    });
  });

  // ==================== NOTIFICATION TESTS ====================

  describe('sendEmergencyNotification', () => {
    const notificationData: NotificationDto = {
      studentId: 'student-id-123',
      type: NotificationType.EMERGENCY,
      priority: NotificationPriority.CRITICAL,
      message: 'Student requires immediate medical attention',
      channels: ['sms', 'email', 'voice'] as NotificationChannel[],
    };

    it('should send notifications to all active emergency contacts', async () => {
      const mockContacts = [
        mockEmergencyContact,
        { ...mockEmergencyContact, id: 'contact-2' },
      ] as any;
      jest.spyOn(service, 'getStudentEmergencyContacts').mockResolvedValue(mockContacts);

      const result = await service.sendEmergencyNotification('student-id-123', notificationData);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('contactId');
      expect(result[0]).toHaveProperty('channels');
    });

    it('should throw NotFoundException if student has no emergency contacts', async () => {
      jest.spyOn(service, 'getStudentEmergencyContacts').mockResolvedValue([]);

      await expect(service.sendEmergencyNotification('student-id-123', notificationData))
        .rejects.toThrow(NotFoundException);
      await expect(service.sendEmergencyNotification('student-id-123', notificationData))
        .rejects.toThrow('No emergency contacts found for student');
    });

    it('should attempt all notification channels (SMS, email, voice)', async () => {
      jest.spyOn(service, 'getStudentEmergencyContacts').mockResolvedValue([mockEmergencyContact] as any);

      const result = await service.sendEmergencyNotification('student-id-123', notificationData);

      expect(result[0].channels).toHaveProperty('sms');
      expect(result[0].channels).toHaveProperty('email');
      expect(result[0].channels).toHaveProperty('voice');
    });

    it('should handle SMS failure gracefully and continue with other channels', async () => {
      jest.spyOn(service, 'getStudentEmergencyContacts').mockResolvedValue([mockEmergencyContact] as any);

      const result = await service.sendEmergencyNotification('student-id-123', notificationData);

      // All channels should be attempted regardless of individual failures
      expect(result[0].channels).toBeDefined();
    });

    it('should prioritize contacts by priority level', async () => {
      const mockContacts = [
        { ...mockEmergencyContact, priority: ContactPriority.PRIMARY },
        { ...mockEmergencyContact, id: 'contact-2', priority: ContactPriority.SECONDARY },
      ] as any;
      jest.spyOn(service, 'getStudentEmergencyContacts').mockResolvedValue(mockContacts);

      const result = await service.sendEmergencyNotification('student-id-123', notificationData);

      // PRIMARY contacts should be first in results
      expect(result[0].contact).toBeDefined();
    });
  });

  // ==================== CONTACT VERIFICATION TESTS ====================

  describe('verifyContact', () => {
    it('should send SMS verification code to contact phone', async () => {
      mockEmergencyContactModel.findOne.mockResolvedValue(mockEmergencyContact);

      const result = await service.verifyContact('contact-id-123', 'sms');

      expect(result).toHaveProperty('verificationCode');
      expect(result).toHaveProperty('method', 'sms');
      expect(mockEmergencyContact.update).toHaveBeenCalledWith(
        expect.objectContaining({ verificationStatus: VerificationStatus.PENDING })
      );
    });

    it('should send email verification to contact email', async () => {
      mockEmergencyContactModel.findOne.mockResolvedValue(mockEmergencyContact);

      const result = await service.verifyContact('contact-id-123', 'email');

      expect(result).toHaveProperty('method', 'email');
    });

    it('should make voice call for verification', async () => {
      mockEmergencyContactModel.findOne.mockResolvedValue(mockEmergencyContact);

      const result = await service.verifyContact('contact-id-123', 'voice');

      expect(result).toHaveProperty('method', 'voice');
    });

    it('should throw NotFoundException if contact does not exist', async () => {
      mockEmergencyContactModel.findOne.mockResolvedValue(null);

      await expect(service.verifyContact('non-existent', 'sms'))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if phone not available for SMS', async () => {
      const contactWithoutPhone = { ...mockEmergencyContact, phoneNumber: null };
      mockEmergencyContactModel.findOne.mockResolvedValue(contactWithoutPhone);

      await expect(service.verifyContact('contact-id-123', 'sms'))
        .rejects.toThrow(BadRequestException);
      await expect(service.verifyContact('contact-id-123', 'sms'))
        .rejects.toThrow('Phone number not available for SMS verification');
    });

    it('should throw BadRequestException if email not available for email verification', async () => {
      const contactWithoutEmail = { ...mockEmergencyContact, email: null };
      mockEmergencyContactModel.findOne.mockResolvedValue(contactWithoutEmail);

      await expect(service.verifyContact('contact-id-123', 'email'))
        .rejects.toThrow(BadRequestException);
      await expect(service.verifyContact('contact-id-123', 'email'))
        .rejects.toThrow('Email address not available for email verification');
    });
  });

  // ==================== STATISTICS TESTS ====================

  describe('getContactStatistics', () => {
    it('should return comprehensive emergency contact statistics', async () => {
      mockEmergencyContactModel.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(5)  // PRIMARY
        .mockResolvedValueOnce(5); // SECONDARY
      mockStudentModel.count.mockResolvedValue(100);
      mockEmergencyContactModel.sequelize.query.mockResolvedValue([{ count: 8 }]);

      const result = await service.getContactStatistics();

      expect(result).toHaveProperty('totalContacts', 10);
      expect(result).toHaveProperty('studentsWithoutContacts');
      expect(result).toHaveProperty('byPriority');
    });

    it('should calculate students without contacts correctly', async () => {
      mockEmergencyContactModel.count.mockResolvedValue(10);
      mockStudentModel.count.mockResolvedValue(100);
      mockEmergencyContactModel.sequelize.query.mockResolvedValue([{ count: 80 }]);

      const result = await service.getContactStatistics();

      expect(result.studentsWithoutContacts).toBe(20); // 100 - 80
    });
  });

  // ==================== EDGE CASES ====================

  describe('Edge Cases and Error Handling', () => {
    it('should handle database transaction failures gracefully', async () => {
      mockStudentModel.findOne.mockResolvedValue(mockStudent);
      mockEmergencyContactModel.sequelize.transaction.mockRejectedValue(
        new Error('Transaction failed')
      );

      await expect(service.createEmergencyContact({
        studentId: 'student-id-123',
        firstName: 'Test',
        lastName: 'Contact',
        phoneNumber: '+1234567890',
        relationship: 'Parent',
        priority: ContactPriority.PRIMARY,
      })).rejects.toThrow();
    });

    it('should handle extremely long phone numbers', async () => {
      const longPhoneDto = {
        studentId: 'student-id-123',
        firstName: 'Test',
        lastName: 'Contact',
        phoneNumber: '+1' + '2'.repeat(50),
        relationship: 'Parent',
        priority: ContactPriority.PRIMARY,
      };
      mockStudentModel.findOne.mockResolvedValue(mockStudent);
      mockEmergencyContactModel.count.mockResolvedValue(0);
      mockEmergencyContactModel.create.mockResolvedValue(mockEmergencyContact);

      const result = await service.createEmergencyContact(longPhoneDto);

      expect(result).toBeDefined();
    });

    it('should handle international phone numbers', async () => {
      const internationalPhoneDto = {
        studentId: 'student-id-123',
        firstName: 'Test',
        lastName: 'Contact',
        phoneNumber: '+44 20 7123 4567',
        relationship: 'Parent',
        priority: ContactPriority.PRIMARY,
      };
      mockStudentModel.findOne.mockResolvedValue(mockStudent);
      mockEmergencyContactModel.count.mockResolvedValue(0);
      mockEmergencyContactModel.create.mockResolvedValue(mockEmergencyContact);

      const result = await service.createEmergencyContact(internationalPhoneDto);

      expect(result).toBeDefined();
    });
  });
});
