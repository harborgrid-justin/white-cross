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
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { CreateDocumentDto, UpdateDocumentDto, SignDocumentDto } from './dto';

/**
 * Document Controller
 * Handles all document management REST endpoints with Swagger documentation
 */
@ApiTags('documents')
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all documents with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
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
  @ApiOperation({ summary: 'Get document by ID with all associations' })
  @ApiResponse({ status: 200, description: 'Document retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getDocumentById(@Param('id') id: string) {
    return this.documentService.getDocumentById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new document' })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
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
  @ApiOperation({ summary: 'Sign a document' })
  @ApiResponse({ status: 200, description: 'Document signed successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async signDocument(@Body() signDto: SignDocumentDto) {
    return this.documentService.signDocument(signDto);
  }

  @Post(':id/download')
  @ApiOperation({ summary: 'Download a document (tracks access)' })
  @ApiResponse({ status: 200, description: 'Document downloaded successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async downloadDocument(@Param('id') id: string, @Request() req: any) {
    const downloadedBy = req.user?.id || 'system';
    const ipAddress = req.ip;
    return this.documentService.downloadDocument(id, downloadedBy, ipAddress);
  }
}
