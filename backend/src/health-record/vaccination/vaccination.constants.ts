/**
 * @fileoverview Vaccination Constants
 * @module health-record/vaccination
 * @description CDC CVX vaccine codes and school compliance requirements
 *
 * CDC Compliance: CVX codes from https://www2a.cdc.gov/vaccines/iis/iisstandards/vaccines.asp?rpt=cvx
 */

/**
 * CDC CVX Vaccine Codes (subset of commonly used codes)
 * Full list: https://www2a.cdc.gov/vaccines/iis/iisstandards/vaccines.asp?rpt=cvx
 */
export const CDC_CVX_CODES: Record<string, string> = {
  '08': 'Hepatitis B',
  '10': 'Polio (IPV)',
  '20': 'DTaP',
  '21': 'Varicella',
  '03': 'MMR',
  '49': 'Hib',
  '33': 'Pneumococcal (PCV)',
  '83': 'Hepatitis A',
  '115': 'Tdap',
  '62': 'HPV',
  '141': 'Influenza',
  '208': 'COVID-19 (Pfizer)',
  '207': 'COVID-19 (Moderna)',
  '212': 'COVID-19 (Janssen)',
};

/**
 * Vaccination compliance requirement interface
 */
export interface ComplianceRequirement {
  vaccineName: string;
  requiredDoses: number;
  ageRequirement?: number; // in months
}

/**
 * School vaccination requirements (simplified)
 * Based on typical state requirements for K-12 enrollment
 */
export const SCHOOL_REQUIREMENTS: ComplianceRequirement[] = [
  { vaccineName: 'DTaP', requiredDoses: 5 },
  { vaccineName: 'Polio', requiredDoses: 4 },
  { vaccineName: 'MMR', requiredDoses: 2 },
  { vaccineName: 'Hepatitis B', requiredDoses: 3 },
  { vaccineName: 'Varicella', requiredDoses: 2 },
  { vaccineName: 'Hib', requiredDoses: 4, ageRequirement: 60 }, // up to 5 years
];
