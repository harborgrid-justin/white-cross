/**
 * WC-DOC-ANA-001 | Header Analysis and Documentation Generator
 * Purpose: Extract, analyze, and generate interactive documentation from file headers
 * Upstream: All backend and frontend files with WC-/WF- headers
 * Downstream: Interactive HTML documentation, dependency graphs, metrics
 * Related: Backend and frontend header generation scripts
 * Exports: Analysis functions, documentation generator
 * Last Updated: 2025-10-17 | Dependencies: fs, path (Node.js built-ins)
 * Critical Path: File scan → Header extraction → Analysis → HTML generation
 * LLM Context: Documentation system for code organization and architecture insight
 */

const fs = require('fs');
const path = require('path');

class HeaderAnalyzer {
  constructor() {
    this.backendFiles = [];
    this.frontendFiles = [];
    this.allHeaders = [];
    this.dependencyGraph = new Map();
    this.categories = new Map();
    this.locatorCodes = new Map();
  }

  // Extract header information from a file
  extractHeader(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const headerMatch = content.match(/\/\*\*(.*?)\*\//s);
      
      if (!headerMatch) return null;
      
      const headerContent = headerMatch[1];
      const lines = headerContent.split('\n').map(line => line.replace(/^\s*\*\s?/, '').trim()).filter(Boolean);
      
      if (lines.length < 9) return null;
      
      const header = {
        filePath: filePath.replace(/\\/g, '/'),
        fileName: path.basename(filePath),
        locatorCode: this.extractLocatorCode(lines[0]),
        title: this.extractTitle(lines[0]),
        purpose: this.extractField(lines, 'Purpose:'),
        upstream: this.extractField(lines, 'Upstream:'),
        downstream: this.extractField(lines, 'Downstream:'),
        related: this.extractField(lines, 'Related:'),
        exports: this.extractField(lines, 'Exports:'),
        keyServices: this.extractKeyServices(lines),
        lastUpdated: this.extractField(lines, 'Last Updated:'),
        dependencies: this.extractDependencies(lines),
        criticalPath: this.extractField(lines, 'Critical Path:'),
        llmContext: this.extractField(lines, 'LLM Context:'),
        category: this.determineCategory(filePath),
        isBackend: filePath.includes('backend'),
        isFrontend: filePath.includes('frontend')
      };
      
      return header;
    } catch (error) {
      console.error(`Error extracting header from ${filePath}:`, error.message);
      return null;
    }
  }

  extractLocatorCode(line) {
    const match = line.match(/^(W[CF]-[A-Z]+-\d+)/);
    return match ? match[1] : '';
  }

  extractTitle(line) {
    const match = line.match(/\|\s*(.+?)(?:\s*-\s*(.+))?$/);
    return match ? match[1].trim() : '';
  }

  extractField(lines, fieldName) {
    const line = lines.find(l => l.startsWith(fieldName));
    return line ? line.substring(fieldName.length).trim() : '';
  }

  extractKeyServices(lines) {
    const exportsLine = lines.find(l => l.includes('Key Services:'));
    if (!exportsLine) return '';
    const match = exportsLine.match(/Key Services:\s*(.+)/);
    return match ? match[1].trim() : '';
  }

  extractDependencies(lines) {
    const depLine = lines.find(l => l.includes('Dependencies:'));
    if (!depLine) return [];
    const match = depLine.match(/Dependencies:\s*(.+?)(?:\s*\||$)/);
    if (!match) return [];
    return match[1].split(',').map(dep => dep.trim()).filter(Boolean);
  }

  determineCategory(filePath) {
    const path = filePath.toLowerCase();
    if (path.includes('components')) return 'Components';
    if (path.includes('services')) return 'Services';
    if (path.includes('models')) return 'Models';
    if (path.includes('routes')) return 'Routes';
    if (path.includes('middleware')) return 'Middleware';
    if (path.includes('utils')) return 'Utils';
    if (path.includes('types')) return 'Types';
    if (path.includes('hooks')) return 'Hooks';
    if (path.includes('stores')) return 'Stores';
    if (path.includes('pages')) return 'Pages';
    if (path.includes('guards')) return 'Guards';
    if (path.includes('constants')) return 'Constants';
    if (path.includes('validation')) return 'Validation';
    if (path.includes('database')) return 'Database';
    if (path.includes('config')) return 'Config';
    return 'Other';
  }

  // Scan directories for files with headers
  scanDirectory(dirPath, isBackend = true) {
    const files = [];
    
    const scan = (currentPath) => {
      try {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(currentPath, entry.name);
          
          if (entry.isDirectory() && !entry.name.startsWith('.')) {
            scan(fullPath);
          } else if (entry.isFile() && this.isCodeFile(entry.name)) {
            const header = this.extractHeader(fullPath);
            if (header) {
              files.push(header);
              this.allHeaders.push(header);
              
              // Build category map
              if (!this.categories.has(header.category)) {
                this.categories.set(header.category, []);
              }
              this.categories.get(header.category).push(header);
              
              // Store locator code mapping
              this.locatorCodes.set(header.locatorCode, header);
            }
          }
        }
      } catch (error) {
        console.error(`Error scanning ${currentPath}:`, error.message);
      }
    };
    
