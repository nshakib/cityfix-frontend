"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useStripePaymentStatus } from "@/hooks/payment.hook";

const money = new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" });

export default function StripePaymentResult() {
  const queryClient = useQueryClient();
  const sessionId = useSearchParams().get("session_id");
  const { data, isError } = useStripePaymentStatus(sessionId);
  const [waitedTooLong, setWaitedTooLong] = useState(false);

  const payment = data?.data;
  const paid = payment?.fine?.status === "PAID";
  const failed = payment?.status === "FAILED" || payment?.status === "CANCELLED";

  // Show the paid state in My Fines as soon as it is confirmed.
  useEffect(() => {
    if (paid) queryClient.invalidateQueries({ queryKey: ["fines"] });
  }, [paid, queryClient]);

  // Stripe confirms through a webhook, which can take a little while.
  useEffect(() => {
    const timer = setTimeout(() => setWaitedTooLong(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  let title = "Confirming your payment";
  let message = "Please wait while we confirm your payment with Stripe.";

  if (!sessionId) {
    title = "Payment reference missing";
    message = "We could not find this payment. Check My fines to see the status of your fine.";
  } else if (paid) {
    title = "Payment received";
    message = payment?.amount
      ? `Your payment of ${money.format(Number(payment.amount))} was successful. Thank you.`
      : "Your payment was successful. Thank you.";
  } else if (failed) {
    title = "Payment did not go through";
    message = "You have not been charged. You can try again from My fines.";
  } else if (isError) {
    title = "We could not check your payment";
    message = "Open My fines in a minute to see whether it went through.";
  } else if (waitedTooLong) {
    title = "Still waiting for confirmation";
    message =
      "This is taking longer than usual. If you paid, your fine will show as paid in My fines shortly.";
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-start gap-4 p-6 py-16">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground" role="status">
        {message}
      </p>
      <Button asChild>
        <Link href="/citizen/fines">Go to my fines</Link>
      </Button>
    </div>
  );
}