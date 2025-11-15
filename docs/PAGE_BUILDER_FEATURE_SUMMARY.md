# Next.js Page Builder - Feature Summary

Quick reference guide for enterprise features with implementation priorities and integration points.

---

## Feature Priority Matrix

| Feature | Priority | Complexity | Business Value | MVP Scope |
|---------|----------|------------|----------------|-----------|
| Template Marketplace | MVP | Medium | High | Basic templates, search, preview |
| Version Control | MVP | Medium | Critical | Auto-save, history, restore |
| Component Library | MVP | Medium | High | 20+ components, reuse, props |
| Design System | MVP | Medium | High | Tokens, themes, picker |
| Multi-Environment | MVP | Medium | Critical | Dev/Prod, manual deploy |
| Permissions (RBAC) | MVP | Medium | Critical | 3 roles, page-level perms |
| Audit Logs | MVP | Low | Critical | Enhanced logging |
| Export/Import | MVP | Medium | Medium | JSON export/import |
| Performance Monitoring | MVP | Low | High | Datadog, Core Web Vitals |
| Analytics | MVP | Low | High | GA4, basic tracking |
| Team Collaboration | Phase 2 | High | High | Comments, sharing |
| A/B Testing | Phase 3 | High | Medium | After analytics mature |
| API Integration | Phase 3 | High | Medium | After components stable |
| Workflow Automation | Phase 3 | Very High | Medium | Advanced automation |
| Deployment Integration | MVP/Phase 2 | Medium | Critical | Manual → Automated |

---

## Feature Cards

### 1. Template Marketplace

**What:** Pre-built page templates for rapid development

**Why:** Accelerates page creation, ensures consistency, reduces time-to-market

**MVP Scope:**
- 10-20 curated templates
- Categories: Landing page, Dashboard, Form, Blog, E-commerce
- Search by name/description
- One-click installation
- Preview before install

**Database:**
```sql
page_templates (name, category, schema, thumbnail, downloads, rating)
template_categories (name, slug, icon)
```

**API Endpoints:**
- `GET /api/templates` - List templates
- `GET /api/templates/:id` - Get template details
- `POST /api/pages/from-template/:id` - Create page from template

**Integration Points:**
- Component Library (templates use components)
- Design System (templates use design tokens)
- Version Control (template creates initial version)

**Future:**
- Community contributions
- User ratings/reviews
- Template bundles
- Premium marketplace

---

### 2. Version Control

**What:** Git-like versioning for pages with branching and merging

**Why:** Enable safe experimentation, easy rollback, compliance

**MVP Scope:**
- Auto-save every 5 minutes
- Manual "Save Version" with commit message
- Version history view (timeline)
- Restore to previous version
- Basic diff viewer (shows changes)

**Database:**
```sql
page_versions (page_id, version_number, snapshot, commit_message, author)
page_branches (page_id, name, base_version_id)
```

**API Endpoints:**
- `GET /api/pages/:id/versions` - List versions
- `POST /api/pages/:id/versions` - Create version
- `POST /api/pages/:id/restore/:version` - Restore version
- `GET /api/pages/:id/versions/:v1/diff/:v2` - Compare versions

**Integration Points:**
- Audit Logs (log version changes)
- Deployment (deploy specific version)
- Git (optional sync to GitHub)

**Future:**
- Branching and merging
- Tags for releases
- Scheduled snapshots
- Retention policies

---

### 3. Component Library

**What:** Reusable UI components with configurable properties

**Why:** Consistency, faster development, easier maintenance

**MVP Scope:**
- 20+ pre-built components:
  - Layout: Header, Footer, Sidebar, Grid, Container
  - Content: Hero, Card, List, Table, Accordion
  - Forms: Input, Button, Select, Checkbox, Radio
  - Media: Image, Video, Gallery
  - Data: Chart, Graph, Stats
- Save custom components
- Drag-and-drop from library
- Props configuration panel
- Component search

**Database:**
```sql
component_library (name, schema, template, styles, visibility, owner)
component_instances (component_id, page_id, instance_props)
```

**Component Schema:**
```typescript
{
  type: 'Button',
  props: { text, variant, size, color },
  events: { onClick },
  slots: []
}
```

