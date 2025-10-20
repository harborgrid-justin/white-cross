/**
 * Context Migration Strategy
 * 
 * Provides utilities and patterns for migrating from React Context to Redux
 * while maintaining backward compatibility and enabling gradual migration.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './reduxStore';

/**
 * Migration phases for gradual context-to-redux migration
 */
export enum MigrationPhase {
  CONTEXT_ONLY = 'context_only',
  HYBRID = 'hybrid',
  REDUX_ONLY = 'redux_only',
}

/**
 * Configuration for context migration
 */
export interface MigrationConfig {
  phase: MigrationPhase;
  contextName: string;
  reduxSlice: string;
  syncDirection: 'context_to_redux' | 'redux_to_context' | 'bidirectional';
  enableLogging?: boolean;
}

/**
 * Generic context-to-redux bridge
 */
export function createContextReduxBridge<T>(config: MigrationConfig) {
  return {
    /**
     * Hook that provides data from either context or Redux based on migration phase
     */
    useData: (contextValue?: T): T | undefined => {
      const dispatch = useDispatch<AppDispatch>();
      const reduxValue = useSelector((state: RootState) => 
        (state as any)[config.reduxSlice]
      );
      
      // Sync data based on configuration
      useEffect(() => {
        if (config.phase === MigrationPhase.HYBRID) {
          if (config.syncDirection === 'context_to_redux' && contextValue) {
            dispatch({
              type: `${config.reduxSlice}/syncFromContext`,
              payload: contextValue,
            });
          } else if (config.syncDirection === 'redux_to_context' && reduxValue && contextValue !== reduxValue) {
            // Context update would need to be handled by the context provider
            if (config.enableLogging) {
              console.log(`[Migration] Redux value differs from context for ${config.contextName}`);
            }
          }
        }
      }, [contextValue, reduxValue, dispatch]);
      
      // Return appropriate value based on migration phase
      switch (config.phase) {
        case MigrationPhase.CONTEXT_ONLY:
          return contextValue;
        case MigrationPhase.REDUX_ONLY:
          return reduxValue;
        case MigrationPhase.HYBRID:
          return config.syncDirection === 'redux_to_context' ? reduxValue : contextValue;
        default:
          return contextValue;
      }
    },
    
    /**
     * Hook for updating data that works across migration phases
     */
    useUpdateData: () => {
      const dispatch = useDispatch<AppDispatch>();
      
      return (newData: Partial<T>) => {
        if (config.phase === MigrationPhase.REDUX_ONLY || 
            (config.phase === MigrationPhase.HYBRID && config.syncDirection !== 'context_to_redux')) {
          dispatch({
            type: `${config.reduxSlice}/updateData`,
            payload: newData,
          });
        }
        // Context updates would need to be handled by the specific context implementation
      };
    },
  };
}

/**
 * Student Context Migration
 */
interface StudentContextState {
  selectedStudent: any;
  students: any[];
  loading: boolean;
  error: string | null;
}

