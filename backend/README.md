# Online Shopping Cart API

## Requirements

- Node.js 18 or later
- PostgreSQL

## Configure and run

Create `backend/.env` from `.env.example`, then set the PostgreSQL credentials and a unique `SESSION_SECRET` with at least 32 characters. SMTP settings are optional; without them, checkout works but confirmation email is disabled.

```bash
npm install
npm run db:migrate
npm start
```

The server listens on `http://localhost:3333`. It initializes the TypeORM data source, applies the product seed when the product table is empty, then starts the API. Apply database migrations before the first start.

## API

- `GET /api/health`
- `GET /api/products`
- `GET /api/cart`
- `POST /api/cart` with `{ "productId": "<uuid>", "quantity": 1, "booking": { "date": "YYYY-MM-DD", "openingHour": "09:00" } }`
- `PUT /api/cart` with `{ "itemId": "...", "quantity": 0 }` (`0` removes the item)
- `POST /api/checkout` with `{ "buyer": { "name": "Full Name", "email": "buyer@example.com" } }`

The API allows credentialed CORS only from `http://localhost:3000`. Session cookies are HTTP-only and use `SameSite=Lax`; they are marked `Secure` in production. Production sessions are stored in PostgreSQL; development sessions use the Express memory store. JSON request bodies and request rates are limited.

## Tests

```bash
npm test
```
