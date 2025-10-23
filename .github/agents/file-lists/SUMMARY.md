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

### File Counts

- **components-files**: 118 files
- **config-files**: 2 files
- **constants-files**: 10 files
- **contexts-files**: 3 files
- **guards-files**: 4 files
- **hooks-files**: 128 files
- **middleware-files**: 13 files
- **pages-files**: 1108 files
- **root-files**: 4 files
- **routes-files**: 3 files
- **schemas-files**: 2 files
- **services-files**: 79 files
- **stores-files**: 51 files
- **types-files**: 24 files
- **utils-files**: 16 files
- **validation-files**: 5 files

**Total Files**: 1570

**Generated**: Thu Oct 23 02:32:13 UTC 2025
