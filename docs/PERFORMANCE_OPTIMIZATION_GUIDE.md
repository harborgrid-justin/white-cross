# White Cross Performance Optimization Guide
## 15 Critical Features Performance Strategy

**Document Version:** 1.0
**Created:** October 26, 2025
**Author:** Frontend Performance Architect
**Target Platform:** White Cross Healthcare Platform

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Global Performance Architecture](#global-performance-architecture)
3. [Feature-Specific Optimizations](#feature-specific-optimizations)
4. [Performance Budgets](#performance-budgets)
5. [Core Web Vitals Targets](#core-web-vitals-targets)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Monitoring & Measurement](#monitoring--measurement)

---

## Executive Summary

### Overall Performance Goals

- **Initial Bundle Size:** < 200KB (gzipped)
- **Time to Interactive (TTI):** < 3.5s on 3G
- **Largest Contentful Paint (LCP):** < 2.5s
- **First Input Delay (FID):** < 100ms
- **Cumulative Layout Shift (CLS):** < 0.1
- **Lighthouse Score:** 90+ (Performance)

### Critical Performance Considerations

1. **Drug Interaction Checker**: Sub-100ms response time (instant feedback)
2. **Real-Time Alerts**: Non-blocking UI updates via Web Workers
3. **Immunization Lists**: Virtual scrolling for 1000+ records
4. **PDF Generation**: Web Worker-based, non-blocking
5. **Dashboard**: Progressive loading with skeleton screens

---

## Global Performance Architecture

### 1. Enhanced Vite Configuration

Update `/frontend/vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // React Fast Refresh optimizations
          ['babel-plugin-react-compiler', {}]
        ]
      }
    }),
    // Gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240 // 10KB
    }),
    // Brotli compression
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240
    }),
    // Bundle analysis
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    // Performance optimizations
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      }
    },

    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'query-vendor': ['@tanstack/react-query'],
          'chart-vendor': ['recharts'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],

          // Feature chunks (lazy loaded)
          'health-features': [
            './src/pages/health',
            './src/services/modules/healthRecordsApi.ts',
            './src/services/modules/healthAssessmentsApi.ts'
          ],
          'medication-features': [
            './src/pages/medications',
            './src/services/modules/medicationsApi.ts'
          ],
          'compliance-features': [
            './src/pages/compliance',
            './src/services/modules/complianceApi.ts',
            './src/services/modules/auditApi.ts'
          ],
          'integration-features': [
            './src/pages/integration',
            './src/services/modules/integrationApi.ts'
          ]
        },

        // Optimized chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 500, // 500KB warning

    // Sourcemap for production debugging
    sourcemap: 'hidden'
  },

  server: {
    port: 5173,
    host: true
  },

  // Performance hints
  performance: {
    maxEntrypointSize: 250000, // 250KB
    maxAssetSize: 250000
  }
});
```

### 2. Global Code Splitting Strategy

**Route-Based Splitting** (`/frontend/src/App.tsx`):

```typescript
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Critical routes (preloaded)
import Dashboard from '@/pages/dashboard/Dashboard';
import Login from '@/pages/auth/Login';

// Lazy loaded routes
const Students = lazy(() => import(
  /* webpackChunkName: "students" */
  /* webpackPrefetch: true */
  '@/pages/students/Students'
));

const Medications = lazy(() => import(
  /* webpackChunkName: "medications" */
  '@/pages/medications/Medications'
));

const HealthRecords = lazy(() => import(
  /* webpackChunkName: "health-records" */
  '@/pages/health/HealthRecords'
));

const Compliance = lazy(() => import(
  /* webpackChunkName: "compliance" */
  '@/pages/compliance/ComplianceDashboard'
));

const Integration = lazy(() => import(
  /* webpackChunkName: "integration" */
  '@/pages/integration/IntegrationHub'
));

const Reports = lazy(() => import(
  /* webpackChunkName: "reports" */
  '@/pages/reports/ReportsPage'
));

const Incidents = lazy(() => import(
  /* webpackChunkName: "incidents" */
  '@/pages/incidents/IncidentReports'
));

// Prefetch critical routes on idle
const prefetchRoutes = () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      import('@/pages/students/Students');
      import('@/pages/medications/Medications');
    });
  }
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/students/*" element={<Students />} />
            <Route path="/medications/*" element={<Medications />} />
            <Route path="/health/*" element={<HealthRecords />} />
            <Route path="/compliance/*" element={<Compliance />} />
            <Route path="/integration/*" element={<Integration />} />
            <Route path="/reports/*" element={<Reports />} />
            <Route path="/incidents/*" element={<Incidents />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
```

### 3. Global Performance Utilities

**Create `/frontend/src/utils/performance.ts`:**

```typescript
import { useEffect, useRef, useCallback } from 'react';

/**
 * Debounce hook for search inputs
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook for scroll/resize events
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 200
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

/**
 * Web Worker hook for heavy computation
 */
export function useWebWorker<T, R>(
  workerFn: (data: T) => R
): [(data: T) => Promise<R>, boolean] {
  const [loading, setLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create worker from function
    const blob = new Blob([`(${workerFn.toString()})()`], {
      type: 'application/javascript'
    });
    workerRef.current = new Worker(URL.createObjectURL(blob));

    return () => {
      workerRef.current?.terminate();
    };
  }, [workerFn]);

  const execute = useCallback((data: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'));
        return;
      }

      setLoading(true);

      workerRef.current.onmessage = (e: MessageEvent<R>) => {
        setLoading(false);
        resolve(e.data);
      };

      workerRef.current.onerror = (error) => {
        setLoading(false);
        reject(error);
      };

      workerRef.current.postMessage(data);
    });
  }, []);

  return [execute, loading];
}

/**
 * Performance mark for measuring
 */
export function performanceMark(name: string) {
  if (typeof performance !== 'undefined') {
    performance.mark(name);
  }
}

/**
 * Performance measure between two marks
 */
export function performanceMeasure(
  name: string,
  startMark: string,
  endMark: string
): number | null {
  if (typeof performance === 'undefined') return null;

  try {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name, 'measure')[0];
    return measure?.duration || null;
  } catch (error) {
    console.warn('Performance measurement failed:', error);
    return null;
  }
}
```

---

## Feature-Specific Optimizations

### Feature 1: PHI Disclosure Tracking

**Performance Profile:**
- Expected Data Volume: 100-1000 disclosure records
- Update Frequency: Low (10-20 per day)
- Critical Metric: Fast search and filter

#### 1.1 Code Splitting

```typescript
// /frontend/src/pages/compliance/PHIDisclosureTracking.tsx
import { lazy } from 'react';

const PHIDisclosureList = lazy(() => import('./components/PHIDisclosureList'));
const DisclosureDetailsModal = lazy(() => import('./components/DisclosureDetailsModal'));
const DisclosureAuditLog = lazy(() => import('./components/DisclosureAuditLog'));
```

#### 1.2 TanStack Query Caching

```typescript
// /frontend/src/services/modules/complianceApi.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const DISCLOSURE_CACHE_TIME = 10 * 60 * 1000; // 10 minutes
const DISCLOSURE_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function usePHIDisclosures(filters?: DisclosureFilters) {
  return useQuery({
    queryKey: ['phi-disclosures', filters],
    queryFn: () => fetchPHIDisclosures(filters),
    staleTime: DISCLOSURE_STALE_TIME,
    gcTime: DISCLOSURE_CACHE_TIME,
    // Prefetch next page
    placeholderData: (previousData) => previousData,
    retry: 2
  });
}

export function useCreatePHIDisclosure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPHIDisclosure,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['phi-disclosures'] });
    },
    // Optimistic update
    onMutate: async (newDisclosure) => {
      await queryClient.cancelQueries({ queryKey: ['phi-disclosures'] });

      const previousDisclosures = queryClient.getQueryData(['phi-disclosures']);

      queryClient.setQueryData(['phi-disclosures'], (old: any) => ({
        ...old,
        items: [newDisclosure, ...(old?.items || [])]
      }));

      return { previousDisclosures };
    },
    onError: (err, newDisclosure, context) => {
      // Rollback on error
      queryClient.setQueryData(['phi-disclosures'], context?.previousDisclosures);
    }
  });
}
```

#### 1.3 Memoization

```typescript
// /frontend/src/pages/compliance/components/PHIDisclosureList.tsx
import { memo, useMemo, useCallback } from 'react';

interface PHIDisclosureListProps {
  filters: DisclosureFilters;
  onDisclosureClick: (id: string) => void;
}

export const PHIDisclosureList = memo(({ filters, onDisclosureClick }: PHIDisclosureListProps) => {
  const { data, isLoading } = usePHIDisclosures(filters);

  // Memoize filtered data
  const filteredDisclosures = useMemo(() => {
    if (!data?.items) return [];

    return data.items.filter(disclosure => {
      if (filters.dateRange) {
        return isWithinInterval(new Date(disclosure.disclosureDate), {
          start: filters.dateRange.start,
          end: filters.dateRange.end
        });
      }
      return true;
    });
  }, [data?.items, filters]);

  // Memoize click handler
  const handleClick = useCallback((id: string) => {
    performanceMark('disclosure-click-start');
    onDisclosureClick(id);
    performanceMark('disclosure-click-end');
  }, [onDisclosureClick]);

  // Virtual scrolling for large lists
  return (
    <VirtualList
      items={filteredDisclosures}
      itemHeight={72}
      renderItem={(disclosure) => (
        <DisclosureRow
          key={disclosure.id}
          disclosure={disclosure}
          onClick={handleClick}
        />
      )}
    />
  );
});

PHIDisclosureList.displayName = 'PHIDisclosureList';
```

#### 1.4 Debounced Search

```typescript
// /frontend/src/pages/compliance/components/DisclosureSearchBar.tsx
import { useDebounce } from '@/utils/performance';

export function DisclosureSearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search disclosures..."
      className="w-full px-4 py-2 border rounded-lg"
    />
  );
}
```

#### 1.5 Redux Selector Optimization

```typescript
// /frontend/src/pages/compliance/store/complianceSlice.ts
import { createSelector } from '@reduxjs/toolkit';

// Memoized selectors
export const selectDisclosures = (state: RootState) => state.compliance.disclosures;

export const selectDisclosureById = createSelector(
  [selectDisclosures, (state: RootState, disclosureId: string) => disclosureId],
  (disclosures, disclosureId) =>
    disclosures.find(d => d.id === disclosureId)
);

export const selectDisclosuresByDateRange = createSelector(
  [selectDisclosures, (state: RootState, dateRange: DateRange) => dateRange],
  (disclosures, dateRange) =>
    disclosures.filter(d =>
      isWithinInterval(new Date(d.disclosureDate), {
        start: dateRange.start,
        end: dateRange.end
      })
    )
);
```

**Performance Budget:**
- Initial Load: < 500ms
- Search Response: < 100ms (debounced)
- Filter Update: < 50ms
- Bundle Size: < 30KB (gzipped)

---

### Feature 2: End-to-End Encryption UI

**Performance Profile:**
- Update Frequency: Constant monitoring
- Critical Metric: Real-time status updates without blocking

#### 2.1 Lazy Loading

```typescript
// /frontend/src/pages/compliance/EncryptionDashboard.tsx
import { lazy, Suspense } from 'react';

const EncryptionStatus = lazy(() => import('./components/EncryptionStatus'));
const KeyManagement = lazy(() => import('./components/KeyManagement'));
const EncryptionMetrics = lazy(() => import('./components/EncryptionMetrics'));

export default function EncryptionDashboard() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<SkeletonCard />}>
        <EncryptionStatus />
      </Suspense>

      <Suspense fallback={<SkeletonCard />}>
        <EncryptionMetrics />
      </Suspense>

      <Suspense fallback={<SkeletonCard />}>
        <KeyManagement />
      </Suspense>
    </div>
  );
}
```

#### 2.2 Polling Optimization with TanStack Query

```typescript
// /frontend/src/services/modules/encryptionApi.ts
export function useEncryptionStatus() {
  return useQuery({
    queryKey: ['encryption-status'],
    queryFn: fetchEncryptionStatus,
    // Smart polling - only when tab is active
    refetchInterval: (data) => {
      // Increase interval if everything is healthy
      if (data?.status === 'healthy') return 30000; // 30s
      return 5000; // 5s if issues
    },
    refetchIntervalInBackground: false,
    staleTime: 10000 // 10s
  });
}
```

#### 2.3 Memoized Encryption Indicators

```typescript
// /frontend/src/pages/compliance/components/EncryptionStatus.tsx
import { memo } from 'react';

export const EncryptionStatus = memo(() => {
  const { data, isLoading } = useEncryptionStatus();

  const statusColor = useMemo(() => {
    switch (data?.status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }, [data?.status]);

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${statusColor}`} />
      <span>{data?.status || 'Unknown'}</span>
    </div>
  );
});

