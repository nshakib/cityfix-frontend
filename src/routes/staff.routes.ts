import type { SidebarItems } from "@/types/sidebar.type";

const prefix = "/staff";

export const staffRoutes: SidebarItems = [
  {
    title: "Dashboard",
    items: [{ title: "Home", url: `${prefix}` }],
  },
  {
    title: "Complaints",
    items: [
      { title: "Assigned to Me", url: `${prefix}/complaints/assigned` },
      { title: "Department Queue", url: `${prefix}/complaints/department` },
    ],
  },
  {
    title: "Fines",
    items: [{ title: "Issue a Fine", url: `${prefix}/fines/new` }],
  },
  {
    title: "Account",
    items: [
      { title: "Profile", url: `${prefix}/profile` },
      { title: "Change Password", url: `${prefix}/profile/change-password` },
    ],
  },
];