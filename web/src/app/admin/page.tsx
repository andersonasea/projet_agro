import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminPage() {
  await requireRole(["ADMIN"]);

  const [users, listings, orders] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.order.count(),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      listing: { select: { title: true } },
      buyer: { select: { name: true, phone: true } },
      seller: { select: { name: true, phone: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Administration</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-stone-500">Utilisateurs</p>
          <p className="text-2xl font-semibold">{users}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-stone-500">Annonces</p>
          <p className="text-2xl font-semibold">{listings}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-stone-500">Commandes</p>
          <p className="text-2xl font-semibold">{orders}</p>
        </div>
      </div>

      <section>
        <h2 className="mb-3 font-medium">Dernières commandes</h2>
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-stone-50">
              <tr>
                <th className="px-3 py-2">Produit</th>
                <th className="px-3 py-2">Acheteur</th>
                <th className="px-3 py-2">Vendeur</th>
                <th className="px-3 py-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="px-3 py-2">{order.listing.title}</td>
                  <td className="px-3 py-2">{order.buyer.name ?? order.buyer.phone}</td>
                  <td className="px-3 py-2">{order.seller.name ?? order.seller.phone}</td>
                  <td className="px-3 py-2">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