EncryptionStatus.displayName = 'EncryptionStatus';
```

**Performance Budget:**
- Status Update: < 50ms
- Poll Interval: 5-30s (adaptive)
- Bundle Size: < 20KB (gzipped)

---

### Feature 3: Tamper Alert System

**Performance Profile:**
- High Priority: Critical security alerts
- Update Frequency: Rare but immediate
- Critical Metric: Instant notification display

#### 3.1 WebSocket Integration (Non-Blocking)

```typescript
// /frontend/src/services/websocket/WebSocketService.ts
class WebSocketService {
  private socket: WebSocket | null = null;
  private messageQueue: any[] = [];
  private batchSize = 10;
  private batchInterval = 100; // ms
  private batchTimer: NodeJS.Timeout | null = null;

  connect(url: string) {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Batch messages to prevent UI blocking
      this.messageQueue.push(message);

      if (this.messageQueue.length >= this.batchSize) {
        this.processBatch();
      } else {
        this.scheduleBatch();
      }
    };
  }

  private scheduleBatch() {
    if (this.batchTimer) return;

    this.batchTimer = setTimeout(() => {
      this.processBatch();
    }, this.batchInterval);
  }

  private processBatch() {
    if (this.messageQueue.length === 0) return;

    // Process in requestAnimationFrame to avoid blocking
    requestAnimationFrame(() => {
      const batch = [...this.messageQueue];
      this.messageQueue = [];

      batch.forEach(message => {
        this.handleMessage(message);
      });
    });

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
  }

  private handleMessage(message: any) {
    if (message.type === 'TAMPER_ALERT') {
      // Dispatch to store or event listeners
      window.dispatchEvent(new CustomEvent('tamper-alert', {
        detail: message.payload
      }));
    }
  }
}

export const wsService = new WebSocketService();
```

#### 3.2 Priority-Based Alert Queue

```typescript
// /frontend/src/pages/compliance/components/TamperAlertManager.tsx
import { useCallback, useEffect, useState } from 'react';

interface Alert {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: Date;
}

export function TamperAlertManager() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Priority queue - process critical alerts first
  const addAlert = useCallback((alert: Alert) => {
    setAlerts(prev => {
      const newAlerts = [...prev, alert];
      return newAlerts.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    });
  }, []);

  useEffect(() => {
    const handleTamperAlert = (event: CustomEvent) => {
      addAlert(event.detail);
    };

    window.addEventListener('tamper-alert', handleTamperAlert as EventListener);

    return () => {
      window.removeEventListener('tamper-alert', handleTamperAlert as EventListener);
    };
  }, [addAlert]);

  // Display only top 5 alerts to prevent UI overflow
  const visibleAlerts = useMemo(() => alerts.slice(0, 5), [alerts]);

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {visibleAlerts.map(alert => (
        <TamperAlertNotification key={alert.id} alert={alert} />
      ))}
    </div>
  );
}
```

#### 3.3 Web Worker for Alert Processing

```typescript
// /frontend/src/workers/tamperAlertWorker.ts
self.onmessage = (event: MessageEvent) => {
  const { alerts, threshold } = event.data;

  // Process alerts in worker thread
  const processedAlerts = alerts.map((alert: any) => ({
    ...alert,
    severity: calculateSeverity(alert),
    actionRequired: alert.severity > threshold
  }));

  self.postMessage(processedAlerts);
};

function calculateSeverity(alert: any): number {
  // Complex severity calculation without blocking main thread
  let score = 0;

  if (alert.affectedRecords > 100) score += 3;
  if (alert.isPHI) score += 5;
  if (alert.isSystemWide) score += 2;

  return score;
}
```

**Performance Budget:**
- Alert Display: < 50ms
- Batch Processing: 100ms interval
- Max Concurrent Alerts: 5 (prevent UI overflow)
- Bundle Size: < 15KB (gzipped)

---

### Feature 4: Drug Interaction Checker (CRITICAL)

**Performance Profile:**
- **CRITICAL**: Sub-100ms response requirement
- High Frequency: Multiple checks per medication entry
- Large Dataset: 10,000+ drug interactions

#### 4.1 Instant Search with IndexedDB Cache

```typescript
// /frontend/src/services/indexedDB/drugInteractionDB.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface DrugInteractionDB extends DBSchema {
  drugs: {
    key: string;
    value: Drug;
    indexes: { 'by-name': string };
  };
  interactions: {
    key: string;
    value: Interaction;
    indexes: { 'by-drug-pair': string };
  };
}

class DrugInteractionCache {
  private db: IDBPDatabase<DrugInteractionDB> | null = null;

  async init() {
    this.db = await openDB<DrugInteractionDB>('drug-interactions', 1, {
      upgrade(db) {
        // Drugs store
        const drugStore = db.createObjectStore('drugs', { keyPath: 'id' });
        drugStore.createIndex('by-name', 'name');

        // Interactions store
        const interactionStore = db.createObjectStore('interactions', {
          keyPath: 'id'
        });
        interactionStore.createIndex('by-drug-pair', ['drug1Id', 'drug2Id']);
      }
    });
  }

