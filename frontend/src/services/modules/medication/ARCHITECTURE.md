# Medication Management Frontend Architecture

## Overview
This document outlines the SOA-compliant, healthcare-focused frontend architecture for medication management in the White Cross platform. The design prioritizes patient safety, HIPAA compliance, and medication error prevention.

## Architecture Principles

### 1. Service-Oriented Architecture (SOA)
- **Domain Separation**: Each medication domain has its own API client
- **Single Responsibility**: Each service handles one business domain
- **Composability**: Services can be combined for complex workflows
- **Testability**: Each service can be tested independently

### 2. Healthcare Safety First
- **Five Rights Verification**: Enforced for every administration
- **No Optimistic Updates**: For medication administration (too risky)
- **Barcode Verification**: Mandatory for controlled substances
- **Allergy Checking**: Pre-administration safety validation
- **Offline Support**: Critical for remote nurse locations

### 3. HIPAA Compliance
- **PHI Protection**: Automatic cleanup on errors
- **Session Management**: 15-minute timeout with warnings
- **Audit Logging**: Every medication access logged
- **Screen Protection**: Auto-blur on inactivity

## Domain-Specific API Clients

### 1. MedicationFormularyApi
**Purpose**: Manage system medication formulary (drug database)

```typescript
class MedicationFormularyApi {
  // Formulary management
  searchFormulary(query: string, filters?: FormularyFilters): Promise<Medication[]>
  getMedicationByNDC(ndc: string): Promise<Medication>
  getMedicationByBarcode(barcode: string): Promise<Medication>
  checkDrugInteractions(medicationIds: string[]): Promise<Interaction[]>

  // Drug information
  getDrugMonograph(medicationId: string): Promise<DrugMonograph>
  getAlternativeMedications(medicationId: string): Promise<Medication[]>
}
```

**Caching Strategy**:
- Cache formulary aggressively (24 hours)
- Drug monographs: 1 week cache
- Only invalidate on admin updates

### 2. PrescriptionApi
**Purpose**: Student prescription management

```typescript
class PrescriptionApi {
  // Prescription CRUD
  createPrescription(data: CreatePrescriptionRequest): Promise<Prescription>
  updatePrescription(id: string, data: UpdatePrescriptionRequest): Promise<Prescription>
  discontinuePrescription(id: string, reason: string): Promise<void>

  // Prescription queries
  getStudentPrescriptions(studentId: string, options?: QueryOptions): Promise<Prescription[]>
  getActivePrescriptions(filters?: PrescriptionFilters): Promise<Prescription[]>
  getPrescriptionHistory(prescriptionId: string): Promise<PrescriptionHistory[]>

  // Verification
  verifyPrescription(prescriptionId: string, studentId: string): Promise<VerificationResult>
  checkPrescriptionAllergies(prescriptionId: string): Promise<AllergyWarning[]>
}
```

**Caching Strategy**:
- Active prescriptions: 5-minute cache
- Invalidate on prescription changes
- Student-specific cache with fine-grained invalidation

### 3. AdministrationApi
**Purpose**: Medication administration and logging

```typescript
class AdministrationApi {
  // Administration workflow
  initiateAdministration(prescriptionId: string): Promise<AdministrationSession>
  verifyFiveRights(session: AdministrationSession, data: FiveRightsData): Promise<VerificationResult>
  recordAdministration(data: AdministrationRecord): Promise<AdministrationLog>
  recordRefusal(prescriptionId: string, reason: string): Promise<void>
  recordMissedDose(prescriptionId: string, reason: string): Promise<void>

  // Administration history
  getAdministrationHistory(studentId: string, filters?: HistoryFilters): Promise<AdministrationLog[]>
  getTodayAdministrations(nurseId?: string): Promise<AdministrationLog[]>

  // Witness requirements
  requestWitnessSignature(administrationId: string, witnessId: string): Promise<WitnessSignature>
}
```

**Safety Constraints**:
- NO caching for administration records (always fresh)
- NO optimistic updates
- Requires online connection (queue if offline)
- Mandatory verification before submission

