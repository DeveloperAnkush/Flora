/**
 * Seed script — populates MongoDB with admin user and default products
 *
 * Usage:
 *   1. Set MONGODB_URI and AUTH_SECRET in .env.local
 *   2. Run: npm run seed
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import mongoose from "mongoose";
import { hashPassword } from "../src/lib/auth";
import Product from "../src/models/Product";
import User from "../src/models/User";

const MONGODB_URI = process.env.MONGODB_URI;

const ADMIN_EMAIL = "admin@flora.com";
const ADMIN_PASSWORD = "Admin@6780";

async function seedAdmin() {
  const hashedPassword = await hashPassword(ADMIN_PASSWORD);
  await User.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    { email: ADMIN_EMAIL, password: hashedPassword },
    { upsert: true, returnDocument: "after" }
  );
  console.log(`Admin user ready: ${ADMIN_EMAIL}`);
}

async function seedProducts() {
  const existingCount = await Product.countDocuments();
  if (existingCount > 0) {
    console.log(`Database already has ${existingCount} products. Skipping product seed.`);
    return;
  }

  const filePath = resolve(process.cwd(), "src/data/products.json");
  const seedData = JSON.parse(readFileSync(filePath, "utf-8")) as {
    name: string;
    price: number;
  }[];

  await Product.insertMany(
    seedData.map((item) => ({ name: item.name, price: item.price }))
  );

  console.log(`Seeded ${seedData.length} products successfully.`);
}

async function seed() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set in environment variables.");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  await seedAdmin();
  await seedProducts();
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
