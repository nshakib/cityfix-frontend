import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.type";
import type {
  AdminFine,
  CreateFinePayload,
  Fine,
  FineComplaintOption,
  FineReviewAction,
  GetAllFinesParams,
  GetMyFinesParams,
} from "@/types/fine.type";

export function getMyFines(params?: GetMyFinesParams) {
  return apiClient<ApiResponse<Fine>>("/fines/my", { query: params });
}

// Only allowed while the fine is ISSUED. The backend wants a reason of at least 20 characters.
export function disputeFine({ id, reason }: { id: string; reason: string }) {
  return apiClient(`/fines/${id}/dispute`, { method: "PATCH", body: { reason } });
}

// Staff only. The backend checks the category belongs to the staff member's department.
export function createFine(payload: CreateFinePayload) {
  return apiClient("/fines", { method: "POST", body: payload });
}

// Complaints visible to the logged-in staff member, used to pick who a fine is for.
export function getComplaintsForFine() {
  return apiClient<ApiResponse<FineComplaintOption>>("/complaints/assigned", {
    query: { limit: 100 },
  });
}

// Admin: every fine, with optional status filter and search (reason or recipient name).
export function getAllFines(params?: GetAllFinesParams) {
  return apiClient<ApiResponse<AdminFine>>("/fines", { query: params });
}

// Admin: uphold or waive a disputed fine, or void one. The body must always be an object,
// because the backend reads req.body.note without checking that a body exists.
export function reviewFine({
  id,
  action,
  note,
}: {
  id: string;
  action: FineReviewAction;
  note?: string;
}) {
  return apiClient(`/fines/${id}/${action}`, { method: "PATCH", body: { note } });
}