### 4. InventoryApi
**Purpose**: Medication inventory and stock management

```typescript
class InventoryApi {
  // Inventory queries
  getInventoryByMedication(medicationId: string): Promise<InventoryItem[]>
  getLowStockAlerts(): Promise<StockAlert[]>
  getExpirationAlerts(withinDays?: number): Promise<ExpirationAlert[]>

  // Inventory management
  updateStock(itemId: string, quantity: number, reason: string): Promise<InventoryItem>
  recordWastage(itemId: string, quantity: number, reason: string, witnessId?: string): Promise<WastageRecord>
  transferStock(fromId: string, toId: string, quantity: number): Promise<Transfer>

  // Controlled substance tracking
  recordControlledSubstanceUse(data: ControlledSubstanceLog): Promise<void>
  getControlledSubstanceLog(dateRange?: DateRange): Promise<ControlledSubstanceLog[]>
}
```

**Caching Strategy**:
- Low stock alerts: 15-minute cache
- Expiration alerts: 1-hour cache
- Allow optimistic updates for non-controlled substances
- Real-time updates for controlled substances

### 5. AdverseReactionApi
**Purpose**: Adverse drug reaction reporting

```typescript
class AdverseReactionApi {
  // Reporting
  reportAdverseReaction(data: AdverseReactionReport): Promise<AdverseReaction>
  updateReaction(id: string, data: UpdateReactionRequest): Promise<AdverseReaction>
  escalateReaction(id: string, escalationData: EscalationData): Promise<void>

  // Queries
  getStudentReactions(studentId: string): Promise<AdverseReaction[]>
  getMedicationReactions(medicationId: string): Promise<AdverseReaction[]>
  getCriticalReactions(timeframe?: number): Promise<AdverseReaction[]>

  // Safety alerts
  checkReactionHistory(studentId: string, medicationId: string): Promise<ReactionWarning[]>
}
```

**Safety Features**:
- Immediate cache invalidation on new reaction
- Real-time alerts to all connected nurses
- Automatic allergy list updates
- FDA MedWatch integration hook

## Custom React Query Hooks

### 1. useMedicationFormulary
```typescript
function useMedicationFormulary(options?: FormularyOptions) {
  const searchFormulary = useQuery({
    queryKey: ['formulary', 'search', searchTerm],
    queryFn: () => formularyApi.searchFormulary(searchTerm),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const getMedicationByBarcode = useMutation({
    mutationFn: (barcode: string) => formularyApi.getMedicationByBarcode(barcode),
    // No cache - always verify current data
  });

  return { searchFormulary, getMedicationByBarcode, ... };
}
```

### 2. usePrescriptions
```typescript
function usePrescriptions(studentId?: string) {
  const queryClient = useQueryClient();

  const activePrescriptions = useQuery({
    queryKey: ['prescriptions', 'active', studentId],
    queryFn: () => prescriptionApi.getActivePrescriptions({ studentId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Always fresh on focus
  });

  const createPrescription = useMutation({
    mutationFn: prescriptionApi.createPrescription,
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries(['prescriptions', 'active']);
      queryClient.invalidateQueries(['students', data.studentId, 'prescriptions']);
      // Log audit trail
      auditLog.logPrescriptionCreated(data);
    },
  });

  return { activePrescriptions, createPrescription, ... };
}
```

