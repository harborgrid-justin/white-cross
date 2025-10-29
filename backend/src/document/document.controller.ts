import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { CreateDocumentDto, UpdateDocumentDto, SignDocumentDto } from './dto';

/**
 * Document Controller
 * Handles all document management REST endpoints with Swagger documentation
 */
@ApiTags('documents')
@Controller('documents')
@ApiBearerAuth()
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all documents with pagination and filters',
    description: 'Retrieves a paginated list of documents with optional filtering by category, status, student ID, uploader, and search terms. HIPAA compliant with audit logging.'
  })
  @ApiQuery({ name: 'page', required: false, type: 'number', example: 1, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: 'number', example: 20, description: 'Items per page (max 100)' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by document category' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by document status' })
  @ApiQuery({ name: 'studentId', required: false, description: 'Filter by student UUID' })
  @ApiQuery({ name: 'uploadedBy', required: false, description: 'Filter by uploader user ID' })
  @ApiQuery({ name: 'searchTerm', required: false, description: 'Search in document titles and descriptions' })
  @ApiResponse({ 
    status: 200, 
    description: 'Documents retrieved successfully with pagination metadata',
    schema: {
      type: 'object',
      properties: {
        documents: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              title: { type: 'string' },
              category: { type: 'string' },
              status: { type: 'string' },
              fileSize: { type: 'number' },
              mimeType: { type: 'string' },
              uploadedAt: { type: 'string', format: 'date-time' },
              studentId: { type: 'string', format: 'uuid', nullable: true }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getDocuments(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('studentId') studentId?: string,
    @Query('uploadedBy') uploadedBy?: string,
    @Query('searchTerm') searchTerm?: string,
  ) {
    const filters = { category, status, studentId, uploadedBy, searchTerm };
    return this.documentService.getDocuments(page, limit, filters);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get document by ID with all associations',
    description: 'Retrieves a single document by UUID with full details including metadata, signatures, and access history. Logs access for HIPAA audit trail.'
  })
  @ApiParam({ name: 'id', description: 'Document UUID', format: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Document retrieved successfully with full details',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        description: { type: 'string', nullable: true },
        category: { type: 'string' },
        status: { type: 'string' },
        filePath: { type: 'string' },
        fileName: { type: 'string' },
        mimeType: { type: 'string' },
        fileSize: { type: 'number' },
        uploadedBy: { type: 'string' },
        uploadedAt: { type: 'string', format: 'date-time' },
        studentId: { type: 'string', format: 'uuid', nullable: true },
        signatures: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              signedBy: { type: 'string' },
              signedAt: { type: 'string', format: 'date-time' },
              signatureType: { type: 'string' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden - No access to this document' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getDocumentById(@Param('id') id: string) {
    return this.documentService.getDocumentById(id);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Create a new document',
    description: 'Creates a new document record with metadata. File upload is handled separately. Supports various document types including medical forms, consent documents, and reports.'
  })
  @ApiBody({ type: CreateDocumentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Document created successfully with generated UUID',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        category: { type: 'string' },
        status: { type: 'string', example: 'draft' },
        uploadedBy: { type: 'string' },
        uploadedAt: { type: 'string', format: 'date-time' },
        studentId: { type: 'string', format: 'uuid', nullable: true }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input data or validation errors' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions to create documents' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createDocument(@Body() createDto: CreateDocumentDto) {
    return this.documentService.createDocument(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing document' })
  @ApiResponse({ status: 200, description: 'Document updated successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async updateDocument(
    @Param('id') id: string,
    @Body() updateDto: UpdateDocumentDto,
    @Request() req: any,
  ) {
    const updatedBy = req.user?.id || 'system';
    return this.documentService.updateDocument(id, updateDto, updatedBy);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @HttpCode(HttpStatus.OK)
  async deleteDocument(@Param('id') id: string, @Request() req: any) {
    const deletedBy = req.user?.id || 'system';
    return this.documentService.deleteDocument(id, deletedBy);
  }

  @Post(':id/sign')
  @ApiOperation({ 
    summary: 'Sign a document',
    description: 'Adds a digital signature to a document. Supports various signature types including electronic consent, parent approval, and medical authorization. Creates audit trail for legal compliance.'
  })
  @ApiParam({ name: 'id', description: 'Document UUID', format: 'uuid' })
  @ApiBody({ type: SignDocumentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Document signed successfully with signature record',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        signedBy: { type: 'string' },
        signedAt: { type: 'string', format: 'date-time' },
        signatureType: { type: 'string' },
        ipAddress: { type: 'string' },
        userAgent: { type: 'string' },
        documentStatus: { type: 'string', example: 'signed' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid signature data or document not signable' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden - No permission to sign this document' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 409, description: 'Document already signed or in invalid state' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async signDocument(@Body() signDto: SignDocumentDto) {
    return this.documentService.signDocument(signDto);
  }

  @Post(':id/download')
  @ApiOperation({ 
    summary: 'Download a document (tracks access)',
    description: 'Initiates secure download of document file with comprehensive access logging. Tracks user, IP address, and timestamp for HIPAA audit compliance. Returns download URL or file stream.'
  })
  @ApiParam({ name: 'id', description: 'Document UUID', format: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Document download initiated successfully',
    schema: {
      type: 'object',
      properties: {
        downloadUrl: { type: 'string', description: 'Secure temporary download URL' },
        fileName: { type: 'string' },
        fileSize: { type: 'number' },
        mimeType: { type: 'string' },
        expiresAt: { type: 'string', format: 'date-time' },
        accessRecordId: { type: 'string', format: 'uuid' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Authentication required' })
  @ApiResponse({ status: 403, description: 'Forbidden - No download permission for this document' })
  @ApiResponse({ status: 404, description: 'Document not found or file missing' })
  @ApiResponse({ status: 500, description: 'Internal server error or file system error' })
  async downloadDocument(@Param('id') id: string, @Request() req: any) {
    const downloadedBy = req.user?.id || 'system';
    const ipAddress = req.ip;
    return this.documentService.downloadDocument(id, downloadedBy, ipAddress);
  }
}
