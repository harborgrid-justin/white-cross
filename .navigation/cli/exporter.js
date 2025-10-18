#!/usr/bin/env node

/**
 * Data Export CLI Tool
 * Export navigation data in various formats
 */

const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');
const ora = require('ora');
const { Client } = require('pg');

class DataExporter {
  constructor() {
    this.client = new Client({
      connectionString: process.env.DATABASE_URL
    });
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
      .name('exporter')
      .description('Export navigation data in various formats')
      .version('1.0.0');

    this.program
      .command('json [table]')
      .description('Export data as JSON')
      .option('-o, --output <file>', 'Output file', 'export.json')
      .option('-f, --filter <filter>', 'Filter criteria (SQL WHERE clause)')
      .option('-l, --limit <number>', 'Limit results')
      .action(async (table, options) => {
        await this.handleJSON(table, options);
      });

    this.program
      .command('csv [table]')
      .description('Export data as CSV')
      .option('-o, --output <file>', 'Output file', 'export.csv')
      .option('-f, --filter <filter>', 'Filter criteria (SQL WHERE clause)')
      .option('-l, --limit <number>', 'Limit results')
      .action(async (table, options) => {
        await this.handleCSV(table, options);
      });

    this.program
      .command('sql [table]')
      .description('Export data as SQL INSERT statements')
      .option('-o, --output <file>', 'Output file', 'export.sql')
      .option('-f, --filter <filter>', 'Filter criteria (SQL WHERE clause)')
      .option('-l, --limit <number>', 'Limit results')
      .action(async (table, options) => {
        await this.handleSQL(table, options);
      });

    this.program
      .command('backup')
      .description('Create complete database backup')
      .option('-o, --output <file>', 'Output file', 'navigation_backup.json')
      .option('--include-embeddings', 'Include embeddings data', false)
      .action(async (options) => {
        await this.handleBackup(options);
      });

    this.program
      .command('stats')
      .description('Export system statistics')
      .option('-o, --output <file>', 'Output file', 'stats.json')
      .option('-f, --format <format>', 'Format (json|csv)', 'json')
      .action(async (options) => {
        await this.handleStats(options);
      });

    this.program
      .command('relationships')
      .description('Export relationship graph data')
      .option('-o, --output <file>', 'Output file', 'relationships.json')
      .option('-f, --format <format>', 'Format (json|graphml|dot)', 'json')
      .option('-t, --type <type>', 'Relationship type filter')
      .action(async (options) => {
        await this.handleRelationships(options);
      });

    this.program
      .command('embeddings')
      .description('Export embeddings for machine learning')
      .option('-o, --output <file>', 'Output file', 'embeddings.json')
      .option('-f, --format <format>', 'Format (json|npy|csv)', 'json')
      .option('--include-vectors', 'Include vector data', false)
      .action(async (options) => {
        await this.handleEmbeddings(options);
      });

    this.program
      .command('report')
      .description('Generate comprehensive navigation report')
      .option('-o, --output <file>', 'Output file', 'navigation_report.html')
      .option('-t, --template <template>', 'Report template (html|markdown)', 'html')
      .action(async (options) => {
        await this.handleReport(options);
      });
  }

