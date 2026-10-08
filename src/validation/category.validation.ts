import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  departmentId: z.string().min(1, "Select a department"),
});

export type CategorySchemaType = z.infer<typeof categorySchema>;