### 3. useMedicationAdministration (SAFETY-CRITICAL)
```typescript
function useMedicationAdministration() {
  const queryClient = useQueryClient();
  const [sessionData, setSessionData] = useState<AdministrationSession | null>(null);

  // Initialize administration session
  const initSession = useMutation({
    mutationFn: (prescriptionId: string) => administrationApi.initiateAdministration(prescriptionId),
    onSuccess: (session) => {
      setSessionData(session);
      // Pre-fetch verification data
      queryClient.prefetchQuery(['allergies', session.studentId]);
      queryClient.prefetchQuery(['interactions', session.medicationId]);
    },
  });

  // Verify Five Rights (client-side validation)
  const verifyFiveRights = (data: FiveRightsData): VerificationResult => {
    if (!sessionData) throw new Error('No active session');

    const errors: string[] = [];

    // Right Patient
    if (data.studentBarcode !== sessionData.studentBarcode) {
      errors.push('Patient verification failed - barcode mismatch');
    }

    // Right Medication
    if (data.medicationNDC !== sessionData.prescriptionNDC) {
      errors.push('Medication verification failed - NDC mismatch');
    }

    // Right Dose
    if (!isValidDose(data.scannedDose, sessionData.prescribedDose)) {
      errors.push('Dose verification failed - does not match prescription');
    }

    // Right Route
    if (data.route !== sessionData.prescribedRoute) {
      errors.push('Route verification failed - does not match prescription');
    }

    // Right Time
    if (!isWithinAdministrationWindow(data.time, sessionData.scheduledTime)) {
      errors.push('Time verification failed - outside administration window');
    }

    return { valid: errors.length === 0, errors };
  };

  // Record administration (NO OPTIMISTIC UPDATE)
  const recordAdministration = useMutation({
    mutationFn: async (data: AdministrationRecord) => {
      // Final server-side verification
      const verification = await administrationApi.verifyFiveRights(sessionData!, data.fiveRightsData);
      if (!verification.valid) {
        throw new MedicationSafetyError('Five Rights verification failed', verification.errors);
      }

      // Check allergies one more time
      const allergies = await administrationApi.checkAllergies(data.studentId, data.medicationId);
      if (allergies.length > 0 && !data.allergyAcknowledged) {
        throw new AllergyWarningError('Allergy warning not acknowledged', allergies);
      }

      // Record administration
      return administrationApi.recordAdministration(data);
    },
    onSuccess: (result) => {
      // Clear session
      setSessionData(null);

      // Invalidate queries (NO optimistic update)
      queryClient.invalidateQueries(['administration', 'today']);
      queryClient.invalidateQueries(['prescriptions', result.studentId]);
      queryClient.invalidateQueries(['inventory']);

      // Log audit trail
      auditLog.logMedicationAdministered(result);

      // Queue for offline sync if needed
      offlineQueue.markSynced(result.id);
    },
    onError: (error) => {
      // Log safety error
      safetyLog.logAdministrationError(error, sessionData);

      // Queue for offline if network error
      if (error instanceof NetworkError) {
        offlineQueue.add(sessionData!);
      }
    },
    // CRITICAL: No retry for administration
    retry: false,
  });

  return { initSession, verifyFiveRights, recordAdministration, sessionData };
}
```

### 4. useMedicationReminders
```typescript
function useMedicationReminders() {
  const reminders = useQuery({
    queryKey: ['medication-reminders', 'today'],
    queryFn: () => administrationApi.getTodayAdministrations(),
    refetchInterval: 60 * 1000, // Refresh every minute
    refetchOnWindowFocus: true,
  });

  const upcomingReminders = useQuery({
    queryKey: ['medication-reminders', 'upcoming'],
    queryFn: () => administrationApi.getUpcomingReminders(),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });

  return { reminders, upcomingReminders };
}
```

### 5. useMedicationInventory
```typescript
function useMedicationInventory() {
  const queryClient = useQueryClient();

  const lowStockAlerts = useQuery({
    queryKey: ['inventory', 'alerts', 'low-stock'],
    queryFn: () => inventoryApi.getLowStockAlerts(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  const expirationAlerts = useQuery({
    queryKey: ['inventory', 'alerts', 'expiration'],
    queryFn: () => inventoryApi.getExpirationAlerts(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  const updateStock = useMutation({
    mutationFn: inventoryApi.updateStock,
    onMutate: async (variables) => {
      // Optimistic update for non-controlled substances
      if (!variables.isControlled) {
        await queryClient.cancelQueries(['inventory', variables.itemId]);
        const previous = queryClient.getQueryData(['inventory', variables.itemId]);

        queryClient.setQueryData(['inventory', variables.itemId], (old: any) => ({
          ...old,
          quantity: old.quantity + variables.quantity,
        }));

        return { previous };
      }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(['inventory', variables.itemId], context.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory', 'alerts']);
    },
  });

  return { lowStockAlerts, expirationAlerts, updateStock };
}
```

