"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrderStatus } from "@/lib/types";

type Props = {
  orderId: string;
  status: string;
  role: "BUYER" | "PRODUCER" | "ADMIN";
};

export function OrderActions({ orderId, status, role }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function pay() {
    setLoading(true);
    const res = await fetch(`/api/orders/${orderId}/pay`, { method: "POST" });
    const data = await res.json();
    setLoading(false);
    setMessage(data.message ?? (res.ok ? "Paiement effectué" : data.error));
    router.refresh();
  }

  async function updateStatus(nextStatus: OrderStatus) {
    setLoading(true);
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const data = await res.json();
    setLoading(false);
    setMessage(res.ok ? "Statut mis à jour" : data.error);
    router.refresh();
  }

  return (
    <div className="space-y-2">
      {message && <p className="text-sm text-stone-600">{message}</p>}
      {role === "BUYER" && status === "PENDING_PAYMENT" && (
        <button
          type="button"
          disabled={loading}
          onClick={pay}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm text-white"
        >
          Payer via Mobile Money (simulation)
        </button>
      )}
      {role === "PRODUCER" && status === "PAID" && (
        <button type="button" disabled={loading} onClick={() => updateStatus("PREPARING")} className="rounded-lg border px-4 py-2 text-sm">
          Marquer en préparation
        </button>
      )}
      {role === "PRODUCER" && status === "PREPARING" && (
        <button type="button" disabled={loading} onClick={() => updateStatus("DELIVERED")} className="rounded-lg border px-4 py-2 text-sm">
          Marquer livré
        </button>
      )}
      {role === "BUYER" && status === "DELIVERED" && (
        <button type="button" disabled={loading} onClick={() => updateStatus("CONFIRMED")} className="rounded-lg border px-4 py-2 text-sm">
          Confirmer réception
        </button>
      )}
    </div>
  );
}
