/**
 * Health Records Integration Functions
 * External API integrations for vaccine databases, ICD codes, and CDC growth charts
 */

import axios from 'axios';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface VaccineInfo {
  cvxCode: string;
  shortDescription: string;
  fullVaccineName: string;
  vaccineStatus: 'Active' | 'Inactive';
  notes?: string;
}

interface NDCVaccineInfo extends VaccineInfo {
  ndcCode: string;
  manufacturer: string;
  mvxCode?: string;
}

interface ICDCodeInfo {
  code: string;
  description: string;
  category: string;
  isValid: boolean;
  version: string;
  effectiveDate?: Date;
}

interface StateVaccinationRequirement {
  state: string;
  grade: string;
  requiredVaccines: Array<{
    vaccine: string;
    cvxCode: string;
    minimumDoses: number;
    ageRequirements?: string;
    notes?: string;
  }>;
  exemptionsAllowed: string[];
  conditionalEntry?: boolean;
  source: string;
  lastUpdated: Date;
}

interface CDCGrowthChartData {
  age: number; // months
  gender: 'M' | 'F';
  percentiles: {
    height: Record<number, number>; // percentile -> cm
    weight: Record<number, number>; // percentile -> kg
    bmi: Record<number, number>;    // percentile -> bmi
    headCircumference?: Record<number, number>; // percentile -> cm (for <36 months)
  };
}

// ============================================================================
// CDC VACCINE DATABASE INTEGRATION
// ============================================================================

/**
 * CVX (Vaccine Administered) Code Database
 * Source: CDC National Center for Immunization and Respiratory Diseases (NCIRD)
 */
const CVX_DATABASE: Record<string, VaccineInfo> = {
  '03': {
    cvxCode: '03',
    shortDescription: 'MMR',
    fullVaccineName: 'measles, mumps and rubella virus vaccine',
    vaccineStatus: 'Active'
  },
  '08': {
    cvxCode: '08',
    shortDescription: 'Hep B, adolescent or pediatric',
    fullVaccineName: 'hepatitis B vaccine, pediatric or pediatric/adolescent dosage',
    vaccineStatus: 'Active'
  },
  '10': {
    cvxCode: '10',
    shortDescription: 'IPV',
    fullVaccineName: 'poliovirus vaccine, inactivated',
    vaccineStatus: 'Active'
  },
  '20': {
    cvxCode: '20',
    shortDescription: 'DTaP',
    fullVaccineName: 'diphtheria, tetanus toxoids and acellular pertussis vaccine',
    vaccineStatus: 'Active'
  },
  '21': {
    cvxCode: '21',
    shortDescription: 'varicella',
    fullVaccineName: 'varicella virus vaccine',
    vaccineStatus: 'Active'
  },
  '83': {
    cvxCode: '83',
    shortDescription: 'Hep A, ped/adol, 2 dose',
    fullVaccineName: 'hepatitis A vaccine, pediatric/adolescent dosage, 2 dose schedule',
    vaccineStatus: 'Active'
  },
  '94': {
    cvxCode: '94',
    shortDescription: 'MMRV',
    fullVaccineName: 'measles, mumps, rubella, and varicella virus vaccine',
    vaccineStatus: 'Active'
  },
  '114': {
    cvxCode: '114',
    shortDescription: 'MCV4P',
    fullVaccineName: 'meningococcal polysaccharide (groups A, C, Y and W-135) diphtheria toxoid conjugate vaccine',
    vaccineStatus: 'Active'
  },
  '115': {
    cvxCode: '115',
    shortDescription: 'Tdap',
    fullVaccineName: 'tetanus toxoid, reduced diphtheria toxoid, and acellular pertussis vaccine, adulthood',
    vaccineStatus: 'Active'
  },
  '121': {
    cvxCode: '121',
    shortDescription: 'zoster',
    fullVaccineName: 'zoster vaccine, live',
    vaccineStatus: 'Active'
  },
  '133': {
    cvxCode: '133',
    shortDescription: 'PCV13',
    fullVaccineName: 'pneumococcal conjugate vaccine, 13 valent',
    vaccineStatus: 'Active'
  },
  '137': {
    cvxCode: '137',
    shortDescription: 'HPV, unspecified formulation',
    fullVaccineName: 'HPV, unspecified formulation',
    vaccineStatus: 'Active'
  },
  '141': {
    cvxCode: '141',
    shortDescription: 'Influenza, seasonal, injectable',
    fullVaccineName: 'Influenza, seasonal, injectable',
    vaccineStatus: 'Active'
  },
  '152': {
    cvxCode: '152',
    shortDescription: 'Pneumococcal Conjugate, unspecified formulation',
    fullVaccineName: 'Pneumococcal Conjugate, unspecified formulation',
    vaccineStatus: 'Active'
  },
  '165': {
    cvxCode: '165',
    shortDescription: 'HPV9',
    fullVaccineName: 'Human Papillomavirus 9-valent vaccine',
    vaccineStatus: 'Active'
  },
  '187': {
    cvxCode: '187',
    shortDescription: 'zoster recombinant',
    fullVaccineName: 'zoster vaccine recombinant',
    vaccineStatus: 'Active'
  },
  '208': {
    cvxCode: '208',
    shortDescription: 'COVID-19, mRNA, LNP-S, PF, 30 mcg/0.3 mL dose',
    fullVaccineName: 'COVID-19, mRNA, LNP-S, PF, 30 mcg/0.3 mL dose',
    vaccineStatus: 'Active'
  },
  '212': {
    cvxCode: '212',
    shortDescription: 'COVID-19, vector-nr, rS-ChAdOx1, PF, 0.5 mL',
    fullVaccineName: 'COVID-19, vector-nr, rS-ChAdOx1, PF, 0.5 mL',
    vaccineStatus: 'Active'
  }
};

