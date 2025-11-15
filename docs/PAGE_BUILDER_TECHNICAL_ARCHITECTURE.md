# Page Builder Technical Architecture

Detailed technical architecture and implementation guide for the Next.js page builder system.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Patterns](#architecture-patterns)
3. [Data Models](#data-models)
4. [API Design](#api-design)
5. [Frontend Architecture](#frontend-architecture)
6. [Backend Architecture](#backend-architecture)
7. [Security Architecture](#security-architecture)
8. [Performance Optimization](#performance-optimization)
9. [Deployment Architecture](#deployment-architecture)
10. [Monitoring & Observability](#monitoring--observability)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 16 Frontend (React 19, TypeScript)                     │
│  - Page Builder UI (Canvas, Sidebar, Toolbar)                   │
│  - Component Library Browser                                     │
│  - Template Marketplace                                          │
│  - Analytics Dashboard                                           │
└────────────┬────────────────────────────────────────────────────┘
             │ HTTPS/WSS
             ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  NestJS Backend                                                  │
│  - REST API (Express)                                            │
│  - GraphQL API (Apollo Server)                                   │
│  - WebSocket (Socket.IO)                                         │
└────────────┬───────────────────────────────┬────────────────────┘
             │                               │
             ↓                               ↓
┌──────────────────────────┐    ┌──────────────────────────┐
│   Business Logic Layer   │    │   Real-time Layer        │
├──────────────────────────┤    ├──────────────────────────┤
│ Page Builder Module      │    │ WebSocket Gateway        │
│ - PageService            │    │ - Session Manager        │
│ - ComponentService       │    │ - Presence Service       │
│ - TemplateService        │    │ - Change Broadcaster     │
│ - VersionService         │    └────────────┬─────────────┘
│ - DeploymentService      │                 │
│                          │                 │
│ Enterprise Features      │                 │
│ - DesignSystemService    │                 │
│ - WorkflowService        │                 │
│ - ExperimentService      │                 │
│ - AnalyticsService       │                 │
└──────────┬───────────────┘                 │
           │                                 │
           ↓                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Data Access Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  Sequelize ORM (PostgreSQL)                                      │
│  - Page Repository                                               │
│  - Component Repository                                          │
│  - Version Repository                                            │
└────────────┬────────────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Persistence Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL (Primary Database)                                   │
│  Redis (Cache + Session + Queue)                                 │
│  S3 (Assets Storage)                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Infrastructure Layer                        │
├─────────────────────────────────────────────────────────────────┤
│  Bull Queue (Background Jobs)                                    │
│  CloudFront (CDN)                                                │
│  Sentry (Error Tracking)                                         │
│  Datadog (Monitoring)                                            │
└─────────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
User Action (e.g., "Add Component")
         │
         ↓
Frontend: Page Builder Canvas
         │
         ├─ Optimistic Update (UI shows component immediately)
         │
         ↓
Frontend: API Call (GraphQL/REST)
         │
         ↓
Backend: Authentication Middleware (JWT)
         │
         ↓
Backend: Authorization Guard (RolesGuard)
         │
         ↓
Backend: Validation Pipe (DTO Validation)
         │
         ↓
Backend: PageService.addComponent()
         │
         ├─ Validate component schema
         ├─ Create component instance
         ├─ Update page structure
         ├─ Create auto-save version
         ├─ Emit event (component.added)
         │
         ↓
Backend: Database Transaction
         │
         ├─ Insert into component_instances
         ├─ Update pages.structure
         ├─ Insert into page_versions (auto-save)
         ├─ Insert into audit_log
         │
         ↓
Backend: Post-Processing
         │
         ├─ Invalidate cache (Redis)
         ├─ Broadcast to WebSocket (other collaborators)
         ├─ Trigger analytics event
         │
         ↓
Frontend: Response Handler
         │
         ├─ Update React Query cache
         ├─ Show success notification
         ├─ Update version indicator
```

---

## Architecture Patterns

### 1. Domain-Driven Design (DDD)

Organize code by business domains:

```
backend/src/
├── page-builder/              # Bounded Context: Page Builder
│   ├── pages/                 # Aggregate: Page
│   │   ├── entities/
│   │   │   └── page.entity.ts
│   │   ├── repositories/
│   │   │   └── page.repository.ts
│   │   ├── services/
│   │   │   ├── page.service.ts
│   │   │   ├── page-validation.service.ts
│   │   │   └── page-query.service.ts
│   │   ├── dto/
│   │   ├── controllers/
│   │   └── resolvers/        # GraphQL
│   │
│   ├── components/            # Aggregate: Component
│   ├── templates/             # Aggregate: Template
│   ├── versions/              # Aggregate: Version
│   └── shared/                # Shared kernel
│
├── enterprise-features/       # Bounded Context: Enterprise
│   ├── design-system/
│   ├── workflows/
│   └── experiments/
```

### 2. CQRS (Command Query Responsibility Segregation)

Separate read and write operations:

```typescript
// Command (Write)
class CreatePageCommand {
  constructor(
    public readonly name: string,
    public readonly template?: string
  ) {}
}

class CreatePageHandler implements ICommandHandler<CreatePageCommand> {
  async execute(command: CreatePageCommand): Promise<Page> {
    // 1. Validate
    // 2. Create page
    // 3. Save to database
    // 4. Emit event
    // 5. Return result
  }
}

// Query (Read)
class GetPageQuery {
  constructor(public readonly id: string) {}
}

class GetPageHandler implements IQueryHandler<GetPageQuery> {
  async execute(query: GetPageQuery): Promise<Page> {
    // 1. Check cache
    // 2. Query database (optimized read model)
    // 3. Transform to DTO
    // 4. Return result
  }
}

// Usage
@Controller('pages')
class PageController {
  @Post()
  async create(@Body() dto: CreatePageDto) {
    return this.commandBus.execute(new CreatePageCommand(dto.name));
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.queryBus.execute(new GetPageQuery(id));
  }
}
```

### 3. Event-Driven Architecture

Use events for loose coupling:

```typescript
// Event Definition
class PagePublishedEvent {
  constructor(
    public readonly pageId: string,
    public readonly versionId: string,
    public readonly environmentId: string,
    public readonly publishedBy: string,
    public readonly publishedAt: Date
  ) {}
}

// Event Emitter (Publisher)
class PageService {
  async publishPage(pageId: string, environmentId: string): Promise<void> {
    // ... publish logic ...

    // Emit event
    this.eventEmitter.emit('page.published', new PagePublishedEvent(
      pageId,
      versionId,
      environmentId,
      userId,
      new Date()
    ));
  }
}

// Event Handlers (Subscribers)
@OnEvent('page.published')
class DeploymentListener {
  async handlePagePublished(event: PagePublishedEvent): Promise<void> {
    // Trigger deployment job
    await this.deploymentService.deploy(event.pageId, event.environmentId);
  }
}

@OnEvent('page.published')
class AnalyticsListener {
  async handlePagePublished(event: PagePublishedEvent): Promise<void> {
    // Track analytics
    await this.analyticsService.track('page_published', {
      pageId: event.pageId,
      environmentId: event.environmentId
    });
  }
}

@OnEvent('page.published')
class AuditListener {
  async handlePagePublished(event: PagePublishedEvent): Promise<void> {
    // Create audit log
    await this.auditService.log({
      action: 'page.publish',
      userId: event.publishedBy,
      resourceId: event.pageId,
      metadata: { environmentId: event.environmentId }
    });
  }
}
```

### 4. Repository Pattern

Abstract data access:

```typescript
// Repository Interface
interface IPageRepository {
  findById(id: string): Promise<Page | null>;
  findAll(filters: PageFilters): Promise<Page[]>;
  create(page: CreatePageDto): Promise<Page>;
  update(id: string, updates: UpdatePageDto): Promise<Page>;
  delete(id: string): Promise<void>;
}

// Repository Implementation
@Injectable()
class PageRepository implements IPageRepository {
  constructor(
    @InjectModel(PageModel)
    private readonly pageModel: typeof PageModel,
    private readonly cacheService: CacheService
  ) {}

  async findById(id: string): Promise<Page | null> {
    // Try cache first
    const cached = await this.cacheService.get(`page:${id}`);
    if (cached) return cached;

    // Query database
    const page = await this.pageModel.findByPk(id, {
      include: [
        { model: ComponentInstanceModel, as: 'components' },
        { model: PageVersionModel, as: 'versions', limit: 1, order: [['createdAt', 'DESC']] }
      ]
    });

    if (!page) return null;

    // Cache result
    await this.cacheService.set(`page:${id}`, page, 300); // 5 min TTL

    return page;
  }

  // ... other methods ...
}

// Service uses Repository
@Injectable()
class PageService {
  constructor(
    private readonly pageRepository: IPageRepository // Inject interface
  ) {}

  async getPage(id: string): Promise<Page> {
    const page = await this.pageRepository.findById(id);
    if (!page) throw new NotFoundException('Page not found');
    return page;
  }
}
```

### 5. Strategy Pattern

For extensible algorithms (e.g., deployment strategies):

```typescript
// Strategy Interface
interface IDeploymentStrategy {
  deploy(deployment: Deployment): Promise<DeploymentResult>;
  rollback(deployment: Deployment): Promise<void>;
}

// Concrete Strategies
class AllAtOnceStrategy implements IDeploymentStrategy {
  async deploy(deployment: Deployment): Promise<DeploymentResult> {
    // Deploy to all instances simultaneously
    // Fast but risky
  }
}

class BlueGreenStrategy implements IDeploymentStrategy {
  async deploy(deployment: Deployment): Promise<DeploymentResult> {
    // 1. Deploy to "green" environment
    // 2. Run health checks
    // 3. Switch traffic from "blue" to "green"
    // 4. Keep "blue" for rollback
  }
}

class CanaryStrategy implements IDeploymentStrategy {
  async deploy(deployment: Deployment): Promise<DeploymentResult> {
    // 1. Deploy to 10% of instances
    // 2. Monitor metrics
    // 3. If healthy, gradually increase to 100%
    // 4. If errors, rollback
  }
}

// Strategy Factory
@Injectable()
class DeploymentStrategyFactory {
  create(strategy: string): IDeploymentStrategy {
    switch (strategy) {
      case 'all-at-once':
        return new AllAtOnceStrategy();
      case 'blue-green':
        return new BlueGreenStrategy();
      case 'canary':
        return new CanaryStrategy();
      default:
        throw new Error(`Unknown strategy: ${strategy}`);
    }
  }
}

// Service uses Strategy
@Injectable()
class DeploymentService {
  constructor(
    private readonly strategyFactory: DeploymentStrategyFactory
  ) {}

  async deploy(deployment: Deployment): Promise<DeploymentResult> {
    const strategy = this.strategyFactory.create(deployment.strategy);
    return strategy.deploy(deployment);
  }
}
```

---

## Data Models

### Core Page Builder Models

```typescript
// Page Model
interface Page {
  id: string;
  name: string;
  slug: string;
  description?: string;

  // Structure
  structure: PageStructure;
  layout: PageLayout;
  metadata: PageMetadata;

  // Ownership
  organizationId: string;
  ownerId: string;
  teamId?: string;

  // Status
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  publishedBy?: string;

  // Versioning
  currentVersionId: string;
  latestVersionNumber: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface PageStructure {
  components: ComponentInstance[];
  layout: {
    type: 'container' | 'grid' | 'flex';
    config: Record<string, any>;
  };
  scripts?: Script[];
  styles?: StyleSheet[];
}

interface ComponentInstance {
  id: string;
  componentId: string; // Reference to component library
  props: Record<string, any>;
  children?: ComponentInstance[];
  slot?: string; // If nested in parent slot
  order: number;
}

interface PageLayout {
  width: 'full' | 'wide' | 'normal' | 'narrow';
  maxWidth?: number;
  padding?: Spacing;
  backgroundColor?: string;
  backgroundImage?: string;
}

interface PageMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
  customHead?: string;
}

// Component Library Model
interface Component {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: ComponentCategory;
  version: string;

  // Schema
  schema: {
    props: Record<string, PropDefinition>;
    defaultProps: Record<string, any>;
    slots?: SlotDefinition[];
    events?: EventDefinition[];
  };

  // Rendering
  template: string; // React component code or template string
  styles?: string; // CSS/SCSS
  dependencies?: string[]; // Other components this depends on

  // Configuration UI
  configUI: {
    [propName: string]: ConfigControl;
  };

  // Visibility
  visibility: 'private' | 'team' | 'organization' | 'public';
  ownerId: string;
  teamId?: string;

  // Stats
  usageCount: number;
  averageRating?: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

interface PropDefinition {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'enum';
  required: boolean;
  default?: any;
  description: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: any[];
  };
}

interface SlotDefinition {
  name: string;
  description: string;
  allowedComponents?: string[]; // Component IDs that can be placed in this slot
  maxComponents?: number;
}

interface EventDefinition {
  name: string;
  description: string;
  payload?: Record<string, any>;
}

interface ConfigControl {
  type: 'text' | 'textarea' | 'number' | 'select' | 'color' | 'toggle' | 'slider' | 'image' | 'code';
  label: string;
  helpText?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
  min?: number;
  max?: number;
  step?: number;
}

// Page Version Model
interface PageVersion {
  id: string;
  pageId: string;
  versionNumber: number;
  branch: string; // e.g., 'main', 'feature/new-hero'

  // Snapshot
  snapshot: PageStructure;
  metadata: PageMetadata;

  // Version Control
  parentVersionId?: string;
  commitMessage?: string;
  tags?: string[];

  // Deployment
  isPublished: boolean;
  publishedEnvironments?: string[];

  // Author
  authorId: string;
  createdAt: Date;
}

// Template Model
interface PageTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];

  // Preview
  thumbnailUrl: string;
  previewUrl?: string;
  screenshots?: string[];

  // Content
  schema: PageStructure;
  metadata: PageMetadata;

  // Marketplace
  isPublic: boolean;
  isPremium: boolean;
  price?: number;
  authorId: string;
  organizationId?: string;

  // Stats
  downloadCount: number;
  viewCount: number;
  averageRating: number;
  ratingCount: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Design System Model
interface DesignSystem {
  id: string;
  name: string;
  version: string;

  tokens: {
    colors: ColorTokens;
    typography: TypographyTokens;
    spacing: SpacingTokens;
    shadows: ShadowTokens;
    borders: BorderTokens;
    radii: RadiusTokens;
    animations: AnimationTokens;
  };

  themes: {
    [themeName: string]: ThemeOverride;
  };

  organizationId: string;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

interface ColorTokens {
  // Primitive colors
  primitive: {
    blue: { [key: string]: string }; // blue-50, blue-100, ..., blue-900
    gray: { [key: string]: string };
    red: { [key: string]: string };
    green: { [key: string]: string };
    yellow: { [key: string]: string };
    // ... other colors
  };

  // Semantic colors (references to primitive)
  semantic: {
    primary: string; // e.g., "$colors.primitive.blue.500"
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    // ... more semantic colors
  };

  // Component-specific colors (references to semantic)
  component: {
    buttonPrimary: string; // e.g., "$colors.semantic.primary"
    buttonSecondary: string;
    // ... more component colors
  };
}

// Environment Model
interface Environment {
  id: string;
  name: string;
  type: 'development' | 'staging' | 'production' | 'preview';
  slug: string;

  config: {
    baseUrl: string;
    apiUrl: string;
    cdnUrl: string;
    features: Record<string, boolean>;
  };

  deploymentConfig: {
    branch?: string;
    autoDeployOn?: 'push' | 'tag' | 'manual';
    buildCommand: string;
    healthCheckUrl: string;
  };

  accessConfig: {
    public: boolean;
    requiresAuth: boolean;
    allowedUsers?: string[];
    allowedRoles?: string[];
    ipWhitelist?: string[];
  };

  organizationId: string;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// Deployment Model
interface Deployment {
  id: string;
  environmentId: string;
  pageIds: string[];
  versionIds: string[];

  strategy: 'all-at-once' | 'rolling' | 'blue-green' | 'canary';
  status: 'queued' | 'building' | 'deploying' | 'verifying' | 'success' | 'failed' | 'rolled-back';

  buildOutput: {
    buildTime: number;
    buildSize: number;
    assetCount: number;
    warnings: string[];
  };

  deploymentOutput: {
    deploymentUrl: string;
    cdnUrls: string[];
    invalidatedPaths: string[];
  };

  healthChecks: {
    passed: boolean;
    checks: Array<{
      name: string;
      status: 'pass' | 'fail';
      message?: string;
    }>;
  };

  triggeredBy: string;
  triggeredAt: Date;
  completedAt?: Date;
  duration?: number;

  error?: string;
  logs: string[];
}
```

### Database Migrations

```typescript
// Migration: Create pages table
export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('pages', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    },
    structure: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: { components: [], layout: { type: 'container' } }
    },
    layout: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'organizations',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'RESTRICT'
    },
    team_id: {
      type: DataTypes.UUID,
      references: {
        model: 'teams',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft',
      allowNull: false
    },
    published_at: {
      type: DataTypes.DATE
    },
    published_by: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    current_version_id: {
      type: DataTypes.UUID
    },
    latest_version_number: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    deleted_at: {
      type: DataTypes.DATE
    }
  });

  // Indexes
  await queryInterface.addIndex('pages', ['organization_id', 'status'], {
    where: { deleted_at: null }
  });
  await queryInterface.addIndex('pages', ['owner_id']);
  await queryInterface.addIndex('pages', ['team_id']);
  await queryInterface.addIndex('pages', ['slug'], { unique: true });
  await queryInterface.addIndex('pages', ['updated_at']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('pages');
}
```

---

## API Design

### GraphQL Schema

```graphql
# Page Types
type Page {
  id: ID!
  name: String!
  slug: String!
  description: String
  structure: PageStructure!
  layout: PageLayout!
  metadata: PageMetadata!

  # Ownership
  organization: Organization!
  owner: User!
  team: Team

  # Status
  status: PageStatus!
  publishedAt: DateTime
  publishedBy: User

  # Versioning
  currentVersion: PageVersion!
  versions(limit: Int, offset: Int): [PageVersion!]!
  latestVersionNumber: Int!

  # Relations
  components: [ComponentInstance!]!
  deployments: [Deployment!]!
  analytics: PageAnalytics

  # Timestamps
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum PageStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

type PageStructure {
  components: [ComponentInstance!]!
  layout: LayoutConfig!
  scripts: [Script!]
  styles: [StyleSheet!]
}

type ComponentInstance {
  id: ID!
  component: Component!
  props: JSON!
  children: [ComponentInstance!]
  slot: String
  order: Int!
}

# Component Library Types
type Component {
  id: ID!
  name: String!
  displayName: String!
  description: String
  category: ComponentCategory!
  version: String!

  schema: ComponentSchema!
  template: String!
  styles: String
  dependencies: [Component!]

  visibility: ComponentVisibility!
  owner: User!

  usageCount: Int!
  averageRating: Float

  createdAt: DateTime!
  updatedAt: DateTime!
}

type ComponentSchema {
  props: [PropDefinition!]!
  defaultProps: JSON!
  slots: [SlotDefinition!]
  events: [EventDefinition!]
}

enum ComponentCategory {
  LAYOUT
  CONTENT
  FORM
  MEDIA
  DATA
  NAVIGATION
}

# Query Operations
type Query {
  # Pages
  page(id: ID!): Page
  pages(
    filters: PageFilters
    sort: PageSort
    limit: Int
    offset: Int
  ): PaginatedPages!

  # Components
  component(id: ID!): Component
  components(
    category: ComponentCategory
    visibility: ComponentVisibility
    search: String
  ): [Component!]!

  # Templates
  template(id: ID!): PageTemplate
  templates(
    category: TemplateCategory
    tags: [String!]
    search: String
  ): [PageTemplate!]!

  # Versions
  pageVersion(id: ID!): PageVersion
  pageVersions(
    pageId: ID!
    branch: String
    limit: Int
  ): [PageVersion!]!
  compareVersions(
    versionId1: ID!
    versionId2: ID!
  ): VersionDiff!

  # Design System
  designSystem: DesignSystem

  # Environments
  environments: [Environment!]!
  environment(id: ID!): Environment

  # Analytics
  pageAnalytics(
    pageId: ID!
    dateRange: DateRangeInput!
  ): PageAnalytics!
}

# Mutation Operations
type Mutation {
  # Page Mutations
  createPage(input: CreatePageInput!): Page!
  updatePage(id: ID!, input: UpdatePageInput!): Page!
  deletePage(id: ID!): Boolean!
  publishPage(id: ID!, environmentId: ID!): Deployment!
  duplicatePage(id: ID!): Page!

  # Component Mutations
  addComponent(
    pageId: ID!
    componentId: ID!
    parentId: ID
    slot: String
    props: JSON
  ): ComponentInstance!
  updateComponent(
    id: ID!
    props: JSON
  ): ComponentInstance!
  removeComponent(id: ID!): Boolean!
  reorderComponents(
    pageId: ID!
    componentIds: [ID!]!
  ): Boolean!

  # Component Library Mutations
  createComponent(input: CreateComponentInput!): Component!
  updateComponent(id: ID!, input: UpdateComponentInput!): Component!
  deleteComponent(id: ID!): Boolean!

  # Version Mutations
  saveVersion(
    pageId: ID!
    message: String
  ): PageVersion!
  restoreVersion(versionId: ID!): Page!
  createBranch(
    pageId: ID!
    branchName: String!
    fromVersionId: ID
  ): PageVersion!
  mergeBranch(
    pageId: ID!
    sourceBranch: String!
    targetBranch: String!
  ): PageVersion!

  # Template Mutations
  createTemplate(input: CreateTemplateInput!): PageTemplate!
  installTemplate(templateId: ID!): Page!

  # Design System Mutations
  updateDesignSystem(input: UpdateDesignSystemInput!): DesignSystem!

  # Deployment Mutations
  deploy(
    environmentId: ID!
    pageIds: [ID!]!
    strategy: DeploymentStrategy
  ): Deployment!
  rollback(deploymentId: ID!): Deployment!

  # Export/Import
  exportPage(pageId: ID!): ExportJob!
  importPage(file: Upload!): ImportJob!
}

# Subscription Operations
type Subscription {
  # Real-time collaboration
  pageUpdated(pageId: ID!): PageUpdateEvent!
  componentAdded(pageId: ID!): ComponentInstance!
  componentUpdated(pageId: ID!): ComponentInstance!
  componentRemoved(pageId: ID!): ID!

  # Presence
  collaboratorsChanged(pageId: ID!): [Collaborator!]!
  cursorMoved(pageId: ID!): CursorPosition!

  # Deployment
  deploymentStatusChanged(deploymentId: ID!): Deployment!
}

# Input Types
input CreatePageInput {
  name: String!
  slug: String
  description: String
  templateId: ID
  teamId: ID
}

input UpdatePageInput {
  name: String
  slug: String
  description: String
  structure: PageStructureInput
  layout: PageLayoutInput
  metadata: PageMetadataInput
}

input PageFilters {
  status: PageStatus
  ownerId: ID
  teamId: ID
  search: String
  createdAfter: DateTime
  updatedAfter: DateTime
}

input DateRangeInput {
  start: DateTime!
  end: DateTime!
}

# Pagination
type PaginatedPages {
  items: [Page!]!
  total: Int!
  hasMore: Boolean!
  offset: Int!
  limit: Int!
}
```

### REST API Endpoints

```typescript
// Pages
GET    /api/v1/pages              // List pages
GET    /api/v1/pages/:id          // Get page by ID
POST   /api/v1/pages              // Create page
PUT    /api/v1/pages/:id          // Update page
DELETE /api/v1/pages/:id          // Delete page
POST   /api/v1/pages/:id/publish  // Publish page
POST   /api/v1/pages/:id/duplicate // Duplicate page

// Components (within a page)
GET    /api/v1/pages/:id/components                    // List components in page
POST   /api/v1/pages/:id/components                    // Add component to page
PUT    /api/v1/pages/:pageId/components/:componentId   // Update component instance
DELETE /api/v1/pages/:pageId/components/:componentId   // Remove component from page
PUT    /api/v1/pages/:id/components/reorder            // Reorder components

// Component Library
GET    /api/v1/components         // List components in library
GET    /api/v1/components/:id     // Get component by ID
POST   /api/v1/components         // Create component
PUT    /api/v1/components/:id     // Update component
DELETE /api/v1/components/:id     // Delete component
GET    /api/v1/components/:id/usage // Get component usage stats

// Templates
GET    /api/v1/templates          // List templates
GET    /api/v1/templates/:id      // Get template by ID
POST   /api/v1/templates          // Create template
POST   /api/v1/templates/:id/install // Install template

// Versions
GET    /api/v1/pages/:id/versions           // List versions
POST   /api/v1/pages/:id/versions           // Create version (save)
GET    /api/v1/pages/:id/versions/:versionId // Get version
POST   /api/v1/pages/:id/versions/:versionId/restore // Restore version
GET    /api/v1/pages/:id/versions/:v1/diff/:v2       // Compare versions

// Design System
GET    /api/v1/design-system      // Get design system
PUT    /api/v1/design-system      // Update design system
GET    /api/v1/design-system/tokens // Get tokens
PUT    /api/v1/design-system/tokens // Update tokens
POST   /api/v1/design-system/export // Export design system

// Environments
GET    /api/v1/environments       // List environments
GET    /api/v1/environments/:id   // Get environment
PUT    /api/v1/environments/:id   // Update environment

// Deployments
POST   /api/v1/deployments        // Create deployment
GET    /api/v1/deployments/:id    // Get deployment status
POST   /api/v1/deployments/:id/rollback // Rollback deployment
GET    /api/v1/deployments/:id/logs     // Get deployment logs

// Analytics
GET    /api/v1/analytics/pages/:id      // Get page analytics
GET    /api/v1/analytics/pages/:id/events // Get page events
POST   /api/v1/analytics/events         // Track event

// Export/Import
POST   /api/v1/pages/:id/export         // Export page
POST   /api/v1/import                   // Import page
GET    /api/v1/export-jobs/:id          // Check export status
GET    /api/v1/import-jobs/:id          // Check import status

// Audit Logs
GET    /api/v1/audit-logs               // List audit logs
GET    /api/v1/audit-logs/:id           // Get audit log
POST   /api/v1/audit-logs/export        // Export audit logs
```

### API Response Format

```typescript
// Success Response
{
  "success": true,
  "data": {
    "id": "page-123",
    "name": "Homepage",
    "slug": "homepage",
    // ... other fields
  },
  "meta": {
    "timestamp": "2024-11-14T10:30:00Z",
    "version": "1.0",
    "requestId": "req-abc123"
  }
}

// List Response (with pagination)
{
  "success": true,
  "data": [
    { "id": "page-1", ... },
    { "id": "page-2", ... }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  },
  "meta": {
    "timestamp": "2024-11-14T10:30:00Z",
    "version": "1.0",
    "requestId": "req-abc123"
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid page name",
    "details": [
      {
        "field": "name",
        "message": "Page name must be at least 3 characters"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-11-14T10:30:00Z",
    "version": "1.0",
    "requestId": "req-abc123"
  }
}
```

---

## Frontend Architecture

### State Management

```typescript
// Redux Store Structure
{
  auth: {
    user: User | null,
    token: string | null,
    permissions: Permission[]
  },

  pageBuilder: {
    currentPage: Page | null,
    selectedComponent: string | null,
    hoveredComponent: string | null,
    clipboard: ComponentInstance | null,
    history: {
      past: PageStructure[],
      present: PageStructure,
      future: PageStructure[]
    },
    isEditMode: boolean,
    zoom: number
  },

  components: {
    library: Component[],
    instances: Record<string, ComponentInstance>
  },

  templates: {
    items: PageTemplate[],
    categories: TemplateCategory[]
  },

  versions: {
    items: PageVersion[],
    current: PageVersion | null,
    branches: string[]
  },

  collaboration: {
    session: PageSession | null,
    participants: Participant[],
    cursors: Record<string, CursorPosition>,
    comments: PageComment[]
  },

  ui: {
    sidebarOpen: boolean,
    propertyPanelOpen: boolean,
    selectedTab: 'components' | 'layers' | 'settings',
    notifications: Notification[]
  }
}

// Page Builder Slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const pageBuilderSlice = createSlice({
  name: 'pageBuilder',
  initialState: {
    currentPage: null,
    selectedComponent: null,
    hoveredComponent: null,
    clipboard: null,
    history: {
      past: [],
      present: { components: [], layout: { type: 'container' } },
      future: []
    },
    isEditMode: true,
    zoom: 100
  },
  reducers: {
    // Page Actions
    setCurrentPage(state, action: PayloadAction<Page>) {
      state.currentPage = action.payload;
      state.history.present = action.payload.structure;
      state.history.past = [];
      state.history.future = [];
    },

    // Component Selection
    selectComponent(state, action: PayloadAction<string | null>) {
      state.selectedComponent = action.payload;
    },
    hoverComponent(state, action: PayloadAction<string | null>) {
      state.hoveredComponent = action.payload;
    },

    // Component Operations
    addComponent(state, action: PayloadAction<{
      component: ComponentInstance;
      parentId?: string;
      position?: number;
    }>) {
      // Save current state to history
      state.history.past.push(state.history.present);
      state.history.future = []; // Clear redo stack

      // Add component
      const { component, parentId, position } = action.payload;
      if (parentId) {
        // Add to parent's children
        const parent = findComponent(state.history.present.components, parentId);
        if (parent) {
          if (!parent.children) parent.children = [];
          if (position !== undefined) {
            parent.children.splice(position, 0, component);
          } else {
            parent.children.push(component);
          }
        }
      } else {
        // Add to root
        if (position !== undefined) {
          state.history.present.components.splice(position, 0, component);
        } else {
          state.history.present.components.push(component);
        }
      }
    },

    updateComponent(state, action: PayloadAction<{
      id: string;
      props: Record<string, any>;
    }>) {
      // Save current state to history
      state.history.past.push(state.history.present);
      state.history.future = [];

      // Update component
      const { id, props } = action.payload;
      const component = findComponent(state.history.present.components, id);
      if (component) {
        component.props = { ...component.props, ...props };
      }
    },

    removeComponent(state, action: PayloadAction<string>) {
      // Save current state to history
      state.history.past.push(state.history.present);
      state.history.future = [];

      // Remove component
      state.history.present.components = removeComponentById(
        state.history.present.components,
        action.payload
      );
    },

    // Undo/Redo
    undo(state) {
      if (state.history.past.length > 0) {
        const previous = state.history.past[state.history.past.length - 1];
        state.history.past = state.history.past.slice(0, -1);
        state.history.future = [state.history.present, ...state.history.future];
        state.history.present = previous;
      }
    },
    redo(state) {
      if (state.history.future.length > 0) {
        const next = state.history.future[0];
        state.history.past = [...state.history.past, state.history.present];
        state.history.future = state.history.future.slice(1);
        state.history.present = next;
      }
    },

    // Clipboard
    copy(state) {
      if (state.selectedComponent) {
        const component = findComponent(
          state.history.present.components,
          state.selectedComponent
        );
        if (component) {
          state.clipboard = JSON.parse(JSON.stringify(component)); // Deep clone
        }
      }
    },
    paste(state) {
      if (state.clipboard) {
        const newComponent = {
          ...state.clipboard,
          id: generateId() // Generate new ID
        };
        state.history.past.push(state.history.present);
        state.history.future = [];
        state.history.present.components.push(newComponent);
      }
    }
  }
});

export const {
  setCurrentPage,
  selectComponent,
  hoverComponent,
  addComponent,
  updateComponent,
  removeComponent,
  undo,
  redo,
  copy,
  paste
} = pageBuilderSlice.actions;
export default pageBuilderSlice.reducer;
```

### React Query for Server State

```typescript
// hooks/usePages.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pageApi } from '@/lib/api/pages';

export function usePages(filters?: PageFilters) {
  return useQuery({
    queryKey: ['pages', filters],
    queryFn: () => pageApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePage(id: string) {
  return useQuery({
    queryKey: ['pages', id],
    queryFn: () => pageApi.getById(id),
    enabled: !!id,
  });
}

export function useCreatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePageInput) => pageApi.create(input),
    onSuccess: (newPage) => {
      // Invalidate pages list
      queryClient.invalidateQueries({ queryKey: ['pages'] });

      // Add to cache
      queryClient.setQueryData(['pages', newPage.id], newPage);
    },
  });
}

export function useUpdatePage(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdatePageInput) => pageApi.update(id, input),
    onMutate: async (input) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['pages', id] });

      const previousPage = queryClient.getQueryData(['pages', id]);

      queryClient.setQueryData(['pages', id], (old: any) => ({
        ...old,
        ...input,
      }));

      return { previousPage };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousPage) {
        queryClient.setQueryData(['pages', id], context.previousPage);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['pages', id] });
    },
  });
}

