"use server";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import type { ProductWithPrice } from "./types";

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
  const { data } = await stripe.products.list();
  const promiseGetPrices: Promise<ProductWithPrice>[] = data.map(
    async (product) => {
      const { data } = await stripe.prices.list({
        product: product.id,
      });

      if (!data[0].unit_amount) {
        throw new Error("unitAmount is notfound");
      }

      return {
        product,
        price: {
          id: data[0].id,
          price: data[0].unit_amount,
        },
      };
    }
  );

  const products = await Promise.all(promiseGetPrices);
  return products;
};
