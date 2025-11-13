import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WitnessStatementService } from '../witness-statement.service';
import { CaptureStatementDto, TranscribeVoiceStatementDto, VerifyStatementDto, WitnessStatementResponseDto } from '../dto';

import { BaseController } from '../../common/base';
@ApiTags('Witness Statements')
@Controller('enterprise-features/witness-statements')
@ApiBearerAuth()
export class WitnessStatementsController extends BaseController {
  constructor(
    private readonly witnessStatementService: WitnessStatementService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Capture witness statement' })
  @ApiResponse({
    status: 201,
    description: 'Statement captured',
    type: WitnessStatementResponseDto,
  })
  captureStatement(@Body() dto: CaptureStatementDto) {
    return this.witnessStatementService.captureStatement({
      incidentId: dto.incidentId,
      witnessName: dto.witnessName,
      witnessRole: dto.witnessRole,
      statement: dto.statement,
      captureMethod: dto.captureMethod,
      signature: dto.signature,
    });
  }

  @Put(':statementId/verify')
  @ApiOperation({ summary: 'Verify witness statement' })
  @ApiResponse({ status: 200, description: 'Statement verified' })
  verifyStatement(
    @Param('statementId') statementId: string,
    @Body() dto: VerifyStatementDto,
  ) {
    return this.witnessStatementService.verifyStatement(
      statementId,
      dto.verifiedBy,
    );
  }

  @Post('transcribe')
  @ApiOperation({ summary: 'Transcribe voice statement' })
  @ApiResponse({ status: 200, description: 'Audio transcribed' })
  transcribeVoiceStatement(@Body() dto: TranscribeVoiceStatementDto) {
    return this.witnessStatementService.transcribeVoiceStatement(
      dto.audioData,
    );
  }
}