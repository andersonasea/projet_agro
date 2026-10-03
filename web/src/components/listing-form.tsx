"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function ListingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      title: String(form.get("title")),
      productType: String(form.get("productType")),
      quantity: Number(form.get("quantity")),
      unit: String(form.get("unit")),
      priceUsd: Number(form.get("priceUsd")),
      city: String(form.get("city")),
      description: String(form.get("description") || ""),
      imageUrl: String(form.get("imageUrl") || ""),
    };

    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Erreur publication");
      return;
    }

    router.push(`/produits/${data.listing.id}`);
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-xl space-y-3 rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm"
    >
      <h1 className="text-xl font-semibold text-emerald-900">Publier une annonce</h1>
      <input name="title" required placeholder="Titre (ex: Tomates fraîches)" className="w-full rounded-lg border px-3 py-2" />
      <input name="productType" required placeholder="Type (ex: Légumes)" className="w-full rounded-lg border px-3 py-2" />
      <div className="grid grid-cols-2 gap-3">
        <input name="quantity" required type="number" step="0.1" min="0.1" placeholder="Quantité" className="rounded-lg border px-3 py-2" />
        <input name="unit" required placeholder="Unité (kg, sac...)" className="rounded-lg border px-3 py-2" />
      </div>
      <input name="priceUsd" required type="number" step="0.01" min="0.01" placeholder="Prix USD / unité" className="w-full rounded-lg border px-3 py-2" />
      <input name="city" required placeholder="Ville" className="w-full rounded-lg border px-3 py-2" />
      <textarea name="description" placeholder="Description" className="min-h-24 w-full rounded-lg border px-3 py-2" />
      <input name="imageUrl" type="url" placeholder="URL image (optionnel)" className="w-full rounded-lg border px-3 py-2" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="w-full rounded-lg bg-emerald-700 py-2 text-white disabled:opacity-60">
        {loading ? "Publication..." : "Publier"}
      </button>
    </form>
  );
}
