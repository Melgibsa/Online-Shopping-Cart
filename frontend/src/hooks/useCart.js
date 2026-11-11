"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const cartQueryKey = ["cart"];

const EMPTY_CART = { items: [], total: 0 };

export function useCart() {
  return useQuery({
    queryKey: cartQueryKey,
    queryFn: api.getCart,
  });
}

export function useCartItemCount() {
  const { data: cart } = useCart();
  return cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;
}

export function useAddCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addCartItem,
    onSuccess: (cart) => queryClient.setQueryData(cartQueryKey, cart),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateCartItem,
    onSuccess: (cart) => queryClient.setQueryData(cartQueryKey, cart),
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.checkout,
    onSuccess: () => queryClient.setQueryData(cartQueryKey, EMPTY_CART),
  });
}
