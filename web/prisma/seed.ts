import { PrismaClient } from "@prisma/client";
import { Role } from "../src/lib/types";

const prisma = new PrismaClient();

async function main() {
  const producer = await prisma.user.upsert({
    where: { phone: "+243900000001" },
    update: {},
    create: {
      phone: "+243900000001",
      name: "Jean Producteur",
      role: Role.PRODUCER,
      city: "Goma",
      province: "Nord-Kivu",
    },
  });

  const buyer = await prisma.user.upsert({
    where: { phone: "+243900000002" },
    update: {},
    create: {
      phone: "+243900000002",
      name: "Marie Acheteuse",
      role: Role.BUYER,
      city: "Goma",
      province: "Nord-Kivu",
    },
  });

  await prisma.user.upsert({
    where: { phone: "+243900000003" },
    update: {},
    create: {
      phone: "+243900000003",
      name: "Admin Agro",
      role: Role.ADMIN,
      city: "Kinshasa",
      province: "Kinshasa",
    },
  });

  const count = await prisma.listing.count();
  if (count === 0) {
    await prisma.listing.createMany({
      data: [
        {
          title: "Tomates fraîches",
          productType: "Légumes",
          quantity: 200,
          unit: "kg",
          priceUsd: 0.8,
          city: "Goma",
          description: "Récolte du jour, livraison locale possible.",
          sellerId: producer.id,
        },
        {
          title: "Bananes plantain",
          productType: "Fruits",
          quantity: 150,
          unit: "kg",
          priceUsd: 0.5,
          city: "Goma",
          description: "Qualité marché, disponible immédiatement.",
          sellerId: producer.id,
        },
      ],
    });
  }

  console.log("Seed OK:", { producer: producer.phone, buyer: buyer.phone });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
