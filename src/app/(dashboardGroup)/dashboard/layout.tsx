import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { ReactNode } from "react";

const  DashboardLayout = ({ children }: { children: ReactNode })=> {
  return (
    <RoleGuard roles={["CITIZEN"]}>
      <DashboardShell role="CITIZEN">{children}</DashboardShell>
    </RoleGuard>
  );
}

export default DashboardLayout;