export type UserRole = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "CITIZEN";

export type MeResponseData = {
  id: string;
  email: string;
  role: UserRole;
  status: "ACTIVE" | "BLOCKED" | "DELETED";
};
 
// Where the navbar sends a logged-in user when they click "Dashboard"
export const dashboardRouteByRole: Record<UserRole, string> = {
  SUPER_ADMIN: "/admin",
  ADMIN: "/admin",
  STAFF: "/staff",
  CITIZEN: "/citizen",
};
 