export function usePublishPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageId, environmentId }: { pageId: string; environmentId: string }) =>
      pageApi.publish(pageId, environmentId),
    onSuccess: (deployment) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['deployments'] });
    },
  });
}

// Auto-save hook
export function useAutoSave(pageId: string, debounceMs = 5000) {
  const queryClient = useQueryClient();
  const updatePage = useUpdatePage(pageId);

  const structure = useAppSelector(state => state.pageBuilder.history.present);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Save version automatically
      updatePage.mutate({ structure });
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [structure, debounceMs]);
}
```

### Component Architecture

```typescript
// Page Builder Canvas Component
import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { addComponent, selectComponent } from '@/stores/slices/pageBuilderSlice';
import { ComponentRenderer } from './ComponentRenderer';
import { DragOverlay } from './DragOverlay';

export function Canvas() {
  const dispatch = useAppDispatch();
  const structure = useAppSelector(state => state.pageBuilder.history.present);
  const selectedId = useAppSelector(state => state.pageBuilder.selectedComponent);
  const zoom = useAppSelector(state => state.pageBuilder.zoom);

  const [{ isOver }, drop] = useDrop({
    accept: 'COMPONENT',
    drop: (item: { component: Component }, monitor) => {
      if (!monitor.didDrop()) {
        // Create component instance
        const instance: ComponentInstance = {
          id: generateId(),
          componentId: item.component.id,
          props: item.component.schema.defaultProps,
          order: structure.components.length
        };

        dispatch(addComponent({ component: instance }));
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true })
    })
  });

  return (
    <div
      ref={drop}
      className="canvas-container"
      style={{
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'top left'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          dispatch(selectComponent(null));
        }
      }}
    >
      {structure.components.map((component) => (
        <ComponentRenderer
          key={component.id}
          component={component}
          isSelected={component.id === selectedId}
          onSelect={() => dispatch(selectComponent(component.id))}
        />
      ))}

      {isOver && <DragOverlay />}
    </div>
  );
}

