import { formatCurrency } from "@/lib/format";

export function OrderSummary({ cart, children }) {
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <aside className="card h-fit p-5">
      <h2 className="mb-4 text-lg font-semibold">Order summary</h2>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between text-slate-600">
          <dt>Items ({itemCount})</dt>
          <dd className="tabular-nums">{formatCurrency(cart.total)}</dd>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold">
          <dt>Total</dt>
          <dd className="tabular-nums text-indigo-600">{formatCurrency(cart.total)}</dd>
        </div>
      </dl>

      {children && <div className="mt-5">{children}</div>}
    </aside>
  );
}