**API Endpoints:**
- `GET /api/components` - List components
- `POST /api/components` - Create component
- `GET /api/components/:id` - Get component
- `PUT /api/components/:id` - Update component
- `GET /api/components/:id/usage` - Usage analytics

**Integration Points:**
- Design System (components use tokens)
- Template Marketplace (templates use components)
- API Integration (components bind to APIs)

**Future:**
- Component variants
- Component marketplace
- Automated testing
- Performance metrics per component

---

### 4. Design System Integration

**What:** Centralized design tokens (colors, typography, spacing)

**Why:** Brand consistency, easy theme switching, maintainability

**MVP Scope:**
- Predefined token set:
  - Colors: Primary, secondary, accent, neutral, semantic
  - Typography: Font families, sizes, weights, line heights
  - Spacing: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
  - Shadows: sm, md, lg, xl
  - Borders: Radius, width
- Light/dark theme support
- Token picker in property panel
- CSS variable generation

**Token Structure:**
```typescript
{
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#F59E0B'
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: { sm: '14px', base: '16px', lg: '18px' }
  },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' }
}
```

**Database:**
```sql
design_systems (name, version, tokens, themes, organization_id)
design_system_history (design_system_id, version, tokens_snapshot)
```

**API Endpoints:**
- `GET /api/design-system` - Get active design system
- `PUT /api/design-system/tokens` - Update tokens
- `GET /api/design-system/themes` - List themes
- `POST /api/design-system/export` - Export as CSS/SCSS

**Integration Points:**
- Component Library (components use tokens)
- Page Builder (token picker in UI)
- Themes (runtime theme switching)

**Future:**
- Figma/Sketch sync
- Custom token types
- Token versioning
- Multi-brand support

---

### 5. Multi-Environment Support

**What:** Separate environments for development, staging, production

**Why:** Safe testing, gradual rollout, regulatory compliance

**MVP Scope:**
- Two environments: Development, Production
- Environment configuration (API URLs, feature flags)
- Manual deployment to production
- Environment-specific access control
- Deployment logs

**Environment Config:**
```typescript
{
  name: 'Production',
  type: 'production',
  apiUrl: 'https://api.prod.example.com',
  features: { abTesting: true, analytics: true },
  access: { public: true, requiresAuth: false }
}
```

**Database:**
```sql
environments (name, type, config, deployment_config, access_config)
deployments (environment_id, version, status, triggered_by)
page_environment_state (page_id, environment_id, version_id, is_published)
```

**API Endpoints:**
- `GET /api/environments` - List environments
- `POST /api/environments/:id/deploy` - Deploy to environment
- `GET /api/environments/:id/pages` - Pages in environment
- `POST /api/deployments/:id/rollback` - Rollback deployment

**Integration Points:**
- Version Control (deploy specific version)
- CI/CD (GitHub Actions integration)
- Monitoring (environment tags in Sentry)
- Feature Flags (environment-specific flags)

**Future:**
- Staging environment
- Preview environments (PR previews)
- Automated promotion pipeline
- Blue-green deployments

---

### 6. Role-Based Permissions

**What:** Control who can view, edit, and publish pages

**Why:** Security, compliance, collaboration management

**MVP Scope:**
- Three system roles:
  - **Admin:** Full access (create, edit, delete, publish, manage users)
  - **Editor:** Create and edit pages, cannot publish or manage users
  - **Viewer:** Read-only access, can view pages and analytics
- Page-level permissions
- Permission checks in GraphQL/REST APIs
- Permission-aware UI (hide/disable restricted actions)

**System Roles:**
```typescript
{
  ADMIN: ['*:*'], // All permissions
  EDITOR: ['page:view', 'page:create', 'page:edit',
           'component:view', 'component:create', 'component:edit'],
  VIEWER: ['page:view', 'component:view', 'analytics:view']
}
```

**Database:**
```sql
roles (name, permissions, is_system, organization_id)
user_permissions (user_id, roles, effective_permissions)
permission_audit (user_id, action, resource_type, resource_id)
```

**Permission Check:**
```typescript
@Roles('editor', 'admin')
@UseGuards(RolesGuard)
async createPage() { ... }
```

