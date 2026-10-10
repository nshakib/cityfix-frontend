import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { ReactNode } from "react";

const  DashboardLayout = ({ children }: { children: ReactNode })=> {
  return (
    <RoleGuard roles={["STAFF"]}>
      <DashboardShell role="STAFF">{children}</DashboardShell>
    </RoleGuard>
  );
}

export default DashboardLayout;