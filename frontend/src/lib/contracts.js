function normalizeReservation(reservation) {
  if (!reservation) return undefined;
  return {
    date: reservation.date,
    time: reservation.time ?? reservation.openingHour,
  };
}

function normalizeCartItem(item) {
  return {
    id: item.id,
    productId: item.productId,
    name: item.name,
    image: item.image,
    type: item.type,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.subtotal,
    reservation: normalizeReservation(item.booking ?? item.reservation),
  };
}

export function normalizeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image ?? product.image_url,
    type: product.type,
    availableTimes: product.openingHours ?? product.availableTimes,
  };
}

export function normalizeCart(cart) {
  return { items: cart.items.map(normalizeCartItem), total: cart.total };
}

export function normalizeOrder(order) {
  return {
    orderId: order.orderId,
    total: order.total,
    email: order.email,
    createdAt: order.createdAt,
    emailSent: order.emailSent,
  };
}

export function toApiAddCartItem({ productId, quantity, reservation }) {
  return {
    productId,
    quantity,
    ...(reservation
      ? { booking: { date: reservation.date, openingHour: reservation.time } }
      : {}),
  };
}

export function toApiUpdateCartItem({ itemId, quantity }) {
  return { itemId, quantity };
}

export function toApiCheckout({ customer }) {
  return {
    buyer: {
      name: customer.fullName,
      email: customer.email,
    },
  };
}
