const { HttpError } = require("../../commons/HttpError");

class SaleService {
  constructor({ dataSource, visualization, productService, store, emailService }) {
    this.dataSource = dataSource;
    this.visualization = visualization;
    this.productService = productService;
    this.store = store;
    this.email = emailService;
  }

  async finish(sessionId, { buyer }) {
    const cart = await this.visualization.obtain(sessionId);
    if (cart.items.length === 0) {
      throw new HttpError(400, "Your cart is empty.");
    }

    const products = await this.productService.findByIds(
      cart.items.map((item) => item.productId),
    );
    const activeProductIds = new Set(
      products.filter((product) => product.active).map((product) => product.id),
    );
    if (cart.items.some((item) => !activeProductIds.has(item.productId))) {
      throw new HttpError(409, "One or more products in your cart are no longer available.");
    }

    const sale = await this.dataSource.transaction(async (manager) => {
      const newSale = await manager.save(
        "Sale",
        manager.create("Sale", {
          buyerName: buyer.name,
          buyerEmail: buyer.email,
          total: cart.total,
        }),
      );

      const items = cart.items.map((item) =>
        manager.create("SaleItem", {
          sale: newSale,
          product: { id: item.productId },
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          subtotal: item.subtotal,
          bookingDate: item.booking?.date ?? null,
          bookingTime: item.booking?.openingHour ?? null,
        }),
      );
      await manager.save("SaleItem", items);

      return newSale;
    });

    this.store.clean(sessionId);

    let emailSent = false;
    try {
      emailSent = await this.email.sendConfirmation({
        orderId: sale.id,
        name: buyer.name,
        email: buyer.email,
        items: cart.items,
        total: cart.total,
      });
    } catch (error) {
      console.error("Failed to send confirmation email:", error.message);
    }

    return {
      orderId: sale.id,
      total: cart.total,
      email: buyer.email,
      createdAt: sale.createdAt,
      emailSent,
    };
  }
}

module.exports = { SaleService };