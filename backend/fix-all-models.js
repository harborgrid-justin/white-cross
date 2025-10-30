/**
 * Comprehensive Model Fixer Script
 *
 * This script fixes all identified Sequelize v6 compliance issues across all models:
 * 1. Converts ENUM definitions to STRING with validation
 * 2. Adds foreign key constraints (references, onUpdate, onDelete)
 * 3. Adds explicit string lengths
 * 4. Standardizes underscored configuration
 * 5. Removes duplicate indexes
 * 6. Adds paranoid mode to PHI models
 * 7. Removes empty semicolons
 */

const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.join(__dirname, 'src', 'database', 'models');

// List of PHI models that require paranoid mode for HIPAA compliance
const PHI_MODELS = [
  'student.model.ts',
  'health-record.model.ts',
  'allergy.model.ts',
  'clinic-visit.model.ts',
  'clinical-note.model.ts',
  'mental-health-record.model.ts',
  'immunization.model.ts',
  'vaccination.model.ts',
  'prescription.model.ts',
  'medication.model.ts',
  'medication-log.model.ts',
  'vital-signs.model.ts',
  'growth-tracking.model.ts',
  'health-screening.model.ts',
  'lab-results.model.ts',
  'medical-history.model.ts',
  'incident-report.model.ts',
  'chronic-condition.model.ts',
  'appointment.model.ts',
  'treatment-plan.model.ts'
];

// Common foreign key relationships
const FK_RELATIONSHIPS = {
  studentId: { table: 'students', cascade: 'CASCADE' },
  nurseId: { table: 'users', cascade: 'SET NULL' },
  schoolId: { table: 'schools', cascade: 'CASCADE' },
  districtId: { table: 'districts', cascade: 'CASCADE' },
  userId: { table: 'users', cascade: 'SET NULL' },
  createdBy: { table: 'users', cascade: 'SET NULL' },
  updatedBy: { table: 'users', cascade: 'SET NULL' },
  healthRecordId: { table: 'health_records', cascade: 'CASCADE' },
  appointmentId: { table: 'appointments', cascade: 'CASCADE' },
  conversationId: { table: 'conversations', cascade: 'CASCADE' },
  messageId: { table: 'messages', cascade: 'CASCADE' }
};

let fixedFiles = [];
let errors = [];
let stats = {
  enumsFixed: 0,
  foreignKeysFixed: 0,
  paranoidAdded: 0,
  underscoredAdded: 0,
  duplicateIndexesRemoved: 0,
  stringsLengthAdded: 0
};

/**
 * Fix ENUM definitions - convert to STRING with validation
 */
function fixEnums(content) {
  let fixed = 0;

  // Pattern: DataType.ENUM(...(Object.values(EnumName) as string[]))
  const enumPattern = /type:\s*DataType\.ENUM\(\.\.\.\(Object\.values\((\w+)\)\s+as\s+string\[\]\)\)/g;

  const newContent = content.replace(enumPattern, (match, enumName) => {
    fixed++;
    return `type: DataType.STRING(50),\n    validate: {\n      isIn: [Object.values(${enumName})]\n    }`;
  });

  stats.enumsFixed += fixed;
  return newContent;
}

/**
 * Add explicit STRING lengths
 */
function addStringLengths(content) {
  let fixed = 0;

  // Add length to STRING without length specifier
  const patterns = [
    { regex: /(type:\s*DataType\.STRING)([,\n])/g, replacement: '$1(255)$2' },
    { regex: /(DataType\.STRING)(\s*\))/g, replacement: '$1(255)$2' }
  ];

  let newContent = content;
  patterns.forEach(({ regex, replacement }) => {
    const matches = newContent.match(regex);
    if (matches) fixed += matches.length;
    newContent = newContent.replace(regex, replacement);
  });

  stats.stringsLengthAdded += fixed;
  return newContent;
}

/**
 * Add references, onUpdate, onDelete to foreign key columns
 */
function fixForeignKeyConstraints(content, filename) {
  let fixed = 0;

  // Find all @ForeignKey declarations
  const fkPattern = /@ForeignKey\([^)]+\)\s*@[^\n]*\n\s*@Column\(\{[^}]+\}\)/g;

  let newContent = content.replace(fkPattern, (match) => {
    // Check if already has references
    if (match.includes('references:')) {
      return match;
    }

    // Extract the column name (look for following line with 'declare fieldName')
    const fieldNameMatch = content.substring(content.indexOf(match) + match.length).match(/declare\s+(\w+)/);
    if (!fieldNameMatch) return match;

    const fieldName = fieldNameMatch[1];
    const relationship = FK_RELATIONSHIPS[fieldName];

    if (!relationship) return match;

    // Insert references config before the closing brace
    const updatedMatch = match.replace(
      /(\s*)\}\)/,
      `,\n$1  references: {\n$1    model: '${relationship.table}',\n$1    key: 'id'\n$1  },\n$1  onUpdate: 'CASCADE',\n$1  onDelete: '${relationship.cascade}'\n$1})`
    );

    fixed++;
    return updatedMatch;
  });

  stats.foreignKeysFixed += fixed;
  return newContent;
}

/**
 * Add underscored: false to @Table decorator
 */
