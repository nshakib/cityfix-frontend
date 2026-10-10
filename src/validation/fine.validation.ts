import { z } from "zod";

// Mirrors disputeFineSchema on the backend (body part).
export const disputeSchema = z.object({
  reason: z.string().trim().min(20, "Please explain in at least 20 characters"),
});

export type DisputeSchemaType = z.infer<typeof disputeSchema>;