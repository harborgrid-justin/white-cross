/**
 * LOC: EDU-DOWN-BURSAR-CTRL-001
 * File: /reuse/education/composites/downstream/bursar-office-controller.ts
 *
 * Purpose: Bursar Office REST Controller - Production-grade HTTP endpoints for financial operations
 *
 * Upstream: BursarOfficeControllersService
 * Downstream: REST API clients, Financial portals, Payment systems
 * Dependencies: NestJS 10.x, Swagger/OpenAPI
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
  ParseFloatPipe,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BursarOfficeControllersService } from './bursar-office-service';

@ApiTags('Bursar Office')
@Controller('bursar')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @UseInterceptors(LoggingInterceptor)
export class BursarOfficeController {
  private readonly logger = new Logger(BursarOfficeController.name);

  constructor(
    private readonly bursarService: BursarOfficeControllersService,
  ) {}

  // ============================================================================
  // PAYMENT PROCESSING
  // ============================================================================

  @Post('payments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Process payment',
    description: 'Processes a student payment toward account balance',
  })
  @ApiBody({ description: 'Payment details including amount, method, and student info' })
  @ApiCreatedResponse({ description: 'Payment processed successfully' })
  @ApiBadRequestResponse({ description: 'Invalid payment data' })
  async processPayment(@Body(ValidationPipe) paymentData: any): Promise<any> {
    this.logger.log(`Processing payment for student ${paymentData.studentId}`);
    return this.bursarService.processPayment(paymentData);
  }

  @Post('payments/batch')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Process batch payments',
    description: 'Processes multiple payments in a single transaction',
  })
  @ApiBody({ description: 'Array of payment records' })
  @ApiCreatedResponse({ description: 'Batch payments processed successfully' })
  async processBatchPayments(@Body(ValidationPipe) payments: any[]): Promise<any> {
    this.logger.log(`Processing batch of ${payments.length} payments`);
    return this.bursarService.processBatchPayments(payments);
  }

  @Post('payments/:transactionId/reverse')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reverse payment',
    description: 'Reverses a previously processed payment transaction',
  })
  @ApiParam({ name: 'transactionId', description: 'Transaction identifier' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['reason'],
      properties: { reason: { type: 'string' } },
    },
  })
  @ApiOkResponse({ description: 'Payment reversed successfully' })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  async reversePayment(
    @Param('transactionId', ParseUUIDPipe) transactionId: string,
    @Body('reason') reason: string,
  ): Promise<{ reversed: boolean; reversalId: string }> {
    this.logger.log(`Reversing payment ${transactionId}`);
    return this.bursarService.reversePayment(transactionId, reason);
  }

  @Post('payments/credit-card')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Process credit card payment',
    description: 'Processes payment via credit card',
  })
  @ApiBody({ description: 'Credit card payment details' })
  @ApiCreatedResponse({ description: 'Credit card payment processed successfully' })
  async processCreditCardPayment(@Body(ValidationPipe) paymentData: any): Promise<any> {
    this.logger.log('Processing credit card payment');
    return this.bursarService.processCreditCardPayment(paymentData);
  }

  @Post('payments/ach')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Process ACH payment',
    description: 'Processes payment via ACH bank transfer',
  })
  @ApiBody({ description: 'ACH payment details' })
  @ApiCreatedResponse({ description: 'ACH payment processed successfully' })
  async processACHPayment(@Body(ValidationPipe) paymentData: any): Promise<any> {
    this.logger.log('Processing ACH payment');
    return this.bursarService.processACHPayment(paymentData);
  }

  @Post('payments/financial-aid')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Apply financial aid',
    description: 'Applies financial aid disbursement to student account',
  })
  @ApiBody({ description: 'Financial aid application details' })
  @ApiCreatedResponse({ description: 'Financial aid applied successfully' })
  async applyFinancialAid(@Body(ValidationPipe) aidData: any): Promise<any> {
    this.logger.log(`Applying financial aid for student ${aidData.studentId}`);
    return this.bursarService.applyFinancialAid(aidData);
  }

  @Post('payments/third-party')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Process third-party payment',
    description: 'Processes payment from third-party sponsor or organization',
  })
  @ApiBody({ description: 'Third-party payment details' })
  @ApiCreatedResponse({ description: 'Third-party payment processed successfully' })
  async processThirdPartyPayment(@Body(ValidationPipe) paymentData: any): Promise<any> {
    this.logger.log('Processing third-party payment');
    return this.bursarService.processThirdPartyPayment(paymentData);
  }

  @Post('payments/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate payment',
    description: 'Validates payment information before processing',
  })
  @ApiBody({ description: 'Payment data to validate' })
  @ApiOkResponse({ description: 'Payment validation result' })
  async validatePayment(@Body(ValidationPipe) paymentData: any): Promise<any> {
    this.logger.log('Validating payment');
    return this.bursarService.validatePayment(paymentData);
  }

  // ============================================================================
  // REFUND MANAGEMENT
  // ============================================================================

  @Post('refunds')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create refund request',
    description: 'Creates a refund request for student account credit',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['studentId', 'amount', 'reason'],
      properties: {
        studentId: { type: 'string' },
        amount: { type: 'number' },
        reason: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Refund request created successfully' })
  async createRefundRequest(
    @Body() refundData: { studentId: string; amount: number; reason: string },
  ): Promise<any> {
    this.logger.log(`Creating refund request for student ${refundData.studentId}`);
    return this.bursarService.createRefundRequest(
      refundData.studentId,
      refundData.amount,
      refundData.reason,
    );
  }

  @Patch('refunds/:refundId/approve')
  @ApiOperation({
    summary: 'Approve refund',
    description: 'Approves a pending refund request',
  })
  @ApiParam({ name: 'refundId', description: 'Refund request identifier' })
  @ApiOkResponse({ description: 'Refund approved successfully' })
  @ApiNotFoundResponse({ description: 'Refund request not found' })
  async approveRefund(
    @Param('refundId', ParseUUIDPipe) refundId: string,
  ): Promise<{ approved: boolean; approvedBy: string }> {
    this.logger.log(`Approving refund ${refundId}`);
    return this.bursarService.approveRefund(refundId);
  }

  @Post('refunds/:refundId/process')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Process refund',
    description: 'Processes an approved refund and initiates payment',
  })
  @ApiParam({ name: 'refundId', description: 'Refund request identifier' })
  @ApiOkResponse({ description: 'Refund processed successfully' })
  async processRefund(@Param('refundId', ParseUUIDPipe) refundId: string): Promise<any> {
    this.logger.log(`Processing refund ${refundId}`);
    return this.bursarService.processRefund(refundId);
  }

  @Patch('refunds/:refundId/deny')
  @ApiOperation({
    summary: 'Deny refund',
    description: 'Denies a pending refund request',
  })
  @ApiParam({ name: 'refundId', description: 'Refund request identifier' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['reason'],
      properties: { reason: { type: 'string' } },
    },
  })
  @ApiOkResponse({ description: 'Refund denied successfully' })
  async denyRefund(
    @Param('refundId', ParseUUIDPipe) refundId: string,
    @Body('reason') reason: string,
  ): Promise<{ denied: boolean; deniedBy: string }> {
    this.logger.log(`Denying refund ${refundId}`);
    return this.bursarService.denyRefund(refundId, reason);
  }

  @Get('refunds/:refundId/status')
  @ApiOperation({
    summary: 'Track refund status',
    description: 'Retrieves current status of a refund request',
  })
  @ApiParam({ name: 'refundId', description: 'Refund request identifier' })
  @ApiOkResponse({ description: 'Refund status retrieved successfully' })
  async trackRefundStatus(@Param('refundId', ParseUUIDPipe) refundId: string): Promise<any> {
    this.logger.log(`Tracking refund status ${refundId}`);
    return this.bursarService.trackRefundStatus(refundId);
  }

  // ============================================================================
  // ACCOUNT STATEMENTS & CHARGES
  // ============================================================================

  @Get('accounts/:studentId/statement')
  @ApiOperation({
    summary: 'Generate account statement',
    description: 'Generates detailed account statement for a student',
  })
  @ApiParam({ name: 'studentId', description: 'Student identifier' })
  @ApiQuery({ name: 'termId', description: 'Academic term identifier', required: false })
  @ApiOkResponse({ description: 'Account statement generated successfully' })
  async generateAccountStatement(
    @Param('studentId') studentId: string,
    @Query('termId') termId?: string,
  ): Promise<any> {
    this.logger.log(`Generating account statement for student ${studentId}`);
    return this.bursarService.generateAccountStatement(studentId, termId);
  }

  @Post('charges')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Post charge',
    description: 'Posts a charge to a student account',
  })
  @ApiBody({ description: 'Charge details' })
  @ApiCreatedResponse({ description: 'Charge posted successfully' })
  async postCharge(@Body(ValidationPipe) chargeData: any): Promise<any> {
    this.logger.log(`Posting charge for student ${chargeData.studentId}`);
    return this.bursarService.postCharge(chargeData);
  }

  @Patch('charges/:chargeId/adjust')
  @ApiOperation({
    summary: 'Adjust charge',
    description: 'Adjusts an existing charge amount',
  })
  @ApiParam({ name: 'chargeId', description: 'Charge identifier' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['adjustmentAmount', 'reason'],
      properties: {
        adjustmentAmount: { type: 'number' },
        reason: { type: 'string' },
      },
    },
  })
  @ApiOkResponse({ description: 'Charge adjusted successfully' })
  async adjustCharge(
    @Param('chargeId', ParseUUIDPipe) chargeId: string,
    @Body() adjustmentData: { adjustmentAmount: number; reason: string },
  ): Promise<any> {
    this.logger.log(`Adjusting charge ${chargeId}`);
    return this.bursarService.adjustCharge(
      chargeId,
      adjustmentData.adjustmentAmount,
      adjustmentData.reason,
    );
  }

  @Post('accounts/:studentId/reconcile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reconcile account',
    description: 'Reconciles student account balances and transactions',
  })
  @ApiParam({ name: 'studentId', description: 'Student identifier' })
  @ApiOkResponse({ description: 'Account reconciled successfully' })
  async reconcileAccount(@Param('studentId') studentId: string): Promise<any> {
    this.logger.log(`Reconciling account for student ${studentId}`);
    return this.bursarService.reconcileAccount(studentId);
  }

  // ============================================================================
  // BALANCE & HOLDS
  // ============================================================================

  @Get('accounts/:studentId/balance')
  @ApiOperation({
    summary: 'Get account balance',
    description: 'Retrieves current account balance for a student',
  })
  @ApiParam({ name: 'studentId', description: 'Student identifier' })
  @ApiOkResponse({ description: 'Account balance retrieved successfully' })
  async getAccountBalance(@Param('studentId') studentId: string): Promise<any> {
    this.logger.log(`Retrieving account balance for student ${studentId}`);
    return this.bursarService.getAccountBalance(studentId);
  }

  @Get('accounts/:studentId/holds')
  @ApiOperation({
    summary: 'Get financial holds',
    description: 'Retrieves all financial holds on a student account',
  })
  @ApiParam({ name: 'studentId', description: 'Student identifier' })
  @ApiOkResponse({ description: 'Financial holds retrieved successfully' })
  async getFinancialHolds(@Param('studentId') studentId: string): Promise<any> {
    this.logger.log(`Retrieving financial holds for student ${studentId}`);
    return this.bursarService.getFinancialHolds(studentId);
  }

  @Post('accounts/:studentId/holds')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Place financial hold',
    description: 'Places a financial hold on a student account',
  })
  @ApiParam({ name: 'studentId', description: 'Student identifier' })
  @ApiBody({ description: 'Hold details and reason' })
  @ApiCreatedResponse({ description: 'Financial hold placed successfully' })
  async placeFinancialHold(
    @Param('studentId') studentId: string,
    @Body(ValidationPipe) holdData: any,
  ): Promise<any> {
    this.logger.log(`Placing financial hold for student ${studentId}`);
    return this.bursarService.placeFinancialHold(studentId, holdData);
  }
}
