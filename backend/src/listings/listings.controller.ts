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
import { CreateListingDto } from './dto/create-listing.dto';

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
  @ApiOperation({ summary: 'Submit a new property listing' })
  async createListing(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateListingDto,
  ) {
    const listing = await this.listingsService.createListing(request.user.id, dto);
    return {
      status: 201,
      message: 'Property listing created successfully',
      property: listing,
    };
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload camera captured photo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const imageUrl = await this.listingsService.uploadImage(file, request);

    return {
      status: 201,
      message: 'Image uploaded successfully',
      imageUrl,
    };
  }
}
