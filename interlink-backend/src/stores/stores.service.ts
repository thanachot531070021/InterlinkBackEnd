import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Store, Prisma } from '@prisma/client';

@Injectable()
export class StoresService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(): Promise<Store[]> {
    return this.database.store.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Store | null> {
    return this.database.store.findUnique({
      where: { id },
      include: {
        users: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
        entitlements: {
          take: 10,
          include: {
            brand: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async findBySlug(slug: string): Promise<Store | null> {
    return this.database.store.findUnique({
      where: { slug },
      include: {
        entitlements: {
          where: {
            effectiveTo: null,
          },
          include: {
            brand: true,
          },
          orderBy: {
            effectiveFrom: 'desc',
          },
        },
      },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    email: string;
    phone?: string;
    address?: Record<string, any>;
    logo?: string;
    status?: any;
    subscriptionStatus?: any;
  }): Promise<Store> {
    return this.database.store.create({
      data: {
        ...data,
        status: data.status ?? 'ACTIVE',
        subscriptionStatus: data.subscriptionStatus ?? 'TRIAL',
      },
    });
  }

  async update(id: string, data: {
    name?: string;
    slug?: string;
    description?: string;
    email?: string;
    phone?: string;
    address?: Record<string, any>;
    logo?: string;
    status?: any;
    subscriptionStatus?: any;
  }): Promise<Store> {
    return this.database.store.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Store> {
    return this.database.store.delete({
      where: { id },
    });
  }

  async findActiveOnly(): Promise<Store[]> {
    return this.database.store.findMany({
      where: { status: 'ACTIVE' },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getStoreStats(id: string) {
    const store = await this.database.store.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            entitlements: true,
            productPermissions: true,
            stocks: true,
            orders: true,
          },
        },
      },
    });

    if (!store) return null;

    const activeUsers = await this.database.user.count({
      where: { storeId: id, isActive: true },
    });

    const activeEntitlements = await this.database.storeBrandEntitlement.count({
      where: { storeId: id, effectiveTo: null },
    });

    const totalOrders = await this.database.order.count({
      where: { storeId: id },
    });

    return {
      ...store,
      stats: {
        totalUsers: store._count.users,
        activeUsers,
        totalBrandEntitlements: store._count.entitlements,
        activeBrandEntitlements: activeEntitlements,
        totalProducts: store._count.stocks,
        totalOrders,
        totalPermissions: store._count.productPermissions,
      },
    };
  }

  async getStoreBrands(id: string) {
    return this.database.storeBrandEntitlement.findMany({
      where: { 
        storeId: id,
        effectiveTo: null,
      },
      include: {
        brand: true,
      },
      orderBy: {
        effectiveFrom: 'desc',
      },
    });
  }
}