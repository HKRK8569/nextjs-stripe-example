"use client";

// https://docs.stripe.com/payments/quickstart
import { useEffect, useState, type RefObject } from "react";
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

type PaymentModalHeaderProps = {
  onClose: () => void;
};

const appearance: Appearance = {
  theme: "stripe",
};

const paymentElementOptions: StripePaymentElementOptions = {
  layout: "accordion",
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const PaymentModalHeaderComponent = ({ onClose }: PaymentModalHeaderProps) => {
  return (
    <div className="w-full flex justify-end">
      <button className="hover:cursor-pointer" type="button" onClick={onClose}>
        <X className="text-gray-500" />
      </button>
    </div>
  );
};

const CheckoutForm = () => {
  return (
    <form id="payment-form" onSubmit={() => {}}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
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

  useEffect(() => {
    const fetchCreatePaymentIntent = async () => {
      if (!priceId) return;
      const clientSecret = await createPaymentIntent(priceId);
      if (!clientSecret) return;
      setClientSecret(clientSecret);
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
        {clientSecret && (
          <Elements
            options={{
              clientSecret,
              appearance: appearance,
            }}
            stripe={stripePromise}
          >
            <CheckoutForm />
          </Elements>
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
