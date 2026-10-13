import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api.type";
import type {
  BkashPaymentData,
  StripeCheckoutData,
  StripePaymentStatus,
} from "@/types/payment.type";

// Returns the bKash page URL to send the citizen to.
export function payWithBkash(fineId: string) {
  return apiClient<ApiResponse<BkashPaymentData>>(`/payments/fines/${fineId}/pay`, {
    method: "POST",
    body: { gateway: "BKASH" },
  });
}

// Returns the Stripe Checkout URL to send the citizen to.
export function payWithStripe(fineId: string) {
  return apiClient<ApiResponse<StripeCheckoutData>>("/payments/stripe/checkout", {
    method: "POST",
    body: { fineId },
  });
}

export function getStripePaymentStatus(sessionId: string) {
  return apiClient<ApiResponse<StripePaymentStatus>>(`/payments/stripe/status/${sessionId}`);
}