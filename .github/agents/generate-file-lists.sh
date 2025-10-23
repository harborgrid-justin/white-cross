#!/bin/bash

# JSDoc Generation - File List Generator
# This script generates organized file lists for each agent to process

set -e

FRONTEND_SRC="frontend/src"
OUTPUT_DIR=".github/agents/file-lists"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "Generating file lists for JSDoc agents..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to count and save files
generate_list() {
    local name=$1
    local subdir=$2
    local output="$OUTPUT_DIR/${name}-files.txt"
    
    echo -e "${BLUE}Processing: ${name}${NC}"
    
    # Find files matching pattern, exclude tests and node_modules
    if [ -d "$FRONTEND_SRC/$subdir" ]; then
        find "$FRONTEND_SRC/$subdir" -type f \( -name "*.ts" -o -name "*.tsx" \) \
            ! -path "*/node_modules/*" \
            ! -path "*/__tests__/*" \
            ! -name "*.test.ts" \
            ! -name "*.test.tsx" \
            ! -name "*.spec.ts" \
            ! -name "*.spec.tsx" \
            | sort > "$output"
    else
        touch "$output"
    fi
    
    local count=$(wc -l < "$output")
    echo -e "${GREEN}Found ${count} files → ${output}${NC}"
    echo ""
}

# 1. Components Agent Files
echo "=== Components Agent ==="
generate_list "components" "components"
generate_list "pages" "pages"

# 2. Services Agent Files  
echo "=== Services Agent ==="
generate_list "services" "services"
generate_list "middleware" "middleware"

# 3. Stores Agent Files
echo "=== Stores Agent ==="
generate_list "stores" "stores"

# 4. Types Agent Files
echo "=== Types Agent ==="
generate_list "types" "types"
generate_list "schemas" "schemas"
generate_list "validation" "validation"

# 5. Hooks and Utils Agent Files
echo "=== Hooks and Utils Agent ==="
generate_list "hooks" "hooks"
generate_list "utils" "utils"
generate_list "guards" "guards"
generate_list "contexts" "contexts"

# 6. Config and Routes Agent Files
echo "=== Config and Routes Agent ==="
generate_list "config" "config"
generate_list "routes" "routes"
generate_list "constants" "constants"

# Special files (bootstrap, main entry points)
echo "=== Special Files ==="
find "$FRONTEND_SRC" -maxdepth 1 -type f \( -name "*.ts" -o -name "*.tsx" \) \
    ! -name "*.test.ts" ! -name "*.test.tsx" \
    | sort > "$OUTPUT_DIR/root-files.txt"
count=$(wc -l < "$OUTPUT_DIR/root-files.txt")
echo -e "${GREEN}Found ${count} root files → $OUTPUT_DIR/root-files.txt${NC}"
echo ""

# Generate summary
echo "=== Summary ==="
cat > "$OUTPUT_DIR/SUMMARY.md" << 'EOF'
# File Lists Summary

This directory contains organized file lists for each JSDoc generation agent.

## File Lists

### Components Agent
- `components-files.txt` - All component files (~600 files)
- `pages-files.txt` - All page files

### Services Agent
- `services-files.txt` - All service files (~200 files)
- `middleware-files.txt` - Middleware files

### Stores Agent
- `stores-files.txt` - All Redux store files (~150 files)

### Types Agent
- `types-files.txt` - Type definition files (~100 files)
- `schemas-files.txt` - Zod schema files
- `validation-files.txt` - Validation files

### Hooks and Utils Agent
- `hooks-files.txt` - Custom hook files (~400 files)
- `utils-files.txt` - Utility function files
- `guards-files.txt` - Route guard files
- `contexts-files.txt` - React context files

### Config and Routes Agent
- `config-files.txt` - Configuration files (~120 files)
- `routes-files.txt` - Route definition files
- `constants-files.txt` - Constant definition files

### Special
- `root-files.txt` - Root-level files (bootstrap, main, App, etc.)

## Usage

Use these lists to:
1. Track progress (mark off completed files)
2. Distribute work across team members
3. Feed into automated processing scripts
4. Verify completeness

## Example: Processing a List

```bash
# Process all files in a list
while IFS= read -r file; do
    echo "Processing: $file"
    # Add your JSDoc generation logic here
done < file-lists/services-files.txt
```

## Statistics

EOF

# Add statistics to summary
echo "### File Counts" >> "$OUTPUT_DIR/SUMMARY.md"
echo "" >> "$OUTPUT_DIR/SUMMARY.md"
for file in "$OUTPUT_DIR"/*.txt; do
    if [ -f "$file" ]; then
        name=$(basename "$file" .txt)
        count=$(wc -l < "$file")
        echo "- **$name**: $count files" >> "$OUTPUT_DIR/SUMMARY.md"
    fi
done

# Calculate total
total=$(find "$OUTPUT_DIR" -name "*.txt" -exec cat {} \; | wc -l)
echo "" >> "$OUTPUT_DIR/SUMMARY.md"
echo "**Total Files**: $total" >> "$OUTPUT_DIR/SUMMARY.md"
echo "" >> "$OUTPUT_DIR/SUMMARY.md"
echo "**Generated**: $(date)" >> "$OUTPUT_DIR/SUMMARY.md"

echo -e "${GREEN}Summary saved to: $OUTPUT_DIR/SUMMARY.md${NC}"
echo ""
echo -e "${GREEN}✓ File list generation complete!${NC}"
echo "Total files to document: $total"
