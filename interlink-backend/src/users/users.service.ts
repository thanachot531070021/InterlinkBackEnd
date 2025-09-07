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
  }>): Promise<User> {
    return this.database.user.update({
      where: { id },
      data,
      include: {
        store: true,
      },
    });
  }

  async getUsersByStore(storeId: string): Promise<User[]> {
    return this.database.user.findMany({
      where: { storeId },
      include: {
        store: true,
      },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.database.user.findMany({
      include: {
        store: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}