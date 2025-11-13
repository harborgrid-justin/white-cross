#!/bin/bash

# Bash script to update import paths for folders moved to services/

ROOT_PATH="/workspaces/white-cross/backend/src"

# Folders that were moved to services/
MOVED_FOLDERS=("clinical" "communication" "student" "user" "allergy" "chronic-condition" "academic-transcript" "administration" "access-control" "mobile" "workers" "audit" "security")

# Function to update imports in a file
update_imports() {
    local file="$1"
    local updated=false

    for folder in "${MOVED_FOLDERS[@]}"; do
        # Pattern for imports like '../../clinical/'
        local old_pattern="../../$folder/"
        local new_pattern="../../../services/$folder/"

        if grep -q "$old_pattern" "$file"; then
            sed -i "s|$old_pattern|$new_pattern|g" "$file"
            updated=true
            echo "Updated import in $file : $old_pattern -> $new_pattern"
        fi
    done

    if [ "$updated" = true ]; then
        echo "Updated $file"
    fi
}

# Find all TypeScript files, excluding node_modules
find "$ROOT_PATH" -name "*.ts" -not -path "*/node_modules/*" | while read -r file; do
    update_imports "$file"
done

echo "Import path update completed."