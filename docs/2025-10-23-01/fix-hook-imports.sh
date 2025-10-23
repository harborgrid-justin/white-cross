#!/bin/bash

# Create missing page-level hooks directories and files
for page in admin health medications; do
  mkdir -p "src/pages/$page/hooks"
  
  # Create stub hook files based on what's being imported
  if [ "$page" = "admin" ]; then
    if [ ! -f "src/pages/$page/hooks/useInventoryData.ts" ]; then
      cat > "src/pages/$page/hooks/useInventoryData.ts" << 'HOOKEOF'
/**
 * useInventoryData hook
 */
export const useInventoryData = () => {
  return {
    data: [],
    isLoading: false,
    error: null,
  };
};
HOOKEOF
    fi
    
    if [ ! -f "src/pages/$page/hooks/useInventoryFilters.ts" ]; then
      cat > "src/pages/$page/hooks/useInventoryFilters.ts" << 'HOOKEOF'
/**
 * useInventoryFilters hook
 */
export const useInventoryFilters = () => {
  return {
    filters: {},
    setFilters: () => {},
  };
};
HOOKEOF
    fi
  fi
  
  if [ "$page" = "health" ]; then
    if [ ! -f "src/pages/$page/hooks/useAppointmentsData.ts" ]; then
      cat > "src/pages/$page/hooks/useAppointmentsData.ts" << 'HOOKEOF'
/**
 * useAppointmentsData hook
 */
export const useAppointmentsData = () => {
  return {
    appointments: [],
    isLoading: false,
    error: null,
  };
};
HOOKEOF
    fi
    
    if [ ! -f "src/pages/$page/hooks/useHealthRecordsPageData.ts" ]; then
      cat > "src/pages/$page/hooks/useHealthRecordsPageData.ts" << 'HOOKEOF'
/**
 * useHealthRecordsPageData hook
 */
export const useHealthRecordsPageData = () => {
  return {
    records: [],
    isLoading: false,
    error: null,
  };
};
HOOKEOF
    fi
  fi
  
  if [ "$page" = "medications" ]; then
    if [ ! -f "src/pages/$page/hooks/useMedicationsData.ts" ]; then
      cat > "src/pages/$page/hooks/useMedicationsData.ts" << 'HOOKEOF'
/**
 * useMedicationsData hook
 */
export const useMedicationsData = () => {
  return {
    medications: [],
    isLoading: false,
    error: null,
  };
};
HOOKEOF
    fi
  fi
done

# Fix domain hooks imports - these should use @/hooks/domains
sed -i "s|from '\.\./\.\./\.\./\.\./hooks/domains/medications'|from '@/hooks/domains/medications'|g" src/pages/medications/components/AdverseReactionsTab.tsx
sed -i "s|from '\.\./\.\./\.\./\.\./hooks/domains/medications'|from '@/hooks/domains/medications'|g" src/pages/medications/components/InventoryTab.tsx
sed -i "s|from '\.\./\.\./\.\./\.\./hooks/domains/medications'|from '@/hooks/domains/medications'|g" src/pages/medications/components/MedicationsTab.tsx
sed -i "s|from '\.\./\.\./\.\./\.\./hooks/domains/medications'|from '@/hooks/domains/medications'|g" src/pages/medications/components/RemindersTab.tsx

# Even deeper paths
sed -i "s|from '\.\./\.\./\.\./\.\./\.\./\.\./hooks/domains/inventory'|from '@/hooks/domains/inventory'|g" src/pages/medications/components/tabs/MedicationsInventoryTab.tsx
sed -i "s|from '\.\./\.\./\.\./\.\./\.\./\.\./hooks/domains/medications'|from '@/hooks/domains/medications'|g" src/pages/medications/components/tabs/MedicationsListTab.tsx
sed -i "s|from '\.\./\.\./\.\./\.\./\.\./\.\./hooks/domains/students'|from '@/hooks/domains/students'|g" src/pages/medications/components/tabs/MedicationsListTab.tsx

# Fix utilities hooks
sed -i "s|from '\.\./\.\./\.\./\.\./hooks/utilities'|from '@/hooks/utilities'|g" src/pages/medications/components/RemindersTab.tsx

echo "Fixed hook imports and created missing hook files"
