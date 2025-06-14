"use server";

import Stripe from "stripe";
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const createProduct = async (name: string) => {
  await stripe.products.create({
    name: name,
  });
};

export const deleteProduct = async (id: string) => {
  await stripe.products.del(id);
};

export const getProductList = async () => {
  return await stripe.products.list();
};
