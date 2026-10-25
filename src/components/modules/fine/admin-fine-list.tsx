"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetAllFines, useReviewFine } from "@/hooks/fine.hook";
import {
  fineStatuses,
  type AdminFine,
  type FineReviewAction,
  type FineStatus,
} from "@/types/fine.type";

const PAGE_SIZE = 10;

const label = (value: string) => value.charAt(0) + value.slice(1).toLowerCase();

const money = new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" });

const errorMessage = (err: any, fallback: string) => err?.data?.message ?? fallback;

const selectClass = "h-9 rounded-md border border-input bg-background px-3 text-sm";

function recipientName(fine: AdminFine) {
  if (fine.recipient) return fine.recipient.name;
  return fine.guestName ? `${fine.guestName} (guest)` : "Unknown";
}

const actionCopy: Record<
  FineReviewAction,
  { title: string; description: string; button: string; done: string; asksNote: boolean }
> = {
  uphold: {
    title: "Uphold the fine",
    description: "The dispute is rejected and the citizen still has to pay.",
    button: "Uphold fine",
    done: "Dispute upheld",
    asksNote: true,
  },
  waive: {
    title: "Waive the fine",
    description: "The dispute is accepted and the citizen no longer owes this fine.",
    button: "Waive fine",
    done: "Fine waived",
    asksNote: true,
  },
  void: {
    title: "Void the fine",
    description: "Cancels the fine, for example when it was issued by mistake. This cannot be undone.",
    button: "Void fine",
    done: "Fine voided",
    asksNote: false,
  },
};

function ReviewPanel({
  fine,
  action,
  onDone,
}: {
  fine: AdminFine;
  action: FineReviewAction;
  onDone: () => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: review, isPending } = useReviewFine();
  const [note, setNote] = useState("");
  const copy = actionCopy[action];

  const onConfirm = () => {
    review(
      { id: fine.id, action, note: note.trim() || undefined },
      {
        onSuccess: () => {
          toast.success(copy.done);
          queryClient.invalidateQueries({ queryKey: ["fines"] });
          onDone();
        },
        onError: (err: any) =>
          toast.error(errorMessage(err, "Could not update this fine. Please try again.")),
      },
    );
  };

  return (
    <section aria-label={copy.title} className="flex flex-col gap-4 rounded-lg border p-4 sm:max-w-md">
      <div>
        <h2 className="font-medium">{copy.title}</h2>
        <p className="text-sm text-muted-foreground">{copy.description}</p>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <p>
          <span className="text-muted-foreground">Fine: </span>
          {fine.reason} · {money.format(Number(fine.amount))}
        </p>
        <p>
          <span className="text-muted-foreground">For: </span>
          {recipientName(fine)}
        </p>
        {fine.disputeReason && (
          <p>
            <span className="text-muted-foreground">Their reason: </span>
            {fine.disputeReason}
          </p>
        )}
      </div>

      {copy.asksNote && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="review-note">Note for the citizen (optional)</Label>
          <textarea
            id="review-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant={action === "void" ? "destructive" : "default"}
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? "Saving..." : copy.button}
        </Button>
        <Button variant="outline" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </section>
  );
}

export default function AdminFineList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [review, setReview] = useState<{ fine: AdminFine; action: FineReviewAction } | null>(null);

  // Filters live in the URL so the sidebar's "Disputed Fines" link and page reloads work.
  const rawStatus = searchParams.get("status");
  const status = fineStatuses.includes(rawStatus as FineStatus)
    ? (rawStatus as FineStatus)
    : undefined;
  const search = searchParams.get("search") ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [searchText, setSearchText] = useState(search);

  const { data, isPending, isError, isFetching } = useGetAllFines({
    status,
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const fines = data?.data ?? [];
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

  const hasFilters = !!status || !!search;

  return (
    <div className="flex flex-col gap-6 p-6">
      <header>
        <h1 className="text-xl font-semibold">Fines</h1>
        <p className="text-sm text-muted-foreground">
          {status === "DISPUTED"
            ? "Fines the citizen has disputed. Uphold or waive each one."
            : "Every fine issued by staff, across all departments."}
        </p>
      </header>

      {review && (
        <ReviewPanel
          key={`${review.fine.id}-${review.action}`}
          fine={review.fine}
          action={review.action}
          onDone={() => setReview(null)}
        />
      )}

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="fine-status">Status</Label>
          <select
            id="fine-status"
            className={selectClass}
            value={status ?? ""}
            onChange={(e) => updateParams({ status: e.target.value || undefined, page: undefined })}
          >
            <option value="">All statuses</option>
            {fineStatuses.map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
          </select>
        </div>

        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            updateParams({ search: searchText.trim() || undefined, page: undefined });
          }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="fine-search">Search</Label>
            <Input
              id="fine-search"
              placeholder="Reason or name"
              className="w-56"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>

        {hasFilters && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchText("");
              updateParams({ status: undefined, search: undefined, page: undefined });
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {isPending && <p className="text-sm text-muted-foreground">Loading fines...</p>}
      {isError && (
        <p className="text-sm text-destructive">Could not load fines. Refresh to try again.</p>
      )}

      {!isPending && !isError && fines.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {hasFilters ? "No fines match these filters." : "No fines have been issued yet."}
        </p>
      )}

      {fines.length > 0 && (
        <div
          className={`overflow-x-auto rounded-lg border transition-opacity ${
            isFetching ? "opacity-60" : ""
          }`}
        >
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Fine</th>
                <th className="px-4 py-3 font-medium">Recipient</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Issued</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {fines.map((fine) => {
                const canVoid = ["ISSUED", "UPHELD", "OVERDUE", "DISPUTED"].includes(fine.status);
                return (
                  <tr key={fine.id} className="border-b align-top last:border-b-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{fine.reason}</p>
                      <p className="text-muted-foreground">
                        {fine.category.name} · issued by {fine.issuer.name}
                      </p>
                      {fine.disputeReason && (
                        <p className="mt-1 max-w-md">
                          <span className="text-muted-foreground">Dispute: </span>
                          {fine.disputeReason}
                        </p>
                      )}
                      {fine.reviewNote && (
                        <p className="max-w-md">
                          <span className="text-muted-foreground">Admin note: </span>
                          {fine.reviewNote}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p>{recipientName(fine)}</p>
                      <p className="text-muted-foreground">
                        {fine.recipient?.email ?? fine.guestContact}
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {money.format(Number(fine.amount))}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border px-2 py-0.5 text-xs">
                        {label(fine.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(fine.issuedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {fine.status === "DISPUTED" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => setReview({ fine, action: "uphold" })}
                            >
                              Uphold
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setReview({ fine, action: "waive" })}
                            >
                              Waive
                            </Button>
                          </>
                        )}
                        {canVoid && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setReview({ fine, action: "void" })}
                          >
                            Void
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.total > 0 && (
        <div className="flex items-center justify-between gap-4 text-sm">
          <p className="text-muted-foreground">
            Page {meta.page} of {Math.max(meta.totalPages, 1)} · {meta.total}{" "}
            {meta.total === 1 ? "fine" : "fines"}
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