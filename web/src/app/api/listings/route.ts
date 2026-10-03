import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  title: z.string().min(3).max(120),
  productType: z.string().min(2).max(60),
  quantity: z.number().positive(),
  unit: z.string().min(1).max(20),
  priceUsd: z.number().positive(),
  city: z.string().min(2).max(80),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const city = searchParams.get("city")?.trim();

  const listings = await prisma.listing.findMany({
    where: {
      active: true,
      ...(city ? { city: { contains: city } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { productType: { contains: q } },
              { description: { contains: q } },
            ],
          }
        : {}),
    },
    include: {
      seller: { select: { id: true, name: true, city: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ listings });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "PRODUCER") {
    return NextResponse.json({ error: "Accès réservé aux producteurs" }, { status: 403 });
  }

  const json = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Annonce invalide" }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: {
      ...parsed.data,
      imageUrl: parsed.data.imageUrl || null,
      sellerId: user.id,
    },
  });

  return NextResponse.json({ listing }, { status: 201 });
}