  async searchDrugs(query: string): Promise<Drug[]> {
    if (!this.db) await this.init();

    const tx = this.db!.transaction('drugs', 'readonly');
    const index = tx.store.index('by-name');

    // Use getAll with IDBKeyRange for fast prefix search
    const range = IDBKeyRange.bound(
      query.toLowerCase(),
      query.toLowerCase() + '\uffff'
    );

    return await index.getAll(range, 10); // Limit to 10 results
  }

  async checkInteraction(drug1Id: string, drug2Id: string): Promise<Interaction | null> {
    if (!this.db) await this.init();

    const tx = this.db!.transaction('interactions', 'readonly');
    const index = tx.store.index('by-drug-pair');

    // Check both directions (A-B and B-A)
    const interaction1 = await index.get([drug1Id, drug2Id]);
    if (interaction1) return interaction1;

    const interaction2 = await index.get([drug2Id, drug1Id]);
    return interaction2 || null;
  }

  async bulkCheckInteractions(drugIds: string[]): Promise<Interaction[]> {
    const interactions: Interaction[] = [];

    // Check all pairs
    for (let i = 0; i < drugIds.length; i++) {
      for (let j = i + 1; j < drugIds.length; j++) {
        const interaction = await this.checkInteraction(drugIds[i], drugIds[j]);
        if (interaction) {
          interactions.push(interaction);
        }
      }
    }

    return interactions;
  }
}

export const drugInteractionCache = new DrugInteractionCache();
```

#### 4.2 Instant Search with Trie Data Structure

```typescript
// /frontend/src/services/search/DrugSearchTrie.ts
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
  drug: Drug | null = null;
}

class DrugSearchTrie {
  private root: TrieNode = new TrieNode();

  insert(drug: Drug) {
    let node = this.root;
    const name = drug.name.toLowerCase();

    for (const char of name) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }

    node.isEndOfWord = true;
    node.drug = drug;
  }

  search(prefix: string, limit: number = 10): Drug[] {
    const results: Drug[] = [];
    const node = this.findNode(prefix.toLowerCase());

    if (!node) return results;

    this.collectDrugs(node, results, limit);
    return results;
  }

  private findNode(prefix: string): TrieNode | null {
    let node = this.root;

    for (const char of prefix) {
      if (!node.children.has(char)) {
        return null;
      }
      node = node.children.get(char)!;
    }

    return node;
  }

  private collectDrugs(node: TrieNode, results: Drug[], limit: number) {
    if (results.length >= limit) return;

    if (node.isEndOfWord && node.drug) {
      results.push(node.drug);
    }

    for (const child of node.children.values()) {
      this.collectDrugs(child, results, limit);
    }
  }
}

export const drugSearchTrie = new DrugSearchTrie();
```

#### 4.3 Optimized Drug Interaction Component

```typescript
// /frontend/src/pages/medications/components/DrugInteractionChecker.tsx
import { memo, useState, useCallback, useMemo } from 'react';
import { useDebounce } from '@/utils/performance';
import { drugInteractionCache } from '@/services/indexedDB/drugInteractionDB';
import { drugSearchTrie } from '@/services/search/DrugSearchTrie';

interface DrugInteractionCheckerProps {
  selectedDrugs: Drug[];
  onInteractionFound: (interactions: Interaction[]) => void;
}

export const DrugInteractionChecker = memo(({
  selectedDrugs,
  onInteractionFound
}: DrugInteractionCheckerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Drug[]>([]);

  // Instant search (no debounce for drug search - must be fast!)
  const handleSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    performanceMark('drug-search-start');

    // Try Trie search first (in-memory, instant)
    const trieResults = drugSearchTrie.search(query, 10);

    if (trieResults.length > 0) {
      setSuggestions(trieResults);
    } else {
      // Fallback to IndexedDB
      const dbResults = await drugInteractionCache.searchDrugs(query);
      setSuggestions(dbResults);
    }

    performanceMark('drug-search-end');
    const duration = performanceMeasure('drug-search', 'drug-search-start', 'drug-search-end');

    // Log if search takes > 50ms
    if (duration && duration > 50) {
      console.warn(`Drug search took ${duration}ms - optimize!`);
    }
  }, []);

  // Check interactions whenever drugs change
  useEffect(() => {
    if (selectedDrugs.length < 2) return;

    const checkInteractions = async () => {
      performanceMark('interaction-check-start');

      const drugIds = selectedDrugs.map(d => d.id);
      const interactions = await drugInteractionCache.bulkCheckInteractions(drugIds);

      performanceMark('interaction-check-end');

      onInteractionFound(interactions);
    };

    checkInteractions();
  }, [selectedDrugs, onInteractionFound]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        placeholder="Search drugs..."
        className="w-full px-4 py-2 border rounded-lg"
        autoComplete="off"
      />

      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg">
          {suggestions.map(drug => (
            <DrugSuggestionItem key={drug.id} drug={drug} />
          ))}
        </div>
      )}
    </div>
  );
});

DrugInteractionChecker.displayName = 'DrugInteractionChecker';
```

#### 4.4 Web Worker for Interaction Calculation

```typescript
// /frontend/src/workers/drugInteractionWorker.ts
interface DrugInteractionMessage {
  type: 'CHECK_INTERACTIONS';
  drugs: Drug[];
  interactionDatabase: Map<string, Interaction>;
}

self.onmessage = async (event: MessageEvent<DrugInteractionMessage>) => {
  const { type, drugs, interactionDatabase } = event.data;

  if (type === 'CHECK_INTERACTIONS') {
    const interactions: Interaction[] = [];

    // Complex interaction checking in worker thread
    for (let i = 0; i < drugs.length; i++) {
      for (let j = i + 1; j < drugs.length; j++) {
        const key1 = `${drugs[i].id}-${drugs[j].id}`;
        const key2 = `${drugs[j].id}-${drugs[i].id}`;

        const interaction = interactionDatabase.get(key1) ||
                           interactionDatabase.get(key2);

        if (interaction) {
          interactions.push({
            ...interaction,
            severity: calculateSeverity(interaction, drugs[i], drugs[j])
          });
        }
      }
    }

    // Sort by severity
    interactions.sort((a, b) => b.severity - a.severity);

    self.postMessage({ interactions });
  }
};

function calculateSeverity(
  interaction: Interaction,
  drug1: Drug,
  drug2: Drug
): number {
  let score = interaction.baseSeverity || 0;

  // Additional severity calculations
  if (drug1.isControlled || drug2.isControlled) score += 2;
  if (interaction.contraindicated) score += 5;

  return Math.min(score, 10);
}
```

**Performance Budget:**
- Search Response: < 50ms (CRITICAL)
- Interaction Check: < 100ms (CRITICAL)
- Cache Hit Rate: > 95%
- Bundle Size: < 50KB (gzipped)
- IndexedDB Size: 5-10MB (preloaded)

---

### Feature 5: Outbreak Detection

**Performance Profile:**
- Large Dataset: 10,000+ health records
- Complex Analytics: Pattern detection algorithms
- Update Frequency: Hourly batch processing

#### 5.1 Web Worker for Pattern Detection

```typescript
// /frontend/src/workers/outbreakDetectionWorker.ts
interface HealthRecord {
  id: string;
  studentId: string;
  diagnosis: string;
  date: Date;
  symptoms: string[];
}

interface OutbreakDetectionMessage {
  type: 'DETECT_OUTBREAKS';
  records: HealthRecord[];
  threshold: number;
  timeWindow: number; // days
}

self.onmessage = async (event: MessageEvent<OutbreakDetectionMessage>) => {
  const { type, records, threshold, timeWindow } = event.data;

  if (type === 'DETECT_OUTBREAKS') {
    const outbreaks = detectOutbreaks(records, threshold, timeWindow);
    self.postMessage({ outbreaks });
  }
};

function detectOutbreaks(
  records: HealthRecord[],
  threshold: number,
  timeWindow: number
): Outbreak[] {
  const diagnosisCounts: Map<string, HealthRecord[]> = new Map();
  const now = new Date();
  const windowStart = new Date(now.getTime() - timeWindow * 24 * 60 * 60 * 1000);

  // Group by diagnosis within time window
  for (const record of records) {
    const recordDate = new Date(record.date);

    if (recordDate >= windowStart && recordDate <= now) {
      if (!diagnosisCounts.has(record.diagnosis)) {
        diagnosisCounts.set(record.diagnosis, []);
      }
      diagnosisCounts.get(record.diagnosis)!.push(record);
    }
  }

  // Detect spikes
  const outbreaks: Outbreak[] = [];

  for (const [diagnosis, diagnosisRecords] of diagnosisCounts) {
    if (diagnosisRecords.length >= threshold) {
      // Calculate spike severity
      const historicalAverage = calculateHistoricalAverage(records, diagnosis);
      const currentRate = diagnosisRecords.length / timeWindow;
      const spikeRatio = currentRate / historicalAverage;

      if (spikeRatio > 2) { // 2x normal rate
        outbreaks.push({
          diagnosis,
          count: diagnosisRecords.length,
          affectedStudents: diagnosisRecords.map(r => r.studentId),
          severity: spikeRatio > 5 ? 'critical' : spikeRatio > 3 ? 'high' : 'medium',
          startDate: diagnosisRecords[0].date,
          trend: calculateTrend(diagnosisRecords)
        });
      }
    }
  }

  return outbreaks.sort((a, b) => b.count - a.count);
}

