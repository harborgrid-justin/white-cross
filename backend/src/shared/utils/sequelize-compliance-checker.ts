/**
 * @fileoverview NestJS + Sequelize Compliance Checker
 * @module utils/sequelize-compliance
 * @description Validates Sequelize implementation against NestJS best practices
 */

import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface ComplianceIssue {
  file: string;
  line: number;
  type: 'ERROR' | 'WARNING' | 'INFO';
  category: 'DEPRECATED_API' | 'INCORRECT_ASSOCIATION' | 'MISSING_DECORATOR' | 'CIRCULAR_DEPENDENCY' | 'POOR_PRACTICE';
  message: string;
  suggestion?: string;
}

export interface ComplianceReport {
  totalFiles: number;
  issuesFound: number;
  issues: ComplianceIssue[];
  passedChecks: string[];
  score: number; // 0-100
}

/**
 * Sequelize NestJS Compliance Checker
 * Validates implementation against official NestJS + Sequelize guidelines
 */
export class SequelizeComplianceChecker {
  private logger = new Logger(SequelizeComplianceChecker.name);

  /**
   * Run comprehensive compliance check
   */
  async checkCompliance(projectPath: string): Promise<ComplianceReport> {
    const issues: ComplianceIssue[] = [];
    const passedChecks: string[] = [];
    
    // Check 1: Database Module Configuration
    const dbModuleIssues = await this.checkDatabaseModule(projectPath);
    issues.push(...dbModuleIssues);
    
    if (dbModuleIssues.length === 0) {
      passedChecks.push('✅ Database module follows NestJS best practices');
    }

    // Check 2: Model Definitions
    const modelIssues = await this.checkModels(projectPath);
    issues.push(...modelIssues);
    
    if (modelIssues.length === 0) {
      passedChecks.push('✅ All models use proper Sequelize TypeScript decorators');
    }

    // Check 3: Service Injection Patterns
    const serviceIssues = await this.checkServices(projectPath);
    issues.push(...serviceIssues);
    
    if (serviceIssues.length === 0) {
      passedChecks.push('✅ All services use @InjectModel decorator correctly');
    }

    // Check 4: Module Feature Registration
    const moduleIssues = await this.checkModules(projectPath);
    issues.push(...moduleIssues);
    
    if (moduleIssues.length === 0) {
      passedChecks.push('✅ All modules register models with forFeature()');
    }

    // Check 5: Association Definitions
    const associationIssues = await this.checkAssociations(projectPath);
    issues.push(...associationIssues);
    
    if (associationIssues.length === 0) {
      passedChecks.push('✅ All associations use proper Sequelize v6 syntax');
    }

    // Check 6: Deprecated API Usage
    const deprecatedIssues = await this.checkDeprecatedAPI(projectPath);
    issues.push(...deprecatedIssues);
    
    if (deprecatedIssues.length === 0) {
      passedChecks.push('✅ No deprecated Sequelize API usage found');
    }

    // Check 7: Transaction Patterns
    const transactionIssues = await this.checkTransactionPatterns(projectPath);
    issues.push(...transactionIssues);
    
    if (transactionIssues.length === 0) {
      passedChecks.push('✅ Transaction patterns follow NestJS guidelines');
    }

    const totalFiles = this.countTypeScriptFiles(projectPath);
    const score = Math.max(0, 100 - (issues.length * 5));

    return {
      totalFiles,
      issuesFound: issues.length,
      issues,
      passedChecks,
      score
    };
  }

