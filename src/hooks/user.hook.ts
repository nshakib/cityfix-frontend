import { useMutation } from "@tanstack/react-query";
import { changePassword, updateProfile } from "@/api/user.api";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: updateProfile,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}