**API Endpoints:**
- `GET /api/permissions/me` - Get current user permissions
- `POST /api/permissions/check` - Check specific permission
- `GET /api/roles` - List roles
- `POST /api/users/:id/roles` - Assign role to user

**Integration Points:**
- Authentication (existing JWT auth)
- Audit Logs (log permission changes)
- Teams (team-based permissions in Phase 2)

**Future:**
- Custom roles
- Fine-grained permissions (component-level)
- Team-based permissions
- Temporary access grants

---

### 7. Audit Logs

**What:** Comprehensive logging of all user actions and system events

**Why:** Security, compliance, debugging, accountability

**MVP Scope:**
- Log page builder actions:
  - Page created/updated/deleted/published
  - Component added/modified/removed
  - Version saved/restored
  - Deployment triggered/completed
  - Permission changed
- Basic search and filtering (by user, action, date)
- Audit log viewer in admin panel

**Log Entry:**
```typescript
{
  timestamp: '2024-11-14T10:30:00Z',
  userId: 'user-123',
  action: 'page.publish',
  resource: { type: 'page', id: 'page-456', name: 'Homepage' },
  changes: { before: { status: 'draft' }, after: { status: 'published' } },
  metadata: { environmentId: 'prod', version: '1.2.3' },
  status: 'success',
  ipAddress: '192.168.1.1'
}
```

**Existing Infrastructure:**
```
backend/src/services/audit/
- audit-log.service.ts (existing)
- audit-query.service.ts (existing)
- audit.interceptor.ts (existing)

frontend/src/components/compliance/
- AuditLogViewer.tsx (existing)
```

**Enhancements:**
- Add page builder specific actions
- Add deployment logging
- Add version control logging
- Enhance search capabilities

**API Endpoints:**
- `GET /api/audit-logs` (existing, enhanced)
- `GET /api/audit-logs/stats` (existing)
- `POST /api/audit-logs/export` (new)

**Integration Points:**
- All page builder actions
- Deployment pipeline
- Permission system
- Authentication events

**Future:**
- Real-time alerts on suspicious activity
- Export to PDF/CSV
- Retention policies
- Anomaly detection

---

### 8. Export/Import Functionality

**What:** Export pages/components to files and import from other sources

**Why:** Data portability, backup, migration, sharing

**MVP Scope:**
- Export single page as JSON
- Import page from JSON file
- Include assets in export (base64 encoded or URLs)
- Basic validation on import
- Conflict detection (duplicate page names)
- Preview before import

**Export Format:**
```json
{
  "version": "1.0",
  "exportedAt": "2024-11-14T10:30:00Z",
  "metadata": {
    "name": "Homepage",
    "author": "john@example.com"
  },
  "content": {
    "pages": [...],
    "components": [...],
    "assets": [...]
  }
}
```

**Database:**
```sql
export_jobs (name, resource_ids, status, package_url, created_by)
import_jobs (package_name, validation_status, import_result, status)
```

**API Endpoints:**
- `POST /api/pages/:id/export` - Export page
- `POST /api/import` - Import from file
- `POST /api/import/validate` - Validate import file
- `GET /api/export-jobs/:id` - Check export status

**Integration Points:**
- Template Marketplace (export as template)
- Version Control (export specific version)
- Backup system (automated exports)
- Component Library (export components)

**Future:**
- Bulk export/import
- ZIP format for large exports
- Import from Webflow/Wix/WordPress
- Scheduled automated backups
- Git repository export

---

### 9. Performance Monitoring

**What:** Track page load times, Core Web Vitals, and performance metrics

**Why:** Ensure fast user experience, detect regressions, optimize

**MVP Scope:**
- Datadog RUM integration (already in package.json)
- Core Web Vitals tracking:
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)
- Sentry performance tracking (already configured)
- Basic performance dashboard

**Existing Infrastructure:**
```typescript
// Already installed:
- @datadog/browser-rum
- @datadog/browser-logs
- @sentry/nextjs
- web-vitals
```