  /**
   * Check Database Module Configuration
   */
  private async checkDatabaseModule(projectPath: string): Promise<ComplianceIssue[]> {
    const issues: ComplianceIssue[] = [];
    const dbModulePath = path.join(projectPath, 'src', 'database', 'database.module.ts');
    
    if (!fs.existsSync(dbModulePath)) {
      issues.push({
        file: 'database.module.ts',
        line: 0,
        type: 'ERROR',
        category: 'MISSING_DECORATOR',
        message: 'Database module not found',
        suggestion: 'Create a database module following NestJS patterns'
      });
      return issues;
    }

    const content = fs.readFileSync(dbModulePath, 'utf8');
    
    // Check for forRootAsync usage
    if (!content.includes('forRootAsync')) {
      issues.push({
        file: dbModulePath,
        line: this.findLineNumber(content, 'forRoot'),
        type: 'WARNING',
        category: 'POOR_PRACTICE',
        message: 'Consider using forRootAsync for better configuration management',
        suggestion: 'Use SequelizeModule.forRootAsync() with ConfigService injection'
      });
    }

    // Check for autoLoadModels
    if (!content.includes('autoLoadModels: true')) {
      issues.push({
        file: dbModulePath,
        line: 0,
        type: 'WARNING',
        category: 'POOR_PRACTICE',
        message: 'autoLoadModels should be enabled for better maintainability',
        suggestion: 'Set autoLoadModels: true in Sequelize configuration'
      });
    }

    // Check for proper define options
    if (!content.includes('define:')) {
      issues.push({
        file: dbModulePath,
        line: 0,
        type: 'INFO',
        category: 'POOR_PRACTICE',
        message: 'Consider adding define options for consistent table/column naming',
        suggestion: 'Add define: { timestamps: true, underscored: true, freezeTableName: true }'
      });
    }

    return issues;
  }

