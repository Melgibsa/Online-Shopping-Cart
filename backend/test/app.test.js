const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");

process.env.SESSION_SECRET = "test-session-secret-with-at-least-32-characters";
process.env.NODE_ENV = "test";
process.env.DB_HOST = "localhost";
process.env.DB_USER = "test";
process.env.DB_NAME = "test";
process.env.RATE_LIMIT_MAX = "20";

const { createApp } = require("../app");

const cart = { items: [], total: 0 };
const app = createApp({
  productService: {
    list: async () => [
      { id: "product-1", name: "Test", price: 10, active: true },
      { id: "product-2", name: "Inactive", price: 10, active: false },
    ],
  },
  cartItems: {
    add: async () => cart,
    update: async () => cart,
  },
  viewProducts: { obtain: async () => cart },
  saleService: {
    finish: async (_sessionId, { buyer }) => ({
      orderId: "order-1",
      total: 0,
      email: buyer.email,
      createdAt: new Date().toISOString(),
      emailSent: false,
    }),
  },
});

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});

test("health endpoint responds without creating a session", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
  assert.equal(response.headers.get("set-cookie"), null);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-powered-by"), null);
});

test("CORS allows only the configured frontend origin", async () => {
  const allowed = await fetch(`${baseUrl}/api/health`, {
    headers: { Origin: "http://localhost:3000" },
  });
  assert.equal(allowed.headers.get("access-control-allow-origin"), "http://localhost:3000");
  assert.equal(allowed.headers.get("access-control-allow-credentials"), "true");

  const denied = await fetch(`${baseUrl}/api/health`, {
    headers: { Origin: "https://untrusted.example" },
  });
  assert.equal(denied.headers.get("access-control-allow-origin"), null);
});

test("product route returns active products only", async () => {
  const response = await fetch(`${baseUrl}/api/products`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), [
    { id: "product-1", name: "Test", price: 10, active: true },
  ]);
});

test("cart route sets an HTTP-only session cookie and uses it on reads", async () => {
  const added = await fetch(`${baseUrl}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: "00000000-0000-4000-8000-000000000001", quantity: 1 }),
  });
  assert.equal(added.status, 201);
  const cookie = added.headers.get("set-cookie");
  assert.match(cookie, /HttpOnly/i);
  assert.match(cookie, /SameSite=Lax/i);
  assert.match(cookie, /online-shopping-cart\.sid=/);

  const read = await fetch(`${baseUrl}/api/cart`, {
    headers: { Cookie: cookie.split(";")[0] },
  });
  assert.equal(read.status, 200);
  assert.deepEqual(await read.json(), cart);
});

test("invalid cart payloads return a safe validation error", async () => {
  const response = await fetch(`${baseUrl}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: "not-a-uuid", quantity: "one" }),
  });
  assert.equal(response.status, 400);
  assert.ok(Array.isArray((await response.json()).message));
});

test("checkout route accepts the English backend contract", async () => {
  const response = await fetch(`${baseUrl}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ buyer: { name: "Test Buyer", email: "buyer@example.com" } }),
  });
  assert.equal(response.status, 201);
  assert.equal((await response.json()).email, "buyer@example.com");
});

test("oversized JSON bodies are rejected", async () => {
  const response = await fetch(`${baseUrl}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: "x".repeat(110_000), quantity: 1 }),
  });
  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { message: "Request body is too large." });
});
