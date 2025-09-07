import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateStockDto, UpdateStockDto, ReserveStockDto, ReleaseReservationDto, StockAdjustmentDto } from './dto/stock.dto';
import { StoreStock, Reservation, ReservationStatus } from '@prisma/client';

@Injectable()
export class StockService {
  constructor(private prisma: DatabaseService) {}

  // Get all stock for a store
  async getStoreStock(storeId: string) {
    return this.prisma.storeStock.findMany({
      where: { storeId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            sku: true,
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            sku: true,
            attributes: true,
          },
        },
      },
      orderBy: [
        { availableQty: 'asc' }, // Show low stock first
        { product: { name: 'asc' } },
      ],
    });
  }

  // Get stock for a specific product/variant
  async getProductStock(storeId: string, productId: string, variantId?: string) {
    const stock = await this.prisma.storeStock.findFirst({
      where: {
        storeId,
        productId,
        variantId: variantId || null,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            sku: true,
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            sku: true,
            attributes: true,
          },
        },
      },
    });

    if (!stock) {
      throw new NotFoundException('Stock record not found');
    }

    return stock;
  }

  // Create or update stock
  async createOrUpdateStock(data: CreateStockDto) {
    // Check if store has permission to manage this product/brand
    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
      include: { brand: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check store-brand entitlement
    const entitlement = await this.prisma.storeBrandEntitlement.findUnique({
      where: {
        storeId_brandId: {
          storeId: data.storeId,
          brandId: product.brandId,
        },
      },
    });

    if (!entitlement || !this.isEntitlementActive(entitlement)) {
      throw new BadRequestException('Store does not have permission to manage this brand');
    }

    return this.prisma.storeStock.upsert({
      where: {
        storeId_productId_variantId: {
          storeId: data.storeId,
          productId: data.productId,
          variantId: data.variantId || null,
        },
      },
      update: {
        availableQty: data.availableQty,
        priceCentral: data.priceCentral,
        priceStore: data.priceStore,
        lastChangedAt: new Date(),
      },
      create: {
        storeId: data.storeId,
        productId: data.productId,
        variantId: data.variantId,
        availableQty: data.availableQty,
        reservedQty: 0,
        soldQty: 0,
        priceCentral: data.priceCentral,
        priceStore: data.priceStore,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
    });
  }

  // Update existing stock
  async updateStock(stockId: string, data: UpdateStockDto) {
    const existingStock = await this.prisma.storeStock.findUnique({
      where: { id: stockId },
    });

    if (!existingStock) {
      throw new NotFoundException('Stock record not found');
    }

    return this.prisma.storeStock.update({
      where: { id: stockId },
      data: {
        ...data,
        lastChangedAt: new Date(),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
    });
  }

  // Reserve stock atomically (for order processing)
  async reserveStock(data: ReserveStockDto): Promise<Reservation> {
    const expiryMinutes = data.expiryMinutes || 60;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    return this.prisma.$transaction(async (tx) => {
      // Find the stock record
      const stock = await tx.storeStock.findFirst({
        where: {
          storeId: data.storeId,
          productId: data.productId,
          variantId: data.variantId || null,
        },
      });

      if (!stock) {
        throw new NotFoundException('Stock record not found');
      }

      // Check if enough stock is available
      const availableForReservation = stock.availableQty - stock.reservedQty;
      if (availableForReservation < data.quantity) {
        throw new ConflictException(
          `Insufficient stock. Available: ${availableForReservation}, Requested: ${data.quantity}`,
        );
      }

      // Update reserved quantity atomically
      await tx.storeStock.update({
        where: { id: stock.id },
        data: {
          reservedQty: {
            increment: data.quantity,
          },
          lastChangedAt: new Date(),
        },
      });

      // Create reservation record
      const reservation = await tx.reservation.create({
        data: {
          storeId: data.storeId,
          orderId: data.orderId,
          productId: data.productId,
          variantId: data.variantId,
          quantity: data.quantity,
          expiresAt,
          status: ReservationStatus.ACTIVE,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
            },
          },
          variant: {
            select: {
              id: true,
              name: true,
              sku: true,
            },
          },
        },
      });

      return reservation;
    });
  }

  // Release reservation (on order completion or cancellation)
  async releaseReservation(reservationId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Find the reservation
      const reservation = await tx.reservation.findUnique({
        where: { id: reservationId },
        include: {
          order: true,
        },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status !== ReservationStatus.ACTIVE) {
        throw new BadRequestException('Reservation is not active');
      }

      // Find the stock record
      const stock = await tx.storeStock.findFirst({
        where: {
          storeId: reservation.storeId,
          productId: reservation.productId,
          variantId: reservation.variantId,
        },
      });

      if (!stock) {
        throw new NotFoundException('Stock record not found');
      }

      // Release the reserved quantity
      await tx.storeStock.update({
        where: { id: stock.id },
        data: {
          reservedQty: {
            decrement: reservation.quantity,
          },
          lastChangedAt: new Date(),
        },
      });

      // Mark reservation as released
      await tx.reservation.update({
        where: { id: reservationId },
        data: {
          status: ReservationStatus.RELEASED,
        },
      });

      return { message: 'Reservation released successfully' };
    });
  }

  // Convert reservation to sale (when order is confirmed)
  async confirmReservation(reservationId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Find the reservation
      const reservation = await tx.reservation.findUnique({
        where: { id: reservationId },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.status !== ReservationStatus.ACTIVE) {
        throw new BadRequestException('Reservation is not active');
      }

      // Find the stock record
      const stock = await tx.storeStock.findFirst({
        where: {
          storeId: reservation.storeId,
          productId: reservation.productId,
          variantId: reservation.variantId,
        },
      });

      if (!stock) {
        throw new NotFoundException('Stock record not found');
      }

      // Convert reserved quantity to sold
      await tx.storeStock.update({
        where: { id: stock.id },
        data: {
          availableQty: {
            decrement: reservation.quantity,
          },
          reservedQty: {
            decrement: reservation.quantity,
          },
          soldQty: {
            increment: reservation.quantity,
          },
          lastChangedAt: new Date(),
        },
      });

      // Mark reservation as applied
      await tx.reservation.update({
        where: { id: reservationId },
        data: {
          status: ReservationStatus.APPLIED,
        },
      });

      return { message: 'Reservation confirmed and stock updated' };
    });
  }

  // Manual stock adjustment (for corrections, damage, etc.)
  async adjustStock(data: StockAdjustmentDto) {
    return this.prisma.$transaction(async (tx) => {
      const stock = await tx.storeStock.findUnique({
        where: { id: data.stockId },
      });

      if (!stock) {
        throw new NotFoundException('Stock record not found');
      }

      // Calculate new available quantity
      const newAvailableQty = stock.availableQty + data.adjustment;
      if (newAvailableQty < 0) {
        throw new BadRequestException('Adjustment would result in negative stock');
      }

      // Update stock
      const updatedStock = await tx.storeStock.update({
        where: { id: data.stockId },
        data: {
          availableQty: newAvailableQty,
          lastChangedAt: new Date(),
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
            },
          },
          variant: {
            select: {
              id: true,
              name: true,
              sku: true,
            },
          },
        },
      });

      // Log the adjustment in audit trail (if needed)
      // await tx.eventsAudit.create({
      //   data: {
      //     action: 'STOCK_ADJUSTMENT',
      //     entityType: 'STOCK',
      //     entityId: data.stockId,
      //     details: {
      //       adjustment: data.adjustment,
      //       reason: data.reason,
      //       previousQty: stock.availableQty,
      //       newQty: newAvailableQty,
      //     },
      //   },
      // });

      return updatedStock;
    });
  }

  // Get expired reservations (for cleanup job)
  async getExpiredReservations() {
    return this.prisma.reservation.findMany({
      where: {
        status: ReservationStatus.ACTIVE,
        expiresAt: {
          lt: new Date(),
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
    });
  }

  // Cleanup expired reservations
  async cleanupExpiredReservations() {
    const expiredReservations = await this.getExpiredReservations();
    
    for (const reservation of expiredReservations) {
      try {
        await this.releaseReservation(reservation.id);
      } catch (error) {
        console.error(`Failed to release expired reservation ${reservation.id}:`, error);
      }
    }

    return {
      message: `Cleaned up ${expiredReservations.length} expired reservations`,
      count: expiredReservations.length,
    };
  }

  // Get store stock statistics
  async getStoreStockStats(storeId: string) {
    const [totalProducts, lowStockItems, outOfStockItems, totalValue] = await Promise.all([
      this.prisma.storeStock.count({
        where: { storeId },
      }),
      this.prisma.storeStock.count({
        where: {
          storeId,
          availableQty: {
            lte: 5,
            gt: 0, // Low stock but not zero
          },
        },
      }),
      this.prisma.storeStock.count({
        where: {
          storeId,
          availableQty: 0,
        },
      }),
      this.prisma.storeStock.aggregate({
        where: { storeId },
        _sum: {
          availableQty: true,
        },
      }),
    ]);

    return {
      totalProducts,
      lowStockItems,
      outOfStockItems,
      totalUnits: totalValue._sum.availableQty || 0,
      inStockItems: totalProducts - outOfStockItems,
    };
  }

  // Helper method to check if entitlement is active
  private isEntitlementActive(entitlement: any): boolean {
    const now = new Date();
    const effectiveFrom = new Date(entitlement.effectiveFrom);
    const effectiveTo = entitlement.effectiveTo ? new Date(entitlement.effectiveTo) : null;

    return now >= effectiveFrom && (effectiveTo === null || now <= effectiveTo);
  }
}