"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateDepartment,
  useGetDepartments,
  useUpdateDepartment,
  useUpdateDepartmentStatus,
} from "@/hooks/department.hook";
import type { Department } from "@/types/department.type";
import {
  departmentSchema,
  type DepartmentSchemaType,
} from "@/validation/department.validation";

const errorMessage = (err: any, fallback: string) => err?.data?.message ?? fallback;

function DepartmentForm({
  editing,
  onDone,
}: {
  editing: Department | null;
  onDone: () => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: create, isPending: isCreating } = useCreateDepartment();
  const { mutate: update, isPending: isUpdating } = useUpdateDepartment();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentSchemaType>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: editing?.name ?? "",
      description: editing?.description ?? "",
    },
  });

  const handlers = {
    onSuccess: () => {
      toast.success(editing ? "Department updated" : "Department created");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      onDone();
    },
    onError: (err: any) =>
      toast.error(errorMessage(err, "Could not save the department. Please try again.")),
  };

  const onSubmit = (values: DepartmentSchemaType) => {
    if (editing) {
      update({ id: editing.id, ...values }, handlers);
    } else {
      // Leave description out entirely when it's empty.
      create({ name: values.name, description: values.description || undefined }, handlers);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-lg border p-4 sm:max-w-md"
    >
      <h2 className="font-medium">{editing ? "Edit department" : "New department"}</h2>

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description (optional)</Label>
        <textarea
          id="description"
          rows={3}
          aria-invalid={!!errors.description}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? "Saving..." : editing ? "Save changes" : "Create department"}
        </Button>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function DepartmentManager() {
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useGetDepartments();
  const { mutate: setStatus, isPending: isChangingStatus } = useUpdateDepartmentStatus();

  // null = form closed, "new" = creating, Department = editing that row
  const [formState, setFormState] = useState<null | "new" | Department>(null);

  const departments = data?.data ?? [];

  const toggleStatus = (department: Department) => {
    const next = department.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setStatus(
      { id: department.id, status: next },
      {
        onSuccess: () => {
          toast.success(next === "ACTIVE" ? "Department activated" : "Department deactivated");
          queryClient.invalidateQueries({ queryKey: ["departments"] });
        },
        onError: (err: any) => toast.error(errorMessage(err, "Could not change the status.")),
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Departments</h1>
          <p className="text-sm text-muted-foreground">
            Departments receive complaints routed from their categories.
          </p>
        </div>
        {formState === null && (
          <Button onClick={() => setFormState("new")}>New department</Button>
        )}
      </header>

      {formState !== null && (
        <DepartmentForm
          key={formState === "new" ? "new" : formState.id}
          editing={formState === "new" ? null : formState}
          onDone={() => setFormState(null)}
        />
      )}

      {isPending && <p className="text-sm text-muted-foreground">Loading departments...</p>}
      {isError && (
        <p className="text-sm text-destructive">
          Could not load departments. Refresh to try again.
        </p>
      )}

      {!isPending && !isError && departments.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No departments yet. Create one before adding categories.
        </p>
      )}

      {departments.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Categories</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr key={department.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{department.name}</p>
                    {department.description && (
                      <p className="max-w-md text-muted-foreground">{department.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">{department._count?.categories ?? 0}</td>
                  <td className="px-4 py-3">
                    {department.status === "ACTIVE" ? "Active" : "Inactive"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setFormState(department)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isChangingStatus}
                        onClick={() => toggleStatus(department)}
                      >
                        {department.status === "ACTIVE" ? "Deactivate" : "Activate"}
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