import type { SidebarItems } from "@/types/sidebar.type";

const prefix = "/dashboard";

export const citizenRoutes: SidebarItems = [
  {
    title: "Complaints",
    items: [
      { title: "Submit a Complaint", url: `${prefix}/complaints/new` },
      { title: "My Complaints", url: `${prefix}/complaints` },
    ],
  },
  {
    title: "Fines",
    items: [{ title: "My Fines", url: `${prefix}/fines` }],
  },
  {
    title: "Account",
    items: [
      { title: "Profile", url: `${prefix}/profile` },
      { title: "Change Password", url: `${prefix}/profile/change-password` },
    ],
  },
];