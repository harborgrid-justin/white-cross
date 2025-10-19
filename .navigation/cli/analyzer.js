#!/usr/bin/env node

/**
 * Relationship Analysis CLI Tool
 * Advanced analysis of code relationships and dependencies
 */

const { Command } = require('commander');
const Table = require('cli-table3');
const { Client } = require('pg');

// Simple chalk replacement for color output
const chalk = {
  red: (text) => `[31m${text}[0m`,
  green: (text) => `[32m${text}[0m`,
  yellow: (text) => `[33m${text}[0m`,
  blue: (text) => `[34m${text}[0m`,
  magenta: (text) => `[35m${text}[0m`,
  cyan: (text) => `[36m${text}[0m`,
  bold: {
    blue: (text) => `[1m[34m${text}[0m`,
    red: (text) => `[1m[31m${text}[0m`,
    green: (text) => `[1m[32m${text}[0m`,
  }
};

// Simple spinner implementation to replace ora
class SimpleSpinner {
  constructor(text) {
    this.text = text;
    this.isSpinning = false;
  }
  
  start() {
    console.log(`⏳ ${this.text}`);
    this.isSpinning = true;
    return this;
  }
  
  succeed(text) {
    console.log(`✅ ${text || this.text}`);
    this.isSpinning = false;
    return this;
  }
  
  fail(text) {
    console.log(`❌ ${text || this.text}`);
    this.isSpinning = false;
    return this;
  }
}

function ora(text) {
  return new SimpleSpinner(text);
}

class RelationshipAnalyzer {
  constructor() {
    // Use the database connection from .env file
    const connectionString = process.env.DATABASE_URL || 
      'postgresql://neondb_owner:npg_CqE9oPepJl8t@ep-young-queen-ad5sfxae.c-2.us-east-1.aws.neon.tech/code_vectors?sslmode=require&channel_binding=require';
    
    this.client = new Client({ connectionString });
    this.program = new Command();
    this.setupCommands();
  }

  async connect() {
    try {
      await this.client.connect();
      return true;
    } catch (error) {
      console.error(chalk.red('Database connection failed:'), error.message);
      return false;
    }
  }

  async disconnect() {
    await this.client.end();
  }

  setupCommands() {
    this.program
      .name('analyzer')
      .description('Advanced Relationship Analysis Tool')
      .version('1.0.0');

    this.program
      .command('dependencies <file>')
      .description('Analyze dependencies for a specific file')
      .option('-d, --depth <number>', 'Analysis depth', '3')
      .option('-t, --type <type>', 'Relationship type filter')
      .option('--reverse', 'Show reverse dependencies (what depends on this file)')
      .action(async (file, options) => {
        await this.handleDependencies(file, options);
      });

    this.program
      .command('circular')
      .description('Detect circular dependencies')
      .option('-m, --max-depth <number>', 'Maximum search depth', '10')
      .option('-t, --type <type>', 'Relationship type filter')
      .action(async (options) => {
        await this.handleCircular(options);
      });

    this.program
      .command('clusters')
      .description('Find code clusters and modules')
      .option('-s, --min-size <number>', 'Minimum cluster size', '3')
      .option('-c, --confidence <number>', 'Minimum confidence threshold', '0.7')
      .action(async (options) => {
        await this.handleClusters(options);
      });

    this.program
      .command('hotspots')
      .description('Identify relationship hotspots')
      .option('-l, --limit <number>', 'Number of hotspots to show', '10')
      .option('-m, --metric <metric>', 'Metric (in-degree|out-degree|total)', 'total')
      .action(async (options) => {
        await this.handleHotspots(options);
      });

    this.program
      .command('paths <source> <target>')
      .description('Find connection paths between two files')
      .option('-m, --max-paths <number>', 'Maximum paths to find', '5')
      .option('-d, --max-depth <number>', 'Maximum path depth', '6')
      .action(async (source, target, options) => {
        await this.handlePaths(source, target, options);
      });

    this.program
      .command('orphans')
      .description('Find orphaned files (no relationships)')
      .option('-t, --type <type>', 'Relationship type to consider')
      .action(async (options) => {
        await this.handleOrphans(options);
      });

    this.program
      .command('metrics [file]')
      .description('Calculate relationship metrics')
      .option('-d, --detailed', 'Show detailed metrics')
      .action(async (file, options) => {
        await this.handleMetrics(file, options);
      });

    this.program
      .command('impact <file>')
      .description('Analyze impact of changing a file')
      .option('-d, --depth <number>', 'Analysis depth', '5')
      .option('--direct-only', 'Show only direct impacts')
      .action(async (file, options) => {
        await this.handleImpact(file, options);
      });

    this.program
      .command('suggest')
      .description('Suggest relationship improvements')
      .option('-c, --category <category>', 'Suggestion category (missing|weak|duplicate)')
      .action(async (options) => {
        await this.handleSuggest(options);
      });
  }

