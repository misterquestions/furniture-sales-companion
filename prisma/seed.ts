import "dotenv/config";

import {
  PrismaClient,
  DiscountApplyOn,
  DiscountMode,
} from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import {
  fabrics as mockFabrics,
  products as mockProducts,
  providers as mockProviders,
} from "../data/mockCatalog";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Unable to seed database.");
}

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const discountSeeds = [
  {
    id: "discount-20",
    label: "Con 20% de descuento",
    percentage: 0.2,
    applyOn: DiscountApplyOn.BASE,
    mode: DiscountMode.DISCOUNT,
    description: "Descuento comercial habitual del 20% sobre lista.",
    priority: 1,
  },
  {
    id: "discount-20-10",
    label: "20% + 10% adicional",
    percentage: 0.1,
    applyOn: DiscountApplyOn.RUNNING,
    mode: DiscountMode.DISCOUNT,
    description: "Aplicado sobre el precio ya descontado al 20%.",
    priority: 2,
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}

async function clearCatalog() {
  await prisma.productFabric.deleteMany();
  await prisma.inventorySnapshot.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.discountRule.deleteMany();
  await prisma.product.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.fabric.deleteMany();
}

async function seedProviders() {
  for (const provider of mockProviders) {
    await prisma.provider.create({
      data: {
        id: provider.id,
        name: provider.name,
        contactName: provider.contactName,
        email: provider.email,
        phone: provider.phone,
        leadTimeWeeks: provider.leadTimeWeeks,
        notes: provider.notes,
        rating: provider.rating,
      },
    });
  }
}

async function seedFabrics() {
  for (const fabric of mockFabrics) {
    await prisma.fabric.create({
      data: {
        id: fabric.id,
        name: fabric.name,
        colorHex: fabric.colorHex,
        description: fabric.description,
      },
    });
  }
}

async function seedProducts() {
  for (const product of mockProducts) {
    const slug = slugify(product.name) || product.id;
    const created = await prisma.product.create({
      data: {
        id: product.id,
        slug,
        name: product.name,
        category: product.category,
        subtype: product.subtype,
        description: product.description,
        priceList: product.priceList,
        isExhibition: product.isExhibition,
        imageUrl: product.imageUrl,
        providerId: product.providerId,
      },
    });

    if (product.inventory) {
      await prisma.inventorySnapshot.create({
        data: {
          productId: created.id,
          onHand: product.inventory.onHand,
          incoming: product.inventory.incoming,
          leadTimeWeeks: product.inventory.leadTimeWeeks,
          notes: product.inventory.notes,
        },
      });
    }

    if (product.tags && product.tags.length > 0) {
      await prisma.productTag.createMany({
        data: product.tags.map((tag) => ({
          productId: created.id,
          value: tag,
        })),
      });
    }

    if (product.fabrics.length > 0) {
      await prisma.productFabric.createMany({
        data: product.fabrics.map((fabricId, index) => ({
          productId: created.id,
          fabricId,
          isPrimary: index === 0,
        })),
      });
    }
  }
}

async function seedDiscounts() {
  for (const rule of discountSeeds) {
    await prisma.discountRule.create({ data: rule });
  }
}

async function main() {
  await clearCatalog();
  await seedFabrics();
  await seedProviders();
  await seedProducts();
  await seedDiscounts();
}

main()
  .then(() => {
    console.log("Catalog seed complete ✔");
  })
  .catch((error) => {
    console.error("Catalog seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
