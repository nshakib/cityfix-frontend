import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCategory,
  getCategories,
  updateCategory,
  updateCategoryStatus,
} from "@/api/category.api";

export function useGetCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}

export function useCreateCategory() {
  return useMutation({
    mutationFn: createCategory,
  });
}

export function useUpdateCategory() {
  return useMutation({
    mutationFn: updateCategory,
  });
}

export function useUpdateCategoryStatus() {
  return useMutation({
    mutationFn: updateCategoryStatus,
  });
}