/**
 * LOC: USACE-DOWN-POLICY-007
 * File: /reuse/frontend/composites/usace/downstream/policy-enforcement-dashboards.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../usace-regulatory-compliance-composites
 *
 * DOWNSTREAM (imported by):
 *   - Policy enforcement UI
 *   - Violation tracking dashboards
 *   - Automated policy systems
 *   - Enforcement reporting tools
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  usePolicyEnforcement,
  type PolicyEnforcementRule,
} from '../usace-regulatory-compliance-composites';

export interface PolicyDashboard {
  activeRules: PolicyEnforcementRule[];
  violations: any[];
  createRule: (rule: PolicyEnforcementRule) => void;
  evaluatePolicy: (ruleId: string, context: any) => boolean;
  getViolationsSummary: () => any;
}

export function usePolicyEnforcementDashboard(): PolicyDashboard {
  const { rules, violations, createRule, toggleRule, evaluatePolicy, getActiveRules } = usePolicyEnforcement();

  const getViolationsSummary = useCallback(() => {
    return {
      total: violations.length,
      recent: violations.slice(-10),
      byRule: violations.reduce((acc, v) => {
        acc[v.ruleId] = (acc[v.ruleId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }, [violations]);

  return {
    activeRules: getActiveRules(),
    violations,
    createRule,
    evaluatePolicy,
    getViolationsSummary,
  };
}

export type { PolicyEnforcementRule };
