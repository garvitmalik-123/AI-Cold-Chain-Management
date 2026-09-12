// Mirrors the backend enums exactly (com.coldchain.model.*)

export const ROLES = ["ADMIN", "TRANSPORTER", "FACILITY_MANAGER"];

export const PRODUCT_CATEGORIES = [
  "DAIRY",
  "FRUITS",
  "VEGETABLES",
  "MEAT",
  "SEAFOOD",
  "FLOWERS",
  "PHARMA",
  "OTHER",
];

export const FACILITY_TYPES = ["COLD_STORAGE", "MANDI", "PROCESSING_CENTRE"];

export const SHIPMENT_STATUSES = ["CREATED", "IN_TRANSIT", "DELAYED", "DELIVERED", "CANCELLED"];

export function humanize(value) {
  if (!value) return "—";
  return String(value)
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
