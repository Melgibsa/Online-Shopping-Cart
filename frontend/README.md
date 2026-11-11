# Online Store — Frontend

The frontend for an e-commerce shopping cart, built with **Next.js 14 (App Router)**, **JavaScript**, and **Tailwind CSS**.

## Technologies

- Next.js 14 and React 18
- Tailwind CSS
- TanStack Query for server state, caching, and mutations
- React Hook Form and Zod for form handling and validation

## Run locally

Requirements: Node.js 18.17 or later.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

### Mock mode (no backend)

With `NEXT_PUBLIC_USE_MOCK=true`, the app uses mock data and stores the cart in `localStorage`, so it runs without a backend.

### Connect to the backend

Set these values in `.env.local`:

```
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=http://localhost:3333
```

The backend API is served under `/api`. Restart `npm run dev` after changing `.env.local`. The backend allows credentialed CORS from `http://localhost:3000`; the frontend sends cookies (`credentials: "include"`) to identify the cart.

## API contract

API routes and payload fields use the backend's English contract:

| Method | Route | Request body | Response |
| --- | --- | --- | --- |
| GET | `/api/products` | — | `Product[]` |
| GET | `/api/cart` | — | `Cart` |
| POST | `/api/cart` | `{ productId, quantity, booking? }` | Updated `Cart` |
| PUT | `/api/cart` | `{ itemId, quantity }` (0 removes the item) | Updated `Cart` |
| POST | `/api/checkout` | `{ buyer: { name, email } }` | `{ orderId, total, email, createdAt, emailSent }` |

Notes:

- `GET /api/cart` is required to reload the cart when the page opens.
- `src/lib/api.js` calls the English backend contract; `src/lib/contracts.js` normalizes backend responses for the frontend.
- Errors should use an appropriate HTTP status and include a `message` field (a string or an array of strings, as in NestJS).

## Features

- Product listing with names, descriptions, prices, and sample images
- Add products to the cart and see the item count in the header
- View item quantities, subtotals, and the cart total
- Update quantities and remove items
- Validated checkout with Zod and React Hook Form
- Order confirmation page
- Booking products with date, time, and guest selection

## Project structure

```
src/
  app/            pages for products, cart, checkout, and order confirmation
  components/     user interface components
  hooks/          TanStack Query hooks for products and cart
  lib/            API client, mock data, schemas, and formatting helpers
```

## Technical notes

- The server owns cart state; TanStack Query keeps the frontend cache in sync with each mutation response.
- All API access goes through `src/lib/api.js`, so switching between mock data and the live backend only requires an environment variable.
- The server recalculates monetary values; the frontend displays the returned totals.
- The app does not use `dangerouslySetInnerHTML`; React escapes dynamic content by default.
