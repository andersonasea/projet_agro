"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function requestOtp(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Erreur OTP");
      return;
    }

    if (data.devCode) setDevCode(data.devCode);
    setStep("otp");
  }

  async function verifyOtp(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Code invalide");
      return;
    }

    if (data.needsOnboarding) {
      router.push("/onboarding");
    } else {
      router.push("/produits");
    }
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-emerald-900">Connexion</h1>
      <p className="mt-1 text-sm text-stone-600">
        Authentification par téléphone (OTP). En dev, le code s&apos;affiche à l&apos;écran.
      </p>

      {step === "phone" ? (
        <form onSubmit={requestOtp} className="mt-5 space-y-3">
          <label className="block text-sm">
            Numéro (+243...)
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812345678"
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-700 py-2 text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {loading ? "Envoi..." : "Recevoir le code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="mt-5 space-y-3">
          {devCode && (
            <p className="rounded-lg bg-amber-50 p-2 text-sm text-amber-900">
              Code dev: <strong>{devCode}</strong>
            </p>
          )}
          <label className="block text-sm">
            Code OTP (6 chiffres)
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 tracking-widest"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-700 py-2 text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {loading ? "Vérification..." : "Se connecter"}
          </button>
        </form>
      )}
    </div>
  );
}
