import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';

@Module({
  providers: [PdfService],
  controllers: [PdfController],
  exports: [PdfService], // Export for use in other modules
})
export class PdfModule {}
