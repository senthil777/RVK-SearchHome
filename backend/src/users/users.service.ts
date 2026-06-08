import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

export type AppUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class UsersService {
  private readonly logger = new Logger('MemoryDB');
  private readonly users: AppUser[] = [];
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
        name: dto.name,
        email: dto.email,
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

  isMemoryStorage() {
    return this.storageProvider.toLowerCase() === 'memory';
  }

  getAllUsers(): AppUser[] {
    return this.users;
  }


  toPublicUser(user: AppUser) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
