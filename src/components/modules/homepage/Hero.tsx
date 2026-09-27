import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, ShieldCheck } from "lucide-react";

const highlights = [
  { icon: MapPin, label: "Report issues in your neighborhood" },
  { icon: ShieldCheck, label: "Tracked by the right department" },
  { icon: CheckCircle2, label: "Resolved with full status updates" },
];

export default function Hero() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center">
      <span className="mb-4 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
        City Complaint & Service Management Platform
      </span>

      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Report civic issues.
        <br />
        Get them fixed — <span className="text-primary">not lost</span>.
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        Broken streetlight, overflowing bin, blocked drain? Submit a complaint,
        watch it get routed to the right department, and follow it end-to-end
        until it&apos;s resolved.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/register">Report an Issue</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/track">Track My Complaint</Link>
        </Button>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {highlights.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-sm">
            <Icon className="size-6 text-primary" />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}