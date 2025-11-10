/**
 * LOC: HLTH-DS-FHIR-CTRL-001
 * File: /reuse/server/health/composites/downstream/epic-fhir-api-controllers.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - ../epic-fhir-api-composites
 */

/**
 * File: /reuse/server/health/composites/downstream/epic-fhir-api-controllers.ts
 * Locator: WC-DS-FHIR-CTRL-001
 * Purpose: Epic FHIR API Controllers - REST API endpoints for FHIR operations
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  EpicFhirApiCompositeService,
  FhirPatientResource,
  FhirAppointment,
  FhirObservation,
  FhirSearchParams,
  FhirBundle,
} from '../epic-fhir-api-composites';

@Controller('api/fhir')
@ApiTags('Epic FHIR API')
@ApiBearerAuth()
export class EpicFhirApiController {
  constructor(private readonly fhirService: EpicFhirApiCompositeService) {}

  /**
   * 1. GET /Patient/:id
   */
  @Get('Patient/:id')
  @ApiOperation({ summary: 'Get FHIR patient by ID' })
  @ApiResponse({ status: 200, type: FhirPatientResource })
  async getPatient(
    @Param('id') patientId: string,
    @Headers('authorization') auth: string,
  ): Promise<FhirPatientResource> {
    const accessToken = this.extractToken(auth);
    return this.fhirService.getEpicFhirPatient(patientId, accessToken);
  }

  /**
   * 2. POST /Patient
   */
  @Post('Patient')
  @ApiOperation({ summary: 'Create FHIR patient' })
  @ApiResponse({ status: 201 })
  async createPatient(
    @Body() patientData: FhirPatientResource,
    @Headers('authorization') auth: string,
  ): Promise<{ id: string; resourceUrl: string }> {
    const accessToken = this.extractToken(auth);
    return this.fhirService.createEpicFhirPatient(patientData, accessToken);
  }

  /**
   * 3. PUT /Patient/:id
   */
  @Put('Patient/:id')
  @ApiOperation({ summary: 'Update FHIR patient' })
  @ApiResponse({ status: 200, type: FhirPatientResource })
  async updatePatient(
    @Param('id') patientId: string,
    @Body() patientData: FhirPatientResource,
    @Headers('authorization') auth: string,
  ): Promise<FhirPatientResource> {
    const accessToken = this.extractToken(auth);
    return this.fhirService.updateEpicFhirPatient(
      patientId,
      patientData,
      accessToken,
    );
  }

  /**
   * 4. GET /Patient
   */
  @Get('Patient')
  @ApiOperation({ summary: 'Search FHIR patients' })
  @ApiResponse({ status: 200, type: FhirBundle })
  async searchPatients(
    @Query() searchParams: FhirSearchParams,
    @Headers('authorization') auth: string,
  ): Promise<FhirBundle> {
    const accessToken = this.extractToken(auth);
    return this.fhirService.searchEpicFhirPatients(searchParams, accessToken);
  }

  /**
   * 5. GET /Appointment
   */
  @Get('Appointment')
  @ApiOperation({ summary: 'Get FHIR appointments' })
  @ApiResponse({ status: 200, type: [FhirAppointment] })
  async getAppointments(
    @Query('patient') patientId: string,
    @Query() params: FhirSearchParams,
    @Headers('authorization') auth: string,
  ): Promise<FhirAppointment[]> {
    const accessToken = this.extractToken(auth);
    return this.fhirService.getEpicFhirAppointments(
      patientId,
      accessToken,
      params,
    );
  }

  /**
   * 6. POST /Appointment
   */
  @Post('Appointment')
  @ApiOperation({ summary: 'Book FHIR appointment' })
  @ApiResponse({ status: 201 })
  async bookAppointment(
    @Body() appointmentData: FhirAppointment,
    @Headers('authorization') auth: string,
  ): Promise<{ id: string; status: string }> {
    const accessToken = this.extractToken(auth);
    return this.fhirService.bookEpicFhirAppointment(appointmentData, accessToken);
  }

  /**
   * 7. GET /Observation
   */
  @Get('Observation')
  @ApiOperation({ summary: 'Get FHIR observations' })
  @ApiResponse({ status: 200, type: [FhirObservation] })
  async getObservations(
    @Query('patient') patientId: string,
    @Query() params: FhirSearchParams,
    @Headers('authorization') auth: string,
  ): Promise<FhirObservation[]> {
    const accessToken = this.extractToken(auth);
    return this.fhirService.getEpicFhirObservations(
      patientId,
      accessToken,
      params,
    );
  }

  /**
   * 8. POST /Observation
   */
  @Post('Observation')
  @ApiOperation({ summary: 'Create FHIR observation' })
  @ApiResponse({ status: 201 })
  async createObservation(
    @Body() observationData: FhirObservation,
    @Headers('authorization') auth: string,
  ): Promise<{ id: string; status: string }> {
    const accessToken = this.extractToken(auth);
    return this.fhirService.createEpicFhirObservation(
      observationData,
      accessToken,
    );
  }

  /**
   * 9. GET /MedicationRequest
   */
  @Get('MedicationRequest')
  @ApiOperation({ summary: 'Get FHIR medications' })
  async getMedicationRequests(
    @Query('patient') patientId: string,
    @Headers('authorization') auth: string,
  ): Promise<any[]> {
    const accessToken = this.extractToken(auth);
    return this.fhirService.getEpicFhirMedications(patientId, accessToken);
  }

  /**
   * 10. POST /MedicationRequest
   */
  @Post('MedicationRequest')
  @ApiOperation({ summary: 'Create FHIR medication request' })
  async createMedicationRequest(
    @Body() medicationRequest: any,
    @Headers('authorization') auth: string,
  ): Promise<{ id: string; status: string }> {
    const accessToken = this.extractToken(auth);
    return this.fhirService.createEpicMedicationRequest(
      medicationRequest,
      accessToken,
    );
  }

  /**
   * 11. GET /AllergyIntolerance
   */
  @Get('AllergyIntolerance')
  @ApiOperation({ summary: 'Get FHIR allergies' })
  async getAllergies(
    @Query('patient') patientId: string,
    @Headers('authorization') auth: string,
  ): Promise<any[]> {
    const accessToken = this.extractToken(auth);
    return this.fhirService.getEpicFhirAllergies(patientId, accessToken);
  }

  /**
   * 12. POST /AllergyIntolerance
   */
  @Post('AllergyIntolerance')
  @ApiOperation({ summary: 'Create FHIR allergy' })
  async createAllergy(
    @Body() allergyData: any,
    @Headers('authorization') auth: string,
  ): Promise<{ id: string }> {
    const accessToken = this.extractToken(auth);
    return this.fhirService.createEpicFhirAllergy(allergyData, accessToken);
  }

  /**
   * 13. POST /$fhir-batch
   */
  @Post('$fhir-batch')
  @ApiOperation({ summary: 'Execute FHIR batch' })
  @ApiResponse({ status: 200, type: FhirBundle })
  async executeBatch(
    @Body() batchBundle: FhirBundle,
    @Headers('authorization') auth: string,
  ): Promise<FhirBundle> {
    const accessToken = this.extractToken(auth);
    return this.fhirService.executeEpicFhirBatch(batchBundle, accessToken);
  }

  // Helper method
  private extractToken(authHeader: string): string {
    return authHeader?.replace('Bearer ', '') || '';
  }
}

export default EpicFhirApiController;
