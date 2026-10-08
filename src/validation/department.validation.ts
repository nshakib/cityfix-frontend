import { z } from "zod";
 
export const departmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  description: z.string().trim().max(500, "Description cannot exceed 500 characters"),
});
 
export type DepartmentSchemaType = z.infer<typeof departmentSchema>;