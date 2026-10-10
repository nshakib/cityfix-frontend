"use client";

import Link from "next/link";

import { useGetMe } from "@/hooks/auth.hook";
import { useGetAllComplaints } from "@/hooks/complaints.hook";
import type { ComplaintStatus } from "@/types/complaints.type";

// "IN_PROGRESS" -> "In progress"
const label = (value: string) => {
  const text = value.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const cards: { title: string; hint: string; status?: ComplaintStatus }[] = [
  { title: "All complaints", hint: "Across every department" },
  { title: "Need acknowledging", hint: "New, not yet reviewed", status: "SUBMITTED" },
  { title: "Waiting for staff", hint: "Reviewed, not yet assigned", status: "ACKNOWLEDGED" },
  { title: "In progress", hint: "Staff are working on these", status: "IN_PROGRESS" },
  { title: "Disputed", hint: "Citizens disputed the resolution", status: "DISPUTED" },
  { title: "Closed", hint: "Completed complaints", status: "CLOSED" },
];

// Each card reads the total from the list endpoint's meta, asking for a single row.
function StatCard({ title, hint, status }: (typeof cards)[number]) {
  const { data, isPending, isError } = useGetAllComplaints({ status, limit: 1 });
  const total = data?.meta?.total;
  const href = status ? `/admin/complaints?status=${status}` : "/admin/complaints";

  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-lg border p-4 transition-colors hover:bg-muted/40"
    >
      <span className="text-sm text-muted-foreground">{title}</span>
      <span className="text-2xl font-semibold">
        {isPending || isError || total === undefined ? "-" : total}
      </span>
      <span className="text-xs text-muted-foreground">{hint}</span>
    </Link>
  );
}

export default function AdminOverview() {
  const { data: meData } = useGetMe();
  const { data, isPending, isError } = useGetAllComplaints({ limit: 5 });

  const user = meData?.data;
  const recent = data?.data ?? [];

  return (
    <div className="flex flex-col gap-8 p-6">
      <header>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {user ? `Welcome back, ${user.name}.` : "Welcome back."} Here is where complaints stand.
        </p>
      </header>

      <section aria-label="Complaint totals" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </section>

      <section aria-labelledby="recent-heading" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 id="recent-heading" className="font-medium">
            Recent complaints
          </h2>
          <Link
            href="/admin/complaints"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            View all
          </Link>
        </div>

        {isPending && <p className="text-sm text-muted-foreground">Loading complaints...</p>}
        {isError && (
          <p className="text-sm text-destructive">Could not load recent complaints.</p>
        )}
        {!isPending && !isError && recent.length === 0 && (
          <p className="text-sm text-muted-foreground">No complaints have been submitted yet.</p>
        )}

        {recent.length > 0 && (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Complaint</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((complaint) => (
                  <tr key={complaint.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{complaint.title}</p>
                      <p className="text-muted-foreground">{complaint.location}</p>
                    </td>
                    <td className="px-4 py-3">{complaint.department.name}</td>
                    <td
                      className={`px-4 py-3 ${
                        complaint.priority === "URGENT" ? "font-medium text-destructive" : ""
                      }`}
                    >
                      {label(complaint.priority)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border px-2 py-0.5 text-xs">
                        {label(complaint.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(complaint.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}