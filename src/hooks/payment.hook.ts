import { useMutation, useQuery } from "@tanstack/react-query";
import { getStripePaymentStatus, payWithBkash, payWithStripe } from "@/api/payment.api";

export function useBkashPayment() {
  return useMutation({
    mutationFn: payWithBkash,
  });
}

export function useStripeCheckout() {
  return useMutation({
    mutationFn: payWithStripe,
  });
}

export function useStripePaymentStatus(sessionId: string | null) {
  return useQuery({
    queryKey: ["payment", "stripe", sessionId],
    queryFn: () => getStripePaymentStatus(sessionId as string),
    enabled: !!sessionId,
    // Stripe's webhook can land a moment after the redirect, so poll until the fine shows as paid.
    refetchInterval: (query) => {
      const paid = query.state.data?.data?.fine?.status === "PAID";
      return paid || query.state.dataUpdateCount >= 15 ? false : 2000;
    },
  });
}