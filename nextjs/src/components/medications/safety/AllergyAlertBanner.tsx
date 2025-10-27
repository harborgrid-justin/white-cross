'use client';

/**
 * WF-SAFETY-002 | AllergyAlertBanner.tsx - Patient Allergy Warning Display
 * Purpose: Display critical allergy information during medication workflows
 * Upstream: Student allergies API | Dependencies: React, Alert
 * Downstream: Medication administration safety
 * Related: AdministrationForm, useStudentAllergies
 * Exports: AllergyAlertBanner component
 * Last Updated: 2025-10-27 | File Type: .tsx
 */

import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';

export interface Allergy {
  id: string;
  allergen: string;
  severity: 'severe' | 'moderate' | 'mild';
  reaction?: string;
  notes?: string;
}

export interface AllergyAlertBannerProps {
  allergies: Allergy[];
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

const severityConfig = {
  severe: {
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-300 dark:border-red-800',
    textColor: 'text-red-900 dark:text-red-100',
    iconColor: 'text-red-600 dark:text-red-400',
    label: 'SEVERE',
    icon: AlertTriangle,
  },
  moderate: {
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-300 dark:border-orange-800',
    textColor: 'text-orange-900 dark:text-orange-100',
    iconColor: 'text-orange-600 dark:text-orange-400',
    label: 'MODERATE',
    icon: AlertCircle,
  },
  mild: {
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-300 dark:border-yellow-800',
    textColor: 'text-yellow-900 dark:text-yellow-100',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    label: 'MILD',
    icon: AlertCircle,
  },
};

export const AllergyAlertBanner: React.FC<AllergyAlertBannerProps> = ({
  allergies,
  isLoading = false,
  error = null,
  className = '',
}) => {
  // Critical error: allergy data failed to load
  if (error) {
    return (
      <div
        className={`bg-red-100 dark:bg-red-900/30 border-2 border-red-600 dark:border-red-500 rounded-lg p-4 ${className}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-red-900 dark:text-red-100 text-base mb-1">
              ALLERGY DATA UNAVAILABLE
            </h3>
            <p className="text-sm text-red-800 dark:text-red-200 font-medium">
              Do not administer medication until allergies are verified. Contact IT support if this error persists.
            </p>
            {error && (
              <p className="text-xs text-red-700 dark:text-red-300 mt-2">
                Error: {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 dark:border-gray-400"></div>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            Loading allergy information...
          </p>
        </div>
      </div>
    );
  }

  // No allergies
  if (!allergies || allergies.length === 0) {
    return (
      <div
        className={`bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-800 rounded-lg p-4 ${className}`}
        role="status"
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-sm text-green-800 dark:text-green-200 font-medium">
            No known allergies on file
          </p>
        </div>
      </div>
    );
  }

  // Sort allergies by severity (severe first)
  const sortedAllergies = [...allergies].sort((a, b) => {
    const severityOrder = { severe: 0, moderate: 1, mild: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  // Get the highest severity for the banner style
  const highestSeverity = sortedAllergies[0].severity;
  const config = severityConfig[highestSeverity];
  const Icon = config.icon;

  return (
    <div
      className={`${config.bgColor} border-2 ${config.borderColor} rounded-lg p-4 ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h3 className={`font-bold ${config.textColor} text-base mb-2`}>
            ALLERGY ALERT: {sortedAllergies.length} Known{' '}
            {sortedAllergies.length === 1 ? 'Allergy' : 'Allergies'}
          </h3>

          <div className="space-y-2">
            {sortedAllergies.map((allergy) => {
              const allergyConfig = severityConfig[allergy.severity];
              return (
                <div
                  key={allergy.id}
                  className="bg-white/50 dark:bg-black/20 rounded p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-bold ${allergyConfig.textColor}`}>
                      {allergy.allergen}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${allergyConfig.bgColor} ${allergyConfig.borderColor} border`}
                    >
                      {allergyConfig.label}
                    </span>
                  </div>

                  {allergy.reaction && (
                    <p className={`text-sm ${allergyConfig.textColor} mt-1`}>
                      Reaction: {allergy.reaction}
                    </p>
                  )}

                  {allergy.notes && (
                    <p className={`text-xs ${allergyConfig.textColor} mt-1 opacity-90`}>
                      Notes: {allergy.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <p className={`text-xs ${config.textColor} mt-3 font-medium`}>
            Verify medication does not contain allergens before administration
          </p>
        </div>
      </div>
    </div>
  );
};

AllergyAlertBanner.displayName = 'AllergyAlertBanner';

export default AllergyAlertBanner;
