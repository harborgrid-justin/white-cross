#!/bin/bash

# Add 'use client' directive to all interactive components

cd /f/temp/white-cross/nextjs

# UI Components
for file in src/components/ui/*/*.tsx; do
  if [[ -f "$file" ]] && [[ ! "$file" =~ \.test\. ]] && [[ ! "$file" =~ index\. ]]; then
    if ! head -1 "$file" | grep -q "use client"; then
      echo "'use client';" > tmpfile
      echo "" >> tmpfile
      cat "$file" >> tmpfile
      mv tmpfile "$file"
      echo "Added to: $file"
    fi
  fi
done

# Feature Components
for dir in src/components/features/*; do
  if [ -d "$dir" ]; then
    for file in "$dir"/**/*.tsx; do
      if [[ -f "$file" ]] && [[ ! "$file" =~ \.test\. ]] && [[ ! "$file" =~ index\. ]]; then
        if ! head -1 "$file" | grep -q "use client"; then
          echo "'use client';" > tmpfile
          echo "" >> tmpfile
          cat "$file" >> tmpfile
          mv tmpfile "$file"
          echo "Added to: $file"
        fi
      fi
    done
  fi
done

# Layout Components
for file in src/components/layout/*.tsx; do
  if [[ -f "$file" ]] && [[ ! "$file" =~ \.test\. ]] && [[ ! "$file" =~ index\. ]]; then
    # Only add to interactive layout components
    if grep -q "useState\|useEffect\|onClick\|onChange" "$file"; then
      if ! head -1 "$file" | grep -q "use client"; then
        echo "'use client';" > tmpfile
        echo "" >> tmpfile
        cat "$file" >> tmpfile
        mv tmpfile "$file"
        echo "Added to: $file"
      fi
    fi
  fi
done

echo "Completed adding 'use client' directives"
