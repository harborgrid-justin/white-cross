# Page Builder Export Format Specification

**Version:** 1.0.0
**Last Updated:** 2025-11-14

## Overview

This document specifies the export formats for Page Builder projects, including JSON and ZIP formats with complete project structure, assets, and metadata.

## Export Formats

### 1. JSON Export

**Use Case**: Lightweight project backup without assets, quick project transfer, API integrations

**File Structure**:
```
project-export.json
```

**Content**: Complete project data including project metadata, pages, components, settings, but asset references only (no actual files)

**Size**: Typically 10KB - 5MB depending on project complexity

**Schema**: `/backend/src/page-builder/schemas/project-export.schema.json`

### 2. ZIP Export

**Use Case**: Full project backup with assets, project archival, offline storage, project templates

**File Structure**:
```
project-export.zip
├── manifest.json
├── project.json
├── pages/
│   ├── home.json
│   ├── about.json
│   └── contact.json
├── assets/
│   ├── images/
│   │   ├── hero-bg.jpg
│   │   ├── logo.png
│   │   └── thumbnails/
│   │       ├── hero-bg-thumb.jpg
│   │       └── logo-thumb.png
│   ├── videos/
│   │   └── intro.mp4
│   ├── documents/
│   │   └── brochure.pdf
│   ├── fonts/
│   └── icons/
│       └── custom-icon.svg
├── component-library.json
└── workflows.json
```

**Size**: Variable, depends on asset sizes (typically 1MB - 500MB)

**Compression**: Standard ZIP compression

**Schema**: `/backend/src/page-builder/schemas/manifest.schema.json`

## File Specifications

### manifest.json

**Purpose**: Index of all files in the export with metadata and checksums

**Required Fields**:
- `version`: Export format version (semantic versioning)
- `exportFormat`: "json" or "zip"
- `projectId`: UUID of the project
- `projectName`: Human-readable project name
- `exportedAt`: ISO 8601 timestamp
- `files`: Object mapping file types to paths

**Optional Fields**:
- `exportedBy`: Object with user information (id, name, email)
- `checksums`: Object mapping file paths to SHA-256 checksums
- `metadata`: Additional export metadata (pageCount, assetCount, totalSize, etc.)

**Example**:
```json
{
  "version": "1.0.0",
  "exportFormat": "zip",
  "projectId": "650e8400-e29b-41d4-a716-446655440001",
  "projectName": "School Website 2025",
  "exportedAt": "2025-11-14T10:30:00Z",
  "exportedBy": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john.doe@whitecross.com"
  },
  "files": {
    "project": "project.json",
    "pages": [
      "pages/home.json",
      "pages/about.json"
    ],
    "assets": [
      {
        "id": "a50e8400-e29b-41d4-a716-446655440001",
        "path": "assets/images/hero-bg.jpg",
        "type": "image",
        "size": 2457600
      }
    ],
    "componentLibrary": "component-library.json",
    "workflows": "workflows.json"
  },
  "checksums": {
    "project.json": "sha256:abc123...",
    "pages/home.json": "sha256:def456...",
    "assets/images/hero-bg.jpg": "sha256:ghi789..."
  },
  "metadata": {
    "pageCount": 2,
    "componentCount": 15,
    "assetCount": 8,
    "totalSize": 12457600,
    "includesAssets": true
  }
}
```

### project.json

**Purpose**: Complete project metadata and settings

**Content**:
- Project ID, name, description, slug
- Owner information (reference only, not full user object)
- Status, visibility settings
- Project settings (theme, SEO, responsive, integrations)
- Timestamps
- Version information

**Note**: Does NOT include pages, components, or assets (those are in separate files)

