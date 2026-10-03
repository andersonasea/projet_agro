import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { computeCommission } from "@/lib/commission";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  listingId: z.string().min(1),
  quantity: z.number().positive(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: {
      OR: [{ buyerId: user.id }, { sellerId: user.id }],
    },
    include: {
      listing: true,
      buyer: { select: { id: true, name: true, phone: true } },
      seller: { select: { id: true, name: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "BUYER") {
    return NextResponse.json({ error: "Accès réservé aux acheteurs" }, { status: 403 });
  }

  const json = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Commande invalide" }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: parsed.data.listingId },
  });

  if (!listing || !listing.active) {
    return NextResponse.json({ error: "Annonce indisponible" }, { status: 404 });
  }

  if (listing.quantity < parsed.data.quantity) {
    return NextResponse.json({ error: "Quantité demandée trop élevée" }, { status: 400 });
  }

  if (listing.sellerId === user.id) {
    return NextResponse.json({ error: "Impossible d'acheter sa propre annonce" }, { status: 400 });
  }

  const totalUsd = listing.priceUsd * parsed.data.quantity;
  const commissionUsd = computeCommission(totalUsd);

  const order = await prisma.order.create({
    data: {
      listingId: listing.id,
      buyerId: user.id,
      sellerId: listing.sellerId,
      quantity: parsed.data.quantity,
      totalUsd,
      commissionUsd,
      status: "PENDING_PAYMENT",
    },
  });

  return NextResponse.json({ order }, { status: 201 });
}