// Component Renderer
export function ComponentRenderer({
  component,
  isSelected,
  onSelect
}: {
  component: ComponentInstance;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const dispatch = useAppDispatch();
  const componentDef = useComponent(component.componentId);

  const [{ isDragging }, drag] = useDrag({
    type: 'COMPONENT_INSTANCE',
    item: { id: component.id, component },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  if (!componentDef) return null;

  // Dynamically render component based on template
  const RenderedComponent = useMemo(() => {
    return compileTemplate(componentDef.template, component.props);
  }, [componentDef.template, component.props]);

  return (
    <div
      ref={drag}
      className={cn(
        'component-wrapper',
        isSelected && 'selected',
        isDragging && 'dragging'
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <RenderedComponent {...component.props} />

      {isSelected && (
        <div className="selection-overlay">
          <div className="resize-handles">
            <div className="handle top-left" />
            <div className="handle top-right" />
            <div className="handle bottom-left" />
            <div className="handle bottom-right" />
          </div>
        </div>
      )}

      {component.children && (
        <div className="component-children">
          {component.children.map((child) => (
            <ComponentRenderer
              key={child.id}
              component={child}
              isSelected={child.id === isSelected}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Template Compiler (simplified)
function compileTemplate(template: string, props: Record<string, any>) {
  // In production, use a safe sandboxed environment
  // This is a simplified example

  // Option 1: Pre-compiled React components
  const ComponentMap = {
    'Button': Button,
    'Card': Card,
    'Hero': Hero,
    // ... more components
  };

  const Component = ComponentMap[template];
  if (Component) {
    return (props: any) => <Component {...props} />;
  }

  // Option 2: Runtime compilation (use with caution)
  // Use a library like babel-standalone or similar
  // return compileJSX(template);

  return () => <div>Unknown component: {template}</div>;
}
```

---

## Backend Architecture (cont'd in next message due to length)

This comprehensive technical architecture document provides the foundation for implementing the enterprise page builder. The next sections would cover backend implementation details, security, performance, deployment, and monitoring in depth.
