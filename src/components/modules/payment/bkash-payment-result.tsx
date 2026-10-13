"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

// bKash's callback already finished the payment on the server; this page only reports the outcome.
const outcomes: Record<string, { title: string; message: string }> = {
  success: {
    title: "Payment received",
    message: "Your bKash payment was successful. Thank you.",
  },
  failure: {
    title: "Payment did not go through",
    message: "You have not been charged. You can try again from My fines.",
  },
  cancel: {
    title: "Payment cancelled",
    message: "You cancelled the bKash payment, so nothing was charged.",
  },
};

export default function BkashPaymentResult() {
  const queryClient = useQueryClient();
  const params = useSearchParams();
  const status = (params.get("status") ?? "").toLowerCase();
  const paymentId = params.get("paymentID");

  const outcome = outcomes[status] ?? {
    title: "Payment status unknown",
    message: "Check My fines to see whether your payment went through.",
  };

  useEffect(() => {
    if (status === "success") queryClient.invalidateQueries({ queryKey: ["fines"] });
  }, [status, queryClient]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-start gap-4 p-6 py-16">
      <h1 className="text-xl font-semibold">{outcome.title}</h1>
      <p className="text-sm text-muted-foreground" role="status">
        {outcome.message}
      </p>
      {paymentId && (
        <p className="text-xs text-muted-foreground">Payment reference: {paymentId}</p>
      )}
      <Button asChild>
        <Link href="/citizen/fines">Go to my fines</Link>
      </Button>
    </div>
  );
}