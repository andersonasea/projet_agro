import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { isValidCongolesePhone, normalizePhone } from "@/lib/phone";
import { createSession } from "@/lib/session";

const bodySchema = z.object({
  phone: z.string().min(8),
  code: z.string().length(6),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const phone = normalizePhone(parsed.data.phone);
  if (!isValidCongolesePhone(phone)) {
    return NextResponse.json({ error: "Numéro invalide" }, { status: 400 });
  }

  const otp = await prisma.otpCode.findFirst({
    where: {
      phone,
      code: parsed.data.code,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    return NextResponse.json({ error: "Code OTP incorrect ou expiré" }, { status: 401 });
  }

  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({ data: { phone } });
  }

  await createSession(user.id);

  return NextResponse.json({
    ok: true,
    needsOnboarding: !user.role || !user.name,
    role: user.role,
  });
}
