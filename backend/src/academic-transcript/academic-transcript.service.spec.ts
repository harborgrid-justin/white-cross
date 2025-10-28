import { Test, TestingModule } from '@nestjs/testing';
import { AcademicTranscriptService } from './academic-transcript.service';

describe('AcademicTranscriptService', () => {
  let service: AcademicTranscriptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcademicTranscriptService],
    }).compile();

    service = module.get<AcademicTranscriptService>(AcademicTranscriptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
