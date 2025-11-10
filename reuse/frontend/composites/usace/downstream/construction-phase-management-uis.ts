/**
 * LOC: USACE-CONSTR-PHASE-001
 * File: /reuse/frontend/composites/usace/downstream/construction-phase-management-uis.ts
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTracking } from '../../analytics-tracking-kit';
import {
  useConstructionPhaseManagement,
  type ConstructionPhase,
} from '../usace-construction-projects-composites';

export function usePhaseManagementUI(projectId: string) {
  const {
    currentPhase,
    phaseHistory,
    transitionPhase,
    validatePhaseTransition,
  } = useConstructionPhaseManagement(projectId);
  
  const [showPhaseTransitionModal, setShowPhaseTransitionModal] = useState(false);
  const [targetPhase, setTargetPhase] = useState<ConstructionPhase | null>(null);
  const [phaseCompletionChecklist, setPhaseCompletionChecklist] = useState<any[]>([]);
  const { track } = useTracking();

  const phaseDefinitions = useMemo(() => ({
    'initiation': {
      name: 'Project Initiation',
      description: 'DD Form 1391 preparation and approval',
      requiredDocuments: ['DD1391', 'Project Justification'],
      typicalDuration: 90,
    },
    'planning': {
      name: 'Planning',
      description: 'Preliminary design and planning',
      requiredDocuments: ['Project Management Plan'],
      typicalDuration: 180,
    },
    'design_35': {
      name: '35% Design',
      description: '35% design completion',
      requiredDocuments: ['Design Submission'],
      typicalDuration: 60,
    },
    'design_65': {
      name: '65% Design',
      description: '65% design completion',
      requiredDocuments: ['Design Submission'],
      typicalDuration: 60,
    },
    'design_95': {
      name: '95% Design',
      description: '95% design completion',
      requiredDocuments: ['Design Submission'],
      typicalDuration: 30,
    },
    'design_100': {
      name: '100% Design',
      description: 'Final design completion',
      requiredDocuments: ['Final Design Package'],
      typicalDuration: 30,
    },
    'pre_construction': {
      name: 'Pre-Construction',
      description: 'Award contract and mobilization',
      requiredDocuments: ['Contract Award', 'Pre-Construction Meeting Minutes'],
      typicalDuration: 90,
    },
    'construction': {
      name: 'Construction',
      description: 'Active construction phase',
      requiredDocuments: ['Daily Reports', 'Progress Photos'],
      typicalDuration: 365,
    },
    'substantial_completion': {
      name: 'Substantial Completion',
      description: 'Construction substantially complete',
      requiredDocuments: ['Substantial Completion Certificate'],
      typicalDuration: 30,
    },
    'final_completion': {
      name: 'Final Completion',
      description: 'All work complete, punch list closed',
      requiredDocuments: ['Final Completion Certificate'],
      typicalDuration: 60,
    },
    'closeout': {
      name: 'Project Closeout',
      description: 'Final documentation and closeout',
      requiredDocuments: ['As-Built Drawings', 'O&M Manuals', 'Warranty Documents'],
      typicalDuration: 90,
    },
    'warranty': {
      name: 'Warranty Period',
      description: 'Warranty monitoring and claims',
      requiredDocuments: ['Warranty Tracking Log'],
      typicalDuration: 365,
    },
  }), []);

  const currentPhaseInfo = useMemo(() => {
    return phaseDefinitions[currentPhase];
  }, [currentPhase, phaseDefinitions]);

  const initiatePhaseTransition = useCallback((newPhase: ConstructionPhase) => {
    track('phase_transition_initiate', { project_id: projectId, from: currentPhase, to: newPhase });
    
    if (!validatePhaseTransition(currentPhase, newPhase)) {
      alert('Invalid phase transition');
      return;
    }
    
    setTargetPhase(newPhase);
    
    const checklist = phaseDefinitions[currentPhase]?.requiredDocuments.map(doc => ({
      id: `doc_${doc}`,
      document: doc,
      completed: false,
    })) || [];
    
    setPhaseCompletionChecklist(checklist);
    setShowPhaseTransitionModal(true);
  }, [projectId, currentPhase, phaseDefinitions, validatePhaseTransition, track]);

  const completeChecklistItem = useCallback((itemId: string) => {
    track('phase_checklist_complete', { item_id: itemId });
    setPhaseCompletionChecklist(prev =>
      prev.map(item => item.id === itemId ? { ...item, completed: true } : item)
    );
  }, [track]);

  const confirmPhaseTransition = useCallback(() => {
    if (!targetPhase) return;
    
    const allCompleted = phaseCompletionChecklist.every(item => item.completed);
    if (!allCompleted) {
      alert('Please complete all checklist items before transitioning');
      return;
    }
    
    track('phase_transition_confirm', { project_id: projectId, to: targetPhase });
    transitionPhase(targetPhase, 'current_user');
    setShowPhaseTransitionModal(false);
    setTargetPhase(null);
  }, [projectId, targetPhase, phaseCompletionChecklist, transitionPhase, track]);

  const phaseProgress = useMemo(() => {
    const phases: ConstructionPhase[] = [
      'initiation', 'planning', 'design_35', 'design_65', 'design_95', 'design_100',
      'pre_construction', 'construction', 'substantial_completion', 'final_completion',
      'closeout', 'warranty'
    ];
    
    const currentIndex = phases.indexOf(currentPhase);
    return {
      currentIndex,
      totalPhases: phases.length,
      percentComplete: ((currentIndex + 1) / phases.length) * 100,
      completedPhases: phases.slice(0, currentIndex + 1),
      upcomingPhases: phases.slice(currentIndex + 1),
    };
  }, [currentPhase]);

  return {
    currentPhase,
    currentPhaseInfo,
    phaseHistory,
    phaseProgress,
    phaseDefinitions,
    showPhaseTransitionModal,
    setShowPhaseTransitionModal,
    targetPhase,
    phaseCompletionChecklist,
    initiatePhaseTransition,
    completeChecklistItem,
    confirmPhaseTransition,
  };
}

export function usePhaseTimeline(projectId: string) {
  const { phaseHistory } = useConstructionPhaseManagement(projectId);
  const { track } = useTracking();

  const timeline = useMemo(() => {
    return phaseHistory.map((phase, index) => ({
      ...phase,
      duration: index > 0 ?
        (phase.date.getTime() - phaseHistory[index - 1].date.getTime()) / (1000 * 60 * 60 * 24)
        : 0,
    }));
  }, [phaseHistory]);

  const exportTimeline = useCallback((format: 'pdf' | 'excel') => {
    track('phase_timeline_export', { project_id: projectId, format });
    return `phase_timeline_${projectId}.${format}`;
  }, [projectId, track]);

  return { timeline, exportTimeline };
}

export default {
  usePhaseManagementUI,
  usePhaseTimeline,
};
