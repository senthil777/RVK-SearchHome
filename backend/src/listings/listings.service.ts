import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PropertiesService } from '../properties/properties.service';
import { PropertyType } from '@prisma/client';
import * as fs from 'fs';
import { join, extname } from 'path';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ListingsService implements OnModuleInit {
  private readonly logger = new Logger('ListingsService');
  private cloudinaryConfigured = false;

  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const uploadDir = join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      this.cloudinaryConfigured = true;
      this.logger.log('Cloudinary storage successfully configured');
    } else {
      this.logger.log('Cloudinary credentials missing in .env. Falling back to local storage.');
      this.cloudinaryConfigured = false;
    }
  }

  async uploadImage(file: Express.Multer.File, request: any): Promise<string> {
    if (this.cloudinaryConfigured) {
      try {
        return await new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'property-listings' },
            (error, result) => {
              if (error || !result) {
                this.logger.error('Cloudinary upload error:', error);
                return reject(error || new Error('Cloudinary upload returned no result'));
              }
              resolve(result.secure_url);
            },
          );
          uploadStream.end(file.buffer);
        });
      } catch (err) {
        this.logger.error('Cloudinary upload failed, falling back to local disk storage:', err);
      }
    }

    // Local storage fallback
    const uploadDir = join(process.cwd(), 'public/uploads');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const fileName = `photo-${uniqueSuffix}${ext}`;
    
    fs.writeFileSync(join(uploadDir, fileName), file.buffer);

    const host = request.get('host') || 'localhost:3000';
    const protocol = request.protocol || 'http';
    return `${protocol}://${host}/uploads/${fileName}`;
  }

  async createListing(
    userId: string,
    data: {
      imageUrl: string;
      latitude: number;
      longitude: number;
      description?: string;
    },
  ) {
    // Populate database fields missing from camera capture screen with sensible defaults
    const title = 'Captured Home';
    const address = `Lat: ${data.latitude.toFixed(4)}, Long: ${data.longitude.toFixed(4)}`;
    const price = 0;
    const type = PropertyType.SALE;

    return this.propertiesService.create({
      title,
      address,
      price,
      type,
      imageUrl: data.imageUrl,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description || '',
      ownerId: userId,
    });
  }

  async getListings(userId: string) {
    return this.propertiesService.findAll({
      ownerId: userId,
    });
  }
}
