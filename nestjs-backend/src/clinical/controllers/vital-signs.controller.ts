import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VitalSignsService } from '../services/vital-signs.service';
import { RecordVitalsDto } from '../dto/vitals/record-vitals.dto';
import { UpdateVitalsDto } from '../dto/vitals/update-vitals.dto';
import { VitalsFiltersDto } from '../dto/vitals/vitals-filters.dto';

@ApiTags('Clinical - Vital Signs')
@Controller('clinical/vital-signs')
export class VitalSignsController {
  constructor(private readonly vitalsService: VitalSignsService) {}

  @Post()
  @ApiOperation({ summary: 'Record vital signs' })
  async record(@Body() recordDto: RecordVitalsDto) {
    return this.vitalsService.record(recordDto);
  }

  @Get()
  @ApiOperation({ summary: 'Query vital signs' })
  async findAll(@Query() filters: VitalsFiltersDto) {
    return this.vitalsService.findAll(filters);
  }

  @Get('visit/:visitId')
  @ApiOperation({ summary: 'Get vitals for a visit' })
  async findByVisit(@Param('visitId') visitId: string) {
    return this.vitalsService.findByVisit(visitId);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get vital history for a student' })
  async findByStudent(@Param('studentId') studentId: string) {
    return this.vitalsService.findByStudent(studentId);
  }

  @Get('student/:studentId/trends')
  @ApiOperation({ summary: 'Get vital trends for a student' })
  async getTrends(
    @Param('studentId') studentId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.vitalsService.getTrends(studentId, new Date(startDate), new Date(endDate));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vital signs by ID' })
  async findOne(@Param('id') id: string) {
    return this.vitalsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vital signs' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateVitalsDto) {
    return this.vitalsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete vital signs' })
  async remove(@Param('id') id: string) {
    await this.vitalsService.remove(id);
  }
}
