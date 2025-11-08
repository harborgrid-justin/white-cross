#!/usr/bin/env python3
"""
Script to fix barrel reference imports in backend/src/clinical directory.
Converts barrel imports (from index.ts) to direct relative path imports.
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Tuple, Set
import json

# Base directory
CLINICAL_DIR = Path("/workspaces/white-cross/backend/src/clinical")

# Track all changes
changes_summary = {
    "files_modified": [],
    "total_imports_fixed": 0,
    "by_category": {}
}

def read_barrel_exports(barrel_path: Path) -> Dict[str, str]:
    """
    Read a barrel file and map exported names to their source files.
    Returns: {ExportedName: source_file_path}
    """
    exports = {}

    if not barrel_path.exists():
        return exports

    with open(barrel_path, 'r') as f:
        content = f.read()

    # Match: export { Name } from './file';
    pattern1 = r"export\s*\{\s*([^}]+)\s*\}\s*from\s*['\"]([^'\"]+)['\"]"
    for match in re.finditer(pattern1, content):
        names = match.group(1).strip()
        source = match.group(2).strip()

        # Handle multiple exports from same file
        for name in names.split(','):
            name = name.strip()
            exports[name] = source

    # Match: export * from './subdir';
    pattern2 = r"export\s*\*\s*from\s*['\"]([^'\"]+)['\"]"
    for match in re.finditer(pattern2, content):
        source = match.group(1).strip()
        # For wildcard exports, we'll need to check the subdirectory
        exports[f"*{source}"] = source

    return exports

def build_export_map() -> Dict[str, Dict[str, str]]:
    """
    Build a complete map of all barrel exports in the clinical directory.
    Returns: {barrel_directory: {ExportedName: source_file}}
    """
    export_map = {}

    # Find all index.ts files
    for index_file in CLINICAL_DIR.rglob("index.ts"):
        dir_path = index_file.parent
        relative_dir = dir_path.relative_to(CLINICAL_DIR)

        exports = read_barrel_exports(index_file)
        export_map[str(relative_dir)] = exports

    return export_map

def normalize_import_path(from_path: str, current_file: Path) -> Tuple[str, str]:
    """
    Normalize an import path and determine if it's a barrel import.
    Returns: (normalized_path, import_type)
    """
    # Remove quotes
    from_path = from_path.strip('\'"')

    # Check if it's a barrel import (ends with directory or /index)
    if from_path.endswith('/index'):
        return from_path, 'barrel_explicit'
    elif not from_path.endswith('.ts') and not from_path.endswith('.js'):
        # Could be a barrel import - check if it points to a directory with index.ts
        import_parts = from_path.split('/')
        if import_parts and not import_parts[-1].startswith('.'):
            # Likely a barrel import to a directory
            return from_path, 'barrel_implicit'

    return from_path, 'direct'

def fix_import_statement(
    import_line: str,
    current_file: Path,
    export_map: Dict[str, Dict[str, str]]
) -> Tuple[str, bool]:
    """
    Fix a single import statement by converting barrel imports to direct imports.
    Returns: (fixed_line, was_modified)
    """
    # Match import statement
    # Pattern: import { Name1, Name2 } from 'path';
    pattern = r"(import\s*\{([^}]+)\}\s*from\s*)(['\"])([^'\"]+)(['\"])"
    match = re.match(pattern, import_line)

    if not match:
        return import_line, False

    prefix = match.group(1)
    imports = match.group(2).strip()
    quote = match.group(3)
    from_path = match.group(4)

    # Parse imported names
    import_names = [name.strip() for name in imports.split(',')]

    # Check if this is a barrel import
    if '/index' in from_path or (from_path.count('/') >= 1 and not any(from_path.endswith(ext) for ext in ['.service', '.controller', '.dto', '.entity', '.interface', '.enum'])):
        # Determine the barrel directory being imported from
        current_dir = current_file.parent

        # Resolve the import path relative to current file
        if from_path.startswith('../'):
            # Going up directories
            parts = from_path.split('/')
            target_dir = current_dir
            for part in parts:
                if part == '..':
                    target_dir = target_dir.parent
                elif part and part != '.':
                    target_dir = target_dir / part
        else:
            target_dir = current_dir / from_path

        # Check if there's an index.ts in target directory
        if (target_dir / 'index.ts').exists():
            # This is a barrel import - we need to fix it
            relative_barrel_dir = target_dir.relative_to(CLINICAL_DIR)

            if str(relative_barrel_dir) in export_map:
                barrel_exports = export_map[str(relative_barrel_dir)]

                # Try to resolve each import to its source file
                new_imports = []
                for import_name in import_names:
                    clean_name = import_name.split(' as ')[0].strip()

                    if clean_name in barrel_exports:
                        source_file = barrel_exports[clean_name]
                        # Calculate relative path from current file to source file
                        source_full = target_dir / (source_file + '.ts' if not source_file.endswith('.ts') else source_file)

                        # Get relative path
                        try:
                            rel_path = os.path.relpath(source_full, current_dir)
                            if not rel_path.startswith('.'):
                                rel_path = './' + rel_path
                            # Remove .ts extension for imports
                            rel_path = rel_path.replace('.ts', '')
                            new_imports.append((import_name, rel_path))
                        except ValueError:
                            # Can't compute relative path, keep original
                            new_imports.append((import_name, from_path))
                    else:
                        # Can't resolve, keep original path
                        new_imports.append((import_name, from_path))

                # Group imports by their new paths
                imports_by_path = {}
                for import_name, new_path in new_imports:
                    if new_path not in imports_by_path:
                        imports_by_path[new_path] = []
                    imports_by_path[new_path].append(import_name)

                # Generate new import statements
                if len(imports_by_path) == 1:
                    # All imports from same file, just update the path
                    new_path = list(imports_by_path.keys())[0]
                    if new_path != from_path:
                        new_line = f"{prefix}{quote}{new_path}{quote};"
                        return new_line, True
                else:
                    # Imports need to be split across multiple statements
                    # For now, just fix the path if all resolve to same location
                    # This is a simplification - full implementation would split the statement
                    pass

    return import_line, False

def fix_file_imports(file_path: Path, export_map: Dict[str, Dict[str, str]]) -> int:
    """
    Fix all barrel imports in a single file.
    Returns: number of imports fixed
    """
    with open(file_path, 'r') as f:
        lines = f.readlines()

    modified_lines = []
    imports_fixed = 0

    for line in lines:
        if line.strip().startswith('import') and 'from' in line:
            fixed_line, was_modified = fix_import_statement(line, file_path, export_map)
            modified_lines.append(fixed_line)
            if was_modified:
                imports_fixed += 1
        else:
            modified_lines.append(line)

    if imports_fixed > 0:
        with open(file_path, 'w') as f:
            f.writelines(modified_lines)

    return imports_fixed

def main():
    print("Building export map from barrel files...")
    export_map = build_export_map()

    print(f"\nFound {len(export_map)} barrel files:")
    for barrel_dir in sorted(export_map.keys()):
        exports_count = len(export_map[barrel_dir])
        print(f"  {barrel_dir}: {exports_count} exports")

    print("\n" + "="*80)
    print("Analyzing TypeScript files for barrel imports...")
    print("="*80 + "\n")

    total_files = 0
    total_fixed = 0

    # Process all TypeScript files except index.ts files
    for ts_file in CLINICAL_DIR.rglob("*.ts"):
        if ts_file.name == "index.ts":
            continue

        total_files += 1
        imports_fixed = fix_file_imports(ts_file, export_map)

        if imports_fixed > 0:
            rel_path = ts_file.relative_to(CLINICAL_DIR)
            print(f"✓ Fixed {imports_fixed} import(s) in {rel_path}")
            changes_summary["files_modified"].append(str(rel_path))
            total_fixed += imports_fixed

    changes_summary["total_imports_fixed"] = total_fixed

    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80)
    print(f"Total files analyzed: {total_files}")
    print(f"Files modified: {len(changes_summary['files_modified'])}")
    print(f"Total imports fixed: {total_fixed}")

    # Save detailed report
    report_path = CLINICAL_DIR.parent.parent.parent / "barrel-imports-fix-report.json"
    with open(report_path, 'w') as f:
        json.dump(changes_summary, f, indent=2)

    print(f"\nDetailed report saved to: {report_path}")

if __name__ == "__main__":
    main()
