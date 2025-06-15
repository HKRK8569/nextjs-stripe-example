import type Stripe from "stripe";

export type ProductWithPrice = {
  product: Stripe.Product;
  price: number;
};
