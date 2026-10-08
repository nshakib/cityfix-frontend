import apiClient from "@/lib/apiClient";
import type { ChangePasswordPayload, UpdateProfilePayload } from "@/types/user.type";

export function updateProfile(payload: UpdateProfilePayload) {
  return apiClient("/user/profile", { method: "PATCH", body: payload });
}
export function changePassword(payload: ChangePasswordPayload) {
  return apiClient("/user/me/change-password", { method: "PATCH", body: payload });
}
 