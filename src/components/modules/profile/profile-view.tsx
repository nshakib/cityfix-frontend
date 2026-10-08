"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetMe } from "@/hooks/auth.hook";
import { useUpdateProfile } from "@/hooks/user.hook";
import type { MeResponseData, UserRole } from "@/types/user.type";
import { ProfileSchemaType } from "@/types";
import { profileSchema } from "@/validation";



const roleLabel: Record<UserRole, string> = {
  SUPER_ADMIN: "Super admin",
  ADMIN: "Admin",
  STAFF: "Staff",
  CITIZEN: "Citizen",
};

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
      <dt className="w-44 shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value || "Not provided"}</dd>
    </div>
  );
}

// The only block that differs between roles.
function RoleDetails({ user }: { user: MeResponseData }) {
  if (user.role === "CITIZEN") {
    return (
      <>
        <Detail label="Contact number" value={user.citizen?.contactNumber} />
        <Detail label="Address" value={user.citizen?.address} />
      </>
    );
  }
  if (user.role === "STAFF") {
    return <Detail label="Department" value={user.staffProfile?.department?.name} />;
  }
  return <Detail label="Organization email" value={user.adminProfile?.organizationEmail} />;
}

function EditNameForm({ user }: { user: MeResponseData }) {
  const queryClient = useQueryClient();
  const { mutate: update, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name },
  });

  const onSubmit = (values: ProfileSchemaType) => {
    update(values, {
      onSuccess: () => {
        toast.success("Profile updated");
        queryClient.invalidateQueries({ queryKey: ["user"] });
      },
      onError: () => {
        toast.error("Could not update your profile. Please try again.");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <Button type="submit" disabled={isPending || !isDirty} className="self-start">
        {isPending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}

export default function ProfileView() {
  const { data, isPending } = useGetMe();
  const [editing, setEditing] = useState(false);

  const user = data?.data;

  if (isPending) {
    return <div className="p-6 text-sm text-muted-foreground">Loading your profile...</div>;
  }
  if (!user) {
    return <div className="p-6 text-sm text-destructive">Could not load your profile.</div>;
  }

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 p-6">
      <header className="flex items-center gap-4">
        {user.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.imageUrl}
            alt={`${user.name}'s profile photo`}
            className="size-16 rounded-full object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="flex size-16 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground"
          >
            {initials}
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{roleLabel[user.role]}</p>
        </div>
      </header>

      <section aria-labelledby="account-heading" className="flex flex-col gap-4 border-t pt-6">
        <div className="flex items-center justify-between">
          <h2 id="account-heading" className="font-medium">
            Account details
          </h2>
          <Button variant="outline" size="sm" onClick={() => setEditing((prev) => !prev)}>
            {editing ? "Cancel" : "Edit name"}
          </Button>
        </div>

        {editing ? (
          <EditNameForm user={user} />
        ) : (
          <dl className="flex flex-col gap-3">
            <Detail label="Full name" value={user.name} />
            <Detail label="Email" value={user.email} />
            <Detail label="Role" value={roleLabel[user.role]} />
            <RoleDetails user={user} />
          </dl>
        )}
      </section>
    </div>
  );
}