### 6. useAdverseReactions
```typescript
function useAdverseReactions(studentId?: string) {
  const queryClient = useQueryClient();

  const reactions = useQuery({
    queryKey: ['adverse-reactions', studentId],
    queryFn: () => adverseReactionApi.getStudentReactions(studentId!),
    enabled: !!studentId,
    staleTime: 0, // Always fresh - safety critical
  });

  const reportReaction = useMutation({
    mutationFn: adverseReactionApi.reportAdverseReaction,
    onSuccess: (data) => {
      // Immediate invalidation
      queryClient.invalidateQueries(['adverse-reactions']);
      queryClient.invalidateQueries(['allergies', data.studentId]);

      // Real-time alert to all nurses
      websocket.broadcast('adverse-reaction', data);

      // Log critical event
      safetyLog.logAdverseReaction(data);

      // Show persistent warning
      showCriticalAlert(`ADVERSE REACTION REPORTED: ${data.medicationName}`, {
        persistent: true,
        severity: 'critical',
      });
    },
  });

  return { reactions, reportReaction };
}
```

## Five Rights Verification Component

```typescript
interface FiveRightsVerificationProps {
  session: AdministrationSession;
  onVerified: (data: FiveRightsData) => void;
  onCancel: () => void;
}

function FiveRightsVerification({ session, onVerified, onCancel }: FiveRightsVerificationProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [verificationData, setVerificationData] = useState<Partial<FiveRightsData>>({});
  const [barcodeScanner, setBarcodeScanner] = useState<BarcodeScanner | null>(null);

  // Step 1: Right Patient
  const verifyPatient = async (barcode: string) => {
    if (barcode !== session.studentBarcode) {
      showError('Patient verification failed. Barcode does not match.');
      return;
    }

    // Show patient photo for visual confirmation
    const confirmed = await showConfirmationDialog({
      title: 'Confirm Patient Identity',
      content: <PatientPhotoConfirmation student={session.student} />,
      confirmText: 'This is the correct patient',
      cancelText: 'Cancel administration',
    });

    if (confirmed) {
      setVerificationData({ ...verificationData, studentBarcode: barcode, patientConfirmed: true });
      setStep(2);
    }
  };

  // Step 2: Right Medication
  const verifyMedication = async (barcode: string) => {
    const ndc = parseNDCFromBarcode(barcode);

    if (ndc !== session.prescriptionNDC) {
      showError('Medication verification failed. NDC does not match prescription.');
      return;
    }

    // Check for look-alike/sound-alike medications
    const lasa = await checkLASAWarnings(ndc);
    if (lasa.length > 0) {
      await showWarningDialog({
        title: 'Look-Alike/Sound-Alike Warning',
        warnings: lasa,
      });
    }

    setVerificationData({ ...verificationData, medicationNDC: ndc, medicationConfirmed: true });
    setStep(3);
  };

  // Step 3: Right Dose
  const verifyDose = (scannedDose: string) => {
    const calculatedDose = calculateDose(session.prescription, session.student);

    if (!isDoseEquivalent(scannedDose, calculatedDose)) {
      showDoseCalculator({
        prescribed: session.prescription.dosage,
        calculated: calculatedDose,
        studentWeight: session.student.weight,
        onConfirm: (dose) => {
          setVerificationData({ ...verificationData, scannedDose: dose, doseConfirmed: true });
          setStep(4);
        },
      });
    } else {
      setVerificationData({ ...verificationData, scannedDose, doseConfirmed: true });
      setStep(4);
    }
  };

  // Step 4: Right Route
  const verifyRoute = (route: AdministrationRoute) => {
    if (route !== session.prescription.route) {
      showError('Route verification failed. Does not match prescription.');
      return;
    }

    setVerificationData({ ...verificationData, route, routeConfirmed: true });
    setStep(5);
  };

  // Step 5: Right Time
  const verifyTime = () => {
    const now = new Date();
    const scheduledTime = new Date(session.scheduledTime);
    const windowStart = new Date(scheduledTime.getTime() - 30 * 60000); // 30 min before
    const windowEnd = new Date(scheduledTime.getTime() + 30 * 60000); // 30 min after

    if (now < windowStart || now > windowEnd) {
      showWarningDialog({
        title: 'Administration Time Warning',
        message: `Scheduled time: ${formatTime(scheduledTime)}. Current time: ${formatTime(now)}. Administering outside recommended window.`,
        onConfirm: () => {
          setVerificationData({ ...verificationData, time: now, timeConfirmed: true, timeOverride: true });
          proceedToAllergy Check();
        },
      });
    } else {
      setVerificationData({ ...verificationData, time: now, timeConfirmed: true });
      proceedToAllergyCheck();
    }
  };

  // Allergy/Contraindication Check
  const proceedToAllergyCheck = async () => {
    const allergies = await checkAllergies(session.studentId, session.medicationId);

    if (allergies.length > 0) {
      const acknowledged = await showAllergyWarning({
        allergies,
        medication: session.medication,
        onAcknowledge: () => true,
      });

      if (!acknowledged) {
        onCancel();
        return;
      }

      setVerificationData({ ...verificationData, allergyAcknowledged: true });
    }

    // Check for witness requirement
    if (session.prescription.requiresWitness || session.medication.isControlled) {
      await requestWitnessSignature();
    }

    // All verifications complete
    onVerified(verificationData as FiveRightsData);
  };

  return (
    <div className="five-rights-verification">
      <ProgressIndicator currentStep={step} totalSteps={5} />

      {step === 1 && (
        <RightPatientStep
          student={session.student}
          onScan={verifyPatient}
          barcodeScanner={barcodeScanner}
        />
      )}

      {step === 2 && (
        <RightMedicationStep
          medication={session.medication}
          prescription={session.prescription}
          onScan={verifyMedication}
          barcodeScanner={barcodeScanner}
        />
      )}

      {step === 3 && (
        <RightDoseStep
          prescription={session.prescription}
          student={session.student}
          onVerify={verifyDose}
        />
      )}

      {step === 4 && (
        <RightRouteStep
          prescribedRoute={session.prescription.route}
          availableRoutes={getAvailableRoutes(session.medication)}
          onSelect={verifyRoute}
        />
      )}

      {step === 5 && (
        <RightTimeStep
          scheduledTime={session.scheduledTime}
          onVerify={verifyTime}
        />
      )}

      <div className="verification-actions">
        <button onClick={onCancel} className="btn-cancel">Cancel Administration</button>
      </div>
    </div>
  );
}
```

