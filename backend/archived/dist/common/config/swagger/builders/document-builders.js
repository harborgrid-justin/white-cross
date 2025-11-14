"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOpenApiDocument = createOpenApiDocument;
exports.buildOpenApiInfo = buildOpenApiInfo;
exports.buildOpenApiServers = buildOpenApiServers;
exports.buildOpenApiTags = buildOpenApiTags;
exports.buildOpenApiExternalDocs = buildOpenApiExternalDocs;
exports.buildOpenApiComponents = buildOpenApiComponents;
const swagger_1 = require("@nestjs/swagger");
function createOpenApiDocument(app, info, servers = [], tags = []) {
    let builder = new swagger_1.DocumentBuilder()
        .setTitle(info.title)
        .setDescription(info.description)
        .setVersion(info.version);
    if (info.termsOfService) {
        builder = builder.setTermsOfService(info.termsOfService);
    }
    if (info.contact) {
        builder = builder.setContact(info.contact.name || '', info.contact.url || '', info.contact.email || '');
    }
    if (info.license) {
        builder = builder.setLicense(info.license.name, info.license.url || '');
    }
    servers.forEach((server) => {
        builder = builder.addServer(server.url, server.description);
    });
    tags.forEach((tag) => {
        builder = builder.addTag(tag.name, tag.description, tag.externalDocs);
    });
    const config = builder.build();
    return swagger_1.SwaggerModule.createDocument(app, config);
}
function buildOpenApiInfo(title, description, version, additionalInfo) {
    let builder = new swagger_1.DocumentBuilder()
        .setTitle(title)
        .setDescription(description)
        .setVersion(version);
    if (additionalInfo?.termsOfService) {
        builder = builder.setTermsOfService(additionalInfo.termsOfService);
    }
    if (additionalInfo?.contact) {
        const { name = '', url = '', email = '' } = additionalInfo.contact;
        builder = builder.setContact(name, url, email);
    }
    if (additionalInfo?.license) {
        builder = builder.setLicense(additionalInfo.license.name, additionalInfo.license.url || '');
    }
    return builder;
}
function buildOpenApiServers(builder, servers) {
    let updatedBuilder = builder;
    servers.forEach((server) => {
        updatedBuilder = updatedBuilder.addServer(server.url, server.description || '');
    });
    return updatedBuilder;
}
function buildOpenApiTags(builder, tags) {
    let updatedBuilder = builder;
    tags.forEach((tag) => {
        updatedBuilder = updatedBuilder.addTag(tag.name, tag.description, tag.externalDocs);
    });
    return updatedBuilder;
}
function buildOpenApiExternalDocs(builder, description, url) {
    return builder.setExternalDoc(description, url);
}
function buildOpenApiComponents(document, schemas = {}, responses = {}, parameters = {}) {
    if (!document.components) {
        document.components = {};
    }
    if (Object.keys(schemas).length > 0) {
        document.components.schemas = {
            ...(document.components.schemas || {}),
            ...schemas,
        };
    }
    if (Object.keys(responses).length > 0) {
        Object.entries(responses).forEach(([name, response]) => {
            if (!response.description) {
                throw new Error(`Response component '${name}' must have a description`);
            }
        });
        document.components.responses = {
            ...(document.components.responses || {}),
            ...responses,
        };
    }
    if (Object.keys(parameters).length > 0) {
        Object.entries(parameters).forEach(([name, param]) => {
            if (!param.name || !param.in) {
                throw new Error(`Parameter component '${name}' must have 'name' and 'in' properties`);
            }
        });
        document.components.parameters = {
            ...(document.components.parameters || {}),
            ...parameters,
        };
    }
    return document;
}
//# sourceMappingURL=document-builders.js.map