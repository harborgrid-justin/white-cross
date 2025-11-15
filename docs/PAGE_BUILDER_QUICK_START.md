# Page Builder Quick Start Guide

Get started building the Next.js page builder MVP in 3 months.

---

## Week 1-2: Project Setup & Foundation

### Day 1-2: Environment Setup

**1. Create Feature Branch**
```bash
cd /home/user/white-cross
git checkout -b feature/page-builder-mvp
```

**2. Install Dependencies**
```bash
# Frontend (if any new dependencies needed)
cd frontend
npm install react-dnd react-dnd-html5-backend
npm install @monaco-editor/react  # Code editor for advanced users
npm install react-flow-renderer    # For workflow builder (future)

# Backend (if any new dependencies needed)
cd ../backend
npm install jsondiffpatch  # For version diffing
npm install archiver       # For ZIP exports
```

**3. Database Setup**

Create migration file:
```bash
cd backend
npm run migration:generate -- create-page-builder-tables
```

### Day 3-5: Database Schema

**Migration 1: Core Page Builder Tables**

Location: `backend/src/database/migrations/YYYYMMDD-create-page-builder-tables.ts`

```typescript
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Create pages table
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
    description: DataTypes.TEXT,
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
      references: { model: 'organizations', key: 'id' },
      onDelete: 'CASCADE'
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'RESTRICT'
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft',
      allowNull: false
    },
    current_version_id: DataTypes.UUID,
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
    deleted_at: DataTypes.DATE
  });

  await queryInterface.addIndex('pages', ['organization_id', 'status']);
  await queryInterface.addIndex('pages', ['owner_id']);
  await queryInterface.addIndex('pages', ['slug'], { unique: true });

  // Create page_versions table
  await queryInterface.createTable('page_versions', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    page_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'pages', key: 'id' },
      onDelete: 'CASCADE'
    },
    version_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    branch: {
      type: DataTypes.STRING(100),
      defaultValue: 'main',
      allowNull: false
    },
    snapshot: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    commit_message: DataTypes.TEXT,
    author_id: {
      type: DataTypes.UUID,
      references: { model: 'users', key: 'id' }
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  await queryInterface.addIndex('page_versions', ['page_id', 'branch', 'version_number']);

  // Create component_library table
  await queryInterface.createTable('component_library', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    display_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: DataTypes.TEXT,
    category: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    version: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '1.0.0'
    },
    schema: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    template: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    styles: DataTypes.TEXT,
    config_ui: DataTypes.JSONB,
    visibility: {
      type: DataTypes.ENUM('private', 'team', 'organization', 'public'),
      defaultValue: 'organization'
    },
    owner_id: {
      type: DataTypes.UUID,
      references: { model: 'users', key: 'id' }
    },
    usage_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
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
    deleted_at: DataTypes.DATE
  });

  await queryInterface.addIndex('component_library', ['category']);
  await queryInterface.addIndex('component_library', ['visibility']);

  // Create page_templates table
  await queryInterface.createTable('page_templates', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: DataTypes.TEXT,
    category: DataTypes.STRING(100),
    tags: DataTypes.ARRAY(DataTypes.STRING),
    thumbnail_url: DataTypes.STRING(500),
    schema: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    download_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    author_id: {
      type: DataTypes.UUID,
      references: { model: 'users', key: 'id' }
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
    }
  });

  await queryInterface.addIndex('page_templates', ['category']);
  await queryInterface.addIndex('page_templates', ['is_public']);

  // Add more tables as needed...
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('page_templates');
  await queryInterface.dropTable('component_library');
  await queryInterface.dropTable('page_versions');
  await queryInterface.dropTable('pages');
}
```

**Run Migration:**
```bash
npm run migration:run
```

### Day 6-10: Backend Module Scaffolding

**1. Create Page Builder Module**

