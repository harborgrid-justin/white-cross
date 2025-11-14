import { Test, TestingModule } from '@nestjs/testing';
import { WitnessStatementsController } from './witness-statements.controller';
import { WitnessStatementService } from '../witness-statement.service';
import {
  CaptureStatementDto,
  TranscribeVoiceStatementDto,
  VerifyStatementDto,
  WitnessStatementResponseDto,
} from '../dto';

describe('WitnessStatementsController', () => {
  let controller: WitnessStatementsController;
  let service: jest.Mocked<WitnessStatementService>;

  const mockWitnessStatementService = {
    captureStatement: jest.fn(),
    verifyStatement: jest.fn(),
    transcribeVoiceStatement: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WitnessStatementsController],
      providers: [
        {
          provide: WitnessStatementService,
          useValue: mockWitnessStatementService,
        },
      ],
    }).compile();

    controller = module.get<WitnessStatementsController>(WitnessStatementsController);
    service = module.get(WitnessStatementService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('captureStatement', () => {
    it('should capture written witness statement', async () => {
      const dto: CaptureStatementDto = {
        incidentId: 'incident-123',
        witnessName: 'Jane Doe',
        witnessRole: 'TEACHER',
        statement: 'I witnessed the student fall on the playground',
        captureMethod: 'WRITTEN',
        signature: 'base64-signature-data',
      };

      const expectedResult: Partial<WitnessStatementResponseDto> = {
        id: 'statement-456',
        incidentId: dto.incidentId,
        witnessName: dto.witnessName,
        captureMethod: dto.captureMethod,
        verified: false,
      };

      mockWitnessStatementService.captureStatement.mockResolvedValue(expectedResult);

      const result = await controller.captureStatement(dto);

      expect(service.captureStatement).toHaveBeenCalledWith({
        incidentId: dto.incidentId,
        witnessName: dto.witnessName,
        witnessRole: dto.witnessRole,
        statement: dto.statement,
        captureMethod: dto.captureMethod,
        signature: dto.signature,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should capture voice witness statement', async () => {
      const dto: CaptureStatementDto = {
        incidentId: 'incident-123',
        witnessName: 'John Smith',
        witnessRole: 'STAFF',
        statement: 'Transcribed voice statement',
        captureMethod: 'VOICE',
        signature: undefined,
      };

      mockWitnessStatementService.captureStatement.mockResolvedValue(
        {} as WitnessStatementResponseDto,
      );

      await controller.captureStatement(dto);

      expect(service.captureStatement).toHaveBeenCalledWith(
        expect.objectContaining({
          captureMethod: 'VOICE',
        }),
      );
    });
  });

  describe('verifyStatement', () => {
    it('should verify witness statement', async () => {
      const statementId = 'statement-456';
      const dto: VerifyStatementDto = {
        verifiedBy: 'admin-789',
      };

      const expectedResult = {
        statementId,
        verified: true,
        verifiedBy: dto.verifiedBy,
        verifiedAt: new Date().toISOString(),
      };

      mockWitnessStatementService.verifyStatement.mockResolvedValue(expectedResult);

      const result = await controller.verifyStatement(statementId, dto);

      expect(service.verifyStatement).toHaveBeenCalledWith(statementId, dto.verifiedBy);
      expect(result.verified).toBe(true);
    });
  });

  describe('transcribeVoiceStatement', () => {
    it('should transcribe voice recording', async () => {
      const dto: TranscribeVoiceStatementDto = {
        audioData: 'base64-encoded-audio-data',
      };

      const expectedResult = {
        transcription: 'I saw the student trip over a backpack',
        confidence: 0.95,
        duration: 15,
      };

      mockWitnessStatementService.transcribeVoiceStatement.mockResolvedValue(expectedResult);

      const result = await controller.transcribeVoiceStatement(dto);

      expect(service.transcribeVoiceStatement).toHaveBeenCalledWith(dto.audioData);
      expect(result.transcription).toBeTruthy();
    });
  });
});
