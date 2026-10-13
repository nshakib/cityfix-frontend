import BkashPaymentResult from "@/components/modules/payment/bkash-payment-result";
import { Suspense } from "react";



export default function PaymentResultPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading...</div>}>
      <BkashPaymentResult />
    </Suspense>
  );
}