Location: `backend/src/page-builder/page-builder.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// Models
import { PageModel } from './models/page.model';
import { PageVersionModel } from './models/page-version.model';
import { ComponentModel } from './models/component.model';
import { PageTemplateModel } from './models/page-template.model';

// Controllers
import { PagesController } from './controllers/pages.controller';
import { ComponentsController } from './controllers/components.controller';
import { TemplatesController } from './controllers/templates.controller';
import { VersionsController } from './controllers/versions.controller';

// Services
import { PagesService } from './services/pages.service';
import { PageQueryService } from './services/page-query.service';
import { PageVersionService } from './services/page-version.service';
import { ComponentsService } from './services/components.service';
import { TemplatesService } from './services/templates.service';

// Repositories
import { PageRepository } from './repositories/page.repository';
import { ComponentRepository } from './repositories/component.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PageModel,
      PageVersionModel,
      ComponentModel,
      PageTemplateModel
    ])
  ],
  controllers: [
    PagesController,
    ComponentsController,
    TemplatesController,
    VersionsController
  ],
  providers: [
    PagesService,
    PageQueryService,
    PageVersionService,
    ComponentsService,
    TemplatesService,
    PageRepository,
    ComponentRepository
  ],
  exports: [
    PagesService,
    ComponentsService,
    TemplatesService,
    PageVersionService
  ]
})
export class PageBuilderModule {}
```

**2. Create Page Model**

Location: `backend/src/page-builder/models/page.model.ts`

```typescript
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  BeforeCreate,
  BeforeUpdate
} from 'sequelize-typescript';
import { User } from '@/services/user/user.model';
import { Organization } from '@/services/organization/organization.model';
import { PageVersion } from './page-version.model';

@Table({
  tableName: 'pages',
  timestamps: true,
  paranoid: true,
  underscored: true
})
export class Page extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true
  })
  slug: string;

  @Column(DataType.TEXT)
  description: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: { components: [], layout: { type: 'container' } }
  })
  structure: {
    components: any[];
    layout: any;
  };

  @Column({
    type: DataType.JSONB,
    defaultValue: {}
  })
  layout: any;

  @Column({
    type: DataType.JSONB,
    defaultValue: {}
  })
  metadata: any;

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  organizationId: string;

  @BelongsTo(() => Organization)
  organization: Organization;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  ownerId: string;

  @BelongsTo(() => User, 'ownerId')
  owner: User;

  @Column({
    type: DataType.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft',
    allowNull: false
  })
  status: 'draft' | 'published' | 'archived';

  @Column(DataType.UUID)
  currentVersionId: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false
  })
  latestVersionNumber: number;

  @HasMany(() => PageVersion)
  versions: PageVersion[];

  @BeforeCreate
  static async generateSlug(instance: Page) {
    if (!instance.slug) {
      instance.slug = instance.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  }

  @BeforeUpdate
  static async updateSlug(instance: Page) {
    if (instance.changed('name') && !instance.changed('slug')) {
      instance.slug = instance.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  }
}
```

**3. Create Page Service**

