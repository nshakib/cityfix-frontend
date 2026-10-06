import type { SidebarItems } from "@/types/sidebar.type";

const prefix = "/admin";

export const adminRoutes: SidebarItems = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", url: `${prefix}` }],
  },
  {
    title: "Complaints",
    items: [
      { title: "All Complaints", url: `${prefix}/complaints` },
      { title: "Unassigned Queue", url: `${prefix}/complaints?status=UNDER_REVIEW` },
    ],
  },
  {
    title: "Fines",
    items: [{ title: "All Fines", url: `${prefix}/fines` }],
  },
  {
    title: "Configuration",
    items: [
      { title: "Departments", url: `${prefix}/departments` },
      { title: "Categories", url: `${prefix}/categories` },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Profile", url: `${prefix}/profile` },
      { title: "Change Password", url: `${prefix}/profile/change-password` },
    ],
  },
];