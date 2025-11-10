/**
 * LOC: USACE-DOWN-TEST-003
 * File: /reuse/frontend/composites/usace/downstream/testing-and-certification-modules.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - ../usace-quality-assurance-composites
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS testing laboratory UI
 *   - Material certification systems
 *   - Quality test tracking dashboards
 *   - Certification approval workflows
 */

/**
 * File: /reuse/frontend/composites/usace/downstream/testing-and-certification-modules.ts
 * Locator: WC-DOWN-TEST-003
 * Purpose: Testing and Certification Modules - Production-grade material testing and certification
 *
 * Upstream: React 18+, Next.js 16+, TypeScript 5.x, usace-quality-assurance-composites
 * Downstream: Testing lab UI, certification systems, test tracking, approval workflows
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x, date-fns, chart.js
 * Exports: 32+ composed functions for comprehensive testing and certification management
 *
 * LLM Context: Production-grade testing and certification system for USACE CEFMS applications.
 * Provides material test management, laboratory test tracking, certification workflows, test
 * result validation, specification compliance checking, batch testing, quality assurance, and
 * comprehensive certification tracking for USACE construction materials and standards compliance.
 */

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  useMaterialTesting,
  useMaterialCertification,
  validateTestResults,
  type MaterialTest,
  type MaterialCertification,
  type TestResult,
  type TestResultStatus,
} from '../usace-quality-assurance-composites';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Laboratory workload
 */
export interface LaboratoryWorkload {
  laboratoryName: string;
  pendingTests: number;
  completedTests: number;
  averageTurnaroundTime: number; // hours
  capacity: number;
  utilizationRate: number;
}

/**
 * Batch test group
 */
export interface BatchTestGroup {
  batchId: string;
  materialType: string;
  lotNumber: string;
  tests: MaterialTest[];
  overallResult: TestResultStatus;
  completionRate: number;
  startDate: Date;
  targetCompletionDate: Date;
}

/**
 * Certification package
 */
export interface CertificationPackage {
  packageId: string;
  materialType: string;
  certifications: MaterialCertification[];
  associatedTests: MaterialTest[];
  completionStatus: 'incomplete' | 'ready_for_review' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewDate?: Date;
}

/**
 * Test compliance report
 */
export interface TestComplianceReport {
  materialType: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  pendingTests: number;
  complianceRate: number;
  nonCompliantSpecs: string[];
  recommendations: string[];
}

// ============================================================================
// TESTING AND CERTIFICATION MODULES
// ============================================================================

