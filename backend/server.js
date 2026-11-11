require("dotenv").config();

const AppDataSource = require("./config/database");
const ProductService = require("./src/Product/Service/ProductService");
const { productsSeed } = require("./src/Product/Service/ProductSeed");
const { CartStore } = require("./src/Cart/Schemas/Service/CartStore");
const { CartItems } = require("./src/Cart/Schemas/Service/CartItems");
const { ViewProducts } = require("./src/Cart/Schemas/Service/ViewProducts");
const { SaleService } = require("./src/Sale/Service/SaleService");
const { EmailSend } = require("./src/E-mail/EmailSend");
const { createApp, validateEnvironment } = require("./app");

function createEmailService() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_FROM) {
    console.warn("SMTP is not configured; order confirmation emails are disabled.");
    return { sendConfirmation: async () => false };
  }

  if (Boolean(process.env.SMTP_USER) !== Boolean(process.env.SMTP_PASSWORD)) {
    throw new Error("SMTP_USER and SMTP_PASSWORD must either both be set or both be empty.");
  }

  const port = Number(process.env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT must be a valid port number.");
  }

  return new EmailSend({
    host: process.env.SMTP_HOST,
    port,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM,
  });
}

async function startServer() {
  validateEnvironment();
  await AppDataSource.initialize();

  try {
    const productRepository = AppDataSource.getRepository("Product");
    await productsSeed(productRepository);

    const productService = new ProductService(productRepository);
    const cartStore = new CartStore();
    const viewProducts = new ViewProducts(cartStore, productService);
    const cartItems = new CartItems(cartStore, productService, viewProducts);
    const saleService = new SaleService({
      dataSource: AppDataSource,
      visualization: viewProducts,
      productService,
      store: cartStore,
      emailService: createEmailService(),
    });
    const app = createApp({ productService, cartItems, viewProducts, saleService });
    const port = Number(process.env.PORT || 3333);
    const server = app.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
    });

    const shutdown = () => {
      server.close(async () => {
        if (app.locals.sessionPool) await app.locals.sessionPool.end();
        if (AppDataSource.isInitialized) await AppDataSource.destroy();
        process.exit(0);
      });
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
  } catch (error) {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
    throw error;
  }
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start API:", error.message);
    process.exitCode = 1;
  });
}

module.exports = { startServer };
