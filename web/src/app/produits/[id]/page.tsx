import { notFound } from "next/navigation";
import { CreateOrderForm } from "@/components/create-order-form";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export default async function ProduitDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { seller: { select: { id: true, name: true, city: true, phone: true } } },
  });

  if (!listing || !listing.active) notFound();

  const paidOrder =
    user &&
    (await prisma.order.findFirst({
      where: {
        listingId: listing.id,
        buyerId: user.id,
        status: { in: ["PAID", "PREPARING", "DELIVERED", "CONFIRMED", "CLOSED"] },
      },
    }));

  const canSeePhone = user?.role === "ADMIN" || !!paidOrder;

  return (
    <article className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm uppercase text-emerald-700">{listing.productType}</p>
      <h1 className="mt-1 text-2xl font-semibold">{listing.title}</h1>
      <p className="mt-3 text-stone-700">{listing.description ?? "Pas de description."}</p>
      <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-stone-500">Quantité disponible</dt>
          <dd>{listing.quantity} {listing.unit}</dd>
        </div>
        <div>
          <dt className="text-stone-500">Prix</dt>
          <dd>{listing.priceUsd.toFixed(2)} USD / {listing.unit}</dd>
        </div>
        <div>
          <dt className="text-stone-500">Ville</dt>
          <dd>{listing.city}</dd>
        </div>
        <div>
          <dt className="text-stone-500">Vendeur</dt>
          <dd>{listing.seller.name ?? "Producteur"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-stone-500">Contact</dt>
          <dd>
            {canSeePhone
              ? listing.seller.phone
              : "Numéro masqué jusqu'au paiement de la commande (anti-contournement)."}
          </dd>
        </div>
      </dl>

      {user?.role === "BUYER" && (
        <CreateOrderForm listingId={listing.id} maxQuantity={listing.quantity} />
      )}
    </article>
  );
}
