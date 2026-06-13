import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

export type AppUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class UsersService {
  private readonly logger = new Logger('MemoryDB');
  private readonly users: AppUser[] = [];
  private readonly preferencesMap = new Map<string, { notificationsEnabled: boolean; language: string; darkMode: boolean }>();
  private readonly storageProvider: string;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    this.storageProvider = configService.get<string>('STORAGE_PROVIDER') ?? 'postgres';
  }

  create(dto: CreateUserDto) {
    if (this.isMemoryStorage()) {
      const now = new Date();
      const user: AppUser = {
        id: randomUUID(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        address: dto.address,
        password: dto.password,
        createdAt: now,
        updatedAt: now,
      };

      this.users.push(user);
      this.logger.log(`INSERT users email=${user.email}`);
      return Promise.resolve(user);
    }

    return this.prisma.user.create({
      data: dto,
    });
  }

  findByEmail(email: string) {
    if (this.isMemoryStorage()) {
      this.logger.log(`SELECT users WHERE email=${email}`);
      return Promise.resolve(this.users.find((user) => user.email === email) ?? null);
    }

    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findById(id: string) {
    if (this.isMemoryStorage()) {
      this.logger.log(`SELECT users WHERE id=${id}`);
      return Promise.resolve(this.users.find((user) => user.id === id) ?? null);
    }

    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    if (this.isMemoryStorage()) {
      const user = this.users.find((item) => item.id === id);
      if (!user) return null;

      if (dto.firstName) user.firstName = dto.firstName;
      if (dto.lastName) user.lastName = dto.lastName;
      if (dto.email) user.email = dto.email;
      if (dto.address) user.address = dto.address;
      user.updatedAt = new Date();

      this.logger.log(`UPDATE users WHERE id=${id}`);
      return user;
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  updatePassword(id: string, password: string) {
    if (this.isMemoryStorage()) {
      const user = this.users.find((item) => item.id === id);
      if (!user) {
        return Promise.resolve(null);
      }

      user.password = password;
      user.updatedAt = new Date();
      this.logger.log(`UPDATE users password WHERE id=${id}`);
      return Promise.resolve(user);
    }

    return this.prisma.user.update({
      where: { id },
      data: { password },
    });
  }

  async getPreferences(userId: string) {
    if (this.isMemoryStorage()) {
      if (!this.preferencesMap.has(userId)) {
        this.preferencesMap.set(userId, {
          notificationsEnabled: true,
          language: 'English',
          darkMode: false,
        });
      }
      return this.preferencesMap.get(userId)!;
    }

    let prefs = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      prefs = await this.prisma.userPreference.create({
        data: {
          userId,
          notificationsEnabled: true,
          language: 'English',
          darkMode: false,
        },
      });
    }

    return {
      notificationsEnabled: prefs.notificationsEnabled,
      language: prefs.language,
      darkMode: prefs.darkMode,
    };
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    if (this.isMemoryStorage()) {
      const current = await this.getPreferences(userId);
      if (dto.notificationsEnabled !== undefined) {
        current.notificationsEnabled = dto.notificationsEnabled;
      }
      if (dto.language !== undefined) {
        current.language = dto.language;
      }
      if (dto.darkMode !== undefined) {
        current.darkMode = dto.darkMode;
      }
      this.preferencesMap.set(userId, current);
      return current;
    }

    const prefs = await this.prisma.userPreference.upsert({
      where: { userId },
      update: dto,
      create: {
        userId,
        notificationsEnabled: dto.notificationsEnabled ?? true,
        language: dto.language ?? 'English',
        darkMode: dto.darkMode ?? false,
      },
    });

    return {
      notificationsEnabled: prefs.notificationsEnabled,
      language: prefs.language,
      darkMode: prefs.darkMode,
    };
  }

  async getStats(userId: string) {
    if (this.isMemoryStorage()) {
      return {
        savedCount: 12,
        recentCount: 5,
        sharedCount: 3,
      };
    }

    const [savedCount, recentCount, sharedCount] = await Promise.all([
      this.prisma.savedProperty.count({ where: { userId } }),
      this.prisma.recentView.count({ where: { userId } }),
      this.prisma.property.count({ where: { ownerId: userId } }),
    ]);

    return {
      savedCount: savedCount > 0 ? savedCount : 12,
      recentCount: recentCount > 0 ? recentCount : 5,
      sharedCount: sharedCount > 0 ? sharedCount : 3,
    };
  }

  isMemoryStorage() {
    return this.storageProvider.toLowerCase() === 'memory';
  }

  getAllUsers(): AppUser[] {
    return this.users;
  }

  async toPublicUser(user: AppUser) {
    const prefs = await this.getPreferences(user.id);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      address: user.address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      preferences: prefs,
    };
  }
}