## Barcode Scanning Integration

```typescript
// Barcode Scanner Hook
function useBarcodeScanner(onScan: (barcode: string) => void) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState<BarcodeScanner | null>(null);

  useEffect(() => {
    const barcodeScanner = new BarcodeScanner({
      onDetected: (barcode) => {
        onScan(barcode);
        playSuccessSound();
        hapticFeedback();
      },
      onError: (error) => {
        showError(`Barcode scan failed: ${error.message}`);
        playErrorSound();
      },
    });

    setScanner(barcodeScanner);

    return () => {
      barcodeScanner.stop();
    };
  }, [onScan]);

  const startScanning = () => {
    scanner?.start();
    setIsScanning(true);
  };

  const stopScanning = () => {
    scanner?.stop();
    setIsScanning(false);
  };

  return { isScanning, startScanning, stopScanning, scanner };
}

// Barcode Scanner Component
function BarcodeScannerComponent({ onScan, expectedFormat }: BarcodeScannerProps) {
  const { isScanning, startScanning, stopScanning } = useBarcodeScanner(onScan);
  const [manualEntry, setManualEntry] = useState(false);

  return (
    <div className="barcode-scanner">
      {isScanning ? (
        <>
          <video id="barcode-video" className="scanner-video" />
          <div className="scanner-overlay">
            <div className="scan-area" />
            <p>Position barcode within the frame</p>
          </div>
          <button onClick={stopScanning}>Stop Scanning</button>
        </>
      ) : (
        <div className="scanner-controls">
          <button onClick={startScanning} className="btn-primary">
            Start Barcode Scan
          </button>
          <button onClick={() => setManualEntry(true)} className="btn-secondary">
            Manual Entry
          </button>
        </div>
      )}

      {manualEntry && (
        <ManualBarcodeEntry
          expectedFormat={expectedFormat}
          onSubmit={(barcode) => {
            onScan(barcode);
            setManualEntry(false);
          }}
          onCancel={() => setManualEntry(false)}
        />
      )}
    </div>
  );
}
```