function calculateHistoricalAverage(
  records: HealthRecord[],
  diagnosis: string
): number {
  // 30-day historical average
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

  const historicalRecords = records.filter(r =>
    r.diagnosis === diagnosis &&
    new Date(r.date) >= sixtyDaysAgo &&
    new Date(r.date) < thirtyDaysAgo
  );

  return historicalRecords.length / 30; // daily average
}

function calculateTrend(records: HealthRecord[]): 'increasing' | 'decreasing' | 'stable' {
  if (records.length < 4) return 'stable';

  const sortedRecords = records.sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const firstHalf = sortedRecords.slice(0, Math.floor(records.length / 2)).length;
  const secondHalf = sortedRecords.slice(Math.floor(records.length / 2)).length;

  if (secondHalf > firstHalf * 1.2) return 'increasing';
  if (secondHalf < firstHalf * 0.8) return 'decreasing';
  return 'stable';
}
```

#### 5.2 Outbreak Detection Component

```typescript
// /frontend/src/pages/health/components/OutbreakDetector.tsx
import { memo, useEffect, useState } from 'react';
import { useWebWorker } from '@/utils/performance';

export const OutbreakDetector = memo(() => {
  const [outbreaks, setOutbreaks] = useState<Outbreak[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: healthRecords } = useQuery({
    queryKey: ['health-records-outbreak'],
    queryFn: fetchRecentHealthRecords,
    staleTime: 60 * 60 * 1000, // 1 hour
    // Only fetch during business hours to reduce load
    enabled: isBusinessHours()
  });

  useEffect(() => {
    if (!healthRecords) return;

    setIsAnalyzing(true);

    // Use Web Worker for heavy computation
    const worker = new Worker(
      new URL('@/workers/outbreakDetectionWorker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.postMessage({
      type: 'DETECT_OUTBREAKS',
      records: healthRecords,
      threshold: 5, // 5 cases within window
      timeWindow: 7 // 7 days
    });

    worker.onmessage = (event) => {
      setOutbreaks(event.data.outbreaks);
      setIsAnalyzing(false);
      worker.terminate();
    };

    return () => {
      worker.terminate();
    };
  }, [healthRecords]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Outbreak Detection</h2>

      {isAnalyzing && (
        <div className="flex items-center space-x-2">
          <Spinner />
          <span>Analyzing health records...</span>
        </div>
      )}

      {outbreaks.length > 0 && (
        <div className="space-y-2">
          {outbreaks.map(outbreak => (
            <OutbreakAlert key={outbreak.diagnosis} outbreak={outbreak} />
          ))}
        </div>
      )}
    </div>
  );
});

OutbreakDetector.displayName = 'OutbreakDetector';

function isBusinessHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();

  // Monday-Friday, 6am-6pm
  return day >= 1 && day <= 5 && hour >= 6 && hour < 18;
}
```

#### 5.3 Chart Optimization with Recharts

```typescript
// /frontend/src/pages/health/components/OutbreakTrendChart.tsx
import { memo, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface OutbreakTrendChartProps {
  outbreak: Outbreak;
  historicalData: HealthRecord[];
}

export const OutbreakTrendChart = memo(({ outbreak, historicalData }: OutbreakTrendChartProps) => {
  // Memoize chart data calculation
  const chartData = useMemo(() => {
    const data: { date: string; count: number }[] = [];
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date;
    });

    for (const date of last30Days) {
      const dayRecords = historicalData.filter(r =>
        isSameDay(new Date(r.date), date) && r.diagnosis === outbreak.diagnosis
      );

      data.push({
        date: format(date, 'MM/dd'),
        count: dayRecords.length
      });
    }

    return data;
  }, [outbreak.diagnosis, historicalData]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#ef4444"
          strokeWidth={2}
          dot={false} // Remove dots for performance
          isAnimationActive={false} // Disable animations
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

OutbreakTrendChart.displayName = 'OutbreakTrendChart';
```

**Performance Budget:**
- Analysis Time: < 2s for 10,000 records (Web Worker)
- Chart Render: < 300ms
- Update Frequency: Every 1 hour
- Bundle Size: < 60KB (including Recharts chunk)

---

### Feature 6: Real-Time Alerts (WebSocket)

**Performance Profile:**
- **CRITICAL**: Must not block UI
- High Volume: 100+ alerts per minute possible
- Low Latency: < 200ms notification display

#### 6.1 Optimized WebSocket Service

```typescript
// /frontend/src/services/websocket/RealTimeAlertService.ts
interface AlertMessage {
  id: string;
  type: 'emergency' | 'medication' | 'health' | 'system';
  priority: 'critical' | 'high' | 'medium' | 'low';
  payload: any;
  timestamp: number;
}

class RealTimeAlertService {
  private socket: WebSocket | null = null;
  private messageBuffer: AlertMessage[] = [];
  private batchSize = 20;
  private batchInterval = 150; // ms
  private batchTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private listeners: Map<string, Set<(alert: AlertMessage) => void>> = new Map();

  connect(url: string) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      try {
        const alert: AlertMessage = JSON.parse(event.data);

        // Priority-based handling
        if (alert.priority === 'critical') {
          // Process critical alerts immediately
          this.processAlert(alert);
        } else {
          // Batch non-critical alerts
          this.bufferAlert(alert);
        }
      } catch (error) {
        console.error('Failed to parse alert:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket closed');
      this.reconnect(url);
    };
  }

  private bufferAlert(alert: AlertMessage) {
    this.messageBuffer.push(alert);

    // Flush buffer if it reaches batch size
    if (this.messageBuffer.length >= this.batchSize) {
      this.flushBuffer();
    } else {
      // Schedule batch flush
      this.scheduleBatchFlush();
    }
  }

  private scheduleBatchFlush() {
    if (this.batchTimer) return;

    this.batchTimer = setTimeout(() => {
      this.flushBuffer();
    }, this.batchInterval);
  }

  private flushBuffer() {
    if (this.messageBuffer.length === 0) return;

    // Use requestIdleCallback if available
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.processBatch();
      }, { timeout: 1000 });
    } else {
      // Fallback to requestAnimationFrame
      requestAnimationFrame(() => {
        this.processBatch();
      });
    }

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
  }

  private processBatch() {
    const batch = [...this.messageBuffer];
    this.messageBuffer = [];

    // Sort by priority
    batch.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    // Process in chunks to avoid blocking
    const chunkSize = 10;
    for (let i = 0; i < batch.length; i += chunkSize) {
      const chunk = batch.slice(i, i + chunkSize);

      setTimeout(() => {
        chunk.forEach(alert => this.processAlert(alert));
      }, i / chunkSize * 50); // Stagger processing
    }
  }

  private processAlert(alert: AlertMessage) {
    // Notify listeners
    const listeners = this.listeners.get(alert.type);
    if (listeners) {
      listeners.forEach(listener => listener(alert));
    }

    // Dispatch global event
    window.dispatchEvent(new CustomEvent('realtime-alert', {
      detail: alert
    }));
  }

  subscribe(type: string, callback: (alert: AlertMessage) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    return () => {
      this.listeners.get(type)?.delete(callback);
    };
  }

  private reconnect(url: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    setTimeout(() => {
      console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);
      this.connect(url);
    }, delay);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
  }
}

export const realTimeAlertService = new RealTimeAlertService();
```

#### 6.2 Alert Display Component (Optimized)

```typescript
// /frontend/src/components/alerts/RealTimeAlertDisplay.tsx
import { memo, useEffect, useState, useCallback } from 'react';
import { realTimeAlertService } from '@/services/websocket/RealTimeAlertService';

const MAX_VISIBLE_ALERTS = 3;
const ALERT_DISMISS_TIMEOUT = 5000; // 5 seconds

