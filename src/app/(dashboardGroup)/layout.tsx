import AuthGuard from "@/components/auth/auth-guard";
import { ReactNode } from "react";

export default function DashboardGroupLayout({ children }: { children: ReactNode }) {
  return <AuthGuard> {children}</AuthGuard>;
}