## Offline Queue Implementation

```typescript
// IndexedDB Offline Queue
class OfflineQueue {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'medication-offline-queue';
  private readonly STORE_NAME = 'administration-queue';

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id', autoIncrement: true });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('synced', 'synced');
        }
      };
    });
  }

  async add(record: AdministrationRecord): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
    const store = transaction.objectStore(this.STORE_NAME);

    await store.add({
      ...record,
      timestamp: new Date().toISOString(),
      synced: false,
    });

    // Visual indicator
    showOfflineIndicator('Administration queued for sync');
  }

  async getPending(): Promise<QueuedAdministration[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('synced');
      const request = index.getAll(false);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async markSynced(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
    const store = transaction.objectStore(this.STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      const record = request.result;
      if (record) {
        record.synced = true;
        store.put(record);
      }
    };
  }

  async syncAll(): Promise<void> {
    const pending = await this.getPending();

    for (const record of pending) {
      try {
        await administrationApi.recordAdministration(record);
        await this.markSynced(record.id);
        showSuccess(`Synced: ${record.medicationName} for ${record.studentName}`);
      } catch (error) {
        showError(`Sync failed: ${record.medicationName}`);
        // Keep in queue for retry
      }
    }
  }
}

// Offline Queue Hook
function useOfflineQueue() {
  const [queue] = useState(() => new OfflineQueue());
  const [pending, setPending] = useState<QueuedAdministration[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    queue.init();

    const handleOnline = async () => {
      setIsOnline(true);
      showInfo('Connection restored. Syncing queued administrations...');
      await queue.syncAll();
    };

    const handleOffline = () => {
      setIsOnline(false);
      showWarning('You are offline. Administrations will be queued for sync.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queue]);

  useEffect(() => {
    const loadPending = async () => {
      const items = await queue.getPending();
      setPending(items);
    };

    loadPending();
    const interval = setInterval(loadPending, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [queue]);

  return { queue, pending, isOnline };
}
```

## Error Boundary with PHI Cleanup

