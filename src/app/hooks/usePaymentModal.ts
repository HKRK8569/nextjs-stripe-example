import { useCallback, useEffect, useRef, useState } from "react";

export const usePaymentModal = () => {
  const [isOpenPaymentModal, setIsOpenPaymentModal] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const onOpenPaymentModal = useCallback(() => {
    setIsOpenPaymentModal(true);
  }, []);

  const onClosePaymentModal = useCallback(() => {
    setIsOpenPaymentModal(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClosePaymentModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClosePaymentModal]);

  return {
    isOpenPaymentModal,
    modalRef,
    onOpenPaymentModal,
    onClosePaymentModal,
  };
};