  async handleDependencies(file, options) {
    const spinner = ora(`Analyzing dependencies for ${file}...`).start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const depth = parseInt(options.depth);
      const reverse = options.reverse;
      
      const dependencies = await this.findDependencies(file, depth, options.type, reverse);
      
      spinner.succeed(`Found ${dependencies.length} dependencies`);
      
      if (dependencies.length === 0) {
        console.log(chalk.yellow('No dependencies found'));
        return;
      }

      this.displayDependencyTree(dependencies, file, reverse);

    } catch (error) {
      spinner.fail('Dependency analysis failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleCircular(options) {
    const spinner = ora('Detecting circular dependencies...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const maxDepth = parseInt(options.maxDepth);
      const circles = await this.findCircularDependencies(maxDepth, options.type);
      
      spinner.succeed(`Found ${circles.length} circular dependencies`);
      
      if (circles.length === 0) {
        console.log(chalk.green('No circular dependencies detected'));
        return;
      }

      this.displayCircularDependencies(circles);

    } catch (error) {
      spinner.fail('Circular dependency detection failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleClusters(options) {
    const spinner = ora('Finding code clusters...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const minSize = parseInt(options.minSize);
      const confidence = parseFloat(options.confidence);
      
      const clusters = await this.findClusters(minSize, confidence);
      
      spinner.succeed(`Found ${clusters.length} clusters`);
      this.displayClusters(clusters);

    } catch (error) {
      spinner.fail('Cluster analysis failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleHotspots(options) {
    const spinner = ora('Identifying relationship hotspots...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const limit = parseInt(options.limit);
      const hotspots = await this.findHotspots(options.metric, limit);
      
      spinner.succeed(`Found ${hotspots.length} hotspots`);
      this.displayHotspots(hotspots, options.metric);

    } catch (error) {
      spinner.fail('Hotspot analysis failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handlePaths(source, target, options) {
    const spinner = ora(`Finding paths from ${source} to ${target}...`).start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const maxPaths = parseInt(options.maxPaths);
      const maxDepth = parseInt(options.maxDepth);
      
      const paths = await this.findPaths(source, target, maxPaths, maxDepth);
      
      if (paths.length === 0) {
        spinner.succeed('No paths found between files');
        console.log(chalk.yellow('Files are not connected'));
        return;
      }

      spinner.succeed(`Found ${paths.length} connection paths`);
      this.displayPaths(paths, source, target);

    } catch (error) {
      spinner.fail('Path finding failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleOrphans(options) {
    const spinner = ora('Finding orphaned files...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const orphans = await this.findOrphans(options.type);
      
      spinner.succeed(`Found ${orphans.length} orphaned files`);
      
      if (orphans.length === 0) {
        console.log(chalk.green('No orphaned files found'));
        return;
      }

      this.displayOrphans(orphans);

    } catch (error) {
      spinner.fail('Orphan detection failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleMetrics(file, options) {
    const spinner = ora('Calculating relationship metrics...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const metrics = await this.calculateMetrics(file, options.detailed);
      
      spinner.succeed('Metrics calculated');
      this.displayMetrics(metrics, file, options.detailed);

    } catch (error) {
      spinner.fail('Metrics calculation failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleImpact(file, options) {
    const spinner = ora(`Analyzing impact of changes to ${file}...`).start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const depth = parseInt(options.depth);
      const impact = await this.analyzeImpact(file, depth, options.directOnly);
      
      spinner.succeed(`Impact analysis complete`);
      this.displayImpact(impact, file);

    } catch (error) {
      spinner.fail('Impact analysis failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleSuggest(options) {
    const spinner = ora('Generating relationship suggestions...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const suggestions = await this.generateSuggestions(options.category);
      
      spinner.succeed(`Generated ${suggestions.length} suggestions`);
      this.displaySuggestions(suggestions);

    } catch (error) {
      spinner.fail('Suggestion generation failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  // Core analysis methods
  async findDependencies(file, depth, type, reverse) {
    const direction = reverse ? 'target_file' : 'source_file';
    const otherDirection = reverse ? 'source_file' : 'target_file';
    
    let query = `
      WITH RECURSIVE dependency_tree AS (
        SELECT cf2.file_path as file, cf1.file_path as depends_on, 
               cr.relationship_type, cr.confidence_score as confidence, 1 as level
        FROM code_relationships cr
        JOIN code_headers ch1 ON cr.source_header_id = ch1.id
        JOIN code_headers ch2 ON cr.target_header_id = ch2.id
        JOIN code_files cf1 ON ch1.file_id = cf1.id
        JOIN code_files cf2 ON ch2.file_id = cf2.id
        WHERE ${direction === 'source_file' ? 'cf1.file_path' : 'cf2.file_path'} LIKE $1
    `;

    const params = [`%${file}%`];

    if (type) {
      query += ` AND relationship_type = $2`;
      params.push(type);
    }

    query += `
        UNION ALL
        SELECT cf2.file_path, cf1.file_path, cr.relationship_type, cr.confidence_score, dt.level + 1
        FROM code_relationships cr
        JOIN code_headers ch1 ON cr.source_header_id = ch1.id
        JOIN code_headers ch2 ON cr.target_header_id = ch2.id
        JOIN code_files cf1 ON ch1.file_id = cf1.id
        JOIN code_files cf2 ON ch2.file_id = cf2.id
        JOIN dependency_tree dt ON ${direction === 'source_file' ? 'cf1.file_path' : 'cf2.file_path'} = dt.file
        WHERE dt.level < $${params.length + 1}
    `;

    params.push(depth);

    if (type) {
      query += ` AND cr.relationship_type = $${params.length + 1}`;
      params.push(type);
    }

    query += `
      )
      SELECT DISTINCT * FROM dependency_tree 
      ORDER BY level, confidence DESC
    `;

    const result = await this.client.query(query, params);
    return result.rows;
  }

  async findCircularDependencies(maxDepth, type) {
    let query = `
      WITH RECURSIVE circular_check AS (
        SELECT cf1.file_path as source_file, cf2.file_path as target_file, cr.relationship_type, 
               ARRAY[cf1.file_path] as path, 1 as depth
        FROM code_relationships cr
        JOIN code_headers ch1 ON cr.source_header_id = ch1.id
        JOIN code_headers ch2 ON cr.target_header_id = ch2.id
        JOIN code_files cf1 ON ch1.file_id = cf1.id
        JOIN code_files cf2 ON ch2.file_id = cf2.id
        WHERE 1=1
    `;

    const params = [];
    
    if (type) {
      query += ` AND cr.relationship_type = $1`;
      params.push(type);
    }

    query += `
        UNION ALL
        SELECT cf1.file_path, cf2.file_path, cr.relationship_type,
               cc.path || cf1.file_path, cc.depth + 1
        FROM code_relationships cr
        JOIN code_headers ch1 ON cr.source_header_id = ch1.id
        JOIN code_headers ch2 ON cr.target_header_id = ch2.id
        JOIN code_files cf1 ON ch1.file_id = cf1.id
        JOIN code_files cf2 ON ch2.file_id = cf2.id
        JOIN circular_check cc ON cf1.file_path = cc.target_file
        WHERE cc.depth < $${params.length + 1}
          AND NOT (cf1.file_path = ANY(cc.path))
    `;

    params.push(maxDepth);

    if (type) {
      query += ` AND cr.relationship_type = $${params.length + 1}`;
      params.push(type);
    }

    query += `
      )
      SELECT DISTINCT path || target_file as cycle_path, depth + 1 as cycle_length
      FROM circular_check
      WHERE target_file = path[1]
      ORDER BY cycle_length, path
    `;

    const result = await this.client.query(query, params);
    return result.rows;
  }

  async findClusters(minSize, confidence) {
    const query = `
      WITH file_connections AS (
        SELECT cf1.file_path as file1, cf2.file_path as file2, cr.confidence_score as confidence
        FROM code_relationships cr
        JOIN code_headers ch1 ON cr.source_header_id = ch1.id
        JOIN code_headers ch2 ON cr.target_header_id = ch2.id
        JOIN code_files cf1 ON ch1.file_id = cf1.id
        JOIN code_files cf2 ON ch2.file_id = cf2.id
        WHERE cr.confidence_score >= $1
        UNION ALL
        SELECT cf2.file_path as file1, cf1.file_path as file2, cr.confidence_score as confidence
        FROM code_relationships cr
        JOIN code_headers ch1 ON cr.source_header_id = ch1.id
        JOIN code_headers ch2 ON cr.target_header_id = ch2.id
        JOIN code_files cf1 ON ch1.file_id = cf1.id
        JOIN code_files cf2 ON ch2.file_id = cf2.id
        WHERE cr.confidence_score >= $1
      ),
      cluster_candidates AS (
        SELECT file1, array_agg(DISTINCT file2) as connected_files,
               COUNT(DISTINCT file2) as connection_count
        FROM file_connections
        GROUP BY file1
        HAVING COUNT(DISTINCT file2) >= $2
      )
      SELECT file1 as cluster_center, connected_files, connection_count
      FROM cluster_candidates
      ORDER BY connection_count DESC
    `;

    const result = await this.client.query(query, [confidence, minSize]);
    return result.rows;
  }

  async findHotspots(metric, limit) {
    let query;
    
    switch (metric) {
      case 'in-degree':
        query = `
          SELECT cf2.file_path as file, COUNT(*) as degree, 
                 AVG(cr.confidence_score) as avg_confidence
          FROM code_relationships cr
          JOIN code_headers ch2 ON cr.target_header_id = ch2.id
          JOIN code_files cf2 ON ch2.file_id = cf2.id
          GROUP BY cf2.file_path 
          ORDER BY degree DESC 
          LIMIT $1
        `;
        break;
      case 'out-degree':
        query = `
          SELECT cf1.file_path as file, COUNT(*) as degree,
                 AVG(cr.confidence_score) as avg_confidence
          FROM code_relationships cr
          JOIN code_headers ch1 ON cr.source_header_id = ch1.id
          JOIN code_files cf1 ON ch1.file_id = cf1.id
          GROUP BY cf1.file_path 
          ORDER BY degree DESC 
          LIMIT $1
        `;
        break;
      default: // total
        query = `
          WITH all_connections AS (
            SELECT cf1.file_path as file, cr.confidence_score as confidence
            FROM code_relationships cr
            JOIN code_headers ch1 ON cr.source_header_id = ch1.id
            JOIN code_files cf1 ON ch1.file_id = cf1.id
            UNION ALL
            SELECT cf2.file_path as file, cr.confidence_score as confidence
            FROM code_relationships cr
            JOIN code_headers ch2 ON cr.target_header_id = ch2.id
            JOIN code_files cf2 ON ch2.file_id = cf2.id
          )
          SELECT file, COUNT(*) as degree, AVG(confidence) as avg_confidence
          FROM all_connections
          GROUP BY file
          ORDER BY degree DESC
          LIMIT $1
        `;
    }

    const result = await this.client.query(query, [limit]);
    return result.rows;
  }

  async findPaths(source, target, maxPaths, maxDepth) {
    const query = `
      WITH RECURSIVE path_finder AS (
        SELECT cf1.file_path as source_file, cf2.file_path as target_file, 
               cr.relationship_type, cr.confidence_score as confidence,
               ARRAY[cf1.file_path, cf2.file_path] as path, 1 as depth
        FROM code_relationships cr
        JOIN code_headers ch1 ON cr.source_header_id = ch1.id
        JOIN code_headers ch2 ON cr.target_header_id = ch2.id
        JOIN code_files cf1 ON ch1.file_id = cf1.id
        JOIN code_files cf2 ON ch2.file_id = cf2.id
        WHERE cf1.file_path LIKE $1
        
        UNION ALL
        
        SELECT cf1.file_path, cf2.file_path, cr.relationship_type, cr.confidence_score,
               pf.path || cf2.file_path, pf.depth + 1
        FROM code_relationships cr
        JOIN code_headers ch1 ON cr.source_header_id = ch1.id
        JOIN code_headers ch2 ON cr.target_header_id = ch2.id
        JOIN code_files cf1 ON ch1.file_id = cf1.id
        JOIN code_files cf2 ON ch2.file_id = cf2.id
        JOIN path_finder pf ON cf1.file_path = pf.target_file
        WHERE pf.depth < $3
          AND NOT (cf2.file_path = ANY(pf.path))
      )
      SELECT DISTINCT path, depth, 
             array_agg(relationship_type) as relationship_types,
             avg(confidence) as avg_confidence
      FROM path_finder
      WHERE target_file LIKE $2
      GROUP BY path, depth
      ORDER BY depth, avg_confidence DESC
      LIMIT $4
    `;

    const result = await this.client.query(query, [
      `%${source}%`, `%${target}%`, maxDepth, maxPaths
    ]);
    return result.rows;
  }

  async findOrphans(type) {
    let query = `
      SELECT DISTINCT cf.file_path
      FROM code_files cf
      WHERE NOT EXISTS (
        SELECT 1 FROM code_relationships cr
        JOIN code_headers ch1 ON cr.source_header_id = ch1.id
        JOIN code_headers ch2 ON cr.target_header_id = ch2.id
        JOIN code_files cf1 ON ch1.file_id = cf1.id
        JOIN code_files cf2 ON ch2.file_id = cf2.id
        WHERE cf1.file_path = cf.file_path OR cf2.file_path = cf.file_path
    `;

    const params = [];
    
    if (type) {
      query += ` AND cr.relationship_type = $1`;
      params.push(type);
    }

    query += `
      )
      ORDER BY cf.file_path
    `;

    const result = await this.client.query(query, params);
    return result.rows;
  }

  async calculateMetrics(file, detailed) {
    const baseQuery = file ? 
      `WHERE cf1.file_path LIKE '%${file}%' OR cf2.file_path LIKE '%${file}%'` : '';

    const queries = {
      totalRelationships: `
        SELECT COUNT(*) as count 
        FROM code_relationships cr
        JOIN code_headers ch1 ON cr.source_header_id = ch1.id
        JOIN code_headers ch2 ON cr.target_header_id = ch2.id
        JOIN code_files cf1 ON ch1.file_id = cf1.id
        JOIN code_files cf2 ON ch2.file_id = cf2.id
        ${baseQuery}
      `,
      avgConfidence: `
        SELECT AVG(cr.confidence_score) as avg 
        FROM code_relationships cr
        JOIN code_headers ch1 ON cr.source_header_id = ch1.id
        JOIN code_headers ch2 ON cr.target_header_id = ch2.id
        JOIN code_files cf1 ON ch1.file_id = cf1.id
        JOIN code_files cf2 ON ch2.file_id = cf2.id
        ${baseQuery}
      `,
      relationshipTypes: `
        SELECT cr.relationship_type, COUNT(*) as count 
        FROM code_relationships cr
        JOIN code_headers ch1 ON cr.source_header_id = ch1.id
        JOIN code_headers ch2 ON cr.target_header_id = ch2.id
        JOIN code_files cf1 ON ch1.file_id = cf1.id
        JOIN code_files cf2 ON ch2.file_id = cf2.id
        ${baseQuery}
        GROUP BY cr.relationship_type ORDER BY count DESC
      `
    };

    if (file) {
      queries.inDegree = `
        SELECT COUNT(*) as count 
        FROM code_relationships cr
        JOIN code_headers ch2 ON cr.target_header_id = ch2.id
        JOIN code_files cf2 ON ch2.file_id = cf2.id
        WHERE cf2.file_path LIKE '%${file}%'
      `;
      queries.outDegree = `
        SELECT COUNT(*) as count 
        FROM code_relationships cr
        JOIN code_headers ch1 ON cr.source_header_id = ch1.id
        JOIN code_files cf1 ON ch1.file_id = cf1.id
        WHERE cf1.file_path LIKE '%${file}%'
      `;
    }

    const results = {};
    for (const [key, query] of Object.entries(queries)) {
      results[key] = await this.client.query(query);
    }

    return results;
  }

  async analyzeImpact(file, depth, directOnly) {
    const query = directOnly ? `
      SELECT DISTINCT cf2.file_path as affected_file, cr.relationship_type, cr.confidence_score as confidence
      FROM code_relationships cr
      JOIN code_headers ch1 ON cr.source_header_id = ch1.id
      JOIN code_headers ch2 ON cr.target_header_id = ch2.id
      JOIN code_files cf1 ON ch1.file_id = cf1.id
      JOIN code_files cf2 ON ch2.file_id = cf2.id
      WHERE cf1.file_path LIKE $1
      ORDER BY cr.confidence_score DESC
    ` : `
      WITH RECURSIVE impact_analysis AS (
        SELECT cf2.file_path as affected_file, cr.relationship_type, cr.confidence_score as confidence, 1 as level
        FROM code_relationships cr
        JOIN code_headers ch1 ON cr.source_header_id = ch1.id
        JOIN code_headers ch2 ON cr.target_header_id = ch2.id
        JOIN code_files cf1 ON ch1.file_id = cf1.id
        JOIN code_files cf2 ON ch2.file_id = cf2.id
        WHERE cf1.file_path LIKE $1
        
        UNION ALL
        
        SELECT cf2.file_path, cr.relationship_type, cr.confidence_score, ia.level + 1
        FROM code_relationships cr
        JOIN code_headers ch1 ON cr.source_header_id = ch1.id
        JOIN code_headers ch2 ON cr.target_header_id = ch2.id
        JOIN code_files cf1 ON ch1.file_id = cf1.id
        JOIN code_files cf2 ON ch2.file_id = cf2.id
        JOIN impact_analysis ia ON cf1.file_path = ia.affected_file
        WHERE ia.level < $2
      )
      SELECT DISTINCT affected_file, 
             array_agg(DISTINCT relationship_type) as relationship_types,
             MIN(level) as min_level, AVG(confidence) as avg_confidence
      FROM impact_analysis
      GROUP BY affected_file
      ORDER BY min_level, avg_confidence DESC
    `;

    const params = [`%${file}%`];
    if (!directOnly) params.push(depth);

    const result = await this.client.query(query, params);
    return result.rows;
  }

  async generateSuggestions(category) {
    // Simplified suggestion generation
    const suggestions = [];
    
    // Find files with low relationship counts
    const lowConnectionQuery = `
      SELECT cf.file_path, 
             COALESCE(connection_count, 0) as connections
      FROM code_files cf
      LEFT JOIN (
        SELECT cf1.file_path as file, COUNT(*) as connection_count
        FROM code_relationships cr
        JOIN code_headers ch1 ON cr.source_header_id = ch1.id
        JOIN code_files cf1 ON ch1.file_id = cf1.id
        GROUP BY cf1.file_path
      ) r ON cf.file_path = r.file
      WHERE COALESCE(connection_count, 0) < 2
      ORDER BY connections
      LIMIT 10
    `;

    const lowConnections = await this.client.query(lowConnectionQuery);
    
    lowConnections.rows.forEach(row => {
      suggestions.push({
        type: 'missing',
        file: row.file_path,
        description: `File has only ${row.connections} relationships - may need more connections`,
        priority: 'medium'
      });
    });

    return suggestions;
  }

  // Display methods
  displayDependencyTree(dependencies, rootFile, reverse) {
    console.log(chalk.blue.bold(`\n${reverse ? 'Reverse Dependencies' : 'Dependencies'} for: ${rootFile}\n`));

    const tree = this.buildTree(dependencies, reverse);
    this.printTree(tree, '', true);
  }

  buildTree(dependencies, reverse) {
    const tree = {};
    dependencies.forEach(dep => {
      const key = reverse ? dep.depends_on : dep.file;
      const child = reverse ? dep.file : dep.depends_on;
      
      if (!tree[key]) tree[key] = [];
      if (!tree[key].includes(child)) {
        tree[key].push(child);
      }
    });
    return tree;
  }

  printTree(tree, prefix = '', isLast = true) {
    const keys = Object.keys(tree);
    keys.forEach((key, index) => {
      const isLastKey = index === keys.length - 1;
      console.log(prefix + (isLast ? '└── ' : '├── ') + chalk.cyan(key));
      
      if (tree[key] && tree[key].length > 0) {
        tree[key].forEach((child, childIndex) => {
          const isLastChild = childIndex === tree[key].length - 1;
          const newPrefix = prefix + (isLast ? '    ' : '│   ');
          console.log(newPrefix + (isLastChild ? '└── ' : '├── ') + chalk.yellow(child));
        });
      }
    });
  }

  displayCircularDependencies(circles) {
    console.log(chalk.red.bold('\n🔄 Circular Dependencies Detected:\n'));

    const table = new Table({
      head: ['Cycle Length', 'Circular Path'],
      colWidths: [15, 80]
    });

    circles.forEach(circle => {
      const pathStr = circle.cycle_path.join(' → ');
      table.push([
        chalk.red(circle.cycle_length),
        chalk.yellow(pathStr)
      ]);
    });

    console.log(table.toString());
  }

  displayClusters(clusters) {
    console.log(chalk.blue.bold('\n🔗 Code Clusters:\n'));

    const table = new Table({
      head: ['Cluster Center', 'Connections', 'Connected Files'],
      colWidths: [35, 12, 65]
    });

    clusters.forEach(cluster => {
      const files = cluster.connected_files.slice(0, 3).join(', ');
      table.push([
        chalk.cyan(cluster.cluster_center),
        chalk.green(cluster.connection_count),
        chalk.yellow(files + (cluster.connected_files.length > 3 ? '...' : ''))
      ]);
    });

    console.log(table.toString());
  }

  displayHotspots(hotspots, metric) {
    console.log(chalk.red.bold(`\n🔥 Relationship Hotspots (${metric}):\n`));

    const table = new Table({
      head: ['File', 'Degree', 'Avg Confidence'],
      colWidths: [50, 12, 18]
    });

    hotspots.forEach(hotspot => {
      table.push([
        chalk.cyan(hotspot.file),
        chalk.red(hotspot.degree),
        chalk.green(hotspot.avg_confidence.toFixed(2))
      ]);
    });

    console.log(table.toString());
  }

  displayPaths(paths, source, target) {
    console.log(chalk.blue.bold(`\n🛤️  Paths from ${source} to ${target}:\n`));

    paths.forEach((path, index) => {
      console.log(chalk.green(`Path ${index + 1} (length ${path.depth}):`));
      console.log(chalk.cyan(path.path.join(' → ')));
      console.log(chalk.yellow(`Confidence: ${path.avg_confidence.toFixed(2)}\n`));
    });
  }

  displayOrphans(orphans) {
    console.log(chalk.yellow.bold('\n👤 Orphaned Files:\n'));

    orphans.forEach(orphan => {
      console.log(chalk.cyan(`• ${orphan.file_path}`));
    });
  }

  displayMetrics(metrics, file, detailed) {
    console.log(chalk.blue.bold(`\n📊 Relationship Metrics${file ? ` for ${file}` : ''}:\n`));

    const summary = [
      ['Total Relationships', metrics.totalRelationships.rows[0].count],
      ['Average Confidence', metrics.avgConfidence.rows[0].avg?.toFixed(2) || 'N/A']
    ];

    if (file && metrics.inDegree && metrics.outDegree) {
      summary.push(['In-Degree', metrics.inDegree.rows[0].count]);
      summary.push(['Out-Degree', metrics.outDegree.rows[0].count]);
    }

    const table = new Table();
    summary.forEach(([metric, value]) => {
      table.push({ [metric]: value });
    });

    console.log(table.toString());

    if (detailed && metrics.relationshipTypes.rows.length > 0) {
      console.log(chalk.blue.bold('\nRelationship Types:'));
      const typeTable = new Table({
        head: ['Type', 'Count']
      });
      
      metrics.relationshipTypes.rows.forEach(row => {
        typeTable.push([row.relationship_type, row.count]);
      });
      
      console.log(typeTable.toString());
    }
  }

  displayImpact(impact, file) {
    console.log(chalk.red.bold(`\n💥 Impact Analysis for ${file}:\n`));

    if (impact.length === 0) {
      console.log(chalk.green('No impact detected - file is isolated'));
      return;
    }

    const table = new Table({
      head: ['Affected File', 'Relationship Types', 'Level', 'Confidence'],
      colWidths: [40, 25, 8, 12]
    });

    impact.forEach(item => {
      const types = Array.isArray(item.relationship_types) ? 
        item.relationship_types.join(', ') : item.relationship_type;
      
      table.push([
        chalk.cyan(item.affected_file),
        chalk.yellow(types),
        chalk.blue(item.min_level || '1'),
        chalk.green((item.avg_confidence || item.confidence).toFixed(2))
      ]);
    });

    console.log(table.toString());
  }

  displaySuggestions(suggestions) {
    console.log(chalk.green.bold('\n💡 Relationship Suggestions:\n'));

    if (suggestions.length === 0) {
      console.log(chalk.blue('No suggestions available'));
      return;
    }

    const table = new Table({
      head: ['Type', 'File', 'Description', 'Priority'],
      colWidths: [12, 35, 50, 10]
    });

    suggestions.forEach(suggestion => {
      const priorityColor = suggestion.priority === 'high' ? chalk.red : 
                           suggestion.priority === 'medium' ? chalk.yellow : chalk.blue;
      
      table.push([
        chalk.magenta(suggestion.type),
        chalk.cyan(suggestion.file),
        suggestion.description,
        priorityColor(suggestion.priority)
      ]);
    });

    console.log(table.toString());
  }

  async run() {
    await this.program.parseAsync(process.argv);
  }
}

// CLI execution
if (require.main === module) {
  const cli = new RelationshipAnalyzer();
  cli.run().catch(console.error);
}

module.exports = RelationshipAnalyzer;
