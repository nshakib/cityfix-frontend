import z from "zod";

const BD_PHONE = /^(?:\+?880|0)1[3-9]\d{8}$/;

// Strip spaces and hyphens so "+880 1712-345678" validates and is sent as "+8801712345678"
export const normalizePhone = (value: string) => value.replace(/[\s-]/g, "");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(64, "Password must be at most 64 characters long.")
  .regex(/[a-z]/, "Password must contain at least 1 lowercase letter.")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter.")
  .regex(/[0-9]/, "Password must contain at least 1 number.")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character.");

// Login only checks that a password was entered. The complexity rules apply when it is created.
export const loginSchema = z.object({
  email: z.string().trim().pipe(z.email("Enter a valid email address.")),
  password: z.string().min(1, "Password is required."),
});

export const citizenRegistrationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters long.")
      .max(100, "Name cannot exceed 100 characters."),
    email: z.string().trim().pipe(z.email("Enter a valid email address.")),
    contactNumber: z
      .string()
      .refine((v) => v === "" || BD_PHONE.test(normalizePhone(v)), {
        message: "Enter a valid Bangladeshi number, e.g. +8801712345678.",
      })
      .optional(),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// For the verify-account page
export const verifyOtpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code."),
});