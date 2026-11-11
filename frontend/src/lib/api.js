import { ApiError } from "./errors";
import * as mock from "./mock";
import {
  normalizeCart,
  normalizeOrder,
  normalizeProduct,
  toApiAddCartItem,
  toApiCheckout,
  toApiUpdateCartItem,
} from "./contracts";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

async function request(path, init) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let message = "Could not complete the request.";
    try {
      const body = await response.json();
      const rawMessage = body?.message ?? body?.error;
      if (Array.isArray(rawMessage)) message = rawMessage.join(" ");
      else if (typeof rawMessage === "string") message = rawMessage;
    } catch {
      // The response body is not JSON.
    }
    throw new ApiError(message, response.status);
  }

  return response.json();
}

export const api = {
  async listProducts() {
    const products = USE_MOCK ? await mock.listProducts() : await request("/api/products");
    return products.map(normalizeProduct);
  },

  async getCart() {
    const cart = USE_MOCK ? await mock.getCart() : await request("/api/cart");
    return normalizeCart(cart);
  },

  async addCartItem(input) {
    const item = USE_MOCK
      ? await mock.addCartItem(input)
      : await request("/api/cart", {
          method: "POST",
          body: JSON.stringify(toApiAddCartItem(input)),
        });
    return normalizeCart(item);
  },

  async updateCartItem(input) {
    const cart = USE_MOCK
      ? await mock.updateCartItem(input)
      : await request("/api/cart", {
          method: "PUT",
          body: JSON.stringify(toApiUpdateCartItem(input)),
        });
    return normalizeCart(cart);
  },

  async checkout(input) {
    const order = USE_MOCK
      ? await mock.checkout(input)
      : await request("/api/checkout", {
          method: "POST",
          body: JSON.stringify(toApiCheckout(input)),
        });
    return normalizeOrder(order);
  },
};