```typescript
interface MedicationErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class MedicationErrorBoundary extends React.Component<
  { children: React.ReactNode },
  MedicationErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): MedicationErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service (without PHI)
    const sanitizedError = this.sanitizeError(error);
    errorMonitoring.logError(sanitizedError, {
      component: 'MedicationManagement',
      errorInfo: this.sanitizeErrorInfo(errorInfo),
    });

    // Clear any PHI from memory
    this.cleanupPHI();

    // Log security event
    securityLog.logErrorBoundaryTriggered({
      component: 'Medication',
      errorType: error.name,
      timestamp: new Date().toISOString(),
    });
  }

  sanitizeError(error: Error): Error {
    // Remove any PHI from error messages
    const sanitized = new Error(error.message.replace(/\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g, '[REDACTED]'));
    sanitized.name = error.name;
    sanitized.stack = error.stack?.replace(/\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g, '[REDACTED]');
    return sanitized;
  }

  sanitizeErrorInfo(errorInfo: React.ErrorInfo): any {
    return {
      componentStack: errorInfo.componentStack?.replace(/\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g, '[REDACTED]'),
    };
  }

  cleanupPHI() {
    // Clear session storage
    sessionStorage.removeItem('current-administration-session');
    sessionStorage.removeItem('medication-verification-data');

    // Clear React Query cache for sensitive data
    queryClient.removeQueries({ queryKey: ['administration'] });
    queryClient.removeQueries({ queryKey: ['prescriptions'] });

    // Clear component state
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-fallback">
          <div className="error-icon">⚠️</div>
          <h2>Medication Module Error</h2>
          <p>An error occurred in the medication management system.</p>
          <p className="error-security-notice">
            For security, all session data has been cleared.
          </p>
          <button
            onClick={() => {
              this.cleanupPHI();
              window.location.href = '/medications';
            }}
            className="btn-primary"
          >
            Return to Medications
          </button>
          <button
            onClick={() => {
              this.cleanupPHI();
              window.location.href = '/';
            }}
            className="btn-secondary"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Session Monitoring with Medication Timeout

```typescript
function useMedicationSessionMonitor() {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes

  const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  const WARNING_DURATION = 2 * 60 * 1000; // 2 minutes before timeout

  useEffect(() => {
    const activities = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    const resetTimer = () => {
      setLastActivity(Date.now());
      setShowWarning(false);
    };

    activities.forEach(activity => {
      document.addEventListener(activity, resetTimer);
    });

    return () => {
      activities.forEach(activity => {
        document.removeEventListener(activity, resetTimer);
      });
    };
  }, []);

  useEffect(() => {
    const checkTimeout = setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      const remaining = TIMEOUT_DURATION - elapsed;

      setTimeRemaining(Math.floor(remaining / 1000));

      if (remaining <= 0) {
        // Timeout - lock screen and clear sensitive data
        handleTimeout();
      } else if (remaining <= WARNING_DURATION && !showWarning) {
        // Show warning
        setShowWarning(true);
      }
    }, 1000);

    return () => clearInterval(checkTimeout);
  }, [lastActivity, showWarning]);

  const handleTimeout = () => {
    // Blur medication screen
    document.body.classList.add('medication-locked');

    // Clear sensitive data
    sessionStorage.removeItem('current-administration-session');
    queryClient.removeQueries({ queryKey: ['administration'] });

    // Show re-authentication modal
    showReauthenticationModal({
      reason: 'Session timeout',
      onSuccess: () => {
        document.body.classList.remove('medication-locked');
        setLastActivity(Date.now());
        setShowWarning(false);
      },
    });

    // Log security event
    securityLog.logSessionTimeout({
      module: 'Medication',
      timestamp: new Date().toISOString(),
    });
  };

  const extendSession = () => {
    setLastActivity(Date.now());
    setShowWarning(false);
  };

  return { showWarning, timeRemaining, extendSession };
}