Location: `backend/src/page-builder/services/pages.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Page } from '../models/page.model';
import { PageVersion } from '../models/page-version.model';
import { PageRepository } from '../repositories/page.repository';
import { PageVersionService } from './page-version.service';
import { CreatePageDto } from '../dto/create-page.dto';
import { UpdatePageDto } from '../dto/update-page.dto';
import { CacheService } from '@/common/cache/cache.service';

@Injectable()
export class PagesService {
  constructor(
    private readonly pageRepository: PageRepository,
    private readonly versionService: PageVersionService,
    private readonly cacheService: CacheService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async create(userId: string, organizationId: string, dto: CreatePageDto): Promise<Page> {
    // 1. Create page
    const page = await this.pageRepository.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      structure: dto.structure || { components: [], layout: { type: 'container' } },
      organizationId,
      ownerId: userId,
      status: 'draft'
    });

    // 2. Create initial version
    await this.versionService.createVersion(page.id, userId, 'Initial version');

    // 3. Emit event
    this.eventEmitter.emit('page.created', {
      pageId: page.id,
      userId,
      organizationId
    });

    return page;
  }

  async findById(id: string): Promise<Page> {
    // Try cache first
    const cacheKey = `page:${id}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    // Query database
    const page = await this.pageRepository.findById(id);
    if (!page) {
      throw new NotFoundException(`Page ${id} not found`);
    }

    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, page, 300);

    return page;
  }

  async update(id: string, userId: string, dto: UpdatePageDto): Promise<Page> {
    const page = await this.findById(id);

    // Update page
    await page.update(dto);

    // Create auto-save version
    await this.versionService.createVersion(id, userId, 'Auto-save');

    // Invalidate cache
    await this.cacheService.del(`page:${id}`);

    // Emit event
    this.eventEmitter.emit('page.updated', {
      pageId: id,
      userId,
      changes: dto
    });

    return page;
  }

  async delete(id: string, userId: string): Promise<void> {
    const page = await this.findById(id);

    // Soft delete
    await page.destroy();

    // Invalidate cache
    await this.cacheService.del(`page:${id}`);

    // Emit event
    this.eventEmitter.emit('page.deleted', {
      pageId: id,
      userId
    });
  }

  async publish(id: string, userId: string, environmentId: string): Promise<void> {
    const page = await this.findById(id);

    // Update status
    await page.update({
      status: 'published',
      publishedAt: new Date(),
      publishedBy: userId
    });

    // Create published version
    const version = await this.versionService.createVersion(
      id,
      userId,
      `Published to ${environmentId}`
    );
    await version.update({ isPublished: true });

    // Emit event (triggers deployment)
    this.eventEmitter.emit('page.published', {
      pageId: id,
      versionId: version.id,
      environmentId,
      userId
    });
  }
}
```

**4. Create Pages Controller**

Location: `backend/src/page-builder/controllers/pages.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/services/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/services/auth/guards/roles.guard';
import { Roles } from '@/services/auth/decorators/roles.decorator';
import { PagesService } from '../services/pages.service';
import { CreatePageDto } from '../dto/create-page.dto';
import { UpdatePageDto } from '../dto/update-page.dto';
import { PageFiltersDto } from '../dto/page-filters.dto';

@ApiTags('pages')
@ApiBearerAuth()
@Controller('api/v1/pages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Create a new page' })
  async create(@Request() req, @Body() dto: CreatePageDto) {
    return this.pagesService.create(
      req.user.id,
      req.user.organizationId,
      dto
    );
  }

  @Get()
  @Roles('admin', 'editor', 'viewer')
  @ApiOperation({ summary: 'List pages' })
  async findAll(@Request() req, @Query() filters: PageFiltersDto) {
    return this.pagesService.findAll(req.user.organizationId, filters);
  }

  @Get(':id')
  @Roles('admin', 'editor', 'viewer')
  @ApiOperation({ summary: 'Get page by ID' })
  async findOne(@Param('id') id: string) {
    return this.pagesService.findById(id);
  }

  @Put(':id')
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'Update page' })
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdatePageDto
  ) {
    return this.pagesService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete page' })
  async delete(@Param('id') id: string, @Request() req) {
    await this.pagesService.delete(id, req.user.id);
    return { success: true };
  }

  @Post(':id/publish')
  @Roles('admin')
  @ApiOperation({ summary: 'Publish page' })
  async publish(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: { environmentId: string }
  ) {
    await this.pagesService.publish(id, req.user.id, dto.environmentId);
    return { success: true };
  }
}
```

---

## Week 3-4: Frontend Foundation

### Day 11-15: Frontend Structure

**1. Create Page Builder Module**

Location: `frontend/src/app/(dashboard)/page-builder/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageBuilderLayout } from '@/components/page-builder/PageBuilderLayout';
import { usePages } from '@/hooks/page-builder/usePages';