/**
 * Comprehensive material testing laboratory management hook
 *
 * Provides centralized test scheduling, result tracking, and laboratory
 * workload management with real-time status updates.
 *
 * @param laboratoryId - Optional laboratory filter
 * @returns Testing laboratory state and functions
 *
 * @example
 * ```tsx
 * function TestingLaboratory({ laboratoryId }) {
 *   const {
 *     pendingTests,
 *     scheduleTest,
 *     recordTestResults,
 *     validateResults,
 *     getLaboratoryWorkload
 *   } = useTestingLaboratoryManagement(laboratoryId);
 *
 *   return (
 *     <div>
 *       <TestQueue tests={pendingTests} />
 *       <WorkloadMetrics workload={getLaboratoryWorkload()} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useTestingLaboratoryManagement(laboratoryId?: string) {
  const {
    tests,
    createTest,
    recordResults,
    certifyMaterial,
    getPendingTests,
    getFailedTests,
    getTestsByMaterial,
  } = useMaterialTesting();

  // Filter by laboratory if provided
  const laboratoryTests = useMemo(
    () => laboratoryId ? tests.filter(t => t.laboratory === laboratoryId) : tests,
    [tests, laboratoryId]
  );

  // Calculate laboratory workload
  const getLaboratoryWorkload = useCallback((): LaboratoryWorkload[] => {
    const labMap = new Map<string, LaboratoryWorkload>();

    tests.forEach(test => {
      if (!labMap.has(test.laboratory)) {
        labMap.set(test.laboratory, {
          laboratoryName: test.laboratory,
          pendingTests: 0,
          completedTests: 0,
          averageTurnaroundTime: 0,
          capacity: 100, // Would come from lab configuration
          utilizationRate: 0,
        });
      }

      const workload = labMap.get(test.laboratory)!;

      if (test.overallResult === 'pending') {
        workload.pendingTests++;
      } else {
        workload.completedTests++;
      }
    });

    // Calculate utilization rates
    labMap.forEach(workload => {
      const totalTests = workload.pendingTests + workload.completedTests;
      workload.utilizationRate = workload.capacity > 0
        ? (totalTests / workload.capacity) * 100
        : 0;
    });

    return Array.from(labMap.values());
  }, [tests]);

  // Schedule test
  const scheduleTest = useCallback(async (test: MaterialTest) => {
    // Check laboratory capacity
    const workload = getLaboratoryWorkload().find(w => w.laboratoryName === test.laboratory);
    if (workload && workload.utilizationRate >= 90) {
      console.warn(`Laboratory ${test.laboratory} is at high capacity`);
    }

    await createTest(test);
  }, [createTest, getLaboratoryWorkload]);

  // Record and validate test results
  const recordTestResults = useCallback(async (
    testId: string,
    testResults: TestResult[],
    overallResult: TestResultStatus
  ) => {
    // Validate results
    const validation = validateTestResults(testResults);

    if (!validation.allPass && overallResult === 'pass') {
      throw new Error('Cannot mark test as passed when results show failures');
    }

    await recordResults(testId, testResults, overallResult);
  }, [recordResults]);

  // Get test turnaround metrics
  const getTestTurnaroundMetrics = useCallback(() => {
    const completedTests = laboratoryTests.filter(t =>
      t.overallResult !== 'pending'
    );

    const turnaroundTimes = completedTests
      .filter(t => t.certificationDate)
      .map(t => {
        const testDate = new Date(t.testDate).getTime();
        const certDate = new Date(t.certificationDate!).getTime();
        return (certDate - testDate) / (1000 * 60 * 60); // hours
      });

    return {
      averageTurnaround: turnaroundTimes.length > 0
        ? turnaroundTimes.reduce((sum, t) => sum + t, 0) / turnaroundTimes.length
        : 0,
      minTurnaround: turnaroundTimes.length > 0 ? Math.min(...turnaroundTimes) : 0,
      maxTurnaround: turnaroundTimes.length > 0 ? Math.max(...turnaroundTimes) : 0,
    };
  }, [laboratoryTests]);

  return {
    tests: laboratoryTests,
    pendingTests: getPendingTests(),
    failedTests: getFailedTests(),
    scheduleTest,
    recordTestResults,
    certifyMaterial,
    getTestsByMaterial,
    getLaboratoryWorkload,
    getTestTurnaroundMetrics,
  };
}

/**
 * Batch testing management hook
 *
 * Manages grouped material tests for batch processing and tracking.
 *
 * @returns Batch testing state and functions
 *
 * @example
 * ```tsx
 * function BatchTestingManager() {
 *   const {
 *     batches,
 *     createBatch,
 *     getBatchStatus,
 *     completeBatch
 *   } = useBatchTesting();
 * }
 * ```
 */
