import { profileSchema } from "@/validation";
import z from "zod";

export type ProfileSchemaType = z.infer<typeof profileSchema>;