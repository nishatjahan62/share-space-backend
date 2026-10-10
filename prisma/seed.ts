import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

// Seeding uses the direct (non-pooled) connection
const adapter = new PrismaPg({
  connectionString: (process.env.DIRECT_URL ?? process.env.DATABASE_URL) as string,
});
const prisma = new PrismaClient({ adapter });

const upsertUser = (name: string, email: string, role: "ADMIN" | "OWNER" | "TENANT", passwordHash: string) =>
  prisma.user.upsert({
    where: { email },
    update: {},
    create: { name, email, passwordHash, role, isVerified: role !== "TENANT" },
  });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await upsertUser("Admin", "admin@sharespace.com", "ADMIN", passwordHash);
  const owner = await upsertUser("Owner One", "owner@sharespace.com", "OWNER", passwordHash);
  const tenant1 = await upsertUser("Tenant One", "tenant1@sharespace.com", "TENANT", passwordHash);
  const tenant2 = await upsertUser("Tenant Two", "tenant2@sharespace.com", "TENANT", passwordHash);

  // Only create sample data once, so re-running the seed doesn't duplicate it
  const existingProperty = await prisma.property.findFirst({ where: { ownerId: owner.id } });
  if (!existingProperty) {
    const property = await prisma.property.create({
      data: {
        ownerId: owner.id,
        title: "Green Villa",
        address: "12 Lake Road",
        city: "Chattogram",
        description: "Shared flat near university",
      },
    });

    await prisma.room.createMany({
      data: [
        { propertyId: property.id, roomNumber: "A1", rentAmount: 8000, capacity: 2 },
        { propertyId: property.id, roomNumber: "A2", rentAmount: 6000, capacity: 1 },
      ],
    });
  }

  for (const [user, tags, min, max] of [
    [tenant1, ["non_smoker", "pet_friendly"], 5000, 9000],
    [tenant2, ["non_smoker"], 6000, 10000],
  ] as const) {
    await prisma.roommateProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, budgetMin: min, budgetMax: max, preferredCity: "Chattogram", lifestyleTags: [...tags] },
    });
  }

  console.log("Seed complete. Demo logins (password: password123):");
  console.log({ admin: admin.email, owner: owner.email, tenants: [tenant1.email, tenant2.email] });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());