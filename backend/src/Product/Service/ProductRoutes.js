const { Router } = require("express");

function productRoutes({ productService }) {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      const products = await productService.list();
      res.json(products.filter((product) => product.active));
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = { productRoutes };