**Example**:
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440001",
  "name": "School Website 2025",
  "description": "Main website for Lincoln Elementary School",
  "slug": "school-website-2025",
  "status": "published",
  "visibility": "public",
  "settings": {
    "theme": {
      "primaryColor": "#1e40af",
      "secondaryColor": "#dc2626",
      "fontFamily": "Inter, sans-serif"
    },
    "seo": {
      "titleTemplate": "%s | Lincoln Elementary",
      "defaultDescription": "Welcome to Lincoln Elementary School"
    }
  },
  "version": 12,
  "createdAt": "2025-09-01T08:00:00Z",
  "updatedAt": "2025-11-14T10:25:00Z",
  "publishedAt": "2025-10-15T14:00:00Z"
}
```

### pages/[page-name].json

**Purpose**: Individual page data with components and elements

**Naming Convention**: Sanitized page name or path (e.g., `home.json`, `about-us.json`)

**Content**:
- Page ID, name, path
- Status, order, parent relationship
- Page settings (layout, SEO, custom code)
- Complete component tree with nested components and elements
- Timestamps

**Example**:
```json
{
  "id": "750e8400-e29b-41d4-a716-446655440001",
  "name": "Home",
  "path": "/",
  "status": "published",
  "order": 0,
  "settings": {
    "layout": {
      "type": "fluid",
      "maxWidth": 1280
    },
    "seo": {
      "title": "Welcome to Lincoln Elementary",
      "description": "Lincoln Elementary School provides exceptional education"
    }
  },
  "isHomePage": true,
  "components": [
    {
      "id": "850e8400-e29b-41d4-a716-446655440001",
      "type": "hero",
      "name": "Main Hero Section",
      "props": {
        "heading": "Welcome to Lincoln Elementary"
      },
      "styles": {
        "height": "600px"
      },
      "elements": [
        {
          "id": "950e8400-e29b-41d4-a716-446655440001",
          "type": "heading",
          "content": {
            "text": "Welcome to Lincoln Elementary"
          }
        }
      ]
    }
  ]
}
```

### assets/[type]/[filename]

**Purpose**: Actual asset files (images, videos, documents, etc.)

**Directory Structure**:
- `assets/images/`: Image files (jpg, png, svg, webp, etc.)
- `assets/videos/`: Video files (mp4, webm, etc.)
- `assets/documents/`: Documents (pdf, docx, etc.)
- `assets/fonts/`: Custom fonts (woff, woff2, ttf, etc.)
- `assets/icons/`: Icon files (svg, ico, etc.)
- `assets/audio/`: Audio files (mp3, wav, etc.)
- `assets/[type]/thumbnails/`: Generated thumbnails

**Naming Convention**: Original filename with UUID prefix to prevent collisions
- Example: `a50e8400-hero-bg.jpg`

**Metadata**: Stored in export JSON with references to file paths

### component-library.json

**Purpose**: User-created reusable components

**Content**: Array of library component definitions

**Example**:
```json
[
  {
    "id": "c50e8400-e29b-41d4-a716-446655440001",
    "name": "School Feature Card",
    "description": "Reusable feature card with icon, title, and description",
    "category": "cards",
    "definition": {
      "type": "card",
      "props": { ... },
      "styles": { ... }
    },
    "tags": ["card", "feature", "reusable"]
  }
]
```

### workflows.json

**Purpose**: Automated workflows and schedules

**Content**: Array of workflow definitions

**Note**: May not be included in public template exports for security

**Example**:
```json
[
  {
    "id": "w50e8400-e29b-41d4-a716-446655440001",
    "name": "Nightly Auto-Backup",
    "type": "auto_backup",
    "config": {
      "trigger": {
        "type": "schedule",
        "cron": "0 2 * * *"
      }
    }
  }
]
```

## Export Process

### Export Steps

1. **Validate Permissions**: Ensure user has export permission for project
2. **Gather Data**: Collect project, pages, components, assets, library, workflows
3. **Generate Structure**: Create directory structure for ZIP or single JSON
4. **Process Assets**:
   - Copy files to appropriate directories
   - Generate thumbnails if missing
   - Calculate checksums
5. **Create Manifest**: Generate manifest.json with file listing and metadata
6. **Validate Schema**: Validate all JSON files against schemas
7. **Compress**: Create ZIP archive (for ZIP format)
8. **Verify**: Verify checksums and file integrity
9. **Store/Deliver**: Save to storage or stream to user

### Export Options

**Include Assets**: Whether to include actual asset files (default: true for ZIP, false for JSON)

**Include Workflows**: Whether to include workflows (default: false for templates, true for backups)

**Include Versions**: Whether to include version history (default: false)

**Compress**: Compression level for ZIP (default: standard)

## Import Process

### Import Steps

1. **Upload**: Receive ZIP or JSON file
2. **Validate Format**: Check file extension and structure
3. **Extract**: Unzip if ZIP format
4. **Validate Manifest**: Validate manifest.json schema
5. **Verify Checksums**: Verify all file checksums match manifest
6. **Validate Schemas**: Validate all JSON files against schemas
7. **Check Compatibility**: Ensure export version is compatible with current version
8. **Check Conflicts**: Check for slug/path conflicts with existing projects
9. **Preview**: Show user preview of what will be imported
10. **User Confirmation**: Wait for user to confirm import
11. **Create Records**: Insert project, pages, components into database
12. **Upload Assets**: Upload assets to storage (S3/CDN)
13. **Update References**: Update asset URLs in component props/styles
14. **Finalize**: Mark project as imported, create initial version
15. **Cleanup**: Remove temporary files

### Import Options

**Conflict Resolution**:
- `rename`: Auto-rename slug/paths if conflicts exist
- `replace`: Replace existing project (requires permission)
- `merge`: Merge with existing project (advanced)
- `fail`: Abort import on conflict

**Asset Handling**:
- `upload`: Upload assets to storage
- `reference`: Keep existing URLs (for external assets)
- `skip`: Don't import assets

**Ownership**:
- `current_user`: Assign to importing user (default)
- `preserve`: Try to preserve original owner (if exists)

## Version Compatibility

### Semantic Versioning

**Format**: `MAJOR.MINOR.PATCH`

**Breaking Changes** (Increment MAJOR):
- Removed required fields
- Changed field types
- Changed file structure
- Changed schema validation rules

**New Features** (Increment MINOR):
- Added optional fields
- Added new file types
- Enhanced metadata

**Bug Fixes** (Increment PATCH):
- Schema corrections
- Documentation updates
- Minor fixes

### Compatibility Matrix

| Export Version | Import Version | Compatible | Notes |
|----------------|----------------|------------|-------|
| 1.0.x          | 1.0.x          | ✓          | Full compatibility |
| 1.0.x          | 1.1.x          | ✓          | Backward compatible |
| 1.1.x          | 1.0.x          | ⚠          | May lose new fields |
| 2.0.x          | 1.x.x          | ✗          | Breaking change |
| 1.x.x          | 2.0.x          | ✓          | Auto-upgrade |

### Upgrade Strategy

**When importing older version**:
1. Detect version mismatch
2. Apply transformations to upgrade schema
3. Validate upgraded data
4. Log upgrade in import metadata

**Common Transformations**:
- Add default values for new required fields
- Migrate old field names to new names
- Convert deprecated formats to current format
- Restructure data to match new schema

## Validation

### JSON Schema Validation

**Tools**:
- AJV (A JSON Schema Validator) for runtime validation
- JSON Schema Lint for development validation

**Validation Points**:
- Before export: Validate generated JSON
- After export: Validate exported file
- Before import: Validate uploaded file
- After import: Validate imported data

### Checksum Verification

**Algorithm**: SHA-256

**Purpose**:
- Detect file corruption during transfer
- Verify file integrity
- Prevent tampering

**Process**:
1. Calculate SHA-256 for each file during export
2. Store checksums in manifest.json
3. Verify checksums during import
4. Abort import if any checksum fails

### Data Integrity Checks

**Project Level**:
- All referenced assets exist
- All page paths are unique
- Home page is designated
- Required settings are present

**Page Level**:
- Parent pages exist (for nested pages)
- Component order is sequential
- No circular nesting

**Component Level**:
- Parent components exist (for nested)
- Library components exist (if referenced)
- No circular nesting
- Required props are present

**Asset Level**:
- File sizes match metadata
- MIME types match file extensions
- Thumbnails exist for images

## Security Considerations

### Export Security

**Permission Checks**:
- User must be owner or have export permission
- Cannot export if project is locked
- Audit log export action

**Data Sanitization**:
- Remove internal IDs (replace with stable IDs)
- Remove user PII (keep references only)
- Remove sensitive settings (API keys, tokens)
- Sanitize custom code for XSS

### Import Security

**File Upload Limits**:
- Max file size: 500MB
- Max uncompressed size: 2GB
- Max number of files: 10,000
- Max number of pages: 1,000

**Content Validation**:
- Scan for malware
- Validate all file types
- Sanitize all text content
- Escape all HTML/JS in custom code
- Validate all URLs

**Rate Limiting**:
- Max 10 imports per user per day
- Max 100 imports per project per month
- Exponential backoff on failures

## Error Handling

### Export Errors

**Common Errors**:
- Insufficient permissions
- Project not found
- Asset files missing
- Disk space insufficient
- Export timeout (> 5 minutes)

**Recovery**:
- Retry with smaller batch
- Exclude problematic assets
- Export as JSON only (no assets)
- Contact support

### Import Errors

**Common Errors**:
- Invalid file format
- Schema validation failure
- Checksum mismatch
- Compatibility version mismatch
- Conflict with existing project
- Asset upload failure
- Database constraint violation

**Recovery**:
- Fix validation errors and retry
- Choose different conflict resolution
- Skip failed assets
- Rollback entire import
- Contact support

## Performance Optimization

### Export Optimization

**Strategies**:
- Stream large files instead of loading in memory
- Process assets in parallel
- Use worker threads for compression
- Cache generated thumbnails
- Implement progress tracking

**Benchmarks**:
- Small project (< 10 pages): < 5 seconds
- Medium project (10-50 pages): < 30 seconds
- Large project (50-100 pages): < 2 minutes
- Very large project (100+ pages): < 5 minutes

### Import Optimization

**Strategies**:
- Stream decompression
- Parallel asset uploads to S3
- Batch database inserts
- Use database transactions
- Implement progress tracking
- Queue-based processing for large imports

**Benchmarks**:
- Small import (< 10 pages): < 10 seconds
- Medium import (10-50 pages): < 1 minute
- Large import (50-100 pages): < 5 minutes
- Very large import (100+ pages): < 15 minutes

## Monitoring and Analytics

### Export Metrics

- Export requests per day
- Export success/failure rate
- Average export duration
- Export format distribution (JSON vs ZIP)
- Export size distribution
- Asset inclusion rate

### Import Metrics

- Import requests per day
- Import success/failure rate
- Average import duration
- Import source (upload vs template)
- Conflict resolution choices
- Asset upload success rate

### Alerts

- Export failure rate > 5%
- Import failure rate > 10%
- Average export duration > 2 minutes
- Average import duration > 5 minutes
- Disk space for exports < 10GB

## Testing

### Unit Tests

- Export service generates valid JSON
- Export service creates correct file structure
- Import service validates schemas correctly
- Import service resolves conflicts correctly
- Checksum calculation is correct

### Integration Tests

- Full export/import cycle completes successfully
- Imported project matches exported project
- Asset files are uploaded correctly
- Database relationships are maintained
- Version compatibility works correctly

### Load Tests

- 100 concurrent exports
- 50 concurrent imports
- Large project export (1000 pages)
- Large asset import (10GB of files)

## Appendices

### Appendix A: Example Export

See `/backend/src/page-builder/examples/example-project-export.json`

### Appendix B: Schema Definitions

See `/backend/src/page-builder/schemas/`

### Appendix C: Migration Guide

See `/backend/src/page-builder/docs/migration-guide.md`

### Appendix D: API Documentation

See `/backend/src/page-builder/docs/api-documentation.md`