**Implementation:**
```typescript
// frontend/src/app/layout.tsx
import { datadogRum } from '@datadog/browser-rum';
import { getCLS, getFID, getLCP } from 'web-vitals';

datadogRum.init({
  applicationId: process.env.NEXT_PUBLIC_DATADOG_APP_ID,
  clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
  site: 'datadoghq.com',
  service: 'page-builder',
  env: process.env.NODE_ENV,
  version: '1.0.0',
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
});

// Track Core Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

**Metrics to Track:**
- Page load time
- Time to interactive
- Component render time
- Asset size and count
- API call latency
- Error rate

**Integration Points:**
- Analytics (correlate performance with usage)
- Deployment (performance regression detection)
- A/B Testing (performance impact of variants)

**Future:**
- Custom performance metrics
- Performance budgets with alerts
- Lighthouse CI integration
- Automated performance testing
- Optimization recommendations

---

### 10. Analytics Integration

**What:** Track user behavior, page views, conversions

**Why:** Data-driven decisions, measure success, optimize UX

**MVP Scope:**
- Google Analytics 4 integration
- Track page views
- Track button clicks and CTA interactions
- Track form submissions
- Basic dashboard (users, views, top pages)

**Implementation:**
```typescript
// Google Analytics 4
import { gtag } from '@/lib/gtag';

// Track page view
gtag.pageView(url);

// Track custom event
gtag.event({
  action: 'button_click',
  category: 'engagement',
  label: 'CTA Button',
  value: 1
});

// Track conversion
gtag.event({
  action: 'form_submit',
  category: 'conversion',
  label: 'Contact Form'
});
```

**Events to Track:**
```typescript
// Page Builder Events
- page_created
- page_published
- component_added
- template_used
- version_restored

// User Interaction Events
- page_view
- button_click
- form_submit
- video_play
- link_click
```

**Database:**
```sql
analytics_events (event_name, page_id, user_id, properties, created_at)
analytics_aggregates (date, page_id, metric, value, dimensions)
```

**API Endpoints:**
- `POST /api/analytics/event` - Track event
- `GET /api/analytics/dashboard` - Dashboard data
- `GET /api/analytics/pages/:id` - Page analytics

**Integration Points:**
- Page Builder (track builder actions)
- Published Pages (track user interactions)
- A/B Testing (track experiment metrics)
- Performance (correlate analytics with performance)

**Future:**
- Funnel analysis
- User segmentation
- Custom events
- Real-time analytics
- Predictive analytics

---

### 11. Team Collaboration (Phase 2)

**What:** Real-time collaborative editing, comments, sharing

**Why:** Enable teamwork, faster feedback, better outcomes

**Phase 1 Scope:**
- View-only sharing via link
- Commenting on pages
- Activity log (who did what, when)
- User presence indicators (who's viewing)

**Phase 2 Scope:**
- Real-time collaborative editing
- Live cursors showing collaborator positions
- Element locking (prevent concurrent edits)
- @mentions in comments
- Conflict resolution

**Implementation:**
```typescript
// WebSocket connection
import io from 'socket.io-client';

const socket = io(WEBSOCKET_URL, {
  auth: { token: jwt }
});

// Join page session
socket.emit('join-page', { pageId });

// Broadcast changes
socket.emit('page-change', {
  pageId,
  changes: [...],
  userId
});

// Receive changes from others
socket.on('page-updated', (data) => {
  applyChanges(data.changes);
});
```

**Database:**
```sql
page_comments (page_id, element_id, author_id, content, position, resolved)
page_sessions (page_id, participants, started_at, last_activity_at)
```

**Integration Points:**
- WebSocket (existing Socket.IO setup)
- Permissions (collaborator roles)
- Notifications (mentions, replies)
- Audit Logs (track collaborative actions)

---

### 12. A/B Testing (Phase 3)

**What:** Test different page variants to optimize conversions

**Why:** Data-driven optimization, reduce guesswork

**Implementation:**
```typescript
interface Experiment {
  id: string;
  name: string;
  pageId: string;
  variants: [
    { id: 'control', name: 'Original', pageVersionId: 'v1' },
    { id: 'variant-a', name: 'New Hero', pageVersionId: 'v2' }
  ],
  trafficAllocation: { 'control': 50, 'variant-a': 50 },
  primaryMetric: {
    name: 'Conversion Rate',
    eventName: 'form_submit',
    goal: 'increase'
  },
  status: 'running'
}
```

**Database:**
```sql
experiments (name, page_id, variants, metrics, status, results)
experiment_exposures (experiment_id, variant_id, user_id, session_id)
experiment_events (experiment_id, variant_id, metric_id, event_value)
```

**Integration Points:**
- Version Control (variants are page versions)
- Analytics (track experiment events)
- Deployment (deploy winning variant)
- Feature Flags (progressive rollout)

---

### 13. API Integration Builder (Phase 3)

**What:** Visual builder to connect components to external APIs

**Why:** Dynamic data, personalization, integration with backend systems

**Implementation:**
```typescript
interface APIIntegration {
  id: string;
  name: 'User Profile API',
  baseUrl: 'https://api.example.com',
  auth: { type: 'bearer', token: '...' },
  endpoints: [
    {
      name: 'Get User',
      method: 'GET',
      path: '/users/:id',
      responseTransform: 'data => data.user'
    }
  ]
}

