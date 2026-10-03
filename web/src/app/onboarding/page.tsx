import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding-form";
import { requireUser } from "@/lib/auth";

export default async function OnboardingPage() {
  const user = await requireUser();
  if (user.role && user.name) redirect("/produits");

  return <OnboardingForm />;
}
