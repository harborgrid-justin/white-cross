"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const base_1 = require("../../common/base");
const logger_service_1 = require("../../common/logging/logger.service");
const Handlebars = __importStar(require("handlebars"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const email_dto_1 = require("./dto/email.dto");
let EmailTemplateService = class EmailTemplateService extends base_1.BaseService {
    configService;
    templateCache = new Map();
    cacheEnabled;
    templateDirectory;
    constructor(logger, configService) {
        super({
            serviceName: 'EmailTemplateService',
            logger,
            enableAuditLogging: true,
        });
        this.configService = configService;
        this.cacheEnabled = this.configService.get('EMAIL_TEMPLATE_CACHE_ENABLED', true);
        this.templateDirectory = path.join(__dirname, this.configService.get('EMAIL_TEMPLATE_DIR', 'templates'));
        this.registerHelpers();
    }
    async onModuleInit() {
        if (this.cacheEnabled) {
            await this.preloadTemplates();
        }
        this.logInfo('EmailTemplateService initialized');
    }
    registerHelpers() {
        Handlebars.registerHelper('formatDate', (date) => {
            if (!date)
                return '';
            return new Date(date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        });
        Handlebars.registerHelper('uppercase', (str) => {
            if (!str)
                return '';
            return str.toUpperCase();
        });
        Handlebars.registerHelper('eq', (a, b) => a === b);
        Handlebars.registerHelper('neq', (a, b) => a !== b);
        Handlebars.registerHelper('json', (obj) => {
            return JSON.stringify(obj, null, 2);
        });
        this.logDebug('Handlebars helpers registered');
    }
    async preloadTemplates() {
        const templates = Object.values(email_dto_1.EmailTemplate);
        const loadPromises = templates.map(async (template) => {
            try {
                await this.loadTemplate(template);
                this.logDebug(`Preloaded template: ${template}`);
            }
            catch (error) {
                this.logWarning(`Failed to preload template ${template}: ${error.message}`);
            }
        });
        await Promise.allSettled(loadPromises);
        this.logInfo(`Preloaded ${this.templateCache.size} templates`);
    }
    async loadTemplate(template) {
        const templateName = this.getTemplateName(template);
        const htmlPath = path.join(this.templateDirectory, `${templateName}.html.hbs`);
        const textPath = path.join(this.templateDirectory, `${templateName}.text.hbs`);
        try {
            const [htmlSource, textSource] = await Promise.all([
                fs.readFile(htmlPath, 'utf-8'),
                fs.readFile(textPath, 'utf-8'),
            ]);
            const entry = {
                html: Handlebars.compile(htmlSource),
                text: Handlebars.compile(textSource),
                loadedAt: new Date(),
            };
            if (this.cacheEnabled) {
                this.templateCache.set(template, entry);
            }
            return entry;
        }
        catch (error) {
            this.logError(`Failed to load template ${templateName}: ${error.message}`);
            throw new Error(`Template ${template} not found or cannot be read`);
        }
    }
    getTemplateName(template) {
        return template.toString();
    }
    async render(template, data) {
        try {
            let templateEntry;
            if (this.cacheEnabled && this.templateCache.has(template)) {
                templateEntry = this.templateCache.get(template);
            }
            else {
                templateEntry = await this.loadTemplate(template);
            }
            const html = templateEntry.html(data);
            const text = templateEntry.text(data);
            this.logDebug(`Rendered template: ${template}`);
            return { html, text };
        }
        catch (error) {
            this.logError(`Failed to render template ${template}: ${error.message}`);
            throw new Error(`Failed to render email template: ${error.message}`);
        }
    }
    clearCache() {
        this.templateCache.clear();
        this.logDebug('Template cache cleared');
    }
    getCacheStats() {
        return {
            size: this.templateCache.size,
            templates: Array.from(this.templateCache.keys()),
        };
    }
    async templateExists(template) {
        const templateName = this.getTemplateName(template);
        const htmlPath = path.join(this.templateDirectory, `${templateName}.html.hbs`);
        try {
            await fs.access(htmlPath);
            return true;
        }
        catch {
            return false;
        }
    }
};
exports.EmailTemplateService = EmailTemplateService;
exports.EmailTemplateService = EmailTemplateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_service_1.LoggerService)),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_1.ConfigService])
], EmailTemplateService);
//# sourceMappingURL=email-template.service.js.map