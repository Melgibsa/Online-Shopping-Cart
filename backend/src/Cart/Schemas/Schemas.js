const { z } = require("zod");

const booking = z.object({
  date: z.string().max(10),
  openingHour: z.string().max(5),
});

const addCart = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int(),
  booking: booking.optional().nullable(),
});

const updateCart = z.object({
  itemId: z.string().min(1).max(100),
  quantity: z.number().int(),
});

module.exports = { addCart, updateCart };