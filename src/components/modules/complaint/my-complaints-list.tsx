"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useGetMyComplaints } from "@/hooks/complaints.hook";
import {
  complaintStatuses,
  type MyComplaint,
} from "@/types/complaints.type";
import { ComplaintStatus } from "@/types/complaints.type";

// "IN_PROGRESS" -> "In progress"
const label = (value: string) => {
  const text = value.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// What each status means for the citizen, in plain words.
function statusMessage(complaint: MyComplaint): string {
  const staff = complaint.assignedStaff?.name;
  switch (complaint.status) {
    case "SUBMITTED":
      return "Received. Waiting for an admin to review it.";
    case "ACKNOWLEDGED":
      return "Reviewed. Waiting for a staff member to be assigned.";
    case "ASSIGNED":
      return staff ? `Assigned to ${staff}. Work will start soon.` : "Assigned. Work will start soon.";
    case "IN_PROGRESS":
      return staff ? `${staff} is working on it.` : "Work is in progress.";
    case "RESOLVED":
      return "Marked as resolved. Please check it and confirm, or dispute it if it is not fixed.";
    case "DISPUTED":
      return "You disputed the resolution. It has been sent back for more work.";
    case "CONFIRMED":
      return "Confirmed as resolved.";
    case "REJECTED":
      return "This complaint was rejected.";
    case "CLOSED":
      return "Closed. Thank you for helping improve the city.";
    default:
      return "";
  }
}

export default function MyComplaintsList() {
  const { data, isPending, isError } = useGetMyComplaints();
  const [status, setStatus] = useState<ComplaintStatus | "">("");

  const all = data?.data ?? [];
  // The backend returns everything, so the status filter runs here.
  const complaints = status ? all.filter((c) => c.status === status) : all;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">My complaints</h1>
          <p className="text-sm text-muted-foreground">
            Follow each issue you reported until it is fixed.
          </p>
        </div>
        <Button asChild>
          <Link href="/citizen/complaints/new">Report an issue</Link>
        </Button>
      </header>

      {all.length > 0 && (
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="status-filter">Status</Label>
            <select
              id="status-filter"
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as ComplaintStatus | "")}
            >
              <option value="">All statuses</option>
              {complaintStatuses.map((s) => (
                <option key={s} value={s}>
                  {label(s)}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-muted-foreground">
            {complaints.length} {complaints.length === 1 ? "complaint" : "complaints"}
          </p>
        </div>
      )}

      {isPending && <p className="text-sm text-muted-foreground">Loading your complaints...</p>}
      {isError && (
        <p className="text-sm text-destructive">
          Could not load your complaints. Refresh to try again.
        </p>
      )}

      {!isPending && !isError && all.length === 0 && (
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

      {all.length > 0 && complaints.length === 0 && (
        <p className="text-sm text-muted-foreground">No complaints with this status.</p>
      )}

      <ul className="flex flex-col gap-4">
        {complaints.map((complaint) => (
          <li key={complaint.id} className="flex flex-col gap-3 rounded-lg border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-medium">{complaint.title}</h2>
                <p className="text-sm text-muted-foreground">{complaint.location}</p>
              </div>
              <span className="shrink-0 rounded-full border px-2 py-0.5 text-xs">
                {label(complaint.status)}
              </span>
            </div>

            <p className="line-clamp-2 text-sm">{complaint.description}</p>

            <p className="text-sm text-muted-foreground">{statusMessage(complaint)}</p>

            <dl className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
              <div className="flex gap-1">
                <dt>Category:</dt>
                <dd className="text-foreground">{complaint.category.name}</dd>
              </div>
              <div className="flex gap-1">
                <dt>Department:</dt>
                <dd className="text-foreground">{complaint.department.name}</dd>
              </div>
              <div className="flex gap-1">
                <dt>Priority:</dt>
                <dd className="text-foreground">{label(complaint.priority)}</dd>
              </div>
              <div className="flex gap-1">
                <dt>Submitted:</dt>
                <dd className="text-foreground">
                  {new Date(complaint.submittedAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}