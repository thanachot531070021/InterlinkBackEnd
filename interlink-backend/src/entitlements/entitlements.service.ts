import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { StoreBrandEntitlement, Prisma } from '@prisma/client';

@Injectable()
export class EntitlementsService {
  constructor(private readonly database: DatabaseService) {}

  async findAll(): Promise<StoreBrandEntitlement[]> {
    return this.database.storeBrandEntitlement.findMany({
      include: {
        store: true,
        brand: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<StoreBrandEntitlement | null> {
    return this.database.storeBrandEntitlement.findUnique({
      where: { id },
      include: {
        store: true,
        brand: true,
      },
    });
  }

  async findByStore(storeId: string): Promise<StoreBrandEntitlement[]> {
    return this.database.storeBrandEntitlement.findMany({
      where: { storeId },
      include: {
        brand: true,
      },
      orderBy: {
        effectiveFrom: 'desc',
      },
    });
  }

  async findByBrand(brandId: string): Promise<StoreBrandEntitlement[]> {
    return this.database.storeBrandEntitlement.findMany({
      where: { brandId },
      include: {
        store: true,
      },
      orderBy: {
        effectiveFrom: 'desc',
      },
    });
  }

  async findActiveEntitlements(): Promise<StoreBrandEntitlement[]> {
    const now = new Date();
    return this.database.storeBrandEntitlement.findMany({
      where: {
        effectiveFrom: { lte: now },
        OR: [
          { effectiveTo: null },
          { effectiveTo: { gte: now } }
        ]
      },
      include: {
        store: true,
        brand: true,
      },
      orderBy: {
        effectiveFrom: 'desc',
      },
    });
  }

  async findActiveByStore(storeId: string): Promise<StoreBrandEntitlement[]> {
    const now = new Date();
    return this.database.storeBrandEntitlement.findMany({
      where: {
        storeId,
        effectiveFrom: { lte: now },
        OR: [
          { effectiveTo: null },
          { effectiveTo: { gte: now } }
        ]
      },
      include: {
        brand: true,
      },
      orderBy: {
        effectiveFrom: 'desc',
      },
    });
  }

  async findActiveByBrand(brandId: string): Promise<StoreBrandEntitlement[]> {
    const now = new Date();
    return this.database.storeBrandEntitlement.findMany({
      where: {
        brandId,
        effectiveFrom: { lte: now },
        OR: [
          { effectiveTo: null },
          { effectiveTo: { gte: now } }
        ]
      },
      include: {
        store: true,
      },
      orderBy: {
        effectiveFrom: 'desc',
      },
    });
  }

  async create(data: {
    storeId: string;
    brandId: string;
    pricingMode?: any;
    effectiveFrom?: string;
    effectiveTo?: string;
  }): Promise<StoreBrandEntitlement> {
    return this.database.storeBrandEntitlement.create({
      data: {
        ...data,
        pricingMode: data.pricingMode ?? 'CENTRAL',
        effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom) : new Date(),
        effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : null,
      },
      include: {
        store: true,
        brand: true,
      },
    });
  }

  async update(id: string, data: {
    pricingMode?: any;
    effectiveFrom?: string;
    effectiveTo?: string;
  }): Promise<StoreBrandEntitlement> {
    const updateData: any = { ...data };
    
    if (data.effectiveFrom) {
      updateData.effectiveFrom = new Date(data.effectiveFrom);
    }
    
    if (data.effectiveTo) {
      updateData.effectiveTo = new Date(data.effectiveTo);
    }

    return this.database.storeBrandEntitlement.update({
      where: { id },
      data: updateData,
      include: {
        store: true,
        brand: true,
      },
    });
  }

  async delete(id: string): Promise<StoreBrandEntitlement> {
    return this.database.storeBrandEntitlement.delete({
      where: { id },
      include: {
        store: true,
        brand: true,
      },
    });
  }

  async revokeEntitlement(id: string): Promise<StoreBrandEntitlement> {
    return this.database.storeBrandEntitlement.update({
      where: { id },
      data: {
        effectiveTo: new Date(),
      },
      include: {
        store: true,
        brand: true,
      },
    });
  }

  async checkEntitlement(storeId: string, brandId: string): Promise<boolean> {
    const now = new Date();
    const entitlement = await this.database.storeBrandEntitlement.findFirst({
      where: {
        storeId,
        brandId,
        effectiveFrom: { lte: now },
        OR: [
          { effectiveTo: null },
          { effectiveTo: { gte: now } }
        ]
      },
    });

    return !!entitlement;
  }

  async getEntitlementStats(storeId?: string, brandId?: string) {
    const where: any = {};
    
    if (storeId) where.storeId = storeId;
    if (brandId) where.brandId = brandId;

    const total = await this.database.storeBrandEntitlement.count({ where });
    
    const now = new Date();
    const active = await this.database.storeBrandEntitlement.count({
      where: {
        ...where,
        effectiveFrom: { lte: now },
        OR: [
          { effectiveTo: null },
          { effectiveTo: { gte: now } }
        ]
      },
    });

    const expired = await this.database.storeBrandEntitlement.count({
      where: {
        ...where,
        effectiveTo: { lt: now },
      },
    });

    const pending = await this.database.storeBrandEntitlement.count({
      where: {
        ...where,
        effectiveFrom: { gt: now },
      },
    });

    return {
      total,
      active,
      expired,
      pending,
    };
  }
}