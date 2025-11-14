import { Test, TestingModule } from '@nestjs/testing';
import { InsuranceClaimsController } from './insurance-claims.controller';
import { InsuranceClaimService } from '../insurance-claim.service';
import { GenerateClaimDto, InsuranceClaimResponseDto } from '../dto';

describe('InsuranceClaimsController', () => {
  let controller: InsuranceClaimsController;
  let service: jest.Mocked<InsuranceClaimService>;

  const mockInsuranceClaimService = {
    createClaim: jest.fn(),
    exportClaim: jest.fn(),
    submitClaimElectronically: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InsuranceClaimsController],
      providers: [
        {
          provide: InsuranceClaimService,
          useValue: mockInsuranceClaimService,
        },
      ],
    }).compile();

    controller = module.get<InsuranceClaimsController>(InsuranceClaimsController);
    service = module.get(InsuranceClaimService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateClaim', () => {
    it('should generate insurance claim successfully', async () => {
      const dto: GenerateClaimDto = {
        incidentId: 'incident-123',
        studentId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const expectedResult: Partial<InsuranceClaimResponseDto> = {
        id: 'claim-456',
        incidentId: dto.incidentId,
        studentId: dto.studentId,
        status: 'DRAFT',
        claimNumber: 'CLM-2025-001',
      };

      mockInsuranceClaimService.createClaim.mockResolvedValue(expectedResult);

      const result = await controller.generateClaim(dto);

      expect(service.createClaim).toHaveBeenCalledWith(dto.incidentId, dto.studentId);
      expect(result).toEqual(expectedResult);
    });

    it('should handle invalid incident ID', async () => {
      const dto: GenerateClaimDto = {
        incidentId: 'nonexistent-incident',
        studentId: '123e4567-e89b-12d3-a456-426614174000',
      };

      mockInsuranceClaimService.createClaim.mockRejectedValue(
        new Error('Incident not found'),
      );

      await expect(controller.generateClaim(dto)).rejects.toThrow('Incident not found');
    });

    it('should handle invalid student ID', async () => {
      const dto: GenerateClaimDto = {
        incidentId: 'incident-123',
        studentId: 'invalid-student',
      };

      mockInsuranceClaimService.createClaim.mockRejectedValue(
        new Error('Student not found'),
      );

      await expect(controller.generateClaim(dto)).rejects.toThrow('Student not found');
    });

    it('should handle incident already has claim', async () => {
      const dto: GenerateClaimDto = {
        incidentId: 'incident-123',
        studentId: '123e4567-e89b-12d3-a456-426614174000',
      };

      mockInsuranceClaimService.createClaim.mockRejectedValue(
        new Error('Claim already exists for this incident'),
      );

      await expect(controller.generateClaim(dto)).rejects.toThrow(
        'Claim already exists for this incident',
      );
    });
  });

  describe('exportClaimToFormat', () => {
    it('should export claim to PDF format', async () => {
      const claimId = 'claim-456';
      const format = 'pdf';
      const expectedResult = {
        claimId,
        format,
        data: 'base64-encoded-pdf-data',
        filename: 'claim-456.pdf',
      };

      mockInsuranceClaimService.exportClaim.mockResolvedValue(expectedResult);

      const result = await controller.exportClaimToFormat(claimId, format);

      expect(service.exportClaim).toHaveBeenCalledWith(claimId, format);
      expect(result).toEqual(expectedResult);
    });

    it('should export claim to XML format', async () => {
      const claimId = 'claim-456';
      const format = 'xml';
      const expectedResult = {
        claimId,
        format,
        data: '<?xml version="1.0"?><claim>...</claim>',
        filename: 'claim-456.xml',
      };

      mockInsuranceClaimService.exportClaim.mockResolvedValue(expectedResult);

      const result = await controller.exportClaimToFormat(claimId, format);

      expect(service.exportClaim).toHaveBeenCalledWith(claimId, format);
      expect(result).toEqual(expectedResult);
    });

    it('should export claim to EDI format', async () => {
      const claimId = 'claim-456';
      const format = 'edi';
      const expectedResult = {
        claimId,
        format,
        data: 'ISA*00*...',
        filename: 'claim-456.edi',
      };

      mockInsuranceClaimService.exportClaim.mockResolvedValue(expectedResult);

      const result = await controller.exportClaimToFormat(claimId, format);

      expect(service.exportClaim).toHaveBeenCalledWith(claimId, format);
      expect(result).toEqual(expectedResult);
    });

    it('should handle nonexistent claim', async () => {
      const claimId = 'nonexistent-claim';
      const format = 'pdf';

      mockInsuranceClaimService.exportClaim.mockRejectedValue(
        new Error('Claim not found'),
      );

      await expect(controller.exportClaimToFormat(claimId, format)).rejects.toThrow(
        'Claim not found',
      );
    });

    it('should handle export generation errors', async () => {
      const claimId = 'claim-456';
      const format = 'pdf';

      mockInsuranceClaimService.exportClaim.mockRejectedValue(
        new Error('Failed to generate PDF'),
      );

      await expect(controller.exportClaimToFormat(claimId, format)).rejects.toThrow(
        'Failed to generate PDF',
      );
    });
  });

  describe('submitClaimElectronically', () => {
    it('should submit claim successfully', async () => {
      const claimId = 'claim-456';
      const expectedResult = {
        claimId,
        submitted: true,
        submissionId: 'sub-789',
        timestamp: new Date().toISOString(),
        status: 'SUBMITTED',
      };

      mockInsuranceClaimService.submitClaimElectronically.mockResolvedValue(expectedResult);

      const result = await controller.submitClaimElectronically(claimId);

      expect(service.submitClaimElectronically).toHaveBeenCalledWith(claimId);
      expect(result).toEqual(expectedResult);
    });

    it('should handle claim not ready for submission', async () => {
      const claimId = 'claim-456';

      mockInsuranceClaimService.submitClaimElectronically.mockRejectedValue(
        new Error('Claim is missing required fields'),
      );

      await expect(controller.submitClaimElectronically(claimId)).rejects.toThrow(
        'Claim is missing required fields',
      );
    });

    it('should handle already submitted claim', async () => {
      const claimId = 'claim-456';

      mockInsuranceClaimService.submitClaimElectronically.mockRejectedValue(
        new Error('Claim has already been submitted'),
      );

      await expect(controller.submitClaimElectronically(claimId)).rejects.toThrow(
        'Claim has already been submitted',
      );
    });

    it('should handle network errors during submission', async () => {
      const claimId = 'claim-456';

      mockInsuranceClaimService.submitClaimElectronically.mockRejectedValue(
        new Error('Network error: Unable to reach insurance server'),
      );

      await expect(controller.submitClaimElectronically(claimId)).rejects.toThrow(
        'Network error: Unable to reach insurance server',
      );
    });

    it('should handle nonexistent claim', async () => {
      const claimId = 'nonexistent-claim';

      mockInsuranceClaimService.submitClaimElectronically.mockRejectedValue(
        new Error('Claim not found'),
      );

      await expect(controller.submitClaimElectronically(claimId)).rejects.toThrow(
        'Claim not found',
      );
    });
  });
});
