function generateItemId(productId, booking) {
  return booking ? `${productId}:${booking.date}:${booking.openingHour}` : String(productId);
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function today() {
  const d = new Date();
  const two = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`;
}

module.exports = { generateItemId, round, today };