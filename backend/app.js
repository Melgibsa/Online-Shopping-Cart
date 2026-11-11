require("dotenv").config();

const cors = require("cors");
const express = require("express");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const { Pool } = require("pg");
const connectPgSimple = require("connect-pg-simple");
const { productRoutes } = require("./src/Product/Service/ProductRoutes");
const { cartRoutes, buyRoutes } = require("./src/Cart/Schemas/Service/CartRoutes");
const { errorHandler } = require("./src/commons/errorHandler");

function requiredNumber(name, fallback, { minimum = 1 } = {}) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < minimum) {
    throw new Error(`${name} must be an integer greater than or equal to ${minimum}.`);
  }
  return value;
}

function validateEnvironment() {
  const sessionSecret = process.env.SESSION_SECRET;
  if (
    !sessionSecret ||
    sessionSecret.length < 32 ||
    sessionSecret === "replace-with-a-random-secret-at-least-32-characters-long"
  ) {
    throw new Error("SESSION_SECRET must contain at least 32 characters.");
  }

  for (const name of ["DB_HOST", "DB_USER", "DB_NAME"]) {
    if (!process.env[name]) throw new Error(`${name} is required.`);
  }

  requiredNumber("DB_PORT", 5432);
  requiredNumber("PORT", 3333);
}

function createApp({ productService, cartItems, viewProducts, saleService }) {
  validateEnvironment();

  const app = express();
  const frontendOrigin = "http://localhost:3000";
  const production = process.env.NODE_ENV === "production";
  const sessionPool = production
    ? new Pool({
        host: process.env.DB_HOST,
        port: requiredNumber("DB_PORT", 5432),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD ?? "",
        database: process.env.DB_NAME,
      })
    : undefined;

  app.disable("x-powered-by");
  if (production) app.set("trust proxy", 1);
  app.locals.sessionPool = sessionPool;
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) =>
        callback(null, !origin || origin === frontendOrigin),
      credentials: true,
      methods: ["GET", "POST", "PUT", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
    }),
  );
  app.use(express.json({ limit: process.env.BODY_LIMIT || "100kb" }));
  const sessionOptions = {
    name: "online-shopping-cart.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: production,
      sameSite: "lax",
      maxAge: requiredNumber("SESSION_MAX_AGE_MS", 60 * 60 * 1000),
    },
  };
  if (sessionPool) {
    const PgSessionStore = connectPgSimple(session);
    sessionOptions.store = new PgSessionStore({
      pool: sessionPool,
      tableName: "http_session",
      createTableIfMissing: true,
    });
  }
  app.use(session(sessionOptions));
  app.use(
    rateLimit({
      windowMs: requiredNumber("RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
      limit: requiredNumber("RATE_LIMIT_MAX", 100),
      standardHeaders: "draft-7",
      legacyHeaders: false,
      message: { message: "Too many requests. Please try again later." },
    }),
  );

  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api/products", productRoutes({ productService }));
  app.use("/api/cart", cartRoutes({ cartItems, viewProducts }));
  app.use("/api/checkout", buyRoutes({ saleService }));

  app.use((req, res) => res.status(404).json({ message: "Route not found." }));
  app.use(errorHandler);

  return app;
}

module.exports = { createApp, validateEnvironment };
