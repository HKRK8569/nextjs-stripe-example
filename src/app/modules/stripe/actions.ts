"use server";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const createProduct = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const amount = formData.get("amount") as string;
  const { id } = await stripe.products.create({
    name: name,
  });
  await stripe.prices.create({
    product: id,
    unit_amount: Number(amount),
    currency: "jpy",
  });
  redirect("/list");
};

export const deleteProduct = async (formData: FormData) => {
  const id = formData.get("id") as string;
  await stripe.products.del(id);
  redirect("/list");
};

export const getProductList = async () => {
  return await stripe.products.list();
};
