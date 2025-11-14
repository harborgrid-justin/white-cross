import { Test, TestingModule } from '@nestjs/testing';
import { EvidenceController } from './evidence.controller';
import { PhotoVideoEvidenceService } from '../photo-video-evidence.service';
import { DeleteEvidenceDto, EvidenceFileResponseDto, UploadEvidenceDto } from '../dto';

describe('EvidenceController', () => {
  let controller: EvidenceController;
  let service: jest.Mocked<PhotoVideoEvidenceService>;

  const mockEvidenceService = {
    uploadEvidence: jest.fn(),
    getEvidenceWithAudit: jest.fn(),
    deleteEvidence: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvidenceController],
      providers: [
        {
          provide: PhotoVideoEvidenceService,
          useValue: mockEvidenceService,
        },
      ],
    }).compile();

    controller = module.get<EvidenceController>(EvidenceController);
    service = module.get(PhotoVideoEvidenceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadEvidence', () => {
    it('should upload photo evidence successfully', async () => {
      const dto: UploadEvidenceDto = {
        incidentId: 'incident-123',
        fileData: 'base64-encoded-image-data',
        type: 'PHOTO',
        uploadedBy: 'nurse-456',
      };

      const expectedResult: Partial<EvidenceFileResponseDto> = {
        id: 'evidence-789',
        incidentId: dto.incidentId,
        type: dto.type,
        uploadedBy: dto.uploadedBy,
        url: 'https://storage.example.com/evidence/evidence-789.jpg',
      };

      mockEvidenceService.uploadEvidence.mockResolvedValue(expectedResult);

      const result = await controller.uploadEvidence(dto);

      expect(service.uploadEvidence).toHaveBeenCalledWith(
        dto.incidentId,
        dto.fileData,
        dto.type,
        dto.uploadedBy,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should upload video evidence successfully', async () => {
      const dto: UploadEvidenceDto = {
        incidentId: 'incident-123',
        fileData: 'base64-encoded-video-data',
        type: 'VIDEO',
        uploadedBy: 'security-789',
      };

      mockEvidenceService.uploadEvidence.mockResolvedValue({} as EvidenceFileResponseDto);

      await controller.uploadEvidence(dto);

      expect(service.uploadEvidence).toHaveBeenCalledWith(
        dto.incidentId,
        dto.fileData,
        dto.type,
        dto.uploadedBy,
      );
    });

    it('should handle file size too large', async () => {
      const dto: UploadEvidenceDto = {
        incidentId: 'incident-123',
        fileData: 'very-large-file-data',
        type: 'VIDEO',
        uploadedBy: 'nurse-456',
      };

      mockEvidenceService.uploadEvidence.mockRejectedValue(
        new Error('File size exceeds maximum limit'),
      );

      await expect(controller.uploadEvidence(dto)).rejects.toThrow(
        'File size exceeds maximum limit',
      );
    });

    it('should handle invalid file format', async () => {
      const dto: UploadEvidenceDto = {
        incidentId: 'incident-123',
        fileData: 'invalid-file-data',
        type: 'PHOTO',
        uploadedBy: 'nurse-456',
      };

      mockEvidenceService.uploadEvidence.mockRejectedValue(
        new Error('Invalid file format'),
      );

      await expect(controller.uploadEvidence(dto)).rejects.toThrow('Invalid file format');
    });
  });

  describe('getEvidenceWithAudit', () => {
    it('should retrieve evidence with audit trail', async () => {
      const evidenceId = 'evidence-789';
      const accessedBy = 'admin-123';
      const expectedResult = {
        id: evidenceId,
        type: 'PHOTO',
        url: 'https://storage.example.com/evidence/evidence-789.jpg',
        auditTrail: [
          { timestamp: '2025-01-14T10:00:00.000Z', accessedBy, action: 'VIEWED' },
        ],
      };

      mockEvidenceService.getEvidenceWithAudit.mockResolvedValue(expectedResult);

      const result = await controller.getEvidenceWithAudit(evidenceId, accessedBy);

      expect(service.getEvidenceWithAudit).toHaveBeenCalledWith(evidenceId, accessedBy);
      expect(result.auditTrail).toHaveLength(1);
    });

    it('should handle nonexistent evidence', async () => {
      const evidenceId = 'nonexistent-evidence';
      const accessedBy = 'admin-123';

      mockEvidenceService.getEvidenceWithAudit.mockRejectedValue(
        new Error('Evidence not found'),
      );

      await expect(
        controller.getEvidenceWithAudit(evidenceId, accessedBy),
      ).rejects.toThrow('Evidence not found');
    });
  });

  describe('deleteEvidence', () => {
    it('should delete evidence successfully', async () => {
      const evidenceId = 'evidence-789';
      const dto: DeleteEvidenceDto = {
        deletedBy: 'admin-123',
        reason: 'No longer needed for case',
      };

      const expectedResult = { success: true, deleted: true };
      mockEvidenceService.deleteEvidence.mockResolvedValue(expectedResult);

      const result = await controller.deleteEvidence(evidenceId, dto);

      expect(service.deleteEvidence).toHaveBeenCalledWith(
        evidenceId,
        dto.deletedBy,
        dto.reason,
      );
      expect(result.success).toBe(true);
    });

    it('should handle evidence already deleted', async () => {
      const evidenceId = 'evidence-789';
      const dto: DeleteEvidenceDto = {
        deletedBy: 'admin-123',
        reason: 'Duplicate deletion',
      };

      mockEvidenceService.deleteEvidence.mockRejectedValue(
        new Error('Evidence already deleted'),
      );

      await expect(controller.deleteEvidence(evidenceId, dto)).rejects.toThrow(
        'Evidence already deleted',
      );
    });
  });
});
