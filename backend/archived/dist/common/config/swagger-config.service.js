"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerConfigService = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let SwaggerConfigService = class SwaggerConfigService {
    createDocument(app, modules = [], config) {
        let builder = new swagger_1.DocumentBuilder()
            .setTitle(config.title)
            .setDescription(config.description)
            .setVersion(config.version);
        if (config.servers && config.servers.length > 0) {
            config.servers.forEach((server) => {
                builder = builder.addServer(server.url, server.description);
            });
        }
        if (config.tags && config.tags.length > 0) {
            config.tags.forEach((tag) => {
                builder = builder.addTag(tag.name, tag.description, tag.externalDocs);
            });
        }
        const document = swagger_1.SwaggerModule.createDocument(app, builder.build(), {
            include: modules,
        });
        return document;
    }
    setupSwaggerUI(app, document, path = 'api') {
        swagger_1.SwaggerModule.setup(path, app, document);
    }
    setupReDoc(app, document, path = 'redoc') {
        swagger_1.SwaggerModule.setup(path, app, document);
    }
    configureJwt(builder, options) {
        return builder.addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: options?.bearerFormat || 'JWT',
        }, 'JWT');
    }
    configureOAuth2(builder, flows) {
        return builder.addOAuth2(flows);
    }
    configureApiKey(builder, options) {
        return builder.addApiKey(options, options.name);
    }
    buildServers(servers) {
        let builder = new swagger_1.DocumentBuilder();
        servers.forEach((server) => {
            builder = builder.addServer(server.url, server.description);
        });
        return builder;
    }
    registerSchema(_name) {
    }
    registerResponse(_name) {
    }
    registerParameter(_name) {
    }
    validateDocument(document) {
        const errors = [];
        const warnings = [];
        if (!document.info?.title) {
            errors.push('Document missing title');
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings,
        };
    }
    addExtensions(document, extensions) {
        return { ...document, ...extensions };
    }
    setupVersioning(document, _version) {
        return document;
    }
};
exports.SwaggerConfigService = SwaggerConfigService;
exports.SwaggerConfigService = SwaggerConfigService = __decorate([
    (0, common_1.Injectable)()
], SwaggerConfigService);
//# sourceMappingURL=swagger-config.service.js.map