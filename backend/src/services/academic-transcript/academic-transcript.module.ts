import { Module } from '@nestjs/common';
import { AcademicTranscriptService } from './academic-transcript.service';
import { AcademicTranscriptController } from './academic-transcript.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AcademicTranscriptController],
  providers: [AcademicTranscriptService],
  exports: [AcademicTranscriptService],
})
export class AcademicTranscriptModule {}
