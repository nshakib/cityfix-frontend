"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useGetMe } from "@/hooks/auth.hook";
import { useGetMyComplaints } from "@/hooks/complaints.hook";
import { useGetMyFines } from "@/hooks/fine.hook";
import type { ComplaintStatus } from "@/types/complaints.type";
import type { FineStatus } from "@/types/fine.type";

// "IN_PROGRESS" -> "In progress"
const label = (value: string) => {
  const text = value.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const money = new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" });

// Complaints that are finished from the citizen's point of view.
const finishedComplaints: ComplaintStatus[] = ["CLOSED", "CONFIRMED", "REJECTED"];
// Fines the citizen still has to deal with.
const unpaidFines: FineStatus[] = ["ISSUED", "UPHELD", "OVERDUE"];

function StatCard({
  title,
  value,
  hint,
  href,
}: {
  title: string;
  value: string | number;
  hint: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-lg border p-4 transition-colors hover:bg-muted/40"
    >
      <span className="text-sm text-muted-foreground">{title}</span>
      <span className="text-2xl font-semibold">{value}</span>
      <span className="text-xs text-muted-foreground">{hint}</span>
    </Link>
  );
}

export default function CitizenOverview() {
  const { data: meData } = useGetMe();
  const { data: complaintData, isPending: loadingComplaints, isError: complaintsFailed } =
    useGetMyComplaints();
  const { data: fineData, isPending: loadingFines, isError: finesFailed } = useGetMyFines({
    limit: 100,
  });

  const user = meData?.data;
  const complaints = complaintData?.data ?? [];
  const fines = fineData?.data ?? [];

  const open = complaints.filter((c) => !finishedComplaints.includes(c.status));
  const awaitingConfirmation = complaints.filter((c) => c.status === "RESOLVED");
  const unpaid = fines.filter((f) => unpaidFines.includes(f.status));
  const amountDue = unpaid.reduce((sum, fine) => sum + Number(fine.amount), 0);

  const complaintValue = (count: number) => (loadingComplaints || complaintsFailed ? "-" : count);
  const fineValue = (text: string | number) => (loadingFines || finesFailed ? "-" : text);

  const notices: { text: string; href: string; action: string }[] = [];
  if (awaitingConfirmation.length > 0) {
    notices.push({
      text: `${awaitingConfirmation.length} of your ${
        awaitingConfirmation.length === 1 ? "complaint was" : "complaints were"
      } marked resolved. Please check ${awaitingConfirmation.length === 1 ? "it" : "them"}.`,
      href: "/citizen/complaints",
      action: "Review",
    });
  }
  if (unpaid.length > 0) {
    notices.push({
      text: `You have ${unpaid.length} unpaid ${unpaid.length === 1 ? "fine" : "fines"} totalling ${money.format(amountDue)}.`,
      href: "/citizen/fines",
      action: "View fines",
    });
  }

  const recent = complaints.slice(0, 5); // the API already returns newest first

  return (
    <div className="flex flex-col gap-8 p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {user ? `Welcome back, ${user.name}.` : "Welcome back."} Here is where your reports
            stand.
          </p>
        </div>
        <Button asChild>
          <Link href="/citizen/complaints/new">Report an issue</Link>
        </Button>
      </header>

      {notices.length > 0 && (
        <section aria-label="Needs your attention" className="flex flex-col gap-3">
          <h2 className="font-medium">Needs your attention</h2>
          {notices.map((notice) => (
            <div
              key={notice.href}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"
            >
              <p className="text-sm">{notice.text}</p>
              <Button size="sm" variant="outline" asChild>
                <Link href={notice.href}>{notice.action}</Link>
              </Button>
            </div>
          ))}
        </section>
      )}

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My complaints"
          value={complaintValue(complaints.length)}
          hint="Everything you have reported"
          href="/citizen/complaints"
        />
        <StatCard
          title="Still open"
          value={complaintValue(open.length)}
          hint="Not yet fixed or closed"
          href="/citizen/complaints"
        />
        <StatCard
          title="Awaiting your check"
          value={complaintValue(awaitingConfirmation.length)}
          hint="Marked resolved by staff"
          href="/citizen/complaints"
        />
        <StatCard
          title="Unpaid fines"
          value={fineValue(unpaid.length)}
          hint={unpaid.length > 0 ? `${money.format(amountDue)} due` : "Nothing to pay"}
          href="/citizen/fines"
        />
      </section>

      <section aria-labelledby="recent-heading" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 id="recent-heading" className="font-medium">
            Recent complaints
          </h2>
          <Link
            href="/citizen/complaints"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            View all
          </Link>
        </div>

        {loadingComplaints && <p className="text-sm text-muted-foreground">Loading...</p>}
        {complaintsFailed && (
          <p className="text-sm text-destructive">Could not load your complaints.</p>
        )}

        {!loadingComplaints && !complaintsFailed && recent.length === 0 && (
          <div className="flex flex-col items-start gap-3 rounded-lg border p-6">
            <p className="font-medium">You have not reported anything yet.</p>
            <p className="text-sm text-muted-foreground">
              Spotted a broken streetlight, a blocked drain, or a pothole? Tell the city team.
            </p>
            <Button asChild>
              <Link href="/citizen/complaints/new">Report your first issue</Link>
            </Button>
          </div>
        )}

        {recent.length > 0 && (
          <ul className="flex flex-col divide-y rounded-lg border">
            {recent.map((complaint) => (
              <li key={complaint.id} className="flex items-start justify-between gap-4 p-4">
                <div>
                  <p className="font-medium">{complaint.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {complaint.category.name} · {complaint.department.name} ·{" "}
                    {new Date(complaint.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border px-2 py-0.5 text-xs">
                  {label(complaint.status)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}