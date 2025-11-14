import { Body, Controller, HttpStatus, Post, Res, Version } from '@nestjs/common';
import type { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PdfService } from './pdf.service';
import { BaseController } from '@/common/base';
import {
  GenerateImmunizationReportDto,
  GenerateIncidentReportDto,
  GenerateMedicationLogDto,
  GenerateStudentHealthSummaryDto,
  MergePdfsDto,
  PdfGenerateCustomReportDto,
  SignPdfDto,
  WatermarkPdfDto,
} from './dto';

/**
 * PDF Controller
 * Handles PDF generation and manipulation endpoints
 */
@ApiTags('PDF')
@ApiBearerAuth()

@Version('1')
@Controller('pdf')
export class PdfController extends BaseController {
  constructor(private readonly pdfService: PdfService) {}

  /**
   * Generate student health summary PDF
   */
  @Post('student-health-summary')
  @ApiOperation({ summary: 'Generate student health summary PDF' })
  @ApiResponse({
    status: 200,
    description: 'PDF generated successfully',
    type: Buffer,
  })
  async generateStudentHealthSummary(
    @Body() dto: GenerateStudentHealthSummaryDto,
    @Res() res: Response,
  ): Promise<void> {
    const pdfBuffer = await this.pdfService.generateStudentHealthSummary(dto);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=health-summary-${dto.id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.status(HttpStatus.OK).send(pdfBuffer);
  }

  /**
   * Generate medication administration log PDF
   */
  @Post('medication-log')
  @ApiOperation({ summary: 'Generate medication administration log PDF' })
  @ApiResponse({
    status: 200,
    description: 'PDF generated successfully',
    type: Buffer,
  })
  async generateMedicationLog(
    @Body() dto: GenerateMedicationLogDto,
    @Res() res: Response,
  ): Promise<void> {
    const pdfBuffer = await this.pdfService.generateMedicationLog(dto);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=medication-log-${dto.id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.status(HttpStatus.OK).send(pdfBuffer);
  }

  /**
   * Generate immunization compliance report PDF
   */
  @Post('immunization-report')
  @ApiOperation({ summary: 'Generate immunization compliance report PDF' })
  @ApiResponse({
    status: 200,
    description: 'PDF generated successfully',
    type: Buffer,
  })
  async generateImmunizationReport(
    @Body() dto: GenerateImmunizationReportDto,
    @Res() res: Response,
  ): Promise<void> {
    const pdfBuffer = await this.pdfService.generateImmunizationReport(dto);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=immunization-report-${Date.now()}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.status(HttpStatus.OK).send(pdfBuffer);
  }

  /**
   * Generate incident report PDF
   */
  @Post('incident-report')
  @ApiOperation({ summary: 'Generate incident report PDF' })
  @ApiResponse({
    status: 200,
    description: 'PDF generated successfully',
    type: Buffer,
  })
  async generateIncidentReport(
    @Body() dto: GenerateIncidentReportDto,
    @Res() res: Response,
  ): Promise<void> {
    const pdfBuffer = await this.pdfService.generateIncidentReport(dto);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=incident-report-${dto.id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.status(HttpStatus.OK).send(pdfBuffer);
  }

  /**
   * Generate custom report PDF
   */
  @Post('custom-report')
  @ApiOperation({ summary: 'Generate custom report PDF' })
  @ApiResponse({
    status: 200,
    description: 'PDF generated successfully',
    type: Buffer,
  })
  async generateCustomReport(
    @Body() dto: PdfGenerateCustomReportDto,
    @Res() res: Response,
  ): Promise<void> {
    const pdfBuffer = await this.pdfService.generateCustomReport(dto);

    const sanitizedTitle = dto.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${sanitizedTitle}-${Date.now()}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.status(HttpStatus.OK).send(pdfBuffer);
  }

  /**
   * Merge multiple PDFs into one
   */
  @Post('merge')
  @ApiOperation({ summary: 'Merge multiple PDFs into one' })
  @ApiResponse({
    status: 200,
    description: 'PDFs merged successfully',
    type: Buffer,
  })
  async mergePdfs(@Body() dto: MergePdfsDto, @Res() res: Response): Promise<void> {
    const pdfBuffer = await this.pdfService.mergePdfs(dto.pdfBuffers);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=merged-${Date.now()}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.status(HttpStatus.OK).send(pdfBuffer);
  }

  /**
   * Add watermark to PDF
   */
  @Post('watermark')
  @ApiOperation({ summary: 'Add watermark to PDF' })
  @ApiResponse({
    status: 200,
    description: 'Watermark added successfully',
    type: Buffer,
  })
  async addWatermark(@Body() dto: WatermarkPdfDto, @Res() res: Response): Promise<void> {
    const pdfBuffer = await this.pdfService.addWatermark(dto);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=watermarked-${Date.now()}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.status(HttpStatus.OK).send(pdfBuffer);
  }

  /**
   * Add digital signature to PDF
   */
  @Post('sign')
  @ApiOperation({ summary: 'Add digital signature to PDF' })
  @ApiResponse({
    status: 200,
    description: 'PDF signed successfully',
    type: Buffer,
  })
  async signPdf(@Body() dto: SignPdfDto, @Res() res: Response): Promise<void> {
    const pdfBuffer = await this.pdfService.signPdf(dto.pdfBuffer, dto.signatureName);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=signed-${Date.now()}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.status(HttpStatus.OK).send(pdfBuffer);
  }
}
