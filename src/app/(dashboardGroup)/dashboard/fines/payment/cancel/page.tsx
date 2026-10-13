import Link from "next/link";
import { Button } from "@/components/ui/button";

// Stripe sends the citizen here when they leave Checkout without paying.
export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-start gap-4 p-6 py-16">
      <h1 className="text-xl font-semibold">Payment cancelled</h1>
      <p className="text-sm text-muted-foreground">
        You left the checkout without paying, so you have not been charged. Your fine is still
        waiting for you.
      </p>
      <Button asChild>
        <Link href="/citizen/fines">Go to my fines</Link>
      </Button>
    </div>
  );
}