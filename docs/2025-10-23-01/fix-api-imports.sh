#!/bin/bash

# Fix services/api imports to use @/services/core/ApiClient
sed -i "s|from '\.\./\.\./services/api'|from '@/services/core/ApiClient'|g" src/pages/appointments/store/appointmentsSlice.ts
sed -i "s|from '\.\./\.\./services/api'|from '@/services/core/ApiClient'|g" src/pages/medications/store/medicationsSlice.ts  
sed -i "s|from '\.\./\.\./services/api'|from '@/services/core/ApiClient'|g" src/pages/students/store/studentsSlice.ts
sed -i "s|from '\.\./\.\./services/api'|from '@/services/core/ApiClient'|g" src/pages/students/store/emergencyContactsSlice.ts
sed -i "s|from '\.\./\.\./services/api'|from '@/services/core/ApiClient'|g" src/pages/students/store/healthRecordsSlice.ts

# Fix longer path variants
sed -i "s|from '\.\./\.\./\.\./\.\./services/api'|from '@/services/core/ApiClient'|g" src/pages/students/components/StudentHealthRecord.tsx
sed -i "s|from '\.\./\.\./\.\./\.\./services/api'|from '@/services/core/ApiClient'|g" src/pages/students/components/StudentSelector.tsx

# Fix very long path
sed -i "s|from '\.\./\.\./\.\./\.\./\.\./\.\./services/api'|from '@/services/core/ApiClient'|g" src/stores/shared/api/tanstackIntegration.ts

# Fix services/reportsApi
sed -i "s|from '\.\./\.\./services/reportsApi'|from '@/services/modules/reportsApi'|g" src/pages/admin/Reports.tsx

# Fix health module API imports
sed -i "s|from '\.\./\.\./services/modules/health/appointmentsApi'|from '@/services/modules/appointmentsApi'|g" src/pages/appointments/AppointmentSchedule.tsx
sed -i "s|from '\.\./\.\./services/modules/health/studentsApi'|from '@/services/modules/studentsApi'|g" src/pages/appointments/AppointmentSchedule.tsx

echo "Fixed all API imports"
