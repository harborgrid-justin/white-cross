/**
 * Health Records Feature Components
 * 
 * All components related to health records management functionality.
 */

// Error Boundary
export { HealthRecordsErrorBoundary } from './components/HealthRecordsErrorBoundary'

// Health Records Specific Shared Components
// TODO: Create these shared components when needed
// export { StatsCard as HealthRecordsStatsCard } from './components/shared/StatsCard'
// export { TabNavigation as HealthRecordsTabNavigation } from './components/shared/TabNavigation'
// export { SearchAndFilter as HealthRecordsSearchAndFilter } from './components/shared/SearchAndFilter'
// export { ActionButtons as HealthRecordsActionButtons } from './components/shared/ActionButtons'

// Tab Components
export { OverviewTab } from './components/tabs/OverviewTab'
export { RecordsTab } from './components/tabs/RecordsTab'
export { VaccinationsTab } from './components/tabs/VaccinationsTab'
export { AllergiesTab } from './components/tabs/AllergiesTab'
export { GrowthChartsTab } from './components/tabs/GrowthChartsTab'
export { ScreeningsTab } from './components/tabs/ScreeningsTab'
export { VitalsTab } from './components/tabs/VitalsTab'
export { ChronicConditionsTab } from './components/tabs/ChronicConditionsTab'
export { AnalyticsTab } from './components/tabs/AnalyticsTab'

// Modal Components
export { HealthRecordModal } from './components/modals/HealthRecordModal'
export { default as AllergyModal } from './components/modals/AllergyModal'
export { default as CarePlanModal } from './components/modals/CarePlanModal'
export { default as ConditionModal } from './components/modals/ConditionModal'
export { default as ConfirmationModal } from './components/modals/ConfirmationModal'
export { default as DetailsModal } from './components/modals/DetailsModal'
export { default as MeasurementModal } from './components/modals/MeasurementModal'
export { default as VaccinationModal } from './components/modals/VaccinationModal'