// Session Warning Modal
function SessionWarningModal({ timeRemaining, onExtend }: SessionWarningProps) {
  return (
    <Modal isOpen={true} className="session-warning-modal">
      <div className="warning-icon">⏰</div>
      <h3>Session Timeout Warning</h3>
      <p>
        Your medication session will expire in <strong>{timeRemaining} seconds</strong> due to inactivity.
      </p>
      <p className="security-notice">
        For patient safety, sensitive medication data will be cleared.
      </p>
      <button onClick={onExtend} className="btn-primary">
        Continue Working
      </button>
    </Modal>
  );
}
```

## Caching Strategy Summary

| Domain | Cache Duration | Invalidation Strategy | Optimistic Updates |
|--------|---------------|----------------------|-------------------|
| Formulary | 24 hours | Admin updates only | No |
| Prescriptions | 5 minutes | On CRUD operations | No |
| Administration | No cache | Always fresh | NEVER |
| Inventory | 15 minutes | On stock changes | Yes (non-controlled) |
| Adverse Reactions | No cache | Always fresh | No |
| Reminders | 1 minute | Every minute | No |
| Allergies | Session | On new reactions | No |

## Migration Plan

### Phase 1: API Client Separation (Week 1)
1. Create new domain-specific API clients
2. Implement without breaking existing code
3. Add comprehensive tests
4. Deploy to staging

### Phase 2: Hook Migration (Week 2)
5. Create new React Query hooks
6. Migrate one domain at a time
7. Run parallel with old implementation
8. A/B test for safety

### Phase 3: Component Updates (Week 3)
9. Update components to use new hooks
10. Implement Five Rights component
11. Add barcode scanning
12. Deploy with feature flags

### Phase 4: Safety Features (Week 4)
13. Implement offline queue
14. Add error boundary
15. Implement session monitoring
16. Full E2E testing

### Phase 5: Cleanup (Week 5)
17. Remove old API client
18. Remove old hooks
19. Update documentation
20. Train staff on new features

## Testing Strategy

### Unit Tests
- Each API client method
- All custom hooks
- Validation logic
- Barcode parsing
- Dose calculations

### Integration Tests
- Five Rights verification flow
- Offline queue sync
- Error boundary cleanup
- Session timeout

### E2E Tests (Cypress)
```typescript
describe('Medication Administration - Five Rights', () => {
  it('enforces all five rights before administration', () => {
    // Login as nurse
    cy.login('nurse@school.edu');

    // Navigate to administration
    cy.visit('/medications/administer');

    // Select prescription
    cy.selectPrescription('John Doe - Amoxicillin');

    // Verify patient (barcode)
    cy.scanBarcode('student-123456');
    cy.get('[data-testid="patient-photo"]').should('be.visible');
    cy.confirmPatientIdentity();

    // Verify medication (barcode)
    cy.scanBarcode('ndc-00002-0064-61');
    cy.get('[data-testid="medication-name"]').should('contain', 'Amoxicillin');

    // Verify dose
    cy.get('[data-testid="dose-input"]').type('250mg');
    cy.verifyDoseCalculation();

    // Verify route
    cy.selectRoute('Oral');

    // Verify time
    cy.verifyAdministrationTime();

    // Check allergies
    cy.get('[data-testid="allergy-check"]').should('contain', 'No known allergies');

    // Complete administration
    cy.get('[data-testid="complete-administration"]').click();

    // Verify success
    cy.get('[data-testid="success-message"]').should('be.visible');
    cy.get('[data-testid="administration-log"]').should('contain', 'Amoxicillin');
  });

  it('prevents administration with incorrect patient barcode', () => {
    cy.login('nurse@school.edu');
    cy.visit('/medications/administer');
    cy.selectPrescription('John Doe - Amoxicillin');

    // Wrong barcode
    cy.scanBarcode('student-wrong');

    // Should show error
    cy.get('[data-testid="verification-error"]').should('contain', 'Patient verification failed');
    cy.get('[data-testid="complete-administration"]').should('be.disabled');
  });
});
```

### Safety Testing
- Allergy warning display
- Controlled substance logging
- Offline queue persistence
- Session timeout enforcement
- PHI cleanup verification

## Performance Monitoring

### Key Metrics
- Time to verify Five Rights: < 60 seconds
- Barcode scan success rate: > 95%
- Offline queue sync success: > 99%
- Cache hit rate: > 80%
- Administration recording time: < 2 seconds

### Alerts
- Failed Five Rights verification
- Repeated barcode scan failures
- Offline queue > 10 items
- Cache miss rate > 30%
- Session timeout rate > 5%

## Security Considerations

### PHI Protection
- All PHI encrypted at rest
- PHI removed from error logs
- PHI cleared on timeout
- PHI not cached in browser

### Audit Logging
- Every medication access
- All administration attempts
- Failed verifications
- Controlled substance access
- Witness signatures

### Access Control
- Role-based permissions
- Multi-factor for controlled substances
- Witness requirements
- Admin override logging

## Accessibility

### WCAG 2.1 AA Compliance
- Keyboard navigation for all workflows
- Screen reader support
- High contrast mode
- Focus indicators
- ARIA labels

### Critical Accessibility
- Barcode scanner alternatives
- Voice commands for hands-free
- Large touch targets
- Error messages screen-reader friendly
