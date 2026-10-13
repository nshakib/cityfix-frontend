import type { Fine } from "@/types/fine.type";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "REFUNDED";
export type PaymentGateway = "BKASH" | "STRIPE";


export type BkashPaymentData = {
  bkashURL: string;
  paymentID: string;
};


export type StripeCheckoutData = {
  checkoutUrl: string;
};


export type StripePaymentStatus = {
  id: string;
  fineId: string;
  amount: string;
  gateway: PaymentGateway;
  status: PaymentStatus;
  fine: Pick<Fine, "id" | "status" | "amount" | "reason">;
} | null;