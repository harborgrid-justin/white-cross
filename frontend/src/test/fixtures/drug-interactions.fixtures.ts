/**
 * Drug Interaction Test Fixtures
 * Synthetic test data for drug interaction checking
 * NO REAL PHI DATA - All data is synthetic for testing only
 */

import type {
  Drug,
  DrugInteraction,
  DrugCheckRequest,
  DrugCheckResult,
} from '@/types/drug-interaction.types';

export const drugInteractionFixtures = {
  /**
   * Sample medications
   */
  drugs: {
    aspirin: {
      id: 'drug-1',
      name: 'Aspirin',
      genericName: 'Acetylsalicylic acid',
      brandNames: ['Bayer Aspirin', 'Ecotrin', 'Bufferin'],
      dosageForms: ['Tablet', 'Chewable Tablet'],
      strengths: ['81mg', '325mg', '500mg'],
      category: 'NSAID',
      controlledSubstance: false,
    } as Drug,

    ibuprofen: {
      id: 'drug-2',
      name: 'Ibuprofen',
      genericName: 'Ibuprofen',
      brandNames: ['Advil', 'Motrin', 'Nuprin'],
      dosageForms: ['Tablet', 'Liquid', 'Capsule'],
      strengths: ['200mg', '400mg', '600mg', '800mg'],
      category: 'NSAID',
      controlledSubstance: false,
    } as Drug,

    warfarin: {
      id: 'drug-3',
      name: 'Warfarin',
      genericName: 'Warfarin sodium',
      brandNames: ['Coumadin', 'Jantoven'],
      dosageForms: ['Tablet'],
      strengths: ['1mg', '2mg', '2.5mg', '5mg', '10mg'],
      category: 'Anticoagulant',
      controlledSubstance: false,
    } as Drug,

    methylphenidate: {
      id: 'drug-4',
      name: 'Methylphenidate',
      genericName: 'Methylphenidate HCl',
      brandNames: ['Ritalin', 'Concerta', 'Metadate'],
      dosageForms: ['Tablet', 'Extended-Release Capsule'],
      strengths: ['5mg', '10mg', '18mg', '27mg', '36mg', '54mg'],
      category: 'ADHD Stimulant',
      controlledSubstance: true,
      scheduleClass: 'II',
    } as Drug,

    albuterol: {
      id: 'drug-5',
      name: 'Albuterol',
      genericName: 'Albuterol sulfate',
      brandNames: ['ProAir', 'Ventolin', 'Proventil'],
      dosageForms: ['Inhaler', 'Nebulizer Solution'],
      strengths: ['90mcg/actuation', '0.083% solution'],
      category: 'Bronchodilator',
      controlledSubstance: false,
    } as Drug,
  },

  /**
   * Drug interactions with varying severities
   */
  interactions: {
    criticalAspirinWarfarin: {
      id: 'interaction-1',
      drug1: 'drug-1', // Aspirin
      drug2: 'drug-3', // Warfarin
      severity: 'CRITICAL',
      description: 'Concurrent use of aspirin and warfarin significantly increases bleeding risk',
      mechanismOfAction: 'Both drugs inhibit platelet function and blood clotting',
      clinicalEffects: [
        'Increased risk of major bleeding',
        'Gastrointestinal bleeding',
        'Intracranial hemorrhage risk',
      ],
      recommendations: [
        'Avoid concurrent use if possible',
        'If necessary, closely monitor INR and signs of bleeding',
        'Consider alternative pain management',
        'Patient education on bleeding signs',
      ],
      references: [
        'FDA Drug Safety Communication 2014',
        'American College of Cardiology Guidelines',
      ],
    } as DrugInteraction,

    highAspirinIbuprofen: {
      id: 'interaction-2',
      drug1: 'drug-1', // Aspirin
      drug2: 'drug-2', // Ibuprofen
      severity: 'HIGH',
      description: 'NSAIDs may reduce the cardioprotective effect of low-dose aspirin',
      mechanismOfAction: 'Competitive inhibition of COX-1 enzyme',
      clinicalEffects: [
        'Reduced antiplatelet effect of aspirin',
        'Increased GI bleeding risk',
        'Reduced cardiovascular protection',
      ],
      recommendations: [
        'Take aspirin at least 2 hours before ibuprofen',
        'Consider alternative NSAID if long-term use needed',
        'Monitor for signs of GI bleeding',
      ],
      references: [
        'Journal of Clinical Pharmacology 2020',
      ],
    } as DrugInteraction,

    moderateAlbuterolBetaBlocker: {
      id: 'interaction-3',
      drug1: 'drug-5', // Albuterol
      drug2: 'drug-6', // Beta blocker (hypothetical)
      severity: 'MODERATE',
      description: 'Beta-blockers may reduce the effectiveness of albuterol',
      mechanismOfAction: 'Beta-blockers antagonize beta-agonist bronchodilation',
      clinicalEffects: [
        'Reduced bronchodilation effectiveness',
        'Potential worsening of asthma symptoms',
      ],
      recommendations: [
        'Use selective beta-1 blockers if possible',
        'Monitor pulmonary function closely',
        'Consider alternative bronchodilator therapy',
      ],
      references: [
        'Pulmonary Pharmacology Journal 2019',
      ],
    } as DrugInteraction,

    lowMethylphenidateCaffeine: {
      id: 'interaction-4',
      drug1: 'drug-4', // Methylphenidate
      drug2: 'drug-7', // Caffeine (hypothetical)
      severity: 'LOW',
      description: 'Caffeine may potentiate the stimulant effects of methylphenidate',
      mechanismOfAction: 'Additive CNS stimulation',
      clinicalEffects: [
        'Increased nervousness or jitteriness',
        'Elevated heart rate',
        'Sleep disturbances',
      ],
      recommendations: [
        'Limit caffeine intake',
        'Monitor for excessive stimulation',
        'Adjust methylphenidate dose if needed',
      ],
      references: [],
    } as DrugInteraction,
  },

  /**
   * Drug check request examples
   */
  checkRequests: {
    singleDrug: {
      studentId: 'student-456',
      drugs: ['drug-1'], // Aspirin only
      checkType: 'NEW_PRESCRIPTION',
    } as DrugCheckRequest,

    multipleDrugsNoInteraction: {
      studentId: 'student-456',
      drugs: ['drug-4', 'drug-5'], // Methylphenidate + Albuterol
      checkType: 'MEDICATION_REVIEW',
    } as DrugCheckRequest,

    multipleDrugsWithInteraction: {
      studentId: 'student-456',
      drugs: ['drug-1', 'drug-2', 'drug-3'], // Aspirin + Ibuprofen + Warfarin
      checkType: 'NEW_PRESCRIPTION',
    } as DrugCheckRequest,

    doseSpecific: {
      studentId: 'student-456',
      drugs: ['drug-1'],
      dosageInfo: [
        {
          drugId: 'drug-1',
          strength: '325mg',
          frequency: 'twice daily',
          route: 'oral',
        },
      ],
      checkType: 'DOSE_VERIFICATION',
    } as DrugCheckRequest,
  },

  /**
   * Drug check results
   */
  checkResults: {
    noInteractions: {
      requestId: 'check-1',
      timestamp: '2025-10-26T10:00:00Z',
      studentId: 'student-456',
      checkedDrugs: ['drug-4', 'drug-5'],
      interactionsFound: [],
      totalInteractions: 0,
      highestSeverity: 'NONE',
      safe: true,
      warnings: [],
    } as DrugCheckResult,

    withCriticalInteraction: {
      requestId: 'check-2',
      timestamp: '2025-10-26T10:05:00Z',
      studentId: 'student-456',
      checkedDrugs: ['drug-1', 'drug-3'],
      interactionsFound: [
        {
          interaction: drugInteractionFixtures.interactions.criticalAspirinWarfarin,
          affectedDrugs: ['drug-1', 'drug-3'],
          severity: 'CRITICAL',
        },
      ],
      totalInteractions: 1,
      highestSeverity: 'CRITICAL',
      safe: false,
      warnings: [
        'CRITICAL interaction detected',
        'Immediate clinical review required',
        'Do not administer without physician approval',
      ],
      requiresPhysicianApproval: true,
    } as DrugCheckResult,

    withMultipleInteractions: {
      requestId: 'check-3',
      timestamp: '2025-10-26T10:10:00Z',
      studentId: 'student-456',
      checkedDrugs: ['drug-1', 'drug-2', 'drug-3'],
      interactionsFound: [
        {
          interaction: drugInteractionFixtures.interactions.criticalAspirinWarfarin,
          affectedDrugs: ['drug-1', 'drug-3'],
          severity: 'CRITICAL',
        },
        {
          interaction: drugInteractionFixtures.interactions.highAspirinIbuprofen,
          affectedDrugs: ['drug-1', 'drug-2'],
          severity: 'HIGH',
        },
      ],
      totalInteractions: 2,
      highestSeverity: 'CRITICAL',
      safe: false,
      warnings: [
        'Multiple drug interactions detected',
        '1 CRITICAL, 1 HIGH severity interactions',
        'Immediate clinical review required',
      ],
      requiresPhysicianApproval: true,
    } as DrugCheckResult,
  },

  /**
   * Dose calculation examples
   */
  doseCalculations: {
    pediatricDose: {
      drugId: 'drug-2', // Ibuprofen
      patientWeight: 30, // kg
      patientAge: 10, // years
      calculatedDose: {
        amount: 300,
        unit: 'mg',
        frequency: 'every 6-8 hours',
        maxDailyDose: 1200,
        calculation: 'Weight-based: 10mg/kg = 300mg per dose',
      },
    },
    adultDose: {
      drugId: 'drug-1', // Aspirin
      indication: 'Cardioprotection',
      calculatedDose: {
        amount: 81,
        unit: 'mg',
        frequency: 'once daily',
        maxDailyDose: 81,
        calculation: 'Standard low-dose aspirin for cardioprotection',
      },
    },
  },

  /**
   * Contraindications
   */
  contraindications: {
    aspirinAllergy: {
      drugId: 'drug-1',
      condition: 'NSAID allergy',
      severity: 'ABSOLUTE',
      description: 'Patient has documented allergy to NSAIDs',
      alternatives: ['Acetaminophen'],
    },
    warfarinPregnancy: {
      drugId: 'drug-3',
      condition: 'Pregnancy',
      severity: 'ABSOLUTE',
      description: 'Warfarin is teratogenic and contraindicated in pregnancy',
      alternatives: ['Low molecular weight heparin'],
    },
  },

  /**
   * Side effects database
   */
  sideEffects: {
    common: [
      {
        drugId: 'drug-2', // Ibuprofen
        sideEffect: 'Upset stomach',
        frequency: 'Common (10-30%)',
        severity: 'Mild',
        management: 'Take with food or milk',
      },
      {
        drugId: 'drug-4', // Methylphenidate
        sideEffect: 'Decreased appetite',
        frequency: 'Very Common (>30%)',
        severity: 'Mild to Moderate',
        management: 'Monitor weight, provide nutrition counseling',
      },
    ],
    serious: [
      {
        drugId: 'drug-3', // Warfarin
        sideEffect: 'Major bleeding',
        frequency: 'Uncommon (1-10%)',
        severity: 'Severe',
        management: 'Emergency medical attention required',
      },
    ],
  },
};