interface ComponentBinding {
  componentId: 'user-card-1',
  integrationId: 'api-123',
  endpointId: 'get-user',
  parameterMapping: {
    id: { source: 'context', value: 'userId' }
  },
  dataBinding: {
    name: { path: '$.name' },
    email: { path: '$.email' },
    avatar: { path: '$.avatarUrl' }
  },
  trigger: 'onMount'
}
```

**Database:**
```sql
api_integrations (name, base_url, auth, endpoints, rate_limit)
component_api_bindings (component_id, integration_id, parameter_mapping)
api_call_logs (integration_id, request, response, response_time)
```

---

### 14. Workflow Automation (Phase 3)

**What:** Automate actions based on triggers (events, schedule, webhooks)

**Why:** Reduce manual work, ensure consistency, scale operations

**Implementation:**
```typescript
interface Workflow {
  id: string;
  name: 'Send Welcome Email',
  trigger: {
    type: 'event',
    eventName: 'form_submit',
    eventFilters: { formId: 'contact-form' }
  },
  steps: [
    {
      type: 'action',
      action: {
        type: 'send_email',
        config: {
          to: '{{form.email}}',
          subject: 'Welcome!',
          template: 'welcome-email',
          data: { name: '{{form.name}}' }
        }
      }
    },
    {
      type: 'action',
      action: {
        type: 'http_request',
        config: {
          url: 'https://crm.example.com/api/leads',
          method: 'POST',
          body: { name: '{{form.name}}', email: '{{form.email}}' }
        }
      }
    }
  ]
}
```

**Database:**
```sql
workflows (name, trigger, steps, config, stats)
workflow_executions (workflow_id, triggered_by, status, steps, variables)
workflow_logs (execution_id, step_id, level, message, data)
```

---

### 15. Deployment Integration (MVP/Phase 2)

**What:** Deploy pages to production with automated build and optimization

**Why:** Streamline publishing, ensure quality, enable rollback

**MVP Scope:**
- Manual "Deploy to Production" button
- Build Next.js pages
- Upload assets to S3/CloudFront
- Basic health check after deployment
- Deployment logs

**Deployment Pipeline:**
```
1. User clicks "Deploy to Production"
   ↓
2. Create deployment job in Bull queue
   ↓
3. Build Stage:
   - Compile pages to Next.js routes
   - Optimize images
   - Minify CSS/JS
   ↓
4. Deploy Stage:
   - Upload to S3
   - Invalidate CloudFront cache
   ↓
5. Verify Stage:
   - Run health checks
   - Verify pages load correctly
   ↓
6. Complete:
   - Mark deployment as success
   - Send notification
   - Update page_environment_state
