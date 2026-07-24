"use client";

// https://docs.stripe.com/payments/quickstart
import { type FormEvent, useEffect, useState, type RefObject } from "react";
import { usePaymentModal } from "../hooks/usePaymentModal";
import { X } from "react-feather";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  type Appearance,
  loadStripe,
  type StripePaymentElementOptions,
} from "@stripe/stripe-js";
import { createPaymentIntent } from "../modules/stripe/actions";
import { Loader } from "./Loader";

type PaymentModalHeaderProps = {
  onClose: () => void;
};

const appearance: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#4ade80",
    colorBackground: "#ffffff",
    colorText: "#111111",
  },
};

const paymentElementOptions: StripePaymentElementOptions = {
  layout: "tabs",
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const PaymentModalHeaderComponent = ({ onClose }: PaymentModalHeaderProps) => {
  return (
    <div className="w-full flex justify-end pb-2">
      <button className="hover:cursor-pointer" type="button" onClick={onClose}>
        <X className="text-gray-500" />
      </button>
    </div>
  );
};

type CheckoutFormProps = {
  onClosePaymentModal: () => void;
};
const CheckoutForm = ({ onClosePaymentModal }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || isProcessing) {
      return;
    }
    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      // カード決済はリダイレクトせずその場で結果を受け取る
      redirect: "if_required",
    });

    // TODO: コンビニ払いなどリダイレクト型の決済手段を有効化する際は、
    // return_url先のページで payment_intent_client_secret を読んで結果を表示する
    // TODO: succeeded以外のステータス（processingなど）やエラー種別ごとの分岐を実装する
    if (error) {
      alert(error.message ?? "決済に失敗しました。");
      setIsProcessing(false);
    } else if (paymentIntent?.status === "succeeded") {
      alert("決済に成功しました。");
      onClosePaymentModal();
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement
        id="payment-element"
        options={paymentElementOptions}
        onChange={(event) => setIsComplete(event.complete)}
      />
      <button
        className="text-white font-bold bg-green-400 w-full px-4 py-3 rounded mt-4 disabled:opacity-50"
        type="submit"
        disabled={!stripe || isProcessing || !isComplete}
      >
        {isProcessing ? "処理中..." : "今すぐ支払う"}
      </button>
    </form>
  );
};

type PaymentModalProps = {
  productId: string;
  priceId: string;
  modalRef: RefObject<HTMLDivElement | null>;
  onClosePaymentModal: () => void;
};
const PaymentModal = ({
  productId,
  priceId,
  modalRef,
  onClosePaymentModal,
}: PaymentModalProps) => {
  const [clientSecret, setClientSecret] = useState<string>();
  const [customerSessionClientSecret, setCustomerSessionClientSecret] =
    useState<string>();

  useEffect(() => {
    const fetchCreatePaymentIntent = async () => {
      if (!priceId) return;
      const result = await createPaymentIntent(priceId);
      if (!result) return;
      setClientSecret(result.clientSecret);
      setCustomerSessionClientSecret(result.customerSessionClientSecret);
    };
    fetchCreatePaymentIntent();
  }, [priceId]);

  return (
    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="z-50 rounded bg-white p-4 shadow-lg  w-[700px]"
      >
        <PaymentModalHeaderComponent onClose={onClosePaymentModal} />
        {clientSecret ? (
          <Elements
            options={{
              clientSecret,
              customerSessionClientSecret,
              appearance: appearance,
            }}
            stripe={stripePromise}
          >
            <CheckoutForm onClosePaymentModal={onClosePaymentModal} />
          </Elements>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

type PaymentModalButtonProps = {
  productId: string;
  priceId: string;
};
export const PaymentModalButton = ({
  productId,
  priceId,
}: PaymentModalButtonProps) => {
  const {
    isOpenPaymentModal,
    modalRef,
    onOpenPaymentModal,
    onClosePaymentModal,
  } = usePaymentModal();

  return (
    <>
      <button
        onClick={onOpenPaymentModal}
        type="button"
        className="rounded py-1 px-2 text-white bg-green-400 hover:opacity-50"
      >
        購入
      </button>
      {isOpenPaymentModal && (
        <PaymentModal
          priceId={priceId}
          productId={productId}
          modalRef={modalRef}
          onClosePaymentModal={onClosePaymentModal}
        />
      )}
    </>
  );
};
