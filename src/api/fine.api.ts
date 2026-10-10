import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.type";
import type { Fine, GetMyFinesParams } from "@/types/fine.type";

export function getMyFines(params?: GetMyFinesParams) {
  return apiClient<ApiResponse<Fine>>("/fines/my", { query: params });
}

// Only allowed while the fine is ISSUED. The backend wants a reason of at least 20 characters.
export function disputeFine({ id, reason }: { id: string; reason: string }) {
  return apiClient(`/fines/${id}/dispute`, { method: "PATCH", body: { reason } });
}