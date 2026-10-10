import { useMutation, useQuery } from "@tanstack/react-query";
import { changePassword, getStaffList, updateProfile } from "@/api/user.api";

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

export function useGetStaffList(departmentId?: string) {
  return useQuery({
    queryKey: ["staff", departmentId],
    queryFn: () => getStaffList(departmentId as string),
    enabled: !!departmentId,
  });
}
 