/**
 * Look up vaccine information by CVX code
 */
export function lookupCVXCode(cvx: string): VaccineInfo | null {
  const code = cvx.trim().padStart(2, '0'); // Ensure 2-digit format
  return CVX_DATABASE[code] || null;
}

/**
 * Search vaccines by name
 */
export function searchVaccineByName(name: string): VaccineInfo[] {
  const searchTerm = name.toLowerCase();
  return Object.values(CVX_DATABASE).filter(vaccine =>
    vaccine.shortDescription.toLowerCase().includes(searchTerm) ||
    vaccine.fullVaccineName.toLowerCase().includes(searchTerm)
  );
}

/**
 * Get all active vaccines
 */
export function getAllActiveVaccines(): VaccineInfo[] {
  return Object.values(CVX_DATABASE).filter(v => v.vaccineStatus === 'Active');
}

// ============================================================================
// NDC DATABASE INTEGRATION
// ============================================================================

/**
 * NDC (National Drug Code) Database
 * Simplified version - production would integrate with FDA NDC database
 */
const NDC_DATABASE: Record<string, NDCVaccineInfo> = {
  '00006-4045-00': {
    ndcCode: '00006-4045-00',
    cvxCode: '08',
    shortDescription: 'Recombivax HB',
    fullVaccineName: 'hepatitis B vaccine, recombinant',
    manufacturer: 'Merck & Co., Inc.',
    mvxCode: 'MSD',
    vaccineStatus: 'Active'
  },
  '00006-4047-00': {
    ndcCode: '00006-4047-00',
    cvxCode: '03',
    shortDescription: 'M-M-R II',
    fullVaccineName: 'measles, mumps, and rubella vaccine, live',
    manufacturer: 'Merck & Co., Inc.',
    mvxCode: 'MSD',
    vaccineStatus: 'Active'
  },
  '00006-4827-00': {
    ndcCode: '00006-4827-00',
    cvxCode: '21',
    shortDescription: 'Varivax',
    fullVaccineName: 'varicella virus vaccine live',
    manufacturer: 'Merck & Co., Inc.',
    mvxCode: 'MSD',
    vaccineStatus: 'Active'
  },
  '49281-0400-10': {
    ndcCode: '49281-0400-10',
    cvxCode: '20',
    shortDescription: 'Daptacel',
    fullVaccineName: 'diphtheria and tetanus toxoids and acellular pertussis vaccine adsorbed',
    manufacturer: 'Sanofi Pasteur Inc.',
    mvxCode: 'PMC',
    vaccineStatus: 'Active'
  },
  '58160-0842-11': {
    ndcCode: '58160-0842-11',
    cvxCode: '137',
    shortDescription: 'Gardasil 9',
    fullVaccineName: 'human papillomavirus 9-valent vaccine, recombinant',
    manufacturer: 'Merck Sharp & Dohme Corp.',
    mvxCode: 'MSD',
    vaccineStatus: 'Active'
  }
};

