# Frontend Integration Recommendations for New Backend Endpoints

**Document Version:** 1.0
**Date:** 2025-11-04
**Author:** React Component Architect (Agent RC9H3K)
**Related Work:** API Analysis Agent FE7A9C (771 endpoints analyzed)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Critical Integration Gaps](#critical-integration-gaps)
3. [Priority Matrix](#priority-matrix)
4. [Medication Administration Integration](#medication-administration-integration)
5. [OAuth/MFA Authentication Integration](#oauthmfa-authentication-integration)
6. [Allergy Safety Integration](#allergy-safety-integration)
7. [Screening Module Integration](#screening-module-integration)
8. [Vaccination Tracking Integration](#vaccination-tracking-integration)
9. [Query Key Management Strategy](#query-key-management-strategy)
10. [Error Handling Patterns](#error-handling-patterns)
11. [Testing Priorities](#testing-priorities)
12. [Developer Migration Guide](#developer-migration-guide)
13. [Safety Considerations](#safety-considerations)

---

## Executive Summary

### Overview

This document provides comprehensive recommendations for integrating frontend React hooks and components with newly implemented backend endpoints. The analysis covers **5 major domains** with **30+ new endpoints** that are currently not integrated or improperly integrated in the frontend.

### Critical Findings

**CRITICAL (Patient Safety):**
- ❌ Medication administration hooks use **outdated API structure** (14 new endpoints not integrated)
- ❌ **No allergy conflict checking** hooks exist (safety-critical gap before medication administration)
- ❌ **No drug interaction checking** hooks exist

**HIGH (Security):**
- ❌ **No OAuth authentication hooks** (Google/Microsoft authentication not integrated)
- ❌ **No MFA (Multi-Factor Authentication) hooks** (TOTP, backup codes not integrated)

**MEDIUM (Clinical Features):**
- ❌ **No screening module hooks** (6 endpoints not integrated)
- ❌ **No vaccination tracking hooks** (CDC-compliant system not integrated)
- ⚠️ Health record hooks use **mock implementations** instead of real API calls

### Impact Assessment

| Domain | Endpoints Missing | Patient Safety Risk | Security Risk | Feature Gap |
|--------|------------------|---------------------|---------------|-------------|
| Medication Administration | 14 | 🔴 CRITICAL | 🟡 MEDIUM | 🔴 HIGH |
| Allergy Safety | 13 | 🔴 CRITICAL | 🟢 LOW | 🔴 HIGH |
| OAuth/MFA Authentication | 10 | 🟢 LOW | 🔴 CRITICAL | 🔴 HIGH |
| Screening Module | 6 | 🟡 MEDIUM | 🟢 LOW | 🟡 MEDIUM |
| Vaccination Tracking | 8 | 🟡 MEDIUM | 🟢 LOW | 🟡 MEDIUM |

---

## Critical Integration Gaps

### 1. Medication Administration Workflow Gap

**Current State:**
```typescript
// Current implementation - OUTDATED
const { administerMedication } = useMedicationAdministration();

await administerMedication({
  studentId: 'student-123',
  medicationId: 'med-456',
  dosage: '10mg',
  administrationTime: new Date().toISOString()
});
// ❌ Uses medicationsApi.logAdministration() - old API
// ❌ No Five Rights verification workflow
// ❌ No safety checks integration
// ❌ No witness signature support
```

**Backend Reality (14 New Endpoints):**
1. `POST /medications/administrations/initiate` - Create administration session with safety data
2. `POST /medications/administrations/verify` - **Five Rights verification (CRITICAL)**
3. `POST /medications/administrations` - Record administration after verification
4. `GET /medications/administrations/due` - Get due medications
5. `GET /medications/administrations/overdue` - Get overdue doses
6. `GET /medications/administrations/upcoming` - Upcoming schedule
7. `GET /medications/administrations/missed` - Missed doses tracking
8. `POST /medications/administrations/:id/witness` - Witness signatures for controlled substances
9. `POST /medications/administrations/check-allergies` - Allergy safety check
10. `POST /medications/administrations/check-interactions` - Drug interaction check
11. `POST /medications/administrations/refusal` - Record refusal
12. `POST /medications/administrations/missed` - Record missed dose
13. `POST /medications/administrations/held` - Record held medication
14. `GET /medications/administrations/statistics` - Administration statistics

**Gap:** Frontend implements only 1 endpoint functionality when 14 exist. **Patient safety protocols not enforced.**

### 2. Safety-Critical Gap: No Allergy Conflict Checking

**Current State:**
```typescript
// ❌ NO HOOKS EXIST for allergy checking before medication administration
// Nurses can administer medications WITHOUT checking for allergies
```

**Backend Reality (Allergy Safety Service):**
```typescript
// POST /allergy/check-conflict
interface DrugAllergyConflict {
  hasConflict: boolean;
  conflictingAllergies: Allergy[];
  riskLevel: 'NONE' | 'LOW' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  recommendation: string; // "CRITICAL ALERT: DO NOT ADMINISTER..."
}
```

**Gap:** **CRITICAL PATIENT SAFETY VIOLATION** - No frontend integration to check allergies before medication administration.

### 3. Authentication Gap: No OAuth/MFA Support

**Current State:**
```typescript
// frontend/src/hooks/core/useAuth.ts
// ❌ Only basic username/password authentication
// ❌ No OAuth (Google/Microsoft) support
// ❌ No MFA (TOTP, backup codes) support
```

**Backend Reality:**
- `OAuthService`: Google/Microsoft authentication
- `MfaService`: TOTP setup, verification, backup codes

**Gap:** Modern authentication features implemented in backend but not accessible from frontend.

---

## Priority Matrix

### Implementation Priority (by Safety & Impact)

**🔴 CRITICAL - Implement First (Week 1-2):**

1. **Allergy Conflict Checking Hooks** ⚠️ PATIENT SAFETY
   - `useAllergyConflictCheck()` - Check before any medication administration
   - `useCriticalAllergies()` - Display critical allergies prominently
   - Integration with medication workflow (blocking)

2. **Medication Administration Workflow Hooks** ⚠️ PATIENT SAFETY
   - `useMedicationAdministrationWorkflow()` - Complete Five Rights workflow
   - `useFiveRightsVerification()` - Server-side verification
   - `useSafetyChecks()` - Allergies + drug interactions
   - `useWitnessSignature()` - Controlled substance signatures

**🟠 HIGH - Implement Next (Week 3-4):**

3. **OAuth/MFA Authentication Hooks** 🔒 SECURITY
   - `useOAuthLogin()` - Google/Microsoft authentication
   - `useMfaSetup()` - MFA enrollment workflow
   - `useMfaVerification()` - MFA login verification
   - `useMfaBackupCodes()` - Backup code management

4. **Medication Scheduling Hooks** 📊 CLINICAL
   - `useDueMedications()` - Due medication alerts
   - `useOverdueMedications()` - Overdue tracking
   - `useUpcomingMedications()` - Upcoming schedule
   - `useMedicationStatistics()` - Administration analytics

**🟡 MEDIUM - Implement Later (Week 5-6):**

5. **Screening Module Hooks** 📋 COMPLIANCE
   - `useStudentScreenings()` - Student screening records
   - `useOverdueScreenings()` - Compliance tracking
   - `useScreeningSchedule()` - State-specific requirements
   - `useScreeningReferrals()` - Specialist referrals

6. **Vaccination Tracking Hooks** 💉 COMPLIANCE
   - `useStudentVaccinations()` - Vaccination records
   - `useVaccinationSchedule()` - CDC-compliant schedules
   - `useOverdueVaccinations()` - Compliance tracking

---

## Medication Administration Integration

### Current Architecture Problems

**Problem 1: Outdated Hook Structure**

The current `useMedicationAdministration` hook calls an old API:

```typescript
// ❌ CURRENT - Outdated
await medicationsApi.logAdministration({
  studentMedicationId: `${data.studentId}-${data.medicationId}`,
  scheduledTime: data.administrationTime,
  dosage: data.dosage,
  status: 'administered',
  notes: data.notes,
});
```

**Problem 2: No Five Rights Workflow**

The Five Rights of Medication Administration are NOT enforced:
1. ✅ Right Patient - Validated client-side only
2. ✅ Right Medication - Validated client-side only
3. ✅ Right Dose - Validated client-side only (regex)
4. ❌ Right Route - NOT validated
5. ✅ Right Time - Validated client-side only

**Problem 3: No Safety Integration**

- No allergy checking before administration
- No drug interaction checking
- No LASA (Look-Alike Sound-Alike) warnings
- No barcode scanning integration

### Recommended New Hook Architecture

#### 1. Complete Medication Administration Workflow Hook

```typescript
/**
 * Complete medication administration workflow with Five Rights verification
 * @file frontend/src/hooks/domains/medications/mutations/useMedicationAdministrationWorkflow.ts
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { medicationAdministrationApi } from '@/services/modules/medicationAdministrationApi';
import { useAllergyConflictCheck } from '../safety/useAllergyConflictCheck';
import { useDrugInteractionCheck } from '../safety/useDrugInteractionCheck';

export interface AdministrationSession {
  sessionId: string;
  prescriptionId: string;
  studentId: string;
  medicationId: string;
  scheduledTime: string;
  prescription: Prescription;
  medication: Medication;
  student: Student;
  safetyChecks: {
    allergiesChecked: boolean;
    interactionsChecked: boolean;
    contraindicationsChecked: boolean;
  };
}

export interface FiveRightsVerification {
  studentId: string;
  medicationId: string;
  dosage: string;
  route: string;
  scheduledTime: string;
  scanData?: {
    studentBarcode?: string;
    medicationBarcode?: string;
  };
}

export interface FiveRightsResult {
  verified: boolean;
  errors: string[];
  warnings: string[];
  canProceed: boolean;
  rightPatient: { verified: boolean; message: string };
  rightMedication: { verified: boolean; message: string };
  rightDose: { verified: boolean; message: string };
  rightRoute: { verified: boolean; message: string };
  rightTime: { verified: boolean; message: string };
  allergyWarnings?: AllergyConflict[];
  interactionWarnings?: DrugInteraction[];
  lasaWarnings?: LASAWarning[];
}

export interface AdministrationData {
  sessionId: string;
  dosageAdministered: string;
  route: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
  };
  studentResponse?: string;
  notes?: string;
  witnessRequired?: boolean;
  witnessId?: string;
}

export const useMedicationAdministrationWorkflow = () => {
  const queryClient = useQueryClient();
  const allergyCheck = useAllergyConflictCheck();
  const interactionCheck = useDrugInteractionCheck();

  // STEP 1: Initiate administration session
  const initiateSession = useMutation({
    mutationFn: async (prescriptionId: string): Promise<AdministrationSession> => {
      return await medicationAdministrationApi.initiate({ prescriptionId });
    },
    onSuccess: (session) => {
      // Cache session data
      queryClient.setQueryData(['medication-administration-session', session.sessionId], session);
    },
  });

  // STEP 2: Verify Five Rights (SERVER-SIDE)
  const verifyFiveRights = useMutation({
    mutationFn: async (verification: FiveRightsVerification): Promise<FiveRightsResult> => {
      return await medicationAdministrationApi.verifyFiveRights(verification);
    },
    // ❌ NO optimistic updates - wait for server verification
  });

  // STEP 3: Perform safety checks
  const performSafetyChecks = async (
    studentId: string,
    medicationName: string,
    medicationClass?: string
  ): Promise<{ safe: boolean; conflicts: any[] }> => {
    // Check allergies
    const allergyResult = await allergyCheck.mutateAsync({
      studentId,
      medicationName,
      medicationClass,
    });

    // Check drug interactions
    const interactionResult = await interactionCheck.mutateAsync({
      studentId,
      medicationId: medicationName,
    });

    const safe = !allergyResult.hasConflict && interactionResult.interactions.length === 0;

    return {
      safe,
      conflicts: [
        ...(allergyResult.hasConflict ? allergyResult.conflictingAllergies : []),
        ...interactionResult.interactions,
      ],
    };
  };

  // STEP 4: Record administration (AFTER verification passes)
  const recordAdministration = useMutation({
    mutationFn: async (data: AdministrationData) => {
      return await medicationAdministrationApi.record(data);
    },
    onSuccess: (result, variables) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['medication-reminders'] });
      queryClient.invalidateQueries({ queryKey: ['medications', 'due'] });
      queryClient.invalidateQueries({ queryKey: ['medications', 'upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['medication-administration-history'] });

      // Remove session from cache
      queryClient.removeQueries({ queryKey: ['medication-administration-session', variables.sessionId] });
    },
    // ❌ NO optimistic updates - safety critical operation
  });

  return {
    initiateSession: initiateSession.mutateAsync,
    isInitiating: initiateSession.isPending,

    verifyFiveRights: verifyFiveRights.mutateAsync,
    isVerifying: verifyFiveRights.isPending,

    performSafetyChecks,

    recordAdministration: recordAdministration.mutateAsync,
    isRecording: recordAdministration.isPending,

    // Aggregate loading state
    isProcessing: initiateSession.isPending || verifyFiveRights.isPending || recordAdministration.isPending,
  };
};
```

#### 2. Due Medications Hook

```typescript
/**
 * Hook for retrieving due medications
 * @file frontend/src/hooks/domains/medications/queries/useDueMedications.ts
 */

import { useQuery } from '@tanstack/react-query';
import { medicationAdministrationApi } from '@/services/modules/medicationAdministrationApi';
import { medicationQueryKeys } from '../config';

export const useDueMedications = (nurseId?: string, withinHours: number = 4) => {
  return useQuery({
    queryKey: medicationQueryKeys.administration.due(nurseId, withinHours),
    queryFn: async () => {
      return await medicationAdministrationApi.getDue({ nurseId, withinHours });
    },
    staleTime: 1000 * 60 * 2, // 2 minutes - frequent updates for patient safety
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    refetchOnWindowFocus: true, // Always check when nurse returns to app
  });
};
```

#### 3. Overdue Medications Hook

```typescript
/**
 * Hook for retrieving overdue medications
 * @file frontend/src/hooks/domains/medications/queries/useOverdueMedications.ts
 */

import { useQuery } from '@tanstack/react-query';
import { medicationAdministrationApi } from '@/services/modules/medicationAdministrationApi';
import { medicationQueryKeys } from '../config';

export const useOverdueMedications = (nurseId?: string) => {
  return useQuery({
    queryKey: medicationQueryKeys.administration.overdue(nurseId),
    queryFn: async () => {
      return await medicationAdministrationApi.getOverdue({ nurseId });
    },
    staleTime: 1000 * 60 * 1, // 1 minute - critical for patient safety
    refetchInterval: 1000 * 60 * 3, // Refetch every 3 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};
```

#### 4. Witness Signature Hook (for Controlled Substances)

```typescript
/**
 * Hook for witness signature workflow on controlled substances
 * @file frontend/src/hooks/domains/medications/mutations/useWitnessSignature.ts
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { medicationAdministrationApi } from '@/services/modules/medicationAdministrationApi';

export const useWitnessSignature = () => {
  const queryClient = useQueryClient();

  const requestWitness = useMutation({
    mutationFn: async ({ administrationId, witnessId }: { administrationId: string; witnessId: string }) => {
      return await medicationAdministrationApi.requestWitnessSignature(administrationId, { witnessId });
    },
  });

  const submitWitnessSignature = useMutation({
    mutationFn: async ({
      administrationId,
      signature,
      witnessId,
    }: {
      administrationId: string;
      signature: string;
      witnessId: string;
    }) => {
      return await medicationAdministrationApi.submitWitnessSignature(administrationId, {
        signature,
        witnessId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medication-administration-history'] });
    },
  });

  return {
    requestWitness: requestWitness.mutateAsync,
    submitSignature: submitWitnessSignature.mutateAsync,
    isRequestingWitness: requestWitness.isPending,
    isSubmittingSignature: submitWitnessSignature.isPending,
  };
};
```

### Query Key Structure for Medication Administration

Add to `frontend/src/hooks/domains/medications/config.ts`:

```typescript
export const medicationQueryKeys = {
  // ... existing keys

  administration: {
    all: ['medications', 'administration'] as const,

    due: (nurseId?: string, withinHours?: number) =>
      [...medicationQueryKeys.administration.all, 'due', { nurseId, withinHours }] as const,

    overdue: (nurseId?: string) =>
      [...medicationQueryKeys.administration.all, 'overdue', { nurseId }] as const,

    upcoming: (nurseId?: string, withinHours?: number) =>
      [...medicationQueryKeys.administration.all, 'upcoming', { nurseId, withinHours }] as const,

    missed: (studentId?: string, dateRange?: { startDate: string; endDate: string }) =>
      [...medicationQueryKeys.administration.all, 'missed', { studentId, dateRange }] as const,

    byStudent: (studentId: string) =>
      [...medicationQueryKeys.administration.all, 'student', studentId] as const,

    byPrescription: (prescriptionId: string) =>
      [...medicationQueryKeys.administration.all, 'prescription', prescriptionId] as const,

    statistics: (filters?: any) =>
      [...medicationQueryKeys.administration.all, 'statistics', filters] as const,

    session: (sessionId: string) =>
      [...medicationQueryKeys.administration.all, 'session', sessionId] as const,
  },
};
```

---

## OAuth/MFA Authentication Integration

### Current State

The current authentication system (`frontend/src/hooks/core/useAuth.ts`) only supports:
- Basic username/password authentication
- Permission checking (RBAC)
- Session management

**Missing:**
- OAuth providers (Google, Microsoft)
- Multi-Factor Authentication (TOTP)
- Backup code management

### Backend Capabilities

**OAuth Service (`backend/src/auth/services/oauth.service.ts`):**
- `verifyGoogleToken()` - Google OAuth verification
- `verifyMicrosoftToken()` - Microsoft OAuth verification
- `handleOAuthLogin()` - Create/login user from OAuth profile

**MFA Service (`backend/src/auth/services/mfa.service.ts`):**
- `setupMfa()` - Generate TOTP secret and QR code
- `enableMfa()` - Enable MFA after verification
- `verifyMfa()` - Verify TOTP code or backup code
- `disableMfa()` - Disable MFA
- `getMfaStatus()` - Get current MFA status
- `regenerateBackupCodes()` - Generate new backup codes

### Recommended Hooks

#### 1. OAuth Login Hook

```typescript
/**
 * OAuth authentication hook (Google/Microsoft)
 * @file frontend/src/hooks/core/auth/useOAuthLogin.ts
 */

import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/services';
import { useAuth } from '@/contexts/AuthContext';

export type OAuthProvider = 'google' | 'microsoft';

export const useOAuthLogin = () => {
  const { setUser, setToken } = useAuth();

  const loginWithGoogle = useMutation({
    mutationFn: async (idToken: string) => {
      return await authApi.oauthLogin('google', { idToken });
    },
    onSuccess: (response) => {
      setToken(response.accessToken);
      setUser(response.user);
      localStorage.setItem('refreshToken', response.refreshToken);
    },
  });

  const loginWithMicrosoft = useMutation({
    mutationFn: async (idToken: string) => {
      return await authApi.oauthLogin('microsoft', { idToken });
    },
    onSuccess: (response) => {
      setToken(response.accessToken);
      setUser(response.user);
      localStorage.setItem('refreshToken', response.refreshToken);
    },
  });

  return {
    loginWithGoogle: loginWithGoogle.mutateAsync,
    loginWithMicrosoft: loginWithMicrosoft.mutateAsync,
    isLoggingIn: loginWithGoogle.isPending || loginWithMicrosoft.isPending,
  };
};
```

#### 2. MFA Setup Hook

```typescript
/**
 * MFA setup workflow hook
 * @file frontend/src/hooks/core/auth/useMfaSetup.ts
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '@/services';

export interface MfaSetupData {
  secret: string;
  qrCode: string; // Data URL for QR code image
  backupCodes: string[];
  manualEntryKey: string;
}

export const useMfaSetup = (userId: string) => {
  // Get current MFA status
  const mfaStatus = useQuery({
    queryKey: ['mfa-status', userId],
    queryFn: async () => {
      return await authApi.getMfaStatus(userId);
    },
    enabled: !!userId,
  });

  // Initiate MFA setup
  const setupMfa = useMutation({
    mutationFn: async () => {
      return await authApi.setupMfa(userId);
    },
  });

  // Enable MFA (after user scans QR code and enters verification code)
  const enableMfa = useMutation({
    mutationFn: async ({ code, secret }: { code: string; secret: string }) => {
      return await authApi.enableMfa(userId, { code, secret });
    },
    onSuccess: () => {
      mfaStatus.refetch();
    },
  });

  // Disable MFA
  const disableMfa = useMutation({
    mutationFn: async ({ password, code }: { password: string; code?: string }) => {
      return await authApi.disableMfa(userId, { password, code });
    },
    onSuccess: () => {
      mfaStatus.refetch();
    },
  });

  // Regenerate backup codes
  const regenerateBackupCodes = useMutation({
    mutationFn: async ({ password, code }: { password: string; code: string }) => {
      return await authApi.regenerateBackupCodes(userId, { password, code });
    },
  });

  return {
    mfaStatus: mfaStatus.data,
    isLoadingStatus: mfaStatus.isLoading,

    setupMfa: setupMfa.mutateAsync,
    isSettingUp: setupMfa.isPending,
    setupData: setupMfa.data as MfaSetupData | undefined,

    enableMfa: enableMfa.mutateAsync,
    isEnabling: enableMfa.isPending,

    disableMfa: disableMfa.mutateAsync,
    isDisabling: disableMfa.isPending,

    regenerateBackupCodes: regenerateBackupCodes.mutateAsync,
    isRegenerating: regenerateBackupCodes.isPending,
    newBackupCodes: regenerateBackupCodes.data?.backupCodes,
  };
};
```

#### 3. MFA Verification Hook

```typescript
/**
 * MFA verification during login
 * @file frontend/src/hooks/core/auth/useMfaVerification.ts
 */

import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/services';
import { useAuth } from '@/contexts/AuthContext';

export const useMfaVerification = (userId: string) => {
  const { setUser, setToken } = useAuth();

  const verifyMfaCode = useMutation({
    mutationFn: async ({ code, isBackupCode = false }: { code: string; isBackupCode?: boolean }) => {
      return await authApi.verifyMfa(userId, { code, isBackupCode });
    },
    onSuccess: (response) => {
      if (response.accessToken) {
        setToken(response.accessToken);
        setUser(response.user);
        localStorage.setItem('refreshToken', response.refreshToken);
      }
    },
  });

  return {
    verifyCode: verifyMfaCode.mutateAsync,
    isVerifying: verifyMfaCode.isPending,
    verificationError: verifyMfaCode.error,
  };
};
```

### AuthContext Updates

Update `frontend/src/contexts/AuthContext.tsx` to support OAuth/MFA:

```typescript
interface AuthContextType {
  // ... existing fields

  // OAuth
  loginWithOAuth: (provider: 'google' | 'microsoft', idToken: string) => Promise<void>;

  // MFA
  mfaRequired: boolean;
  setMfaRequired: (required: boolean) => void;
  mfaUserId: string | null;
  setMfaUserId: (userId: string | null) => void;
}
```

---

## Allergy Safety Integration

### Critical Patient Safety Gap

**CURRENT STATE:** ❌ **No allergy checking before medication administration**

Nurses can currently administer medications without any automated allergy conflict checking. This is a **CRITICAL PATIENT SAFETY VIOLATION**.

### Backend Allergy Safety Service

The backend has a comprehensive allergy safety service:

```typescript
// POST /allergy/check-conflict
interface DrugAllergyConflict {
  hasConflict: boolean;
  conflictingAllergies: Allergy[];
  riskLevel: 'NONE' | 'LOW' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  recommendation: string;
}
```

**Example Response:**
```json
{
  "hasConflict": true,
  "conflictingAllergies": [
    {
      "allergen": "Penicillin",
      "severity": "LIFE_THREATENING",
      "reaction": "Anaphylaxis, severe hives, difficulty breathing"
    }
  ],
  "riskLevel": "LIFE_THREATENING",
  "recommendation": "CRITICAL ALERT: DO NOT ADMINISTER. Patient has life-threatening allergy to Penicillin. Contact physician immediately."
}
```

### Recommended Hooks

#### 1. Allergy Conflict Check Hook (CRITICAL)

```typescript
/**
 * Allergy conflict checking hook - PATIENT SAFETY CRITICAL
 * Must be called before ANY medication administration
 *
 * @file frontend/src/hooks/domains/safety/useAllergyConflictCheck.ts
 */

import { useMutation } from '@tanstack/react-query';
import { allergyApi } from '@/services/modules/allergyApi';
import { toast } from 'react-hot-toast';

export interface AllergyConflict {
  hasConflict: boolean;
  conflictingAllergies: Array<{
    id: string;
    allergen: string;
    severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
    reaction: string;
  }>;
  riskLevel: 'NONE' | 'LOW' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  recommendation: string;
}

export const useAllergyConflictCheck = () => {
  const checkConflict = useMutation({
    mutationFn: async ({
      studentId,
      medicationName,
      medicationClass,
    }: {
      studentId: string;
      medicationName: string;
      medicationClass?: string;
    }): Promise<AllergyConflict> => {
      return await allergyApi.checkConflict({
        studentId,
        medicationName,
        medicationClass,
      });
    },
    onSuccess: (result) => {
      // Show alerts for any conflicts
      if (result.hasConflict) {
        if (result.riskLevel === 'LIFE_THREATENING') {
          toast.error(`🚨 CRITICAL ALERT: ${result.recommendation}`, {
            duration: Infinity, // Don't auto-dismiss
            style: {
              background: '#DC2626',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
            },
          });
        } else if (result.riskLevel === 'SEVERE') {
          toast.error(`⚠️ SEVERE ALERT: ${result.recommendation}`, {
            duration: 10000,
            style: {
              background: '#EA580C',
              color: 'white',
              fontSize: '15px',
              fontWeight: 'bold',
            },
          });
        } else if (result.riskLevel === 'MODERATE') {
          toast.warning(`⚠️ CAUTION: ${result.recommendation}`, {
            duration: 8000,
            style: {
              background: '#F59E0B',
              color: 'white',
            },
          });
        }
      }
    },
    // ❌ NO retry - safety checks should not auto-retry
    retry: false,
  });

  return {
    checkConflict: checkConflict.mutateAsync,
    isChecking: checkConflict.isPending,
    conflictResult: checkConflict.data,
    error: checkConflict.error,
  };
};
```

#### 2. Critical Allergies Hook

```typescript
/**
 * Critical allergies display hook
 * Shows SEVERE and LIFE_THREATENING allergies prominently
 *
 * @file frontend/src/hooks/domains/safety/useCriticalAllergies.ts
 */

import { useQuery } from '@tanstack/react-query';
import { allergyApi } from '@/services/modules/allergyApi';

export const useCriticalAllergies = (studentId: string) => {
  return useQuery({
    queryKey: ['critical-allergies', studentId],
    queryFn: async () => {
      return await allergyApi.getCriticalAllergies(studentId);
    },
    enabled: !!studentId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: true, // Always check on mount for patient safety
    refetchOnWindowFocus: true, // Always check when nurse returns to app
  });
};
```

#### 3. Student Allergies Hook

```typescript
/**
 * Student allergies hook
 *
 * @file frontend/src/hooks/domains/safety/useStudentAllergies.ts
 */

import { useQuery } from '@tanstack/react-query';
import { allergyApi } from '@/services/modules/allergyApi';

export const useStudentAllergies = (studentId: string, includeInactive: boolean = false) => {
  return useQuery({
    queryKey: ['student-allergies', studentId, includeInactive],
    queryFn: async () => {
      return await allergyApi.getStudentAllergies(studentId, includeInactive);
    },
    enabled: !!studentId,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
```

### Integration with Medication Administration

The allergy conflict check **MUST** be integrated into the medication administration workflow:

```typescript
// In useMedicationAdministrationWorkflow.ts

const performSafetyChecks = async (
  studentId: string,
  medicationName: string,
  medicationClass?: string
): Promise<{ safe: boolean; conflicts: AllergyConflict[] }> => {

  // 1. Check allergies (BLOCKING)
  const allergyResult = await allergyConflictCheck.mutateAsync({
    studentId,
    medicationName,
    medicationClass,
  });

  // 2. BLOCK administration if LIFE_THREATENING or SEVERE conflict
  if (allergyResult.hasConflict) {
    if (allergyResult.riskLevel === 'LIFE_THREATENING' || allergyResult.riskLevel === 'SEVERE') {
      throw new Error(allergyResult.recommendation);
    }
  }

  return {
    safe: !allergyResult.hasConflict,
    conflicts: allergyResult.hasConflict ? [allergyResult] : [],
  };
};
```

---

## Screening Module Integration

### Backend Endpoints (6 endpoints)

1. `GET /health-records/screenings/student/:studentId` - Get student screenings
2. `POST /health-records/screenings/batch` - Batch screening creation
3. `GET /health-records/screenings/overdue` - Get overdue screenings
4. `GET /health-records/screenings/schedule` - Get screening schedule
5. `POST /health-records/screenings/:id/referral` - Create referral
6. `GET /health-records/screenings/statistics` - Get statistics

### Recommended Hooks

#### 1. Student Screenings Hook

```typescript
/**
 * Student screenings hook
 * @file frontend/src/hooks/domains/health-records/queries/useStudentScreenings.ts
 */

import { useQuery } from '@tanstack/react-query';
import { screeningApi } from '@/services/modules/screeningApi';

export const useStudentScreenings = (studentId: string) => {
  return useQuery({
    queryKey: ['student-screenings', studentId],
    queryFn: async () => {
      return await screeningApi.getStudentScreenings(studentId);
    },
    enabled: !!studentId,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
```

#### 2. Overdue Screenings Hook

```typescript
/**
 * Overdue screenings hook for compliance tracking
 * @file frontend/src/hooks/domains/health-records/queries/useOverdueScreenings.ts
 */

import { useQuery } from '@tanstack/react-query';
import { screeningApi } from '@/services/modules/screeningApi';

export interface OverdueScreeningsFilters {
  schoolId?: string;
  gradeLevel?: string;
  screeningType?: string;
}

export const useOverdueScreenings = (filters?: OverdueScreeningsFilters) => {
  return useQuery({
    queryKey: ['overdue-screenings', filters],
    queryFn: async () => {
      return await screeningApi.getOverdueScreenings(filters);
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchInterval: 1000 * 60 * 15, // Refetch every 15 minutes for compliance
  });
};
```

#### 3. Screening Schedule Hook

```typescript
/**
 * Screening schedule hook (state-specific requirements)
 * @file frontend/src/hooks/domains/health-records/queries/useScreeningSchedule.ts
 */

import { useQuery } from '@tanstack/react-query';
import { screeningApi } from '@/services/modules/screeningApi';

export const useScreeningSchedule = (gradeLevel?: string, stateCode?: string) => {
  return useQuery({
    queryKey: ['screening-schedule', gradeLevel, stateCode],
    queryFn: async () => {
      return await screeningApi.getScreeningSchedule({ gradeLevel, stateCode });
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - schedules rarely change
  });
};
```

---

## Vaccination Tracking Integration

### Backend Capabilities

The backend has a `VaccinationController` with CDC-compliant vaccination tracking.

### Recommended Hooks

#### 1. Student Vaccinations Hook

```typescript
/**
 * Student vaccinations hook
 * @file frontend/src/hooks/domains/health-records/queries/useStudentVaccinations.ts
 */

import { useQuery } from '@tanstack/react-query';
import { vaccinationApi } from '@/services/modules/vaccinationApi';

export const useStudentVaccinations = (studentId: string) => {
  return useQuery({
    queryKey: ['student-vaccinations', studentId],
    queryFn: async () => {
      return await vaccinationApi.getStudentVaccinations(studentId);
    },
    enabled: !!studentId,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
```

#### 2. Vaccination Schedule Hook (CDC)

```typescript
/**
 * CDC vaccination schedule hook
 * @file frontend/src/hooks/domains/health-records/queries/useVaccinationSchedule.ts
 */

import { useQuery } from '@tanstack/react-query';
import { vaccinationApi } from '@/services/modules/vaccinationApi';

export const useVaccinationSchedule = (ageInMonths: number) => {
  return useQuery({
    queryKey: ['vaccination-schedule', ageInMonths],
    queryFn: async () => {
      return await vaccinationApi.getCDCSchedule(ageInMonths);
    },
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week - CDC schedules rarely change
  });
};
```

---

## Query Key Management Strategy

### Consistent Query Key Structure

All query keys should follow this pattern:

```typescript
[domain, subdomain, ...identifiers, ...filters]
```

### Recommended Query Key Organization

```typescript
// frontend/src/hooks/queryKeys.ts

export const queryKeys = {
  medications: {
    all: ['medications'] as const,

    lists: {
      all: [...queryKeys.medications.all, 'list'] as const,
      byStudent: (studentId: string) => [...queryKeys.medications.lists.all, studentId] as const,
      byFilters: (filters: any) => [...queryKeys.medications.lists.all, filters] as const,
    },

    details: {
      all: [...queryKeys.medications.all, 'detail'] as const,
      byId: (id: string) => [...queryKeys.medications.details.all, id] as const,
    },

    administration: {
      all: [...queryKeys.medications.all, 'administration'] as const,
      due: (nurseId?: string, withinHours?: number) =>
        [...queryKeys.medications.administration.all, 'due', { nurseId, withinHours }] as const,
      overdue: (nurseId?: string) =>
        [...queryKeys.medications.administration.all, 'overdue', { nurseId }] as const,
      upcoming: (nurseId?: string, withinHours?: number) =>
        [...queryKeys.medications.administration.all, 'upcoming', { nurseId, withinHours }] as const,
      history: (studentId: string) =>
        [...queryKeys.medications.administration.all, 'history', studentId] as const,
    },
  },

  allergies: {
    all: ['allergies'] as const,

    byStudent: (studentId: string, includeInactive?: boolean) =>
      [...queryKeys.allergies.all, 'student', studentId, { includeInactive }] as const,

    critical: (studentId: string) =>
      [...queryKeys.allergies.all, 'critical', studentId] as const,

    conflictCheck: (studentId: string, medicationName: string) =>
      [...queryKeys.allergies.all, 'conflict', studentId, medicationName] as const,
  },

  screenings: {
    all: ['screenings'] as const,

    byStudent: (studentId: string) =>
      [...queryKeys.screenings.all, 'student', studentId] as const,

    overdue: (filters?: any) =>
      [...queryKeys.screenings.all, 'overdue', filters] as const,

    schedule: (gradeLevel?: string, stateCode?: string) =>
      [...queryKeys.screenings.all, 'schedule', { gradeLevel, stateCode }] as const,
  },

  vaccinations: {
    all: ['vaccinations'] as const,

    byStudent: (studentId: string) =>
      [...queryKeys.vaccinations.all, 'student', studentId] as const,

    cdcSchedule: (ageInMonths: number) =>
      [...queryKeys.vaccinations.all, 'cdc-schedule', ageInMonths] as const,
  },

  auth: {
    all: ['auth'] as const,

    mfaStatus: (userId: string) =>
      [...queryKeys.auth.all, 'mfa-status', userId] as const,
  },
};
```

### Query Invalidation Patterns

```typescript
// Invalidate all medication queries
queryClient.invalidateQueries({ queryKey: queryKeys.medications.all });

// Invalidate only medication administration queries
queryClient.invalidateQueries({ queryKey: queryKeys.medications.administration.all });

// Invalidate specific student's medications
queryClient.invalidateQueries({ queryKey: queryKeys.medications.lists.byStudent(studentId) });

// Invalidate allergy conflict checks for a student
queryClient.invalidateQueries({
  queryKey: ['allergies', 'conflict', studentId],
  exact: false
});
```

---

## Error Handling Patterns

### Safety-Critical Error Handling

For patient safety operations (medication administration, allergy checks), errors should:

1. **Never be silent** - always notify the user
2. **Never auto-retry** - require manual retry
3. **Block the operation** - don't allow proceeding with errors
4. **Log for compliance** - create audit trail

```typescript
// Safety-critical error handler
const handleSafetyCriticalError = (error: Error, operation: string) => {
  // 1. Show prominent error to user
  toast.error(`⚠️ SAFETY ERROR: ${error.message}`, {
    duration: Infinity,
    style: {
      background: '#DC2626',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold',
    },
  });

  // 2. Log to audit system
  auditApi.logSafetyError({
    operation,
    error: error.message,
    timestamp: new Date().toISOString(),
    userId: currentUser.id,
  });

  // 3. Re-throw to block operation
  throw error;
};

// Example usage in medication administration
const recordAdministration = useMutation({
  mutationFn: async (data: AdministrationData) => {
    try {
      return await medicationAdministrationApi.record(data);
    } catch (error) {
      handleSafetyCriticalError(error as Error, 'medication_administration');
    }
  },
  retry: false, // ❌ NO retry for safety operations
});
```

### OAuth/MFA Error Handling

```typescript
// OAuth/MFA error handler
const handleAuthError = (error: Error, provider?: string) => {
  if (error.message.includes('Invalid token')) {
    toast.error('Authentication failed. Please try again.');
  } else if (error.message.includes('MFA required')) {
    // Redirect to MFA verification
    setMfaRequired(true);
  } else if (error.message.includes('Invalid verification code')) {
    toast.error('Invalid code. Please check and try again.');
  } else {
    toast.error(`Authentication error: ${error.message}`);
  }
};
```

---

## Testing Priorities

### Critical Path Testing (Priority 1)

**Patient Safety Operations:**

1. **Allergy Conflict Checking**
   - ✅ Test: Detecting LIFE_THREATENING allergies blocks medication
   - ✅ Test: Displaying critical allergy alerts
   - ✅ Test: No false negatives (all conflicts detected)

2. **Medication Administration Workflow**
   - ✅ Test: Five Rights verification catches errors
   - ✅ Test: Cannot administer without passing verification
   - ✅ Test: Witness signature required for controlled substances
   - ✅ Test: No optimistic updates (wait for server confirmation)

3. **Due/Overdue Medications**
   - ✅ Test: Overdue medications trigger alerts
   - ✅ Test: Due medications displayed at correct times
   - ✅ Test: Refetch on window focus works

### Security Testing (Priority 2)

**OAuth/MFA:**

1. ✅ Test: OAuth login flow (Google/Microsoft)
2. ✅ Test: MFA setup workflow (QR code generation)
3. ✅ Test: MFA verification (TOTP codes)
4. ✅ Test: Backup code usage
5. ✅ Test: MFA disable with password confirmation

### Integration Testing (Priority 3)

**Screening & Vaccination:**

1. ✅ Test: Overdue screenings compliance tracking
2. ✅ Test: Batch screening import
3. ✅ Test: Vaccination schedule (CDC compliance)
4. ✅ Test: Referral creation workflow

---

## Developer Migration Guide

### Step 1: Update API Service Layer

Create new API modules for missing endpoints:

**1. Medication Administration API**

```typescript
// frontend/src/services/modules/medicationAdministrationApi.ts

export const medicationAdministrationApi = {
  async initiate(data: { prescriptionId: string }) {
    return await apiInstance.post('/medications/administrations/initiate', data);
  },

  async verifyFiveRights(data: FiveRightsVerification) {
    return await apiInstance.post('/medications/administrations/verify', data);
  },

  async record(data: AdministrationData) {
    return await apiInstance.post('/medications/administrations', data);
  },

  async getDue(params: { nurseId?: string; withinHours?: number }) {
    return await apiInstance.get('/medications/administrations/due', { params });
  },

  async getOverdue(params: { nurseId?: string }) {
    return await apiInstance.get('/medications/administrations/overdue', { params });
  },

  // ... other endpoints
};
```

**2. Allergy API**

```typescript
// frontend/src/services/modules/allergyApi.ts

export const allergyApi = {
  async checkConflict(data: {
    studentId: string;
    medicationName: string;
    medicationClass?: string;
  }) {
    return await apiInstance.post('/allergy/check-conflict', data);
  },

  async getCriticalAllergies(studentId: string) {
    return await apiInstance.get(`/allergy/student/${studentId}/critical`);
  },

  async getStudentAllergies(studentId: string, includeInactive: boolean = false) {
    return await apiInstance.get(`/allergy/student/${studentId}`, {
      params: { includeInactive },
    });
  },

  // ... other endpoints
};
```

**3. OAuth/MFA API**

```typescript
// frontend/src/services/modules/authApi.ts (add to existing)

export const authApi = {
  // ... existing auth methods

  async oauthLogin(provider: 'google' | 'microsoft', data: { idToken: string }) {
    return await apiInstance.post(`/auth/oauth/${provider}`, data);
  },

  async setupMfa(userId: string) {
    return await apiInstance.post(`/auth/mfa/${userId}/setup`);
  },

  async enableMfa(userId: string, data: { code: string; secret: string }) {
    return await apiInstance.post(`/auth/mfa/${userId}/enable`, data);
  },

  async verifyMfa(userId: string, data: { code: string; isBackupCode?: boolean }) {
    return await apiInstance.post(`/auth/mfa/${userId}/verify`, data);
  },

  async getMfaStatus(userId: string) {
    return await apiInstance.get(`/auth/mfa/${userId}/status`);
  },

  // ... other MFA methods
};
```

### Step 2: Create Hook Files

Create the hook files in the recommended locations:

```
frontend/src/hooks/
├── domains/
│   ├── medications/
│   │   ├── mutations/
│   │   │   ├── useMedicationAdministrationWorkflow.ts ✨ NEW
│   │   │   ├── useWitnessSignature.ts ✨ NEW
│   │   │   └── useMedicationAdministration.ts (UPDATE)
│   │   └── queries/
│   │       ├── useDueMedications.ts ✨ NEW
│   │       ├── useOverdueMedications.ts ✨ NEW
│   │       ├── useUpcomingMedications.ts ✨ NEW
│   │       └── useMedicationStatistics.ts ✨ NEW
│   ├── safety/
│   │   ├── useAllergyConflictCheck.ts ✨ NEW
│   │   ├── useCriticalAllergies.ts ✨ NEW
│   │   ├── useStudentAllergies.ts ✨ NEW
│   │   └── useDrugInteractionCheck.ts ✨ NEW
│   └── health-records/
│       ├── queries/
│       │   ├── useStudentScreenings.ts ✨ NEW
│       │   ├── useOverdueScreenings.ts ✨ NEW
│       │   ├── useScreeningSchedule.ts ✨ NEW
│       │   ├── useStudentVaccinations.ts ✨ NEW
│       │   └── useVaccinationSchedule.ts ✨ NEW
├── core/
│   └── auth/
│       ├── useOAuthLogin.ts ✨ NEW
│       ├── useMfaSetup.ts ✨ NEW
│       └── useMfaVerification.ts ✨ NEW
```

### Step 3: Update Components

**Example: Medication Administration Component**

```typescript
// BEFORE (outdated)
const MedicationAdminForm = ({ studentId, medicationId }) => {
  const { administerMedication, isAdministering } = useMedicationAdministration();

  const handleSubmit = async (data) => {
    await administerMedication(data);
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

```typescript
// AFTER (with Five Rights workflow and safety checks)
const MedicationAdminForm = ({ prescriptionId, studentId, medicationName }) => {
  const {
    initiateSession,
    verifyFiveRights,
    performSafetyChecks,
    recordAdministration,
    isProcessing,
  } = useMedicationAdministrationWorkflow();

  const [session, setSession] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [safetyChecksPassed, setSafetyChecksPassed] = useState(false);

  // Step 1: Initiate session
  const handleInitiate = async () => {
    const sessionData = await initiateSession(prescriptionId);
    setSession(sessionData);
  };

  // Step 2: Verify Five Rights
  const handleVerify = async (data) => {
    const result = await verifyFiveRights(data);
    setVerificationResult(result);

    if (!result.canProceed) {
      toast.error('Five Rights verification failed. Cannot proceed.');
      return;
    }
  };

  // Step 3: Safety checks (allergies + interactions)
  const handleSafetyChecks = async () => {
    const { safe, conflicts } = await performSafetyChecks(
      studentId,
      medicationName,
      session.medication.class
    );

    if (!safe) {
      // Show conflicts to user and require acknowledgment
      setConflicts(conflicts);
      return;
    }

    setSafetyChecksPassed(true);
  };

  // Step 4: Record administration
  const handleAdminister = async (data) => {
    await recordAdministration({
      sessionId: session.sessionId,
      ...data,
    });

    toast.success('Medication administered successfully');
    onClose();
  };

  return (
    <MedicationAdminWorkflow
      session={session}
      verificationResult={verificationResult}
      safetyChecksPassed={safetyChecksPassed}
      onInitiate={handleInitiate}
      onVerify={handleVerify}
      onSafetyCheck={handleSafetyChecks}
      onAdminister={handleAdminister}
      isProcessing={isProcessing}
    />
  );
};
```

### Step 4: Update Query Keys Config

Add new query key structures to domain configs.

### Step 5: Testing

1. **Unit test each hook** with mock API responses
2. **Integration test workflow hooks** with multiple steps
3. **E2E test critical paths** (medication administration with allergy checks)

---

## Safety Considerations

### Critical Patient Safety Requirements

**1. Medication Administration:**

- ❌ **NO optimistic updates** - always wait for server confirmation
- ✅ **Five Rights verification REQUIRED** - cannot bypass
- ✅ **Allergy checking MANDATORY** - blocking operation
- ✅ **Drug interaction checking MANDATORY** - blocking operation
- ✅ **Witness signatures for controlled substances** - cannot proceed without
- ✅ **Audit logging automatic** - every operation creates audit trail

**2. Allergy Conflict Checking:**

- ✅ **LIFE_THREATENING conflicts BLOCK administration** - no override
- ✅ **SEVERE conflicts BLOCK administration** - requires physician approval
- ⚠️ **MODERATE conflicts WARN** - require acknowledgment
- ℹ️ **LOW conflicts INFORM** - display warning

**3. Error Handling:**

- ❌ **NO auto-retry** for safety operations - require manual retry
- ✅ **Errors BLOCK operations** - do not allow proceeding
- ✅ **Audit all errors** - create compliance trail
- ✅ **Prominent error display** - cannot be missed

### Security Considerations

**1. Authentication:**

- ✅ **OAuth tokens verified server-side** - never trust client
- ✅ **MFA codes verified server-side** - time-based validation
- ✅ **Backup codes single-use** - automatically removed after use
- ✅ **Refresh tokens stored securely** - httpOnly cookies or secure storage

**2. PHI Protection:**

- ✅ **All PHI access logged** - HIPAA compliance
- ✅ **Query results cached securely** - no PHI in localStorage
- ✅ **Automatic cache expiration** - sensitive data not persisted
- ✅ **Role-based access enforced** - permission checks on all operations

### Compliance Requirements

**1. HIPAA Audit Logging:**

Every PHI access and medication administration MUST create an audit log:

```typescript
await auditApi.logPHIAccess({
  userId: currentUser.id,
  action: 'view_student_allergies',
  resourceType: 'allergy',
  resourceId: allergyId,
  studentId: studentId,
  timestamp: new Date().toISOString(),
  ipAddress: userIP,
});
```

**2. Medication Administration Audit:**

```typescript
await auditApi.logMedicationAdministration({
  userId: currentUser.id,
  studentId: studentId,
  medicationId: medicationId,
  dosage: dosageAdministered,
  route: route,
  timestamp: administrationTime,
  fiveRightsVerified: true,
  allergyCheckPassed: allergyCheckResult.hasConflict === false,
  interactionCheckPassed: interactionCheckResult.safe === true,
  witnessId: witnessId, // if controlled substance
});
```

---

## Implementation Timeline

### Week 1-2: CRITICAL (Patient Safety)

**Focus:** Allergy checking and medication administration workflow

- [ ] Create `allergyApi` service module
- [ ] Create `medicationAdministrationApi` service module
- [ ] Implement `useAllergyConflictCheck` hook
- [ ] Implement `useCriticalAllergies` hook
- [ ] Implement `useMedicationAdministrationWorkflow` hook
- [ ] Integrate allergy checking into medication workflow (BLOCKING)
- [ ] Update medication administration components
- [ ] **Test extensively** - patient safety critical
- [ ] Deploy to staging for QA testing

### Week 3-4: HIGH (Security & Scheduling)

**Focus:** OAuth/MFA and medication scheduling

- [ ] Create OAuth/MFA endpoints in `authApi`
- [ ] Implement `useOAuthLogin` hook
- [ ] Implement `useMfaSetup` hook
- [ ] Implement `useMfaVerification` hook
- [ ] Update AuthContext for OAuth/MFA
- [ ] Create OAuth login UI components
- [ ] Create MFA setup UI components
- [ ] Implement `useDueMedications` hook
- [ ] Implement `useOverdueMedications` hook
- [ ] Implement `useUpcomingMedications` hook
- [ ] Create medication scheduling dashboard components
- [ ] Test and deploy

### Week 5-6: MEDIUM (Compliance Features)

**Focus:** Screening and vaccination tracking

- [ ] Create `screeningApi` service module
- [ ] Create `vaccinationApi` service module
- [ ] Implement screening hooks
- [ ] Implement vaccination hooks
- [ ] Create screening compliance dashboard
- [ ] Create vaccination tracking UI
- [ ] Test and deploy

---

## Conclusion

This document provides comprehensive recommendations for integrating 30+ new backend endpoints into the frontend React application. The integration is prioritized by patient safety impact, with allergy checking and medication administration workflow as the highest priority.

### Key Takeaways

1. **Patient Safety First:** Allergy checking and Five Rights verification are CRITICAL and must be implemented immediately
2. **No Optimistic Updates:** Safety-critical operations must wait for server confirmation
3. **Comprehensive Error Handling:** Errors must be prominent, blocking, and audited
4. **Security by Design:** OAuth/MFA integration following best practices
5. **Query Key Consistency:** Structured, predictable query key architecture
6. **Testing is Critical:** Extensive testing required for patient safety operations

### Next Steps

1. **Review this document** with the development team
2. **Prioritize implementation** based on the timeline
3. **Set up testing environment** with backend integration
4. **Create Jira tickets** for each hook implementation
5. **Assign developers** to critical path items
6. **Schedule QA review** after each phase

---

**Document Status:** ✅ Complete
**Last Updated:** 2025-11-04
**Next Review:** After Phase 1 Implementation
**Questions:** Contact React Component Architect (Agent RC9H3K)
