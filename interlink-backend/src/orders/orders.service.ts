import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { StockService } from '../stock/stock.service';
import { 
  CreateOrderDto, 
  UpdateOrderStatusDto, 
  OrderSearchDto, 
  OrderStatsDto 
} from './dto/orders.dto';
import { OrderStatus, ReservationStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: DatabaseService,
    private stockService: StockService,
  ) {}

  // Create new order with stock reservation
  async createOrder(data: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      // Create or find customer by email
      let customer = await tx.customer.findFirst({
        where: { 
          email: data.customer.email,
        },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            name: data.customer.name,
            phone: data.customer.phone,
            email: data.customer.email,
            address: data.customer.address,
            isGuest: true,
          },
        });
      } else {
        // Update customer info if needed
        customer = await tx.customer.update({
          where: { id: customer.id },
          data: {
            name: data.customer.name,
            phone: data.customer.phone,
            address: data.customer.address,
          },
        });
      }

      // Calculate total amount
      let totalAmount = 0;
      for (const item of data.items) {
        totalAmount += item.unitPrice * item.quantity;
      }

      // Create order
      const order = await tx.order.create({
        data: {
          storeId: data.storeId,
          customerId: customer.id,
          status: OrderStatus.PENDING,
          totalAmount,
          notes: data.notes,
        },
      });

      // Create order items and reserve stock
      const orderItems = [];
      const reservations = [];

      for (const itemData of data.items) {
        // Create order item
        const orderItem = await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: itemData.productId,
            variantId: itemData.variantId,
            quantity: itemData.quantity,
            unitPrice: itemData.unitPrice,
            totalPrice: itemData.unitPrice * itemData.quantity,
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
                attributes: true,
              },
            },
          },
        });

        orderItems.push(orderItem);

        // Reserve stock for this item
        try {
          const reservation = await this.stockService.reserveStock({
            storeId: data.storeId,
            productId: itemData.productId,
            variantId: itemData.variantId,
            quantity: itemData.quantity,
            orderId: order.id,
            expiryMinutes: data.reservationMinutes || 60,
          });

          reservations.push(reservation);
        } catch (error) {
          // If stock reservation fails, we need to rollback
          throw new ConflictException(
            `Failed to reserve stock for ${orderItem.product.name}: ${error.message}`,
          );
        }
      }

      // Return complete order with items and reservations
      return {
        ...order,
        items: orderItems,
        reservations,
        customer: {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
        },
      };
    });
  }

  // Get order by ID
  async getOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            address: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            email: true,
            phone: true,
          },
        },
        items: {
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
        },
        reservations: {
          where: {
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
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // Search orders with filters
  async searchOrders(searchDto: OrderSearchDto) {
    const {
      storeId,
      customerId,
      status,
      search,
      dateFrom,
      dateTo,
      offset = 0,
      limit = 50,
    } = searchDto;

    const where: any = {};

    if (storeId) {
      where.storeId = storeId;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          customer: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          customer: {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          items: {
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
            },
            take: 5, // Limit items in list view
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        total,
        offset,
        limit,
        hasMore: offset + limit < total,
      },
    };
  }

  // Update order status
  async updateOrderStatus(orderId: string, data: UpdateOrderStatusDto) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          reservations: {
            where: {
              status: ReservationStatus.ACTIVE,
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      // Handle different status transitions
      if (data.status === OrderStatus.CONFIRMED && order.status === OrderStatus.PENDING) {
        // Confirm all reservations (convert to sales)
        for (const reservation of order.reservations) {
          await this.stockService.confirmReservation(reservation.id);
        }

        return tx.order.update({
          where: { id: orderId },
          data: {
            status: data.status,
            confirmedAt: new Date(),
          },
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    sku: true,
                  },
                },
              },
            },
          },
        });
      } else if (data.status === OrderStatus.CANCELLED) {
        // Release all reservations
        for (const reservation of order.reservations) {
          await this.stockService.releaseReservation(reservation.id);
        }

        return tx.order.update({
          where: { id: orderId },
          data: {
            status: data.status,
            cancelReason: data.cancelReason,
          },
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    sku: true,
                  },
                },
              },
            },
          },
        });
      } else {
        // Simple status update
        return tx.order.update({
          where: { id: orderId },
          data: {
            status: data.status,
            cancelReason: data.cancelReason,
          },
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    sku: true,
                  },
                },
              },
            },
          },
        });
      }
    });
  }

  // Cancel order (with automatic stock release)
  async cancelOrder(orderId: string, reason?: string) {
    return this.updateOrderStatus(orderId, {
      status: OrderStatus.CANCELLED,
      cancelReason: reason,
    });
  }

  // Get store orders
  async getStoreOrders(storeId: string, status?: OrderStatus, limit = 50, offset = 0) {
    const where: any = { storeId };
    if (status) {
      where.status = status;
    }

    return this.searchOrders({
      storeId,
      status,
      limit,
      offset,
    });
  }

  // Get customer orders
  async getCustomerOrders(customerId: string, limit = 20, offset = 0) {
    return this.searchOrders({
      customerId,
      limit,
      offset,
    });
  }

  // Get order statistics
  async getOrderStats(statsDto: OrderStatsDto) {
    const { storeId, dateFrom, dateTo } = statsDto;

    const where: any = {};
    
    if (storeId) {
      where.storeId = storeId;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      cancelledOrders,
      totalRevenue,
      averageOrderValue,
    ] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.count({ where: { ...where, status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { ...where, status: OrderStatus.CONFIRMED } }),
      this.prisma.order.count({ where: { ...where, status: OrderStatus.CANCELLED } }),
      this.prisma.order.aggregate({
        where: { ...where, status: OrderStatus.CONFIRMED },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.aggregate({
        where: { ...where, status: OrderStatus.CONFIRMED },
        _avg: { totalAmount: true },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      cancelledOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      averageOrderValue: averageOrderValue._avg.totalAmount || 0,
      conversionRate: totalOrders > 0 ? (confirmedOrders / totalOrders) * 100 : 0,
    };
  }

  // Get orders that need attention (expired reservations, etc.)
  async getOrdersNeedingAttention() {
    const expiredReservationOrders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.PENDING,
        reservations: {
          some: {
            status: ReservationStatus.ACTIVE,
            expiresAt: {
              lt: new Date(),
            },
          },
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        reservations: {
          where: {
            status: ReservationStatus.ACTIVE,
            expiresAt: {
              lt: new Date(),
            },
          },
        },
      },
    });

    return {
      expiredReservationOrders,
      totalNeedingAttention: expiredReservationOrders.length,
    };
  }

  // Clean up expired orders (background job)
  async cleanupExpiredOrders() {
    const ordersWithExpiredReservations = await this.getOrdersNeedingAttention();
    
    for (const order of ordersWithExpiredReservations.expiredReservationOrders) {
      try {
        await this.cancelOrder(order.id, 'Automatic cancellation due to expired reservation');
      } catch (error) {
        console.error(`Failed to cancel expired order ${order.id}:`, error);
      }
    }

    return {
      message: `Cleaned up ${ordersWithExpiredReservations.totalNeedingAttention} expired orders`,
      count: ordersWithExpiredReservations.totalNeedingAttention,
    };
  }
}