import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConsentFormManagementService } from '../consent-form-management.service';
import { ConsentFormResponseDto, CreateConsentFormDto, RenewConsentFormDto, RevokeConsentDto, SignFormDto, VerifySignatureDto } from '../dto';

import { BaseController } from '@/common/base';
@ApiTags('Consent Forms')
@Controller('enterprise-features/consent-forms')
@ApiBearerAuth()
export class ConsentFormsController extends BaseController {
  constructor(
    private readonly consentFormService: ConsentFormManagementService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create consent form' })
  @ApiResponse({
    status: 201,
    description: 'Consent form created',
    type: ConsentFormResponseDto,
  })
  createConsentForm(@Body() dto: CreateConsentFormDto) {
    return this.consentFormService.createConsentForm(
      dto.studentId,
      dto.formType,
      dto.content,
      dto.expiresAt ? new Date(dto.expiresAt) : undefined,
    );
  }

  @Put(':formId/sign')
  @ApiOperation({ summary: 'Sign consent form' })
  @ApiResponse({ status: 200, description: 'Form signed successfully' })
  signForm(@Param('formId') formId: string, @Body() dto: SignFormDto) {
    return this.consentFormService.signForm(
      formId,
      dto.signedBy,
      dto.signature,
      dto.ipAddress,
      dto.userAgent,
    );
  }

  @Post(':formId/verify')
  @ApiOperation({ summary: 'Verify form signature' })
  @ApiResponse({ status: 200, description: 'Signature verified' })
  verifySignature(
    @Param('formId') formId: string,
    @Body() dto: VerifySignatureDto,
  ) {
    return this.consentFormService.verifySignature(
      formId,
      dto.signature,
    );
  }

  @Delete(':formId/revoke')
  @ApiOperation({ summary: 'Revoke consent' })
  @ApiResponse({ status: 200, description: 'Consent revoked' })
  @HttpCode(HttpStatus.OK)
  revokeConsent(
    @Param('formId') formId: string,
    @Body() dto: RevokeConsentDto,
  ) {
    return this.consentFormService.revokeConsent(
      formId,
      dto.revokedBy,
      dto.reason,
    );
  }

  @Post(':formId/renew')
  @ApiOperation({ summary: 'Renew consent form' })
  @ApiResponse({ status: 200, description: 'Form renewed' })
  renewConsentForm(
    @Param('formId') formId: string,
    @Body() dto: RenewConsentFormDto,
  ) {
    return this.consentFormService.renewConsentForm(
      formId,
      dto.extendedBy,
      dto.additionalYears,
    );
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get consent forms for student' })
  @ApiResponse({
    status: 200,
    description: 'Consent forms retrieved',
    type: [ConsentFormResponseDto],
  })
  getConsentFormsByStudent(
    @Param('studentId') studentId: string,
    @Query('status') status?: string,
  ) {
    return this.consentFormService.getConsentFormsByStudent(
      studentId,
      status,
    );
  }

  @Get(':formId/history')
  @ApiOperation({ summary: 'Get consent form history' })
  @ApiResponse({ status: 200, description: 'Form history retrieved' })
  getConsentFormHistory(@Param('formId') formId: string) {
    return this.consentFormService.getConsentFormHistory(formId);
  }

  @Post('send-reminders')
  @ApiOperation({ summary: 'Send reminders for unsigned forms' })
  @ApiResponse({ status: 200, description: 'Reminders sent' })
  sendReminderForUnsignedForms() {
    return this.consentFormService.sendReminderForUnsignedForms();
  }

  @Get('template/:formType/:studentId')
  @ApiOperation({ summary: 'Generate consent form template' })
  @ApiResponse({ status: 200, description: 'Template generated' })
  generateConsentFormTemplate(
    @Param('formType') formType: string,
    @Param('studentId') studentId: string,
  ) {
    return this.consentFormService.generateConsentFormTemplate(
      formType,
      studentId,
    );
  }

  @Get('expiring')
  @ApiOperation({ summary: 'Check forms expiring soon' })
  @ApiResponse({
    status: 200,
    description: 'Expiring forms retrieved',
    type: [ConsentFormResponseDto],
  })
  checkFormsExpiringSoon(@Query('days') days?: number) {
    return this.consentFormService.checkFormsExpiringSoon(
      days ? parseInt(days.toString()) : 30,
    );
  }
}