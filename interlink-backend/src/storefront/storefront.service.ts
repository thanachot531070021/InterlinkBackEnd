import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { StorefrontSearchDto, ProductDetailDto, ProductAvailabilityDto } from './dto/storefront.dto';

@Injectable()
export class StorefrontService {
  constructor(private prisma: DatabaseService) {}

  // Get store information by slug (public)
  async getStoreInfo(storeSlug: string) {
    const store = await this.prisma.store.findUnique({
      where: { 
        slug: storeSlug,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        email: true,
        phone: true,
        address: true,
        logo: true,
        website: true,
        socialMedia: true,
        businessHours: true,
        status: true,
        createdAt: true,
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  // Get store's public product catalog
  async getStoreProducts(searchDto: StorefrontSearchDto) {
    const store = await this.getStoreInfo(searchDto.storeSlug);
    
    const where: any = {
      storeStock: {
        some: {
          storeId: store.id,
          availableQty: {
            gt: 0, // Only show products with stock
          },
        },
      },
      isActive: true,
    };

    // Text search
    if (searchDto.search) {
      where.OR = [
        {
          name: {
            contains: searchDto.search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchDto.search,
            mode: 'insensitive',
          },
        },
        {
          brand: {
            name: {
              contains: searchDto.search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // Category filter
    if (searchDto.category) {
      where.category = {
        contains: searchDto.category,
        mode: 'insensitive',
      };
    }

    // Brand filter
    if (searchDto.brandId) {
      where.brandId = searchDto.brandId;
    }

    // Price filter
    if (searchDto.minPrice || searchDto.maxPrice) {
      where.storeStock = {
        ...where.storeStock,
        some: {
          ...where.storeStock.some,
          ...(searchDto.minPrice && { priceStore: { gte: searchDto.minPrice } }),
          ...(searchDto.maxPrice && { priceStore: { lte: searchDto.maxPrice } }),
        },
      };
    }

    // Build sort order
    const orderBy: any = {};
    switch (searchDto.sortBy) {
      case 'price':
        orderBy.storeStock = {
          _count: searchDto.sortOrder || 'asc',
        };
        break;
      case 'created':
        orderBy.createdAt = searchDto.sortOrder || 'desc';
        break;
      default:
        orderBy.name = searchDto.sortOrder || 'asc';
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
          variants: {
            where: {
              isActive: true,
            },
            select: {
              id: true,
              name: true,
              sku: true,
              attributes: true,
              storeStock: {
                where: {
                  storeId: store.id,
                },
                select: {
                  availableQty: true,
                  priceStore: true,
                },
              },
            },
          },
          storeStock: {
            where: {
              storeId: store.id,
            },
            select: {
              availableQty: true,
              priceStore: true,
              lastChangedAt: true,
            },
          },
        },
        orderBy,
        take: searchDto.limit,
        skip: searchDto.offset,
      }),
      this.prisma.product.count({ where }),
    ]);

    // Format products for storefront
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      sku: product.sku,
      category: product.category,
      images: product.images,
      brand: product.brand,
      variants: product.variants.map(variant => ({
        ...variant,
        stock: variant.storeStock[0] || { availableQty: 0, priceStore: 0 },
        storeStock: undefined,
      })),
      baseStock: product.storeStock[0] || { availableQty: 0, priceStore: 0 },
      createdAt: product.createdAt,
    }));

    return {
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
      },
      products: formattedProducts,
      pagination: {
        total,
        offset: searchDto.offset,
        limit: searchDto.limit,
        hasMore: searchDto.offset + searchDto.limit < total,
      },
      filters: {
        search: searchDto.search,
        category: searchDto.category,
        brandId: searchDto.brandId,
        priceRange: {
          min: searchDto.minPrice,
          max: searchDto.maxPrice,
        },
      },
    };
  }

  // Get single product details
  async getProductDetail(detailDto: ProductDetailDto) {
    const store = await this.getStoreInfo(detailDto.storeSlug);

    const product = await this.prisma.product.findFirst({
      where: {
        slug: detailDto.productSlug,
        isActive: true,
        storeStock: {
          some: {
            storeId: store.id,
          },
        },
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            description: true,
          },
        },
        variants: {
          where: {
            isActive: true,
          },
          include: {
            storeStock: {
              where: {
                storeId: store.id,
              },
              select: {
                availableQty: true,
                priceStore: true,
                lastChangedAt: true,
              },
            },
          },
        },
        storeStock: {
          where: {
            storeId: store.id,
          },
          select: {
            availableQty: true,
            priceStore: true,
            lastChangedAt: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found in this store');
    }

    // Format for storefront
    return {
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
      },
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        sku: product.sku,
        category: product.category,
        tags: product.tags,
        images: product.images,
        specifications: product.specifications,
        brand: product.brand,
        variants: product.variants.map(variant => ({
          id: variant.id,
          name: variant.name,
          sku: variant.sku,
          attributes: variant.attributes,
          stock: variant.storeStock[0] || { availableQty: 0, priceStore: 0 },
          isAvailable: (variant.storeStock[0]?.availableQty || 0) > 0,
        })),
        baseStock: product.storeStock[0] || { availableQty: 0, priceStore: 0 },
        isAvailable: (product.storeStock[0]?.availableQty || 0) > 0,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    };
  }

  // Check product availability (for cart validation)
  async checkProductAvailability(availabilityDto: ProductAvailabilityDto) {
    const store = await this.getStoreInfo(availabilityDto.storeSlug);

    const stockRecords = await this.prisma.storeStock.findMany({
      where: {
        storeId: store.id,
        productId: {
          in: availabilityDto.productIds,
        },
        ...(availabilityDto.variantIds && {
          variantId: {
            in: availabilityDto.variantIds,
          },
        }),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
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

    return {
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
      },
      availability: stockRecords.map(stock => ({
        productId: stock.productId,
        variantId: stock.variantId,
        product: stock.product,
        variant: stock.variant,
        availableQty: stock.availableQty,
        reservedQty: stock.reservedQty,
        price: stock.priceStore,
        isAvailable: stock.availableQty > 0,
        lastUpdated: stock.lastChangedAt,
      })),
    };
  }

  // Get store categories (for navigation)
  async getStoreCategories(storeSlug: string) {
    const store = await this.getStoreInfo(storeSlug);

    const categories = await this.prisma.product.findMany({
      where: {
        isActive: true,
        storeStock: {
          some: {
            storeId: store.id,
            availableQty: {
              gt: 0,
            },
          },
        },
      },
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    const categoryList = categories
      .filter(c => c.category)
      .map(c => c.category)
      .sort();

    return {
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
      },
      categories: categoryList,
    };
  }

  // Get store brands (for filtering)
  async getStoreBrands(storeSlug: string) {
    const store = await this.getStoreInfo(storeSlug);

    const brands = await this.prisma.brand.findMany({
      where: {
        products: {
          some: {
            isActive: true,
            storeStock: {
              some: {
                storeId: store.id,
                availableQty: {
                  gt: 0,
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        description: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      store: {
        id: store.id,
        name: store.name,
        slug: store.slug,
      },
      brands,
    };
  }

  // Search suggestions (autocomplete)
  async getSearchSuggestions(storeSlug: string, query: string, limit = 10) {
    const store = await this.getStoreInfo(storeSlug);

    if (!query || query.length < 2) {
      return { suggestions: [] };
    }

    const suggestions = await this.prisma.product.findMany({
      where: {
        isActive: true,
        storeStock: {
          some: {
            storeId: store.id,
            availableQty: {
              gt: 0,
            },
          },
        },
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            brand: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        brand: {
          select: {
            name: true,
          },
        },
      },
      take: limit,
      orderBy: {
        name: 'asc',
      },
    });

    return {
      query,
      suggestions: suggestions.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        brand: product.brand?.name,
        type: 'product',
      })),
    };
  }
}