/**
 * Contact Controller
 * @description REST API controller for contact management
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  ParseUUIDPipe
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth
} from '@nestjs/swagger';
import { ContactService } from './services/contact.service';
import { EmergencyContactService } from './services/emergency-contact.service';
import {
  CreateContactDto,
  UpdateContactDto,
  ContactQueryDto,
  ContactCreateEmergencyDto,
  ContactUpdateEmergencyDto,
  ContactVerifyDto,
  EmergencyContactQueryDto
} from './dto';
import { ContactType } from './enums';

@ApiTags('Contacts')
@ApiBearerAuth()
@Controller('contacts')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly emergencyContactService: EmergencyContactService
  ) {}

  // ========== General Contact Endpoints ==========

  @Get()
  @ApiOperation({ summary: 'Get all contacts with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated contacts' })
  async getContacts(@Query(ValidationPipe) query: ContactQueryDto) {
    return this.contactService.getContacts(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search contacts by name, email, or organization' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiQuery({ name: 'limit', required: false, description: 'Result limit', type: Number })
  @ApiResponse({ status: 200, description: 'Returns matching contacts' })
  async searchContacts(
    @Query('q') query: string,
    @Query('limit') limit?: number
  ) {
    return this.contactService.searchContacts(query, limit);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get contact statistics' })
  @ApiResponse({ status: 200, description: 'Returns contact statistics by type' })
  async getContactStats() {
    return this.contactService.getContactStats();
  }

  @Get('relation/:relationId')
  @ApiOperation({ summary: 'Get contacts by relation ID' })
  @ApiParam({ name: 'relationId', description: 'Related entity UUID' })
  @ApiQuery({ name: 'type', required: false, enum: ContactType })
  @ApiResponse({ status: 200, description: 'Returns contacts for relation' })
  async getContactsByRelation(
    @Param('relationId', ParseUUIDPipe) relationId: string,
    @Query('type') type?: ContactType
  ) {
    return this.contactService.getContactsByRelation(relationId, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by ID' })
  @ApiParam({ name: 'id', description: 'Contact UUID' })
  @ApiResponse({ status: 200, description: 'Returns contact' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async getContactById(@Param('id', ParseUUIDPipe) id: string) {
    return this.contactService.getContactById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new contact' })
  @ApiResponse({ status: 201, description: 'Contact created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Duplicate contact email' })
  @HttpCode(HttpStatus.CREATED)
  async createContact(@Body(ValidationPipe) dto: CreateContactDto) {
    return this.contactService.createContact(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update contact' })
  @ApiParam({ name: 'id', description: 'Contact UUID' })
  @ApiResponse({ status: 200, description: 'Contact updated successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  @ApiResponse({ status: 409, description: 'Duplicate contact email' })
  async updateContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) dto: UpdateContactDto
  ) {
    return this.contactService.updateContact(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact (soft delete)' })
  @ApiParam({ name: 'id', description: 'Contact UUID' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async deleteContact(@Param('id', ParseUUIDPipe) id: string) {
    return this.contactService.deleteContact(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate contact' })
  @ApiParam({ name: 'id', description: 'Contact UUID' })
  @ApiQuery({ name: 'updatedBy', required: false, description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Contact activated successfully' })
  async reactivateContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('updatedBy') updatedBy?: string
  ) {
    return this.contactService.reactivateContact(id, updatedBy);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate contact' })
  @ApiParam({ name: 'id', description: 'Contact UUID' })
  @ApiQuery({ name: 'updatedBy', required: false, description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Contact deactivated successfully' })
  async deactivateContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('updatedBy') updatedBy?: string
  ) {
    return this.contactService.deactivateContact(id, updatedBy);
  }

  // ========== Emergency Contact Endpoints ==========

  @Get('emergency/list')
  @ApiOperation({ summary: 'Get all emergency contacts with filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated emergency contacts' })
  async getAllEmergencyContacts(@Query(ValidationPipe) query: EmergencyContactQueryDto) {
    return this.emergencyContactService.findAll(query);
  }

  @Get('emergency/student/:studentId')
  @ApiOperation({ summary: 'Get all emergency contacts for a student' })
  @ApiParam({ name: 'studentId', description: 'Student UUID' })
  @ApiResponse({ status: 200, description: 'Returns student emergency contacts' })
  async getEmergencyContactsByStudent(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ) {
    return this.emergencyContactService.findAllByStudent(studentId);
  }

  @Get('emergency/student/:studentId/primary')
  @ApiOperation({ summary: 'Get primary emergency contacts for a student' })
  @ApiParam({ name: 'studentId', description: 'Student UUID' })
  @ApiResponse({ status: 200, description: 'Returns primary contacts' })
  async getPrimaryEmergencyContacts(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ) {
    return this.emergencyContactService.getPrimaryContacts(studentId);
  }

  @Get('emergency/student/:studentId/authorized-pickup')
  @ApiOperation({ summary: 'Get authorized pickup contacts for a student' })
  @ApiParam({ name: 'studentId', description: 'Student UUID' })
  @ApiResponse({ status: 200, description: 'Returns authorized pickup contacts' })
  async getAuthorizedPickupContacts(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ) {
    return this.emergencyContactService.getAuthorizedPickupContacts(studentId);
  }

  @Get('emergency/student/:studentId/notification-routing')
  @ApiOperation({ summary: 'Get notification routing for a student' })
  @ApiParam({ name: 'studentId', description: 'Student UUID' })
  @ApiResponse({ status: 200, description: 'Returns notification routing by priority' })
  async getNotificationRouting(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ) {
    return this.emergencyContactService.getNotificationRouting(studentId);
  }

  @Get('emergency/:id')
  @ApiOperation({ summary: 'Get emergency contact by ID' })
  @ApiParam({ name: 'id', description: 'Emergency contact UUID' })
  @ApiResponse({ status: 200, description: 'Returns emergency contact' })
  @ApiResponse({ status: 404, description: 'Emergency contact not found' })
  async getEmergencyContactById(@Param('id', ParseUUIDPipe) id: string) {
    return this.emergencyContactService.findOne(id);
  }

  @Post('emergency')
  @ApiOperation({ summary: 'Create new emergency contact' })
  @ApiResponse({ status: 201, description: 'Emergency contact created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @HttpCode(HttpStatus.CREATED)
  async createEmergencyContact(@Body(ValidationPipe) dto: ContactCreateEmergencyDto) {
    return this.emergencyContactService.create(dto);
  }

  @Put('emergency/:id')
  @ApiOperation({ summary: 'Update emergency contact' })
  @ApiParam({ name: 'id', description: 'Emergency contact UUID' })
  @ApiResponse({ status: 200, description: 'Emergency contact updated successfully' })
  @ApiResponse({ status: 404, description: 'Emergency contact not found' })
  async updateEmergencyContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) dto: ContactUpdateEmergencyDto
  ) {
    return this.emergencyContactService.update(id, dto);
  }

  @Delete('emergency/:id')
  @ApiOperation({ summary: 'Delete emergency contact' })
  @ApiParam({ name: 'id', description: 'Emergency contact UUID' })
  @ApiResponse({ status: 200, description: 'Emergency contact deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete last primary contact' })
  @ApiResponse({ status: 404, description: 'Emergency contact not found' })
  async deleteEmergencyContact(@Param('id', ParseUUIDPipe) id: string) {
    return this.emergencyContactService.remove(id);
  }

  @Post('emergency/:id/verify')
  @ApiOperation({ summary: 'Verify emergency contact' })
  @ApiParam({ name: 'id', description: 'Emergency contact UUID' })
  @ApiResponse({ status: 200, description: 'Emergency contact verified successfully' })
  @ApiResponse({ status: 404, description: 'Emergency contact not found' })
  async verifyEmergencyContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) dto: ContactVerifyDto
  ) {
    return this.emergencyContactService.verifyContact(id, dto);
  }
}
