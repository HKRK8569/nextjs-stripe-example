"use server";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const createProduct = async (formData: FormData) => {
  const name = formData.get("name") as string;
  await stripe.products.create({
    name: name,
  });
  redirect("/list");
};

export const deleteProduct = async (id: string) => {
  await stripe.products.del(id);
};

export const getProductList = async () => {
  return await stripe.products.list();
};
