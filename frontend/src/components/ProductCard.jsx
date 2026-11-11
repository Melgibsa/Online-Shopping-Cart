"use client";

import { useEffect, useState } from "react";
import { useAddCartItem } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";

export function ProductCard({ product, onBook }) {
  const addCartItem = useAddCartItem();
  const [isAdded, setIsAdded] = useState(false);
  const isBooking = product.type === "booking";

  useEffect(() => {
    if (!isAdded) return;
    const timer = setTimeout(() => setIsAdded(false), 1500);
    return () => clearTimeout(timer);
  }, [isAdded]);

  function handleAddToCart() {
    addCartItem.mutate(
      { productId: product.id, quantity: 1 },
      { onSuccess: () => setIsAdded(true) },
    );
  }

  return (
    <article className="card flex flex-col overflow-hidden">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={`Illustration of ${product.name}`}
          className="h-44 w-full object-cover"
          loading="lazy"
        />
        {isBooking && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
            Booking
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="text-base font-semibold text-slate-900">{product.name}</h2>
        <p className="flex-1 text-sm text-slate-600">{product.description}</p>
        <p className="text-lg font-bold text-indigo-600">
          {formatCurrency(product.price)}
          {isBooking && (
            <span className="ml-1 text-xs font-normal text-slate-500">per person</span>
          )}
        </p>

        {isBooking ? (
          <button type="button" className="btn-primary mt-1" onClick={() => onBook(product)}>
            Choose date and time
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary mt-1"
            onClick={handleAddToCart}
            disabled={addCartItem.isPending}
          >
            {addCartItem.isPending
              ? "Adding..."
              : isAdded
                ? "Added ✓"
                : "Add to cart"}
          </button>
        )}

        {addCartItem.isError && (
          <p role="alert" className="text-xs text-red-600">
            {getErrorMessage(addCartItem.error)}
          </p>
        )}
      </div>
    </article>
  );
}
