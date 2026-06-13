import { Controller, Get, NotFoundException, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PropertiesService } from './properties.service';
import { PropertyType } from '@prisma/client';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch all properties matching search criteria' })
  @ApiQuery({ name: 'featured', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, enum: PropertyType })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getProperties(
    @Query('featured') featured?: string,
    @Query('search') search?: string,
    @Query('type') type?: PropertyType,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const isFeatured = featured === 'true' ? true : featured === 'false' ? false : undefined;
    const items = await this.propertiesService.findAll({
      featured: isFeatured,
      search,
      type,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });

    return {
      status: 200,
      message: 'Properties retrieved successfully',
      properties: items,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single property by its ID' })
  async getPropertyById(@Param('id') id: string) {
    const property = await this.propertiesService.findOne(id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found.`);
    }

    return {
      status: 200,
      message: 'Property retrieved successfully',
      property,
    };
  }
}
