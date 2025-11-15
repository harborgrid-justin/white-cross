/**
 * Migration: Create Page Builder Tables
 *
 * Creates all tables for the page builder functionality including:
 * - page_builder_projects
 * - page_builder_pages
 * - page_builder_components
 * - page_builder_component_elements
 * - page_builder_assets
 * - page_builder_component_library
 * - page_builder_project_versions
 * - page_builder_page_versions
 * - page_builder_collaborators
 * - page_builder_workflows
 *
 * Production-ready with:
 * - Transaction support for atomicity
 * - Comprehensive indexes (including GIN for JSONB)
 * - All foreign key constraints with proper CASCADE/RESTRICT
 * - Composite indexes for query optimization
 * - Proper error handling
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // ==========================================
      // 1. CREATE page_builder_projects TABLE
      // ==========================================
      await queryInterface.createTable(
        'page_builder_projects',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING(200),
            allowNull: false,
            comment: 'Project name',
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Project description',
          },
          slug: {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: 'URL-friendly slug for project',
          },
          ownerId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
            comment: 'Owner user ID',
          },
          schoolId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'schools',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            comment: 'Associated school ID',
          },
          districtId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'districts',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            comment: 'Associated district ID',
          },
          status: {
            type: Sequelize.ENUM('draft', 'published', 'archived'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Project status',
          },
          visibility: {
            type: Sequelize.ENUM('private', 'school', 'district', 'public'),
            allowNull: false,
            defaultValue: 'private',
            comment: 'Project visibility level',
          },
          settings: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Project settings (theme, SEO, responsive, integrations)',
          },
          thumbnailUrl: {
            type: Sequelize.STRING(500),
            allowNull: true,
            comment: 'Thumbnail image URL',
          },
          isTemplate: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether project is a template',
          },
          templateCategory: {
            type: Sequelize.STRING(50),
            allowNull: true,
            comment: 'Template category if isTemplate is true',
          },
          version: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Current version number',
          },
          publishedAt: {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'When project was published',
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
        },
        { transaction }
      );

      // Create indexes for page_builder_projects
      await queryInterface.addIndex('page_builder_projects', ['ownerId'], {
        transaction,
      });
      await queryInterface.addIndex('page_builder_projects', ['schoolId'], {
        transaction,
      });
      await queryInterface.addIndex('page_builder_projects', ['districtId'], {
        transaction,
      });
      await queryInterface.addIndex('page_builder_projects', ['status'], {
        transaction,
      });
      await queryInterface.addIndex('page_builder_projects', ['visibility'], {
        transaction,
      });
      await queryInterface.addIndex('page_builder_projects', ['isTemplate'], {
        transaction,
      });
      await queryInterface.addIndex(
        'page_builder_projects',
        ['slug'],
        {
          unique: true,
          where: { deletedAt: null },
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_projects',
        ['createdAt'],
        {
          name: 'idx_pb_projects_created_at',
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_projects',
        ['updatedAt'],
        {
          name: 'idx_pb_projects_updated_at',
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_projects',
        ['publishedAt'],
        {
          name: 'idx_pb_projects_published_at',
          transaction,
        }
      );
      // Composite indexes for query optimization
      await queryInterface.addIndex(
        'page_builder_projects',
        ['ownerId', 'status'],
        {
          name: 'idx_pb_projects_owner_status',
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_projects',
        ['schoolId', 'visibility'],
        {
          name: 'idx_pb_projects_school_visibility',
          transaction,
        }
      );

      // ==========================================
      // 2. CREATE page_builder_pages TABLE
      // ==========================================
      await queryInterface.createTable(
        'page_builder_pages',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },
          projectId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'page_builder_projects',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Parent project ID',
          },
          name: {
            type: Sequelize.STRING(200),
            allowNull: false,
            comment: 'Page name',
          },
          path: {
            type: Sequelize.STRING(500),
            allowNull: false,
            comment: 'URL path for the page (e.g., /about, /contact)',
          },
          status: {
            type: Sequelize.ENUM('draft', 'published', 'archived'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Page status',
          },
          order: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Display order within project',
          },
          parentId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'page_builder_pages',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Parent page ID for nested pages',
          },
          settings: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Page settings (layout, SEO, custom code)',
          },
          thumbnailUrl: {
            type: Sequelize.STRING(500),
            allowNull: true,
            comment: 'Thumbnail image URL',
          },
          isHomePage: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether this is the home page',
          },
          version: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Current version number',
          },
          publishedAt: {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'When page was published',
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
        },
        { transaction }
      );

      // Create indexes for page_builder_pages
      await queryInterface.addIndex('page_builder_pages', ['projectId'], {
        transaction,
      });
      await queryInterface.addIndex('page_builder_pages', ['parentId'], {
        transaction,
      });
      await queryInterface.addIndex('page_builder_pages', ['status'], {
        transaction,
      });
      await queryInterface.addIndex('page_builder_pages', ['isHomePage'], {
        transaction,
      });
      await queryInterface.addIndex(
        'page_builder_pages',
        ['projectId', 'path'],
        {
          unique: true,
          where: { deletedAt: null },
          name: 'idx_pb_pages_project_path_unique',
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_pages',
        ['projectId', 'order'],
        {
          name: 'idx_pb_pages_project_order',
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_pages',
        ['createdAt'],
        {
          name: 'idx_pb_pages_created_at',
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_pages',
        ['updatedAt'],
        {
          name: 'idx_pb_pages_updated_at',
          transaction,
        }
      );

      // ==========================================
      // 3. CREATE page_builder_component_library TABLE (before components)
      // ==========================================
      await queryInterface.createTable(
        'page_builder_component_library',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },
          createdById: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
            comment: 'User who created this library component',
          },
          schoolId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'schools',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            comment: 'Associated school ID',
          },
          districtId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'districts',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            comment: 'Associated district ID',
          },
          name: {
            type: Sequelize.STRING(200),
            allowNull: false,
            comment: 'Component name',
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Component description',
          },
          category: {
            type: Sequelize.STRING(50),
            allowNull: true,
            comment: 'Component category',
          },
          definition: {
            type: Sequelize.JSONB,
            allowNull: false,
            comment: 'Complete component definition (structure, styles, props)',
          },
          thumbnailUrl: {
            type: Sequelize.STRING(500),
            allowNull: true,
            comment: 'Thumbnail image URL',
          },
          visibility: {
            type: Sequelize.ENUM('private', 'school', 'district', 'public'),
            allowNull: false,
            defaultValue: 'private',
            comment: 'Component visibility level',
          },
          tags: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Component tags for search and organization',
          },
          usageCount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of times this component has been used',
          },
          rating: {
            type: Sequelize.DECIMAL(3, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Average rating (0-5)',
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
        },
        { transaction }
      );

      // Create indexes for page_builder_component_library
      await queryInterface.addIndex(
        'page_builder_component_library',
        ['createdById'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_component_library',
        ['schoolId'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_component_library',
        ['districtId'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_component_library',
        ['visibility'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_component_library',
        ['category'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_component_library',
        ['tags'],
        { using: 'gin', transaction }
      );
      await queryInterface.addIndex(
        'page_builder_component_library',
        ['rating'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_component_library',
        ['usageCount'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_component_library',
        ['createdAt'],
        {
          name: 'idx_pb_library_created_at',
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_component_library',
        ['updatedAt'],
        {
          name: 'idx_pb_library_updated_at',
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_component_library',
        ['visibility', 'category'],
        {
          name: 'idx_pb_library_visibility_category',
          transaction,
        }
      );

      // ==========================================
      // 4. CREATE page_builder_components TABLE
      // ==========================================
      await queryInterface.createTable(
        'page_builder_components',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },
          pageId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'page_builder_pages',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Parent page ID',
          },
          libraryComponentId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'page_builder_component_library',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            comment: 'Library component ID if created from library',
          },
          type: {
            type: Sequelize.ENUM(
              'container',
              'section',
              'header',
              'footer',
              'navigation',
              'hero',
              'text',
              'image',
              'video',
              'button',
              'form',
              'card',
              'grid',
              'list',
              'table',
              'custom'
            ),
            allowNull: false,
            comment: 'Component type',
          },
          name: {
            type: Sequelize.STRING(200),
            allowNull: false,
            comment: 'Component name',
          },
          order: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Display order within page',
          },
          parentId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'page_builder_components',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Parent component ID for nested components',
          },
          props: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Component properties (dynamic based on component type)',
          },
          styles: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Component styles (CSS properties)',
          },
          responsive: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Responsive styles for different breakpoints',
          },
          isVisible: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether component is visible',
          },
          isLocked: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether component is locked from editing',
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
        },
        { transaction }
      );

      // Create indexes for page_builder_components
      await queryInterface.addIndex('page_builder_components', ['pageId'], {
        transaction,
      });
      await queryInterface.addIndex('page_builder_components', ['parentId'], {
        transaction,
      });
      await queryInterface.addIndex('page_builder_components', ['type'], {
        transaction,
      });
      await queryInterface.addIndex(
        'page_builder_components',
        ['libraryComponentId'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_components',
        ['pageId', 'order'],
        {
          name: 'idx_pb_components_page_order',
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_components',
        ['createdAt'],
        {
          name: 'idx_pb_components_created_at',
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_components',
        ['updatedAt'],
        {
          name: 'idx_pb_components_updated_at',
          transaction,
        }
      );

      // ==========================================
      // 5. CREATE page_builder_component_elements TABLE
      // ==========================================
      await queryInterface.createTable(
        'page_builder_component_elements',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },
          componentId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'page_builder_components',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Parent component ID',
          },
          type: {
            type: Sequelize.ENUM(
              'text',
              'heading',
              'paragraph',
              'image',
              'icon',
              'button',
              'link',
              'input',
              'textarea',
              'select',
              'checkbox',
              'radio',
              'divider',
              'spacer',
              'embed'
            ),
            allowNull: false,
            comment: 'Element type',
          },
          order: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Display order within component',
          },
          content: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Element content (text, URLs, values)',
          },
          styles: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Element styles',
          },
          events: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Event handlers for element',
          },
          isVisible: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether element is visible',
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
        },
        { transaction }
      );

      // Create indexes for page_builder_component_elements
      await queryInterface.addIndex(
        'page_builder_component_elements',
        ['componentId'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_component_elements',
        ['type'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_component_elements',
        ['componentId', 'order'],
        {
          name: 'idx_pb_elements_component_order',
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_component_elements',
        ['createdAt'],
        {
          name: 'idx_pb_elements_created_at',
          transaction,
        }
      );

      // ==========================================
      // 6. CREATE page_builder_assets TABLE
      // ==========================================
      await queryInterface.createTable(
        'page_builder_assets',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },
          projectId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'page_builder_projects',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Parent project ID',
          },
          uploadedById: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
            comment: 'User who uploaded the asset',
          },
          name: {
            type: Sequelize.STRING(200),
            allowNull: false,
            comment: 'Asset display name',
          },
          filename: {
            type: Sequelize.STRING(255),
            allowNull: false,
            comment: 'Original filename',
          },
          type: {
            type: Sequelize.ENUM(
              'image',
              'video',
              'audio',
              'document',
              'font',
              'icon',
              'other'
            ),
            allowNull: false,
            comment: 'Asset type',
          },
          mimeType: {
            type: Sequelize.STRING(100),
            allowNull: false,
            comment: 'MIME type',
          },
          size: {
            type: Sequelize.BIGINT,
            allowNull: false,
            comment: 'File size in bytes',
          },
          url: {
            type: Sequelize.TEXT,
            allowNull: false,
            comment: 'Asset URL (S3, CDN, or local path)',
          },
          thumbnailUrl: {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Thumbnail URL for preview',
          },
          metadata: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Asset metadata (dimensions, duration, EXIF, etc.)',
          },
          tags: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Asset tags for organization',
          },
          isPublic: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether asset is publicly accessible',
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
        },
        { transaction }
      );

      // Create indexes for page_builder_assets
      await queryInterface.addIndex('page_builder_assets', ['projectId'], {
        transaction,
      });
      await queryInterface.addIndex('page_builder_assets', ['uploadedById'], {
        transaction,
      });
      await queryInterface.addIndex('page_builder_assets', ['type'], {
        transaction,
      });
      await queryInterface.addIndex('page_builder_assets', ['mimeType'], {
        transaction,
      });
      await queryInterface.addIndex('page_builder_assets', ['tags'], {
        using: 'gin',
        transaction,
      });
      await queryInterface.addIndex(
        'page_builder_assets',
        ['createdAt'],
        {
          name: 'idx_pb_assets_created_at',
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_assets',
        ['updatedAt'],
        {
          name: 'idx_pb_assets_updated_at',
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_assets',
        ['projectId', 'type'],
        {
          name: 'idx_pb_assets_project_type',
          transaction,
        }
      );

      // ==========================================
      // 7. CREATE page_builder_project_versions TABLE
      // ==========================================
      await queryInterface.createTable(
        'page_builder_project_versions',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },
          projectId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'page_builder_projects',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Parent project ID',
          },
          createdById: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
            comment: 'User who created this version',
          },
          versionNumber: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: 'Sequential version number',
          },
          type: {
            type: Sequelize.ENUM(
              'auto_save',
              'manual_save',
              'checkpoint',
              'publish',
              'restore'
            ),
            allowNull: false,
            defaultValue: 'auto_save',
            comment: 'Version type',
          },
          name: {
            type: Sequelize.STRING(200),
            allowNull: true,
            comment: 'Version name (for manual saves and checkpoints)',
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Version description',
          },
          snapshot: {
            type: Sequelize.JSONB,
            allowNull: false,
            comment: 'Complete snapshot of project state',
          },
          changesSummary: {
            type: Sequelize.ARRAY(Sequelize.TEXT),
            allowNull: false,
            defaultValue: [],
            comment: 'Summary of changes from previous version',
          },
          fileSize: {
            type: Sequelize.BIGINT,
            allowNull: true,
            comment: 'Snapshot size in bytes',
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
        },
        { transaction }
      );

      // Create indexes for page_builder_project_versions
      await queryInterface.addIndex(
        'page_builder_project_versions',
        ['projectId'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_project_versions',
        ['createdById'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_project_versions',
        ['type'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_project_versions',
        ['projectId', 'versionNumber'],
        {
          unique: true,
          name: 'idx_pb_project_versions_unique',
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_project_versions',
        ['createdAt'],
        {
          name: 'idx_pb_project_versions_created_at',
          transaction,
        }
      );

      // ==========================================
      // 8. CREATE page_builder_page_versions TABLE
      // ==========================================
      await queryInterface.createTable(
        'page_builder_page_versions',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },
          pageId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'page_builder_pages',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Parent page ID',
          },
          createdById: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
            comment: 'User who created this version',
          },
          versionNumber: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: 'Sequential version number',
          },
          type: {
            type: Sequelize.ENUM(
              'auto_save',
              'manual_save',
              'checkpoint',
              'publish',
              'restore'
            ),
            allowNull: false,
            defaultValue: 'auto_save',
            comment: 'Version type',
          },
          name: {
            type: Sequelize.STRING(200),
            allowNull: true,
            comment: 'Version name',
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Version description',
          },
          snapshot: {
            type: Sequelize.JSONB,
            allowNull: false,
            comment: 'Complete snapshot of page state',
          },
          changesSummary: {
            type: Sequelize.ARRAY(Sequelize.TEXT),
            allowNull: false,
            defaultValue: [],
            comment: 'Summary of changes from previous version',
          },
          fileSize: {
            type: Sequelize.BIGINT,
            allowNull: true,
            comment: 'Snapshot size in bytes',
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
        },
        { transaction }
      );

      // Create indexes for page_builder_page_versions
      await queryInterface.addIndex(
        'page_builder_page_versions',
        ['pageId'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_page_versions',
        ['createdById'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_page_versions',
        ['type'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_page_versions',
        ['pageId', 'versionNumber'],
        {
          unique: true,
          name: 'idx_pb_page_versions_unique',
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_page_versions',
        ['createdAt'],
        {
          name: 'idx_pb_page_versions_created_at',
          transaction,
        }
      );

      // ==========================================
      // 9. CREATE page_builder_collaborators TABLE
      // ==========================================
      await queryInterface.createTable(
        'page_builder_collaborators',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },
          projectId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'page_builder_projects',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Project ID',
          },
          userId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Collaborator user ID',
          },
          invitedById: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            comment: 'User who invited this collaborator',
          },
          role: {
            type: Sequelize.ENUM(
              'owner',
              'admin',
              'editor',
              'viewer',
              'commenter'
            ),
            allowNull: false,
            defaultValue: 'viewer',
            comment: 'Collaborator role',
          },
          permissions: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Granular permissions for this collaborator',
          },
          activity: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Collaborator activity tracking',
          },
          isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether collaboration is active',
          },
          invitedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
            comment: 'When collaborator was invited',
          },
          acceptedAt: {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'When collaborator accepted invitation',
          },
          revokedAt: {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'When collaboration was revoked',
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
        },
        { transaction }
      );

      // Create indexes for page_builder_collaborators
      await queryInterface.addIndex(
        'page_builder_collaborators',
        ['projectId'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_collaborators',
        ['userId'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_collaborators',
        ['invitedById'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_collaborators',
        ['role'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_collaborators',
        ['isActive'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_collaborators',
        ['projectId', 'userId'],
        {
          unique: true,
          name: 'idx_pb_collaborators_project_user_unique',
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_collaborators',
        ['createdAt'],
        {
          name: 'idx_pb_collaborators_created_at',
          transaction,
        }
      );

      // ==========================================
      // 10. CREATE page_builder_workflows TABLE
      // ==========================================
      await queryInterface.createTable(
        'page_builder_workflows',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },
          projectId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'page_builder_projects',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Project ID',
          },
          pageId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'page_builder_pages',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            comment: 'Page ID (if workflow is page-specific)',
          },
          createdById: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
            comment: 'User who created this workflow',
          },
          name: {
            type: Sequelize.STRING(200),
            allowNull: false,
            comment: 'Workflow name',
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'Workflow description',
          },
          type: {
            type: Sequelize.ENUM(
              'scheduled_publish',
              'auto_backup',
              'auto_save',
              'approval_workflow',
              'notification',
              'custom'
            ),
            allowNull: false,
            comment: 'Workflow type',
          },
          status: {
            type: Sequelize.ENUM(
              'active',
              'paused',
              'completed',
              'failed',
              'cancelled'
            ),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Workflow status',
          },
          config: {
            type: Sequelize.JSONB,
            allowNull: false,
            comment: 'Workflow configuration (trigger, actions, conditions)',
          },
          execution: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Workflow execution tracking',
          },
          isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether workflow is active',
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
        },
        { transaction }
      );

      // Create indexes for page_builder_workflows
      await queryInterface.addIndex(
        'page_builder_workflows',
        ['projectId'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_workflows',
        ['pageId'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_workflows',
        ['createdById'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_workflows',
        ['type'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_workflows',
        ['status'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_workflows',
        ['isActive'],
        { transaction }
      );
      await queryInterface.addIndex(
        'page_builder_workflows',
        ['createdAt'],
        {
          name: 'idx_pb_workflows_created_at',
          transaction,
        }
      );
      await queryInterface.addIndex(
        'page_builder_workflows',
        ['updatedAt'],
        {
          name: 'idx_pb_workflows_updated_at',
          transaction,
        }
      );

      // Commit transaction
      await transaction.commit();
      console.log('✓ Successfully created all page builder tables and indexes');
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      console.error('✗ Error creating page builder tables:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Drop tables in reverse order due to foreign key constraints
      await queryInterface.dropTable('page_builder_workflows', { transaction });
      await queryInterface.dropTable('page_builder_collaborators', {
        transaction,
      });
      await queryInterface.dropTable('page_builder_page_versions', {
        transaction,
      });
      await queryInterface.dropTable('page_builder_project_versions', {
        transaction,
      });
      await queryInterface.dropTable('page_builder_assets', { transaction });
      await queryInterface.dropTable('page_builder_component_elements', {
        transaction,
      });
      await queryInterface.dropTable('page_builder_components', {
        transaction,
      });
      await queryInterface.dropTable('page_builder_component_library', {
        transaction,
      });
      await queryInterface.dropTable('page_builder_pages', { transaction });
      await queryInterface.dropTable('page_builder_projects', { transaction });

      await transaction.commit();
      console.log('✓ Successfully dropped all page builder tables');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Error dropping page builder tables:', error);
      throw error;
    }
  },
};
