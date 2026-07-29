"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { JoinModal } from "@/components/checkout/join-modal";

type CheckoutContextValue = {
  isOpen: boolean;
  /** `source` is carried through so we can tell which CTA converted. */
  open: (source?: string) => void;
  close: () => void;
  source: string | null;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used inside <CheckoutProvider>");
  }
  return context;
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState<string | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const open = useCallback((from?: string) => {
    lastTrigger.current = document.activeElement as HTMLElement | null;
    setSource(from ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Hand focus back to whatever opened the dialog.
    lastTrigger.current?.focus?.();
  }, []);

  const value = useMemo(
    () => ({ isOpen, open, close, source }),
    [isOpen, open, close, source],
  );

  return (
    <CheckoutContext.Provider value={value}>
      {children}
      <JoinModal />
    </CheckoutContext.Provider>
  );
}
