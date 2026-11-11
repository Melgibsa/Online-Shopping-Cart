const { Router } = require("express");
const { addCart, updateCart } = require("../Schemas");
const { finishPurchase } = require("../Buy");

function cartRoutes({ cartItems, viewProducts }) {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      res.json(await viewProducts.obtain(req.sessionID));
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const data = addCart.parse(req.body);
      req.session.hasCart = true;
      res.status(201).json(await cartItems.add(req.sessionID, data));
    } catch (error) {
      next(error);
    }
  });

  router.put("/", async (req, res, next) => {
    try {
      const data = updateCart.parse(req.body);
      res.json(await cartItems.update(req.sessionID, data));
    } catch (error) {
      next(error);
    }
  });

  return router;
}

function buyRoutes({ saleService }) {
  const router = Router();

  router.post("/", async (req, res, next) => {
    try {
      const data = finishPurchase.parse(req.body);
      res.status(201).json(await saleService.finish(req.sessionID, data));
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { cartRoutes, buyRoutes };