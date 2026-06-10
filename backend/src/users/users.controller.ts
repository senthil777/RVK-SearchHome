import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserResponseDto } from '../auth/dto/auth-response.dto';
import { UsersService } from './users.service';

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
  getMe(@Req() request: AuthenticatedRequest) {
    return this.usersService.toPublicUser(request.user);
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
