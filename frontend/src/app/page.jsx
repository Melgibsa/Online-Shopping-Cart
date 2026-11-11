"use client";

import { useState } from "react";
import { BookingDialog } from "@/components/BookingDialog";
import { ProductCard } from "@/components/ProductCard";
import { ErrorState, LoadingBlock } from "@/components/StateMessages";
import { useProducts } from "@/hooks/useProducts";
import { getErrorMessage } from "@/lib/errors";

export default function HomePage() {
  const { data: products, isLoading, isError, error, refetch } = useProducts();
  const [productToBook, setProductToBook] = useState(null);

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <p className="text-sm text-slate-600">
          Browse products and experiences, then add them to your cart.
        </p>
      </div>

      {isLoading && <LoadingBlock label="Loading products..." />}
      {isError && <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />}

      {products && products.length === 0 && (
        <p className="py-16 text-center text-sm text-slate-500">
          No products are currently available.
        </p>
      )}

      {products && products.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onBook={setProductToBook} />
          ))}
        </div>
      )}

      {productToBook && (
        <BookingDialog product={productToBook} onClose={() => setProductToBook(null)} />
      )}
    </section>
  );
}
