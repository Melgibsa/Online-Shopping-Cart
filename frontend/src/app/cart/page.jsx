"use client";

import Link from "next/link";
import { CartItemRow } from "@/components/CartItemRow";
import { OrderSummary } from "@/components/OrderSummary";
import { EmptyCart, ErrorState, LoadingBlock } from "@/components/StateMessages";
import { useCart, useUpdateCartItem } from "@/hooks/useCart";
import { getErrorMessage } from "@/lib/errors";

export default function CartPage() {
  const { data: cart, isLoading, isError, error, refetch } = useCart();
  const updateCartItem = useUpdateCartItem();

  if (isLoading) return <LoadingBlock label="Loading your cart..." />;
  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;
  if (!cart || cart.items.length === 0) return <EmptyCart />;

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Your cart</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <ul className="card divide-y divide-slate-200">
            {cart.items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                disabled={updateCartItem.isPending}
                onQuantityChange={(itemId, quantity) =>
                  updateCartItem.mutate({ itemId, quantity })
                }
                onRemove={(itemId) => updateCartItem.mutate({ itemId, quantity: 0 })}
              />
            ))}
          </ul>

          {updateCartItem.isError && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {getErrorMessage(updateCartItem.error)}
            </p>
          )}

          <Link href="/" className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline">
            ← Continue shopping
          </Link>
        </div>

        <OrderSummary cart={cart}>
          <Link href="/checkout" className="btn-primary w-full">
            Proceed to checkout
          </Link>
        </OrderSummary>
      </div>
    </section>
  );
}
