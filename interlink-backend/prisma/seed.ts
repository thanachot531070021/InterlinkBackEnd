import { PrismaClient, UserRole, StoreStatus, SubscriptionStatus, PricingMode, ProductStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding development data...');

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@interlink.local' },
    update: {},
    create: {
      email: 'admin@interlink.local',
      password: hashedPassword,
      name: 'System Admin',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log('✅ Created admin user:', adminUser.email);

  // Create Multiple Brands for comprehensive testing
  const appleBrand = await prisma.brand.upsert({
    where: { slug: 'apple' },
    update: {},
    create: {
      name: 'Apple',
      slug: 'apple',
      description: 'Think Different - Premium technology products',
      logo: 'https://example.com/logos/apple.png',
      isActive: true,
    },
  });

  const samsungBrand = await prisma.brand.upsert({
    where: { slug: 'samsung' },
    update: {},
    create: {
      name: 'Samsung',
      slug: 'samsung',
      description: 'Innovation and excellence in technology',
      logo: 'https://example.com/logos/samsung.png',
      isActive: true,
    },
  });

  const nikeBrand = await prisma.brand.upsert({
    where: { slug: 'nike' },
    update: {},
    create: {
      name: 'Nike',
      slug: 'nike',
      description: 'Just Do It - Premium athletic wear and footwear',
      logo: 'https://example.com/logos/nike.png',
      isActive: true,
    },
  });

  const adidasBrand = await prisma.brand.upsert({
    where: { slug: 'adidas' },
    update: {},
    create: {
      name: 'Adidas',
      slug: 'adidas',
      description: 'Impossible is Nothing - Sports and lifestyle',
      logo: 'https://example.com/logos/adidas.png',
      isActive: true,
    },
  });

  const sonyBrand = await prisma.brand.upsert({
    where: { slug: 'sony' },
    update: {},
    create: {
      name: 'Sony',
      slug: 'sony',
      description: 'Creative entertainment and technology',
      logo: 'https://example.com/logos/sony.png',
      isActive: true,
    },
  });

  // Create one inactive brand for testing
  const inactiveBrand = await prisma.brand.upsert({
    where: { slug: 'legacy-brand' },
    update: {},
    create: {
      name: 'Legacy Brand',
      slug: 'legacy-brand',
      description: 'Discontinued brand for testing purposes',
      isActive: false,
    },
  });

  console.log('✅ Created 6 brands:', appleBrand.name, samsungBrand.name, nikeBrand.name, adidasBrand.name, sonyBrand.name, inactiveBrand.name);

  // Create Multiple Stores for comprehensive testing
  const bangkokElectronics = await prisma.store.upsert({
    where: { slug: 'bangkok-electronics' },
    update: {},
    create: {
      name: 'Bangkok Electronics',
      slug: 'bangkok-electronics',
      description: 'Premium electronics store in Bangkok',
      email: 'info@bangkokelectronics.com',
      phone: '+66-2-123-4567',
      address: {
        street: '456 Sukhumvit Road',
        city: 'Bangkok',
        province: 'Bangkok',
        postalCode: '10110',
        country: 'Thailand'
      },
      logo: 'https://example.com/stores/bangkok-electronics.png',
      status: StoreStatus.ACTIVE,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
    },
  });

  const fashionHub = await prisma.store.upsert({
    where: { slug: 'fashion-hub' },
    update: {},
    create: {
      name: 'Fashion Hub',
      slug: 'fashion-hub',
      description: 'Trendy fashion and lifestyle store',
      email: 'contact@fashionhub.com',
      phone: '+66-2-987-6543',
      address: {
        street: '789 Siam Square',
        city: 'Bangkok',
        province: 'Bangkok',
        postalCode: '10330',
        country: 'Thailand'
      },
      logo: 'https://example.com/stores/fashion-hub.png',
      status: StoreStatus.ACTIVE,
      subscriptionStatus: SubscriptionStatus.TRIAL,
    },
  });

  const sportZone = await prisma.store.upsert({
    where: { slug: 'sport-zone' },
    update: {},
    create: {
      name: 'Sport Zone',
      slug: 'sport-zone',
      description: 'Your ultimate sports and fitness destination',
      email: 'team@sportzone.co.th',
      phone: '+66-2-555-0123',
      address: {
        street: '321 RCA Plaza',
        city: 'Bangkok',
        province: 'Bangkok',
        postalCode: '10310',
        country: 'Thailand'
      },
      logo: 'https://example.com/stores/sport-zone.png',
      status: StoreStatus.ACTIVE,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
    },
  });

  const chiangMaiTech = await prisma.store.upsert({
    where: { slug: 'chiang-mai-tech' },
    update: {},
    create: {
      name: 'Chiang Mai Tech',
      slug: 'chiang-mai-tech',
      description: 'Northern Thailand tech hub',
      email: 'hello@chiangmaitech.com',
      phone: '+66-53-123-456',
      address: {
        street: '88 Chang Khlan Road',
        city: 'Chiang Mai',
        province: 'Chiang Mai',
        postalCode: '50100',
        country: 'Thailand'
      },
      status: StoreStatus.ACTIVE,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
    },
  });

  // Create one suspended store for testing
  const suspendedStore = await prisma.store.upsert({
    where: { slug: 'suspended-shop' },
    update: {},
    create: {
      name: 'Suspended Shop',
      slug: 'suspended-shop',
      description: 'Store suspended for testing purposes',
      email: 'suspended@example.com',
      phone: '+66-2-000-0000',
      address: {
        street: '999 Test Street',
        city: 'Bangkok',
        province: 'Bangkok',
        postalCode: '10000',
        country: 'Thailand'
      },
      status: StoreStatus.SUSPENDED,
      subscriptionStatus: SubscriptionStatus.EXPIRED,
    },
  });

  console.log('✅ Created 5 stores:', bangkokElectronics.name, fashionHub.name, sportZone.name, chiangMaiTech.name, suspendedStore.name);

  // Create Multiple Store Users for testing different roles
  const bangkokElectronicsAdmin = await prisma.user.upsert({
    where: { email: 'admin@bangkokelectronics.com' },
    update: {},
    create: {
      email: 'admin@bangkokelectronics.com',
      password: hashedPassword,
      name: 'Bangkok Electronics Admin',
      role: UserRole.STORE_ADMIN,
      storeId: bangkokElectronics.id,
      isActive: true,
    },
  });

  const fashionHubManager = await prisma.user.upsert({
    where: { email: 'manager@fashionhub.com' },
    update: {},
    create: {
      email: 'manager@fashionhub.com',
      password: hashedPassword,
      name: 'Fashion Hub Manager',
      role: UserRole.STORE_ADMIN,
      storeId: fashionHub.id,
      isActive: true,
    },
  });

  const sportZoneStaff = await prisma.user.upsert({
    where: { email: 'staff@sportzone.co.th' },
    update: {},
    create: {
      email: 'staff@sportzone.co.th',
      password: hashedPassword,
      name: 'Sport Zone Staff',
      role: UserRole.STORE_STAFF,
      storeId: sportZone.id,
      isActive: true,
    },
  });

  const chiangMaiTechSales = await prisma.user.upsert({
    where: { email: 'sales@chiangmaitech.com' },
    update: {},
    create: {
      email: 'sales@chiangmaitech.com',
      password: hashedPassword,
      name: 'Chiang Mai Tech Sales',
      role: UserRole.SALE,
      storeId: chiangMaiTech.id,
      isActive: true,
    },
  });

  // Create additional admin user
  const systemAdmin2 = await prisma.user.upsert({
    where: { email: 'admin2@interlink.local' },
    update: {},
    create: {
      email: 'admin2@interlink.local',
      password: hashedPassword,
      name: 'System Admin 2',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log('✅ Created 5 store users with different roles');

  // Create Comprehensive Store-Brand Entitlements
  const entitlements = [
    // Bangkok Electronics - Apple & Samsung & Sony
    { storeId: bangkokElectronics.id, brandId: appleBrand.id, pricingMode: PricingMode.CENTRAL, active: true },
    { storeId: bangkokElectronics.id, brandId: samsungBrand.id, pricingMode: PricingMode.CENTRAL, active: true },
    { storeId: bangkokElectronics.id, brandId: sonyBrand.id, pricingMode: PricingMode.STORE, active: true },
    
    // Fashion Hub - Nike & Adidas
    { storeId: fashionHub.id, brandId: nikeBrand.id, pricingMode: PricingMode.STORE, active: true },
    { storeId: fashionHub.id, brandId: adidasBrand.id, pricingMode: PricingMode.STORE, active: true },
    
    // Sport Zone - Nike & Adidas
    { storeId: sportZone.id, brandId: nikeBrand.id, pricingMode: PricingMode.CENTRAL, active: true },
    { storeId: sportZone.id, brandId: adidasBrand.id, pricingMode: PricingMode.CENTRAL, active: true },
    
    // Chiang Mai Tech - Apple & Samsung (with future effective date)
    { storeId: chiangMaiTech.id, brandId: appleBrand.id, pricingMode: PricingMode.CENTRAL, active: true },
    { storeId: chiangMaiTech.id, brandId: samsungBrand.id, pricingMode: PricingMode.STORE, active: false }, // Future effective date
    
    // Suspended store - should have an expired entitlement
    { storeId: suspendedStore.id, brandId: appleBrand.id, pricingMode: PricingMode.CENTRAL, active: false }, // Expired
  ];

  for (const entitlement of entitlements) {
    const effectiveFrom = entitlement.active ? new Date() : new Date('2025-02-01'); // Future date for inactive
    const effectiveTo = entitlement.active ? null : new Date('2024-12-31'); // Past date for expired

    await prisma.storeBrandEntitlement.upsert({
      where: { 
        storeId_brandId: {
          storeId: entitlement.storeId,
          brandId: entitlement.brandId,
        }
      },
      update: {},
      create: {
        storeId: entitlement.storeId,
        brandId: entitlement.brandId,
        pricingMode: entitlement.pricingMode,
        effectiveFrom,
        effectiveTo,
      },
    });
  }

  console.log('✅ Created 10 store-brand entitlements');

  // 🆕 Create Store Product Permissions for different scenarios
  const productPermissions = [
    // Bangkok Electronics can create Apple products (requires approval)
    {
      storeId: bangkokElectronics.id,
      brandId: appleBrand.id,
      canCreateProducts: true,
      requiresApproval: true,
      maxProductsPerMonth: 20,
      allowedCategories: ['Electronics', 'Smartphones', 'Tablets', 'Computers'],
      pricingRules: { minMarkup: 5, maxMarkup: 50, minPrice: 1000, maxPrice: 100000 },
    },
    
    // Bangkok Electronics can create Samsung products (no approval needed)
    {
      storeId: bangkokElectronics.id,
      brandId: samsungBrand.id,
      canCreateProducts: true,
      requiresApproval: false,
      maxProductsPerMonth: 15,
      allowedCategories: ['Electronics', 'Smartphones', 'TVs', 'Appliances'],
      pricingRules: { minMarkup: 10, maxMarkup: 60, minPrice: 500, maxPrice: 80000 },
    },
    
    // Fashion Hub can create Nike products (requires approval)
    {
      storeId: fashionHub.id,
      brandId: nikeBrand.id,
      canCreateProducts: true,
      requiresApproval: true,
      maxProductsPerMonth: 25,
      allowedCategories: ['Fashion', 'Footwear', 'Sportswear', 'Accessories'],
      pricingRules: { minMarkup: 20, maxMarkup: 100, minPrice: 500, maxPrice: 15000 },
    },
    
    // Sport Zone cannot create products (testing restriction)
    {
      storeId: sportZone.id,
      brandId: nikeBrand.id,
      canCreateProducts: false,
      requiresApproval: true,
      maxProductsPerMonth: 0,
      allowedCategories: [],
      pricingRules: { minMarkup: 0, maxMarkup: 0, minPrice: 0, maxPrice: 0 },
    },
    
    // Chiang Mai Tech has unlimited product creation
    {
      storeId: chiangMaiTech.id,
      brandId: appleBrand.id,
      canCreateProducts: true,
      requiresApproval: false,
      maxProductsPerMonth: null, // Unlimited
      allowedCategories: ['Electronics', 'Gadgets', 'Accessories', 'Services'],
      pricingRules: { minMarkup: 5, maxMarkup: 200, minPrice: 100, maxPrice: 200000 },
    },
  ];

  for (const permission of productPermissions) {
    await prisma.storeProductPermission.upsert({
      where: {
        storeId_brandId: {
          storeId: permission.storeId,
          brandId: permission.brandId,
        }
      },
      update: {},
      create: {
        storeId: permission.storeId,
        brandId: permission.brandId,
        canCreateProducts: permission.canCreateProducts,
        requiresApproval: permission.requiresApproval,
        maxProductsPerMonth: permission.maxProductsPerMonth,
        allowedCategories: permission.allowedCategories,
        pricingRules: permission.pricingRules,
        effectiveFrom: new Date(),
        createdBy: adminUser.id,
      },
    });
  }

  console.log('✅ Created 5 store product permissions');

  // Create Comprehensive Product Catalog
  const productCatalog = [
    // Apple Products
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      sku: 'APL-IPH15P-128-TIT',
      description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system',
      brandId: appleBrand.id,
      category: 'Smartphones',
      price: 35900,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/iphone15pro-titanium.jpg', 'https://example.com/iphone15pro-camera.jpg'],
      attributes: {
        processor: 'A17 Pro Chip',
        storage: '128GB',
        color: 'Natural Titanium',
        display: '6.1-inch Super Retina XDR',
        camera: '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
        warranty: '1 Year Apple Care'
      }
    },
    {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      sku: 'APL-IPH15PM-256-BLU',
      description: 'The ultimate iPhone with largest display and longest battery life',
      brandId: appleBrand.id,
      category: 'Smartphones',
      price: 42900,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/iphone15promax-blue.jpg'],
      attributes: {
        processor: 'A17 Pro Chip',
        storage: '256GB',
        color: 'Blue Titanium',
        display: '6.7-inch Super Retina XDR',
        battery: 'Up to 29 hours video playback'
      }
    },
    {
      name: 'MacBook Air M3',
      slug: 'macbook-air-m3',
      sku: 'APL-MBA-M3-256-SLV',
      description: 'Ultra-thin and powerful laptop with M3 chip',
      brandId: appleBrand.id,
      category: 'Laptops',
      price: 39900,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/macbook-air-m3-silver.jpg'],
      attributes: {
        processor: 'Apple M3 8-core CPU',
        ram: '8GB Unified Memory',
        storage: '256GB SSD',
        display: '13.6-inch Liquid Retina',
        color: 'Silver',
        weight: '1.24 kg'
      }
    },
    {
      name: 'iPad Pro 12.9"',
      slug: 'ipad-pro-12-9',
      sku: 'APL-IPD-PRO-129-512',
      description: 'Most advanced iPad with M2 chip and Liquid Retina XDR display',
      brandId: appleBrand.id,
      category: 'Tablets',
      price: 32900,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/ipad-pro-12-9.jpg'],
      attributes: {
        processor: 'Apple M2 chip',
        storage: '512GB',
        display: '12.9-inch Liquid Retina XDR',
        connectivity: 'Wi-Fi 6E + 5G',
        color: 'Space Gray'
      }
    },

    // Samsung Products
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      sku: 'SAM-GS24U-256-TIT',
      description: 'Premium Android flagship with S Pen and AI features',
      brandId: samsungBrand.id,
      category: 'Smartphones',
      price: 38900,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/galaxy-s24-ultra-titanium.jpg'],
      attributes: {
        processor: 'Snapdragon 8 Gen 3',
        storage: '256GB',
        ram: '12GB',
        display: '6.8-inch Dynamic AMOLED 2X',
        camera: '200MP Main + Ultra Wide + Telephoto',
        color: 'Titanium Gray',
        spen: 'Included'
      }
    },
    {
      name: 'Samsung Galaxy Z Fold5',
      slug: 'samsung-galaxy-z-fold5',
      sku: 'SAM-GZF5-512-PHB',
      description: 'Revolutionary foldable smartphone with dual screens',
      brandId: samsungBrand.id,
      category: 'Smartphones',
      price: 52900,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/galaxy-z-fold5-phantom-black.jpg'],
      attributes: {
        processor: 'Snapdragon 8 Gen 2',
        storage: '512GB',
        ram: '12GB',
        mainDisplay: '7.6-inch Dynamic AMOLED 2X',
        coverDisplay: '6.2-inch Dynamic AMOLED 2X',
        color: 'Phantom Black'
      }
    },
    {
      name: 'Samsung 65" Neo QLED 8K',
      slug: 'samsung-65-neo-qled-8k',
      sku: 'SAM-TV-65NEO8K-001',
      description: 'Premium 8K Smart TV with Quantum Matrix Technology',
      brandId: samsungBrand.id,
      category: 'TVs',
      price: 79900,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/samsung-neo-qled-8k-65.jpg'],
      attributes: {
        size: '65 inch',
        resolution: '8K (7680 x 4320)',
        technology: 'Neo QLED with Quantum Matrix',
        smartOS: 'Tizen',
        hdr: 'HDR10+',
        gaming: '4K 120Hz VRR'
      }
    },

    // Nike Products
    {
      name: 'Nike Air Max 270',
      slug: 'nike-air-max-270',
      sku: 'NK-AM270-BLK-42',
      description: 'Lifestyle sneaker with large visible Air unit',
      brandId: nikeBrand.id,
      category: 'Footwear',
      price: 4500,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/nike-air-max-270-black.jpg'],
      attributes: {
        type: 'Lifestyle Sneakers',
        color: 'Black/White',
        size: '42 EU',
        technology: 'Air Max 270 cushioning',
        material: 'Mesh upper with synthetic overlays',
        gender: 'Unisex'
      }
    },
    {
      name: 'Nike Dri-FIT Running Shirt',
      slug: 'nike-dri-fit-running-shirt',
      sku: 'NK-DF-RUN-BLU-L',
      description: 'Breathable running shirt with moisture-wicking technology',
      brandId: nikeBrand.id,
      category: 'Sportswear',
      price: 1200,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/nike-dri-fit-running-blue.jpg'],
      attributes: {
        type: 'Running Shirt',
        size: 'L',
        color: 'Royal Blue',
        technology: 'Dri-FIT moisture wicking',
        material: '100% Polyester',
        fit: 'Standard fit'
      }
    },

    // Adidas Products
    {
      name: 'Adidas Ultraboost 22',
      slug: 'adidas-ultraboost-22',
      sku: 'ADS-UB22-WHT-43',
      description: 'Premium running shoe with BOOST midsole technology',
      brandId: adidasBrand.id,
      category: 'Footwear',
      price: 5200,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/adidas-ultraboost-22-white.jpg'],
      attributes: {
        type: 'Running Shoes',
        color: 'Cloud White',
        size: '43 1/3 EU',
        technology: 'BOOST midsole',
        upper: 'Primeknit+',
        gender: 'Unisex'
      }
    },
    {
      name: 'Adidas Originals Trefoil Hoodie',
      slug: 'adidas-originals-trefoil-hoodie',
      sku: 'ADS-TF-HOOD-GRY-M',
      description: 'Classic hoodie with iconic Trefoil logo',
      brandId: adidasBrand.id,
      category: 'Sportswear',
      price: 2800,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/adidas-trefoil-hoodie-grey.jpg'],
      attributes: {
        type: 'Hoodie',
        size: 'M',
        color: 'Medium Grey Heather',
        logo: 'Trefoil logo',
        material: '70% Cotton, 30% Polyester',
        fit: 'Regular fit'
      }
    },

    // Sony Products
    {
      name: 'Sony WH-1000XM5',
      slug: 'sony-wh-1000xm5',
      sku: 'SNY-WH1000XM5-BLK',
      description: 'Premium noise-canceling wireless headphones',
      brandId: sonyBrand.id,
      category: 'Audio',
      price: 12900,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/sony-wh-1000xm5-black.jpg'],
      attributes: {
        type: 'Over-ear Headphones',
        color: 'Black',
        noiseCanceling: 'Industry-leading ANC',
        batteryLife: '30 hours',
        connectivity: 'Bluetooth 5.2, 3.5mm',
        features: 'Touch controls, Voice assistant'
      }
    },
    {
      name: 'Sony PlayStation 5',
      slug: 'sony-playstation-5',
      sku: 'SNY-PS5-STD-825',
      description: 'Next-generation gaming console with 4K gaming',
      brandId: sonyBrand.id,
      category: 'Gaming',
      price: 17900,
      status: ProductStatus.ACTIVE,
      images: ['https://example.com/sony-ps5-console.jpg'],
      attributes: {
        type: 'Gaming Console',
        storage: '825GB SSD',
        resolution: '4K at 120fps',
        rayTracing: 'Hardware-accelerated',
        controller: 'DualSense wireless',
        backwardCompatibility: 'PS4 games'
      }
    },

    // Some draft/inactive products for testing
    {
      name: 'Apple Vision Pro',
      slug: 'apple-vision-pro',
      sku: 'APL-VP-256-001',
      description: 'Revolutionary spatial computer (Coming Soon)',
      brandId: appleBrand.id,
      category: 'Wearables',
      price: 119900,
      status: ProductStatus.DRAFT,
      images: ['https://example.com/apple-vision-pro.jpg'],
      attributes: {
        type: 'Mixed Reality Headset',
        display: 'Micro-OLED',
        processor: 'M2 + R1 chips',
        storage: '256GB',
        status: 'Pre-order'
      }
    }
  ];

  // Create all products from catalog
  const createdProducts = [];
  for (const productData of productCatalog) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });
    createdProducts.push(product);
  }

  console.log(`✅ Created ${createdProducts.length} products in catalog`);

  // Create diverse stock data for different stores and products
  const stockData = [
    // Bangkok Electronics (Electronics Store) - Apple, Samsung, Sony products
    { storeId: bangkokElectronics.id, productSlug: 'iphone-15-pro', availableQty: 15, reserved: 2, markup: 1.0 },
    { storeId: bangkokElectronics.id, productSlug: 'iphone-15-pro-max', availableQty: 8, reserved: 1, markup: 1.0 },
    { storeId: bangkokElectronics.id, productSlug: 'macbook-air-m3', availableQty: 5, reserved: 0, markup: 1.0 },
    { storeId: bangkokElectronics.id, productSlug: 'ipad-pro-12-9', availableQty: 12, reserved: 1, markup: 1.0 },
    { storeId: bangkokElectronics.id, productSlug: 'samsung-galaxy-s24-ultra', availableQty: 20, reserved: 3, markup: 1.0 },
    { storeId: bangkokElectronics.id, productSlug: 'samsung-galaxy-z-fold5', availableQty: 3, reserved: 0, markup: 1.0 },
    { storeId: bangkokElectronics.id, productSlug: 'samsung-65-neo-qled-8k', availableQty: 2, reserved: 0, markup: 1.0 },
    { storeId: bangkokElectronics.id, productSlug: 'sony-wh-1000xm5', availableQty: 25, reserved: 5, markup: 1.15 }, // Store pricing
    { storeId: bangkokElectronics.id, productSlug: 'sony-playstation-5', availableQty: 8, reserved: 2, markup: 1.15 },
    
    // Fashion Hub - Nike, Adidas products
    { storeId: fashionHub.id, productSlug: 'nike-air-max-270', availableQty: 30, reserved: 8, markup: 1.25 }, // Store pricing
    { storeId: fashionHub.id, productSlug: 'nike-dri-fit-running-shirt', availableQty: 50, reserved: 12, markup: 1.30 },
    { storeId: fashionHub.id, productSlug: 'adidas-ultraboost-22', availableQty: 25, reserved: 6, markup: 1.20 },
    { storeId: fashionHub.id, productSlug: 'adidas-originals-trefoil-hoodie', availableQty: 40, reserved: 10, markup: 1.35 },
    
    // Sport Zone - Nike, Adidas products (central pricing)
    { storeId: sportZone.id, productSlug: 'nike-air-max-270', availableQty: 20, reserved: 5, markup: 1.0 },
    { storeId: sportZone.id, productSlug: 'nike-dri-fit-running-shirt', availableQty: 35, reserved: 8, markup: 1.0 },
    { storeId: sportZone.id, productSlug: 'adidas-ultraboost-22', availableQty: 18, reserved: 3, markup: 1.0 },
    { storeId: sportZone.id, productSlug: 'adidas-originals-trefoil-hoodie', availableQty: 28, reserved: 7, markup: 1.0 },
    
    // Chiang Mai Tech - Apple, Samsung products
    { storeId: chiangMaiTech.id, productSlug: 'iphone-15-pro', availableQty: 10, reserved: 1, markup: 1.0 },
    { storeId: chiangMaiTech.id, productSlug: 'macbook-air-m3', availableQty: 8, reserved: 2, markup: 1.0 },
    { storeId: chiangMaiTech.id, productSlug: 'samsung-galaxy-s24-ultra', availableQty: 15, reserved: 2, markup: 1.10 }, // Store pricing
  ];

  for (const stock of stockData) {
    // Find the product by slug
    const product = createdProducts.find(p => p.slug === stock.productSlug);
    if (!product) continue;

    const existingStock = await prisma.storeStock.findFirst({
      where: {
        storeId: stock.storeId,
        productId: product.id,
        variantId: null,
      }
    });

    if (!existingStock) {
      const centralPrice = Number(product.price);
      const storePrice = stock.markup > 1.0 ? Math.round(centralPrice * stock.markup) : null;

      await prisma.storeStock.create({
        data: {
          storeId: stock.storeId,
          productId: product.id,
          availableQty: stock.availableQty,
          reservedQty: stock.reserved,
          soldQty: Math.floor(Math.random() * 20), // Random sold quantity for demo
          priceCentral: centralPrice,
          priceStore: storePrice,
        },
      });
    }
  }

  console.log('✅ Created comprehensive stock data for all stores');

  // Create Sample Customer
  const sampleCustomer = await prisma.customer.upsert({
    where: { id: 'sample-customer-id' },
    update: {},
    create: {
      id: 'sample-customer-id',
      name: 'John Doe', 
      phone: '081-234-5678',
      email: 'customer@example.com',
      address: {
        street: '456 Customer Street',
        city: 'Bangkok',
        postalCode: '10120',
        country: 'TH'
      },
      isGuest: true,
    },
  });

  console.log('✅ Created sample customer');

  console.log('\n🎉 Development seed data created successfully!');
  console.log('\n📝 Login Credentials:');
  console.log('👤 Admin: admin@interlink.local / admin123');
  console.log('🏪 Store: store@interlink.local / admin123');
  console.log('\n🌐 Services:');
  console.log('📊 Adminer (DB UI): http://localhost:8080');
  console.log('✉️ MailHog: http://localhost:8025');
  console.log('🔍 Prisma Studio: http://localhost:5555');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });