export const BUYER_CATEGORIES = [
  "All categories",
  "Logistics",
  "Textiles",
  "Machinery",
  "Metals",
  "Chemicals",
  "Agriculture",
  "Electronics",
  "Construction",
  "Energy",
] as const;

export type BuyerCategory = (typeof BUYER_CATEGORIES)[number];

export const DEFAULT_BUYER_CATEGORY: BuyerCategory = "All categories";


