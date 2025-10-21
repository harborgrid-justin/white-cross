# Enterprise Code Navigation System

A comprehensive intelligent code navigation and analysis system for the White Cross healthcare platform, featuring both enterprise-grade GUI and powerful CLI tools.

## Overview

This system provides advanced code analysis capabilities including:
- **Semantic Code Search** - Vector-based similarity search using OpenAI embeddings
- **Relationship Analysis** - Intelligent mapping of code dependencies and relationships
- **Pattern Discovery** - Automated detection of code patterns, anti-patterns, and duplicates
- **Enterprise GUI** - Real-time web interface with WebSocket connectivity
- **CLI Tools** - Comprehensive command-line interface for automation and scripting

## System Architecture

```
.navigation/
├── gui/                    # Enterprise Web Interface
│   ├── server.js          # Express.js server with REST API
│   └── public/            # Frontend assets
├── cli/                   # Command Line Tools
│   ├── navigator.js       # Main navigation CLI
│   ├── pattern-finder.js  # Pattern discovery tool
│   ├── analyzer.js        # Relationship analysis tool
│   └── exporter.js        # Data export utilities
├── *.js                   # Core analysis engines
└── package.json           # Dependencies and scripts
```

## Quick Start

### 1. Installation
```bash
cd .navigation
npm install
```

### 2. Environment Setup
Set your database connection:
```bash
export DATABASE_URL="postgresql://username:password@host:port/database"
```

### 3. Initialize Data
```bash
npm run populate
```

### 4. Start GUI Server
```bash
npm start
# Access at http://localhost:3000
```

## GUI Interface

The enterprise web interface provides:

### Dashboard Features
- **Real-time Statistics** - Live system metrics and data counts
- **Semantic Search** - Natural language code search with similarity scoring
- **Relationship Visualization** - Interactive graph of code dependencies
- **Pattern Analysis** - Automated pattern detection and reporting

### API Endpoints
- `GET /api/health` - System health check
- `GET /api/stats` - Navigation statistics
- `POST /api/search` - Semantic code search
- `POST /api/navigate` - File relationship navigation
- `POST /api/patterns` - Pattern discovery
- `GET /api/relationships` - Relationship analysis

### WebSocket Features
- Real-time search results
- Live statistics updates
- Connection status monitoring

## CLI Tools

### Navigator - `navigator`
Main navigation and search tool:

```bash
# Search code semantically
navigator search "authentication logic" --limit 10

# Navigate file relationships
navigator navigate "auth.js" --depth 3

# Interactive mode
navigator interactive

# Show system statistics
navigator stats
```

**Commands:**
- `search <query>` - Semantic code search
- `navigate <file>` - Find related files
- `patterns [directory]` - Discover code patterns
- `relationships` - Analyze relationships
- `stats` - Show statistics
- `interactive` - Start interactive session
- `export <format>` - Export data

### Pattern Finder - `pattern-finder`
Advanced pattern discovery and analysis:

```bash
# Find function patterns
pattern-finder functions --type arrow --min-params 2

# Analyze imports
pattern-finder imports --source "react"

# Security analysis
pattern-finder security --risk-level high

# Find duplicates
pattern-finder duplicates --min-length 100
```

**Commands:**
- `functions [directory]` - Function pattern analysis
- `imports [directory]` - Import dependency analysis
- `react [directory]` - React-specific patterns
- `api [directory]` - API endpoint discovery
- `security [directory]` - Security pattern detection
- `duplicates [directory]` - Duplicate code detection
- `complexity [directory]` - Code complexity analysis
- `anti-patterns [directory]` - Anti-pattern detection

### Analyzer - `analyzer`
Relationship and dependency analysis:

```bash
# Analyze dependencies
analyzer dependencies "components/Auth.js" --depth 5

# Find circular dependencies
analyzer circular --max-depth 10

# Identify hotspots
analyzer hotspots --metric total --limit 15

# Impact analysis
analyzer impact "utils/api.js" --depth 3
```

**Commands:**
- `dependencies <file>` - Dependency analysis
- `circular` - Circular dependency detection
- `clusters` - Code cluster identification
- `hotspots` - Relationship hotspot analysis
- `paths <source> <target>` - Connection path finding
- `orphans` - Find orphaned files
- `metrics [file]` - Calculate metrics
- `impact <file>` - Impact analysis
- `suggest` - Improvement suggestions

