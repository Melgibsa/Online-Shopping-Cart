const OPENING_HOURS = ["09:00", "11:00", "14:00", "16:00"];

const PRODUCTS = [
  {
    name: "Bluetooth Headphones",
    description: "Stereo sound with noise cancellation and up to 30 hours of battery life.",
    price: 249.9,
    image: "/products/product.svg",
    type: "physical",
  },
  {
    name: "Compact Mechanical Keyboard",
    description: "Tactile switches, 65% layout, and customizable RGB lighting.",
    price: 329.0,
    image: "/products/product.svg",
    type: "physical",
  },
  {
    name: "Waterproof Backpack 25L",
    description: "Padded compartment for a laptop up to 15.6 inches.",
    price: 179.9,
    image: "/products/product.svg",
    type: "physical",
  },
  {
    name: "Webcam Full HD",
    description: "1080p resolution with built-in microphone and automatic light correction.",
    price: 199.0,
    image: "/products/product.svg",
    type: "physical",
  },
  {
    name: "Day Use Hotel Package",
    description: "Access to the swimming pool, breakfast, and guided trails. Choose your check-in date and time.",
    price: 120.0,
    image: "/products/booking.svg",
    type: "booking",
    openingHours: OPENING_HOURS,
  },
  {
    name: "Surfing Experimental Class",
    description: "Two hours of instruction with an instructor, surfboard, and wetsuit included.",
    price: 150.0,
    image: "/products/booking.svg",
    type: "booking",
    openingHours: OPENING_HOURS,
  },
];

async function productsSeed(productRepository) {
  const total = await productRepository.count();
  if (total > 0) return;
  await productRepository.save(productRepository.create(PRODUCTS));
}

module.exports = { productsSeed };