/**
 * Look up vaccine by NDC code
 */
export function lookupVaccineByNDC(ndc: string): NDCVaccineInfo | null {
  // Normalize NDC format
  const normalized = ndc.replace(/[^0-9-]/g, '');
  return NDC_DATABASE[normalized] || null;
}

/**
 * Get manufacturer information
 */
export function getManufacturerByMVX(mvxCode: string): {
  code: string;
  name: string;
} | null {
  const manufacturers: Record<string, string> = {
    'MSD': 'Merck & Co., Inc.',
    'PMC': 'Sanofi Pasteur Inc.',
    'SKB': 'GlaxoSmithKline Biologicals',
    'WAL': 'Wyeth-Ayerst',
    'PFR': 'Pfizer, Inc.',
    'JNJ': 'Janssen Products, LP',
    'MOD': 'ModernaTX, Inc.'
  };

  const name = manufacturers[mvxCode];
  return name ? { code: mvxCode, name } : null;
}

// ============================================================================
// ICD-10 CODE VALIDATION
// ============================================================================

/**
 * ICD-10 Common Codes Database (Pediatric Focus)
 * Simplified version - production would integrate with CMS ICD-10 API
 */
const ICD10_DATABASE: Record<string, ICDCodeInfo> = {
  'E11.9': {
    code: 'E11.9',
    description: 'Type 2 diabetes mellitus without complications',
    category: 'Endocrine, nutritional and metabolic diseases',
    isValid: true,
    version: '2024'
  },
  'E10.9': {
    code: 'E10.9',
    description: 'Type 1 diabetes mellitus without complications',
    category: 'Endocrine, nutritional and metabolic diseases',
    isValid: true,
    version: '2024'
  },
  'J45.40': {
    code: 'J45.40',
    description: 'Moderate persistent asthma, uncomplicated',
    category: 'Diseases of the respiratory system',
    isValid: true,
    version: '2024'
  },
  'J45.50': {
    code: 'J45.50',
    description: 'Severe persistent asthma, uncomplicated',
    category: 'Diseases of the respiratory system',
    isValid: true,
    version: '2024'
  },
  'G40.909': {
    code: 'G40.909',
    description: 'Epilepsy, unspecified, not intractable, without status epilepticus',
    category: 'Diseases of the nervous system',
    isValid: true,
    version: '2024'
  },
  'T78.1XXA': {
    code: 'T78.1XXA',
    description: 'Other adverse food reactions, not elsewhere classified, initial encounter',
    category: 'Injury, poisoning and certain other consequences of external causes',
    isValid: true,
    version: '2024'
  },
  'T78.40XA': {
    code: 'T78.40XA',
    description: 'Allergy, unspecified, initial encounter',
    category: 'Injury, poisoning and certain other consequences of external causes',
    isValid: true,
    version: '2024'
  },
  'F90.2': {
    code: 'F90.2',
    description: 'Attention-deficit hyperactivity disorder, combined type',
    category: 'Mental, Behavioral and Neurodevelopmental disorders',
    isValid: true,
    version: '2024'
  },
  'F41.1': {
    code: 'F41.1',
    description: 'Generalized anxiety disorder',
    category: 'Mental, Behavioral and Neurodevelopmental disorders',
    isValid: true,
    version: '2024'
  },
  'E66.9': {
    code: 'E66.9',
    description: 'Obesity, unspecified',
    category: 'Endocrine, nutritional and metabolic diseases',
    isValid: true,
    version: '2024'
  }
};

/**
 * Validate ICD-10 code
 */
export async function validateICDCode(code: string): Promise<ICDCodeInfo> {
  const formatted = code.trim().toUpperCase();

  // Check local database first
  if (ICD10_DATABASE[formatted]) {
    return ICD10_DATABASE[formatted];
  }

  // In production, this would call CMS ICD-10 API
  // For now, validate format only
  const icd10Pattern = /^[A-Z][0-9]{2}(\.[0-9A-Z]{1,4})?$/;
  const isValidFormat = icd10Pattern.test(formatted);

  return {
    code: formatted,
    description: isValidFormat ? 'Valid ICD-10 code format (details not in database)' : 'Invalid ICD-10 code format',
    category: 'Unknown',
    isValid: isValidFormat,
    version: '2024'
  };
}

