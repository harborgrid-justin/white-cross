#!/bin/bash

# Bash script to update import paths to use @services alias

ROOT_PATH="/workspaces/white-cross/backend/src"

# Function to update imports in a file
update_imports() {
    local file="$1"
    local updated=false

    # Replace '../../../services/' with '@services/'
    if grep -q "../../../services/" "$file"; then
        sed -i "s|../../../services/|@services/|g" "$file"
        updated=true
        echo "Updated ../../../services/ to @services/ in $file"
    fi

    # Replace '../../services/' with '@services/'
    if grep -q "../../services/" "$file"; then
        sed -i "s|../../services/|@services/|g" "$file"
        updated=true
        echo "Updated ../../services/ to @services/ in $file"
    fi

    # Replace '../services/' with '@services/'
    if grep -q "../services/" "$file"; then
        sed -i "s|../services/|@services/|g" "$file"
        updated=true
        echo "Updated ../services/ to @services/ in $file"
    fi

    # Replace './services/' with '@services/'
    if grep -q "./services/" "$file"; then
        sed -i "s|./services/|@services/|g" "$file"
        updated=true
        echo "Updated ./services/ to @services/ in $file"
    fi
}

# Find all TypeScript files, excluding node_modules
find "$ROOT_PATH" -name "*.ts" -not -path "*/node_modules/*" | while read -r file; do
    update_imports "$file"
done

echo "Import path update to @services alias completed."