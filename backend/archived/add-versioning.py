#!/usr/bin/env python3
"""
Script to add API versioning to all NestJS controllers
Adds @Version('1') decorator to controllers that don't have VERSION_NEUTRAL
"""

import os
import re
from pathlib import Path

# Controllers that should remain VERSION_NEUTRAL
VERSION_NEUTRAL_CONTROLLERS = [
    'infrastructure/monitoring/health.controller.ts'
]

# Controller that needs path fix
SPECIAL_CASE_CONTROLLERS = {
    'api-key-auth/api-key-auth.controller.ts': {
        'old_path': "'api/v1/api-keys'",
        'new_path': "'api-keys'"
    }
}

def should_skip_controller(file_path):
    """Check if controller should remain VERSION_NEUTRAL or already versioned"""
    rel_path = str(file_path).replace('/home/user/white-cross/backend/src/', '')

    # Skip if VERSION_NEUTRAL
    for neutral in VERSION_NEUTRAL_CONTROLLERS:
        if neutral in rel_path:
            return True

    # Check if already has versioning
    with open(file_path, 'r') as f:
        content = f.read()
        # Already has @Version or VERSION_NEUTRAL
        if '@Version(' in content or 'VERSION_NEUTRAL' in content:
            return False  # Don't skip, might need update

    return False

def add_version_to_imports(content):
    """Add Version to @nestjs/common imports if not present"""

    # Check if Version is already imported
    if 'Version' in content and "from '@nestjs/common'" in content:
        return content

    # Find the @nestjs/common import line
    common_import_pattern = r"import\s*\{([^}]+)\}\s*from\s*['\"]@nestjs/common['\"]"
    match = re.search(common_import_pattern, content)

    if match:
        imports = match.group(1)

        # Check if Version is already in imports
        if 'Version' not in imports:
            # Add Version to imports (alphabetically if possible)
            import_list = [i.strip() for i in imports.split(',')]

            # Insert Version before last import or at end
            if 'VERSION_NEUTRAL' not in imports:
                import_list.append('Version')

            new_imports = ', '.join(import_list)
            new_import_line = f"import {{ {new_imports} }} from '@nestjs/common'"

            content = content.replace(match.group(0), new_import_line)

    return content

def add_version_decorator(content, file_path):
    """Add @Version('1') decorator to @Controller"""

    rel_path = str(file_path).replace('/home/user/white-cross/backend/src/', '')

    # Special case: fix api-key-auth controller path
    if rel_path in SPECIAL_CASE_CONTROLLERS:
        special = SPECIAL_CASE_CONTROLLERS[rel_path]
        content = content.replace(
            f"@Controller({special['old_path']})",
            f"@Controller({special['new_path']})"
        )

    # Check if already has @Version
    if '@Version(' in content:
        return content

    # Find @Controller decorator
    controller_pattern = r'(@ApiTags[^)]+\)\s*)?(@Controller[^)]+\))'

    def add_version(match):
        api_tags = match.group(1) or ''
        controller_dec = match.group(2)

        # Add @Version('1') before @Controller
        return f"{api_tags}\n@Version('1')\n{controller_dec}"

    content = re.sub(controller_pattern, add_version, content, count=1)

    return content

def process_controller(file_path):
    """Process a single controller file"""

    if should_skip_controller(file_path):
        return False, "Skipped (VERSION_NEUTRAL or already versioned)"

    try:
        with open(file_path, 'r') as f:
            original_content = f.read()

        # Step 1: Add Version to imports
        content = add_version_to_imports(original_content)

        # Step 2: Add @Version('1') decorator
        content = add_version_decorator(content, file_path)

        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w') as f:
                f.write(content)
            return True, "Updated"
        else:
            return False, "No changes needed"

    except Exception as e:
        return False, f"Error: {str(e)}"

def main():
    """Main function to process all controllers"""

    src_dir = Path('/home/user/white-cross/backend/src')
    controllers = list(src_dir.rglob('*.controller.ts'))

    print(f"Found {len(controllers)} controller files")
    print("=" * 80)

    updated_count = 0
    skipped_count = 0
    error_count = 0

    for controller in sorted(controllers):
        rel_path = controller.relative_to(src_dir)
        success, message = process_controller(controller)

        if success:
            print(f"✅ {rel_path}: {message}")
            updated_count += 1
        elif "Error" in message:
            print(f"❌ {rel_path}: {message}")
            error_count += 1
        else:
            print(f"⏭️  {rel_path}: {message}")
            skipped_count += 1

    print("=" * 80)
    print(f"\nSummary:")
    print(f"  Updated: {updated_count}")
    print(f"  Skipped: {skipped_count}")
    print(f"  Errors: {error_count}")
    print(f"  Total: {len(controllers)}")

if __name__ == '__main__':
    main()
