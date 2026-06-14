import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ListingsService } from './listings.service';
import { CreateListingMultipartDto } from './dto/create-listing-multipart.dto';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
  };
};

@ApiTags('My List')
@Controller('my-list')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve user-submitted listings' })
  async getMyList(@Req() request: AuthenticatedRequest) {
    const listings = await this.listingsService.getListings(request.user.id);
    return {
      status: 200,
      message: 'Listings retrieved successfully',
      listings,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a new property listing with image upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateListingMultipartDto })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async createListing(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateListingMultipartDto,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = await this.listingsService.uploadImage(file, request);

    const listing = await this.listingsService.createListing(request.user.id, {
      imageUrl,
      latitude: dto.latitude,
      longitude: dto.longitude,
      description: dto.description,
    });

    return {
      status: 201,
      message: 'Property listing created successfully',
      property: listing,
    };
  }

}