export default function PageBuilderPage() {
  const router = useRouter();
  const { data: pages, isLoading } = usePages();

  return (
    <PageBuilderLayout>
      <div className="page-builder-dashboard">
        <div className="header">
          <h1>Pages</h1>
          <button onClick={() => router.push('/page-builder/new')}>
            Create Page
          </button>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="pages-grid">
            {pages?.map(page => (
              <PageCard key={page.id} page={page} />
            ))}
          </div>
        )}
      </div>
    </PageBuilderLayout>
  );
}
```

**2. Create Page Editor**

Location: `frontend/src/app/(dashboard)/page-builder/[id]/edit/page.tsx`

```typescript
'use client';

import { useParams } from 'next/navigation';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { PageBuilderProvider } from '@/contexts/PageBuilderContext';
import { EditorLayout } from '@/components/page-builder/Editor/EditorLayout';
import { Canvas } from '@/components/page-builder/Editor/Canvas';
import { Sidebar } from '@/components/page-builder/Editor/Sidebar';
import { Toolbar } from '@/components/page-builder/Editor/Toolbar';
import { PropertyPanel } from '@/components/page-builder/Editor/PropertyPanel';
import { usePage } from '@/hooks/page-builder/usePages';

export default function PageEditorPage() {
  const { id } = useParams();
  const { data: page, isLoading } = usePage(id as string);

  if (isLoading) return <div>Loading...</div>;
  if (!page) return <div>Page not found</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <PageBuilderProvider initialPage={page}>
        <EditorLayout>
          <Toolbar />
          <div className="editor-main">
            <Sidebar />
            <Canvas />
            <PropertyPanel />
          </div>
        </EditorLayout>
      </PageBuilderProvider>
    </DndProvider>
  );
}
```

**3. Create Redux Slice**

Location: `frontend/src/stores/slices/pageBuilderSlice.ts`

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PageBuilderState {
  currentPage: Page | null;
  selectedComponent: string | null;
  hoveredComponent: string | null;
  history: {
    past: PageStructure[];
    present: PageStructure;
    future: PageStructure[];
  };
  isEditMode: boolean;
  zoom: number;
}

const initialState: PageBuilderState = {
  currentPage: null,
  selectedComponent: null,
  hoveredComponent: null,
  history: {
    past: [],
    present: { components: [], layout: { type: 'container' } },
    future: []
  },
  isEditMode: true,
  zoom: 100
};

const pageBuilderSlice = createSlice({
  name: 'pageBuilder',
  initialState,
  reducers: {
    // ... (see technical architecture doc for full implementation)
  }
});

export const {
  setCurrentPage,
  selectComponent,
  addComponent,
  updateComponent,
  removeComponent,
  undo,
  redo
} = pageBuilderSlice.actions;

export default pageBuilderSlice.reducer;
```

---

## Month 2: Core Features

### Week 5-6: Component Library

**Tasks:**
1. Create 20+ pre-built components
2. Implement component drag-and-drop
3. Build component configuration panel
4. Add component search and filtering

**Key Components to Build:**
- Layout: Container, Grid, Flex, Section
- Content: Hero, Card, List, Text, Heading
- Forms: Input, Button, Select, Checkbox, Textarea
- Media: Image, Video, Gallery
- Data: Table, Chart (using Recharts)

### Week 7-8: Template Marketplace & Design System

**Tasks:**
1. Create 10+ page templates
2. Implement template installation
3. Set up design token system
4. Build token picker UI

---

## Month 3: Polish & Launch

### Week 9-10: Version Control & Deployment

**Tasks:**
1. Implement auto-save (every 5 minutes)
2. Build version history UI
3. Add restore functionality
4. Implement basic deployment

### Week 11: Testing

**Tasks:**
1. Unit tests (80%+ coverage)
2. E2E tests (critical paths)
3. Performance testing
4. Security audit

