import apiClient from "@/lib/apiClient";
import type {  ApiResponse } from "@/types/api.type";
import type {
  Complaint,
  CreateComplaintPayload,
  GetAllComplaintsParams,
  MyComplaint,
} from "@/types/complaints.type";

export function getAllComplaints(params?: GetAllComplaintsParams) {
  return apiClient<ApiResponse<Complaint>>("/complaints", {
    method: "GET",
    query: params,
  });
}

// SUBMITTED -> ACKNOWLEDGED
export function acknowledgeComplaint(id: string) {
  return apiClient(`/complaints/${id}/acknowledge`, { method: "PATCH" });
}

// ACKNOWLEDGED (or ASSIGNED, to reassign) -> ASSIGNED
export function assignComplaint({ id, staffId }: { id: string; staffId: string }) {
  return apiClient(`/complaints/${id}/assign`, { method: "PATCH", body: { staffId } });
}

export function createComplaint(payload: CreateComplaintPayload) {
  return apiClient("/complaints", { method: "POST", body: payload });
}

// The backend returns every complaint of the logged-in citizen as a plain array (no pagination yet).
export function getMyComplaints() {
  return apiClient<ApiResponse<MyComplaint[]>>("/complaints/my-complaints");
}

// RESOLVED -> closed (only the citizen who filed it)
export function confirmComplaint(id: string) {
  return apiClient(`/complaints/${id}/confirm`, { method: "PATCH" });
}

// RESOLVED -> DISPUTED. The backend wants a reason of 10 to 500 characters.
export function disputeComplaint({ id, reason }: { id: string; reason: string }) {
  return apiClient(`/complaints/${id}/dispute`, { method: "PATCH", body: { reason } });
}