import { OrderActions } from "@/components/order-actions";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function CommandesPage() {
  const user = await requireUser();

  const orders = await prisma.order.findMany({
    where: {
      OR: [{ buyerId: user.id }, { sellerId: user.id }],
    },
    include: { listing: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Mes commandes</h1>
      {orders.map((order) => {
        const role =
          order.buyerId === user.id
            ? "BUYER"
            : order.sellerId === user.id
              ? "PRODUCER"
              : "ADMIN";

        return (
          <div key={order.id} className="rounded-2xl border bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="font-medium">{order.listing.title}</h2>
                <p className="text-sm text-stone-600">
                  {order.quantity} {order.listing.unit} · {order.totalUsd.toFixed(2)} USD
                </p>
                <p className="text-sm">
                  Statut: <strong>{order.status}</strong>
                </p>
                {order.commissionUsd != null && (
                  <p className="text-xs text-stone-500">
                    Commission plateforme: {order.commissionUsd.toFixed(2)} USD
                  </p>
                )}
              </div>
              <OrderActions orderId={order.id} status={order.status} role={role} />
            </div>
          </div>
        );
      })}
      {orders.length === 0 && <p className="text-stone-600">Aucune commande pour le moment.</p>}
    </div>
  );
}
