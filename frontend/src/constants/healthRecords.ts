/**
 * WF-COMP-107 | healthRecords.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { 
  FileText, 
  Heart, 
  Shield, 
  TrendingUp, 
  AlertCircle, 
  Stethoscope, 
  Eye, 
  Ear, 
  Activity 
} from 'lucide-react'
import type { TabType, HealthRecordType } from '@/types/healthRecords'

export const RECORD_TYPES = [
  { value: 'CHECKUP' as HealthRecordType, label: 'Regular Checkup', icon: Stethoscope },
  { value: 'VACCINATION' as HealthRecordType, label: 'Vaccination', icon: Shield },
  { value: 'ILLNESS' as HealthRecordType, label: 'Illness', icon: AlertCircle },
  { value: 'INJURY' as HealthRecordType, label: 'Injury', icon: Activity },
  { value: 'SCREENING' as HealthRecordType, label: 'Screening', icon: Eye },
  { value: 'VISION' as HealthRecordType, label: 'Vision Test', icon: Eye },
  { value: 'HEARING' as HealthRecordType, label: 'Hearing Test', icon: Ear },
  { value: 'PHYSICAL_EXAM' as HealthRecordType, label: 'Physical Exam', icon: Stethoscope },
]

export const HEALTH_TABS = [
  { id: 'overview' as TabType, label: 'Overview', icon: FileText },
  { id: 'records' as TabType, label: 'Health Records', icon: FileText },
  { id: 'allergies' as TabType, label: 'Allergies', icon: AlertCircle },
  { id: 'chronic' as TabType, label: 'Chronic Conditions', icon: Heart },
  { id: 'vaccinations' as TabType, label: 'Vaccinations', icon: Shield },
  { id: 'growth' as TabType, label: 'Growth Charts', icon: TrendingUp },
  { id: 'screenings' as TabType, label: 'Screenings', icon: Eye },
]

export const SEVERITY_LEVELS = [
  { value: 'MILD', label: 'Mild', color: 'green' },
  { value: 'MODERATE', label: 'Moderate', color: 'yellow' },
  { value: 'SEVERE', label: 'Severe', color: 'orange' },
  { value: 'LIFE_THREATENING', label: 'Life Threatening', color: 'red' },
] as const

export const CONDITION_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active', color: 'green' },
  { value: 'MANAGED', label: 'Managed', color: 'blue' },
  { value: 'IN_REMISSION', label: 'In Remission', color: 'blue' },
  { value: 'RESOLVED', label: 'Resolved', color: 'gray' },
  { value: 'UNDER_OBSERVATION', label: 'Under Observation', color: 'yellow' },
] as const

export const ALLERGY_TYPES = [
  { value: 'MEDICATION', label: 'Medication' },
  { value: 'FOOD', label: 'Food' },
  { value: 'ENVIRONMENTAL', label: 'Environmental' },
  { value: 'INSECT', label: 'Insect' },
  { value: 'LATEX', label: 'Latex' },
  { value: 'OTHER', label: 'Other' },
] as const

export const VACCINATION_PRIORITIES = [
  { value: 'High', label: 'High', color: 'red' },
  { value: 'Medium', label: 'Medium', color: 'yellow' },
  { value: 'Low', label: 'Low', color: 'green' },
] as const

export const EXPORT_FORMATS = [
  { value: 'CSV', label: 'CSV' },
  { value: 'PDF', label: 'PDF' },
  { value: 'Excel', label: 'Excel' },
] as const

export const REPORT_TYPES = [
  { value: 'Summary', label: 'Summary' },
  { value: 'Comprehensive', label: 'Comprehensive' },
  { value: 'Compliance', label: 'Compliance' },
] as const

export const REMINDER_METHODS = [
  { value: 'Email', label: 'Email' },
  { value: 'SMS', label: 'SMS' },
  { value: 'Both', label: 'Both' },
] as const

export const GROWTH_CHART_TYPES = [
  { value: 'Height', label: 'Height' },
  { value: 'Weight', label: 'Weight' },
  { value: 'BMI', label: 'BMI' },
  { value: 'Head Circumference', label: 'Head Circumference' },
] as const