#!/usr/bin/env python3
"""
Script to apply security guards and authentication to all downstream files
"""

import os
import re
from pathlib import Path

SECURITY_IMPORTS = """
// SECURITY: Import authentication and authorization
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './security/guards/jwt-auth.guard';
import { RolesGuard } from './security/guards/roles.guard';
import { PermissionsGuard } from './security/guards/permissions.guard';
import { Roles } from './security/decorators/roles.decorator';
import { RequirePermissions } from './security/decorators/permissions.decorator';
"""

def is_controller_file(filename):
    """Check if file is a controller"""
    return 'controller' in filename.lower()

def is_service_file(filename):
    """Check if file is a service"""
    return 'service' in filename.lower() or 'module' in filename.lower()

def add_security_to_file(filepath):
    """Add security imports and decorators to a file"""

    if not os.path.exists(filepath):
        return False

    with open(filepath, 'r') as f:
        content = f.read()

    # Skip if already has security imports
    if 'JwtAuthGuard' in content or './security/' in content:
        print(f"Skipping {filepath} - already has security")
        return False

    # Skip security directory itself
    if '/security/' in filepath:
        return False

    filename = os.path.basename(filepath)

    # Add security imports after other imports
    lines = content.split('\n')
    insert_index = 0

    # Find last import statement
    for i, line in enumerate(lines):
        if line.strip().startswith('import '):
            insert_index = i + 1

    # Insert security imports
    if insert_index > 0:
        security_comment = "\n// ============================================================================"
        security_comment += "\n// SECURITY: Authentication & Authorization"
        security_comment += "\n// ============================================================================\n"

        lines.insert(insert_index, security_comment + SECURITY_IMPORTS.strip())
        content = '\n'.join(lines)

    # If it's a controller, add @UseGuards decorator to the class
    if is_controller_file(filename):
        # Find @Injectable() decorator and add guards above class
        content = re.sub(
            r'(@Injectable\(\))\s+export class',
            r'\1\n@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)\nexport class',
            content
        )

    # Write back
    with open(filepath, 'w') as f:
        f.write(content)

    print(f"Added security to: {filepath}")
    return True

def main():
    """Main function"""
    downstream_dir = Path(__file__).parent.parent

    # Get all .ts files except security directory
    files = list(downstream_dir.glob('*.ts'))

    modified_count = 0
    for filepath in files:
        if add_security_to_file(str(filepath)):
            modified_count += 1

    print(f"\nModified {modified_count} files")

if __name__ == '__main__':
    main()
