/**
 * Emergency Training Type Definitions
 *
 * Type definitions for emergency training including training programs,
 * certifications, modules, and assessments.
 *
 * @module hooks/domains/emergency/types/emergencyTrainingTypes
 */

import type { EmergencyUser } from './emergencyUserTypes';
import type { IncidentLocation } from './emergencyIncidentTypes';

export interface EmergencyTraining {
  id: string;
  title: string;
  description: string;
  type: 'ORIENTATION' | 'DRILL' | 'TABLETOP' | 'FULL_SCALE' | 'CERTIFICATION';
  category: string;
  duration: number; // minutes
  frequency: TrainingFrequency;
  requiredFor: string[]; // roles
  prerequisites: string[];
  objectives: string[];
  curriculum: TrainingModule[];
  instructor?: EmergencyUser;
  location?: IncidentLocation;
  maxParticipants?: number;
  materials: TrainingMaterial[];
  assessments: TrainingAssessment[];
  certificationRequired: boolean;
  certificationValidity?: number; // months
  isActive: boolean;
  createdBy: EmergencyUser;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingFrequency {
  type: 'ONE_TIME' | 'RECURRING';
  interval?: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  intervalCount?: number;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  topics: string[];
  activities: TrainingActivity[];
}

export interface TrainingActivity {
  id: string;
  name: string;
  type: 'LECTURE' | 'DEMO' | 'EXERCISE' | 'DISCUSSION' | 'SIMULATION';
  duration: number;
  description: string;
  materials: string[];
}

export interface TrainingMaterial {
  id: string;
  name: string;
  type: 'DOCUMENT' | 'VIDEO' | 'PRESENTATION' | 'HANDBOOK' | 'CHECKLIST';
  url: string;
  description?: string;
}

export interface TrainingAssessment {
  id: string;
  name: string;
  type: 'QUIZ' | 'PRACTICAL' | 'OBSERVATION' | 'CERTIFICATION';
  passingScore: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'PRACTICAL';
  options?: string[];
  correctAnswer: string;
  points: number;
}
