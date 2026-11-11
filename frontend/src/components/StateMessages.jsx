import Link from "next/link";

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="card mx-auto max-w-md p-8 text-center">
      <p className="mb-4 text-sm text-red-600">{message}</p>
      {onRetry && (
        <button type="button" className="btn-secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyCart() {
  return (
    <div className="card mx-auto max-w-md p-8 text-center">
      <h2 className="mb-2 text-lg font-semibold">Your cart is empty</h2>
      <p className="mb-5 text-sm text-slate-600">
        Add some products to continue shopping.
      </p>
      <Link href="/" className="btn-primary">
        Browse products
      </Link>
    </div>
  );
}

export function LoadingBlock({ label }) {
  return (
    <div role="status" className="py-16 text-center text-sm text-slate-500">
      {label}
    </div>
  );
}
