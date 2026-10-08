import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api.type";
import { CreateDepartmentPayload, Department, DepartmentStatus, UpdateDepartmentPayload } from "@/types/department.type";


export function getDepartments() {
  return apiClient<ApiResponse<Department[]>>("/departments");
}

export function createDepartment(payload: CreateDepartmentPayload) {
  return apiClient("/departments", { method: "POST", body: payload });
}

export function updateDepartment({ id, ...payload }: UpdateDepartmentPayload & { id: string }) {
  return apiClient(`/departments/${id}`, { method: "PATCH", body: payload });
}

export function updateDepartmentStatus({ id, status }: { id: string; status: DepartmentStatus }) {
  return apiClient(`/departments/${id}/status`, { method: "PATCH", body: { status } });
}

export function deleteDepartment(id: string) {
  return apiClient(`/departments/${id}`, { method: "DELETE" });
}