  async handleJSON(table = 'all', options) {
    const spinner = ora('Exporting JSON data...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      let data = {};

      if (table === 'all' || table === 'embeddings') {
        data.embeddings = await this.getTableData('embeddings', options);
      }

      if (table === 'all' || table === 'relationships') {
        data.relationships = await this.getTableData('relationships', options);
      }

      if (table !== 'all' && table !== 'embeddings' && table !== 'relationships') {
        data[table] = await this.getTableData(table, options);
      }

      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(options.output, jsonData);

      spinner.succeed(`JSON data exported to ${options.output}`);
      console.log(chalk.green(`📄 File size: ${(jsonData.length / 1024).toFixed(2)} KB`));

    } catch (error) {
      spinner.fail('JSON export failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleCSV(table = 'embeddings', options) {
    const spinner = ora('Exporting CSV data...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const data = await this.getTableData(table, options);
      
      if (data.length === 0) {
        spinner.warn('No data to export');
        return;
      }

      const headers = Object.keys(data[0]);
      let csvContent = headers.join(',') + '\n';

      data.forEach(row => {
        const values = headers.map(header => {
          let value = row[header];
          if (typeof value === 'string') {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        });
        csvContent += values.join(',') + '\n';
      });

      await fs.writeFile(options.output, csvContent);

      spinner.succeed(`CSV data exported to ${options.output}`);
      console.log(chalk.green(`📊 Rows exported: ${data.length}`));

    } catch (error) {
      spinner.fail('CSV export failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleSQL(table = 'embeddings', options) {
    const spinner = ora('Exporting SQL data...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const data = await this.getTableData(table, options);
      
      if (data.length === 0) {
        spinner.warn('No data to export');
        return;
      }

      const headers = Object.keys(data[0]);
      let sqlContent = `-- SQL Export for table: ${table}\n`;
      sqlContent += `-- Generated on: ${new Date().toISOString()}\n\n`;

      data.forEach(row => {
        const columns = headers.join(', ');
        const values = headers.map(header => {
          let value = row[header];
          if (value === null || value === undefined) {
            return 'NULL';
          }
          if (typeof value === 'string') {
            return `'${value.replace(/'/g, "''")}'`;
          }
          if (Array.isArray(value)) {
            return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
          }
          return value;
        }).join(', ');

        sqlContent += `INSERT INTO ${table} (${columns}) VALUES (${values});\n`;
      });

      await fs.writeFile(options.output, sqlContent);

      spinner.succeed(`SQL data exported to ${options.output}`);
      console.log(chalk.green(`💾 Statements generated: ${data.length}`));

    } catch (error) {
      spinner.fail('SQL export failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleBackup(options) {
    const spinner = ora('Creating database backup...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const backup = {
        metadata: {
          created: new Date().toISOString(),
          version: '1.0.0',
          tables: ['relationships']
        },
        data: {}
      };

      // Always include relationships
      backup.data.relationships = await this.getTableData('relationships');

      // Include embeddings if requested
      if (options.includeEmbeddings) {
        backup.data.embeddings = await this.getTableData('embeddings');
        backup.metadata.tables.push('embeddings');
      }

      // Get schema information
      const schemaQuery = `
        SELECT table_name, column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name IN ('embeddings', 'relationships')
        ORDER BY table_name, ordinal_position
      `;

      const schemaResult = await this.client.query(schemaQuery);
      backup.schema = schemaResult.rows;

      const backupData = JSON.stringify(backup, null, 2);
      await fs.writeFile(options.output, backupData);

      spinner.succeed(`Database backup created: ${options.output}`);
      console.log(chalk.green(`📦 Tables backed up: ${backup.metadata.tables.join(', ')}`));
      console.log(chalk.green(`📄 File size: ${(backupData.length / 1024).toFixed(2)} KB`));

    } catch (error) {
      spinner.fail('Backup failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleStats(options) {
    const spinner = ora('Generating statistics...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const stats = {
        generated: new Date().toISOString(),
        embeddings: {
          total: 0,
          byFileType: [],
          avgSnippetLength: 0
        },
        relationships: {
          total: 0,
          byType: [],
          avgConfidence: 0
        },
        files: {
          totalAnalyzed: 0,
          topDirectories: []
        }
      };

      // Embeddings stats
      const embeddingsStats = await this.client.query(`
        SELECT 
          COUNT(*) as total,
          AVG(LENGTH(content_snippet)) as avg_length
        FROM embeddings
      `);
      stats.embeddings.total = parseInt(embeddingsStats.rows[0].total);
      stats.embeddings.avgSnippetLength = parseFloat(embeddingsStats.rows[0].avg_length || 0);

      // File types
      const fileTypes = await this.client.query(`
        SELECT 
          SUBSTRING(file_path FROM '\\.([^.]+)$') as extension,
          COUNT(*) as count
        FROM embeddings 
        GROUP BY extension 
        ORDER BY count DESC 
        LIMIT 10
      `);
      stats.embeddings.byFileType = fileTypes.rows;

      // Relationships stats
      const relationshipsStats = await this.client.query(`
        SELECT 
          COUNT(*) as total,
          AVG(confidence) as avg_confidence
        FROM relationships
      `);
      stats.relationships.total = parseInt(relationshipsStats.rows[0].total);
      stats.relationships.avgConfidence = parseFloat(relationshipsStats.rows[0].avg_confidence || 0);

      // Relationship types
      const relationshipTypes = await this.client.query(`
        SELECT 
          relationship_type,
          COUNT(*) as count
        FROM relationships 
        GROUP BY relationship_type 
        ORDER BY count DESC
      `);
      stats.relationships.byType = relationshipTypes.rows;

      // File analysis
      const filesAnalyzed = await this.client.query(`
        SELECT COUNT(DISTINCT file_path) as total FROM embeddings
      `);
      stats.files.totalAnalyzed = parseInt(filesAnalyzed.rows[0].total);

      if (options.format === 'csv') {
        await this.exportStatsAsCSV(stats, options.output);
      } else {
        const statsData = JSON.stringify(stats, null, 2);
        await fs.writeFile(options.output, statsData);
      }

      spinner.succeed(`Statistics exported to ${options.output}`);

    } catch (error) {
      spinner.fail('Statistics export failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleRelationships(options) {
    const spinner = ora('Exporting relationships...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      let query = 'SELECT * FROM relationships';
      const params = [];

      if (options.type) {
        query += ' WHERE relationship_type = $1';
        params.push(options.type);
      }

      query += ' ORDER BY confidence DESC';

      const result = await this.client.query(query, params);

      if (options.format === 'graphml') {
        await this.exportAsGraphML(result.rows, options.output);
      } else if (options.format === 'dot') {
        await this.exportAsDOT(result.rows, options.output);
      } else {
        // JSON format
        const graphData = {
          nodes: this.extractNodes(result.rows),
          edges: result.rows.map(row => ({
            source: row.source_file,
            target: row.target_file,
            type: row.relationship_type,
            confidence: row.confidence
          }))
        };

        await fs.writeFile(options.output, JSON.stringify(graphData, null, 2));
      }

      spinner.succeed(`Relationships exported to ${options.output}`);

    } catch (error) {
      spinner.fail('Relationships export failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleEmbeddings(options) {
    const spinner = ora('Exporting embeddings...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      let query = 'SELECT file_path, content_snippet, chunk_index';
      
      if (options.includeVectors) {
        query += ', simple_embedding, openai_embedding';
      }
      
      query += ' FROM embeddings ORDER BY file_path, chunk_index';

      const result = await this.client.query(query);

      if (options.format === 'csv') {
        await this.handleCSV('embeddings', { ...options, filter: null, limit: null });
      } else {
        // JSON format
        const embeddingsData = {
          metadata: {
            count: result.rows.length,
            includeVectors: options.includeVectors,
            exported: new Date().toISOString()
          },
          embeddings: result.rows
        };

        await fs.writeFile(options.output, JSON.stringify(embeddingsData, null, 2));
      }

      spinner.succeed(`Embeddings exported to ${options.output}`);

    } catch (error) {
      spinner.fail('Embeddings export failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleReport(options) {
    const spinner = ora('Generating navigation report...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      // Collect comprehensive data for report
      const reportData = await this.collectReportData();

      if (options.template === 'html') {
        await this.generateHTMLReport(reportData, options.output);
      } else {
        await this.generateMarkdownReport(reportData, options.output);
      }

      spinner.succeed(`Navigation report generated: ${options.output}`);

    } catch (error) {
      spinner.fail('Report generation failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  // Helper methods
  async getTableData(table, options = {}) {
    let query = `SELECT * FROM ${table}`;
    const params = [];

    if (options.filter) {
      query += ` WHERE ${options.filter}`;
    }

    if (options.limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(parseInt(options.limit));
    }

    const result = await this.client.query(query, params);
    return result.rows;
  }

  extractNodes(relationships) {
    const nodeSet = new Set();
    relationships.forEach(rel => {
      nodeSet.add(rel.source_file);
      nodeSet.add(rel.target_file);
    });

    return Array.from(nodeSet).map(file => ({
      id: file,
      label: path.basename(file),
      path: file
    }));
  }

  async exportAsGraphML(relationships, filename) {
    const nodes = this.extractNodes(relationships);
    
    let graphml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    graphml += '<graphml xmlns="http://graphml.graphdrawing.org/xmlns">\n';
    graphml += '  <key id="label" for="node" attr.name="label" attr.type="string"/>\n';
    graphml += '  <key id="type" for="edge" attr.name="type" attr.type="string"/>\n';
    graphml += '  <key id="confidence" for="edge" attr.name="confidence" attr.type="double"/>\n';
    graphml += '  <graph id="code_navigation" edgedefault="directed">\n';

    // Add nodes
    nodes.forEach((node, index) => {
      graphml += `    <node id="n${index}">\n`;
      graphml += `      <data key="label">${node.label}</data>\n`;
      graphml += '    </node>\n';
    });

    // Add edges
    relationships.forEach((rel, index) => {
      const sourceIndex = nodes.findIndex(n => n.path === rel.source_file);
      const targetIndex = nodes.findIndex(n => n.path === rel.target_file);
      
      graphml += `    <edge id="e${index}" source="n${sourceIndex}" target="n${targetIndex}">\n`;
      graphml += `      <data key="type">${rel.relationship_type}</data>\n`;
      graphml += `      <data key="confidence">${rel.confidence}</data>\n`;
      graphml += '    </edge>\n';
    });

    graphml += '  </graph>\n';
    graphml += '</graphml>\n';

    await fs.writeFile(filename, graphml);
  }

  async exportAsDOT(relationships, filename) {
    const nodes = this.extractNodes(relationships);
    
    let dot = 'digraph code_navigation {\n';
    dot += '  rankdir=LR;\n';
    dot += '  node [shape=box];\n\n';

    // Add nodes
    nodes.forEach((node, index) => {
      dot += `  n${index} [label="${node.label}"];\n`;
    });

    dot += '\n';

    // Add edges
    relationships.forEach(rel => {
      const sourceIndex = nodes.findIndex(n => n.path === rel.source_file);
      const targetIndex = nodes.findIndex(n => n.path === rel.target_file);
      
      dot += `  n${sourceIndex} -> n${targetIndex} [label="${rel.relationship_type}" weight=${rel.confidence}];\n`;
    });

    dot += '}\n';

    await fs.writeFile(filename, dot);
  }

  async exportStatsAsCSV(stats, filename) {
    let csvContent = 'Metric,Value\n';
    csvContent += `Total Embeddings,${stats.embeddings.total}\n`;
    csvContent += `Avg Snippet Length,${stats.embeddings.avgSnippetLength.toFixed(2)}\n`;
    csvContent += `Total Relationships,${stats.relationships.total}\n`;
    csvContent += `Avg Confidence,${stats.relationships.avgConfidence.toFixed(2)}\n`;
    csvContent += `Files Analyzed,${stats.files.totalAnalyzed}\n`;

    await fs.writeFile(filename, csvContent);
  }

  async collectReportData() {
    // Implementation for collecting comprehensive report data
    return {
      summary: {
        embeddings: await this.client.query('SELECT COUNT(*) as count FROM embeddings'),
        relationships: await this.client.query('SELECT COUNT(*) as count FROM relationships'),
        files: await this.client.query('SELECT COUNT(DISTINCT file_path) as count FROM embeddings')
      }
    };
  }

  async generateHTMLReport(data, filename) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Navigation System Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 20px; }
        .metric { display: inline-block; margin: 20px; padding: 15px; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Code Navigation System Report</h1>
        <p>Generated on: ${new Date().toISOString()}</p>
    </div>
    
    <div class="metrics">
        <div class="metric">
            <h3>Embeddings</h3>
            <p>${data.summary.embeddings.rows[0].count}</p>
        </div>
        <div class="metric">
            <h3>Relationships</h3>
            <p>${data.summary.relationships.rows[0].count}</p>
        </div>
        <div class="metric">
            <h3>Files Analyzed</h3>
            <p>${data.summary.files.rows[0].count}</p>
        </div>
    </div>
</body>
</html>
    `;

    await fs.writeFile(filename, html);
  }

  async generateMarkdownReport(data, filename) {
    const markdown = `
# Code Navigation System Report

Generated on: ${new Date().toISOString()}

## Summary

- **Embeddings**: ${data.summary.embeddings.rows[0].count}
- **Relationships**: ${data.summary.relationships.rows[0].count}
- **Files Analyzed**: ${data.summary.files.rows[0].count}

## System Status

The navigation system is operational with comprehensive code analysis capabilities.
    `;

    await fs.writeFile(filename, markdown);
  }

  async run() {
    await this.program.parseAsync(process.argv);
  }
}

// CLI execution
if (require.main === module) {
  const cli = new DataExporter();
  cli.run().catch(console.error);
}

module.exports = DataExporter;
