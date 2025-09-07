import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Brand, Prisma } from '@prisma/client';

@Injectable()
export class BrandsService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(): Promise<Brand[]> {
    return this.database.brand.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Brand | null> {
    return this.database.brand.findUnique({
      where: { id },
      include: {
        products: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async findBySlug(slug: string): Promise<Brand | null> {
    return this.database.brand.findUnique({
      where: { slug },
      include: {
        products: {
          where: { status: 'ACTIVE' },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    isActive?: boolean;
  }): Promise<Brand> {
    return this.database.brand.create({
      data: {
        ...data,
        isActive: data.isActive ?? true,
      },
    });
  }

  async update(id: string, data: {
    name?: string;
    slug?: string;
    description?: string;
    logo?: string;
    isActive?: boolean;
  }): Promise<Brand> {
    return this.database.brand.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Brand> {
    return this.database.brand.delete({
      where: { id },
    });
  }

  async findActiveOnly(): Promise<Brand[]> {
    return this.database.brand.findMany({
      where: { isActive: true },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getBrandStats(id: string) {
    const brand = await this.database.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            entitlements: true,
            productPermissions: true,
          },
        },
      },
    });

    if (!brand) return null;

    const totalStores = await this.database.storeBrandEntitlement.count({
      where: { brandId: id },
    });

    const activeProducts = await this.database.product.count({
      where: { brandId: id, status: 'ACTIVE' },
    });

    return {
      ...brand,
      stats: {
        totalProducts: brand._count.products,
        activeProducts,
        totalStores,
        totalPermissions: brand._count.productPermissions,
      },
    };
  }
}