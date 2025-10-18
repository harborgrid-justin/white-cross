#!/usr/bin/env node

/**
 * Enterprise Navigation CLI Tool
 * Provides command-line access to intelligent code navigation system
 */

const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const Table = require('cli-table3');
const ora = require('ora');
const path = require('path');
const { Client } = require('pg');

class NavigationCLI {
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
      .name('navigator')
      .description('Enterprise Code Navigation CLI')
      .version('1.0.0');

    this.program
      .command('search <query>')
      .description('Search code using semantic similarity')
      .option('-l, --limit <number>', 'Limit results', '10')
      .option('-t, --threshold <number>', 'Similarity threshold', '0.7')
      .option('-f, --format <type>', 'Output format (table|json|simple)', 'table')
      .action(async (query, options) => {
        await this.handleSearch(query, options);
      });

    this.program
      .command('navigate <file>')
      .description('Find related files and code patterns')
      .option('-d, --depth <number>', 'Relationship depth', '2')
      .option('-t, --types <types>', 'Relationship types (comma-separated)')
      .action(async (file, options) => {
        await this.handleNavigate(file, options);
      });

    this.program
      .command('patterns [directory]')
      .description('Discover code patterns in directory')
      .option('-m, --min-occurrences <number>', 'Minimum pattern occurrences', '3')
      .action(async (directory, options) => {
        await this.handlePatterns(directory, options);
      });

    this.program
      .command('relationships')
      .description('Analyze code relationships')
      .option('-f, --file <file>', 'Focus on specific file')
      .option('-t, --type <type>', 'Relationship type filter')
      .action(async (options) => {
        await this.handleRelationships(options);
      });

    this.program
      .command('stats')
      .description('Show navigation system statistics')
      .action(async () => {
        await this.handleStats();
      });

    this.program
      .command('interactive')
      .alias('i')
      .description('Start interactive navigation session')
      .action(async () => {
        await this.handleInteractive();
      });

