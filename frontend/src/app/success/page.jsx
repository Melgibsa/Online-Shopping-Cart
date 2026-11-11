"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { formatCurrency } from "@/lib/format";

function OrderConfirmation() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const email = params.get("email");
  const total = Number(params.get("total"));
  const emailSent = params.get("emailSent") === "true";

  return (
    <div className="card mx-auto max-w-lg p-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
        ✓
      </div>
      <h1 className="mb-2 text-2xl font-bold">Order placed!</h1>

      {orderId && (
        <p className="text-sm text-slate-600">
          Order <strong>#{orderId}</strong>
          {Number.isFinite(total) && total > 0 && (
            <>
              {" "}
              · Total <strong>{formatCurrency(total)}</strong>
            </>
          )}
        </p>
      )}

      {email && (
        <p className="mt-2 text-sm text-slate-600">
          {emailSent
            ? `Order details have been sent to ${email}.`
            : `Your order is confirmed. Email notifications are not configured (recipient: ${email}).`}
        </p>
      )}

      <Link href="/" className="btn-primary mt-6">
        Back to store
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmation />
    </Suspense>
  );
}
