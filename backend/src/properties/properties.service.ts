import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { PropertyType } from '@prisma/client';

export type PropertyItem = {
  id: string;
  title: string;
  address: string;
  price: number;
  type: PropertyType;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId?: string;
};

@Injectable()
export class PropertiesService implements OnModuleInit {
  private readonly logger = new Logger('PropertiesService');
  private readonly properties: PropertyItem[] = [];
  private readonly storageProvider: string;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    this.storageProvider = configService.get<string>('STORAGE_PROVIDER') ?? 'postgres';
  }

  async onModuleInit() {
    await this.seedMockData();
  }

  private isMemoryStorage() {
    return this.storageProvider.toLowerCase() === 'memory';
  }

  private async seedMockData() {
    const mockProperties = [
      {
        title: 'Green Valley Villa',
        address: '12 Park Avenue, Chennai',
        price: 4500000,
        type: PropertyType.SALE,
        imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
        latitude: 13.0405,
        longitude: 80.2337,
        description: 'Spacious 3 BHK villa with private garden in Chennai.',
        isFeatured: true,
      },
      {
        title: 'Sunrise Apartments',
        address: '45 MG Road, Bangalore',
        price: 2800000,
        type: PropertyType.RENT,
        imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
        latitude: 12.9716,
        longitude: 77.5946,
        description: 'Modern 2 BHK apartment close to the city center and IT parks.',
        isFeatured: true,
      },
      {
        title: 'Lake View Bungalow',
        address: '7 Beach Road, Coimbatore',
        price: 7200000,
        type: PropertyType.SALE,
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
        latitude: 11.0168,
        longitude: 76.9558,
        description: 'Luxury bungalow with stunning lake views and modern amenities.',
        isFeatured: true,
      },
    ];

    if (this.isMemoryStorage()) {
      if (this.properties.length === 0) {
        mockProperties.forEach((p, idx) => {
          this.properties.push({
            id: `mock-prop-id-${idx + 1}`,
            ...p,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
        this.logger.log('Seed properties into memory db');
      }
      return;
    }

    try {
      const count = await this.prisma.property.count();
      if (count === 0) {
        for (const p of mockProperties) {
          await this.prisma.property.create({
            data: p,
          });
        }
        this.logger.log('Seeded properties table in PostgreSQL');
      }
    } catch (error) {
      this.logger.error('Failed to seed properties table:', error);
    }
  }

  async findAll(filters: {
    featured?: boolean;
    search?: string;
    type?: PropertyType;
    limit?: number;
    offset?: number;
    ownerId?: string;
  }) {
    const limit = filters.limit ?? 10;
    const offset = filters.offset ?? 0;

    if (this.isMemoryStorage()) {
      let result = [...this.properties];

      if (filters.featured !== undefined) {
        result = result.filter((p) => p.isFeatured === filters.featured);
      }

      if (filters.type !== undefined) {
        result = result.filter((p) => p.type === filters.type);
      }

      if (filters.ownerId !== undefined) {
        result = result.filter((p) => p.ownerId === filters.ownerId);
      }

      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        result = result.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.address.toLowerCase().includes(query) ||
            (p.description && p.description.toLowerCase().includes(query)),
        );
      }

      return result.slice(offset, offset + limit);
    }

    const whereClause: any = {};

    if (filters.featured !== undefined) {
      whereClause.isFeatured = filters.featured;
    }

    if (filters.type !== undefined) {
      whereClause.type = filters.type;
    }

    if (filters.ownerId !== undefined) {
      whereClause.ownerId = filters.ownerId;
    }

    if (filters.search) {
      const query = filters.search.trim();
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    const items = await this.prisma.property.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => ({
      ...item,
      price: Number(item.price),
    }));
  }

  async findOne(id: string) {
    if (this.isMemoryStorage()) {
      return this.properties.find((p) => p.id === id) ?? null;
    }

    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) return null;

    return {
      ...property,
      price: Number(property.price),
    };
  }

  async create(data: {
    title: string;
    address: string;
    price: number;
    type: PropertyType;
    imageUrl?: string;
    latitude?: number;
    longitude?: number;
    description?: string;
    ownerId?: string;
  }) {
    if (this.isMemoryStorage()) {
      const now = new Date();
      const prop: PropertyItem = {
        id: randomUUID(),
        ...data,
        isFeatured: false,
        createdAt: now,
        updatedAt: now,
      };
      this.properties.push(prop);
      return prop;
    }

    const property = await this.prisma.property.create({
      data: {
        title: data.title,
        address: data.address,
        price: data.price,
        type: data.type,
        imageUrl: data.imageUrl,
        latitude: data.latitude,
        longitude: data.longitude,
        description: data.description,
        ownerId: data.ownerId,
      },
    });

    return {
      ...property,
      price: Number(property.price),
    };
  }
}
