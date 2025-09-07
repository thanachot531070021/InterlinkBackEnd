import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Product, Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(): Promise<Product[]> {
    return this.database.product.findMany({
      include: {
        brand: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return this.database.product.findUnique({
      where: { id },
      include: {
        brand: true,
        variants: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
        stocks: {
          take: 10,
          include: {
            store: true,
          },
          orderBy: {
            lastChangedAt: 'desc',
          },
        },
      },
    });
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return this.database.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        variants: {
          where: { status: 'ACTIVE' },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.database.product.findUnique({
      where: { sku },
      include: {
        brand: true,
        variants: true,
      },
    });
  }

  async findByBrand(brandId: string): Promise<Product[]> {
    return this.database.product.findMany({
      where: { brandId },
      include: {
        brand: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByStore(storeId: string): Promise<Product[]> {
    return this.database.product.findMany({
      where: { createdByStoreId: storeId },
      include: {
        brand: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    sku: string;
    description?: string;
    brandId: string;
    createdByStoreId?: string;
    category: string;
    price: number;
    images?: string[];
    attributes?: Record<string, any>;
    status?: any;
  }): Promise<Product> {
    return this.database.product.create({
      data: {
        ...data,
        status: data.status ?? 'ACTIVE',
      },
      include: {
        brand: true,
      },
    });
  }

  async update(id: string, data: {
    name?: string;
    slug?: string;
    sku?: string;
    description?: string;
    category?: string;
    price?: number;
    images?: string[];
    attributes?: Record<string, any>;
    status?: any;
  }): Promise<Product> {
    return this.database.product.update({
      where: { id },
      data,
      include: {
        brand: true,
      },
    });
  }

  async delete(id: string): Promise<Product> {
    return this.database.product.delete({
      where: { id },
      include: {
        brand: true,
      },
    });
  }

  async findActiveOnly(): Promise<Product[]> {
    return this.database.product.findMany({
      where: { status: 'ACTIVE' },
      include: {
        brand: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getProductStats(id: string) {
    const product = await this.database.product.findUnique({
      where: { id },
      include: {
        brand: true,
        _count: {
          select: {
            variants: true,
            stocks: true,
            orderItems: true,
            reservations: true,
          },
        },
      },
    });

    if (!product) return null;

    const totalStock = await this.database.storeStock.aggregate({
      where: { productId: id },
      _sum: {
        availableQty: true,
        reservedQty: true,
        soldQty: true,
      },
    });

    const activeVariants = await this.database.productVariant.count({
      where: { productId: id, status: 'ACTIVE' },
    });

    return {
      ...product,
      stats: {
        totalVariants: product._count.variants,
        activeVariants,
        totalStores: product._count.stocks,
        totalOrders: product._count.orderItems,
        totalReservations: product._count.reservations,
        stockSummary: {
          totalAvailable: totalStock._sum.availableQty || 0,
          totalReserved: totalStock._sum.reservedQty || 0,
          totalSold: totalStock._sum.soldQty || 0,
        },
      },
    };
  }

  async searchProducts(query: {
    search?: string;
    brandId?: string;
    category?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.brandId) {
      where.brandId = query.brandId;
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) {
        where.price.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        where.price.lte = query.maxPrice;
      }
    }

    const products = await this.database.product.findMany({
      where,
      include: {
        brand: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: query.limit || 50,
      skip: query.offset || 0,
    });

    const total = await this.database.product.count({ where });

    return {
      products,
      pagination: {
        total,
        limit: query.limit || 50,
        offset: query.offset || 0,
        pages: Math.ceil(total / (query.limit || 50)),
      },
    };
  }
}