#!/usr/bin/env node

/**
 * Advanced Pattern Discovery CLI Tool
 * Specialized tool for discovering and analyzing code patterns
 */

const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');
const Table = require('cli-table3');
const ora = require('ora');
const { Client } = require('pg');

class PatternFinder {
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
      .name('pattern-finder')
      .description('Advanced Code Pattern Discovery Tool')
      .version('1.0.0');

    this.program
      .command('functions [directory]')
      .description('Find function patterns and signatures')
      .option('-t, --type <type>', 'Function type (arrow|regular|async|export)', 'all')
      .option('-m, --min-params <number>', 'Minimum parameters', '0')
      .option('-x, --max-params <number>', 'Maximum parameters', '10')
      .action(async (directory, options) => {
        await this.handleFunctions(directory, options);
      });

    this.program
      .command('imports [directory]')
      .description('Analyze import patterns and dependencies')
      .option('-s, --source <source>', 'Filter by import source')
      .option('-t, --type <type>', 'Import type (default|named|namespace)', 'all')
      .action(async (directory, options) => {
        await this.handleImports(directory, options);
      });

    this.program
      .command('react [directory]')
      .description('Find React-specific patterns')
      .option('-c, --component-type <type>', 'Component type (functional|class)', 'all')
      .option('-h, --hooks', 'Focus on hooks usage')
      .action(async (directory, options) => {
        await this.handleReact(directory, options);
      });

    this.program
      .command('api [directory]')
      .description('Discover API and endpoint patterns')
      .option('-m, --method <method>', 'HTTP method filter')
      .option('-p, --path-pattern <pattern>', 'Path pattern to match')
      .action(async (directory, options) => {
        await this.handleAPI(directory, options);
      });

    this.program
      .command('security [directory]')
      .description('Find security-related patterns')
      .option('-r, --risk-level <level>', 'Risk level (high|medium|low)', 'all')
      .action(async (directory, options) => {
        await this.handleSecurity(directory, options);
      });

    this.program
      .command('duplicates [directory]')
      .description('Find duplicate code patterns')
      .option('-s, --similarity <threshold>', 'Similarity threshold', '0.8')
      .option('-l, --min-length <length>', 'Minimum code length', '50')
      .action(async (directory, options) => {
        await this.handleDuplicates(directory, options);
      });

    this.program
      .command('complexity [directory]')
      .description('Analyze code complexity patterns')
      .option('-t, --threshold <number>', 'Complexity threshold', '10')
      .action(async (directory, options) => {
        await this.handleComplexity(directory, options);
      });

