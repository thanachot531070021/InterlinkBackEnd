import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.database.user.findUnique({
      where: { email },
      include: {
        store: true,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.database.user.findUnique({
      where: { id },
      include: {
        store: true,
      },
    });
  }

  async createUser(data: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    storeId?: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return this.database.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      include: {
        store: true,
      },
    });
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async updateUser(id: string, data: Partial<{
    name: string;
    isActive: boolean;
    role: UserRole;
    storeId: string;
  }>): Promise<User> {
    return this.database.user.update({
      where: { id },
      data,
      include: {
        store: true,
        profile: true,
      },
    });
  }

  async deleteUser(id: string): Promise<User> {
    // Soft delete by setting isActive to false
    return this.database.user.update({
      where: { id },
      data: { isActive: false },
      include: {
        store: true,
        profile: true,
      },
    });
  }

  async searchUsers(filters: {
    query?: string;
    role?: UserRole;
    storeId?: string;
    isActive?: boolean;
  }): Promise<User[]> {
    const where: any = {};

    if (filters.query) {
      where.OR = [
        { name: { contains: filters.query, mode: 'insensitive' } },
        { email: { contains: filters.query, mode: 'insensitive' } },
      ];
    }

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.storeId) {
      where.storeId = filters.storeId;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return this.database.user.findMany({
      where,
      include: {
        store: true,
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUsersByStore(storeId: string): Promise<User[]> {
    return this.database.user.findMany({
      where: { storeId },
      include: {
        store: true,
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.database.user.findMany({
      include: {
        store: true,
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
    byStore: Record<string, number>;
  }> {
    const [total, active, roleStats, storeStats] = await Promise.all([
      this.database.user.count(),
      this.database.user.count({ where: { isActive: true } }),
      this.database.user.groupBy({
        by: ['role'],
        _count: {
          id: true,
        },
      }),
      this.database.user.groupBy({
        by: ['storeId'],
        _count: {
          id: true,
        },
        where: {
          storeId: { not: null },
        },
      }),
    ]);

    const byRole = roleStats.reduce((acc, stat) => {
      acc[stat.role] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);

    const byStore = storeStats.reduce((acc, stat) => {
      if (stat.storeId) {
        acc[stat.storeId] = stat._count.id;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      active,
      inactive: total - active,
      byRole,
      byStore,
    };
  }
}