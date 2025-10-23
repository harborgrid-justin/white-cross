/**
 * BMICalculator Component
 * 
 * B M I Calculator for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface BMICalculatorProps {
  className?: string;
}

/**
 * BMICalculator component - B M I Calculator
 */
const BMICalculator: React.FC<BMICalculatorProps> = ({ className = '' }) => {
  return (
    <div className={`b-m-i-calculator ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">B M I Calculator</h3>
        <div className="text-center text-gray-500 py-8">
          <p>B M I Calculator functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
