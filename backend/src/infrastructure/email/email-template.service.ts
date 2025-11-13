/**
 * @fileoverview Email Template Service
 * @module infrastructure/email
 * @description Handles email template loading, rendering, and caching using Handlebars
 */

import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { BaseService } from '../../shared/base/BaseService';
import { LoggerService } from '../../shared/logging/logger.service';
import { ConfigService } from '@nestjs/config';
import * as Handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';
import { EmailTemplate } from './dto/email.dto';

import { BaseService } from '../../common/base';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
import { BaseService } from '../../common/base';
import { LoggerService } from '../../shared/logging/logger.service';
import { Inject } from '@nestjs/common';
/**
 * Rendered email content with both HTML and text versions
 */
export interface RenderedEmail {
  html: string;
  text: string;
}

/**
 * Template cache entry
 */
interface TemplateCacheEntry {
  html: HandlebarsTemplateDelegate;
  text: HandlebarsTemplateDelegate;
  loadedAt: Date;
}

/**
 * EmailTemplateService class
 * Provides template loading, rendering, and caching functionality
 */
@Injectable()
export class EmailTemplateService implements OnModuleInit {
  private readonly templateCache = new Map<EmailTemplate, TemplateCacheEntry>();
  private readonly cacheEnabled: boolean;
  private readonly templateDirectory: string;

  constructor(
    @Inject(LoggerService) logger: LoggerService,
    private readonly configService: ConfigService
  ) {
    super({
      serviceName: 'EmailTemplateService',
      logger,
      enableAuditLogging: true,
    });

    this.cacheEnabled = this.configService.get<boolean>('EMAIL_TEMPLATE_CACHE_ENABLED', true);
    this.templateDirectory = path.join(
      __dirname,
      this.configService.get<string>('EMAIL_TEMPLATE_DIR', 'templates'),
    );
    this.registerHelpers();
  }

  /**
   * Initialize the service by preloading templates if caching is enabled
   */
  async onModuleInit(): Promise<void> {
    if (this.cacheEnabled) {
      await this.preloadTemplates();
    }
    this.logInfo('EmailTemplateService initialized');
  }

  /**
   * Register Handlebars helper functions
   * @private
   */
  private registerHelpers(): void {
    // Date formatting helper
    Handlebars.registerHelper('formatDate', (date: Date) => {
      if (!date) return '';
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    });

    // Uppercase helper
    Handlebars.registerHelper('uppercase', (str: string) => {
      if (!str) return '';
      return str.toUpperCase();
    });

    // Conditional equality helper
    Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b);

    // Conditional not-equal helper
    Handlebars.registerHelper('neq', (a: unknown, b: unknown) => a !== b);

    // JSON stringify helper
    Handlebars.registerHelper('json', (obj: unknown) => {
      return JSON.stringify(obj, null, 2);
    });

    this.logDebug('Handlebars helpers registered');
  }

  /**
   * Preload all templates into cache
   * @private
   */
  private async preloadTemplates(): Promise<void> {
    const templates = Object.values(EmailTemplate);
    const loadPromises = templates.map(async (template) => {
      try {
        await this.loadTemplate(template);
        this.logDebug(`Preloaded template: ${template}`);
      } catch (error) {
        this.logWarning(`Failed to preload template ${template}: ${error.message}`);
      }
    });

    await Promise.allSettled(loadPromises);
    this.logInfo(`Preloaded ${this.templateCache.size} templates`);
  }

  /**
   * Load a template from disk
   * @param template - Template identifier
   * @returns Compiled Handlebars templates for HTML and text
   * @throws Error if template files cannot be read
   * @private
   */
  private async loadTemplate(template: EmailTemplate): Promise<TemplateCacheEntry> {
    const templateName = this.getTemplateName(template);
    const htmlPath = path.join(this.templateDirectory, `${templateName}.html.hbs`);
    const textPath = path.join(this.templateDirectory, `${templateName}.text.hbs`);

    try {
      const [htmlSource, textSource] = await Promise.all([
        fs.readFile(htmlPath, 'utf-8'),
        fs.readFile(textPath, 'utf-8'),
      ]);

      const entry: TemplateCacheEntry = {
        html: Handlebars.compile(htmlSource),
        text: Handlebars.compile(textSource),
        loadedAt: new Date(),
      };

      if (this.cacheEnabled) {
        this.templateCache.set(template, entry);
      }

      return entry;
    } catch (error) {
      this.logError(`Failed to load template ${templateName}: ${error.message}`);
      throw new Error(`Template ${template} not found or cannot be read`);
    }
  }

  /**
   * Get template filename from template enum
   * @param template - Template identifier
   * @returns Template filename
   * @private
   */
  private getTemplateName(template: EmailTemplate): string {
    return template.toString();
  }

  /**
   * Render an email template with provided data
   * @param template - Template to render
   * @param data - Data to pass to the template
   * @returns Rendered HTML and text versions
   * @throws Error if template cannot be rendered
   */
  async render(template: EmailTemplate, data: Record<string, unknown>): Promise<RenderedEmail> {
    try {
      let templateEntry: TemplateCacheEntry;

      if (this.cacheEnabled && this.templateCache.has(template)) {
        templateEntry = this.templateCache.get(template);
      } else {
        templateEntry = await this.loadTemplate(template);
      }

      const html = templateEntry.html(data);
      const text = templateEntry.text(data);

      this.logDebug(`Rendered template: ${template}`);

      return { html, text };
    } catch (error) {
      this.logError(`Failed to render template ${template}: ${error.message}`);
      throw new Error(`Failed to render email template: ${error.message}`);
    }
  }

  /**
   * Clear template cache (useful for development/testing)
   */
  clearCache(): void {
    this.templateCache.clear();
    this.logDebug('Template cache cleared');
  }

  /**
   * Get template cache statistics
   * @returns Cache statistics
   */
  getCacheStats(): { size: number; templates: string[] } {
    return {
      size: this.templateCache.size,
      templates: Array.from(this.templateCache.keys()),
    };
  }

  /**
   * Check if a template exists
   * @param template - Template to check
   * @returns True if template exists
   */
  async templateExists(template: EmailTemplate): Promise<boolean> {
    const templateName = this.getTemplateName(template);
    const htmlPath = path.join(this.templateDirectory, `${templateName}.html.hbs`);

    try {
      await fs.access(htmlPath);
      return true;
    } catch {
      return false;
    }
  }
}
