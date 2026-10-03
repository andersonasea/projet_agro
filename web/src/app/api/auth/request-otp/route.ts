import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { isValidCongolesePhone, normalizePhone } from "@/lib/phone";

const bodySchema = z.object({
  phone: z.string().min(8),
});

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Numéro invalide" }, { status: 400 });
  }

  const phone = normalizePhone(parsed.data.phone);
  if (!isValidCongolesePhone(phone)) {
    return NextResponse.json(
      { error: "Utilise un numéro RDC valide (+243...)" },
      { status: 400 },
    );
  }

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.otpCode.create({
    data: { phone, code, expiresAt },
  });

  const payload: { ok: true; devCode?: string } = { ok: true };
  if (process.env.NODE_ENV === "development") {
    payload.devCode = code;
  }

  return NextResponse.json(payload);
}
