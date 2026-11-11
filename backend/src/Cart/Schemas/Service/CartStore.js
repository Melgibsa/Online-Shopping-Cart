class CartStore {
  carts = new Map(); //sessionId: stored items

  list(sessionId) {
    return this.carts.get(sessionId) ?? [];
  }

  save(sessionId, items) {
    this.carts.set(sessionId, items);
  }

  //used to clean up carts that are no longer needed
  clean(sessionId) {
    this.carts.delete(sessionId);
  }
}

module.exports = { CartStore };