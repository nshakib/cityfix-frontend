"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetCategories } from "@/hooks/category.hook";
import { useCreateComplaint } from "@/hooks/complaints.hook";
import {
  complaintSchema,
  type ComplaintSchemaType,
} from "@/validation/complaint.validation";

const errorMessage = (err: any, fallback: string) => err?.data?.message ?? fallback;

const MAX_DESCRIPTION = 2000;

export default function SubmitComplaintForm() {
  const queryClient = useQueryClient();
  const { data: categoryData, isPending: isLoadingCategories, isError: categoriesFailed } =
    useGetCategories();
  const { mutate: createComplaint, isPending } = useCreateComplaint();
  const [submittedTitle, setSubmittedTitle] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ComplaintSchemaType>({
    resolver: zodResolver(complaintSchema),
    defaultValues: { title: "", categoryId: "", location: "", description: "" },
  });

  const categories = categoryData?.data ?? [];
  const descriptionLength = watch("description").length;

  const onSubmit = (values: ComplaintSchemaType) => {
    createComplaint(values, {
      onSuccess: () => {
        toast.success("Complaint submitted");
        queryClient.invalidateQueries({ queryKey: ["complaints"] });
        setSubmittedTitle(values.title);
        reset();
      },
      onError: (err: any) =>
        toast.error(errorMessage(err, "Could not submit your complaint. Please try again.")),
    });
  };

  if (submittedTitle) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4 p-6">
        <h1 className="text-xl font-semibold">Complaint submitted</h1>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{submittedTitle}</span> has been sent to
          the city team. An admin will review it and assign it to the right department.
        </p>
        <div className="flex gap-2">
          <Button onClick={() => setSubmittedTitle(null)}>Report another issue</Button>
          <Button variant="outline" asChild>
            <Link href="/citizen/complaints">View my complaints</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-xl font-semibold">Report an issue</h1>
        <p className="text-sm text-muted-foreground">
          Describe the problem and where it is. The more specific you are, the faster it can be
          fixed.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Broken streetlight on Main Road"
            aria-invalid={!!errors.title}
            {...register("title")}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            aria-invalid={!!errors.categoryId}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            {...register("categoryId")}
          >
            <option value="">
              {isLoadingCategories ? "Loading categories..." : "Select a category"}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {categoriesFailed && (
            <p className="text-sm text-destructive">
              Could not load categories. Refresh to try again.
            </p>
          )}
          {!isLoadingCategories && !categoriesFailed && categories.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No categories are available yet. Please check back later.
            </p>
          )}
          {errors.categoryId && (
            <p className="text-sm text-destructive">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Street, area, or nearby landmark"
            aria-invalid={!!errors.location}
            {...register("location")}
          />
          {errors.location && (
            <p className="text-sm text-destructive">{errors.location.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={6}
            aria-invalid={!!errors.description}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register("description")}
          />
          <div className="flex items-start justify-between gap-4">
            {errors.description ? (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">At least 20 characters.</p>
            )}
            <p className="text-xs text-muted-foreground">
              {descriptionLength}/{MAX_DESCRIPTION}
            </p>
          </div>
        </div>

        <Button
          type="submit"
          className="self-start"
          disabled={isPending || categoriesFailed || categories.length === 0}
        >
          {isPending ? "Submitting..." : "Submit complaint"}
        </Button>
      </form>
    </div>
  );
}