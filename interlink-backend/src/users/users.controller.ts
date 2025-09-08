import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserRole } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  async getProfile(@Request() req: any) {
    return this.usersService.findById(req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users search completed' })
  async searchUsers(
    @Query('query') query?: string,
    @Query('role') role?: UserRole,
    @Query('storeId') storeId?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.usersService.searchUsers({
      query,
      role,
      storeId,
      isActive: isActive !== undefined ? isActive === true : undefined,
    });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully' })
  async getUserStats() {
    return this.usersService.getUserStats();
  }

  @Get('store/:storeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get users by store (Store Admin only)' })
  @ApiResponse({ status: 200, description: 'Store users retrieved successfully' })
  async getUsersByStore(@Param('storeId') storeId: string) {
    return this.usersService.getUsersByStore(storeId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new user (Admin only)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        email: { type: 'string', example: 'newuser@example.com' },
        name: { type: 'string', example: 'John Doe' },
        role: { type: 'string', example: 'STORE_ADMIN' },
        storeId: { type: 'string', example: '456e7890-e89b-12d3-a456-426614174001', nullable: true },
        isActive: { type: 'boolean', example: true },
        hasEnabledTwoFactor: { type: 'boolean', example: false },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-20T14:30:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-20T14:30:00.000Z' },
        store: {
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'string', example: '456e7890-e89b-12d3-a456-426614174001' },
            name: { type: 'string', example: 'My Store' },
            slug: { type: 'string', example: 'my-store' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STORE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user (Admin only)' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: 'John Smith Updated' },
        role: { type: 'string', example: 'STORE_STAFF' },
        storeId: { type: 'string', example: '789e0123-e89b-12d3-a456-426614174002', nullable: true },
        isActive: { type: 'boolean', example: true },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-25T16:45:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}