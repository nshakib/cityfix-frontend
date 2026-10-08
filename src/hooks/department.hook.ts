import { useMutation, useQuery } from "@tanstack/react-query";
import { createDepartment, getDepartments, updateDepartment, updateDepartmentStatus } from "@/api/department.api";

export function useGetDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });
}

export function useCreateDepartment() {
  return useMutation({
    mutationFn: createDepartment,
  });
}
 
export function useUpdateDepartment() {
  return useMutation({
    mutationFn: updateDepartment,
  });
}
 
export function useUpdateDepartmentStatus() {
  return useMutation({
    mutationFn: updateDepartmentStatus,
  });
}