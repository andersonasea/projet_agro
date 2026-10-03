import Link from "next/link";
import { prisma } from "@/lib/db";

type Props = {
  searchParams: Promise<{ q?: string; city?: string }>;
};

export default async function ProduitsPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q?.trim();
  const city = params.city?.trim();

  const listings = await prisma.listing.findMany({
    where: {
      active: true,
      ...(city ? { city: { contains: city } } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { productType: { contains: q } },
              { description: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { seller: { select: { name: true, city: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Catalogue produits</h1>
        <p className="text-sm text-stone-600">Recherche par produit ou ville.</p>
      </div>

      <form className="grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-3">
        <input name="q" defaultValue={q} placeholder="Rechercher..." className="rounded-lg border px-3 py-2 sm:col-span-2" />
        <input name="city" defaultValue={city} placeholder="Ville" className="rounded-lg border px-3 py-2" />
        <button type="submit" className="rounded-lg bg-emerald-700 py-2 text-white sm:col-span-3">
          Filtrer
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {listings.map((listing) => (
          <Link key={listing.id} href={`/produits/${listing.id}`} className="rounded-2xl border bg-white p-4">
            <h2 className="font-medium">{listing.title}</h2>
            <p className="text-sm text-stone-600">
              {listing.productType} · {listing.city}
            </p>
            <p className="mt-2 text-emerald-800">{listing.priceUsd.toFixed(2)} USD / {listing.unit}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
