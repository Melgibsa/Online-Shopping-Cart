/**
 * Simulated API used when NEXT_PUBLIC_USE_MOCK=true.
 * The cart is stored in localStorage so the frontend can run without a backend.
 */
import { ApiError } from "./errors";
import { normalizeCart } from "./contracts";

const CART_STORAGE_KEY = "shopping-cart:mock";
const AVAILABLE_TIMES = ["09:00", "11:00", "14:00", "16:00"];

const PRODUCTS = [
  {
    id: 1,
    name: "Bluetooth Headphones",
    description: "Stereo sound, noise cancellation, and up to 30 hours of battery life.",
    price: 249.9,
    image: "/products/product.svg",
    type: "physical",
  },
  {
    id: 2,
    name: "Compact Mechanical Keyboard",
    description: "Tactile switches, a 65% layout, and customizable RGB lighting.",
    price: 329,
    image: "/products/product.svg",
    type: "physical",
  },
  {
    id: 3,
    name: "Waterproof 25L Backpack",
    description: "Padded compartment for laptops up to 15.6 inches.",
    price: 179.9,
    image: "/products/product.svg",
    type: "physical",
  },
  {
    id: 4,
    name: "Full HD Webcam",
    description: "1080p resolution, built-in microphone, and automatic light correction.",
    price: 199,
    image: "/products/product.svg",
    type: "physical",
  },
  {
    id: 5,
    name: "Day Pass at Serra Azul Inn",
    description: "Pool access, breakfast, and guided hikes. Choose your check-in date and time.",
    price: 120,
    image: "/products/booking.svg",
    type: "booking",
    availableTimes: AVAILABLE_TIMES,
  },
  {
    id: 6,
    name: "Introductory Surf Lesson",
    description: "Two-hour lesson with an instructor, surfboard, and rash guard included.",
    price: 150,
    image: "/products/booking.svg",
    type: "booking",
    availableTimes: AVAILABLE_TIMES,
  },
];

const wait = (milliseconds = 250) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
const roundCurrency = (value) => Math.round(value * 100) / 100;

function readItems() {
  if (typeof window === "undefined") return [];
  try {
    const storedValue = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!storedValue) return [];
    const parsedValue = JSON.parse(storedValue);
    return normalizeCart(Array.isArray(parsedValue) ? { items: parsedValue } : parsedValue).items;
  } catch {
    return [];
  }
}

function saveItems(items) {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items }));
  } catch {
    // The cart remains usable for the current session when storage is unavailable.
  }
}

function buildCart(items) {
  const recalculatedItems = items.map((item) => ({
    ...item,
    subtotal: roundCurrency(item.price * item.quantity),
  }));
  const total = roundCurrency(
    recalculatedItems.reduce((sum, item) => sum + item.subtotal, 0),
  );
  return { items: recalculatedItems, total };
}

export async function listProducts() {
  await wait();
  return PRODUCTS;
}

export async function getCart() {
  await wait(100);
  return buildCart(readItems());
}

export async function addCartItem(input) {
  await wait(150);
  const product = PRODUCTS.find((entry) => entry.id === input.productId);
  if (!product) throw new ApiError("Product not found.", 404);
  if (product.type === "booking" && !input.reservation) {
    throw new ApiError("Select a date and time for this product.", 400);
  }

  const itemId = input.reservation
    ? `${product.id}:${input.reservation.date}:${input.reservation.time}`
    : `${product.id}`;
  const items = readItems();
  const existingItem = items.find((item) => item.id === itemId);

  if (existingItem) {
    existingItem.quantity += input.quantity;
  } else {
    items.push({
      id: itemId,
      productId: product.id,
      name: product.name,
      image: product.image,
      type: product.type,
      price: product.price,
      quantity: input.quantity,
      subtotal: 0,
      reservation: input.reservation,
    });
  }

  saveItems(items);
  return buildCart(items);
}

export async function updateCartItem(input) {
  await wait(100);
  let items = readItems();
  const item = items.find((entry) => entry.id === input.itemId);
  if (!item) throw new ApiError("Cart item not found.", 404);

  if (input.quantity <= 0) {
    items = items.filter((entry) => entry.id !== input.itemId);
  } else {
    item.quantity = input.quantity;
  }

  saveItems(items);
  return buildCart(items);
}

export async function checkout(input) {
  await wait(600);
  const cart = buildCart(readItems());
  if (cart.items.length === 0) {
    throw new ApiError("Your cart is empty.", 400);
  }

  saveItems([]);
  return {
    orderId: Math.floor(100000 + Math.random() * 900000),
    total: cart.total,
    email: input.customer.email,
    createdAt: new Date().toISOString(),
    emailSent: false,
  };
}
