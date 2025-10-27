'use client';

/**
 * MedicationsList Component - Main medications list view
 */

import React from 'react';
import { MedicationList, MedicationListProps } from './core/MedicationList';

export const MedicationsList: React.FC<MedicationListProps> = (props) => {
  return <MedicationList {...props} />;
};

MedicationsList.displayName = 'MedicationsList';

export default MedicationsList;
