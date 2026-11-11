"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderSummary } from "@/components/OrderSummary";
import { EmptyCart, ErrorState, LoadingBlock } from "@/components/StateMessages";
import { useCart, useCheckout } from "@/hooks/useCart";
import { getErrorMessage } from "@/lib/errors";
import { formatCurrency, formatDate } from "@/lib/format";
import { checkoutSchema } from "@/lib/schemas";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading, isError, error, refetch } = useCart();
  const checkout = useCheckout();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { fullName: "", email: "" },
  });

  const onSubmit = handleSubmit((values) => {
    checkout.mutate(
      { customer: values },
      {
        onSuccess: (order) => {
          const params = new URLSearchParams({
            order: String(order.orderId),
            email: order.email,
            total: String(order.total),
            emailSent: String(order.emailSent),
          });
          router.push(`/success?${params.toString()}`);
        },
      },
    );
  });

  if (isLoading) return <LoadingBlock label="Loading..." />;
  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;
  if (checkout.isSuccess) return <LoadingBlock label="Order complete. Redirecting..." />;
  if (!cart || cart.items.length === 0) return <EmptyCart />;

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <form id="checkout-form" onSubmit={onSubmit} noValidate className="card space-y-4 p-6">
            <h2 className="text-lg font-semibold">Your details</h2>

            <div>
              <label htmlFor="fullName" className="mb-1 block text-sm font-medium">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                className={`input ${errors.fullName ? "input-error" : ""}`}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`input ${errors.email ? "input-error" : ""}`}
                {...register("email")}
              />
              <p className="mt-1 text-xs text-slate-500">
                We’ll send your order confirmation to this email address.
              </p>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            {checkout.isError && (
              <p role="alert" className="text-sm text-red-600">
                {getErrorMessage(checkout.error)}
              </p>
            )}
          </form>

          <div className="card p-6">
            <h2 className="mb-3 text-lg font-semibold">Order items</h2>
            <ul className="divide-y divide-slate-200 text-sm">
              {cart.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4 py-2">
                  <div>
                    <p className="font-medium">
                      {item.quantity}× {item.name}
                    </p>
                    {item.reservation && (
                      <p className="text-xs text-emerald-700">
                        Check-in: {formatDate(item.reservation.date)} at {item.reservation.time}
                      </p>
                    )}
                  </div>
                  <span className="tabular-nums">{formatCurrency(item.subtotal)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <OrderSummary cart={cart}>
          <button
            type="submit"
            form="checkout-form"
            className="btn-primary w-full"
            disabled={checkout.isPending}
          >
            {checkout.isPending ? "Processing..." : "Place order"}
          </button>
        </OrderSummary>
      </div>
    </section>
  );
}
