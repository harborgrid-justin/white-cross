/**
 * @fileoverview Spacing constants and utilities
 * @module styles/spacing
 */

export const spacing = {
  // Base spacing values (in rem)
  0: '0',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
} as const;

// Component-specific spacing
export const componentSpacing = {
  // Card spacing
  card: {
    padding: spacing[6],
    gap: spacing[4],
    margin: spacing[4],
  },
  
  // Button spacing
  button: {
    paddingX: spacing[4],
    paddingY: spacing[2],
    gap: spacing[2],
  },
  
  // Input spacing
  input: {
    paddingX: spacing[3],
    paddingY: spacing[2],
    margin: spacing[2],
  },
  
  // Form spacing
  form: {
    fieldGap: spacing[4],
    sectionGap: spacing[6],
    labelMargin: spacing[2],
  },
  
  // Layout spacing
  layout: {
    containerPadding: spacing[6],
    sectionGap: spacing[8],
    headerHeight: spacing[16],
    sidebarWidth: spacing[64],
  },
  
  // Grid spacing
  grid: {
    gap: spacing[4],
    columnGap: spacing[4],
    rowGap: spacing[4],
  },
  
  // List spacing
  list: {
    itemGap: spacing[2],
    itemPadding: spacing[3],
  },
} as const;

// Responsive spacing utilities
export const responsiveSpacing = {
  mobile: {
    containerPadding: spacing[4],
    sectionGap: spacing[6],
    cardPadding: spacing[4],
  },
  tablet: {
    containerPadding: spacing[6],
    sectionGap: spacing[8],
    cardPadding: spacing[6],
  },
  desktop: {
    containerPadding: spacing[8],
    sectionGap: spacing[12],
    cardPadding: spacing[8],
  },
} as const;

// Healthcare-specific spacing
export const medicalSpacing = {
  // Patient card spacing
  patientCard: {
    padding: spacing[6],
    avatarGap: spacing[4],
    infoGap: spacing[2],
  },
  
  // Medication form spacing
  medicationForm: {
    fieldGap: spacing[4],
    dosageGap: spacing[3],
    scheduleGap: spacing[2],
  },
  
  // Incident report spacing
  incidentReport: {
    sectionGap: spacing[6],
    fieldGap: spacing[4],
    witnessGap: spacing[3],
  },
  
  // Health record spacing
  healthRecord: {
    recordGap: spacing[4],
    entryGap: spacing[3],
    categoryGap: spacing[6],
  },
} as const;

// Utility functions
export const getSpacingValue = (key: keyof typeof spacing): string => {
  return spacing[key] || spacing[4]; // fallback to 1rem
};

export const createSpacingClasses = (prefix = 'space') => {
  const classes: Record<string, string> = {};
  
  Object.entries(spacing).forEach(([key, value]) => {
    classes[`${prefix}-${key}`] = value;
  });
  
  return classes;
};

// Margin utilities
export const margin = {
  ...spacing,
  auto: 'auto',
} as const;

// Padding utilities
export const padding = {
  ...spacing,
} as const;

// Gap utilities
export const gap = {
  ...spacing,
} as const;

// Common spacing patterns
export const spacingPatterns = {
  // Tight spacing for compact layouts
  tight: {
    gap: spacing[2],
    padding: spacing[3],
    margin: spacing[2],
  },
  
  // Normal spacing for regular layouts
  normal: {
    gap: spacing[4],
    padding: spacing[6],
    margin: spacing[4],
  },
  
  // Loose spacing for spacious layouts
  loose: {
    gap: spacing[6],
    padding: spacing[8],
    margin: spacing[6],
  },
  
  // Extra loose spacing for hero sections
  extraLoose: {
    gap: spacing[8],
    padding: spacing[12],
    margin: spacing[8],
  },
} as const;

export default spacing;