    this.program
      .command('export <format>')
      .description('Export navigation data (json|csv|sql)')
      .option('-o, --output <file>', 'Output file')
      .option('-f, --filter <filter>', 'Data filter (embeddings|relationships|all)', 'all')
      .action(async (format, options) => {
        await this.handleExport(format, options);
      });
  }

  async handleSearch(query, options) {
    const spinner = ora('Searching code...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const limit = parseInt(options.limit);
      const threshold = parseFloat(options.threshold);

      // Simple text search for now (can be enhanced with embeddings)
      const searchQuery = `
        SELECT file_path, content_snippet, 
               CASE 
                 WHEN content_snippet ILIKE $1 THEN 1.0
                 WHEN content_snippet ILIKE $2 THEN 0.8
                 ELSE 0.6
               END as similarity
        FROM embeddings 
        WHERE content_snippet ILIKE $2
        ORDER BY similarity DESC 
        LIMIT $3
      `;

      const result = await this.client.query(searchQuery, [
        `%${query}%`,
        `%${query}%`,
        limit
      ]);

      spinner.succeed(`Found ${result.rows.length} results`);

      if (result.rows.length === 0) {
        console.log(chalk.yellow('No results found'));
        return;
      }

      this.displaySearchResults(result.rows, options.format);

    } catch (error) {
      spinner.fail('Search failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleNavigate(file, options) {
    const spinner = ora(`Analyzing relationships for ${file}...`).start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const depth = parseInt(options.depth);
      const types = options.types ? options.types.split(',') : null;

      let relationshipQuery = `
        SELECT DISTINCT r.target_file, r.relationship_type, r.confidence
        FROM relationships r
        WHERE r.source_file LIKE $1
      `;

      const params = [`%${file}%`];

      if (types) {
        relationshipQuery += ` AND r.relationship_type = ANY($2)`;
        params.push(types);
      }

      relationshipQuery += ` ORDER BY r.confidence DESC`;

      const result = await this.client.query(relationshipQuery, params);

      spinner.succeed(`Found ${result.rows.length} related files`);

      if (result.rows.length === 0) {
        console.log(chalk.yellow('No relationships found'));
        return;
      }

      this.displayNavigationResults(result.rows);

    } catch (error) {
      spinner.fail('Navigation failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handlePatterns(directory = '.', options) {
    const spinner = ora('Discovering patterns...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const minOccurrences = parseInt(options.minOccurrences);

      const patternQuery = `
        SELECT 
          pattern_type,
          COUNT(*) as occurrences,
          array_agg(DISTINCT file_path) as files
        FROM (
          SELECT 
            file_path,
            CASE 
              WHEN content_snippet LIKE '%function%' THEN 'function'
              WHEN content_snippet LIKE '%class%' THEN 'class'
              WHEN content_snippet LIKE '%import%' THEN 'import'
              WHEN content_snippet LIKE '%export%' THEN 'export'
              WHEN content_snippet LIKE '%const%' THEN 'constant'
              WHEN content_snippet LIKE '%useState%' THEN 'react_hook'
              WHEN content_snippet LIKE '%useEffect%' THEN 'react_effect'
              ELSE 'other'
            END as pattern_type
          FROM embeddings
          WHERE file_path LIKE $1
        ) patterns
        GROUP BY pattern_type
        HAVING COUNT(*) >= $2
        ORDER BY occurrences DESC
      `;

      const result = await this.client.query(patternQuery, [
        `%${directory}%`,
        minOccurrences
      ]);

      spinner.succeed(`Found ${result.rows.length} patterns`);
      this.displayPatternResults(result.rows);

    } catch (error) {
      spinner.fail('Pattern discovery failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleRelationships(options) {
    const spinner = ora('Analyzing relationships...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      let query = `
        SELECT 
          relationship_type,
          COUNT(*) as count,
          AVG(confidence) as avg_confidence
        FROM relationships
      `;

      const params = [];

      if (options.file) {
        query += ` WHERE source_file LIKE $1`;
        params.push(`%${options.file}%`);
      }

      if (options.type) {
        const whereClause = options.file ? ' AND' : ' WHERE';
        query += `${whereClause} relationship_type = $${params.length + 1}`;
        params.push(options.type);
      }

      query += ` GROUP BY relationship_type ORDER BY count DESC`;

      const result = await this.client.query(query, params);

      spinner.succeed('Relationship analysis complete');
      this.displayRelationshipAnalysis(result.rows);

    } catch (error) {
      spinner.fail('Analysis failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleStats() {
    const spinner = ora('Gathering statistics...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const statsQueries = {
        totalEmbeddings: 'SELECT COUNT(*) as count FROM embeddings',
        totalRelationships: 'SELECT COUNT(*) as count FROM relationships',
        fileTypes: `
          SELECT 
            SUBSTRING(file_path FROM '\\.([^.]+)$') as extension,
            COUNT(*) as count
          FROM embeddings 
          GROUP BY extension 
          ORDER BY count DESC 
          LIMIT 10
        `,
        relationshipTypes: `
          SELECT 
            relationship_type,
            COUNT(*) as count
          FROM relationships 
          GROUP BY relationship_type 
          ORDER BY count DESC
        `
      };

      const results = {};
      for (const [key, query] of Object.entries(statsQueries)) {
        results[key] = await this.client.query(query);
      }

      spinner.succeed('Statistics collected');
      this.displayStats(results);

    } catch (error) {
      spinner.fail('Statistics collection failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleInteractive() {
    console.log(chalk.blue.bold('\n🧭 Interactive Navigation Session\n'));

    if (!await this.connect()) {
      console.log(chalk.red('Cannot start interactive session - database connection failed'));
      return;
    }

    try {
      while (true) {
        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
              { name: '🔍 Search code', value: 'search' },
              { name: '🗺️  Navigate relationships', value: 'navigate' },
              { name: '📊 View patterns', value: 'patterns' },
              { name: '📈 Show statistics', value: 'stats' },
              { name: '❌ Exit', value: 'exit' }
            ]
          }
        ]);

        if (action === 'exit') break;

        await this.handleInteractiveAction(action);
        
        const { continue: shouldContinue } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'continue',
            message: 'Continue?',
            default: true
          }
        ]);

        if (!shouldContinue) break;
      }
    } catch (error) {
      console.error(chalk.red('Interactive session error:'), error.message);
    } finally {
      await this.disconnect();
    }

    console.log(chalk.green('\nGoodbye! 👋'));
  }

  async handleInteractiveAction(action) {
    switch (action) {
      case 'search':
        const { query } = await inquirer.prompt([
          { type: 'input', name: 'query', message: 'Enter search query:' }
        ]);
        await this.handleSearch(query, { limit: '5', format: 'table' });
        break;

      case 'navigate':
        const { file } = await inquirer.prompt([
          { type: 'input', name: 'file', message: 'Enter file name:' }
        ]);
        await this.handleNavigate(file, { depth: '2' });
        break;

      case 'patterns':
        await this.handlePatterns('.', { minOccurrences: '3' });
        break;

      case 'stats':
        await this.handleStats();
        break;
    }
  }

  async handleExport(format, options) {
    const spinner = ora(`Exporting data as ${format}...`).start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      // Implementation for export functionality
      spinner.succeed(`Export functionality will be implemented for ${format} format`);
    } catch (error) {
      spinner.fail('Export failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  displaySearchResults(results, format) {
    if (format === 'json') {
      console.log(JSON.stringify(results, null, 2));
      return;
    }

    if (format === 'simple') {
      results.forEach(row => {
        console.log(`${chalk.cyan(row.file_path)} (${row.similarity})`);
        console.log(`  ${row.content_snippet.substring(0, 100)}...`);
      });
      return;
    }

    // Table format (default)
    const table = new Table({
      head: ['File', 'Similarity', 'Content'],
      colWidths: [40, 12, 60]
    });

    results.forEach(row => {
      table.push([
        chalk.cyan(row.file_path),
        chalk.green(row.similarity.toFixed(2)),
        row.content_snippet.substring(0, 50) + '...'
      ]);
    });

    console.log(table.toString());
  }

  displayNavigationResults(results) {
    const table = new Table({
      head: ['Related File', 'Relationship', 'Confidence'],
      colWidths: [50, 20, 12]
    });

    results.forEach(row => {
      table.push([
        chalk.cyan(row.target_file),
        chalk.yellow(row.relationship_type),
        chalk.green(row.confidence.toFixed(2))
      ]);
    });

    console.log(table.toString());
  }

  displayPatternResults(results) {
    const table = new Table({
      head: ['Pattern Type', 'Occurrences', 'Sample Files'],
      colWidths: [20, 15, 65]
    });

    results.forEach(row => {
      const sampleFiles = row.files.slice(0, 3).join(', ');
      table.push([
        chalk.magenta(row.pattern_type),
        chalk.green(row.occurrences),
        chalk.cyan(sampleFiles + (row.files.length > 3 ? '...' : ''))
      ]);
    });

    console.log(table.toString());
  }

  displayRelationshipAnalysis(results) {
    const table = new Table({
      head: ['Relationship Type', 'Count', 'Avg Confidence'],
      colWidths: [25, 12, 18]
    });

    results.forEach(row => {
      table.push([
        chalk.blue(row.relationship_type),
        chalk.green(row.count),
        chalk.yellow(row.avg_confidence.toFixed(2))
      ]);
    });

    console.log(table.toString());
  }

  displayStats(results) {
    console.log(chalk.blue.bold('\n📊 Navigation System Statistics\n'));

    console.log(chalk.green(`Total Embeddings: ${results.totalEmbeddings.rows[0].count}`));
    console.log(chalk.green(`Total Relationships: ${results.totalRelationships.rows[0].count}\n`));

    console.log(chalk.blue.bold('File Types:'));
    const fileTypesTable = new Table({
      head: ['Extension', 'Count']
    });
    results.fileTypes.rows.forEach(row => {
      fileTypesTable.push([row.extension || 'no extension', row.count]);
    });
    console.log(fileTypesTable.toString());

    console.log(chalk.blue.bold('\nRelationship Types:'));
    const relationshipsTable = new Table({
      head: ['Type', 'Count']
    });
    results.relationshipTypes.rows.forEach(row => {
      relationshipsTable.push([row.relationship_type, row.count]);
    });
    console.log(relationshipsTable.toString());
  }

  async run() {
    await this.program.parseAsync(process.argv);
  }
}

// CLI execution
if (require.main === module) {
  const cli = new NavigationCLI();
  cli.run().catch(console.error);
}

module.exports = NavigationCLI;
