import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      seller: { select: { id: true, name: true, city: true, phone: true } },
    },
  });

  if (!listing || !listing.active) {
    return NextResponse.json({ error: "Annonce introuvable" }, { status: 404 });
  }

  return NextResponse.json({ listing });
}
