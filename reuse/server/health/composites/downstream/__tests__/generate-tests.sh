#!/bin/bash

##
# GENERATE TESTS SCRIPT
#
# This script helps generate test files for all remaining downstream composites
# using the TEST-TEMPLATE.spec.ts as a base.
#
# Usage:
#   ./generate-tests.sh                    # Interactive mode
#   ./generate-tests.sh service-name.ts    # Generate test for specific file
#   ./generate-tests.sh --batch            # Generate all remaining tests
##

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSITES_DIR="$(dirname "$SCRIPT_DIR")"
TEMPLATE_FILE="$SCRIPT_DIR/TEST-TEMPLATE.spec.ts"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to convert filename to service class name
# Example: my-service-name.ts -> MyServiceName
filename_to_classname() {
    local filename="$1"
    local basename="${filename%.ts}"

    # Convert kebab-case to PascalCase
    echo "$basename" | sed -r 's/(^|-)([a-z])/\U\2/g'
}

# Function to generate test file for a service
generate_test() {
    local service_file="$1"
    local service_basename="${service_file%.ts}"
    local service_classname=$(filename_to_classname "$service_file")
    local test_file="$SCRIPT_DIR/${service_basename}.spec.ts"

    # Check if test already exists
    if [ -f "$test_file" ]; then
        echo -e "${YELLOW}⚠ Test already exists: $test_file${NC}"
        echo -e "${YELLOW}  Skipping...${NC}"
        return 1
    fi

    # Check if service file exists
    if [ ! -f "$COMPOSITES_DIR/$service_file" ]; then
        echo -e "${RED}✗ Service file not found: $service_file${NC}"
        return 1
    fi

    echo -e "${GREEN}✓ Generating test for: $service_file${NC}"
    echo -e "  Class name: $service_classname"
    echo -e "  Test file: $test_file"

    # Copy template and replace placeholders
    cp "$TEMPLATE_FILE" "$test_file"

    # Replace SERVICE_NAME with actual filename (without .ts)
    sed -i "s/SERVICE_NAME/$service_basename/g" "$test_file"

    # Replace ServiceClass with actual class name
    sed -i "s/ServiceClass/$service_classname/g" "$test_file"

    echo -e "${GREEN}✓ Test file created successfully!${NC}"
    echo -e "  Next steps:"
    echo -e "    1. Open $test_file"
    echo -e "    2. Review and update the test scenarios"
    echo -e "    3. Run: npm test -- ${service_basename}.spec.ts"
    echo ""

    return 0
}

# Function to list all services without tests
list_services_without_tests() {
    echo -e "${YELLOW}Services without tests:${NC}"
    echo ""

    local count=0
    for service_file in "$COMPOSITES_DIR"/*.ts; do
        local basename=$(basename "$service_file" .ts)
        local test_file="$SCRIPT_DIR/${basename}.spec.ts"

        if [ ! -f "$test_file" ]; then
            count=$((count + 1))
            echo -e "  $count. ${basename}.ts"
        fi
    done

    echo ""
    echo -e "${YELLOW}Total services without tests: $count${NC}"
    echo ""
}

# Function to generate all missing tests
generate_all() {
    echo -e "${GREEN}=== Generating All Missing Tests ===${NC}"
    echo ""

    local total=0
    local created=0
    local skipped=0

    for service_file in "$COMPOSITES_DIR"/*.ts; do
        local basename=$(basename "$service_file")

        # Skip if it's already a spec file
        if [[ "$basename" == *.spec.ts ]]; then
            continue
        fi

        total=$((total + 1))

        if generate_test "$basename"; then
            created=$((created + 1))
        else
            skipped=$((skipped + 1))
        fi
    done

    echo ""
    echo -e "${GREEN}=== Summary ===${NC}"
    echo -e "Total services: $total"
    echo -e "${GREEN}Created: $created${NC}"
    echo -e "${YELLOW}Skipped: $skipped${NC}"
    echo ""
}

# Main script logic
main() {
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║         Healthcare Composites Test Generator             ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""

    # Check if template exists
    if [ ! -f "$TEMPLATE_FILE" ]; then
        echo -e "${RED}✗ Template file not found: $TEMPLATE_FILE${NC}"
        exit 1
    fi

    # Handle different modes
    if [ $# -eq 0 ]; then
        # Interactive mode
        echo "Select an option:"
        echo "  1. List services without tests"
        echo "  2. Generate test for specific service"
        echo "  3. Generate all missing tests"
        echo ""
        read -p "Enter option (1-3): " option

        case $option in
            1)
                list_services_without_tests
                ;;
            2)
                read -p "Enter service filename (e.g., my-service.ts): " service_file
                generate_test "$service_file"
                ;;
            3)
                read -p "This will generate tests for ALL missing services. Continue? (y/n): " confirm
                if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
                    generate_all
                else
                    echo "Cancelled."
                fi
                ;;
            *)
                echo -e "${RED}Invalid option${NC}"
                exit 1
                ;;
        esac
    elif [ "$1" = "--batch" ]; then
        # Batch mode
        generate_all
    elif [ "$1" = "--list" ]; then
        # List mode
        list_services_without_tests
    else
        # Single file mode
        generate_test "$1"
    fi
}

# Run main function
main "$@"
