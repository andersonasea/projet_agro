import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  const listings = await prisma.listing.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { seller: { select: { name: true, city: true } } },
  });

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-600 p-8 text-white">
        <h1 className="text-3xl font-bold">Connecter producteurs et acheteurs</h1>
        <p className="mt-2 max-w-2xl text-emerald-50">
          MVP web-first pour réduire les pertes de produits périssables en RDC, avec paiement
          intégré et suivi de commande.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/produits" className="rounded-full bg-white px-4 py-2 text-emerald-800">
            Voir les produits
          </Link>
          <Link href="/connexion" className="rounded-full border border-white/70 px-4 py-2">
            Se connecter
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Dernières annonces</h2>
          <Link href="/produits" className="text-sm text-emerald-800 underline">
            Tout voir
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/produits/${listing.id}`}
              className="rounded-2xl border bg-white p-4 shadow-sm transition hover:border-emerald-300"
            >
              <p className="text-xs uppercase tracking-wide text-emerald-700">{listing.productType}</p>
              <h3 className="mt-1 font-medium">{listing.title}</h3>
              <p className="mt-2 text-sm text-stone-600">
                {listing.quantity} {listing.unit} · {listing.city}
              </p>
              <p className="mt-2 font-semibold text-emerald-800">{listing.priceUsd.toFixed(2)} USD</p>
            </Link>
          ))}
          {listings.length === 0 && (
            <p className="text-stone-600">Aucune annonce pour le moment. Lance le seed ou publie une offre.</p>
          )}
        </div>
      </section>
    </div>
  );
}
