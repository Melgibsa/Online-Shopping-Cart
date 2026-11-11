"use client";

import { formatCurrency, formatDate } from "@/lib/format";
import { QuantityStepper } from "./QuantityStepper";

export function CartItemRow({ item, disabled = false, onQuantityChange, onRemove }) {
  return (
    <li className="flex gap-4 p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.image} alt="" className="h-20 w-20 shrink-0 rounded-lg object-cover" />

      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-900">{item.name}</h3>
          <p className="text-sm text-slate-500">{formatCurrency(item.price)} each</p>
          {item.reservation && (
            <p className="mt-1 text-xs font-medium text-emerald-700">
              Check-in: {formatDate(item.reservation.date)} at {item.reservation.time}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <QuantityStepper
            value={item.quantity}
            onChange={(nextValue) => onQuantityChange(item.id, nextValue)}
            disabled={disabled}
          />
          <p className="w-24 text-right font-semibold tabular-nums">
            {formatCurrency(item.subtotal)}
          </p>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            disabled={disabled}
            className="rounded-md p-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            aria-label={`Remove ${item.name} from cart`}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
