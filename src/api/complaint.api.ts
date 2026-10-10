import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.type";
import { Complaint, GetAllComplaintsParams } from "@/types/complaints";


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
 