#!/bin/bash

# Fix ProtectedRoute imports
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "s|from '\.\./\.\./components/auth/ProtectedRoute'|from '@/components/auth/ProtectedRoute'|g"

# Fix health records component imports - these are in the wrong location
# They should be under @/components/features/health-records
sed -i "s|from '\.\./\.\./components/healthRecords/shared/StatsCard'|from '@/components/features/health-records/components/shared/StatsCard'|g" src/pages/health/HealthRecords.tsx
sed -i "s|from '\.\./\.\./components/healthRecords/shared/TabNavigation'|from '@/components/features/health-records/components/shared/TabNavigation'|g" src/pages/health/HealthRecords.tsx
sed -i "s|from '\.\./\.\./components/healthRecords/tabs/OverviewTab'|from '@/components/features/health-records/components/tabs/OverviewTab'|g" src/pages/health/HealthRecords.tsx
sed -i "s|from '\.\./\.\./components/healthRecords/tabs/RecordsTab'|from '@/components/features/health-records/components/tabs/RecordsTab'|g" src/pages/health/HealthRecords.tsx
sed -i "s|from '\.\./\.\./components/healthRecords/tabs/AllergiesTab'|from '@/components/features/health-records/components/tabs/AllergiesTab'|g" src/pages/health/HealthRecords.tsx
sed -i "s|from '\.\./\.\./components/healthRecords/tabs/ChronicConditionsTab'|from '@/components/features/health-records/components/tabs/ChronicConditionsTab'|g" src/pages/health/HealthRecords.tsx
sed -i "s|from '\.\./\.\./components/healthRecords/tabs/VaccinationsTab'|from '@/components/features/health-records/components/tabs/VaccinationsTab'|g" src/pages/health/HealthRecords.tsx
sed -i "s|from '\.\./\.\./components/healthRecords/tabs/GrowthChartsTab'|from '@/components/features/health-records/components/tabs/GrowthChartsTab'|g" src/pages/health/HealthRecords.tsx
sed -i "s|from '\.\./\.\./components/healthRecords/tabs/ScreeningsTab'|from '@/components/features/health-records/components/tabs/ScreeningsTab'|g" src/pages/health/HealthRecords.tsx
sed -i "s|from '\.\./\.\./components/healthRecords/tabs/AnalyticsTab'|from '@/components/features/health-records/components/tabs/AnalyticsTab'|g" src/pages/health/HealthRecords.tsx

# Fix StudentSelector - check if it exists in components root
sed -i "s|from '\.\./\.\./components/StudentSelector'|from '@/components/shared/StudentSelector'|g" src/pages/health/HealthRecords.tsx

# Fix appointment form modal
sed -i "s|from '\.\./\.\./components/features/appointments/components/AppointmentFormModal'|from '@/pages/appointments/components/AppointmentFormModal'|g" src/pages/health/Appointments.tsx

# Fix dashboard store import
sed -i "s|from '\.\./\.\./\.\./store'|from '@/stores/reduxStore'|g" src/pages/dashboard/components/DashboardOverview.tsx

echo "Fixed component imports phase 1"