```

**Database:**
```sql
deployment_configs (environment_id, build_settings, optimization, cdn_config)
deployment_jobs (deployment_id, status, stages, artifacts, logs)
```

**Integration Points:**
- Version Control (deploy specific version)
- Environments (deploy to target environment)
- CI/CD (GitHub Actions for automation)
- Monitoring (track deployment health)
- Notifications (Slack/email on completion)

**Future:**
- Automated deployment on version tag
- Blue-green deployments
- Canary releases
- Rollback on errors
- Multi-region deployments

---

## Implementation Timeline

### Month 1: Foundation
- Database models and migrations
- Backend API scaffolding
- Frontend page builder UI
- Component library (basic components)

### Month 2: Core Features
- Template marketplace
- Version control
- Design system integration
- Permission system

### Month 3: MVP Completion
- Multi-environment support
- Export/import
- Performance monitoring
- Analytics integration
- Testing and bug fixes

### Month 4-6: Team Features (Phase 2)
- Team collaboration
- Advanced version control
- Component marketplace
- Deployment automation

### Month 7-12: Enterprise Features (Phase 3)
- A/B testing
- API integration builder
- Workflow automation
- Advanced analytics

---

## Technology Stack Summary

### Backend
- **Framework:** NestJS 11
- **Database:** PostgreSQL with Sequelize ORM
- **Caching:** Redis
- **Queue:** Bull (for background jobs)
- **Real-time:** Socket.IO
- **Monitoring:** Sentry, Datadog
- **API:** GraphQL + REST

### Frontend
- **Framework:** Next.js 16
- **UI Library:** React 19
- **State Management:** Redux Toolkit, Zustand
- **Data Fetching:** Apollo Client, React Query
- **UI Components:** Radix UI, Tailwind CSS
- **Forms:** React Hook Form + Zod
- **Monitoring:** Sentry, Datadog RUM

### Infrastructure
- **Hosting:** AWS (ECS/EKS)
- **Storage:** S3
- **CDN:** CloudFront
- **CI/CD:** GitHub Actions
- **Secrets:** AWS Secrets Manager

---

## Key Dependencies

### Already Installed
✓ Authentication & Authorization
✓ Database (PostgreSQL)
✓ Caching (Redis)
✓ Queue (Bull)
✓ WebSocket (Socket.IO)
✓ Monitoring (Sentry, Datadog)
✓ Audit Logging
✓ File Upload

### New Dependencies Needed
- React Flow (for workflow builder)
- jsondiffpatch (for version diffing)
- JSZip (for export packaging)
- node-cron (for scheduled workflows)
- safe-eval or VM2 (for workflow expressions)

---

## Compliance Checklist

### Security
- [ ] HTTPS/TLS everywhere
- [ ] Input validation and sanitization
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] SQL injection prevention (via ORM)
- [ ] Rate limiting
- [ ] Audit logging

### Privacy
- [ ] GDPR compliance (data export, deletion)
- [ ] Cookie consent
- [ ] Privacy policy
- [ ] Data retention policies
- [ ] Encryption at rest and in transit

### Accessibility
- [ ] WCAG 2.1 Level AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast
- [ ] Focus indicators

---

## Success Criteria

### MVP Launch Criteria
- [ ] 10+ templates available
- [ ] 20+ components in library
- [ ] Version history works reliably
- [ ] Deploy to production works
- [ ] Permissions enforced correctly
- [ ] Audit logs capture all actions
- [ ] Performance meets targets (<2s load time)
- [ ] Security audit passed
- [ ] User acceptance testing completed
- [ ] Documentation complete

### Post-MVP Metrics
- **Adoption:** 100+ pages created in first month
- **Performance:** P95 page load time < 2 seconds
- **Reliability:** 99.9% uptime
- **Security:** Zero critical security issues
- **User Satisfaction:** 80%+ satisfaction score (NPS > 50)

---

## Risk Mitigation

### Technical Risks
1. **Performance at scale**
   - Mitigation: Pagination, virtual scrolling, lazy loading
2. **Real-time collaboration conflicts**
   - Mitigation: Operational transformation, locking
3. **Version storage growth**
   - Mitigation: Compression, retention policies, S3 archival

### Business Risks
1. **Low adoption**
   - Mitigation: User training, documentation, templates
2. **Feature creep**
   - Mitigation: Strict MVP scope, phased rollout
3. **Resource constraints**
   - Mitigation: Prioritize MVP features, defer Phase 2/3

---

## Support Resources

### Documentation
- Developer docs (API reference, component library)
- User guides (how to build pages, use templates)
- Admin guides (permissions, deployments, monitoring)
- Video tutorials

### Training
- Onboarding workshops
- Office hours
- Knowledge base
- Community forum

### Support Channels
- Email support
- Slack channel
- GitHub issues (for bugs)
- Feature request board

---

This feature summary provides a quick reference for stakeholders to understand the scope, priorities, and implementation details of the enterprise page builder features.