/**
 * Search ICD-10 codes by description
 */
export function searchICDCodes(searchTerm: string): ICDCodeInfo[] {
  const term = searchTerm.toLowerCase();
  return Object.values(ICD10_DATABASE).filter(icd =>
    icd.description.toLowerCase().includes(term) ||
    icd.category.toLowerCase().includes(term)
  );
}

/**
 * Get ICD-10 codes by category
 */
export function getICDCodesByCategory(category: string): ICDCodeInfo[] {
  return Object.values(ICD10_DATABASE).filter(icd =>
    icd.category === category
  );
}

// ============================================================================
// STATE VACCINATION REQUIREMENTS
// ============================================================================

/**
 * Get state-specific vaccination requirements
 * Based on state immunization requirements for school entry
 */
export async function checkStateVaccinationRequirements(
  state: string,
  grade: string
): Promise<StateVaccinationRequirement> {
  // This is a simplified version. Production would integrate with state health department APIs
  // or maintain a comprehensive database of state requirements

  const stateCode = state.toUpperCase();
  const gradeLevel = grade.toLowerCase();

  // Default requirements based on CDC recommendations
  const baseRequirements: StateVaccinationRequirement = {
    state: stateCode,
    grade: gradeLevel,
    requiredVaccines: [
      {
        vaccine: 'DTaP/Tdap',
        cvxCode: '20',
        minimumDoses: gradeLevel.includes('k') || parseInt(gradeLevel) <= 6 ? 5 : 1,
        ageRequirements: gradeLevel.includes('k') ? '4-6 years' : '11-12 years',
        notes: 'Tdap booster required for 7th grade and above'
      },
      {
        vaccine: 'Polio (IPV)',
        cvxCode: '10',
        minimumDoses: 4,
        ageRequirements: 'Final dose at age 4 or older'
      },
      {
        vaccine: 'MMR',
        cvxCode: '03',
        minimumDoses: 2,
        ageRequirements: 'First dose at 12-15 months, second dose at 4-6 years'
      },
      {
        vaccine: 'Varicella',
        cvxCode: '21',
        minimumDoses: 2,
        ageRequirements: 'First dose at 12-15 months, second dose at 4-6 years'
      },
      {
        vaccine: 'Hepatitis B',
        cvxCode: '08',
        minimumDoses: 3,
        ageRequirements: 'Birth series'
      }
    ],
    exemptionsAllowed: ['MEDICAL', 'RELIGIOUS'],
    conditionalEntry: true,
    source: 'CDC ACIP Schedule',
    lastUpdated: new Date()
  };

  // Add grade-specific requirements
  if (gradeLevel.includes('7') || gradeLevel.includes('8') || parseInt(gradeLevel) >= 7) {
    baseRequirements.requiredVaccines.push({
      vaccine: 'Meningococcal (MenACWY)',
      cvxCode: '114',
      minimumDoses: 1,
      ageRequirements: '11-12 years',
      notes: 'Booster at age 16 recommended'
    });
  }

  // State-specific modifications
  if (stateCode === 'CA') {
    // California - stricter exemption rules
    baseRequirements.exemptionsAllowed = ['MEDICAL'];
    baseRequirements.conditionalEntry = false;
  } else if (stateCode === 'MS' || stateCode === 'WV') {
    // Mississippi and West Virginia - medical exemptions only
    baseRequirements.exemptionsAllowed = ['MEDICAL'];
  } else if (stateCode === 'TX' || stateCode === 'AR') {
    // Texas and Arkansas - allow all exemption types
    baseRequirements.exemptionsAllowed = ['MEDICAL', 'RELIGIOUS', 'PHILOSOPHICAL'];
  }

  return baseRequirements;
}

/**
 * Get exemption rules for a state
 */
export function getExemptionRules(state: string): {
  medical: boolean;
  religious: boolean;
  philosophical: boolean;
  requiresDocumentation: boolean;
  requiresEducation: boolean;
} {
  const strictStates = ['CA', 'MS', 'WV', 'NY', 'ME'];
  const isStrict = strictStates.includes(state.toUpperCase());

  return {
    medical: true, // All states allow medical exemptions
    religious: !isStrict,
    philosophical: !isStrict && !['LA', 'TN'].includes(state.toUpperCase()),
    requiresDocumentation: true,
    requiresEducation: isStrict
  };
}

