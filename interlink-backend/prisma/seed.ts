import { PrismaClient, UserRole, StoreStatus, SubscriptionStatus } from '@prisma/client';
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

  // Create Sample Brands
  const techBrand = await prisma.brand.upsert({
    where: { slug: 'tech-gadgets' },
    update: {},
    create: {
      name: 'Tech Gadgets',
      slug: 'tech-gadgets',
      description: 'Latest technology and gadgets',
      isActive: true,
    },
  });

  const fashionBrand = await prisma.brand.upsert({
    where: { slug: 'fashion-style' },
    update: {},
    create: {
      name: 'Fashion Style',
      slug: 'fashion-style', 
      description: 'Trendy fashion and accessories',
      isActive: true,
    },
  });

  console.log('✅ Created brands:', techBrand.name, fashionBrand.name);

  // Create Sample Store
  const sampleStore = await prisma.store.upsert({
    where: { slug: 'demo-store' },
    update: {},
    create: {
      name: 'Demo Store',
      slug: 'demo-store',
      description: 'Sample store for development and testing',
      email: 'store@interlink.local',
      phone: '02-123-4567',
      address: {
        street: '123 Demo Street',
        city: 'Bangkok',
        postalCode: '10110',
        country: 'TH'
      },
      status: StoreStatus.ACTIVE,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
    },
  });

  console.log('✅ Created store:', sampleStore.name);

  // Create Store Admin User
  const storeUser = await prisma.user.upsert({
    where: { email: 'store@interlink.local' },
    update: {},
    create: {
      email: 'store@interlink.local',
      password: hashedPassword,
      name: 'Store Manager',
      role: UserRole.STORE_ADMIN,
      storeId: sampleStore.id,
      isActive: true,
    },
  });

  console.log('✅ Created store user:', storeUser.email);

  // Create Store-Brand Entitlements
  const techEntitlement = await prisma.storeBrandEntitlement.upsert({
    where: { 
      storeId_brandId: {
        storeId: sampleStore.id,
        brandId: techBrand.id,
      }
    },
    update: {},
    create: {
      storeId: sampleStore.id,
      brandId: techBrand.id,
      pricingMode: 'CENTRAL',
      effectiveFrom: new Date(),
    },
  });

  const fashionEntitlement = await prisma.storeBrandEntitlement.upsert({
    where: { 
      storeId_brandId: {
        storeId: sampleStore.id,
        brandId: fashionBrand.id,
      }
    },
    update: {},
    create: {
      storeId: sampleStore.id,
      brandId: fashionBrand.id,
      pricingMode: 'STORE',
      effectiveFrom: new Date(),
    },
  });

  console.log('✅ Created store entitlements');

  // 🆕 Create Store Product Permissions
  const productPermission = await prisma.storeProductPermission.upsert({
    where: {
      storeId_brandId: {
        storeId: sampleStore.id,
        brandId: techBrand.id,
      }
    },
    update: {},
    create: {
      storeId: sampleStore.id,
      brandId: techBrand.id,
      canCreateProducts: true,
      requiresApproval: true,
      maxProductsPerMonth: 10,
      allowedCategories: ['Electronics', 'Gadgets', 'Accessories'],
      pricingRules: {
        minMarkup: 10, // 10% minimum markup
        maxMarkup: 100, // 100% maximum markup
        minPrice: 100, // ฿100 minimum price
        maxPrice: 50000 // ฿50,000 maximum price
      },
      effectiveFrom: new Date(),
      createdBy: adminUser.id,
    },
  });

  console.log('✅ Created store product permission');

  // Create Sample Products
  const sampleProducts = [
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      sku: 'IP15P-001',
      description: 'Latest iPhone with Pro features',
      brandId: techBrand.id,
      category: 'Electronics',
      price: 35000,
      images: ['https://example.com/iphone15pro.jpg'],
      attributes: {
        storage: '128GB',
        color: 'Natural Titanium',
        warranty: '1 Year'
      }
    },
    {
      name: 'MacBook Air M3',
      slug: 'macbook-air-m3',
      sku: 'MBA-M3-001',
      description: 'Ultra-thin laptop with M3 chip',
      brandId: techBrand.id,
      category: 'Electronics',
      price: 42000,
      images: ['https://example.com/macbookairm3.jpg'],
      attributes: {
        processor: 'Apple M3',
        ram: '8GB',
        storage: '256GB SSD'
      }
    },
    {
      name: 'Designer Handbag',
      slug: 'designer-handbag',
      sku: 'BAG-001',
      description: 'Luxury leather handbag',
      brandId: fashionBrand.id,
      category: 'Fashion',
      price: 2500,
      images: ['https://example.com/handbag.jpg'],
      attributes: {
        material: 'Genuine Leather',
        color: 'Black',
        size: 'Medium'
      }
    }
  ];

  for (const productData of sampleProducts) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });

    // Create stock for the sample store
    const existingStock = await prisma.storeStock.findFirst({
      where: {
        storeId: sampleStore.id,
        productId: product.id,
        variantId: null,
      }
    });

    if (!existingStock) {
      await prisma.storeStock.create({
        data: {
          storeId: sampleStore.id,
          productId: product.id,
          availableQty: 10,
          priceCentral: product.price,
          priceStore: productData.brandId === fashionBrand.id ? Math.round(Number(product.price) * 1.2) : null, // 20% markup for fashion
        },
      });
    }

    console.log(`✅ Created product: ${product.name} with stock`);
  }

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