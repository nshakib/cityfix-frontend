"use client";

import { useState, type ComponentProps } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetMe } from "@/hooks/auth.hook";
import { useChangePassword } from "@/hooks/user.hook";
import type { UserRole } from "@/types/user.type";
import {
  changePasswordSchema,
  type ChangePasswordSchemaType,
} from "@/validation/user.validation";

const profilePath: Record<UserRole, string> = {
  SUPER_ADMIN: "/admin/profile",
  ADMIN: "/admin/profile",
  STAFF: "/staff/profile",
  CITIZEN: "/citizen/profile",
};

function PasswordField({
  id,
  label,
  autoComplete,
  error,
  hint,
  registration,
}: {
  id: string;
  label: string;
  autoComplete: string;
  error?: string;
  hint?: string;
  registration: ComponentProps<typeof Input>;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          className="pr-10"
          {...registration}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export default function ChangePasswordForm() {
  const { data, isPending: isLoadingUser } = useGetMe();
  const { mutate: changePassword, isPending } = useChangePassword();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const user = data?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = ({ currentPassword, newPassword }: ChangePasswordSchemaType) => {
    setServerError(null);
    changePassword(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          toast.success("Password changed");
          reset();
          queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: (err: any) => {
          setServerError(
            err?.data?.message ?? "Could not change your password. Please try again.",
          );
        },
      },
    );
  };

  if (isLoadingUser) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Change password</h1>
        {user && (
          <Link
            href={profilePath[user.role]}
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Back to profile
          </Link>
        )}
      </div>

      {user?.authProvider === "GOOGLE" ? (
        <p className="text-sm text-muted-foreground">
          You sign in with Google, so your account has no CityFix password to change.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <PasswordField
            id="currentPassword"
            label="Current password"
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            registration={register("currentPassword")}
          />
          <PasswordField
            id="newPassword"
            label="New password"
            autoComplete="new-password"
            hint="At least 8 characters, with upper and lower case letters, a number, and a special character."
            error={errors.newPassword?.message}
            registration={register("newPassword")}
          />
          <PasswordField
            id="confirmPassword"
            label="Confirm new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            registration={register("confirmPassword")}
          />

          {serverError && (
            <p role="alert" className="text-sm text-destructive">
              {serverError}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="self-start">
            {isPending ? "Saving..." : "Change password"}
          </Button>
        </form>
      )}
    </div>
  );
}