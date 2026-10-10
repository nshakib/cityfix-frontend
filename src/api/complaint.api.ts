import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.type";
import { Complaint, CreateComplaintPayload, GetAllComplaintsParams, MyComplaint } from "@/types/complaints.type";


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

export function getMyComplaints() {
  return apiClient<ApiResponse<MyComplaint[]>>("/complaints/my-complaints");
}
 