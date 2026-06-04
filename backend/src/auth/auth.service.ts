import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AppUser, UsersService } from '../users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

const PASSWORD_RESET_TTL_MINUTES = 15;
const BCRYPT_ROUNDS = 12;

type AppPasswordReset = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
  user: AppUser;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger('MemoryDB');
  private readonly passwordResets: AppPasswordReset[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    const password = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.usersService.create({
      name: dto.name.trim(),
      email,
      password,
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email.toLowerCase().trim());
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.buildAuthResponse(user);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(email);
    const message = 'If an account exists for this email, a reset token has been generated.';

    if (!user) {
      return { message };
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MINUTES * 60 * 1000);

    if (this.isMemoryStorage()) {
      this.passwordResets.push({
        id: randomUUID(),
        userId: user.id,
        token: tokenHash,
        expiresAt,
        used: false,
        createdAt: new Date(),
        user,
      });
      this.logger.log(`INSERT password_resets user_id=${user.id}`);
    } else {
      await this.prisma.passwordReset.create({
        data: {
          userId: user.id,
          token: tokenHash,
          expiresAt,
        },
      });
    }

    return {
      message,
      resetToken: rawToken,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.hashResetToken(dto.token);
    const resetRecord = await this.findResetRecord(tokenHash);

    this.ensureResetTokenUsable(resetRecord);

    const password = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
    if (this.isMemoryStorage()) {
      await this.usersService.updatePassword(resetRecord.userId, password);
      resetRecord.used = true;
      this.logger.log(`UPDATE password_resets used=true WHERE id=${resetRecord.id}`);
    } else {
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: resetRecord.userId },
          data: { password },
        }),
        this.prisma.passwordReset.update({
          where: { id: resetRecord.id },
          data: { used: true },
        }),
      ]);
    }

    return { message: 'Password reset successfully.' };
  }

  private buildAuthResponse(user: AppUser) {
    const payload = { sub: user.id, email: user.email };

    return {
      user: this.usersService.toPublicUser(user),
      accessToken: this.jwtService.sign(payload),
    };
  }

  private hashResetToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private async findResetRecord(tokenHash: string) {
    if (this.isMemoryStorage()) {
      this.logger.log('SELECT password_resets WHERE token=<sha256>');
      return this.passwordResets.find((reset) => reset.token === tokenHash) ?? null;
    }

    return this.prisma.passwordReset.findUnique({
      where: { token: tokenHash },
      include: { user: true },
    });
  }

  private isMemoryStorage() {
    return (
      this.configService.get<string>('STORAGE_PROVIDER')?.toLowerCase() === 'memory'
    );
  }

  private ensureResetTokenUsable(
    resetRecord: AppPasswordReset | null,
  ): asserts resetRecord is AppPasswordReset {
    if (!resetRecord || resetRecord.used || resetRecord.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Reset token is invalid or expired.');
    }
  }
}
