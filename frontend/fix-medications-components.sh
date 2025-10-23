#!/bin/bash

# Create stub component function
create_stub_component() {
  local file_path="$1"
  local component_name="$2"
  
  cat > "$file_path" << COMPEOF
/**
 * $component_name
 * Placeholder component
 */

import React from 'react';

export const $component_name: React.FC = () => {
  return <div>$component_name - To be implemented</div>;
};

export default $component_name;
COMPEOF
}

# Create health/medications page components
mkdir -p src/pages/health/components
create_stub_component "src/pages/health/components/MedicationsHeader.tsx" "MedicationsHeader"
create_stub_component "src/pages/health/components/MedicationsTabs.tsx" "MedicationsTabs"
create_stub_component "src/pages/health/components/AddMedicationModal.tsx" "AddMedicationModal"
create_stub_component "src/pages/health/components/MedicationDetailsModal.tsx" "MedicationDetailsModal"

# Create medications feature components  
mkdir -p src/components/medications/tabs
create_stub_component "src/components/medications/tabs/MedicationsOverviewTab.tsx" "MedicationsOverviewTab"
create_stub_component "src/components/medications/tabs/MedicationsListTab.tsx" "MedicationsListTab"
create_stub_component "src/components/medications/tabs/MedicationsInventoryTab.tsx" "MedicationsInventoryTab"
create_stub_component "src/components/medications/tabs/MedicationsRemindersTab.tsx" "MedicationsRemindersTab"
create_stub_component "src/components/medications/tabs/MedicationsAdverseReactionsTab.tsx" "MedicationsAdverseReactionsTab"

# Create medications page components
create_stub_component "src/pages/medications/components/MedicationForm.tsx" "MedicationForm"

# Fix relative imports that are looking for ../../.. (going up to src)
sed -i "s|from '\.\./\.\./\.\./\.\./utils/medications'|from '@/utils/medications'|g" src/pages/medications/components/AdverseReactionsTab.tsx
sed -i "s|from '\.\./\.\./\.\./\.\./utils/medications'|from '@/utils/medications'|g" src/pages/medications/components/InventoryTab.tsx

# Fix ui/feedback imports
sed -i "s|from '\.\./\.\./\.\./ui/feedback'|from '@/components/ui/feedback'|g" src/pages/medications/components/AdverseReactionsTab.tsx

# Fix the mysterious '../../../' imports
sed -i "s|from '\.\./\.\./\.\./'|from '@/components'|g" src/pages/medications/components/InventoryTab.tsx
sed -i "s|from '\.\./\.\./\.\./'|from '@/components'|g" src/pages/medications/components/MedicationsTab.tsx
sed -i "s|from '\.\./\.\./\.\./'|from '@/components'|g" src/pages/medications/components/RemindersTab.tsx

echo "Fixed medications components"