const StudentContext = createContext<{
  state: StudentContextState;
  actions: {
    setSelectedStudent: (student: any) => void;
    setStudents: (students: any[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };
} | null>(null);

export const StudentContextProvider: React.FC<{
  children: React.ReactNode;
  migrationPhase?: MigrationPhase;
}> = ({ children, migrationPhase = MigrationPhase.CONTEXT_ONLY }) => {
  const [contextState, setContextState] = useState<StudentContextState>({
    selectedStudent: null,
    students: [],
    loading: false,
    error: null,
  });
  
  const dispatch = useDispatch<AppDispatch>();
  const reduxStudents = useSelector((state: RootState) => state.students);
  
  // Sync context with Redux based on migration phase
  useEffect(() => {
    if (migrationPhase === MigrationPhase.HYBRID) {
      // Sync Redux students to context
      if (reduxStudents.entities && Object.keys(reduxStudents.entities).length > 0) {
        const studentsArray = Object.values(reduxStudents.entities).filter(Boolean);
        setContextState(prev => ({
          ...prev,
          students: studentsArray,
          loading: reduxStudents.loading.list.isLoading,
          error: reduxStudents.loading.list.error?.message || null,
        }));
      }
    }
  }, [reduxStudents, migrationPhase]);
  
  const actions = {
    setSelectedStudent: (student: any) => {
      if (migrationPhase === MigrationPhase.REDUX_ONLY) {
        dispatch({ type: 'students/setSelected', payload: student });
      } else {
        setContextState(prev => ({ ...prev, selectedStudent: student }));
      }
    },
    setStudents: (students: any[]) => {
      if (migrationPhase === MigrationPhase.REDUX_ONLY) {
        dispatch({ type: 'students/setEntities', payload: students });
      } else {
        setContextState(prev => ({ ...prev, students }));
      }
    },
    setLoading: (loading: boolean) => {
      if (migrationPhase === MigrationPhase.REDUX_ONLY) {
        dispatch({ type: 'students/setLoading', payload: { operation: 'list', loading } });
      } else {
        setContextState(prev => ({ ...prev, loading }));
      }
    },
    setError: (error: string | null) => {
      if (migrationPhase === MigrationPhase.REDUX_ONLY) {
        dispatch({ type: 'students/setError', payload: { operation: 'list', error } });
      } else {
        setContextState(prev => ({ ...prev, error }));
      }
    },
  };
  
  // Determine which state to provide based on migration phase
  const effectiveState = migrationPhase === MigrationPhase.REDUX_ONLY 
    ? {
        selectedStudent: reduxStudents.selection.focusedId 
          ? reduxStudents.entities[reduxStudents.selection.focusedId] 
          : null,
        students: Object.values(reduxStudents.entities).filter(Boolean),
        loading: reduxStudents.loading.list.isLoading,
        error: reduxStudents.loading.list.error?.message || null,
      }
    : contextState;
  
  return (
    <StudentContext.Provider value={{ state: effectiveState, actions }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentContext must be used within StudentContextProvider');
  }
  return context;
};

/**
 * Medication Context Migration
 */
interface MedicationContextState {
  medications: any[];
  selectedMedication: any;
  loading: boolean;
  error: string | null;
}

const MedicationContext = createContext<{
  state: MedicationContextState;
  actions: {
    setMedications: (medications: any[]) => void;
    setSelectedMedication: (medication: any) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };
} | null>(null);

export const MedicationContextProvider: React.FC<{
  children: React.ReactNode;
  migrationPhase?: MigrationPhase;
}> = ({ children, migrationPhase = MigrationPhase.CONTEXT_ONLY }) => {
  const [contextState, setContextState] = useState<MedicationContextState>({
    medications: [],
    selectedMedication: null,
    loading: false,
    error: null,
  });
  
  const dispatch = useDispatch<AppDispatch>();
  const reduxMedications = useSelector((state: RootState) => state.medications);
  
  // Sync context with Redux
  useEffect(() => {
    if (migrationPhase === MigrationPhase.HYBRID || migrationPhase === MigrationPhase.REDUX_ONLY) {
      const medicationsArray = Object.values(reduxMedications.entities).filter(Boolean);
      setContextState(prev => ({
        ...prev,
        medications: medicationsArray,
        loading: reduxMedications.loading.list.isLoading,
        error: reduxMedications.loading.list.error?.message || null,
      }));
    }
  }, [reduxMedications, migrationPhase]);
  
  const actions = {
    setMedications: (medications: any[]) => {
      if (migrationPhase === MigrationPhase.REDUX_ONLY) {
        dispatch({ type: 'medications/setEntities', payload: medications });
      } else {
        setContextState(prev => ({ ...prev, medications }));
      }
    },
    setSelectedMedication: (medication: any) => {
      if (migrationPhase === MigrationPhase.REDUX_ONLY) {
        dispatch({ type: 'medications/setSelected', payload: medication });
      } else {
        setContextState(prev => ({ ...prev, selectedMedication: medication }));
      }
    },
    setLoading: (loading: boolean) => {
      if (migrationPhase === MigrationPhase.REDUX_ONLY) {
        dispatch({ type: 'medications/setLoading', payload: { operation: 'list', loading } });
      } else {
        setContextState(prev => ({ ...prev, loading }));
      }
    },
    setError: (error: string | null) => {
      if (migrationPhase === MigrationPhase.REDUX_ONLY) {
        dispatch({ type: 'medications/setError', payload: { operation: 'list', error } });
      } else {
        setContextState(prev => ({ ...prev, error }));
      }
    },
  };
  
  const effectiveState = migrationPhase === MigrationPhase.REDUX_ONLY 
    ? {
        medications: Object.values(reduxMedications.entities).filter(Boolean),
        selectedMedication: reduxMedications.selection.focusedId 
          ? reduxMedications.entities[reduxMedications.selection.focusedId] 
          : null,
        loading: reduxMedications.loading.list.isLoading,
        error: reduxMedications.loading.list.error?.message || null,
      }
    : contextState;
  
  return (
    <MedicationContext.Provider value={{ state: effectiveState, actions }}>
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedicationContext = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedicationContext must be used within MedicationContextProvider');
  }
  return context;
};

/**
 * Migration utilities
 */
export const migrationUtils = {
  /**
   * Create a migration-aware hook that works with both context and Redux
   */
  createMigrationHook: <T>(
    contextHook: () => T,
    reduxSelector: (state: RootState) => T,
    migrationPhase: MigrationPhase
  ) => {
    return () => {
      const contextValue = contextHook();
      const reduxValue = useSelector(reduxSelector);
      
      switch (migrationPhase) {
        case MigrationPhase.CONTEXT_ONLY:
          return contextValue;
        case MigrationPhase.REDUX_ONLY:
          return reduxValue;
        case MigrationPhase.HYBRID:
          // In hybrid mode, prefer Redux if available, fallback to context
          return reduxValue || contextValue;
        default:
          return contextValue;
      }
    };
  },
  
  /**
   * Validate migration phase configuration
   */
  validateMigrationConfig: (config: MigrationConfig): boolean => {
    if (!Object.values(MigrationPhase).includes(config.phase)) {
      console.error(`Invalid migration phase: ${config.phase}`);
      return false;
    }
    
    if (!config.contextName || !config.reduxSlice) {
      console.error('Context name and Redux slice are required');
      return false;
    }
    
    return true;
  },
  
  /**
   * Log migration status for debugging
   */
  logMigrationStatus: (contextName: string, phase: MigrationPhase, data: any) => {
    console.group(`[Migration] ${contextName}`);
    console.log('Phase:', phase);
    console.log('Data:', data);
    console.groupEnd();
  },
  
  /**
   * Create a wrapper component that provides migration context
   */
  createMigrationWrapper: <T>(
    ContextProvider: React.ComponentType<{ children: React.ReactNode; migrationPhase?: MigrationPhase }>,
    defaultPhase: MigrationPhase = MigrationPhase.CONTEXT_ONLY
  ) => {
    return ({ children, phase = defaultPhase }: { 
      children: React.ReactNode; 
      phase?: MigrationPhase;
    }) => {
      return (
        <ContextProvider migrationPhase={phase}>
          {children}
        </ContextProvider>
      );
    };
  },
};

/**
 * Migration monitoring and analytics
 */
export const migrationMonitoring = {
  /**
   * Track migration phase usage
   */
  trackPhaseUsage: (contextName: string, phase: MigrationPhase) => {
    // In production, this would send to analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('Migration Phase Used', {
        contextName,
        phase,
        timestamp: new Date().toISOString(),
      });
    }
  },
  
  /**
   * Monitor performance differences between phases
   */
  measurePerformance: (contextName: string, phase: MigrationPhase, operation: string) => {
    const startTime = performance.now();
    
    return {
      end: () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        console.log(`[Migration Performance] ${contextName}.${operation} (${phase}): ${duration.toFixed(2)}ms`);
        
        // In production, send to monitoring service
        if (typeof window !== 'undefined' && (window as any).monitoring) {
          (window as any).monitoring.timing('migration.performance', duration, {
            contextName,
            phase,
            operation,
          });
        }
      },
    };
  },
  
  /**
   * Detect and report migration issues
   */
  reportIssue: (contextName: string, issue: string, details?: any) => {
    console.error(`[Migration Issue] ${contextName}: ${issue}`, details);
    
    // In production, send to error tracking
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(new Error(`Migration Issue: ${issue}`), {
        tags: { contextName, type: 'migration' },
        extra: details,
      });
    }
  },
};

