const { HttpError } = require("../../../commons/HttpError");
const { today } = require("./CartUtils");

const MAXIMUM_QUANTITY = 99;

function validateQuantity(quantity) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAXIMUM_QUANTITY) {
    throw new HttpError(400, `Quantity should be an integer between 1 and ${MAXIMUM_QUANTITY}.`);
  }
}

function validateBooking(product, booking) {
  if (product.type === "physical") {
    if (booking) throw new HttpError(400, "This product cannot be reserved.");
    return;
  }

  if (!booking?.date || !booking?.openingHour) {
    throw new HttpError(400, "Select a date and time for this product.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(booking.date) || booking.date < today()) {
    throw new HttpError(400, "The booking date cannot be in the past.");
  }
  if (!product.openingHours?.includes(booking.openingHour)) {
    throw new HttpError(400, "The selected time slot is not available for this product.");
  }
}

module.exports = { validateQuantity, validateBooking };