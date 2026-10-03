import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { OrderStatus } from "@/lib/types";

const bodySchema = z.object({
  status: z.enum([
    "PREPARING",
    "DELIVERED",
    "CONFIRMED",
    "DISPUTE",
    "CLOSED",
  ]),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const nextStatus = parsed.data.status as OrderStatus;
  const isBuyer = order.buyerId === user.id;
  const isSeller = order.sellerId === user.id;

  const allowed =
    (isSeller && nextStatus === "PREPARING" && order.status === "PAID") ||
    (isSeller && nextStatus === "DELIVERED" && order.status === "PREPARING") ||
    (isBuyer && nextStatus === "CONFIRMED" && order.status === "DELIVERED") ||
    (isBuyer && nextStatus === "DISPUTE" && ["DELIVERED", "PAID"].includes(order.status)) ||
    (isBuyer && nextStatus === "CLOSED" && order.status === "CONFIRMED") ||
    (isSeller && nextStatus === "CLOSED" && order.status === "CONFIRMED");

  if (!allowed && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Transition de statut non autorisée" }, { status: 403 });
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status: nextStatus },
  });

  return NextResponse.json({ order: updated });
}
