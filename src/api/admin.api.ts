import apiClient from "@/lib/apiClient";


export function getAllComplaints(params: { page?: number; limit?: number }) {
  return apiClient("/complaints", {
    params,
  });
}
