export type GetAllComplaintsParams = {
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
};

export type ComplaintPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

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

export interface Complaint {
  id: string;
  title: string;
  description: string;
  location: string;
  photos: string[];
  categoryId: string;
  userId: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
}