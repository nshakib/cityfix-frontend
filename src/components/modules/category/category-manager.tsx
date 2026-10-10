"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateCategory,
  useGetCategories,
  useUpdateCategory,
  useUpdateCategoryStatus,
} from "@/hooks/category.hook";
import { useGetDepartments } from "@/hooks/department.hook";
import type { Category} from "@/types/category.type";
import type { Department } from "@/types/department.type";
import { categorySchema, CategorySchemaType} from "@/validation/category.validation";

const errorMessage = (err: any, fallback: string) => err?.data?.message ?? fallback;

function CategoryForm({
  editing,
  departments,
  onDone,
}: {
  editing: Category | null;
  departments: Department[];
  onDone: () => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: create, isPending: isCreating } = useCreateCategory();
  const { mutate: update, isPending: isUpdating } = useUpdateCategory();

  // New categories can only go to an active department (the backend rejects others).
  // When editing, keep the current department selectable even if it was deactivated.
  const options = departments.filter(
    (d) => d.status === "ACTIVE" || d.id === editing?.departmentId,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: editing?.name ?? "",
      departmentId: editing?.departmentId ?? "",
    },
  });

  const handlers = {
    onSuccess: () => {
      toast.success(editing ? "Category updated" : "Category created");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onDone();
    },
    onError: (err: any) =>
      toast.error(errorMessage(err, "Could not save the category. Please try again.")),
  };

  const onSubmit = (values: CategorySchemaType) => {
    if (editing) update({ id: editing.id, ...values }, handlers);
    else create(values, handlers);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-lg border p-4 sm:max-w-md"
    >
      <h2 className="font-medium">{editing ? "Edit category" : "New category"}</h2>

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="departmentId">Department</Label>
        <select
          id="departmentId"
          aria-invalid={!!errors.departmentId}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          {...register("departmentId")}
        >
          <option value="">Select a department</option>
          {options.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        {errors.departmentId && (
          <p className="text-sm text-destructive">{errors.departmentId.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? "Saving..." : editing ? "Save changes" : "Create category"}
        </Button>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function CategoryManager() {
  const queryClient = useQueryClient();
  const { data: categoryData, isPending, isError } = useGetCategories();
  const { data: departmentData } = useGetDepartments();
  const { mutate: setStatus, isPending: isChangingStatus } = useUpdateCategoryStatus();

  // null = form closed, "new" = creating, Category = editing that row
  const [formState, setFormState] = useState<null | "new" | Category>(null);

  const categories = categoryData?.data ?? [];
  const departments = departmentData?.data ?? [];

  // The list endpoint returns only departmentId, so resolve names here.
  const departmentName = useMemo(
    () => new Map(departments.map((d) => [d.id, d.name])),
    [departments],
  );

  const toggleStatus = (category: Category) => {
    const next = category.status === "INACTIVE" ? "ACTIVE" : "INACTIVE";
    setStatus(
      { id: category.id, status: next },
      {
        onSuccess: () => {
          toast.success(next === "ACTIVE" ? "Category activated" : "Category deactivated");
          queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (err: any) => toast.error(errorMessage(err, "Could not change the status.")),
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Each category routes new complaints to a default department.
          </p>
        </div>
        {formState === null && <Button onClick={() => setFormState("new")}>New category</Button>}
      </header>

      {formState !== null && (
        <CategoryForm
          key={formState === "new" ? "new" : formState.id}
          editing={formState === "new" ? null : formState}
          departments={departments}
          onDone={() => setFormState(null)}
        />
      )}

      {isPending && <p className="text-sm text-muted-foreground">Loading categories...</p>}
      {isError && (
        <p className="text-sm text-destructive">Could not load categories. Refresh to try again.</p>
      )}

      {!isPending && !isError && categories.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No categories yet. Create one so citizens can file complaints against it.
        </p>
      )}

      {categories.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium">{category.name}</td>
                  <td className="px-4 py-3">
                    {departmentName.get(category.departmentId) ?? "Unknown department"}
                  </td>
                  <td className="px-4 py-3">
                    {category.status === "INACTIVE" ? "Inactive" : "Active"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setFormState(category)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isChangingStatus}
                        onClick={() => toggleStatus(category)}
                      >
                        {category.status === "INACTIVE" ? "Activate" : "Deactivate"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}