export function useBatchTesting() {
  const { tests, getTestsByMaterial } = useMaterialTesting();
  const [batches, setBatches] = useState<BatchTestGroup[]>([]);

  const createBatch = useCallback((
    materialType: string,
    lotNumber: string,
    testIds: string[]
  ) => {
    const batchTests = tests.filter(t => testIds.includes(t.id));

    const batch: BatchTestGroup = {
      batchId: `batch_${Date.now()}`,
      materialType,
      lotNumber,
      tests: batchTests,
      overallResult: 'pending',
      completionRate: 0,
      startDate: new Date(),
      targetCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    setBatches(prev => [...prev, batch]);
    return batch;
  }, [tests]);

  const getBatchStatus = useCallback((batchId: string) => {
    const batch = batches.find(b => b.batchId === batchId);
    if (!batch) return null;

    const completedTests = batch.tests.filter(t => t.overallResult !== 'pending').length;
    const passedTests = batch.tests.filter(t => t.overallResult === 'pass').length;
    const failedTests = batch.tests.filter(t => t.overallResult === 'fail').length;

    const completionRate = batch.tests.length > 0
      ? (completedTests / batch.tests.length) * 100
      : 0;

    let overallResult: TestResultStatus = 'pending';
    if (completionRate === 100) {
      overallResult = failedTests === 0 ? 'pass' : 'fail';
    }

    return {
      ...batch,
      completionRate,
      overallResult,
      completedTests,
      passedTests,
      failedTests,
    };
  }, [batches]);

  const completeBatch = useCallback((batchId: string) => {
    setBatches(prev => prev.map(batch =>
      batch.batchId === batchId
        ? {
            ...batch,
            overallResult: getBatchStatus(batchId)?.overallResult || 'pending',
            completionRate: 100,
          }
        : batch
    ));
  }, [getBatchStatus]);

  return {
    batches,
    createBatch,
    getBatchStatus,
    completeBatch,
  };
}

/**
 * Material certification workflow hook
 *
 * Manages certification approval workflows with multi-stage review.
 *
 * @returns Certification workflow state and functions
 *
 * @example
 * ```tsx
 * function CertificationWorkflow() {
 *   const {
 *     packages,
 *     createPackage,
 *     submitForReview,
 *     approvePackage,
 *     rejectPackage
 *   } = useCertificationWorkflow();
 * }
 * ```
 */
export function useCertificationWorkflow() {
  const { certifications, approveCertification } = useMaterialCertification();
  const { tests } = useMaterialTesting();
  const [packages, setPackages] = useState<CertificationPackage[]>([]);

  const createPackage = useCallback((
    materialType: string,
    certificationIds: string[],
    testIds: string[]
  ) => {
    const packageCerts = certifications.filter(c => certificationIds.includes(c.id));
    const packageTests = tests.filter(t => testIds.includes(t.id));

    const pkg: CertificationPackage = {
      packageId: `pkg_${Date.now()}`,
      materialType,
      certifications: packageCerts,
      associatedTests: packageTests,
      completionStatus: 'incomplete',
    };

    setPackages(prev => [...prev, pkg]);
    return pkg;
  }, [certifications, tests]);

  const submitForReview = useCallback((packageId: string) => {
    setPackages(prev => prev.map(pkg =>
      pkg.packageId === packageId
        ? { ...pkg, completionStatus: 'ready_for_review' }
        : pkg
    ));
  }, []);

  const approvePackage = useCallback(async (packageId: string, reviewer: string) => {
    const pkg = packages.find(p => p.packageId === packageId);
    if (!pkg) throw new Error('Package not found');

    // Approve all certifications in package
    for (const cert of pkg.certifications) {
      await approveCertification(cert.id, reviewer);
    }

    setPackages(prev => prev.map(p =>
      p.packageId === packageId
        ? {
            ...p,
            completionStatus: 'approved',
            reviewedBy: reviewer,
            reviewDate: new Date(),
          }
        : p
    ));
  }, [packages, approveCertification]);

  const rejectPackage = useCallback((packageId: string, reviewer: string, reason: string) => {
    setPackages(prev => prev.map(pkg =>
      pkg.packageId === packageId
        ? {
            ...pkg,
            completionStatus: 'rejected',
            reviewedBy: reviewer,
            reviewDate: new Date(),
          }
        : pkg
    ));
  }, []);

  return {
    packages,
    createPackage,
    submitForReview,
    approvePackage,
    rejectPackage,
  };
}

/**
 * Test compliance analyzer hook
 *
 * Analyzes test results for specification compliance and trends.
 *
 * @param materialType - Material type to analyze
 * @returns Compliance analysis state and functions
 *
 * @example
 * ```tsx
 * function ComplianceAnalyzer({ materialType }) {
 *   const {
 *     complianceReport,
 *     identifyTrends,
 *     getFailurePatterns
 *   } = useTestComplianceAnalyzer(materialType);
 * }
 * ```
 */
export function useTestComplianceAnalyzer(materialType: string) {
  const { tests, getTestsByMaterial } = useMaterialTesting();

  const materialTests = useMemo(
    () => getTestsByMaterial(materialType),
    [materialType, getTestsByMaterial]
  );

  const complianceReport = useMemo<TestComplianceReport>(() => {
    const totalTests = materialTests.length;
    const passedTests = materialTests.filter(t => t.overallResult === 'pass').length;
    const failedTests = materialTests.filter(t => t.overallResult === 'fail').length;
    const pendingTests = materialTests.filter(t => t.overallResult === 'pending').length;

    const complianceRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    // Identify non-compliant specifications
    const nonCompliantSpecs = new Set<string>();
    materialTests
      .filter(t => t.overallResult === 'fail')
      .forEach(test => {
        test.testResults
          .filter(r => r.result === 'fail')
          .forEach(r => {
            if (r.parameter) nonCompliantSpecs.add(r.parameter);
          });
      });

    // Generate recommendations
    const recommendations: string[] = [];
    if (complianceRate < 90) {
      recommendations.push('Improve material quality control procedures');
    }
    if (failedTests > 5) {
      recommendations.push('Review supplier quality and material sourcing');
    }
    if (nonCompliantSpecs.size > 0) {
      recommendations.push(`Address non-compliant specifications: ${Array.from(nonCompliantSpecs).join(', ')}`);
    }

    return {
      materialType,
      totalTests,
      passedTests,
      failedTests,
      pendingTests,
      complianceRate,
      nonCompliantSpecs: Array.from(nonCompliantSpecs),
      recommendations,
    };
  }, [materialType, materialTests]);

  const identifyTrends = useCallback(() => {
    // Analyze trends over time
    const recentTests = materialTests.slice(-10);
    const recentPassRate = recentTests.filter(t => t.overallResult === 'pass').length / recentTests.length;

    const olderTests = materialTests.slice(-20, -10);
    const olderPassRate = olderTests.length > 0
      ? olderTests.filter(t => t.overallResult === 'pass').length / olderTests.length
      : recentPassRate;

    return {
      trend: recentPassRate > olderPassRate ? 'improving' : recentPassRate < olderPassRate ? 'declining' : 'stable',
      recentPassRate: recentPassRate * 100,
      previousPassRate: olderPassRate * 100,
      change: (recentPassRate - olderPassRate) * 100,
    };
  }, [materialTests]);

  const getFailurePatterns = useCallback(() => {
    const failedTests = materialTests.filter(t => t.overallResult === 'fail');
    const patterns: Record<string, number> = {};

    failedTests.forEach(test => {
      test.testResults
        .filter(r => r.result === 'fail')
        .forEach(result => {
          const key = result.parameter;
          patterns[key] = (patterns[key] || 0) + 1;
        });
    });

    return Object.entries(patterns)
      .map(([parameter, count]) => ({ parameter, count }))
      .sort((a, b) => b.count - a.count);
  }, [materialTests]);

  return {
    complianceReport,
    identifyTrends,
    getFailurePatterns,
  };
}

/**
 * Certification expiration tracker hook
 *
 * Tracks certification expirations and sends alerts.
 *
 * @param daysAhead - Days ahead to check for expirations
 * @returns Expiration tracking state and functions
 *
 * @example
 * ```tsx
 * function ExpirationTracker() {
 *   const {
 *     expiringCertifications,
 *     expiredCertifications,
 *     sendExpirationAlerts
 *   } = useCertificationExpirationTracker(30);
 * }
 * ```
 */
export function useCertificationExpirationTracker(daysAhead: number = 30) {
  const { certifications, getExpiringCertifications } = useMaterialCertification();

  const expiringCertifications = useMemo(
    () => getExpiringCertifications(daysAhead),
    [daysAhead, getExpiringCertifications]
  );

  const expiredCertifications = useMemo(
    () => certifications.filter(cert =>
      cert.expirationDate && new Date(cert.expirationDate) < new Date()
    ),
    [certifications]
  );

  const sendExpirationAlerts = useCallback(() => {
    // In production, send email/SMS alerts
    console.log(`Sending alerts for ${expiringCertifications.length} expiring certifications`);
  }, [expiringCertifications]);

  return {
    expiringCertifications,
    expiredCertifications,
    sendExpirationAlerts,
  };
}

// Export types
export type {
  MaterialTest,
  MaterialCertification,
  TestResult,
  TestResultStatus,
  LaboratoryWorkload,
  BatchTestGroup,
  CertificationPackage,
  TestComplianceReport,
};