function fixUnderscored(content) {
  // Check if @Table already has underscored
  if (content.includes('underscored:')) {
    return content;
  }

  // Add underscored: false after timestamps
  const newContent = content.replace(
    /(timestamps:\s*true)(,?\s*\n)/g,
    '$1,\n  underscored: false$2'
  );

  if (newContent !== content) {
    stats.underscoredAdded++;
  }

  return newContent;
}

/**
 * Enable paranoid mode for PHI models
 */
function fixParanoid(content, filename) {
  if (!PHI_MODELS.includes(path.basename(filename))) {
    return content;
  }

  // Check if already has paranoid
  if (content.includes('paranoid:')) {
    // Change paranoid: false to paranoid: true
    const newContent = content.replace(/paranoid:\s*false/g, 'paranoid: true');
    if (newContent !== content) {
      stats.paranoidAdded++;

      // Also add deletedAt column if not present
      if (!content.includes('deletedAt')) {
        return addDeletedAtColumn(newContent);
      }
    }
    return newContent;
  }

  // Add paranoid: true after underscored
  const newContent = content.replace(
    /(underscored:\s*false)(,?\s*\n)/g,
    '$1,\n  paranoid: true$2'
  );

  if (newContent !== content) {
    stats.paranoidAdded++;

    // Also add deletedAt column if not present
    if (!content.includes('deletedAt')) {
      return addDeletedAtColumn(newContent);
    }
  }

  return newContent;
}

/**
 * Add deletedAt column declaration
 */
function addDeletedAtColumn(content) {
  // Find the updatedAt column and add deletedAt after it
  const updatedAtPattern = /(@Column\(\{[^}]*type:\s*DataType\.DATE[^}]*\}\s*\n\s*declare\s+updatedAt[^;]+;)/;

  if (!updatedAtPattern.test(content)) {
    return content;
  }

  return content.replace(
    updatedAtPattern,
    '$1\n\n  @Column({\n    type: DataType.DATE\n  })\n  declare deletedAt?: Date;'
  );
}

/**
 * Remove duplicate indexes
 */
function removeDuplicateIndexes(content) {
  let fixed = 0;

  // Remove @Index decorator when unique: true is in column definition
  const lines = content.split('\n');
  const newLines = [];
  let skipNextIndex = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this column has unique: true
    if (line.includes('unique: true')) {
      // Mark to skip @Index if found in previous lines
      for (let j = newLines.length - 1; j >= Math.max(0, newLines.length - 5); j--) {
        if (newLines[j].trim() === '@Index') {
          newLines[j] = ''; // Remove the @Index line
          fixed++;
          break;
        }
      }
    }

    newLines.push(line);
  }

  stats.duplicateIndexesRemoved += fixed;
  return newLines.join('\n');
}

/**
 * Remove empty semicolons
 */
function removeEmptySemicolons(content) {
  return content.replace(/^;\s*$/gm, '');
}

/**
 * Process a single model file
 */
function processFile(filepath) {
  try {
    const filename = path.basename(filepath);
    console.log(`Processing: ${filename}`);

    let content = fs.readFileSync(filepath, 'utf8');
    const originalContent = content;

    // Apply all fixes
    content = fixEnums(content);
    content = addStringLengths(content);
    content = fixForeignKeyConstraints(content, filepath);
    content = fixUnderscored(content);
    content = fixParanoid(content, filename);
    content = removeDuplicateIndexes(content);
    content = removeEmptySemicolons(content);

    // Only write if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filepath, content, 'utf8');
      fixedFiles.push(filename);
      console.log(`  ✓ Fixed: ${filename}`);
    } else {
      console.log(`  - No changes needed: ${filename}`);
    }
  } catch (error) {
    console.error(`  ✗ Error processing ${path.basename(filepath)}:`, error.message);
    errors.push({ file: filepath, error: error.message });
  }
}

/**
 * Process all model files
 */
function processAllModels() {
  console.log('Starting comprehensive model fixes...\n');
  console.log(`Models directory: ${MODELS_DIR}\n`);

  const files = fs.readdirSync(MODELS_DIR)
    .filter(file => file.endsWith('.model.ts'))
    .map(file => path.join(MODELS_DIR, file));

  console.log(`Found ${files.length} model files\n`);

  files.forEach(processFile);

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files processed: ${files.length}`);
  console.log(`Files modified: ${fixedFiles.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log('\nFixes applied:');
  console.log(`  - ENUMs converted to STRING: ${stats.enumsFixed}`);
  console.log(`  - Foreign key constraints added: ${stats.foreignKeysFixed}`);
  console.log(`  - Paranoid mode enabled: ${stats.paranoidAdded}`);
  console.log(`  - Underscored config added: ${stats.underscoredAdded}`);
  console.log(`  - Duplicate indexes removed: ${stats.duplicateIndexesRemoved}`);
  console.log(`  - String lengths added: ${stats.stringsLengthAdded}`);

  if (fixedFiles.length > 0) {
    console.log('\nModified files:');
    fixedFiles.forEach(file => console.log(`  - ${file}`));
  }

  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(({ file, error }) => {
      console.log(`  - ${path.basename(file)}: ${error}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('Done!');
  console.log('='.repeat(60));
}

// Run the script
processAllModels();