### Exporter - `exporter`
Data export and backup utilities:

```bash
# Export as JSON
exporter json embeddings --output data.json

# Create backup
exporter backup --include-embeddings

# Generate report
exporter report --template html --output report.html

# Export relationships for visualization
exporter relationships --format graphml
```

**Commands:**
- `json [table]` - Export as JSON
- `csv [table]` - Export as CSV
- `sql [table]` - Export as SQL
- `backup` - Create system backup
- `stats` - Export statistics
- `relationships` - Export relationship data
- `embeddings` - Export embeddings
- `report` - Generate comprehensive report

## Data Model

### Embeddings Table
- `file_path` - Source file path
- `content_snippet` - Code snippet
- `chunk_index` - Chunk sequence number
- `simple_embedding` - Hash-based embedding
- `openai_embedding` - OpenAI vector embedding (1536 dimensions)

### Relationships Table
- `source_file` - Origin file
- `target_file` - Related file
- `relationship_type` - Type of relationship
- `confidence` - Confidence score (0-1)

## Relationship Types

The system identifies multiple relationship types:

- **semantic_similarity** - Semantic code similarity
- **health_domain** - Healthcare domain relationships
- **react_component** - React component dependencies
- **data_layer** - Data access relationships
- **same_directory** - Directory-based relationships
- **same_filetype** - File type relationships

## Configuration

### Environment Variables
```bash
DATABASE_URL=postgresql://user:pass@host:port/db
PORT=3000                    # GUI server port
NODE_ENV=production         # Environment mode
```

### Package Scripts
```bash
npm start                   # Start GUI server
npm run populate           # Build embeddings and relationships
npm run build-embeddings  # Generate embeddings only
npm run build-relationships # Build relationships only
npm run cli:navigator      # Run navigator CLI
npm run cli:patterns       # Run pattern finder
npm run cli:analyze        # Run analyzer
npm run cli:export         # Run exporter
```

## Advanced Features

### Semantic Search
- **Vector Similarity** - OpenAI Ada-002 embeddings with cosine similarity
- **Hybrid Approach** - Combines simple hash and AI embeddings
- **Healthcare Context** - Domain-specific term weighting

### Pattern Recognition
- **Function Analysis** - Arrow functions, async patterns, exports
- **React Patterns** - Hooks, components, lifecycle methods
- **Security Patterns** - Potential vulnerabilities and risks
- **Anti-patterns** - Code smells and problematic patterns

### Relationship Analysis
- **Dependency Trees** - Multi-level dependency mapping
- **Circular Detection** - Recursive circular dependency detection
- **Impact Analysis** - Change impact assessment
- **Clustering** - Related code module identification

## Performance

### System Stats
- **10,319 Total Embeddings** - 100% code coverage
- **3,903 OpenAI Enhanced** - Advanced semantic analysis
- **1,000+ Relationships** - Comprehensive code mapping
- **Sub-second Search** - Optimized vector similarity

### Optimization
- **Batch Processing** - Efficient bulk operations
- **Connection Pooling** - PostgreSQL optimization
- **Vector Indexing** - pgvector extension usage
- **Caching** - Smart result caching

## Troubleshooting

### Common Issues

**Database Connection Errors:**
```bash
# Check environment variable
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

**Missing Dependencies:**
```bash
# Install CLI tables
npm install cli-table3

# Update all dependencies
npm update
```

**Permission Issues:**
```bash
# Make CLI tools executable
chmod +x cli/*.js
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=navigation:* npm start

# Verbose CLI output
navigator search "test" --format json
```

## Development

### Adding New CLI Commands
1. Create new command in respective CLI file
2. Add to `setupCommands()` method
3. Implement handler method
4. Add display method for results
5. Update this README

### Extending Pattern Detection
1. Add patterns to respective `handle*` method
2. Update SQL queries for new pattern types
3. Add display formatting
4. Test with sample code

### API Integration
The REST API can be extended for new functionality:
```javascript
app.post('/api/custom-analysis', async (req, res) => {
  // Custom analysis logic
});
```

## License

MIT License - White Cross Development Team

## Support

For issues and feature requests, use the project's issue tracker or contact the development team.
