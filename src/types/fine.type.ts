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

// POST /fines (staff). Give a citizenId, or a guestName + guestContact for someone without an account.
// `category` is the category NAME, and it must belong to the staff member's own department.
export type CreateFinePayload = {
  citizenId?: string;
  guestName?: string;
  guestContact?: string;
  complaintId?: string;
  amount: number;
  reason: string;
  category: string;
};

// A complaint the staff member can attach a fine to (from GET /complaints/assigned).
export type FineComplaintOption = {
  id: string;
  title: string;
  location: string;
  departmentId: string;
  citizenId: string;
  citizen: { name: string };
};

// Row returned by GET /fines (admin). Needs the include fix in getAllFines on the backend.
export type AdminFine = Fine & {
  recipientId: string | null;
  guestName: string | null;
  guestContact: string | null;
  recipient: { name: string; email: string } | null;
  issuer: { name: string };
  category: { name: string };
};

export type GetAllFinesParams = {
  status?: FineStatus;
  search?: string;
  page?: number;
  limit?: number;
};

// PATCH /fines/:id/uphold | /waive | /void
export type FineReviewAction = "uphold" | "waive" | "void";