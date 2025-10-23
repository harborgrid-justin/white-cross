#!/bin/bash

# Fix @/types/entityTypes
sed -i "s|from '@/types/entityTypes'|from '@/types/common'|g" src/hooks/shared/store-hooks-index.ts

# Fix local ./types imports in pages
# For pages that don't have types files, comment out or create stub files
# Let's check which ones exist first

# Fix student.types imports
sed -i "s|from '\.\./\.\./types/student.types'|from '@/types/students'|g" src/pages/appointments/store/appointmentsSlice.ts
sed -i "s|from '\.\./\.\./types/student.types'|from '@/types/students'|g" src/pages/medications/store/medicationsSlice.ts
sed -i "s|from '\.\./\.\./types/student.types'|from '@/types/students'|g" src/pages/students/store/emergencyContactsSlice.ts
sed -i "s|from '\.\./\.\./types/student.types'|from '@/types/students'|g" src/pages/students/store/healthRecordsSlice.ts
sed -i "s|from '\.\./\.\./types/student.types'|from '@/types/students'|g" src/pages/students/store/studentsSlice.ts

# Fix medication.types imports
sed -i "s|from '\.\./\.\./\.\./types/medication.types'|from '@/types/medications'|g" src/pages/medications/components/MedicationCard.tsx

# Fix generic types imports
sed -i "s|from '\.\./\.\./\.\./\.\./types'|from '@/types'|g" src/pages/medications/components/MedicationsTab.tsx
sed -i "s|from '\.\./\.\./\.\./\.\./types/api'|from '@/types/api'|g" src/pages/medications/components/AdverseReactionsTab.tsx
sed -i "s|from '\.\./\.\./\.\./\.\./types/api'|from '@/types/api'|g" src/pages/medications/components/InventoryTab.tsx
sed -i "s|from '\.\./\.\./\.\./\.\./types/api'|from '@/types/api'|g" src/pages/medications/components/RemindersTab.tsx
sed -i "s|from '\.\./\.\./\.\./\.\./types/medications'|from '@/types/medications'|g" src/pages/medications/components/OverviewTab.tsx

# Fix incidents types
sed -i "s|from '\.\./\.\./types/incidents'|from '@/types/incidents'|g" src/pages/incidents/store/incidentReportsSlice.ts

# Fix service types
sed -i "s|from '\.\./\.\./types/administration.types'|from '@/types/administration'|g" src/services/modules/AdministrationService.ts
sed -i "s|from '\.\./types/documents'|from '@/types/documents'|g" src/services/modules/documentsApi.ts

echo "Fixed type imports"
