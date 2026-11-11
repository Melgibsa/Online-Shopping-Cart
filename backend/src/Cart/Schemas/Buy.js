const { z } = require("zod");

const finishPurchase = z.object({
  buyer: z.object({
    name: z.string().trim().min(3).max(120),
    email: z.string().trim().email().max(160),
  }),
});

module.exports = { finishPurchase };