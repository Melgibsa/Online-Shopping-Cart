const assert = require("node:assert/strict");
const { test } = require("node:test");
const { CartItems } = require("../src/Cart/Schemas/Service/CartItems");
const { SaleService } = require("../src/Sale/Service/SaleService");

test("cart rejects inactive products", async () => {
  const store = {
    list: () => [],
    save: () => assert.fail("inactive product must not be added"),
  };
  const cartItems = new CartItems(
    store,
    { findById: async () => ({ id: "product-1", active: false, type: "physical" }) },
    { obtain: async () => ({ items: [], total: 0 }) },
  );

  await assert.rejects(
    cartItems.add("session-1", { productId: "product-1", quantity: 1 }),
    (error) => error.status === 409 && error.message === "Product is no longer available.",
  );
});

test("cart still accepts active products", async () => {
  const savedItems = [];
  const cartItems = new CartItems(
    {
      list: () => [],
      save: (_sessionId, items) => savedItems.push(...items),
    },
    { findById: async () => ({ id: "product-1", active: true, type: "physical" }) },
    { obtain: async () => ({ items: [], total: 0 }) },
  );

  await cartItems.add("session-1", { productId: "product-1", quantity: 1 });
  assert.equal(savedItems.length, 1);
  assert.equal(savedItems[0].productId, "product-1");
});

test("checkout rejects a product deactivated after it was added", async () => {
  let transactionStarted = false;
  const saleService = new SaleService({
    dataSource: {
      transaction: async () => {
        transactionStarted = true;
      },
    },
    visualization: {
      obtain: async () => ({
        items: [{ productId: "product-1", quantity: 1, price: 10, subtotal: 10 }],
        total: 10,
      }),
    },
    productService: {
      findByIds: async () => [{ id: "product-1", active: false }],
    },
    store: { clean: () => assert.fail("failed checkout must preserve the cart") },
    emailService: { sendConfirmation: async () => true },
  });

  await assert.rejects(
    saleService.finish("session-1", {
      buyer: { name: "Test Buyer", email: "buyer@example.com" },
    }),
    (error) =>
      error.status === 409 &&
      error.message === "One or more products in your cart are no longer available.",
  );
  assert.equal(transactionStarted, false);
});
