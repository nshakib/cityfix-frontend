import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types/api.type";
import { Complaint, GetAllComplaintsParams } from "@/types/complaints";


export function getAllComplaints(params?: GetAllComplaintsParams) {
  return apiClient<ApiResponse<Complaint>>("/complaints", {
    method: "GET",
    query: params,
  });
}