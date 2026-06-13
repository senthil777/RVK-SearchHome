import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserResponseDto } from '../auth/dto/auth-response.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing, expired, or invalid JWT.' })
  async getMe(@Req() request: AuthenticatedRequest) {
    const publicUser = await this.usersService.toPublicUser(request.user);
    return {
      status: 200,
      message: 'User profile retrieved successfully',
      user: publicUser,
    };
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile details' })
  async updateMe(
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateUserDto,
  ) {
    const updated = await this.usersService.update(request.user.id, dto);
    const publicUser = await this.usersService.toPublicUser(updated as any);
    return {
      status: 200,
      message: 'Profile updated successfully',
      user: publicUser,
    };
  }

  @Post('me/change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change authenticated user password' })
  async changePassword(
    @Req() request: AuthenticatedRequest,
    @Body() dto: ChangePasswordDto,
  ) {
    const user = await this.usersService.findById(request.user.id);
    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user!.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid current password.');
    }

    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 12);
    await this.usersService.updatePassword(request.user.id, hashedNewPassword);

    return {
      status: 200,
      message: 'Password changed successfully',
    };
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get profile stats counters' })
  async getStats(@Req() request: AuthenticatedRequest) {
    const stats = await this.usersService.getStats(request.user.id);
    return {
      status: 200,
      message: 'User statistics retrieved successfully',
      stats,
    };
  }

  @Put('me/preferences')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user settings/preferences' })
  async updatePreferences(
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdatePreferencesDto,
  ) {
    const prefs = await this.usersService.updatePreferences(request.user.id, dto);
    return {
      status: 200,
      message: 'Preferences updated successfully',
      preferences: prefs,
    };
  }

  /** DEV ONLY — lists all in-memory users as a plain HTML table */
  @Get('all')
  @ApiOperation({ summary: '[DEV] List all users (memory mode only)' })
  getAllUsers(@Req() req: any, @Res() res: Response) {
    const users = this.usersService.getAllUsers();
    const rows = users
      .map(
        (u, i) =>
          `<tr><td>${i + 1}</td><td>${u.id}</td><td>${u.firstName}</td><td>${u.lastName}</td><td>${u.email}</td><td>${u.address}</td><td>${u.createdAt.toISOString()}</td></tr>`,
      )
      .join('');
    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Users</title>
<style>body{font-family:Arial,sans-serif;padding:24px;background:#f6f7f9}
h1{margin:0 0 16px}table{border-collapse:collapse;width:100%}
th,td{border:1px solid #ddd;padding:10px 14px;text-align:left}
th{background:#2563eb;color:#fff}tr:nth-child(even){background:#f0f4ff}
</style></head><body>
<h1>👥 Users (${users.length})</h1>
<table><thead><tr><th>#</th><th>ID</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Address</th><th>Created At</th></tr></thead>
<tbody>${rows || '<tr><td colspan="7">No users found</td></tr>'}</tbody></table>
</body></html>`);
  }
}
