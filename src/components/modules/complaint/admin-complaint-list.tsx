"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  useAcknowledgeComplaint,
  useAssignComplaint,
  useGetAllComplaints,
} from "@/hooks/complaints.hook";
import { useGetStaffList } from "@/hooks/user.hook";
import {
  complaintPriorities,
  complaintStatuses,
  type Complaint,
  type ComplaintPriority,
  type ComplaintStatus,
} from "@/types/complaints";

const PAGE_SIZE = 10;

// "IN_PROGRESS" -> "In progress"
const label = (value: string) => {
  const text = value.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const errorMessage = (err: any, fallback: string) => err?.data?.message ?? fallback;

const selectClass = "h-9 rounded-md border border-input bg-background px-3 text-sm";

const statusHint: Partial<Record<ComplaintStatus, string>> = {
  SUBMITTED: "New complaints. Acknowledge each one to review it for assignment.",
  ACKNOWLEDGED: "Reviewed complaints waiting for a staff member.",
};

function AssignPanel({ complaint, onDone }: { complaint: Complaint; onDone: () => void }) {
  const queryClient = useQueryClient();
  const { data, isPending: isLoadingStaff, isError } = useGetStaffList(complaint.departmentId);
  const { mutate: assign, isPending } = useAssignComplaint();
  const [staffId, setStaffId] = useState("");

  const staff = data?.data ?? [];

  const onAssign = () => {
    assign(
      { id: complaint.id, staffId },
      {
        onSuccess: () => {
          const name = staff.find((s) => s.id === staffId)?.name ?? "staff member";
          toast.success(`Assigned to ${name}`);
          queryClient.invalidateQueries({ queryKey: ["complaints"] });
          onDone();
        },
        onError: (err: any) =>
          toast.error(errorMessage(err, "Could not assign this complaint. Please try again.")),
      },
    );
  };

  return (
    <section
      aria-label="Assign staff"
      className="flex flex-col gap-4 rounded-lg border p-4 sm:max-w-md"
    >
      <div>
        <h2 className="font-medium">
          {complaint.assignedStaff ? "Reassign staff" : "Assign staff"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {complaint.title} · {complaint.department.name}
        </p>
      </div>

      {isLoadingStaff && <p className="text-sm text-muted-foreground">Loading staff...</p>}
      {isError && <p className="text-sm text-destructive">Could not load staff.</p>}
      {!isLoadingStaff && !isError && staff.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No active staff in {complaint.department.name}. Add a staff member to this department
          first.
        </p>
      )}

      {staff.length > 0 && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="staff">Staff member</Label>
          <select
            id="staff"
            className={selectClass}
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
          >
            <option value="">Select a staff member</option>
            {staff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.email})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={onAssign} disabled={!staffId || isPending}>
          {isPending ? "Assigning..." : "Assign"}
        </Button>
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </section>
  );
}

export default function AdminComplaintList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [assigning, setAssigning] = useState<Complaint | null>(null);
  const { mutate: acknowledge, isPending: isAcknowledging } = useAcknowledgeComplaint();

  // Filters live in the URL so the sidebar links and page reloads just work.
  const rawStatus = searchParams.get("status");
  const rawPriority = searchParams.get("priority");
  const status = complaintStatuses.includes(rawStatus as ComplaintStatus)
    ? (rawStatus as ComplaintStatus)
    : undefined;
  const priority = complaintPriorities.includes(rawPriority as ComplaintPriority)
    ? (rawPriority as ComplaintPriority)
    : undefined;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const { data, isPending, isError, isFetching } = useGetAllComplaints({
    status,
    priority,
    page,
    limit: PAGE_SIZE,
  });

  const complaints = data?.data ?? [];
  const meta = data?.meta;

  const updateParams = (changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handleAcknowledge = (complaint: Complaint) => {
    acknowledge(complaint.id, {
      onSuccess: () => {
        toast.success("Complaint acknowledged");
        queryClient.invalidateQueries({ queryKey: ["complaints"] });
      },
      onError: (err: any) =>
        toast.error(errorMessage(err, "Could not acknowledge this complaint.")),
    });
  };

  const hasFilters = !!status || !!priority;

  return (
    <div className="flex flex-col gap-6 p-6">
      <header>
        <h1 className="text-xl font-semibold">Complaints</h1>
        <p className="text-sm text-muted-foreground">
          {(status && statusHint[status]) ?? "Every complaint across all departments."}
        </p>
      </header>

      {assigning && (
        <AssignPanel key={assigning.id} complaint={assigning} onDone={() => setAssigning(null)} />
      )}

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="status-filter">Status</Label>
          <select
            id="status-filter"
            className={selectClass}
            value={status ?? ""}
            onChange={(e) => updateParams({ status: e.target.value || undefined, page: undefined })}
          >
            <option value="">All statuses</option>
            {complaintStatuses.map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="priority-filter">Priority</Label>
          <select
            id="priority-filter"
            className={selectClass}
            value={priority ?? ""}
            onChange={(e) =>
              updateParams({ priority: e.target.value || undefined, page: undefined })
            }
          >
            <option value="">All priorities</option>
            {complaintPriorities.map((p) => (
              <option key={p} value={p}>
                {label(p)}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            onClick={() => updateParams({ status: undefined, priority: undefined, page: undefined })}
          >
            Clear filters
          </Button>
        )}
      </div>

      {isPending && <p className="text-sm text-muted-foreground">Loading complaints...</p>}
      {isError && (
        <p className="text-sm text-destructive">Could not load complaints. Refresh to try again.</p>
      )}

      {!isPending && !isError && complaints.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {hasFilters ? "No complaints match these filters." : "No complaints have been submitted yet."}
        </p>
      )}

      {complaints.length > 0 && (
        <div
          className={`overflow-x-auto rounded-lg border transition-opacity ${
            isFetching ? "opacity-60" : ""
          }`}
        >
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Complaint</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Citizen</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Assigned to</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id} className="border-b align-top last:border-b-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{complaint.title}</p>
                    <p className="text-muted-foreground">{complaint.location}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{complaint.category.name}</p>
                    <p className="text-muted-foreground">{complaint.department.name}</p>
                  </td>
                  <td className="px-4 py-3">{complaint.citizen.name}</td>
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
                  <td className="px-4 py-3">
                    {complaint.assignedStaff?.name ?? (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(complaint.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {complaint.status === "SUBMITTED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isAcknowledging}
                        onClick={() => handleAcknowledge(complaint)}
                      >
                        Acknowledge
                      </Button>
                    )}
                    {complaint.status === "ACKNOWLEDGED" && (
                      <Button size="sm" onClick={() => setAssigning(complaint)}>
                        Assign staff
                      </Button>
                    )}
                    {complaint.status === "ASSIGNED" && (
                      <Button size="sm" variant="outline" onClick={() => setAssigning(complaint)}>
                        Reassign
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.total > 0 && (
        <div className="flex items-center justify-between gap-4 text-sm">
          <p className="text-muted-foreground">
            Page {meta.page} of {Math.max(meta.totalPages, 1)} · {meta.total}{" "}
            {meta.total === 1 ? "complaint" : "complaints"}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => updateParams({ page: String(page - 1) })}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => updateParams({ page: String(page + 1) })}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}