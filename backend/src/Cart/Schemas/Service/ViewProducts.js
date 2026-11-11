const { View } = require('typeorm');
const {generateItemId, round} = require('./CartUtils');

class ViewProducts {
    constructor(store, productService) {
    this.store = store;
    this.productService = productService;
  }

   async obtain(sessionId) {
    const stored = this.store.list(sessionId);
    if (stored.length === 0) return { items: [], total: 0 };

    const products = await this.productService.findByIds(stored.map((s) => s.productId));
    const byId = new Map(products.map((p) => [p.id, p]));

    const items = stored.flatMap((s) => {
      const p = byId.get(s.productId);
      if (!p) return [];
      return [{
        id: generateItemId(s.productId, s.booking),
        productId: p.id,
        name: p.name,
        image: p.image,
        type: p.type,
        price: Number(p.price),
        quantity: s.quantity,
        subtotal: round(Number(p.price) * s.quantity),
        booking: s.booking ?? null,
      }];
    });

    const total = round(items.reduce((sum, i) => sum + i.subtotal, 0));
    return { items, total };
  }
}

module.exports = { ViewProducts };