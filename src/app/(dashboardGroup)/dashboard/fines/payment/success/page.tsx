import StripePaymentResult from "@/components/modules/payment/stripe-payment-result";
import { Suspense } from "react";


// Stripe sends the citizen here: /payment/success?session_id=...
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading...</div>}>
      <StripePaymentResult />
    </Suspense>
  );
}