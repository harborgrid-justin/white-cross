/**
 * WF-COMP-IMM | immunizations.codes.ts - CDC Vaccine Codes
 * Purpose: CDC-standardized vaccine identification codes and classifications
 * Upstream: CDC CVX code system, CDC ACIP Guidelines
 * Downstream: Immunization records, compliance tracking, reporting
 * Related: immunizations.records.ts, immunizations.forms.ts
 * Exports: VaccineCode, VaccineType, VaccineCategory
 * Last Updated: 2025-11-12 | File Type: .ts
 * LLM Context: CDC CVX codes for standardized vaccine identification
 */

// ==========================================
// CDC VACCINE CODES (CVX)
// ==========================================

/**
 * CDC Vaccine Codes (CVX) - Standardized vaccine identification
 * @see https://www2a.cdc.gov/vaccines/iis/iisstandards/vaccines.asp?rpt=cvx
 */
export type VaccineCode =
  | 'CVX_03'  // MMR (Measles, Mumps, Rubella)
  | 'CVX_08'  // Hepatitis B (pediatric/adolescent)
  | 'CVX_10'  // Polio (IPV)
  | 'CVX_20'  // DTaP (Diphtheria, Tetanus, Pertussis)
  | 'CVX_21'  // Varicella (Chickenpox)
  | 'CVX_94'  // MMRV (Measles, Mumps, Rubella, Varicella)
  | 'CVX_106' // DTaP, 5 pertussis antigens
  | 'CVX_110' // DTaP-hepatitis B-IPV
  | 'CVX_114' // Meningococcal MCV4P
  | 'CVX_115' // Tdap (Tetanus, Diphtheria, Pertussis)
  | 'CVX_116' // Rotavirus, pentavalent
  | 'CVX_119' // Rotavirus, monovalent
  | 'CVX_120' // DTaP-Hib-IPV
  | 'CVX_121' // Zoster vaccine, live
  | 'CVX_122' // Rotavirus vaccine, NOS
  | 'CVX_133' // Pneumococcal conjugate PCV 13
  | 'CVX_136' // Meningococcal MCV4O
  | 'CVX_141' // Influenza, seasonal, injectable
  | 'CVX_144' // Influenza, seasonal, intradermal
  | 'CVX_149' // Influenza, live, intranasal
  | 'CVX_150' // Influenza, injectable, quadrivalent
  | 'CVX_152' // Pneumococcal conjugate, NOS
  | 'CVX_155' // Influenza, recombinant
  | 'CVX_158' // Influenza, injectable, quadrivalent
  | 'CVX_161' // Influenza, injectable, quadrivalent, preservative free
  | 'CVX_165' // HPV9 (Human Papillomavirus, 9-valent)
  | 'CVX_171' // Influenza, injectable, MDCK, preservative free
  | 'CVX_185' // Influenza, recombinant, quadrivalent
  | 'CVX_186' // Influenza, injectable, MDCK, quadrivalent, preservative free
  | 'CVX_187' // Zoster vaccine, recombinant
  | 'CVX_203' // Meningococcal B, recombinant
  | 'CVX_205' // Influenza, quadrivalent, cell culture based
  | 'CVX_207' // COVID-19, mRNA, LNP-S, PF, 30 mcg/0.3 mL dose
  | 'CVX_208' // COVID-19, mRNA, LNP-S, PF, 100 mcg/0.5 mL dose
  | 'CVX_210' // COVID-19 vaccine, vector-nr, rS-ChAdOx1, PF, 0.5 mL
  | 'CVX_211' // COVID-19, subunit, rS-nanoparticle+Matrix-M1 Adjuvant, PF, 0.5 mL
  | 'CVX_212' // COVID-19 vaccine, vector-nr, rS-Ad26, PF, 0.5 mL
  | 'CVX_213' // SARS-COV-2 (COVID-19) vaccine, UNSPECIFIED
  | 'CVX_300' // COVID-19, mRNA, LNP-S, bivalent, PF, 30 mcg/0.3 mL
  | 'CVX_301' // COVID-19, mRNA, LNP-S, bivalent, PF, 10 mcg/0.2 mL
  | 'CVX_302'; // COVID-19, mRNA, LNP-S, bivalent, PF, 50 mcg/0.5 mL

/**
 * Vaccine types for UI categorization
 */
export type VaccineType =
  | 'routine'      // Standard childhood/adolescent vaccines
  | 'catch_up'     // Catch-up schedules for missed vaccines
  | 'travel'       // Travel-related vaccines
  | 'outbreak'     // Outbreak response vaccines
  | 'occupational' // Healthcare worker vaccines
  | 'seasonal';    // Seasonal vaccines (flu, etc.)

/**
 * Vaccine categories for organizing immunization records
 */
export type VaccineCategory =
  | 'viral'
  | 'bacterial'
  | 'combination'
  | 'live_attenuated'
  | 'inactivated'
  | 'recombinant'
  | 'toxoid'
  | 'mRNA';