// ============================================================================
// CDC GROWTH CHART DATA
// ============================================================================

/**
 * Get CDC growth chart data for age and gender
 * Based on CDC/WHO growth standards
 */
export async function getCDCGrowthChartData(
  ageMonths: number,
  gender: 'MALE' | 'FEMALE' | 'M' | 'F'
): Promise<CDCGrowthChartData> {
  const genderCode = gender.startsWith('M') ? 'M' : 'F';

  // This is simplified data. Production would use actual CDC LMS tables
  // Source: CDC Clinical Growth Charts (2000) and WHO Child Growth Standards (2006)

  // Example percentile values (would be loaded from comprehensive tables)
  const data: CDCGrowthChartData = {
    age: ageMonths,
    gender: genderCode,
    percentiles: {
      height: {
        3: 0,
        5: 0,
        10: 0,
        25: 0,
        50: 0,
        75: 0,
        90: 0,
        95: 0,
        97: 0
      },
      weight: {
        3: 0,
        5: 0,
        10: 0,
        25: 0,
        50: 0,
        75: 0,
        90: 0,
        95: 0,
        97: 0
      },
      bmi: {
        3: 0,
        5: 0,
        10: 0,
        25: 0,
        50: 0,
        75: 0,
        90: 0,
        95: 0,
        97: 0
      }
    }
  };

  // Add head circumference for infants/toddlers
  if (ageMonths < 36) {
    data.percentiles.headCircumference = {
      3: 0,
      5: 0,
      10: 0,
      25: 0,
      50: 0,
      75: 0,
      90: 0,
      95: 0,
      97: 0
    };
  }

  // In production, this would calculate actual values from LMS tables
  // LMS Method: percentile = M * (1 + L * S * Z)^(1/L)
  // Where: L = skewness, M = median, S = coefficient of variation, Z = z-score for percentile

  return data;
}

/**
 * Calculate Z-score for a measurement
 */
export function calculateZScore(
  value: number,
  L: number,
  M: number,
  S: number
): number {
  // LMS method for z-score calculation
  if (L !== 0) {
    return (Math.pow(value / M, L) - 1) / (L * S);
  } else {
    // Box-Cox transformation when L = 0
    return Math.log(value / M) / S;
  }
}

/**
 * Convert z-score to percentile
 */
export function zScoreToPercentile(zScore: number): number {
  // Using standard normal distribution
  // Simplified - production would use statistical library
  const t = 1 / (1 + 0.2316419 * Math.abs(zScore));
  const d = 0.3989423 * Math.exp(-zScore * zScore / 2);
  const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

  const percentile = zScore > 0 ? (1 - probability) * 100 : probability * 100;
  return Math.round(percentile * 100) / 100; // Round to 2 decimals
}

// ============================================================================
// EXTERNAL API INTEGRATION (PLACEHOLDER)
// ============================================================================

/**
 * Fetch data from external API
 * This would be used for real-time data from CDC, FDA, etc.
 */
async function fetchExternalData(
  endpoint: string,
  params?: Record<string, any>
): Promise<any> {
  try {
    // In production, this would call actual APIs
    // Example endpoints:
    // - CDC API: https://data.cdc.gov/api/
    // - CMS ICD-10 API: https://clinicaltables.nlm.nih.gov/api/icd10cm/
    // - FDA NDC API: https://api.fda.gov/drug/ndc.json

    console.warn('External API integration not implemented - using local database');
    return null;
  } catch (error) {
    console.error('Error fetching external data:', error);
    throw error;
  }
}

// ============================================================================
// EXPORT ALL FUNCTIONS
// ============================================================================

export default {
  // Vaccine lookups
  lookupCVXCode,
  lookupVaccineByNDC,
  searchVaccineByName,
  getAllActiveVaccines,
  getManufacturerByMVX,

  // ICD codes
  validateICDCode,
  searchICDCodes,
  getICDCodesByCategory,

  // State requirements
  checkStateVaccinationRequirements,
  getExemptionRules,

  // Growth charts
  getCDCGrowthChartData,
  calculateZScore,
  zScoreToPercentile
};
