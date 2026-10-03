"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function OnboardingForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState<"BUYER" | "PRODUCER">("BUYER");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role, city, province: province || undefined }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Erreur profil");
      return;
    }

    router.push(role === "PRODUCER" ? "/produits/nouveau" : "/produits");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-md space-y-3 rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm"
    >
      <h1 className="text-xl font-semibold text-emerald-900">Compléter le profil</h1>
      <label className="block text-sm">
        Nom complet
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </label>
      <fieldset className="text-sm">
        <legend className="mb-1">Je suis</legend>
        <label className="mr-4">
          <input
            type="radio"
            name="role"
            checked={role === "BUYER"}
            onChange={() => setRole("BUYER")}
          />{" "}
          Acheteur
        </label>
        <label>
          <input
            type="radio"
            name="role"
            checked={role === "PRODUCER"}
            onChange={() => setRole("PRODUCER")}
          />{" "}
          Producteur
        </label>
      </fieldset>
      <label className="block text-sm">
        Ville
        <input
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        Province (optionnel)
        <input
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-emerald-700 py-2 text-white hover:bg-emerald-800 disabled:opacity-60"
      >
        {loading ? "Enregistrement..." : "Continuer"}
      </button>
    </form>
  );
}
