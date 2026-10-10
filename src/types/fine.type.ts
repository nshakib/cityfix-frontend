// Mirrors prisma/schema/enums.prisma → enum FineStatus
export type FineStatus = "ISSUED" | "DISPUTED" | "UPHELD" | "PAID" | "OVERDUE" | "WAIVED" | "VOIDED";

export const fineStatuses: FineStatus[] = [
  "ISSUED",
  "DISPUTED",
  "UPHELD",
  "PAID",
  "OVERDUE",
  "WAIVED",
  "VOIDED",
];

// Row returned by GET /fines/my. The service returns the raw Fine row with no relations,
// so the category is only an id. Prisma sends Decimal values as strings, so `amount` is a string.
export type Fine = {
  id: string;
  categoryId: string;
  complaintId: string | null;
  reason: string;
  amount: string;
  status: FineStatus;
  issuedAt: string;
  paidAt: string | null;
  disputeReason: string | null;
  disputedAt: string | null;
  reviewNote: string | null;
  reviewedAt: string | null;
};

export type GetMyFinesParams = {
  status?: FineStatus;
  page?: number;
  limit?: number;
};