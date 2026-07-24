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

export const archiveProduct = async (formData: FormData) => {
  const id = formData.get("id") as string;
  // 価格が紐づいた商品はStripeのAPIでは削除できないため、アーカイブで対応する
  await stripe.products.update(id, { active: false });
  redirect("/list");
};

export const getProductList = async () => {
  const { data } = await stripe.products.list({
    active: true,
    expand: ["data.default_price"],
  });

  return data.map((product) => {
    const priceObj = product.default_price as Stripe.Price | null;

    return {
      product,
      price: {
        id: priceObj?.id ?? "",
        price: priceObj?.unit_amount ?? 0,
      },
    };
  });
};

export const createPaymentIntent = async (priceId: string) => {
  const price = await stripe.prices.retrieve(priceId);
  if (!price.unit_amount) return;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: price.unit_amount,

    currency: "jpy",
  });

  return paymentIntent.client_secret;
};
