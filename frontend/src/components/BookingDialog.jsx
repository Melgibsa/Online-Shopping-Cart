"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddCartItem } from "@/hooks/useCart";
import { getErrorMessage } from "@/lib/errors";
import { formatCurrency, getTodayISO } from "@/lib/format";
import { reservationSchema } from "@/lib/schemas";

export function BookingDialog({ product, onClose }) {
  const addCartItem = useAddCartItem();
  const availableTimes = product.availableTimes ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: { date: "", time: "", quantity: 1 },
  });

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const onSubmit = handleSubmit((values) => {
    addCartItem.mutate(
      {
        productId: product.id,
        quantity: values.quantity,
        reservation: { date: values.date, time: values.time },
      },
      { onSuccess: onClose },
    );
  });

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        className="card w-full max-w-md p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="booking-title" className="text-lg font-semibold">
              {product.name}
            </h2>
            <p className="text-sm text-slate-500">{formatCurrency(product.price)} per person</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="date" className="mb-1 block text-sm font-medium">
              Check-in date
            </label>
            <input
              id="date"
              type="date"
              min={getTodayISO()}
              className={`input ${errors.date ? "input-error" : ""}`}
              {...register("date")}
            />
            {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>}
          </div>

          <div>
            <label htmlFor="time" className="mb-1 block text-sm font-medium">
              Time
            </label>
            <select
              id="time"
              className={`input ${errors.time ? "input-error" : ""}`}
              {...register("time")}
            >
              <option value="">Select a time...</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.time && <p className="mt-1 text-xs text-red-600">{errors.time.message}</p>}
          </div>

          <div>
            <label htmlFor="quantity" className="mb-1 block text-sm font-medium">
              Number of guests
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              max={10}
              className={`input ${errors.quantity ? "input-error" : ""}`}
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="mt-1 text-xs text-red-600">{errors.quantity.message}</p>
            )}
          </div>

          {addCartItem.isError && (
            <p role="alert" className="text-sm text-red-600">
              {getErrorMessage(addCartItem.error)}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-secondary flex-1" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={addCartItem.isPending}
            >
              {addCartItem.isPending ? "Adding..." : "Add to cart"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
