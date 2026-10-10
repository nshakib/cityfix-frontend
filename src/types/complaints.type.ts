// Mirrors prisma/schema/enums.prisma
export type ComplaintStatus =
  | "SUBMITTED"
  | "ACKNOWLEDGED"
  | "CONFIRMED"
  | "REJECTED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "DISPUTED"
  | "CLOSED";

export type ComplaintPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export const complaintStatuses: ComplaintStatus[] = [
  "SUBMITTED",
  "ACKNOWLEDGED",
  "CONFIRMED",
  "REJECTED",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "DISPUTED",
  "CLOSED",
];

export const complaintPriorities: ComplaintPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

// Row returned by GET /complaints (includes from getAllComplaints in complaint.service.ts)
export type Complaint = {
  id: string;
  title: string;
  description: string;
  location: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  submittedAt: string;
  category: { name: string };
  department: { name: string };
  assignedStaff: { name: string; email?: string } | null;
  citizen: { name: string; email?: string; citizen?: { contactNumber: string | null } | null };
};

export type GetAllComplaintsParams = {
  status?: ComplaintStatus;
  priority?: ComplaintPriority;
  page?: number;
  limit?: number;
};

export type CreateComplaintPayload = {
  title: string;
  description: string;
  location: string;
  categoryId: string;
};

export type MyComplaint = Omit<Complaint, "citizen">;