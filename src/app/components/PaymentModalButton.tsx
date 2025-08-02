"use client";

import type { RefObject } from "react";
import { usePaymentModal } from "../hooks/usePaymentModal";
import { X } from "react-feather";
// https://docs.stripe.com/payments/quickstart

type PaymentModalHeaderProps = {
  onClose: () => void;
};

const PaymentModalHeaderComponent = ({ onClose }: PaymentModalHeaderProps) => {
  return (
    <div className="w-full flex justify-end">
      <button className="hover:cursor-pointer" type="button" onClick={onClose}>
        <X className="text-gray-500" />
      </button>
    </div>
  );
};

type PaymentModalProps = {
  modalRef: RefObject<HTMLDivElement | null>;
  onClosePaymentModal: () => void;
};
const PaymentModal = ({ modalRef, onClosePaymentModal }: PaymentModalProps) => {
  return (
    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="z-50 rounded bg-white p-4 shadow-lg  w-[700px]"
      >
        <PaymentModalHeaderComponent onClose={onClosePaymentModal} />
      </div>
    </div>
  );
};

export const PaymentModalButton = () => {
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
          modalRef={modalRef}
          onClosePaymentModal={onClosePaymentModal}
        />
      )}
    </>
  );
};
