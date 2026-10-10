"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useGetCategories } from "@/hooks/category.hook";
import { useDisputeFine, useGetMyFines } from "@/hooks/fine.hook";
import { fineStatuses, type Fine, type FineStatus } from "@/types/fine.type";
import { disputeSchema, type DisputeSchemaType } from "@/validation/fine.validation";

const PAGE_SIZE = 10;

const errorMessage = (err: any, fallback: string) => err?.data?.message ?? fallback;

// "OVERDUE" -> "Overdue"
const label = (value: string) => value.charAt(0) + value.slice(1).toLowerCase();

const formatDate = (value: string) => new Date(value).toLocaleDateString();

const money = new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" });

// What each status means for the citizen, in plain words.
function statusMessage(fine: Fine): string {
  switch (fine.status) {
    case "ISSUED":
      return "Unpaid. If you think this is a mistake, you can dispute it.";
    case "DISPUTED":
      return "Your dispute is waiting for an admin to review it.";
    case "UPHELD":
      return "An admin reviewed your dispute and kept the fine.";
    case "PAID":
      return fine.paidAt ? `Paid on ${formatDate(fine.paidAt)}.` : "Paid.";
    case "OVERDUE":
      return "Overdue. Please pay as soon as possible.";
    case "WAIVED":
      return "This fine was waived. You do not need to pay it.";
    case "VOIDED":
      return "This fine was cancelled.";
  }
}

function DisputeForm({ fine, onDone }: { fine: Fine; onDone: () => void }) {
  const queryClient = useQueryClient();
  const { mutate: dispute, isPending } = useDisputeFine();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DisputeSchemaType>({
    resolver: zodResolver(disputeSchema),
    defaultValues: { reason: "" },
  });

  const onSubmit = ({ reason }: DisputeSchemaType) => {
    dispute(
      { id: fine.id, reason },
      {
        onSuccess: () => {
          toast.success("Dispute submitted");
          queryClient.invalidateQueries({ queryKey: ["fines"] });
          onDone();
        },
        onError: (err: any) =>
          toast.error(errorMessage(err, "Could not submit your dispute. Please try again.")),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 border-t pt-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor={`reason-${fine.id}`}>Why do you think this fine is wrong?</Label>
        <textarea
          id={`reason-${fine.id}`}
          rows={4}
          aria-invalid={!!errors.reason}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register("reason")}
        />
        {errors.reason && <p className="text-sm text-destructive">{errors.reason.message}</p>}
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit dispute"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function MyFinesList() {
  const [status, setStatus] = useState<FineStatus | "">("");
  const [page, setPage] = useState(1);
  const [disputingId, setDisputingId] = useState<string | null>(null);

  const { data, isPending, isError, isFetching } = useGetMyFines({
    status: status || undefined,
    page,
    limit: PAGE_SIZE,
  });
  const { data: categoryData } = useGetCategories();

  const fines = data?.data ?? [];
  const meta = data?.meta;

  // The fines list only carries categoryId, so resolve names from the category list.
  const categoryName = useMemo(
    () => new Map((categoryData?.data ?? []).map((c) => [c.id, c.name])),
    [categoryData],
  );

  const hasFilter = status !== "";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-xl font-semibold">My fines</h1>
        <p className="text-sm text-muted-foreground">
          Fines issued to your account. You can dispute a fine while it is unpaid.
        </p>
      </header>

      {(hasFilter || fines.length > 0) && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="fine-status">Status</Label>
          <select
            id="fine-status"
            className="h-9 w-48 rounded-md border border-input bg-background px-3 text-sm"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as FineStatus | "");
              setPage(1);
              setDisputingId(null);
            }}
          >
            <option value="">All statuses</option>
            {fineStatuses.map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
          </select>
        </div>
      )}

      {isPending && <p className="text-sm text-muted-foreground">Loading your fines...</p>}
      {isError && (
        <p className="text-sm text-destructive">Could not load your fines. Refresh to try again.</p>
      )}

      {!isPending && !isError && fines.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {hasFilter ? "No fines with this status." : "You have no fines. Nothing to pay."}
        </p>
      )}

      <ul className={`flex flex-col gap-4 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
        {fines.map((fine) => (
          <li key={fine.id} className="flex flex-col gap-3 rounded-lg border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-medium">{fine.reason}</h2>
                <p className="text-sm text-muted-foreground">
                  Issued {formatDate(fine.issuedAt)}
                  {categoryName.get(fine.categoryId) && ` · ${categoryName.get(fine.categoryId)}`}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-lg font-semibold">{money.format(Number(fine.amount))}</p>
                <span className="rounded-full border px-2 py-0.5 text-xs">{label(fine.status)}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{statusMessage(fine)}</p>

            {fine.disputeReason && (
              <p className="text-sm">
                <span className="text-muted-foreground">Your reason: </span>
                {fine.disputeReason}
              </p>
            )}
            {fine.reviewNote && (
              <p className="text-sm">
                <span className="text-muted-foreground">Admin note: </span>
                {fine.reviewNote}
              </p>
            )}

            {fine.status === "ISSUED" && disputingId !== fine.id && (
              <Button
                size="sm"
                variant="outline"
                className="self-start"
                onClick={() => setDisputingId(fine.id)}
              >
                Dispute this fine
              </Button>
            )}

            {disputingId === fine.id && (
              <DisputeForm fine={fine} onDone={() => setDisputingId(null)} />
            )}
          </li>
        ))}
      </ul>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 text-sm">
          <p className="text-muted-foreground">
            Page {meta.page} of {meta.totalPages} · {meta.total} fines
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}