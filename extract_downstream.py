#!/usr/bin/env python3
import os
import re
from collections import defaultdict

# Get all .ts files in the composites directory
composites_dir = '/home/user/white-cross/reuse/trading/composites'
files = [f for f in os.listdir(composites_dir) if f.endswith('.ts')]

# Dictionary to store downstream items and which files reference them
downstream_refs = defaultdict(list)

for file in files:
    filepath = os.path.join(composites_dir, file)
    with open(filepath, 'r') as f:
        content = f.read()

    # Extract DOWNSTREAM section
    match = re.search(r'DOWNSTREAM \(imported by\):(.*?)(?:\*/)', content, re.DOTALL)
    if match:
        downstream_section = match.group(1)
        # Extract all bullet points
        items = re.findall(r'^\s*\*\s*-\s*(.+?)$', downstream_section, re.MULTILINE)
        for item in items:
            item = item.strip()
            downstream_refs[item].append(file)

# Print all unique downstream references
print("UNIQUE DOWNSTREAM REFERENCES:")
print("=" * 80)
for item in sorted(downstream_refs.keys()):
    print(f"\n{item}")
    print(f"  Referenced by {len(downstream_refs[item])} file(s):")
    for ref_file in downstream_refs[item][:3]:  # Show first 3
        print(f"    - {ref_file}")
    if len(downstream_refs[item]) > 3:
        print(f"    ... and {len(downstream_refs[item]) - 3} more")

print("\n" + "=" * 80)
print(f"TOTAL UNIQUE DOWNSTREAM CATEGORIES: {len(downstream_refs)}")
