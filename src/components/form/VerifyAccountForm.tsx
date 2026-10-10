"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useResendOtp, useVerifyAccount } from "@/hooks";
import { getErrorMessage } from "@/lib/error";

// An OTP was just emailed when the user arrived here, so the resend button starts on cooldown.
const RESEND_COOLDOWN_SECONDS = 60;

const verifyOtpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code."),
});

export default function VerifyAccountForm({ email }: { email: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  const { mutate: verify, isPending: verifying } = useVerifyAccount();
  const { mutate: resend, isPending: resending } = useResendOtp();

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const form = useForm({
    defaultValues: { otp: "" },
    validators: { onSubmit: verifyOtpSchema },
    onSubmit: ({ value }) => {
      verify(
        { email, otp: value.otp },
        {
          onSuccess: () => {
            // The server just set the login cookies. Drop the cached "not logged in" result
            // so the dashboard guard fetches the new session instead of bouncing to /login.
            queryClient.removeQueries({ queryKey: ["user"] });
            toast.success("Email verified", {
              description: "Welcome to CityFix!",
            });
            router.replace("/dashboard");
          },
          onError: (err) => {
            toast.error(
              getErrorMessage(
                err,
                "Could not verify the code. Please try again.",
              ),
            );
            form.setFieldValue("otp", "");
          },
        },
      );
    },
  });

  const onResend = () => {
    resend(
      { email },
      {
        onSuccess: () => {
          toast.success("New code sent", {
            description: `Check the inbox of ${email}.`,
          });
          form.setFieldValue("otp", "");
          setSecondsLeft(RESEND_COOLDOWN_SECONDS);
        },
        onError: (err) => {
          toast.error(
            getErrorMessage(
              err,
              "Could not resend the code. Please try again.",
            ),
          );
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email}</span>. It
          expires in 5 minutes.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="otp">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Verification code
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="123456"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    aria-invalid={isInvalid}
                    className="text-center text-lg tracking-widest"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <Button type="submit" disabled={verifying}>
            {verifying ? (
              <>
                <Spinner /> Verifying
              </>
            ) : (
              "Verify email"
            )}
          </Button>
        </FieldGroup>
      </form>

      <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
        <p>Didn&apos;t get the code?</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={secondsLeft > 0 || resending}
          onClick={onResend}
        >
          {resending
            ? "Sending..."
            : secondsLeft > 0
              ? `Resend code in ${secondsLeft}s`
              : "Resend code"}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Wrong email?{" "}
        <Link
          href="/register"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Start over
        </Link>
      </p>
    </div>
  );
}