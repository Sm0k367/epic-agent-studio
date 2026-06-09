"use client";

import { useState } from "react";
import type { PlanId } from "@/lib/stripe";

export function CheckoutButton({
  plan,
  label,
  className = "",
}: {
  plan: PlanId;
  label: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function checkout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      alert(data.error ?? "Checkout failed — sign in first");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={checkout}
      disabled={loading}
      className={
        className ||
        "mt-6 w-full rounded-xl bg-gradient-to-r from-[#a855f7] to-[#7c3aed] px-6 py-3 font-semibold transition hover:brightness-110 disabled:opacity-60"
      }
    >
      {loading ? "Redirecting…" : label}
    </button>
  );
}