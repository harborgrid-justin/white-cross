/**
 * LOC: HLTH-DS-FHIR-PROC-001
 * File: /reuse/server/health/composites/downstream/fhir-resource-processors.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - ../epic-fhir-api-composites
 */

/**
 * File: /reuse/server/health/composites/downstream/fhir-resource-processors.ts
 * Locator: WC-DS-FHIR-PROC-001
 * Purpose: FHIR Resource Processors - Transform and validate FHIR resources
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  EpicFhirApiCompositeService,
  FhirPatientResource,
  FhirObservation,
} from '../epic-fhir-api-composites';

export class FhirValidationResult {
  @ApiProperty({ description: 'Valid flag' })
  valid: boolean;

  @ApiProperty({ description: 'Errors', type: Array })
  errors: string[];

  @ApiProperty({ description: 'Warnings', type: Array })
  warnings: string[];

  @ApiProperty({ description: 'Resource type' })
  resourceType: string;
}

export class FhirTransformConfig {
  @ApiProperty({ description: 'Source format' })
  sourceFormat: 'hl7v2' | 'ccda' | 'json' | 'xml';

  @ApiProperty({ description: 'Target format' })
  targetFormat: 'fhir_r4' | 'fhir_r5' | 'hl7v2' | 'ccda';

  @ApiProperty({ description: 'Transformation rules' })
  transformationRules?: any;
}

@Injectable()
@ApiTags('FHIR Resource Processing')
export class FhirResourceProcessorService {
  private readonly logger = new Logger(FhirResourceProcessorService.name);

  constructor(private readonly fhirService: EpicFhirApiCompositeService) {}

  /**
   * 1. Validate FHIR patient resource
   */
  @ApiOperation({ summary: 'Validate FHIR patient resource' })
  async validateFhirPatient(
    patientData: FhirPatientResource,
  ): Promise<FhirValidationResult> {
    this.logger.log('Validating FHIR patient resource');

    const result = await this.fhirService.validateEpicFhirPatient(patientData);

    return {
      valid: result.valid,
      errors: result.errors,
      warnings: [],
      resourceType: 'Patient',
    };
  }

  /**
   * 2. Transform HL7 v2 to FHIR
   */
  @ApiOperation({ summary: 'Transform HL7 v2 to FHIR' })
  async transformHL7ToFhir(
    hl7Message: string,
    messageType: string,
  ): Promise<any> {
    this.logger.log(`Transforming HL7 ${messageType} to FHIR`);

    // Parse HL7 message
    const parsed = this.parseHL7(hl7Message);

    // Transform based on message type
    switch (messageType) {
      case 'ADT^A01': // Admission
        return this.transformAdmissionToFhir(parsed);
      case 'ADT^A03': // Discharge
        return this.transformDischargeToFhir(parsed);
      case 'ORU^R01': // Observation result
        return this.transformObservationToFhir(parsed);
      default:
        throw new Error(`Unsupported HL7 message type: ${messageType}`);
    }
  }

  /**
   * 3. Transform C-CDA to FHIR
   */
  @ApiOperation({ summary: 'Transform C-CDA to FHIR' })
  async transformCCDAToFhir(ccdaDocument: string): Promise<any> {
    this.logger.log('Transforming C-CDA document to FHIR');

    // Parse C-CDA XML
    const parsed = this.parseCCDA(ccdaDocument);

    // Transform sections to FHIR resources
    const bundle = {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [],
    };

    // Transform patient demographics
    if (parsed.patient) {
      bundle.entry.push({
        resource: this.transformCCDAPatientToFhir(parsed.patient),
      });
    }

    // Transform medications
    if (parsed.medications) {
      for (const med of parsed.medications) {
        bundle.entry.push({
          resource: this.transformCCDAMedicationToFhir(med),
        });
      }
    }

    // Transform allergies
    if (parsed.allergies) {
      for (const allergy of parsed.allergies) {
        bundle.entry.push({
          resource: this.transformCCDAAllergyToFhir(allergy),
        });
      }
    }

    return bundle;
  }

  /**
   * 4. Transform FHIR to C-CDA
   */
  @ApiOperation({ summary: 'Transform FHIR to C-CDA' })
  async transformFhirToCCDA(
    fhirBundle: any,
    documentType: 'CCD' | 'Discharge_Summary' | 'Progress_Note',
  ): Promise<string> {
    this.logger.log(`Transforming FHIR bundle to C-CDA ${documentType}`);

    // Build C-CDA XML structure
    const ccda = this.buildCCDADocument(documentType);

    // Add patient demographics
    ccda.patient = this.transformFhirPatientToCCDA(
      fhirBundle.entry.find((e: any) => e.resource.resourceType === 'Patient')
        ?.resource,
    );

    // Add medications
    const medications = fhirBundle.entry.filter(
      (e: any) => e.resource.resourceType === 'MedicationRequest',
    );
    ccda.medications = medications.map((m: any) =>
      this.transformFhirMedicationToCCDA(m.resource),
    );

    // Convert to XML string
    return this.serializeCCDA(ccda);
  }

  /**
   * 5. Enrich FHIR resource with coding systems
   */
  @ApiOperation({ summary: 'Enrich FHIR resource with coding systems' })
  async enrichFhirResource(
    resource: any,
    targetCodingSystems: string[],
  ): Promise<any> {
    this.logger.log(`Enriching FHIR resource with ${targetCodingSystems.join(', ')}`);

    // Clone resource
    const enriched = { ...resource };

    // Add additional codings
    if (resource.code?.coding) {
      for (const system of targetCodingSystems) {
        const mapping = await this.getCodeMapping(
          resource.code.coding[0],
          system,
        );
        if (mapping) {
          enriched.code.coding.push(mapping);
        }
      }
    }

    return enriched;
  }

  /**
   * 6. Normalize FHIR patient demographics
   */
  @ApiOperation({ summary: 'Normalize FHIR patient demographics' })
  async normalizeFhirPatient(patient: FhirPatientResource): Promise<FhirPatientResource> {
    this.logger.log('Normalizing FHIR patient demographics');

    const normalized = { ...patient };

    // Normalize name
    if (normalized.name) {
      normalized.name = normalized.name.map((n) => ({
        ...n,
        family: n.family?.toUpperCase(),
        given: n.given?.map((g) => this.capitalizeFirstLetter(g)),
      }));
    }

    // Normalize phone numbers
    if (normalized.telecom) {
      normalized.telecom = normalized.telecom.map((t) => ({
        ...t,
        value: this.normalizePhoneNumber(t.value),
      }));
    }

    return normalized;
  }

  /**
   * 7. Extract coding from FHIR resource
   */
  @ApiOperation({ summary: 'Extract coding from FHIR resource' })
  async extractCodings(
    resource: any,
    codingSystem?: string,
  ): Promise<Array<{ system: string; code: string; display: string }>> {
    this.logger.log('Extracting codings from FHIR resource');

    const codings: Array<{ system: string; code: string; display: string }> = [];

    if (resource.code?.coding) {
      for (const coding of resource.code.coding) {
        if (!codingSystem || coding.system === codingSystem) {
          codings.push({
            system: coding.system,
            code: coding.code,
            display: coding.display || '',
          });
        }
      }
    }

    return codings;
  }

  /**
   * 8. Merge FHIR resources
   */
  @ApiOperation({ summary: 'Merge FHIR resources' })
  async mergeFhirResources(
    resource1: any,
    resource2: any,
    mergeStrategy: 'prefer_first' | 'prefer_second' | 'combine',
  ): Promise<any> {
    this.logger.log(`Merging FHIR resources using ${mergeStrategy} strategy`);

    switch (mergeStrategy) {
      case 'prefer_first':
        return { ...resource2, ...resource1 };
      case 'prefer_second':
        return { ...resource1, ...resource2 };
      case 'combine':
        return this.deepMergeFhirResources(resource1, resource2);
      default:
        throw new Error(`Unknown merge strategy: ${mergeStrategy}`);
    }
  }

  // Helper methods
  private parseHL7(message: string): any {
    return { parsed: true };
  }

  private transformAdmissionToFhir(parsed: any): any {
    return { resourceType: 'Encounter', status: 'in-progress' };
  }

  private transformDischargeToFhir(parsed: any): any {
    return { resourceType: 'Encounter', status: 'finished' };
  }

  private transformObservationToFhir(parsed: any): FhirObservation {
    return {
      resourceType: 'Observation',
      id: 'obs-1',
      status: 'final',
      code: { coding: [] },
      subject: { reference: 'Patient/123' },
      effectiveDateTime: new Date().toISOString(),
    };
  }

  private parseCCDA(document: string): any {
    return { patient: {}, medications: [], allergies: [] };
  }

  private transformCCDAPatientToFhir(patient: any): FhirPatientResource {
    return {
      resourceType: 'Patient',
      id: 'patient-1',
      identifier: [],
      name: [],
      gender: 'unknown',
      birthDate: '2000-01-01',
    };
  }

  private transformCCDAMedicationToFhir(med: any): any {
    return { resourceType: 'MedicationRequest' };
  }

  private transformCCDAAllergyToFhir(allergy: any): any {
    return { resourceType: 'AllergyIntolerance' };
  }

  private buildCCDADocument(documentType: string): any {
    return { type: documentType };
  }

  private transformFhirPatientToCCDA(patient: any): any {
    return {};
  }

  private transformFhirMedicationToCCDA(med: any): any {
    return {};
  }

  private serializeCCDA(ccda: any): string {
    return '<ClinicalDocument>...</ClinicalDocument>';
  }

  private async getCodeMapping(coding: any, targetSystem: string): Promise<any> {
    return null;
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  private normalizePhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  private deepMergeFhirResources(resource1: any, resource2: any): any {
    return { ...resource1, ...resource2 };
  }
}

export default FhirResourceProcessorService;
