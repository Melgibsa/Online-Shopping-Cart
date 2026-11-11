const { HttpError } = require("../../../commons/HttpError");
const { generateItemId } = require("./CartUtils");     
const { validateQuantity, validateBooking } = require("./CartValidator");

class CartItems {
    constructor(store, productService, visualization) {
    this.store = store;
    this.productService = productService;
    this.visualization = visualization;
  }

  async add(sessionId, { productId, quantity, booking }) {
    const product = await this.productService.findById(productId);
    if (!product) throw new HttpError(404, "Product not found.");
    if (!product.active) throw new HttpError(409, "Product is no longer available.");

    validateQuantity(quantity);
    validateBooking(product, booking);

    const items = this.store.list(sessionId);
    const itemId = generateItemId(product.id, booking);
    const existent = items.find((i) => generateItemId(i.productId, i.booking) === itemId);

    if (existent) {
      const newQuantity = existent.quantity + quantity;
      validateQuantity(newQuantity);
      existent.quantity = newQuantity;
    } else {
      items.push({
        productId: product.id,
        quantity: quantity,
        booking: booking ? { date: booking.date, openingHour: booking.openingHour } : null,
      });
    }

    this.store.save(sessionId, items);
    return this.visualization.obtain(sessionId);
  }

  async update(sessionId, { itemId, quantity }) {
    const items = this.store.list(sessionId);
    const index = items.findIndex((i) => generateItemId(i.productId, i.booking) === itemId);
    if (index === -1) throw new HttpError(404, "Item not found in cart.");

    if (quantity === 0) {
      items.splice(index, 1);
    } else {
      validateQuantity(quantity);
      items[index].quantity = quantity;
    }

    this.store.save(sessionId, items);
    return this.visualization.obtain(sessionId);
  }
}

module.exports = { CartItems };