  /**
   * Check Model Definitions
   */
  private async checkModels(projectPath: string): Promise<ComplianceIssue[]> {
    const issues: ComplianceIssue[] = [];
    const modelsPath = path.join(projectPath, 'src', 'database', 'models');
    
    if (!fs.existsSync(modelsPath)) {
      return issues;
    }

    const modelFiles = fs.readdirSync(modelsPath).filter(f => f.endsWith('.model.ts'));
    
    for (const file of modelFiles) {
      const filePath = path.join(modelsPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for @Table decorator
      if (!content.includes('@Table')) {
        issues.push({
          file: filePath,
          line: 0,
          type: 'ERROR',
          category: 'MISSING_DECORATOR',
          message: 'Model class must use @Table decorator',
          suggestion: 'Add @Table decorator to model class'
        });
      }

      // Check for proper Model extension
      if (!content.includes('extends Model')) {
        issues.push({
          file: filePath,
          line: 0,
          type: 'ERROR',
          category: 'INCORRECT_ASSOCIATION',
          message: 'Model class must extend Model base class',
          suggestion: 'Extend Model<ModelAttributes> base class'
        });
      }

      // Check for deprecated DataTypes usage
      if (content.includes('DataTypes.')) {
        const lineNum = this.findLineNumber(content, 'DataTypes.');
        issues.push({
          file: filePath,
          line: lineNum,
          type: 'WARNING',
          category: 'DEPRECATED_API',
          message: 'Use DataType instead of DataTypes for v6 compatibility',
          suggestion: 'Replace DataTypes with DataType import'
        });
      }
    }

    return issues;
  }

  /**
   * Check Service Injection Patterns
   */
  private async checkServices(projectPath: string): Promise<ComplianceIssue[]> {
    const issues: ComplianceIssue[] = [];
    const serviceFiles = this.findServiceFiles(projectPath);
    
    for (const filePath of serviceFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check if service uses models but doesn't inject them
      if (content.includes('.findAll(') || content.includes('.findByPk(')) {
        if (!content.includes('@InjectModel(')) {
          issues.push({
            file: filePath,
            line: 0,
            type: 'ERROR',
            category: 'MISSING_DECORATOR',
            message: 'Service uses Sequelize models but missing @InjectModel decorator',
            suggestion: 'Use @InjectModel(ModelClass) to inject models properly'
          });
        }
      }

      // Check for direct Sequelize imports in services
      if (content.includes("from 'sequelize'") && !content.includes("from 'sequelize-typescript'")) {
        const lineNum = this.findLineNumber(content, "from 'sequelize'");
        issues.push({
          file: filePath,
          line: lineNum,
          type: 'WARNING',
          category: 'POOR_PRACTICE',
          message: 'Prefer sequelize-typescript imports over base sequelize',
          suggestion: 'Import from sequelize-typescript when possible'
        });
      }
    }

    return issues;
  }

  /**
   * Check Module Feature Registration
   */
  private async checkModules(projectPath: string): Promise<ComplianceIssue[]> {
    const issues: ComplianceIssue[] = [];
    const moduleFiles = this.findModuleFiles(projectPath);
    
    for (const filePath of moduleFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Skip database module (it uses forRoot)
      if (filePath.includes('database.module.ts')) {
        continue;
      }

      // Check if module imports models but doesn't use forFeature
      if (content.includes('.model')) {
        if (!content.includes('SequelizeModule.forFeature')) {
          issues.push({
            file: filePath,
            line: 0,
            type: 'WARNING',
            category: 'POOR_PRACTICE',
            message: 'Module references models but missing SequelizeModule.forFeature registration',
            suggestion: 'Register models using SequelizeModule.forFeature([Model])'
          });
        }
      }
    }

    return issues;
  }

  /**
   * Check Association Definitions
   */
  private async checkAssociations(projectPath: string): Promise<ComplianceIssue[]> {
    const issues: ComplianceIssue[] = [];
    const modelsPath = path.join(projectPath, 'src', 'database', 'models');
    
    if (!fs.existsSync(modelsPath)) {
      return issues;
    }

    const modelFiles = fs.readdirSync(modelsPath).filter(f => f.endsWith('.model.ts'));
    
    for (const file of modelFiles) {
      const filePath = path.join(modelsPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for old association syntax
      const oldSyntaxRegex = /@(BelongsTo|HasMany|HasOne|BelongsToMany)\([^,)]+,\s*['"][^'"]+['"]\)/g;
      let match;
      
      while ((match = oldSyntaxRegex.exec(content)) !== null) {
        const lineNum = this.findLineNumber(content, match[0]);
        issues.push({
          file: filePath,
          line: lineNum,
          type: 'WARNING',
          category: 'DEPRECATED_API',
          message: 'Association uses deprecated string syntax',
          suggestion: 'Use object syntax: { foreignKey: "key", as: "alias" }'
        });
      }
    }

    return issues;
  }

  /**
   * Check for Deprecated API Usage
   */
  private async checkDeprecatedAPI(projectPath: string): Promise<ComplianceIssue[]> {
    const issues: ComplianceIssue[] = [];
    const tsFiles = this.getAllTypeScriptFiles(projectPath);
    
    const deprecatedPatterns = [
      { pattern: /\.findById\(/g, replacement: '.findByPk(' },
      { pattern: /include:\s*\[\s*['"][^'"]+['"]/g, replacement: 'include: [{ model: ModelClass, as: "alias" }]' },
      { pattern: /Sequelize\.Op\./g, replacement: 'Op.' },
      { pattern: /Model\.init\(/g, replacement: 'Use @Table and @Column decorators' },
    ];
    
    for (const filePath of tsFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      for (const deprecated of deprecatedPatterns) {
        let match;
        while ((match = deprecated.pattern.exec(content)) !== null) {
          const lineNum = this.findLineNumber(content, match[0]);
          issues.push({
            file: filePath,
            line: lineNum,
            type: 'ERROR',
            category: 'DEPRECATED_API',
            message: `Deprecated API usage: ${match[0]}`,
            suggestion: `Use: ${deprecated.replacement}`
          });
        }
      }
    }

    return issues;
  }

  /**
   * Check Transaction Patterns
   */
  private async checkTransactionPatterns(projectPath: string): Promise<ComplianceIssue[]> {
    const issues: ComplianceIssue[] = [];
    const serviceFiles = this.findServiceFiles(projectPath);
    
    for (const filePath of serviceFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for proper transaction injection
      if (content.includes('.transaction(')) {
        if (!content.includes('Sequelize') && !content.includes('@InjectConnection')) {
          issues.push({
            file: filePath,
            line: this.findLineNumber(content, '.transaction('),
            type: 'WARNING',
            category: 'POOR_PRACTICE',
            message: 'Transaction usage without proper Sequelize instance injection',
            suggestion: 'Inject Sequelize instance or use connection token'
          });
        }
      }
    }

    return issues;
  }

  /**
   * Utility methods
   */
  private findLineNumber(content: string, searchText: string): number {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(searchText)) {
        return i + 1;
      }
    }
    return 0;
  }

  private findServiceFiles(projectPath: string): string[] {
    const files: string[] = [];
    this.findFilesRecursive(path.join(projectPath, 'src'), '.service.ts', files);
    return files;
  }

  private findModuleFiles(projectPath: string): string[] {
    const files: string[] = [];
    this.findFilesRecursive(path.join(projectPath, 'src'), '.module.ts', files);
    return files;
  }

  private getAllTypeScriptFiles(projectPath: string): string[] {
    const files: string[] = [];
    this.findFilesRecursive(path.join(projectPath, 'src'), '.ts', files);
    return files.filter(f => !f.endsWith('.d.ts'));
  }

  private countTypeScriptFiles(projectPath: string): number {
    return this.getAllTypeScriptFiles(projectPath).length;
  }

  private findFilesRecursive(dir: string, extension: string, files: string[]): void {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          this.findFilesRecursive(fullPath, extension, files);
        } else if (entry.name.endsWith(extension)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory might not exist or be accessible
    }
  }

  /**
   * Generate compliance report
   */
  generateReport(report: ComplianceReport): string {
    let output = '\n';
    output += '🔍 NestJS + Sequelize Compliance Report\n';
    output += '=====================================\n\n';
    
    output += `📊 Summary:\n`;
    output += `  • Files analyzed: ${report.totalFiles}\n`;
    output += `  • Issues found: ${report.issuesFound}\n`;
    output += `  • Compliance score: ${report.score}%\n\n`;
    
    if (report.passedChecks.length > 0) {
      output += `✅ Passed Checks:\n`;
      for (const check of report.passedChecks) {
        output += `  ${check}\n`;
      }
      output += '\n';
    }
    
    if (report.issues.length > 0) {
      output += `⚠️  Issues Found:\n`;
      
      const errorCount = report.issues.filter(i => i.type === 'ERROR').length;
      const warningCount = report.issues.filter(i => i.type === 'WARNING').length;
      const infoCount = report.issues.filter(i => i.type === 'INFO').length;
      
      output += `  • Errors: ${errorCount}\n`;
      output += `  • Warnings: ${warningCount}\n`;
      output += `  • Info: ${infoCount}\n\n`;
      
      for (const issue of report.issues) {
        const icon = issue.type === 'ERROR' ? '❌' : issue.type === 'WARNING' ? '⚠️' : 'ℹ️';
        output += `${icon} ${issue.category} in ${path.basename(issue.file)}:${issue.line}\n`;
        output += `   ${issue.message}\n`;
        if (issue.suggestion) {
          output += `   💡 ${issue.suggestion}\n`;
        }
        output += '\n';
      }
    }
    
    output += '🎯 Recommendations:\n';
    output += '  1. Use @InjectModel() for all model injections\n';
    output += '  2. Register models with SequelizeModule.forFeature()\n';
    output += '  3. Use proper association syntax with foreignKey and as options\n';
    output += '  4. Avoid deprecated APIs (findById, string includes, etc.)\n';
    output += '  5. Configure database with forRootAsync and autoLoadModels\n\n';
    
    return output;
  }
}