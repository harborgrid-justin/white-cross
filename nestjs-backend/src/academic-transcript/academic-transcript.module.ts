import { Module } from '@nestjs/common';
import { AcademicTranscriptService } from './academic-transcript.service';
import { AcademicTranscriptController } from './academic-transcript.controller';

@Module({
  controllers: [AcademicTranscriptController],
  providers: [AcademicTranscriptService],
  exports: [AcademicTranscriptService],
})
export class AcademicTranscriptModule {}
