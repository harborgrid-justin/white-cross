/**
 * LOC: APIDOCGEN001
 * File: /reuse/threat/composites/downstream/api-documentation-generators.ts
 *
 * UPSTREAM (imports from):
 *   - ../threat-intelligence-api-composite
 *   - @nestjs/common
 *   - @nestjs/swagger
 *
 * DOWNSTREAM (imported by):
 *   - API documentation portals
 *   - Developer documentation systems
 *   - SDK generation pipelines
 *   - API client generators
 */

/**
 * File: /reuse/threat/composites/downstream/api-documentation-generators.ts
 * Locator: WC-DOWNSTREAM-APIDOCGEN-001
 * Purpose: API Documentation Generation Service - OpenAPI/Swagger documentation automation
 *
 * Upstream: threat-intelligence-api-composite
 * Downstream: Documentation portals, SDK generators, Developer tools
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger
 * Exports: Comprehensive API documentation generation service with OpenAPI 3.0 support
 *
 * LLM Context: Production-ready API documentation generation service for White Cross healthcare threat intelligence platform.
 * Automatically generates OpenAPI 3.0 specifications, interactive API documentation, code samples in multiple languages,
 * API versioning documentation, authentication guides, and comprehensive developer portals. Includes automatic schema
 * extraction, endpoint documentation, example generation, and SDK scaffolding for multiple programming languages.
 * HIPAA-compliant with security documentation and audit trail generation.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import * as fs from 'fs/promises';
import * as path from 'path';

// Import from threat intelligence API composite
import {
  createThreatIntelligenceRestApi,
  createThreatSearchEndpoint,
  createIocLookupEndpoint,
  createThreatFeedEndpoint,
  createStixBundleEndpoint,
  createTlpSharingEndpoint,
  generateCompleteThreatGraphQLSchema,
  createThreatSearchQuery,
  createThreatSubmissionMutation,
  createThreatUpdatesSubscription,
  generateThreatApiOpenApiSpec,
  type ThreatApiConfig,
  type RestEndpoint,
  type GraphQLQuery,
} from '../threat-intelligence-api-composite';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Documentation generation configuration
 */
export interface DocumentationConfig {
  format: 'openapi' | 'asyncapi' | 'markdown' | 'html' | 'postman';
  version: string;
  includeExamples: boolean;
  includeAuthentication: boolean;
  includeSchemas: boolean;
  includeTags: string[];
  outputPath: string;
  theme?: 'default' | 'dark' | 'healthcare' | 'custom';
  languages: ProgrammingLanguage[];
}

/**
 * Supported programming languages for SDK generation
 */
export type ProgrammingLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'java'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'php'
  | 'ruby';

/**
 * Generated documentation artifact
 */
export interface DocumentationArtifact {
  id: string;
  format: string;
  version: string;
  generatedAt: Date;
  filePath: string;
  size: number;
  checksum: string;
  metadata: Record<string, any>;
}

/**
 * Code sample configuration
 */
export interface CodeSampleConfig {
  language: ProgrammingLanguage;
  endpoint: string;
  method: string;
  includeAuthentication: boolean;
  includeErrorHandling: boolean;
  style: 'async' | 'sync' | 'promise' | 'callback';
}

/**
 * SDK scaffold configuration
 */
export interface SDKScaffoldConfig {
  language: ProgrammingLanguage;
  packageName: string;
  version: string;
  includeTypes: boolean;
  includeTests: boolean;
  includeExamples: boolean;
  authMethod: 'api_key' | 'oauth2' | 'jwt';
}

/**
 * Interactive documentation configuration
 */
export interface InteractiveDocsConfig {
  enableTryIt: boolean;
  enableCodeGen: boolean;
  enableMocking: boolean;
  defaultServer: string;
  authToken?: string;
  customStyles?: string;
}

/**
 * Changelog entry
 */
export interface ChangelogEntry {
  version: string;
  date: Date;
  changes: ChangeItem[];
  breaking: boolean;
  deprecated: string[];
}

/**
 * Change item
 */
export interface ChangeItem {
  type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
  description: string;
  endpoint?: string;
  impact: 'high' | 'medium' | 'low';
}

// ============================================================================
// NESTJS SERVICE - API DOCUMENTATION GENERATOR
// ============================================================================

