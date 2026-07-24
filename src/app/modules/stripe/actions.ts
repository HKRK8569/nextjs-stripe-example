"use server";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import type { ProductWithPrice } from "./types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const createProduct = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const amount = formData.get("amount") as string;
  await stripe.products.create({
    name: name,
    default_price_data: {
      unit_amount: Number(amount),
      currency: "jpy",
    },
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
  // 固定のデモユーザーで決済する（実運用ではログインユーザーに紐づくCustomerを使う）
  const customerId = process.env.STRIPE_CUSTOMER_ID;
  if (!customerId) return;

  const price = await stripe.prices.retrieve(priceId);
  if (!price.unit_amount) return;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: price.unit_amount,
    currency: "jpy",
    customer: customerId,
  });
  if (!paymentIntent.client_secret) return;

  // Payment Elementで保存済みカードの表示・保存・削除を有効にする
  const customerSession = await stripe.customerSessions.create({
    customer: customerId,
    components: {
      payment_element: {
        enabled: true,
        features: {
          payment_method_redisplay: "enabled",
          payment_method_save: "enabled",
          payment_method_save_usage: "off_session",
          payment_method_remove: "enabled",
        },
      },
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    customerSessionClientSecret: customerSession.client_secret,
  };
};
