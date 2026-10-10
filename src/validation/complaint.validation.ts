import { z } from "zod";

// Mirrors createComplaintSchema on the backend.
export const complaintSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  categoryId: z.string().min(1, "Select a category"),
  location: z
    .string()
    .trim()
    .min(5, "Please provide a more specific location")
    .max(255, "Location cannot exceed 255 characters"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description is too long"),
});

export type ComplaintSchemaType = z.infer<typeof complaintSchema>;