    scan(dirPath);
    return files;
  }

  isCodeFile(fileName) {
    return /\.(ts|tsx|js|jsx)$/.test(fileName);
  }

  // Analyze dependency relationships
  buildDependencyGraph() {
    for (const header of this.allHeaders) {
      this.dependencyGraph.set(header.locatorCode, {
        header,
        dependencies: [],
        dependents: []
      });
    }

    // Build relationships based on file paths and imports
    for (const header of this.allHeaders) {
      const node = this.dependencyGraph.get(header.locatorCode);
      
      // Parse upstream dependencies
      if (header.upstream) {
        const upstreamFiles = header.upstream.split(',').map(dep => dep.trim());
        for (const dep of upstreamFiles) {
          if (dep.startsWith('./') || dep.startsWith('../')) {
            // Find matching files
            const matches = this.allHeaders.filter(h => 
              h.filePath.includes(dep.replace(/^\.\.?\//, ''))
            );
            for (const match of matches) {
              node.dependencies.push(match.locatorCode);
              const depNode = this.dependencyGraph.get(match.locatorCode);
              if (depNode) {
                depNode.dependents.push(header.locatorCode);
              }
            }
          }
        }
      }
    }
  }

  // Generate statistics
  generateStats() {
    const stats = {
      totalFiles: this.allHeaders.length,
      backendFiles: this.allHeaders.filter(h => h.isBackend).length,
      frontendFiles: this.allHeaders.filter(h => h.isFrontend).length,
      categories: {},
      topDependencies: {},
      complexity: {},
      lastUpdated: {}
    };

    // Category breakdown
    for (const [category, headers] of this.categories) {
      stats.categories[category] = {
        count: headers.length,
        backend: headers.filter(h => h.isBackend).length,
        frontend: headers.filter(h => h.isFrontend).length
      };
    }

    // Dependency analysis
    const depCounts = new Map();
    for (const header of this.allHeaders) {
      for (const dep of header.dependencies) {
        depCounts.set(dep, (depCounts.get(dep) || 0) + 1);
      }
    }
    
    stats.topDependencies = Object.fromEntries(
      Array.from(depCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    );

    // Complexity metrics
    stats.complexity = {
      avgDependencies: this.allHeaders.reduce((sum, h) => sum + h.dependencies.length, 0) / this.allHeaders.length,
      maxDependencies: Math.max(...this.allHeaders.map(h => h.dependencies.length)),
      circularDeps: this.detectCircularDependencies()
    };

    return stats;
  }

  detectCircularDependencies() {
    // Simple cycle detection (can be enhanced)
    const visited = new Set();
    const cycles = [];

    const dfs = (nodeId, path) => {
      if (path.includes(nodeId)) {
        cycles.push([...path, nodeId]);
        return;
      }
      
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      const node = this.dependencyGraph.get(nodeId);
      if (node) {
        for (const dep of node.dependencies) {
          dfs(dep, [...path, nodeId]);
        }
      }
    };

    for (const nodeId of this.dependencyGraph.keys()) {
      if (!visited.has(nodeId)) {
        dfs(nodeId, []);
      }
    }

    return cycles.length;
  }

  // Generate documentation data
  generateDocumentationData() {
    return {
      headers: this.allHeaders,
      categories: Object.fromEntries(this.categories),
      dependencyGraph: Object.fromEntries(this.dependencyGraph),
      stats: this.generateStats(),
      generatedAt: new Date().toISOString()
    };
  }

  // Run full analysis
  async analyze() {
    console.log('Starting header analysis...');
    
    // Scan backend
    console.log('Scanning backend files...');
    this.backendFiles = this.scanDirectory(path.join('..', 'backend', 'src'), true);
    
    // Scan frontend
    console.log('Scanning frontend files...');
    this.frontendFiles = this.scanDirectory(path.join('..', 'frontend', 'src'), false);
    
    console.log(`Found ${this.backendFiles.length} backend files and ${this.frontendFiles.length} frontend files`);
    
    // Build dependency graph
    console.log('Building dependency graph...');
    this.buildDependencyGraph();
    
    // Generate documentation data
    const docData = this.generateDocumentationData();
    
    // Save to JSON for the HTML interface
    fs.writeFileSync('documentation-data.json', JSON.stringify(docData, null, 2));
    
    console.log('Analysis complete! Data saved to documentation-data.json');
    return docData;
  }
}

// Run if called directly
if (require.main === module) {
  const analyzer = new HeaderAnalyzer();
  analyzer.analyze().catch(console.error);
}

module.exports = HeaderAnalyzer;
