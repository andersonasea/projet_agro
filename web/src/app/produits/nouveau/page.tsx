import { ListingForm } from "@/components/listing-form";
import { requireRole } from "@/lib/auth";

export default async function NouvelleAnnoncePage() {
  await requireRole(["PRODUCER"]);
  return <ListingForm />;
}
