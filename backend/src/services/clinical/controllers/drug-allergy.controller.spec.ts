import { Test, TestingModule } from '@nestjs/testing';
import { DrugAllergyController } from './drug-allergy.controller';
import { DrugInteractionService } from '../services/drug-interaction.service';
import { AddAllergyDto } from '../dto/drug/add-allergy.dto';
import { ClinicalUpdateAllergyDto } from '../dto/drug/update-allergy.dto';

describe('DrugAllergyController', () => {
  let controller: DrugAllergyController;
  let drugInteractionService: jest.Mocked<DrugInteractionService>;

  const mockDrugInteractionService = {
    addAllergy: jest.fn(),
    updateAllergy: jest.fn(),
    deleteAllergy: jest.fn(),
    getStudentAllergies: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DrugAllergyController],
      providers: [
        {
          provide: DrugInteractionService,
          useValue: mockDrugInteractionService,
        },
      ],
    }).compile();

    controller = module.get<DrugAllergyController>(DrugAllergyController);
    drugInteractionService = module.get(DrugInteractionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addAllergy', () => {
    it('should add a drug allergy successfully', async () => {
      const addAllergyDto: AddAllergyDto = {
        studentId: 'student-123',
        drugName: 'Penicillin',
        severity: 'severe',
        reaction: 'anaphylaxis',
        notes: 'Confirmed by allergist',
      };

      const mockResponse = {
        id: 'allergy-456',
        ...addAllergyDto,
        createdAt: new Date('2024-01-15'),
      };

      drugInteractionService.addAllergy.mockResolvedValue(mockResponse);

      const result = await controller.addAllergy(addAllergyDto);

      expect(result).toEqual(mockResponse);
      expect(drugInteractionService.addAllergy).toHaveBeenCalledWith(
        addAllergyDto,
      );
      expect(drugInteractionService.addAllergy).toHaveBeenCalledTimes(1);
    });

    it('should handle duplicate allergy error', async () => {
      const addAllergyDto: AddAllergyDto = {
        studentId: 'student-123',
        drugName: 'Penicillin',
        severity: 'moderate',
        reaction: 'rash',
      };

      const error = new Error('Allergy already exists');
      drugInteractionService.addAllergy.mockRejectedValue(error);

      await expect(controller.addAllergy(addAllergyDto)).rejects.toThrow(
        'Allergy already exists',
      );
      expect(drugInteractionService.addAllergy).toHaveBeenCalledWith(
        addAllergyDto,
      );
    });

    it('should add allergy with minimal information', async () => {
      const addAllergyDto: AddAllergyDto = {
        studentId: 'student-123',
        drugName: 'Aspirin',
        severity: 'mild',
        reaction: 'mild rash',
      };

      const mockResponse = {
        id: 'allergy-789',
        ...addAllergyDto,
        createdAt: new Date('2024-01-15'),
      };

      drugInteractionService.addAllergy.mockResolvedValue(mockResponse);

      const result = await controller.addAllergy(addAllergyDto);

      expect(result).toEqual(mockResponse);
      expect(drugInteractionService.addAllergy).toHaveBeenCalledWith(
        addAllergyDto,
      );
    });

    it('should handle invalid student id', async () => {
      const addAllergyDto: AddAllergyDto = {
        studentId: '',
        drugName: 'Penicillin',
        severity: 'severe',
        reaction: 'anaphylaxis',
      };

      const error = new Error('Invalid student id');
      drugInteractionService.addAllergy.mockRejectedValue(error);

      await expect(controller.addAllergy(addAllergyDto)).rejects.toThrow(
        'Invalid student id',
      );
    });

    it('should handle student not found', async () => {
      const addAllergyDto: AddAllergyDto = {
        studentId: 'non-existent',
        drugName: 'Penicillin',
        severity: 'severe',
        reaction: 'anaphylaxis',
      };

      const error = new Error('Student not found');
      drugInteractionService.addAllergy.mockRejectedValue(error);

      await expect(controller.addAllergy(addAllergyDto)).rejects.toThrow(
        'Student not found',
      );
    });
  });

  describe('updateAllergy', () => {
    it('should update an allergy successfully', async () => {
      const allergyId = 'allergy-123';
      const updateDto: ClinicalUpdateAllergyDto = {
        severity: 'moderate',
        notes: 'Severity reduced over time',
      };

      const mockResponse = {
        id: allergyId,
        studentId: 'student-123',
        drugName: 'Penicillin',
        severity: 'moderate',
        notes: 'Severity reduced over time',
        updatedAt: new Date('2024-01-15'),
      };

      drugInteractionService.updateAllergy.mockResolvedValue(mockResponse);

      const result = await controller.updateAllergy(allergyId, updateDto);

      expect(result).toEqual(mockResponse);
      expect(drugInteractionService.updateAllergy).toHaveBeenCalledWith(
        allergyId,
        updateDto,
      );
      expect(drugInteractionService.updateAllergy).toHaveBeenCalledTimes(1);
    });

    it('should handle allergy not found', async () => {
      const allergyId = 'non-existent';
      const updateDto: ClinicalUpdateAllergyDto = {
        severity: 'moderate',
      };

      const error = new Error('Allergy not found');
      drugInteractionService.updateAllergy.mockRejectedValue(error);

      await expect(
        controller.updateAllergy(allergyId, updateDto),
      ).rejects.toThrow('Allergy not found');
      expect(drugInteractionService.updateAllergy).toHaveBeenCalledWith(
        allergyId,
        updateDto,
      );
    });

    it('should update only specified fields', async () => {
      const allergyId = 'allergy-123';
      const updateDto: ClinicalUpdateAllergyDto = {
        notes: 'Additional notes added',
      };

      const mockResponse = {
        id: allergyId,
        studentId: 'student-123',
        drugName: 'Penicillin',
        severity: 'severe',
        notes: 'Additional notes added',
        updatedAt: new Date('2024-01-15'),
      };

      drugInteractionService.updateAllergy.mockResolvedValue(mockResponse);

      const result = await controller.updateAllergy(allergyId, updateDto);

      expect(result.notes).toBe('Additional notes added');
      expect(drugInteractionService.updateAllergy).toHaveBeenCalledWith(
        allergyId,
        updateDto,
      );
    });

    it('should handle invalid severity level', async () => {
      const allergyId = 'allergy-123';
      const updateDto: ClinicalUpdateAllergyDto = {
        severity: 'invalid-severity' as never,
      };

      const error = new Error('Invalid severity level');
      drugInteractionService.updateAllergy.mockRejectedValue(error);

      await expect(
        controller.updateAllergy(allergyId, updateDto),
      ).rejects.toThrow('Invalid severity level');
    });
  });

  describe('deleteAllergy', () => {
    it('should delete an allergy successfully', async () => {
      const allergyId = 'allergy-123';

      drugInteractionService.deleteAllergy.mockResolvedValue(undefined);

      await controller.deleteAllergy(allergyId);

      expect(drugInteractionService.deleteAllergy).toHaveBeenCalledWith(
        allergyId,
      );
      expect(drugInteractionService.deleteAllergy).toHaveBeenCalledTimes(1);
    });

    it('should handle allergy not found on delete', async () => {
      const allergyId = 'non-existent';
      const error = new Error('Allergy not found');

      drugInteractionService.deleteAllergy.mockRejectedValue(error);

      await expect(controller.deleteAllergy(allergyId)).rejects.toThrow(
        'Allergy not found',
      );
      expect(drugInteractionService.deleteAllergy).toHaveBeenCalledWith(
        allergyId,
      );
    });

    it('should handle empty allergy id', async () => {
      const allergyId = '';
      const error = new Error('Invalid allergy id');

      drugInteractionService.deleteAllergy.mockRejectedValue(error);

      await expect(controller.deleteAllergy(allergyId)).rejects.toThrow(
        'Invalid allergy id',
      );
    });
  });

  describe('getStudentAllergies', () => {
    it('should retrieve all allergies for a student', async () => {
      const studentId = 'student-123';
      const mockAllergies = [
        {
          id: 'allergy-1',
          studentId,
          drugName: 'Penicillin',
          severity: 'severe',
          reaction: 'anaphylaxis',
        },
        {
          id: 'allergy-2',
          studentId,
          drugName: 'Aspirin',
          severity: 'mild',
          reaction: 'rash',
        },
      ];

      drugInteractionService.getStudentAllergies.mockResolvedValue(
        mockAllergies,
      );

      const result = await controller.getStudentAllergies(studentId);

      expect(result).toEqual(mockAllergies);
      expect(result).toHaveLength(2);
      expect(drugInteractionService.getStudentAllergies).toHaveBeenCalledWith(
        studentId,
      );
      expect(drugInteractionService.getStudentAllergies).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should return empty array when student has no allergies', async () => {
      const studentId = 'student-456';
      const mockAllergies: never[] = [];

      drugInteractionService.getStudentAllergies.mockResolvedValue(
        mockAllergies,
      );

      const result = await controller.getStudentAllergies(studentId);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
      expect(drugInteractionService.getStudentAllergies).toHaveBeenCalledWith(
        studentId,
      );
    });

    it('should handle student not found', async () => {
      const studentId = 'non-existent';
      const error = new Error('Student not found');

      drugInteractionService.getStudentAllergies.mockRejectedValue(error);

      await expect(controller.getStudentAllergies(studentId)).rejects.toThrow(
        'Student not found',
      );
      expect(drugInteractionService.getStudentAllergies).toHaveBeenCalledWith(
        studentId,
      );
    });

    it('should handle invalid student id format', async () => {
      const studentId = '';
      const error = new Error('Invalid student id');

      drugInteractionService.getStudentAllergies.mockRejectedValue(error);

      await expect(controller.getStudentAllergies(studentId)).rejects.toThrow(
        'Invalid student id',
      );
    });

    it('should return allergies with complete details', async () => {
      const studentId = 'student-123';
      const mockAllergies = [
        {
          id: 'allergy-1',
          studentId,
          drugName: 'Penicillin',
          severity: 'severe',
          reaction: 'anaphylaxis',
          notes: 'Confirmed by allergist',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-15'),
        },
      ];

      drugInteractionService.getStudentAllergies.mockResolvedValue(
        mockAllergies,
      );

      const result = await controller.getStudentAllergies(studentId);

      expect(result[0]).toHaveProperty('createdAt');
      expect(result[0]).toHaveProperty('updatedAt');
      expect(result[0].notes).toBe('Confirmed by allergist');
    });
  });
});
