import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api.type";
import type {
  Category,
  CategoryStatus,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category.type";

export function getCategories() {
  return apiClient<ApiResponse<Category[]>>("/categories");
}

export function createCategory(payload: CreateCategoryPayload) {
  return apiClient("/categories", { method: "POST", body: payload });
}

export function updateCategory({ id, ...payload }: UpdateCategoryPayload & { id: string }) {
  return apiClient(`/categories/${id}`, { method: "PATCH", body: payload });
}

export function updateCategoryStatus({ id, status }: { id: string; status: CategoryStatus }) {
  return apiClient(`/categories/status/${id}`, { method: "PATCH", body: { status } });
}