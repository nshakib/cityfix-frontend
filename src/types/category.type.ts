export type CategoryStatus = "ACTIVE" | "INACTIVE";

export type Category = {
  id: string;
  name: string;
  description: string | null;
  departmentId: string;
  createdAt: string;
  status?: CategoryStatus;
};

export type CreateCategoryPayload = {
  name: string;
  departmentId: string;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;