### Week 12: Documentation & Launch

**Tasks:**
1. API documentation
2. User guides
3. Video tutorials
4. MVP launch

---

## Development Commands

### Backend
```bash
# Development
npm run start:dev

# Build
npm run build

# Tests
npm run test
npm run test:cov

# Migrations
npm run migration:run
npm run migration:revert

# Linting
npm run lint
npm run lint:fix
```

### Frontend
```bash
# Development
npm run dev

# Build
npm run build

# Tests
npm run test
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

---

## Testing Strategy

### Unit Tests
```typescript
// backend/src/page-builder/services/pages.service.spec.ts
describe('PagesService', () => {
  let service: PagesService;
  let repository: PageRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PagesService,
        {
          provide: PageRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<PagesService>(PagesService);
    repository = module.get<PageRepository>(PageRepository);
  });

  describe('create', () => {
    it('should create a page', async () => {
      const dto = { name: 'Test Page' };
      const expected = { id: '123', name: 'Test Page' };

      jest.spyOn(repository, 'create').mockResolvedValue(expected as any);

      const result = await service.create('user-1', 'org-1', dto as any);

      expect(result).toEqual(expected);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Test Page' })
      );
    });
  });
});
```

### E2E Tests
```typescript
// frontend/src/app/(dashboard)/page-builder/__tests__/page-builder.e2e.ts
import { test, expect } from '@playwright/test';

test.describe('Page Builder', () => {
  test('should create a new page', async ({ page }) => {
    // Navigate to page builder
    await page.goto('/page-builder');

    // Click create button
    await page.click('text=Create Page');

    // Fill in page details
    await page.fill('input[name="name"]', 'My Test Page');
    await page.click('button[type="submit"]');

    // Verify page was created
    await expect(page).toHaveURL(/\/page-builder\/[a-z0-9-]+\/edit/);
    await expect(page.locator('h1')).toContainText('My Test Page');
  });

  test('should add component to page', async ({ page }) => {
    // ... test implementation
  });
});
```

---

## Deployment Checklist

### Pre-Launch
- [ ] All migrations run successfully
- [ ] Database backed up
- [ ] Environment variables configured
- [ ] SSL certificates valid
- [ ] CDN configured
- [ ] Monitoring enabled (Sentry, Datadog)
- [ ] Error tracking enabled
- [ ] Performance monitoring enabled
- [ ] Security scan passed
- [ ] Load testing completed

### Launch Day
- [ ] Deploy backend to production
- [ ] Run database migrations
- [ ] Deploy frontend to production
- [ ] Verify health checks
- [ ] Test critical user flows
- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Enable audit logging
- [ ] Notify users of launch

### Post-Launch
- [ ] Monitor for 24 hours
- [ ] Address critical bugs
- [ ] Gather user feedback
- [ ] Plan Phase 2 features

---

## Troubleshooting

### Common Issues

**1. Database Migration Fails**
```bash
# Check migration status
npm run migration:status

# Revert last migration
npm run migration:revert

# Fix migration file and try again
npm run migration:run
```

**2. Frontend Build Fails**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

**3. WebSocket Connection Issues**
```bash
# Check Redis connection
redis-cli ping

# Check Socket.IO adapter
# Verify REDIS_URL in environment variables
```

**4. Performance Issues**
```bash
# Check database indexes
# Add missing indexes for slow queries

# Check Redis cache hit rate
redis-cli info stats | grep keyspace_hits

# Enable query logging
# Add slow query logging in database
```

---

## Support

### Resources
- Documentation: `/docs/`
- API Docs: `http://localhost:3001/api/docs`
- GraphQL Playground: `http://localhost:3001/graphql`

### Getting Help
- Slack: #page-builder
- GitHub Issues: For bugs
- Email: dev@whitecross.com

---

**Ready to Start?** Follow this guide week by week, and you'll have an MVP page builder in 3 months!

**Last Updated:** November 14, 2024
