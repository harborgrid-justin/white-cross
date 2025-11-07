import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClinicalProtocolService } from '../services/clinical-protocol.service';
import { CreateProtocolDto } from '../dto/protocol/create-protocol.dto';
import { UpdateProtocolDto } from '../dto/protocol/update-protocol.dto';
import { ActivateProtocolDto } from '../dto/protocol/activate-protocol.dto';
import { ProtocolFiltersDto } from '../dto/protocol/protocol-filters.dto';

@ApiTags('Clinical - Protocols')
@ApiBearerAuth()
@Controller('clinical/protocols')
export class ClinicalProtocolController {
  constructor(private readonly protocolService: ClinicalProtocolService) {}

  @Post()
  @ApiOperation({
    summary: 'Create clinical protocol',
    description:
      'Creates a new clinical protocol for standardized healthcare procedures. Protocols define step-by-step medical procedures, treatment guidelines, and emergency response procedures. Requires appropriate clinical privileges.',
  })
  @ApiBody({
    type: CreateProtocolDto,
    description: 'Clinical protocol creation data',
    schema: {
      type: 'object',
      required: ['name', 'category', 'steps', 'createdBy'],
      properties: {
        name: {
          type: 'string',
          example: 'Emergency Cardiac Response Protocol',
          description: 'Protocol name',
        },
        category: {
          type: 'string',
          example: 'emergency',
          description:
            'Protocol category (emergency, routine, diagnostic, etc.)',
        },
        description: {
          type: 'string',
          example:
            'Standard protocol for cardiac emergency response in school settings',
        },
        steps: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              order: { type: 'number', example: 1 },
              instruction: {
                type: 'string',
                example: 'Check patient responsiveness',
              },
              timeLimit: {
                type: 'number',
                example: 30,
                description: 'Time limit in seconds',
              },
              critical: { type: 'boolean', example: true },
            },
          },
        },
        triggers: {
          type: 'array',
          items: { type: 'string', example: 'chest_pain' },
          description: 'Conditions that trigger this protocol',
        },
        requiredStaff: {
          type: 'array',
          items: { type: 'string', example: 'nurse' },
          description: 'Required staff roles to execute protocol',
        },
        createdBy: {
          type: 'string',
          example: 'dr_smith_123',
          description: 'Creating healthcare provider ID',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Clinical protocol created successfully',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'protocol_456',
          description: 'Unique protocol identifier',
        },
        name: {
          type: 'string',
          example: 'Emergency Cardiac Response Protocol',
        },
        category: { type: 'string', example: 'emergency' },
        status: {
          type: 'string',
          enum: ['draft', 'active', 'archived'],
          example: 'draft',
        },
        version: {
          type: 'number',
          example: 1,
          description: 'Protocol version number',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T09:30:00Z',
        },
        createdBy: { type: 'string', example: 'dr_smith_123' },
        approvalStatus: {
          type: 'string',
          enum: ['pending', 'approved', 'rejected'],
          example: 'pending',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - invalid protocol data or missing required fields',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - insufficient clinical privileges to create protocols',
  })
  async create(@Body() createDto: CreateProtocolDto) {
    return this.protocolService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Query clinical protocols',
    description:
      'Retrieves clinical protocols with filtering and pagination. Supports searching by category, status, creator, and text search across protocol content. Essential for protocol management and quick reference during clinical scenarios.',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter by protocol category',
    example: 'emergency',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by protocol status',
    enum: ['draft', 'active', 'archived'],
    example: 'active',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Text search across protocol names and descriptions',
    example: 'cardiac',
  })
  @ApiQuery({
    name: 'createdBy',
    required: false,
    type: String,
    description: 'Filter by creator ID',
    example: 'dr_smith_123',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of protocols per page (default: 20)',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Clinical protocols retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        protocols: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'protocol_456' },
              name: {
                type: 'string',
                example: 'Emergency Cardiac Response Protocol',
              },
              category: { type: 'string', example: 'emergency' },
              description: {
                type: 'string',
                example: 'Standard protocol for cardiac emergencies',
              },
              status: {
                type: 'string',
                enum: ['draft', 'active', 'archived'],
                example: 'active',
              },
              version: { type: 'number', example: 2 },
              lastUpdated: { type: 'string', format: 'date-time' },
              createdBy: { type: 'string', example: 'dr_smith_123' },
              usageCount: {
                type: 'number',
                example: 15,
                description: 'Number of times protocol has been used',
              },
              avgExecutionTime: {
                type: 'number',
                example: 8.5,
                description: 'Average execution time in minutes',
              },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 45 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 20 },
            totalPages: { type: 'number', example: 3 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  async findAll(@Query() filters: ProtocolFiltersDto) {
    return this.protocolService.findAll(filters);
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get all active protocols',
    description:
      'Retrieves all currently active clinical protocols ready for immediate use. Excludes draft and archived protocols. Critical for emergency situations where quick protocol access is essential.',
  })
  @ApiResponse({
    status: 200,
    description: 'Active protocols retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'protocol_456' },
          name: {
            type: 'string',
            example: 'Emergency Cardiac Response Protocol',
          },
          category: { type: 'string', example: 'emergency' },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high', 'critical'],
            example: 'critical',
          },
          estimatedTime: {
            type: 'number',
            example: 10,
            description: 'Estimated execution time in minutes',
          },
          requiredStaff: {
            type: 'array',
            items: { type: 'string', example: 'nurse' },
          },
          triggers: {
            type: 'array',
            items: { type: 'string', example: 'chest_pain' },
          },
          lastUpdated: { type: 'string', format: 'date-time' },
          version: { type: 'number', example: 2 },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  async getActive() {
    return this.protocolService.getActiveProtocols();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get protocol by ID',
    description:
      'Retrieves detailed information for a specific clinical protocol including all steps, requirements, and execution history. Used for protocol review, execution, and compliance documentation.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Protocol unique identifier',
    example: 'protocol_456',
  })
  @ApiResponse({
    status: 200,
    description: 'Protocol details retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'protocol_456' },
        name: {
          type: 'string',
          example: 'Emergency Cardiac Response Protocol',
        },
        category: { type: 'string', example: 'emergency' },
        description: {
          type: 'string',
          example: 'Comprehensive cardiac emergency response procedure',
        },
        status: {
          type: 'string',
          enum: ['draft', 'active', 'archived'],
          example: 'active',
        },
        version: { type: 'number', example: 2 },
        steps: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              order: { type: 'number', example: 1 },
              instruction: {
                type: 'string',
                example: 'Check patient responsiveness',
              },
              timeLimit: {
                type: 'number',
                example: 30,
                description: 'Time limit in seconds',
              },
              critical: { type: 'boolean', example: true },
              equipment: {
                type: 'array',
                items: { type: 'string', example: 'AED' },
              },
              notes: {
                type: 'string',
                example: 'Ensure clear airway before proceeding',
              },
            },
          },
        },
        metadata: {
          type: 'object',
          properties: {
            createdBy: { type: 'string', example: 'dr_smith_123' },
            createdAt: { type: 'string', format: 'date-time' },
            lastUpdated: { type: 'string', format: 'date-time' },
            approvedBy: { type: 'string', example: 'chief_nurse_789' },
            approvalDate: { type: 'string', format: 'date-time' },
          },
        },
        statistics: {
          type: 'object',
          properties: {
            usageCount: { type: 'number', example: 15 },
            avgExecutionTime: { type: 'number', example: 8.5 },
            successRate: {
              type: 'number',
              example: 95.2,
              description: 'Success rate percentage',
            },
            lastUsed: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'Protocol not found',
  })
  async findOne(@Param('id') id: string) {
    return this.protocolService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update protocol' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateProtocolDto) {
    return this.protocolService.update(id, updateDto);
  }

  @Post(':id/activate')
  @ApiOperation({
    summary: 'Activate protocol',
    description:
      'Activates a clinical protocol for immediate use. Requires proper authorization and validates protocol completeness. Creates audit trail for compliance tracking.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Protocol ID to activate',
    example: 'protocol_456',
  })
  @ApiBody({
    type: ActivateProtocolDto,
    description: 'Protocol activation data',
    schema: {
      type: 'object',
      required: ['activatedBy', 'reason'],
      properties: {
        activatedBy: {
          type: 'string',
          example: 'chief_nurse_789',
          description: 'ID of authorizing staff member',
        },
        reason: {
          type: 'string',
          example: 'Protocol review complete, ready for deployment',
        },
        effectiveDate: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:00:00Z',
        },
        notifications: {
          type: 'array',
          items: { type: 'string', example: 'all_nurses' },
          description: 'Staff groups to notify of activation',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Protocol activated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'protocol_456' },
        status: { type: 'string', example: 'active' },
        activatedBy: { type: 'string', example: 'chief_nurse_789' },
        activatedAt: { type: 'string', format: 'date-time' },
        effectiveDate: { type: 'string', format: 'date-time' },
        notificationsSent: {
          type: 'number',
          example: 25,
          description: 'Number of staff notified',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - protocol cannot be activated (incomplete, already active, etc.)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient privileges to activate protocols',
  })
  @ApiResponse({
    status: 404,
    description: 'Protocol not found',
  })
  async activate(
    @Param('id') id: string,
    @Body() activateDto: ActivateProtocolDto,
  ) {
    return this.protocolService.activate(id, activateDto);
  }

  @Post(':id/deactivate')
  @ApiOperation({
    summary: 'Deactivate protocol',
    description:
      'Deactivates a clinical protocol, removing it from active use. Protocol remains in system for audit purposes but cannot be executed. Creates compliance audit trail.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Protocol ID to deactivate',
    example: 'protocol_456',
  })
  @ApiResponse({
    status: 200,
    description: 'Protocol deactivated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'protocol_456' },
        status: { type: 'string', example: 'archived' },
        deactivatedAt: { type: 'string', format: 'date-time' },
        reason: { type: 'string', example: 'Superseded by newer version' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - protocol cannot be deactivated (already inactive, in use, etc.)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient privileges to deactivate protocols',
  })
  @ApiResponse({
    status: 404,
    description: 'Protocol not found',
  })
  async deactivate(@Param('id') id: string) {
    return this.protocolService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete protocol' })
  async remove(@Param('id') id: string) {
    await this.protocolService.remove(id);
  }
}