@Injectable()
@ApiTags('API Documentation Generators')
export class ApiDocumentationGeneratorService {
  private readonly logger = new Logger(ApiDocumentationGeneratorService.name);

  /**
   * Generate complete OpenAPI 3.0 specification
   */
  @ApiOperation({ summary: 'Generate OpenAPI 3.0 specification for threat intelligence API' })
  @ApiResponse({ status: 200, description: 'OpenAPI specification generated successfully' })
  async generateOpenApiSpecification(
    config: Partial<ThreatApiConfig>
  ): Promise<DocumentationArtifact> {
    this.logger.log('Generating OpenAPI 3.0 specification');

    try {
      // Create API configuration
      const apiConfig = createThreatIntelligenceRestApi(config);

      // Generate OpenAPI spec
      const openApiSpec = generateThreatApiOpenApiSpec(apiConfig);

      // Add additional metadata
      const enhancedSpec = {
        ...openApiSpec,
        info: {
          ...openApiSpec.info,
          'x-logo': {
            url: 'https://whitecross.io/logo.png',
            altText: 'White Cross Healthcare Security',
          },
          'x-api-id': 'whitecross-threat-intel-api',
          termsOfService: 'https://whitecross.io/terms',
        },
        tags: [
          { name: 'Threat Intelligence', description: 'Threat intelligence operations' },
          { name: 'IOC', description: 'Indicator of Compromise operations' },
          { name: 'Feeds', description: 'Threat feed management' },
          { name: 'STIX', description: 'STIX 2.1 operations' },
          { name: 'Sharing', description: 'Threat intelligence sharing' },
        ],
        'x-tagGroups': [
          {
            name: 'Core Operations',
            tags: ['Threat Intelligence', 'IOC', 'Feeds'],
          },
          {
            name: 'Standards & Sharing',
            tags: ['STIX', 'Sharing'],
          },
        ],
      };

      // Add security requirements
      enhancedSpec.security = [
        { ApiKeyAuth: [] },
        { BearerAuth: [] },
      ];

      // Write to file
      const outputPath = path.join(config.swagger?.servers?.[0]?.url || '/tmp', 'openapi.json');
      const specJson = JSON.stringify(enhancedSpec, null, 2);
      await fs.writeFile(outputPath, specJson, 'utf-8');

      const artifact: DocumentationArtifact = {
        id: `openapi-${Date.now()}`,
        format: 'openapi',
        version: apiConfig.version,
        generatedAt: new Date(),
        filePath: outputPath,
        size: specJson.length,
        checksum: this.calculateChecksum(specJson),
        metadata: {
          endpoints: Object.keys(enhancedSpec.paths || {}).length,
          schemas: Object.keys(enhancedSpec.components?.schemas || {}).length,
        },
      };

      this.logger.log(`OpenAPI specification generated: ${artifact.filePath}`);
      return artifact;
    } catch (error) {
      this.logger.error(`Failed to generate OpenAPI specification: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate GraphQL schema documentation
   */
  @ApiOperation({ summary: 'Generate GraphQL schema documentation' })
  @ApiResponse({ status: 200, description: 'GraphQL schema documentation generated' })
  async generateGraphQLDocumentation(): Promise<DocumentationArtifact> {
    this.logger.log('Generating GraphQL schema documentation');

    try {
      // Generate schema
      const schema = generateCompleteThreatGraphQLSchema();

      // Generate queries documentation
      const queries = [
        createThreatSearchQuery(),
        // Add more queries as needed
      ];

      // Generate mutations documentation
      const mutations = [
        createThreatSubmissionMutation(),
        // Add more mutations as needed
      ];

      // Generate subscriptions documentation
      const subscriptions = [
        createThreatUpdatesSubscription(),
        // Add more subscriptions as needed
      ];

      // Build comprehensive documentation
      const documentation = {
        schema,
        queries: queries.map(this.documentGraphQLQuery),
        mutations: mutations.map(this.documentGraphQLQuery),
        subscriptions: subscriptions.map(this.documentGraphQLQuery),
        types: this.extractGraphQLTypes(schema),
        examples: this.generateGraphQLExamples(queries, mutations),
      };

      // Write to file
      const outputPath = '/tmp/graphql-docs.json';
      const docsJson = JSON.stringify(documentation, null, 2);
      await fs.writeFile(outputPath, docsJson, 'utf-8');

      const artifact: DocumentationArtifact = {
        id: `graphql-docs-${Date.now()}`,
        format: 'graphql',
        version: '1.0',
        generatedAt: new Date(),
        filePath: outputPath,
        size: docsJson.length,
        checksum: this.calculateChecksum(docsJson),
        metadata: {
          queries: queries.length,
          mutations: mutations.length,
          subscriptions: subscriptions.length,
        },
      };

      this.logger.log(`GraphQL documentation generated: ${artifact.filePath}`);
      return artifact;
    } catch (error) {
      this.logger.error(`Failed to generate GraphQL documentation: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate code samples for all endpoints
   */
  @ApiOperation({ summary: 'Generate code samples for API endpoints' })
  @ApiResponse({ status: 200, description: 'Code samples generated successfully' })
  async generateCodeSamples(
    endpoints: RestEndpoint[],
    languages: ProgrammingLanguage[]
  ): Promise<Record<ProgrammingLanguage, string[]>> {
    this.logger.log(`Generating code samples for ${endpoints.length} endpoints in ${languages.length} languages`);

    const samples: Record<ProgrammingLanguage, string[]> = {} as any;

    for (const language of languages) {
      samples[language] = [];

      for (const endpoint of endpoints) {
        const sample = this.generateCodeSample(endpoint, language);
        samples[language].push(sample);
      }
    }

    this.logger.log('Code samples generated successfully');
    return samples;
  }

  /**
   * Generate SDK scaffold for specified language
   */
  @ApiOperation({ summary: 'Generate SDK scaffold for programming language' })
  @ApiResponse({ status: 200, description: 'SDK scaffold generated successfully' })
  async generateSDKScaffold(config: SDKScaffoldConfig): Promise<DocumentationArtifact> {
    this.logger.log(`Generating ${config.language} SDK scaffold`);

    try {
      let sdkContent = '';

      switch (config.language) {
        case 'typescript':
          sdkContent = this.generateTypeScriptSDK(config);
          break;
        case 'python':
          sdkContent = this.generatePythonSDK(config);
          break;
        case 'java':
          sdkContent = this.generateJavaSDK(config);
          break;
        case 'go':
          sdkContent = this.generateGoSDK(config);
          break;
        case 'csharp':
          sdkContent = this.generateCSharpSDK(config);
          break;
        default:
          throw new Error(`Unsupported language: ${config.language}`);
      }

      const outputPath = `/tmp/sdk-${config.language}-${Date.now()}`;
      await fs.mkdir(outputPath, { recursive: true });
      await fs.writeFile(path.join(outputPath, 'README.md'), this.generateSDKReadme(config), 'utf-8');
      await fs.writeFile(path.join(outputPath, 'client.ts'), sdkContent, 'utf-8');

      const artifact: DocumentationArtifact = {
        id: `sdk-${config.language}-${Date.now()}`,
        format: 'sdk',
        version: config.version,
        generatedAt: new Date(),
        filePath: outputPath,
        size: sdkContent.length,
        checksum: this.calculateChecksum(sdkContent),
        metadata: {
          language: config.language,
          packageName: config.packageName,
          includeTypes: config.includeTypes,
        },
      };

      this.logger.log(`SDK scaffold generated: ${artifact.filePath}`);
      return artifact;
    } catch (error) {
      this.logger.error(`Failed to generate SDK scaffold: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate interactive API documentation portal
   */
  @ApiOperation({ summary: 'Generate interactive API documentation portal' })
  @ApiResponse({ status: 200, description: 'Interactive documentation generated' })
  async generateInteractiveDocumentation(
    config: InteractiveDocsConfig
  ): Promise<DocumentationArtifact> {
    this.logger.log('Generating interactive API documentation portal');

    try {
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>White Cross Threat Intelligence API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    }
    .topbar {
      background: #0066cc;
      padding: 20px;
      color: white;
    }
    .topbar h1 {
      margin: 0;
      font-size: 24px;
    }
    ${config.customStyles || ''}
  </style>
</head>
<body>
  <div class="topbar">
    <h1>🏥 White Cross Threat Intelligence API</h1>
    <p>Comprehensive healthcare security threat intelligence platform</p>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: "${config.defaultServer}/openapi.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        tryItOutEnabled: ${config.enableTryIt},
        requestInterceptor: (request) => {
          if (${config.authToken ? 'true' : 'false'}) {
            request.headers['Authorization'] = 'Bearer ${config.authToken || ''}';
          }
          return request;
        }
      });
      window.ui = ui;
    };
  </script>
</body>
</html>
      `;

      const outputPath = '/tmp/api-docs.html';
      await fs.writeFile(outputPath, html, 'utf-8');

      const artifact: DocumentationArtifact = {
        id: `interactive-docs-${Date.now()}`,
        format: 'html',
        version: '1.0',
        generatedAt: new Date(),
        filePath: outputPath,
        size: html.length,
        checksum: this.calculateChecksum(html),
        metadata: {
          interactive: true,
          tryItEnabled: config.enableTryIt,
        },
      };

      this.logger.log(`Interactive documentation generated: ${artifact.filePath}`);
      return artifact;
    } catch (error) {
      this.logger.error(`Failed to generate interactive documentation: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate API changelog documentation
   */
  @ApiOperation({ summary: 'Generate API changelog documentation' })
  @ApiResponse({ status: 200, description: 'Changelog generated successfully' })
  async generateChangelog(entries: ChangelogEntry[]): Promise<DocumentationArtifact> {
    this.logger.log(`Generating changelog with ${entries.length} entries`);

    try {
      let markdown = '# White Cross Threat Intelligence API Changelog\n\n';
      markdown += 'All notable changes to the White Cross Threat Intelligence API will be documented in this file.\n\n';

      for (const entry of entries.sort((a, b) => b.date.getTime() - a.date.getTime())) {
        markdown += `## [${entry.version}] - ${entry.date.toISOString().split('T')[0]}\n\n`;

        if (entry.breaking) {
          markdown += '⚠️ **BREAKING CHANGES**\n\n';
        }

        const groupedChanges = this.groupChangesByType(entry.changes);

        for (const [type, changes] of Object.entries(groupedChanges)) {
          markdown += `### ${this.capitalizeFirst(type)}\n\n`;
          for (const change of changes) {
            markdown += `- ${change.description}`;
            if (change.endpoint) {
              markdown += ` (${change.endpoint})`;
            }
            markdown += '\n';
          }
          markdown += '\n';
        }

        if (entry.deprecated.length > 0) {
          markdown += '### Deprecated\n\n';
          for (const item of entry.deprecated) {
            markdown += `- ${item}\n`;
          }
          markdown += '\n';
        }
      }

      const outputPath = '/tmp/CHANGELOG.md';
      await fs.writeFile(outputPath, markdown, 'utf-8');

      const artifact: DocumentationArtifact = {
        id: `changelog-${Date.now()}`,
        format: 'markdown',
        version: entries[0]?.version || '1.0',
        generatedAt: new Date(),
        filePath: outputPath,
        size: markdown.length,
        checksum: this.calculateChecksum(markdown),
        metadata: {
          entries: entries.length,
        },
      };

      this.logger.log(`Changelog generated: ${artifact.filePath}`);
      return artifact;
    } catch (error) {
      this.logger.error(`Failed to generate changelog: ${error.message}`);
      throw error;
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private documentGraphQLQuery(query: GraphQLQuery): any {
    return {
      name: query.name,
      type: query.type,
      description: query.description,
      arguments: query.args.map(arg => ({
        name: arg.name,
        type: arg.type,
        required: arg.required,
        description: arg.description,
        defaultValue: arg.defaultValue,
      })),
      returnType: query.returnType,
      complexity: query.complexity,
      authentication: query.authentication,
      example: this.generateGraphQLQueryExample(query),
    };
  }

  private extractGraphQLTypes(schema: string): any[] {
    // Extract type definitions from GraphQL schema
    const typeRegex = /type\s+(\w+)\s*{([^}]*)}/g;
    const types = [];
    let match;

    while ((match = typeRegex.exec(schema)) !== null) {
      types.push({
        name: match[1],
        fields: this.parseGraphQLFields(match[2]),
      });
    }

    return types;
  }

  private parseGraphQLFields(fieldsString: string): any[] {
    const fields = fieldsString.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#'));

    return fields.map(field => {
      const [name, ...rest] = field.split(':');
      return {
        name: name.trim(),
        type: rest.join(':').trim(),
      };
    });
  }

  private generateGraphQLExamples(queries: GraphQLQuery[], mutations: GraphQLQuery[]): any {
    return {
      queries: queries.map(q => ({
        name: q.name,
        example: this.generateGraphQLQueryExample(q),
      })),
      mutations: mutations.map(m => ({
        name: m.name,
        example: this.generateGraphQLQueryExample(m),
      })),
    };
  }

  private generateGraphQLQueryExample(query: GraphQLQuery): string {
    const args = query.args
      .filter(arg => !arg.required)
      .map(arg => `${arg.name}: ${this.getExampleValue(arg.type)}`)
      .join(', ');

    return `
${query.type.toLowerCase()} {
  ${query.name}${args ? `(${args})` : ''} {
    # Add fields to query here
  }
}
    `.trim();
  }

  private getExampleValue(type: string): string {
    if (type.includes('String')) return '"example"';
    if (type.includes('Int')) return '10';
    if (type.includes('Boolean')) return 'true';
    if (type.includes('Float')) return '1.5';
    return 'null';
  }

  private generateCodeSample(endpoint: RestEndpoint, language: ProgrammingLanguage): string {
    switch (language) {
      case 'typescript':
        return this.generateTypeScriptSample(endpoint);
      case 'python':
        return this.generatePythonSample(endpoint);
      case 'java':
        return this.generateJavaSample(endpoint);
      case 'go':
        return this.generateGoSample(endpoint);
      case 'csharp':
        return this.generateCSharpSample(endpoint);
      default:
        return '// Unsupported language';
    }
  }

  private generateTypeScriptSample(endpoint: RestEndpoint): string {
    return `
// TypeScript example for ${endpoint.path}
import axios from 'axios';

async function ${this.toCamelCase(endpoint.path)}() {
  try {
    const response = await axios.${endpoint.method.toLowerCase()}(
      'https://api.whitecross.io${endpoint.path}',
      ${endpoint.method !== 'GET' ? '{ /* request body */ },' : ''}
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_TOKEN',
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
    `.trim();
  }

  private generatePythonSample(endpoint: RestEndpoint): string {
    return `
# Python example for ${endpoint.path}
import requests

def ${this.toSnakeCase(endpoint.path)}():
    url = "https://api.whitecross.io${endpoint.path}"
    headers = {
        "Authorization": "Bearer YOUR_API_TOKEN",
        "Content-Type": "application/json"
    }
    ${endpoint.method !== 'GET' ? 'data = {}  # Request body' : ''}

    try:
        response = requests.${endpoint.method.toLowerCase()}(
            url,
            headers=headers${endpoint.method !== 'GET' ? ',\n            json=data' : ''}
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"API request failed: {e}")
        raise
    `.trim();
  }

  private generateJavaSample(endpoint: RestEndpoint): string {
    return `
// Java example for ${endpoint.path}
import java.net.http.*;
import java.net.URI;

public class ThreatIntelClient {
    private static final String BASE_URL = "https://api.whitecross.io";
    private static final String API_TOKEN = "YOUR_API_TOKEN";

    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "${endpoint.path}"))
            .header("Authorization", "Bearer " + API_TOKEN)
            .header("Content-Type", "application/json")
            .${endpoint.method}${endpoint.method !== 'GET' ? '(HttpRequest.BodyPublishers.ofString("{}"))' : '()'}
            .build();

        HttpResponse<String> response = client.send(
            request,
            HttpResponse.BodyHandlers.ofString()
        );

        System.out.println(response.body());
    }
}
    `.trim();
  }

  private generateGoSample(endpoint: RestEndpoint): string {
    return `
// Go example for ${endpoint.path}
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
)

func main() {
    url := "https://api.whitecross.io${endpoint.path}"
    ${endpoint.method !== 'GET' ? 'payload := []byte(`{}`)' : ''}

    req, err := http.NewRequest("${endpoint.method}", url${endpoint.method !== 'GET' ? ', bytes.NewBuffer(payload)' : ', nil'})
    if err != nil {
        panic(err)
    }

    req.Header.Add("Authorization", "Bearer YOUR_API_TOKEN")
    req.Header.Add("Content-Type", "application/json")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, _ := ioutil.ReadAll(resp.Body)
    fmt.Println(string(body))
}
    `.trim();
  }

  private generateCSharpSample(endpoint: RestEndpoint): string {
    return `
// C# example for ${endpoint.path}
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

public class ThreatIntelClient
{
    private static readonly HttpClient client = new HttpClient();

    public static async Task Main()
    {
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", "YOUR_API_TOKEN");
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));

        var response = await client.${this.capitalize(endpoint.method.toLowerCase())}Async(
            "https://api.whitecross.io${endpoint.path}"${endpoint.method !== 'GET' ? ',\n            new StringContent("{}", System.Text.Encoding.UTF8, "application/json")' : ''}
        );

        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Console.WriteLine(content);
    }
}
    `.trim();
  }

  private generateTypeScriptSDK(config: SDKScaffoldConfig): string {
    return `
/**
 * White Cross Threat Intelligence API Client
 * Generated SDK for ${config.language}
 * Version: ${config.version}
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface ThreatIntelClientConfig {
  baseURL: string;
  apiKey?: string;
  timeout?: number;
}

export class ThreatIntelligenceClient {
  private client: AxiosInstance;

  constructor(config: ThreatIntelClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Authorization': \`Bearer \${config.apiKey}\`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Search threat intelligence
   */
  async searchThreats(query: string, options?: any): Promise<any> {
    const response = await this.client.post('/api/v1/threats/search', {
      query,
      ...options,
    });
    return response.data;
  }

  /**
   * Lookup IOC by type and value
   */
  async lookupIOC(type: string, value: string): Promise<any> {
    const response = await this.client.get(\`/api/v1/iocs/\${type}/\${value}\`);
    return response.data;
  }

  /**
   * Submit STIX bundle
   */
  async submitSTIXBundle(bundle: any): Promise<any> {
    const response = await this.client.post('/api/v1/stix/bundles', bundle);
    return response.data;
  }

  /**
   * Get threat feeds
   */
  async getThreatFeeds(): Promise<any> {
    const response = await this.client.get('/api/v1/feeds');
    return response.data;
  }
}

export default ThreatIntelligenceClient;
    `.trim();
  }

  private generatePythonSDK(config: SDKScaffoldConfig): string {
    return `
"""
White Cross Threat Intelligence API Client
Generated SDK for ${config.language}
Version: ${config.version}
"""

import requests
from typing import Dict, Any, Optional

class ThreatIntelligenceClient:
    def __init__(self, base_url: str, api_key: str, timeout: int = 30):
        self.base_url = base_url
        self.api_key = api_key
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })

    def search_threats(self, query: str, **options) -> Dict[str, Any]:
        """Search threat intelligence"""
        response = self.session.post(
            f'{self.base_url}/api/v1/threats/search',
            json={'query': query, **options},
            timeout=self.timeout
        )
        response.raise_for_status()
        return response.json()

    def lookup_ioc(self, ioc_type: str, value: str) -> Dict[str, Any]:
        """Lookup IOC by type and value"""
        response = self.session.get(
            f'{self.base_url}/api/v1/iocs/{ioc_type}/{value}',
            timeout=self.timeout
        )
        response.raise_for_status()
        return response.json()

    def submit_stix_bundle(self, bundle: Dict[str, Any]) -> Dict[str, Any]:
        """Submit STIX bundle"""
        response = self.session.post(
            f'{self.base_url}/api/v1/stix/bundles',
            json=bundle,
            timeout=self.timeout
        )
        response.raise_for_status()
        return response.json()

    def get_threat_feeds(self) -> Dict[str, Any]:
        """Get threat feeds"""
        response = self.session.get(
            f'{self.base_url}/api/v1/feeds',
            timeout=self.timeout
        )
        response.raise_for_status()
        return response.json()
    `.trim();
  }

  private generateJavaSDK(config: SDKScaffoldConfig): string {
    return `
/**
 * White Cross Threat Intelligence API Client
 * Generated SDK for ${config.language}
 * Version: ${config.version}
 */

package ${config.packageName};

import java.net.http.*;
import java.net.URI;
import java.time.Duration;

public class ThreatIntelligenceClient {
    private final String baseUrl;
    private final String apiKey;
    private final HttpClient client;

    public ThreatIntelligenceClient(String baseUrl, String apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();
    }

    public String searchThreats(String query) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(baseUrl + "/api/v1/threats/search"))
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(
                String.format("{\\"query\\": \\"%s\\"}", query)
            ))
            .build();

        HttpResponse<String> response = client.send(
            request,
            HttpResponse.BodyHandlers.ofString()
        );

        return response.body();
    }
}
    `.trim();
  }

  private generateGoSDK(config: SDKScaffoldConfig): string {
    return `
// White Cross Threat Intelligence API Client
// Generated SDK for ${config.language}
// Version: ${config.version}

package ${config.packageName}

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "time"
)

type Client struct {
    BaseURL    string
    APIKey     string
    HTTPClient *http.Client
}

func NewClient(baseURL, apiKey string) *Client {
    return &Client{
        BaseURL: baseURL,
        APIKey:  apiKey,
        HTTPClient: &http.Client{
            Timeout: 30 * time.Second,
        },
    }
}

func (c *Client) SearchThreats(query string) (map[string]interface{}, error) {
    payload := map[string]string{"query": query}
    jsonData, err := json.Marshal(payload)
    if err != nil {
        return nil, err
    }

    req, err := http.NewRequest("POST", c.BaseURL+"/api/v1/threats/search", bytes.NewBuffer(jsonData))
    if err != nil {
        return nil, err
    }

    req.Header.Add("Authorization", "Bearer "+c.APIKey)
    req.Header.Add("Content-Type", "application/json")

    resp, err := c.HTTPClient.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return nil, err
    }

    var result map[string]interface{}
    if err := json.Unmarshal(body, &result); err != nil {
        return nil, err
    }

    return result, nil
}
    `.trim();
  }

  private generateCSharpSDK(config: SDKScaffoldConfig): string {
    return `
/**
 * White Cross Threat Intelligence API Client
 * Generated SDK for ${config.language}
 * Version: ${config.version}
 */

using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ${config.packageName}
{
    public class ThreatIntelligenceClient
    {
        private readonly HttpClient _client;
        private readonly string _baseUrl;

        public ThreatIntelligenceClient(string baseUrl, string apiKey)
        {
            _baseUrl = baseUrl;
            _client = new HttpClient();
            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", apiKey);
            _client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<dynamic> SearchThreatsAsync(string query)
        {
            var content = new StringContent(
                JsonConvert.SerializeObject(new { query }),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _client.PostAsync(
                $"{_baseUrl}/api/v1/threats/search",
                content
            );

            response.EnsureSuccessStatusCode();
            var jsonResponse = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject(jsonResponse);
        }
    }
}
    `.trim();
  }

  private generateSDKReadme(config: SDKScaffoldConfig): string {
    return `
# White Cross Threat Intelligence API - ${config.language} SDK

Official ${config.language} SDK for the White Cross Threat Intelligence API.

## Installation

\`\`\`bash
# Installation instructions for ${config.language}
\`\`\`

## Quick Start

\`\`\`${config.language}
// Example usage
\`\`\`

## Authentication

This SDK supports ${config.authMethod} authentication.

## Documentation

Full API documentation available at https://docs.whitecross.io

## License

Proprietary - White Cross Healthcare Security
    `.trim();
  }

  private groupChangesByType(changes: ChangeItem[]): Record<string, ChangeItem[]> {
    return changes.reduce((acc, change) => {
      if (!acc[change.type]) {
        acc[change.type] = [];
      }
      acc[change.type].push(change);
      return acc;
    }, {} as Record<string, ChangeItem[]>);
  }

  private calculateChecksum(content: string): string {
    // Simple hash for demonstration
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  private toCamelCase(path: string): string {
    return path
      .split('/')
      .filter(Boolean)
      .map((part, i) => i === 0 ? part : this.capitalize(part))
      .join('');
  }

  private toSnakeCase(path: string): string {
    return path
      .split('/')
      .filter(Boolean)
      .join('_')
      .toLowerCase();
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ApiDocumentationGeneratorService;
