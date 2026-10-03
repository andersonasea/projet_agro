import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import type { Role } from "@/lib/types";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  return user;
}

export async function requireRole(roles: Role[]) {
  const user = await requireUser();
  if (!user.role) redirect("/onboarding");
  if (!roles.includes(user.role as Role)) redirect("/");
  return user;
}
