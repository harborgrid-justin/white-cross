#!/bin/bash

# Script to fix all incorrect import paths for common/base module
echo "Fixing import paths for common/base module..."

# Fix different directory levels to use correct relative path
# For files in src/ root (1 level deep) - need ../common/base
sed -i "s|from '../../common/base'|from '../common/base'|g" src/*.ts 2>/dev/null || true

# For files in src/[module]/ (2 levels deep) - need ../common/base  
find src -maxdepth 2 -name "*.ts" -exec sed -i "s|from '../../common/base'|from '../common/base'|g" {} \; 2>/dev/null || true

# For files in src/[module]/[subdir]/ (3 levels deep) - need ../../common/base
find src -mindepth 3 -name "*.ts" -exec sed -i "s|from '../../../common/base'|from '../../common/base'|g" {} \; 2>/dev/null || true

# For files in src/[module]/[subdir]/[subsubdir]/ (4 levels deep) - need ../../../common/base
find src -mindepth 4 -name "*.ts" -exec sed -i "s|from '../../../../common/base'|from '../../../common/base'|g" {} \; 2>/dev/null || true

# Special case: Fix any remaining incorrect paths that we've already identified
sed -i "s|from '../../shared/base/BaseService'|from '../common/base'|g" src/infrastructure/monitoring/sentry.service.ts 2>/dev/null || true

echo "Import path fixes completed."