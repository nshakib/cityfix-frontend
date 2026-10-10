import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api.type";
import { StaffMember } from "@/types/staff.type";
import type { ChangePasswordPayload, UpdateProfilePayload } from "@/types/user.type";

export function updateProfile(payload: UpdateProfilePayload) {
  return apiClient("/user/profile", { method: "PATCH", body: payload });
}
export function changePassword(payload: ChangePasswordPayload) {
  return apiClient("/user/me/change-password", { method: "PATCH", body: payload });
}
 
// Active staff in a department (admin only). Needs GET /user/staff on the backend.
export function getStaffList(departmentId: string) {
  return apiClient<ApiResponse<StaffMember[]>>("/user/staff", { query: { departmentId } });
}
 