/**
 * Testing utilities for migration
 */
export const migrationTestUtils = {
  /**
   * Create mock providers for testing
   */
  createMockProvider: (initialState: any, phase: MigrationPhase) => {
    return ({ children }: { children: React.ReactNode }) => {
      const [state, setState] = useState(initialState);
      
      const mockContext = {
        state,
        actions: {
          setState,
        },
      };
      
      return (
        <div data-testid={`mock-provider-${phase}`}>
          {children}
        </div>
      );
    };
  },
  
  /**
   * Verify migration phase behavior
   */
  verifyMigrationBehavior: (
    contextValue: any,
    reduxValue: any,
    phase: MigrationPhase,
    expectedValue: any
  ) => {
    let actualValue;
    
    switch (phase) {
      case MigrationPhase.CONTEXT_ONLY:
        actualValue = contextValue;
        break;
      case MigrationPhase.REDUX_ONLY:
        actualValue = reduxValue;
        break;
      case MigrationPhase.HYBRID:
        actualValue = reduxValue || contextValue;
        break;
    }
    
    return JSON.stringify(actualValue) === JSON.stringify(expectedValue);
  },
};

/**
 * Migration configuration management
 */
export class MigrationConfigManager {
  private configs: Map<string, MigrationConfig> = new Map();
  
  register(config: MigrationConfig) {
    if (migrationUtils.validateMigrationConfig(config)) {
      this.configs.set(config.contextName, config);
      migrationMonitoring.trackPhaseUsage(config.contextName, config.phase);
    }
  }
  
  getConfig(contextName: string): MigrationConfig | undefined {
    return this.configs.get(contextName);
  }
  
  updatePhase(contextName: string, newPhase: MigrationPhase) {
    const config = this.configs.get(contextName);
    if (config) {
      config.phase = newPhase;
      migrationMonitoring.trackPhaseUsage(contextName, newPhase);
    }
  }
  
  getAllConfigs(): MigrationConfig[] {
    return Array.from(this.configs.values());
  }
  
  getPhaseDistribution(): Record<MigrationPhase, number> {
    const distribution = {
      [MigrationPhase.CONTEXT_ONLY]: 0,
      [MigrationPhase.HYBRID]: 0,
      [MigrationPhase.REDUX_ONLY]: 0,
    };
    
    this.configs.forEach(config => {
      distribution[config.phase]++;
    });
    
    return distribution;
  }
}

// Global migration config manager instance
export const migrationManager = new MigrationConfigManager();