    this.program
      .command('anti-patterns [directory]')
      .description('Detect common anti-patterns')
      .option('-c, --category <category>', 'Anti-pattern category')
      .action(async (directory, options) => {
        await this.handleAntiPatterns(directory, options);
      });
  }

  async handleFunctions(directory = '.', options) {
    const spinner = ora('Analyzing function patterns...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const functionQuery = `
        SELECT 
          file_path,
          content_snippet,
          CASE 
            WHEN content_snippet ~* 'function\\s+\\w+\\s*\\(' THEN 'regular'
            WHEN content_snippet ~* '\\w+\\s*=\\s*\\([^)]*\\)\\s*=>' THEN 'arrow'
            WHEN content_snippet ~* 'async\\s+(function|\\w+)' THEN 'async'
            WHEN content_snippet ~* 'export\\s+(function|const\\s+\\w+\\s*=)' THEN 'export'
            ELSE 'unknown'
          END as function_type,
          LENGTH(REGEXP_REPLACE(content_snippet, '[^,]', '', 'g')) + 1 as param_count
        FROM embeddings
        WHERE file_path LIKE $1
          AND (content_snippet ~* 'function|=>' OR content_snippet ~* '\\w+\\s*\\([^)]*\\)\\s*{')
      `;

      let params = [`%${directory}%`];
      let query = functionQuery;

      if (options.type !== 'all') {
        query += ` AND function_type = $2`;
        params.push(options.type);
      }

      const minParams = parseInt(options.minParams);
      const maxParams = parseInt(options.maxParams);
      
      query += ` AND param_count BETWEEN $${params.length + 1} AND $${params.length + 2}`;
      params.push(minParams, maxParams);

      query += ` ORDER BY function_type, param_count`;

      const result = await this.client.query(query, params);

      spinner.succeed(`Found ${result.rows.length} function patterns`);
      this.displayFunctionPatterns(result.rows);

    } catch (error) {
      spinner.fail('Function analysis failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleImports(directory = '.', options) {
    const spinner = ora('Analyzing import patterns...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      let importQuery = `
        SELECT 
          file_path,
          content_snippet,
          CASE 
            WHEN content_snippet ~* 'import\\s+\\w+\\s+from' THEN 'default'
            WHEN content_snippet ~* 'import\\s*{[^}]+}\\s*from' THEN 'named'
            WHEN content_snippet ~* 'import\\s*\\*\\s*as\\s*\\w+' THEN 'namespace'
            ELSE 'other'
          END as import_type,
          REGEXP_REPLACE(content_snippet, '.*from\\s+[''"]([^''"]+)[''"].*', '\\1') as source
        FROM embeddings
        WHERE file_path LIKE $1
          AND content_snippet ~* '^\\s*import'
      `;

      let params = [`%${directory}%`];

      if (options.source) {
        importQuery += ` AND source LIKE $2`;
        params.push(`%${options.source}%`);
      }

      if (options.type !== 'all') {
        importQuery += ` AND import_type = $${params.length + 1}`;
        params.push(options.type);
      }

      importQuery += ` ORDER BY source, import_type`;

      const result = await this.client.query(importQuery, params);

      spinner.succeed(`Found ${result.rows.length} import patterns`);
      this.displayImportPatterns(result.rows);

    } catch (error) {
      spinner.fail('Import analysis failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleReact(directory = '.', options) {
    const spinner = ora('Analyzing React patterns...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      let reactQuery = `
        SELECT 
          file_path,
          content_snippet,
          CASE 
            WHEN content_snippet ~* 'class\\s+\\w+\\s+extends\\s+React\\.Component' THEN 'class'
            WHEN content_snippet ~* 'function\\s+\\w+\\s*\\([^)]*\\).*return.*<' THEN 'functional'
            WHEN content_snippet ~* '\\w+\\s*=\\s*\\([^)]*\\)\\s*=>.*<' THEN 'functional'
            ELSE 'unknown'
          END as component_type,
          array_agg(DISTINCT 
            CASE 
              WHEN content_snippet ~* 'useState' THEN 'useState'
              WHEN content_snippet ~* 'useEffect' THEN 'useEffect'
              WHEN content_snippet ~* 'useContext' THEN 'useContext'
              WHEN content_snippet ~* 'useReducer' THEN 'useReducer'
              WHEN content_snippet ~* 'useMemo' THEN 'useMemo'
              WHEN content_snippet ~* 'useCallback' THEN 'useCallback'
            END
          ) FILTER (WHERE content_snippet ~* 'use[A-Z]') as hooks_used
        FROM embeddings
        WHERE file_path LIKE $1
          AND (content_snippet ~* 'React|useState|useEffect|Component|JSX\\.Element')
        GROUP BY file_path, content_snippet, component_type
      `;

      let params = [`%${directory}%`];

      if (options.componentType !== 'all') {
        reactQuery += ` HAVING component_type = $2`;
        params.push(options.componentType);
      }

      const result = await this.client.query(reactQuery, params);

      spinner.succeed(`Found ${result.rows.length} React patterns`);
      this.displayReactPatterns(result.rows);

    } catch (error) {
      spinner.fail('React analysis failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleAPI(directory = '.', options) {
    const spinner = ora('Analyzing API patterns...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      let apiQuery = `
        SELECT 
          file_path,
          content_snippet,
          CASE 
            WHEN content_snippet ~* '\\.get\\s*\\(' THEN 'GET'
            WHEN content_snippet ~* '\\.post\\s*\\(' THEN 'POST'
            WHEN content_snippet ~* '\\.put\\s*\\(' THEN 'PUT'
            WHEN content_snippet ~* '\\.delete\\s*\\(' THEN 'DELETE'
            WHEN content_snippet ~* '\\.patch\\s*\\(' THEN 'PATCH'
            ELSE 'UNKNOWN'
          END as http_method,
          REGEXP_REPLACE(content_snippet, '.*[''"]([^''"]*api[^''"]*)[''"].*', '\\1') as endpoint
        FROM embeddings
        WHERE file_path LIKE $1
          AND (content_snippet ~* '\\.(get|post|put|delete|patch)\\s*\\(' 
               OR content_snippet ~* 'fetch\\s*\\(' 
               OR content_snippet ~* 'axios\\.')
      `;

      let params = [`%${directory}%`];

      if (options.method) {
        apiQuery += ` AND http_method = $2`;
        params.push(options.method.toUpperCase());
      }

      if (options.pathPattern) {
        apiQuery += ` AND endpoint LIKE $${params.length + 1}`;
        params.push(`%${options.pathPattern}%`);
      }

      apiQuery += ` ORDER BY http_method, endpoint`;

      const result = await this.client.query(apiQuery, params);

      spinner.succeed(`Found ${result.rows.length} API patterns`);
      this.displayAPIPatterns(result.rows);

    } catch (error) {
      spinner.fail('API analysis failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleSecurity(directory = '.', options) {
    const spinner = ora('Analyzing security patterns...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const securityQuery = `
        SELECT 
          file_path,
          content_snippet,
          CASE 
            WHEN content_snippet ~* 'eval\\s*\\(|innerHTML\\s*=' THEN 'high'
            WHEN content_snippet ~* 'document\\.write|setTimeout\\s*\\(\\s*[''"]' THEN 'high'
            WHEN content_snippet ~* 'localStorage|sessionStorage' THEN 'medium'
            WHEN content_snippet ~* 'window\\.|global\\.' THEN 'medium'
            WHEN content_snippet ~* 'console\\.log|alert\\s*\\(' THEN 'low'
            ELSE 'info'
          END as risk_level,
          CASE 
            WHEN content_snippet ~* 'eval\\s*\\(' THEN 'Code Injection Risk'
            WHEN content_snippet ~* 'innerHTML\\s*=' THEN 'XSS Risk'
            WHEN content_snippet ~* 'document\\.write' THEN 'DOM Manipulation Risk'
            WHEN content_snippet ~* 'localStorage|sessionStorage' THEN 'Data Storage'
            WHEN content_snippet ~* 'console\\.log' THEN 'Information Disclosure'
            ELSE 'Security Pattern'
          END as security_issue
        FROM embeddings
        WHERE file_path LIKE $1
          AND (content_snippet ~* 'eval|innerHTML|document\\.write|localStorage|sessionStorage|console\\.log|alert|window\\.|global\\.')
      `;

      let params = [`%${directory}%`];

      if (options.riskLevel !== 'all') {
        const query = securityQuery + ` AND risk_level = $2 ORDER BY risk_level DESC, security_issue`;
        params.push(options.riskLevel);
        const result = await this.client.query(query, params);
        spinner.succeed(`Found ${result.rows.length} security patterns`);
        this.displaySecurityPatterns(result.rows);
      } else {
        const query = securityQuery + ` ORDER BY risk_level DESC, security_issue`;
        const result = await this.client.query(query, params);
        spinner.succeed(`Found ${result.rows.length} security patterns`);
        this.displaySecurityPatterns(result.rows);
      }

    } catch (error) {
      spinner.fail('Security analysis failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleDuplicates(directory = '.', options) {
    const spinner = ora('Finding duplicate code patterns...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const threshold = parseFloat(options.similarity);
      const minLength = parseInt(options.minLength);

      const duplicateQuery = `
        WITH code_blocks AS (
          SELECT 
            file_path,
            content_snippet,
            LENGTH(content_snippet) as snippet_length,
            MD5(REGEXP_REPLACE(content_snippet, '\\s+', ' ', 'g')) as content_hash
          FROM embeddings
          WHERE file_path LIKE $1
            AND LENGTH(content_snippet) >= $2
        )
        SELECT 
          content_hash,
          COUNT(*) as duplicate_count,
          array_agg(DISTINCT file_path) as files,
          MIN(content_snippet) as sample_code
        FROM code_blocks
        GROUP BY content_hash
        HAVING COUNT(*) > 1
        ORDER BY duplicate_count DESC
      `;

      const result = await this.client.query(duplicateQuery, [`%${directory}%`, minLength]);

      spinner.succeed(`Found ${result.rows.length} duplicate patterns`);
      this.displayDuplicatePatterns(result.rows);

    } catch (error) {
      spinner.fail('Duplicate analysis failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleComplexity(directory = '.', options) {
    const spinner = ora('Analyzing code complexity...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const threshold = parseInt(options.threshold);

      const complexityQuery = `
        SELECT 
          file_path,
          content_snippet,
          (LENGTH(content_snippet) - LENGTH(REPLACE(content_snippet, 'if', ''))) / 2 +
          (LENGTH(content_snippet) - LENGTH(REPLACE(content_snippet, 'for', ''))) / 3 +
          (LENGTH(content_snippet) - LENGTH(REPLACE(content_snippet, 'while', ''))) / 5 +
          (LENGTH(content_snippet) - LENGTH(REPLACE(content_snippet, 'switch', ''))) / 6 +
          (LENGTH(content_snippet) - LENGTH(REPLACE(content_snippet, 'catch', ''))) / 5 as complexity_score
        FROM embeddings
        WHERE file_path LIKE $1
        HAVING complexity_score >= $2
        ORDER BY complexity_score DESC
      `;

      const result = await this.client.query(complexityQuery, [`%${directory}%`, threshold]);

      spinner.succeed(`Found ${result.rows.length} complex code patterns`);
      this.displayComplexityPatterns(result.rows);

    } catch (error) {
      spinner.fail('Complexity analysis failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  async handleAntiPatterns(directory = '.', options) {
    const spinner = ora('Detecting anti-patterns...').start();
    
    if (!await this.connect()) {
      spinner.fail('Connection failed');
      return;
    }

    try {
      const antiPatternQuery = `
        SELECT 
          file_path,
          content_snippet,
          CASE 
            WHEN content_snippet ~* 'var\\s+' THEN 'Legacy var usage'
            WHEN content_snippet ~* '==\\s*' AND content_snippet !~* '===\\s*' THEN 'Loose equality'
            WHEN content_snippet ~* 'document\\.getElementById' THEN 'Direct DOM manipulation'
            WHEN content_snippet ~* 'setTimeout\\s*\\([^,]+,\\s*0\\s*\\)' THEN 'setTimeout zero'
            WHEN content_snippet ~* 'for\\s*\\(.*\\.length.*\\)' THEN 'Inefficient loop'
            WHEN content_snippet ~* 'try\\s*{[^}]*}\\s*catch\\s*\\([^)]*\\)\\s*{\\s*}' THEN 'Empty catch block'
            ELSE 'Other anti-pattern'
          END as anti_pattern_type,
          CASE 
            WHEN content_snippet ~* 'var\\s+' THEN 'Use const/let instead of var'
            WHEN content_snippet ~* '==\\s*' THEN 'Use strict equality (===)'
            WHEN content_snippet ~* 'document\\.getElementById' THEN 'Use modern query selectors'
            WHEN content_snippet ~* 'setTimeout\\s*\\([^,]+,\\s*0\\s*\\)' THEN 'Use Promise or async/await'
            WHEN content_snippet ~* 'for\\s*\\(.*\\.length.*\\)' THEN 'Cache array length or use forEach'
            WHEN content_snippet ~* 'try\\s*{[^}]*}\\s*catch\\s*\\([^)]*\\)\\s*{\\s*}' THEN 'Handle exceptions properly'
            ELSE 'Review code pattern'
          END as recommendation
        FROM embeddings
        WHERE file_path LIKE $1
          AND (content_snippet ~* 'var\\s+|==\\s*[^=]|document\\.getElementById|setTimeout\\s*\\([^,]+,\\s*0\\s*\\)|for\\s*\\(.*\\.length.*\\)|try\\s*{[^}]*}\\s*catch\\s*\\([^)]*\\)\\s*{\\s*}')
      `;

      let params = [`%${directory}%`];

      if (options.category) {
        const query = antiPatternQuery + ` AND anti_pattern_type LIKE $2 ORDER BY anti_pattern_type`;
        params.push(`%${options.category}%`);
        const result = await this.client.query(query, params);
        spinner.succeed(`Found ${result.rows.length} anti-patterns`);
        this.displayAntiPatterns(result.rows);
      } else {
        const query = antiPatternQuery + ` ORDER BY anti_pattern_type`;
        const result = await this.client.query(query, params);
        spinner.succeed(`Found ${result.rows.length} anti-patterns`);
        this.displayAntiPatterns(result.rows);
      }

    } catch (error) {
      spinner.fail('Anti-pattern detection failed');
      console.error(chalk.red('Error:'), error.message);
    } finally {
      await this.disconnect();
    }
  }

  // Display methods
  displayFunctionPatterns(results) {
    const table = new Table({
      head: ['File', 'Function Type', 'Parameters', 'Code Preview'],
      colWidths: [35, 15, 12, 50]
    });

    results.forEach(row => {
      table.push([
        chalk.cyan(row.file_path),
        chalk.yellow(row.function_type),
        chalk.green(row.param_count),
        row.content_snippet.substring(0, 45) + '...'
      ]);
    });

    console.log(table.toString());
  }

  displayImportPatterns(results) {
    const table = new Table({
      head: ['File', 'Import Type', 'Source', 'Statement'],
      colWidths: [35, 15, 25, 40]
    });

    results.forEach(row => {
      table.push([
        chalk.cyan(row.file_path),
        chalk.yellow(row.import_type),
        chalk.magenta(row.source),
        row.content_snippet.substring(0, 35) + '...'
      ]);
    });

    console.log(table.toString());
  }

  displayReactPatterns(results) {
    const table = new Table({
      head: ['File', 'Component Type', 'Hooks Used', 'Code Preview'],
      colWidths: [35, 18, 25, 40]
    });

    results.forEach(row => {
      const hooks = row.hooks_used.filter(h => h).join(', ') || 'None';
      table.push([
        chalk.cyan(row.file_path),
        chalk.yellow(row.component_type),
        chalk.green(hooks),
        row.content_snippet.substring(0, 35) + '...'
      ]);
    });

    console.log(table.toString());
  }

  displayAPIPatterns(results) {
    const table = new Table({
      head: ['File', 'HTTP Method', 'Endpoint', 'Code Preview'],
      colWidths: [35, 12, 30, 40]
    });

    results.forEach(row => {
      table.push([
        chalk.cyan(row.file_path),
        chalk.yellow(row.http_method),
        chalk.magenta(row.endpoint),
        row.content_snippet.substring(0, 35) + '...'
      ]);
    });

    console.log(table.toString());
  }

  displaySecurityPatterns(results) {
    const table = new Table({
      head: ['File', 'Risk Level', 'Security Issue', 'Code Preview'],
      colWidths: [35, 12, 25, 45]
    });

    results.forEach(row => {
      const riskColor = row.risk_level === 'high' ? chalk.red : 
                       row.risk_level === 'medium' ? chalk.yellow : chalk.blue;
      table.push([
        chalk.cyan(row.file_path),
        riskColor(row.risk_level.toUpperCase()),
        chalk.magenta(row.security_issue),
        row.content_snippet.substring(0, 40) + '...'
      ]);
    });

    console.log(table.toString());
  }

  displayDuplicatePatterns(results) {
    const table = new Table({
      head: ['Duplicates', 'Files Affected', 'Sample Code'],
      colWidths: [12, 50, 60]
    });

    results.forEach(row => {
      const files = row.files.slice(0, 3).join(', ');
      table.push([
        chalk.red(row.duplicate_count),
        chalk.cyan(files + (row.files.length > 3 ? '...' : '')),
        row.sample_code.substring(0, 55) + '...'
      ]);
    });

    console.log(table.toString());
  }

  displayComplexityPatterns(results) {
    const table = new Table({
      head: ['File', 'Complexity Score', 'Code Preview'],
      colWidths: [40, 18, 65]
    });

    results.forEach(row => {
      const scoreColor = row.complexity_score > 15 ? chalk.red : 
                        row.complexity_score > 10 ? chalk.yellow : chalk.green;
      table.push([
        chalk.cyan(row.file_path),
        scoreColor(row.complexity_score),
        row.content_snippet.substring(0, 60) + '...'
      ]);
    });

    console.log(table.toString());
  }

  displayAntiPatterns(results) {
    const table = new Table({
      head: ['File', 'Anti-Pattern', 'Recommendation', 'Code'],
      colWidths: [30, 20, 35, 35]
    });

    results.forEach(row => {
      table.push([
        chalk.cyan(row.file_path),
        chalk.red(row.anti_pattern_type),
        chalk.green(row.recommendation),
        row.content_snippet.substring(0, 30) + '...'
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
  const cli = new PatternFinder();
  cli.run().catch(console.error);
}

module.exports = PatternFinder;
