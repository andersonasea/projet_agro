import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  if (order.buyerId !== user.id) {
    return NextResponse.json({ error: "Action non autorisée" }, { status: 403 });
  }

  if (order.status !== "PENDING_PAYMENT") {
    return NextResponse.json({ error: "Commande déjà payée ou clôturée" }, { status: 400 });
  }

  const paymentRef = `MM-${Date.now()}`;

  const updated = await prisma.order.update({
    where: { id },
    data: {
      status: "PAID",
      paymentRef,
    },
  });

  return NextResponse.json({
    ok: true,
    order: updated,
    message:
      "Paiement simulé (MVP). Brancher ici l'API Mobile Money en production.",
  });
}
