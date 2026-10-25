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
  departmentId: string; // scalar column, returned alongside the includes
  resolutionProof: string | null; // JSON string like {"note": "..."} saved when staff resolve it
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

// POST /complaints (citizen). Priority is left to the backend default (MEDIUM); an admin can change it.
export type CreateComplaintPayload = {
  title: string;
  description: string;
  location: string;
  categoryId: string;
};

// Row returned by GET /complaints/my-complaints (the citizen is the viewer, so no `citizen` field).
export type MyComplaint = Omit<Complaint, "citizen">;