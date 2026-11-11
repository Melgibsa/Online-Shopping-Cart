import { z } from "zod";
import { getTodayISO } from "./format";

export const reservationSchema = z.object({
  date: z
    .string()
    .min(1, "Select a date.")
    .refine((value) => value >= getTodayISO(), "The date cannot be in the past."),
  time: z.string().min(1, "Select a time."),
  quantity: z
    .number({ invalid_type_error: "Enter a quantity." })
    .int("Enter a whole number.")
    .min(1, "Minimum quantity is 1.")
    .max(10, "Maximum quantity is 10."),
});

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Enter your full name.")
    .max(120, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .email("Enter a valid email address.")
    .max(160, "Email address is too long."),
});
