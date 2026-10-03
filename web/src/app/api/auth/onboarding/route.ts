import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Role } from "@/lib/types";

const bodySchema = z.object({
  name: z.string().min(2).max(80),
  role: z.enum(["BUYER", "PRODUCER"]),
  city: z.string().min(2).max(80),
  province: z.string().min(2).max(80).optional(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Profil incomplet" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      role: parsed.data.role as Role,
      city: parsed.data.city,
      province: parsed.data.province,
    },
  });

  return NextResponse.json({ ok: true, user: updated });
}
