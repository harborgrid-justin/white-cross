/**
 * MOCK DATA FACTORY - Healthcare Test Data Generation
 *
 * Factory functions for generating realistic test data
 * All data is synthetic and HIPAA-compliant (no real PHI)
 */

import {
  generatePatientId,
  generateMedicationId,
  generateProviderId,
  generateAppointmentId,
  generateBarcode,
  generateDEANumber,
  generateNPI,
  generateMRN,
  generateICD10Code,
  generateCPTCode,
  generateNDCCode,
  futureDate,
  pastDate,
} from './test-helpers';

/**
 * Patient Factory
 */
export class PatientFactory {
  static create(overrides?: Partial<any>): any {
    return {
      id: generatePatientId(),
      mrn: generateMRN(),
      firstName: 'Test',
      lastName: 'Patient',
      dateOfBirth: new Date('1980-01-01'),
      gender: 'M',
      allergies: [],
      medications: [],
      diagnoses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createMany(count: number, overrides?: Partial<any>): any[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  static createWithAllergies(allergies: string[]): any {
    return this.create({ allergies });
  }

  static createWithMedications(medications: any[]): any {
    return this.create({ medications });
  }
}

/**
 * Medication Factory
 */
export class MedicationFactory {
  static create(overrides?: Partial<any>): any {
    return {
      id: generateMedicationId(),
      name: 'Test Medication',
      genericName: 'testmedication',
      ndcCode: generateNDCCode(),
      dosage: '250mg',
      route: 'ORAL',
      frequency: 'BID',
      prescribedBy: generateProviderId(),
      prescribedDate: new Date(),
      isControlled: false,
      schedule: null,
      ...overrides,
    };
  }

  static createControlled(schedule: string = 'II'): any {
    return this.create({
      isControlled: true,
      schedule,
      name: 'Controlled Substance Test',
    });
  }

  static createPRN(): any {
    return this.create({
      frequency: 'PRN',
      prnReason: 'Pain',
      minHoursBetweenDoses: 4,
    });
  }

  static createMany(count: number, overrides?: Partial<any>): any[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

/**
 * Prescription Factory
 */
export class PrescriptionFactory {
  static create(overrides?: Partial<any>): any {
    return {
      id: `rx-${Math.random().toString(36).substring(2, 11)}`,
      patientId: generatePatientId(),
      medicationId: generateMedicationId(),
      prescriberId: generateProviderId(),
      medication: MedicationFactory.create(),
      dosage: '250mg',
      route: 'ORAL',
      frequency: 'BID',
      duration: '30 days',
      refills: 2,
      dispenseQuantity: 60,
      prescribedDate: new Date(),
      status: 'ACTIVE',
      ...overrides,
    };
  }

  static createEPCS(deaNumber?: string): any {
    return this.create({
      medication: MedicationFactory.createControlled('II'),
      isControlled: true,
      epcsRequired: true,
      deaNumber: deaNumber || generateDEANumber(),
    });
  }

  static createMany(count: number, overrides?: Partial<any>): any[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

/**
 * Appointment Factory
 */
export class AppointmentFactory {
  static create(overrides?: Partial<any>): any {
    return {
      id: generateAppointmentId(),
      patientId: generatePatientId(),
      providerId: generateProviderId(),
      appointmentDate: futureDate(7),
      appointmentType: 'CHECKUP',
      status: 'SCHEDULED',
      duration: 30,
      location: 'Main Clinic',
      reason: 'Annual physical',
      notes: '',
      createdAt: new Date(),
      ...overrides,
    };
  }

  static createUpcoming(daysFromNow: number = 7): any {
    return this.create({
      appointmentDate: futureDate(daysFromNow),
      status: 'SCHEDULED',
    });
  }

  static createPast(daysAgo: number = 30): any {
    return this.create({
      appointmentDate: pastDate(daysAgo),
      status: 'COMPLETED',
    });
  }

  static createCheckedIn(): any {
    return this.create({
      appointmentDate: new Date(),
      status: 'CHECKED_IN',
      checkedInAt: new Date(),
    });
  }

  static createMany(count: number, overrides?: Partial<any>): any[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

/**
 * Provider Factory
 */
export class ProviderFactory {
  static create(overrides?: Partial<any>): any {
    return {
      id: generateProviderId(),
      npi: generateNPI(),
      deaNumber: generateDEANumber(),
      firstName: 'Test',
      lastName: 'Provider',
      specialty: 'Internal Medicine',
      licenseNumber: `LIC-${Math.floor(100000 + Math.random() * 900000)}`,
      canPrescribeControlled: true,
      ...overrides,
    };
  }

  static createMany(count: number, overrides?: Partial<any>): any[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

/**
 * Administration Record Factory (for MAR)
 */
export class AdministrationRecordFactory {
  static create(overrides?: Partial<any>): any {
    return {
      id: `admin-${Math.random().toString(36).substring(2, 11)}`,
      patientId: generatePatientId(),
      medicationId: generateMedicationId(),
      dosage: '250mg',
      route: 'ORAL',
      administeredBy: generateProviderId(),
      administeredAt: new Date(),
      status: 'COMPLETED',
      notes: '',
      barcodeScan: {
        medicationBarcode: generateBarcode('MED'),
        patientBarcode: generateBarcode('PAT'),
        timestamp: new Date(),
      },
      ...overrides,
    };
  }

  static createMissed(reason: string): any {
    return this.create({
      status: 'MISSED',
      missedReason: reason,
      administeredAt: null,
    });
  }

  static createPRN(painScore?: number): any {
    return this.create({
      isPRN: true,
      prnReason: 'Pain',
      painScore: painScore || 7,
    });
  }

  static createMany(count: number, overrides?: Partial<any>): any[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

/**
 * Lab Result Factory
 */
export class LabResultFactory {
  static create(overrides?: Partial<any>): any {
    return {
      id: `lab-${Math.random().toString(36).substring(2, 11)}`,
      patientId: generatePatientId(),
      orderId: `order-${Math.random().toString(36).substring(2, 11)}`,
      testName: 'Complete Blood Count',
      testCode: 'CBC',
      result: 'Normal',
      value: '12.5',
      units: 'g/dL',
      referenceRange: '12.0-15.5',
      status: 'FINAL',
      performedAt: new Date(),
      resultedAt: new Date(),
      performedBy: generateProviderId(),
      isCritical: false,
      ...overrides,
    };
  }

  static createCritical(): any {
    return this.create({
      isCritical: true,
      value: '18.5',
      status: 'CRITICAL',
    });
  }

  static createMany(count: number, overrides?: Partial<any>): any[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

/**
 * Diagnosis Factory
 */
export class DiagnosisFactory {
  static create(overrides?: Partial<any>): any {
    return {
      id: `dx-${Math.random().toString(36).substring(2, 11)}`,
      patientId: generatePatientId(),
      icd10Code: generateICD10Code(),
      description: 'Test Diagnosis',
      diagnosedBy: generateProviderId(),
      diagnosedDate: new Date(),
      status: 'ACTIVE',
      isPrimary: false,
      ...overrides,
    };
  }

  static createMany(count: number, overrides?: Partial<any>): any[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

/**
 * Allergy Factory
 */
export class AllergyFactory {
  static create(overrides?: Partial<any>): any {
    return {
      id: `allergy-${Math.random().toString(36).substring(2, 11)}`,
      patientId: generatePatientId(),
      allergen: 'Penicillin',
      allergenType: 'MEDICATION',
      reaction: 'Rash',
      severity: 'MODERATE',
      onsetDate: pastDate(365),
      status: 'ACTIVE',
      ...overrides,
    };
  }

  static createSevere(allergen: string): any {
    return this.create({
      allergen,
      severity: 'SEVERE',
      reaction: 'Anaphylaxis',
    });
  }

  static createMany(count: number, overrides?: Partial<any>): any[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

/**
 * Consent Record Factory (HIPAA)
 */
export class ConsentFactory {
  static create(overrides?: Partial<any>): any {
    return {
      id: `consent-${Math.random().toString(36).substring(2, 11)}`,
      patientId: generatePatientId(),
      consentType: 'treatment',
      status: 'active',
      effectiveDate: new Date(),
      expirationDate: null,
      consentedBy: generatePatientId(),
      witnessedBy: generateProviderId(),
      documentUrl: '/consents/test-consent.pdf',
      ...overrides,
    };
  }

  static createRevoked(): any {
    return this.create({
      status: 'revoked',
      revokedDate: new Date(),
      revokedReason: 'Patient request',
    });
  }

  static createMany(count: number, overrides?: Partial<any>): any[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

/**
 * Clinical Context Factory (for CDS)
 */
export class ClinicalContextFactory {
  static create(overrides?: Partial<any>): any {
    return {
      diagnoses: [generateICD10Code()],
      medications: MedicationFactory.createMany(3),
      allergies: ['Penicillin'],
      labResults: LabResultFactory.createMany(2),
      vitalSigns: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.6,
        respiratoryRate: 16,
        oxygenSaturation: 98,
      },
      ...overrides,
    };
  }
}

/**
 * FHIR Resource Factory
 */
export class FHIRResourceFactory {
  static createPatient(overrides?: Partial<any>): any {
    return {
      resourceType: 'Patient',
      id: generatePatientId(),
      identifier: [
        {
          system: 'http://hospital.example.org/mrn',
          value: generateMRN(),
        },
      ],
      name: [
        {
          family: 'Patient',
          given: ['Test'],
        },
      ],
      gender: 'male',
      birthDate: '1980-01-01',
      ...overrides,
    };
  }

  static createMedicationRequest(overrides?: Partial<any>): any {
    return {
      resourceType: 'MedicationRequest',
      id: `medreq-${Math.random().toString(36).substring(2, 11)}`,
      status: 'active',
      intent: 'order',
      medicationCodeableConcept: {
        coding: [
          {
            system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
            code: '313782',
            display: 'Test Medication',
          },
        ],
      },
      subject: {
        reference: `Patient/${generatePatientId()}`,
      },
      ...overrides,
    };
  }

  static createObservation(overrides?: Partial<any>): any {
    return {
      resourceType: 'Observation',
      id: `obs-${Math.random().toString(36).substring(2, 11)}`,
      status: 'final',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: 'vital-signs',
              display: 'Vital Signs',
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: '8867-4',
            display: 'Heart rate',
          },
        ],
      },
      valueQuantity: {
        value: 72,
        unit: 'beats/minute',
        system: 'http://unitsofmeasure.org',
        code: '/min',
      },
      ...overrides,
    };
  }
}

/**
 * HL7 Message Factory
 */
export class HL7MessageFactory {
  static createADT_A01(): string {
    const mrn = generateMRN();
    return `MSH|^~\\&|SENDING_APP|SENDING_FACILITY|RECEIVING_APP|RECEIVING_FACILITY|20240115120000||ADT^A01|MSG00001|P|2.5
EVN|A01|20240115120000
PID|1||${mrn}||Patient^Test||19800101|M|||123 Main St^^City^ST^12345`;
  }

  static createORM_O01(): string {
    return `MSH|^~\\&|SENDING_APP|SENDING_FACILITY|RECEIVING_APP|RECEIVING_FACILITY|20240115120000||ORM^O01|MSG00002|P|2.5
PID|1||MRN123||Patient^Test||19800101|M
ORC|NW|ORD123|||||^^^20240115120000
OBR|1|ORD123||CBC^Complete Blood Count|||20240115120000`;
  }

  static createORU_R01(): string {
    return `MSH|^~\\&|LAB|SENDING_FACILITY|RECEIVING_APP|RECEIVING_FACILITY|20240115120000||ORU^R01|MSG00003|P|2.5
PID|1||MRN123||Patient^Test||19800101|M
OBR|1||LAB123|CBC^Complete Blood Count|||20240115120000
OBX|1|NM|WBC^White Blood Cell Count||7.5|10^9/L|4.5-11.0||||F`;
  }
}