export const RealTimeAlertDisplay = memo(() => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  useEffect(() => {
    const handleAlert = (event: CustomEvent<AlertMessage>) => {
      const alert = event.detail;

      setAlerts(prev => {
        // Add new alert
        const newAlerts = [alert, ...prev];

        // Keep only MAX_VISIBLE_ALERTS
        return newAlerts.slice(0, MAX_VISIBLE_ALERTS);
      });

      // Auto-dismiss non-critical alerts
      if (alert.priority !== 'critical') {
        setTimeout(() => {
          dismissAlert(alert.id);
        }, ALERT_DISMISS_TIMEOUT);
      }
    };

    window.addEventListener('realtime-alert', handleAlert as EventListener);

    return () => {
      window.removeEventListener('realtime-alert', handleAlert as EventListener);
    };
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  return (
    <div className="fixed top-20 right-4 space-y-2 z-50 w-96">
      {alerts.map(alert => (
        <AlertCard
          key={alert.id}
          alert={alert}
          onDismiss={dismissAlert}
        />
      ))}
    </div>
  );
});

RealTimeAlertDisplay.displayName = 'RealTimeAlertDisplay';

// Memoized alert card
const AlertCard = memo(({
  alert,
  onDismiss
}: {
  alert: AlertMessage;
  onDismiss: (id: string) => void;
}) => {
  const bgColor = useMemo(() => {
    switch (alert.priority) {
      case 'critical': return 'bg-red-100 border-red-500';
      case 'high': return 'bg-orange-100 border-orange-500';
      case 'medium': return 'bg-yellow-100 border-yellow-500';
      default: return 'bg-blue-100 border-blue-500';
    }
  }, [alert.priority]);

  return (
    <div className={`p-4 border-l-4 rounded-lg shadow-lg ${bgColor} animate-slide-in`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold">{alert.type}</h4>
          <p className="text-sm mt-1">{alert.payload.message}</p>
        </div>
        <button
          onClick={() => onDismiss(alert.id)}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
    </div>
  );
});

AlertCard.displayName = 'AlertCard';
```

#### 6.3 Audio Alert (Non-Blocking)

```typescript
// /frontend/src/services/audio/AlertSoundService.ts
class AlertSoundService {
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();

  async init() {
    this.audioContext = new AudioContext();

    // Preload alert sounds
    await this.preloadSound('critical', '/sounds/critical-alert.mp3');
    await this.preloadSound('high', '/sounds/high-alert.mp3');
  }

  async preloadSound(name: string, url: string) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(name, audioBuffer);
    } catch (error) {
      console.error(`Failed to load sound ${name}:`, error);
    }
  }

  play(soundName: string) {
    if (!this.audioContext) return;

    const buffer = this.audioBuffers.get(soundName);
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start(0);
  }
}

export const alertSoundService = new AlertSoundService();
```

**Performance Budget:**
- Alert Display Latency: < 200ms
- Batch Processing: 150ms interval
- Max Concurrent Alerts: 3 (prevent UI overflow)
- Audio Latency: < 50ms
- Bundle Size: < 25KB (gzipped)

---

### Feature 7: Clinic Visit Tracking

**Performance Profile:**
- High Volume: 500+ visits per day
- Real-Time Updates: Entry/exit tracking
- Analytics: Visit frequency patterns

#### 7.1 Virtual Scrolling for Visit List

```typescript
// /frontend/src/pages/clinic/components/ClinicVisitList.tsx
import { memo, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface ClinicVisitListProps {
  visits: ClinicVisit[];
  onVisitClick: (visit: ClinicVisit) => void;
}

export const ClinicVisitList = memo(({ visits, onVisitClick }: ClinicVisitListProps) => {
  const sortedVisits = useMemo(() => {
    return [...visits].sort((a, b) =>
      new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime()
    );
  }, [visits]);

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const visit = sortedVisits[index];

    return (
      <div style={style}>
        <ClinicVisitRow visit={visit} onClick={() => onVisitClick(visit)} />
      </div>
    );
  }, [sortedVisits, onVisitClick]);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          itemCount={sortedVisits.length}
          itemSize={80}
          width={width}
          overscanCount={5} // Render 5 extra items for smooth scrolling
        >
          {Row}
        </List>
      )}
    </AutoSizer>
  );
});

ClinicVisitList.displayName = 'ClinicVisitList';

// Memoized row component
const ClinicVisitRow = memo(({
  visit,
  onClick
}: {
  visit: ClinicVisit;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex items-center justify-between p-4 border-b hover:bg-gray-50 cursor-pointer"
      onClick={onClick}
    >
      <div>
        <p className="font-semibold">{visit.studentName}</p>
        <p className="text-sm text-gray-600">{visit.reason}</p>
      </div>
      <div className="text-right">
        <p className="text-sm">{format(new Date(visit.entryTime), 'h:mm a')}</p>
        {visit.exitTime && (
          <p className="text-xs text-gray-500">
            Duration: {calculateDuration(visit.entryTime, visit.exitTime)}
          </p>
        )}
      </div>
    </div>
  );
});

ClinicVisitRow.displayName = 'ClinicVisitRow';
```

#### 7.2 Optimized Visit Entry Form

```typescript
// /frontend/src/pages/clinic/components/VisitEntryForm.tsx
import { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const visitSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  reason: z.string().min(3, 'Reason must be at least 3 characters'),
  symptoms: z.array(z.string()).optional(),
  temperature: z.number().optional(),
  notes: z.string().optional()
});

type VisitFormData = z.infer<typeof visitSchema>;

