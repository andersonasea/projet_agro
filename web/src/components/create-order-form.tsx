"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Props = {
  listingId: string;
  maxQuantity: number;
};

export function CreateOrderForm({ listingId, maxQuantity }: Props) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, quantity }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Erreur commande");
      return;
    }

    router.push("/commandes");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-2 rounded-xl border bg-emerald-50/40 p-4">
      <h2 className="font-medium text-emerald-900">Passer commande</h2>
      <label className="block text-sm">
        Quantité (max {maxQuantity})
        <input
          type="number"
          min={0.1}
          max={maxQuantity}
          step={0.1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="mt-1 w-full rounded-lg border px-3 py-2"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm text-white">
        {loading ? "Création..." : "Créer la commande"}
      </button>
    </form>
  );
}
