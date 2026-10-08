
export type DepartmentStatus = "ACTIVE" | "INACTIVE";
export type Department = {
  id: string;
  name: string;
  description: string | null;
  status: DepartmentStatus;
  createdAt: string;
  _count?: { categories: number };
};

export type CreateDepartmentPayload = {
  name: string;
  description?: string;
};
export type UpdateDepartmentPayload = Partial<CreateDepartmentPayload>;