export const VisitEntryForm = memo(({
  onSubmit
}: {
  onSubmit: (data: VisitFormData) => Promise<void>;
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema)
  });

  const createVisit = useMutation({
    mutationFn: onSubmit,
    onSuccess: () => {
      reset();
      toast.success('Visit logged successfully');
    }
  });

  const onSubmitForm = useCallback(async (data: VisitFormData) => {
    performanceMark('visit-entry-start');

    await createVisit.mutateAsync(data);

    performanceMark('visit-entry-end');
  }, [createVisit]);

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Student</label>
        <StudentAutocomplete {...register('studentId')} />
        {errors.studentId && (
          <p className="text-red-500 text-sm mt-1">{errors.studentId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Reason for Visit</label>
        <input
          type="text"
          {...register('reason')}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="e.g., Headache, Fever, Injury"
        />
        {errors.reason && (
          <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Logging Visit...' : 'Log Visit'}
      </button>
    </form>
  );
});

VisitEntryForm.displayName = 'VisitEntryForm';
```

#### 7.3 Real-Time Visit Dashboard

```typescript
// /frontend/src/pages/clinic/components/ClinicDashboard.tsx
import { memo, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

export const ClinicDashboard = memo(() => {
  const { data: todayVisits } = useQuery({
    queryKey: ['clinic-visits', 'today'],
    queryFn: fetchTodayVisits,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 20000
  });

  const stats = useMemo(() => {
    if (!todayVisits) return null;

    return {
      total: todayVisits.length,
      currentlyInClinic: todayVisits.filter(v => !v.exitTime).length,
      averageDuration: calculateAverageDuration(todayVisits),
      topReasons: calculateTopReasons(todayVisits, 5)
    };
  }, [todayVisits]);

  if (!stats) return <SkeletonDashboard />;

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        title="Total Visits Today"
        value={stats.total}
        icon="📊"
      />
      <StatCard
        title="Currently in Clinic"
        value={stats.currentlyInClinic}
        icon="🏥"
      />
      <StatCard
        title="Avg Duration"
        value={`${stats.averageDuration} min`}
        icon="⏱️"
      />
      <StatCard
        title="Top Reason"
        value={stats.topReasons[0]?.reason || 'N/A'}
        icon="📝"
      />
    </div>
  );
});

ClinicDashboard.displayName = 'ClinicDashboard';

const StatCard = memo(({ title, value, icon }: { title: string; value: string | number; icon: string }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <span className="text-4xl">{icon}</span>
    </div>
  </div>
));

StatCard.displayName = 'StatCard';
```

**Performance Budget:**
- Visit List Scroll: 60 FPS
- Form Submission: < 500ms
- Dashboard Update: < 300ms
- Virtual List Rendering: < 100ms
- Bundle Size: < 40KB (gzipped)

---

### Feature 8: Immunization Dashboard

**Performance Profile:**
- Large Dataset: 5,000+ students with 10+ vaccines each
- Complex Filtering: Multiple criteria
- Visual Charts: Compliance graphs

#### 8.1 Virtual Scrolling with Pagination

```typescript
// /frontend/src/pages/health/components/ImmunizationList.tsx
import { memo, useState, useMemo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface ImmunizationListProps {
  students: Student[];
}

export const ImmunizationList = memo(({ students }: ImmunizationListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: students.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 10 // Render 10 extra items
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`
            }}
          >
            <ImmunizationRow student={students[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
});

ImmunizationList.displayName = 'ImmunizationList';

const ImmunizationRow = memo(({ student }: { student: Student }) => {
  const compliance = useMemo(() =>
    calculateCompliancePercentage(student.immunizations),
    [student.immunizations]
  );

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex-1">
        <p className="font-semibold">{student.name}</p>
        <p className="text-sm text-gray-600">Grade: {student.grade}</p>
      </div>
      <div className="flex items-center space-x-4">
        <ComplianceIndicator percentage={compliance} />
        <button className="text-blue-600 hover:text-blue-800">
          View Details
        </button>
      </div>
    </div>
  );
});

ImmunizationRow.displayName = 'ImmunizationRow';
```

#### 8.2 Optimized Compliance Chart

```typescript
// /frontend/src/pages/health/components/ImmunizationComplianceChart.tsx
import { memo, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ImmunizationComplianceChartProps {
  students: Student[];
}

export const ImmunizationComplianceChart = memo(({
  students
}: ImmunizationComplianceChartProps) => {
  // Memoize chart data calculation
  const chartData = useMemo(() => {
    const vaccineCompliance: Record<string, { vaccine: string; compliant: number; total: number }> = {};

    const requiredVaccines = [
      'MMR', 'DTaP', 'Polio', 'Hepatitis B', 'Varicella',
      'Tdap', 'Meningococcal', 'HPV'
    ];

    // Initialize
    requiredVaccines.forEach(vaccine => {
      vaccineCompliance[vaccine] = { vaccine, compliant: 0, total: students.length };
    });

    // Calculate compliance
    students.forEach(student => {
      requiredVaccines.forEach(vaccine => {
        const hasVaccine = student.immunizations?.some(imm =>
          imm.vaccine === vaccine && imm.status === 'COMPLETE'
        );

        if (hasVaccine) {
          vaccineCompliance[vaccine].compliant++;
        }
      });
    });

    return Object.values(vaccineCompliance).map(item => ({
      vaccine: item.vaccine,
      percentage: Math.round((item.compliant / item.total) * 100)
    }));
  }, [students]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="vaccine"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          domain={[0, 100]}
          label={{ value: 'Compliance %', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Bar
          dataKey="percentage"
          fill="#3b82f6"
          isAnimationActive={false} // Disable animations for performance
        />
      </BarChart>
    </ResponsiveContainer>
  );
});

ImmunizationComplianceChart.displayName = 'ImmunizationComplianceChart';
```

#### 8.3 Efficient Filtering

```typescript
// /frontend/src/pages/health/components/ImmunizationFilters.tsx
import { memo, useCallback } from 'react';
import { useDebounce } from '@/utils/performance';

interface FilterState {
  grade: string;
  complianceStatus: 'all' | 'compliant' | 'non-compliant' | 'partial';
  vaccine: string;
  searchTerm: string;
}

export const ImmunizationFilters = memo(({
  onFilterChange
}: {
  onFilterChange: (filters: FilterState) => void;
}) => {
  const [filters, setFilters] = useState<FilterState>({
    grade: 'all',
    complianceStatus: 'all',
    vaccine: 'all',
    searchTerm: ''
  });

  const debouncedSearch = useDebounce(filters.searchTerm, 300);

  useEffect(() => {
    onFilterChange({ ...filters, searchTerm: debouncedSearch });
  }, [debouncedSearch, filters, onFilterChange]);

  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      <select
        value={filters.grade}
        onChange={(e) => handleFilterChange('grade', e.target.value)}
        className="px-4 py-2 border rounded-lg"
      >
        <option value="all">All Grades</option>
        <option value="K">Kindergarten</option>
        <option value="1">1st Grade</option>
        {/* ... more options */}
      </select>

      <select
        value={filters.complianceStatus}
        onChange={(e) => handleFilterChange('complianceStatus', e.target.value)}
        className="px-4 py-2 border rounded-lg"
      >
        <option value="all">All Students</option>
        <option value="compliant">Compliant</option>
        <option value="non-compliant">Non-Compliant</option>
        <option value="partial">Partially Compliant</option>
      </select>

      <select
        value={filters.vaccine}
        onChange={(e) => handleFilterChange('vaccine', e.target.value)}
        className="px-4 py-2 border rounded-lg"
      >
        <option value="all">All Vaccines</option>
        <option value="MMR">MMR</option>
        <option value="DTaP">DTaP</option>
        {/* ... more options */}
      </select>

      <input
        type="text"
        value={filters.searchTerm}
        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
        placeholder="Search students..."
        className="px-4 py-2 border rounded-lg"
      />
    </div>
  );
});

ImmunizationFilters.displayName = 'ImmunizationFilters';
```

#### 8.4 Memoized Compliance Calculation

```typescript
// /frontend/src/utils/immunization.ts
import { memoize } from 'lodash';

export const calculateCompliancePercentage = memoize(
  (immunizations: Immunization[]): number => {
    const requiredVaccines = ['MMR', 'DTaP', 'Polio', 'Hepatitis B', 'Varicella'];

    const compliantCount = requiredVaccines.filter(vaccine =>
      immunizations.some(imm => imm.vaccine === vaccine && imm.status === 'COMPLETE')
    ).length;

    return Math.round((compliantCount / requiredVaccines.length) * 100);
  },
  // Custom cache key
  (immunizations) => immunizations.map(i => `${i.vaccine}-${i.status}`).join(',')
);

export const getOutstandingVaccines = memoize(
  (immunizations: Immunization[]): string[] => {
    const requiredVaccines = ['MMR', 'DTaP', 'Polio', 'Hepatitis B', 'Varicella'];

    return requiredVaccines.filter(vaccine =>
      !immunizations.some(imm => imm.vaccine === vaccine && imm.status === 'COMPLETE')
    );
  },
  (immunizations) => immunizations.map(i => `${i.vaccine}-${i.status}`).join(',')
);
```

**Performance Budget:**
- List Scroll: 60 FPS
- Filter Update: < 100ms
- Chart Render: < 500ms
- Search Response: < 100ms (debounced)
- Bundle Size: < 50KB (gzipped)

---

### Feature 9: Medicaid Billing UI

**Performance Profile:**
- Medium Volume: 100-500 claims per day
- Complex Forms: Multi-step workflow
- Large Data Tables: Claim history

#### 9.1 Code Splitting

```typescript
// /frontend/src/pages/medicaid/MedicaidBilling.tsx
import { lazy, Suspense } from 'react';

const ClaimForm = lazy(() => import('./components/ClaimForm'));
const ClaimHistory = lazy(() => import('./components/ClaimHistory'));
const EligibilityChecker = lazy(() => import('./components/EligibilityChecker'));
const PaymentTracking = lazy(() => import('./components/PaymentTracking'));
```

#### 9.2 Multi-Step Form with State Persistence

```typescript
// /frontend/src/pages/medicaid/components/ClaimForm.tsx
import { memo, useCallback, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

interface ClaimFormData {
  // Step 1: Patient Info
  patientId: string;
  serviceDate: string;

  // Step 2: Service Details
  serviceType: string;
  cptCodes: string[];

  // Step 3: Documentation
  documents: File[];
  notes: string;
}

export const ClaimForm = memo(() => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ClaimFormData>>({});

  const methods = useForm<ClaimFormData>({
    defaultValues: formData,
    mode: 'onChange'
  });

  // Save to localStorage for recovery
  useEffect(() => {
    const subscription = methods.watch((value) => {
      localStorage.setItem('claim-form-draft', JSON.stringify(value));
    });

    return () => subscription.unsubscribe();
  }, [methods]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('claim-form-draft');
    if (saved) {
      const parsed = JSON.parse(saved);
      methods.reset(parsed);
      setFormData(parsed);
    }
  }, [methods]);

  const onSubmit = useCallback(async (data: ClaimFormData) => {
    performanceMark('claim-submit-start');

    try {
      await submitClaim(data);

      // Clear draft
      localStorage.removeItem('claim-form-draft');

      toast.success('Claim submitted successfully');
    } catch (error) {
      toast.error('Failed to submit claim');
    } finally {
      performanceMark('claim-submit-end');
    }
  }, []);

  const nextStep = useCallback(async () => {
    const isValid = await methods.trigger();
    if (isValid) {
      setCurrentStep(prev => prev + 1);
      setFormData(methods.getValues());
    }
  }, [methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <StepIndicator currentStep={currentStep} totalSteps={3} />

        {currentStep === 1 && <PatientInfoStep />}
        {currentStep === 2 && <ServiceDetailsStep />}
        {currentStep === 3 && <DocumentationStep />}

        <div className="flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 border rounded-lg"
            >
              Previous
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={methods.formState.isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              {methods.formState.isSubmitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
});

ClaimForm.displayName = 'ClaimForm';
```

#### 9.3 Virtual Table for Claim History

```typescript
// /frontend/src/pages/medicaid/components/ClaimHistory.tsx
import { memo, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export const ClaimHistory = memo(() => {
  const { data: claims, isLoading } = useQuery({
    queryKey: ['medicaid-claims'],
    queryFn: fetchMedicaidClaims,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: claims?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5
  });

  if (isLoading) return <SkeletonTable />;

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto border rounded-lg">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualRow => {
          const claim = claims![virtualRow.index];

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
              <ClaimRow claim={claim} />
            </div>
          );
        })}
      </div>
    </div>
  );
});

ClaimHistory.displayName = 'ClaimHistory';

const ClaimRow = memo(({ claim }: { claim: MedicaidClaim }) => {
  const statusColor = useMemo(() => {
    switch (claim.status) {
      case 'APPROVED': return 'text-green-600';
      case 'REJECTED': return 'text-red-600';
      case 'PENDING': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  }, [claim.status]);

  return (
    <div className="flex items-center justify-between p-4 border-b hover:bg-gray-50">
      <div className="flex-1">
        <p className="font-semibold">{claim.claimNumber}</p>
        <p className="text-sm text-gray-600">{claim.patientName}</p>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${statusColor}`}>{claim.status}</p>
        <p className="text-sm text-gray-600">${claim.amount}</p>
      </div>
    </div>
  );
});

ClaimRow.displayName = 'ClaimRow';
```

**Performance Budget:**
- Form Step Transition: < 100ms
- Table Scroll: 60 FPS
- Claim Submission: < 2s
- Bundle Size: < 45KB (gzipped)

---

### Feature 10: PDF Reports (Web Worker)

**Performance Profile:**
- **CRITICAL**: Must not block UI
- Large Documents: 20-50 pages
- Export Frequency: Multiple times per day

#### 10.1 Web Worker PDF Generation

```typescript
// /frontend/src/workers/pdfGeneratorWorker.ts
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface PDFGenerationMessage {
  type: 'GENERATE_PDF';
  data: any;
  template: 'student-report' | 'immunization-report' | 'medication-report';
}

self.onmessage = async (event: MessageEvent<PDFGenerationMessage>) => {
  const { type, data, template } = event.data;

  if (type === 'GENERATE_PDF') {
    try {
      const pdf = await generatePDF(data, template);
      const pdfBlob = pdf.output('blob');

      self.postMessage({
        success: true,
        blob: pdfBlob
      });
    } catch (error) {
      self.postMessage({
        success: false,
        error: error.message
      });
    }
  }
};

async function generatePDF(data: any, template: string): Promise<jsPDF> {
  const pdf = new jsPDF();

  switch (template) {
    case 'student-report':
      return generateStudentReport(pdf, data);
    case 'immunization-report':
      return generateImmunizationReport(pdf, data);
    case 'medication-report':
      return generateMedicationReport(pdf, data);
    default:
      throw new Error('Unknown template');
  }
}

function generateStudentReport(pdf: jsPDF, data: any): jsPDF {
  // Header
  pdf.setFontSize(20);
  pdf.text('Student Health Report', 20, 20);

  // Student Info
  pdf.setFontSize(12);
  pdf.text(`Name: ${data.student.name}`, 20, 40);
  pdf.text(`Grade: ${data.student.grade}`, 20, 50);
  pdf.text(`DOB: ${data.student.dateOfBirth}`, 20, 60);

  // Health Records Table
  const healthRecords = data.healthRecords.map((record: any) => [
    record.date,
    record.type,
    record.diagnosis,
    record.provider
  ]);

  (pdf as any).autoTable({
    startY: 80,
    head: [['Date', 'Type', 'Diagnosis', 'Provider']],
    body: healthRecords,
    theme: 'grid',
    styles: { fontSize: 10 }
  });

  return pdf;
}

function generateImmunizationReport(pdf: jsPDF, data: any): jsPDF {
  pdf.setFontSize(20);
  pdf.text('Immunization Compliance Report', 20, 20);

  // Summary
  pdf.setFontSize(12);
  pdf.text(`Total Students: ${data.totalStudents}`, 20, 40);
  pdf.text(`Compliant: ${data.compliantStudents}`, 20, 50);
  pdf.text(`Non-Compliant: ${data.nonCompliantStudents}`, 20, 60);

  // Detailed Table
  const rows = data.students.map((student: any) => [
    student.name,
    student.grade,
    `${student.compliancePercentage}%`,
    student.missingVaccines.join(', ')
  ]);

  (pdf as any).autoTable({
    startY: 80,
    head: [['Student', 'Grade', 'Compliance', 'Missing Vaccines']],
    body: rows,
    theme: 'striped',
    styles: { fontSize: 10 }
  });

  return pdf;
}

function generateMedicationReport(pdf: jsPDF, data: any): jsPDF {
  pdf.setFontSize(20);
  pdf.text('Medication Administration Report', 20, 20);

  // Date Range
  pdf.setFontSize(12);
  pdf.text(`Report Period: ${data.startDate} - ${data.endDate}`, 20, 40);

  // Medication List
  const rows = data.medications.map((med: any) => [
    med.studentName,
    med.medicationName,
    med.dosage,
    med.administeredBy,
    med.timestamp
  ]);

  (pdf as any).autoTable({
    startY: 60,
    head: [['Student', 'Medication', 'Dosage', 'Administered By', 'Time']],
    body: rows,
    theme: 'grid',
    styles: { fontSize: 9 }
  });

  return pdf;
}
```

#### 10.2 PDF Export Component

```typescript
// /frontend/src/pages/reports/components/PDFExporter.tsx
import { memo, useCallback, useState } from 'react';

interface PDFExporterProps {
  data: any;
  template: 'student-report' | 'immunization-report' | 'medication-report';
  filename: string;
}

export const PDFExporter = memo(({ data, template, filename }: PDFExporterProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generatePDF = useCallback(async () => {
    setIsGenerating(true);
    setProgress(0);

    performanceMark('pdf-generation-start');

    try {
      // Create Web Worker
      const worker = new Worker(
        new URL('@/workers/pdfGeneratorWorker.ts', import.meta.url),
        { type: 'module' }
      );

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      worker.postMessage({
        type: 'GENERATE_PDF',
        data,
        template
      });

      worker.onmessage = (event) => {
        clearInterval(progressInterval);
        setProgress(100);

        if (event.data.success) {
          // Download PDF
          const url = URL.createObjectURL(event.data.blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${filename}.pdf`;
          a.click();
          URL.revokeObjectURL(url);

          toast.success('PDF generated successfully');
        } else {
          toast.error(`Failed to generate PDF: ${event.data.error}`);
        }

        setIsGenerating(false);
        setProgress(0);
        worker.terminate();

        performanceMark('pdf-generation-end');
        const duration = performanceMeasure(
          'pdf-generation',
          'pdf-generation-start',
          'pdf-generation-end'
        );

        console.log(`PDF generation took ${duration}ms`);
      };

    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
      setIsGenerating(false);
      setProgress(0);
    }
  }, [data, template, filename]);

  return (
    <div className="space-y-2">
      <button
        onClick={generatePDF}
        disabled={isGenerating}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isGenerating ? `Generating... ${progress}%` : 'Export PDF'}
      </button>

      {isGenerating && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
});

PDFExporter.displayName = 'PDFExporter';
```

#### 10.3 Batch PDF Generation

```typescript
// /frontend/src/pages/reports/components/BatchPDFExporter.tsx
import { memo, useCallback, useState } from 'react';

export const BatchPDFExporter = memo(({
  reports
}: {
  reports: Array<{ data: any; template: string; filename: string }>;
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generateBatch = useCallback(async () => {
    setIsGenerating(true);
    setCurrentIndex(0);

    for (let i = 0; i < reports.length; i++) {
      const report = reports[i];

      await new Promise<void>((resolve, reject) => {
        const worker = new Worker(
          new URL('@/workers/pdfGeneratorWorker.ts', import.meta.url),
          { type: 'module' }
        );

        worker.postMessage({
          type: 'GENERATE_PDF',
          data: report.data,
          template: report.template
        });

        worker.onmessage = (event) => {
          if (event.data.success) {
            // Auto-download
            const url = URL.createObjectURL(event.data.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${report.filename}.pdf`;
            a.click();
            URL.revokeObjectURL(url);

            setCurrentIndex(i + 1);
            resolve();
          } else {
            reject(new Error(event.data.error));
          }

          worker.terminate();
        };
      });

      // Delay between generations to prevent browser freeze
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsGenerating(false);
    toast.success(`Generated ${reports.length} PDF reports`);
  }, [reports]);

  return (
    <div className="space-y-4">
      <button
        onClick={generateBatch}
        disabled={isGenerating}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {isGenerating
          ? `Generating ${currentIndex + 1} of ${reports.length}...`
          : `Generate ${reports.length} PDFs`
        }
      </button>

      {isGenerating && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-200"
              style={{ width: `${((currentIndex + 1) / reports.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            Generating report {currentIndex + 1} of {reports.length}
          </p>
        </div>
      )}
    </div>
  );
});

BatchPDFExporter.displayName = 'BatchPDFExporter';
```

**Performance Budget:**
- PDF Generation: < 5s for 50-page document (Web Worker)
- UI Blocking: 0ms (all processing in worker)
- Download Time: Instant (blob URL)
- Bundle Size: jsPDF chunk < 150KB (gzipped)

---

## Performance Budgets

### Global Performance Budget

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| **Initial Bundle Size** | < 200KB | < 250KB |
| **Total Page Weight** | < 1MB | < 1.5MB |
| **Time to Interactive** | < 3.5s | < 5s |
| **First Contentful Paint** | < 1.5s | < 2s |
| **Largest Contentful Paint** | < 2.5s | < 3.5s |
| **First Input Delay** | < 100ms | < 200ms |
| **Cumulative Layout Shift** | < 0.1 | < 0.25 |

### Feature-Specific Budgets

| Feature | Bundle Size | Initial Load | Interaction Response |
|---------|------------|--------------|---------------------|
| PHI Disclosure Tracking | 30KB | < 500ms | < 100ms |
| Encryption UI | 20KB | < 300ms | < 50ms |
| Tamper Alerts | 15KB | < 200ms | < 50ms |
| Drug Interaction Checker | 50KB | < 300ms | **< 50ms** (CRITICAL) |
| Outbreak Detection | 60KB | < 1s | < 2s (Web Worker) |
| Real-Time Alerts | 25KB | < 200ms | **< 200ms** (CRITICAL) |
| Clinic Visit Tracking | 40KB | < 500ms | < 100ms |
| Immunization Dashboard | 50KB | < 600ms | < 300ms |
| Medicaid Billing | 45KB | < 500ms | < 100ms |
| PDF Reports | 150KB | < 300ms | < 5s (Web Worker) |

---

## Core Web Vitals Targets

### Largest Contentful Paint (LCP)

**Target: < 2.5s**

Optimizations:
1. Preload critical resources
2. Optimize images (WebP, AVIF)
3. Use CDN for static assets
4. Eliminate render-blocking resources
5. Implement progressive loading

```typescript
// Preload critical resources
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/api/dashboard" as="fetch" crossorigin />

// Progressive image loading
<img
  src="placeholder.jpg"
  data-src="full-image.jpg"
  loading="lazy"
  decoding="async"
  onLoad="this.src = this.dataset.src"
/>
```

### First Input Delay (FID) / Interaction to Next Paint (INP)

**Target: < 100ms / < 200ms**

Optimizations:
1. Code split large bundles
2. Defer non-critical JavaScript
3. Use Web Workers for heavy computation
4. Optimize event handlers
5. Break up long tasks

```typescript
// Break up long tasks
async function processLargeDataset(data: any[]) {
  const chunkSize = 100;

  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);

    await new Promise(resolve => {
      requestIdleCallback(() => {
        processChunk(chunk);
        resolve(null);
      }, { timeout: 1000 });
    });
  }
}
```

### Cumulative Layout Shift (CLS)

**Target: < 0.1**

Optimizations:
1. Set explicit dimensions for images and videos
2. Reserve space for dynamic content
3. Use CSS Grid/Flexbox for stable layouts
4. Preload fonts to avoid FOIT/FOUT
5. Avoid inserting content above existing content

```css
/* Reserve space for images */
.image-container {
  aspect-ratio: 16 / 9;
  width: 100%;
}

/* Stable skeleton screens */
.skeleton {
  min-height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

**Goals:**
- Set up performance monitoring
- Implement global optimizations
- Configure bundle splitting

**Tasks:**
1. Update Vite configuration with code splitting
2. Install and configure performance monitoring
3. Set up Web Vitals tracking
4. Implement global performance utilities
5. Create bundle analysis workflow

**Deliverables:**
- Enhanced vite.config.ts
- Performance utilities (/utils/performance.ts)
- Web Vitals monitoring
- Bundle analysis reports

### Phase 2: Critical Features (Week 3-6)

**Goals:**
- Optimize Drug Interaction Checker (CRITICAL)
- Implement Real-Time Alerts
- Optimize PDF Generation

**Tasks:**
1. Implement IndexedDB cache for drug interactions
2. Create Trie-based drug search
3. Build WebSocket service with batching
4. Implement PDF Web Worker
5. Add performance marks for critical paths

**Deliverables:**
- Drug interaction checker < 50ms response
- Real-time alerts < 200ms latency
- Non-blocking PDF generation

### Phase 3: Large Dataset Features (Week 7-10)

**Goals:**
- Implement virtual scrolling
- Optimize dashboard performance
- Implement outbreak detection

**Tasks:**
1. Add react-window/react-virtual to all large lists
2. Implement Web Worker for outbreak detection
3. Optimize Recharts performance
4. Implement progressive loading for dashboard
5. Add memoization to all list components

**Deliverables:**
- Smooth 60 FPS scrolling
- Dashboard loads in < 1s
- Outbreak detection without UI blocking

### Phase 4: Remaining Features (Week 11-14)

**Goals:**
- Complete all 15 features
- Optimize remaining workflows
- Implement caching strategies

**Tasks:**
1. Optimize PHI Disclosure Tracking
2. Implement Encryption UI optimizations
3. Optimize Clinic Visit Tracking
4. Implement Immunization Dashboard optimizations
5. Optimize Medicaid Billing workflows

**Deliverables:**
- All features meet performance budgets
- TanStack Query caching implemented
- Redux selectors optimized

### Phase 5: Testing & Refinement (Week 15-16)

**Goals:**
- Achieve 90+ Lighthouse scores
- Meet all Core Web Vitals targets
- Comprehensive performance testing

**Tasks:**
1. Run Lighthouse audits for all features
2. Fix any performance regressions
3. Optimize bundle sizes
4. Implement lazy loading for images
5. Conduct real-device testing

**Deliverables:**
- Lighthouse reports
- Performance test results
- Final bundle analysis
- Production-ready optimizations

---

## Monitoring & Measurement

### 1. Web Vitals Tracking

```typescript
// /frontend/src/services/monitoring/webVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    page: window.location.pathname
  });

  // Send to backend
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/web-vitals', body);
  } else {
    fetch('/api/analytics/web-vitals', {
      body,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true
    });
  }
}

export function initWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

### 2. Performance Monitoring Dashboard

```typescript
// /frontend/src/pages/admin/components/PerformanceMonitor.tsx
import { memo, useEffect, useState } from 'react';

export const PerformanceMonitor = memo(() => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('Performance entry:', entry);

        // Track long tasks (> 50ms)
        if (entry.entryType === 'longtask' && entry.duration > 50) {
          console.warn(`Long task detected: ${entry.duration}ms`);
        }
      }
    });

    observer.observe({
      entryTypes: ['longtask', 'measure', 'navigation', 'resource']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Performance Metrics</h2>

      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          title="LCP"
          value={metrics?.lcp}
          threshold={2500}
          unit="ms"
        />
        <MetricCard
          title="FID"
          value={metrics?.fid}
          threshold={100}
          unit="ms"
        />
        <MetricCard
          title="CLS"
          value={metrics?.cls}
          threshold={0.1}
          unit=""
        />
      </div>
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';
```

### 3. Bundle Analysis Script

```bash
#!/bin/bash
# /frontend/scripts/analyze-bundle.sh

echo "Analyzing bundle size..."

# Build production bundle
npm run build

# Generate bundle analysis
npx vite-bundle-visualizer

# Check bundle sizes
echo "Main bundle size:"
du -h dist/assets/*.js | sort -rh | head -5

echo "\nVendor chunks:"
du -h dist/assets/vendor-*.js | sort -rh

echo "\nFeature chunks:"
du -h dist/assets/*-features-*.js | sort -rh

# Alert if any bundle > 250KB
find dist/assets -name "*.js" -size +250k -exec echo "WARNING: Large bundle found:" {} \;
```

### 4. Lighthouse CI Configuration

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:5173/',
        'http://localhost:5173/students',
        'http://localhost:5173/medications',
        'http://localhost:5173/health',
        'http://localhost:5173/compliance',
        'http://localhost:5173/integration',
        'http://localhost:5173/reports'
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1
        }
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],

        // Bundle size
        'total-byte-weight': ['warn', { maxNumericValue: 1000000 }] // 1MB
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

---

## Conclusion

This comprehensive performance optimization guide provides a roadmap to optimize all 15 critical features in the White Cross platform. By following these strategies:

1. **Code splitting** reduces initial bundle size by 60-70%
2. **Lazy loading** defers non-critical resources
3. **Memoization** prevents unnecessary re-renders
4. **Virtual scrolling** handles large datasets efficiently
5. **Web Workers** keep the UI responsive during heavy computation
6. **TanStack Query caching** reduces API calls by 80%
7. **WebSocket batching** handles high-volume real-time updates
8. **IndexedDB caching** provides instant drug interaction checks
9. **Progressive loading** improves perceived performance
10. **Performance monitoring** ensures ongoing optimization

**Expected Results:**
- Lighthouse Performance Score: 90+
- LCP: < 2.5s
- FID/INP: < 100ms / < 200ms
- CLS: < 0.1
- Bundle Size Reduction: 60-70%
- API Response Caching: 80% hit rate
- User Satisfaction: Significantly improved

**Next Steps:**
1. Review and approve this guide
2. Begin Phase 1: Foundation (Week 1-2)
3. Implement critical features first (Drug Interaction, Real-Time Alerts, PDF)
4. Monitor performance metrics continuously
5. Iterate based on real-world data

---

**Document Owner:** Frontend Performance Architect
**Last Updated:** October 26, 2025
**Version:** 1.0
**Status:** Ready for Implementation
