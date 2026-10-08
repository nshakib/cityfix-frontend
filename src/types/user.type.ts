export type UserRole = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "CITIZEN";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";
 
export interface User {
  id: string;
  name: string;
  email: string;
  googleId: null | string;
  authProvider: string;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  needPasswordChange: boolean;
  imageUrl: null | string;
  imagePublicId: null | string;
  isDeleted: boolean;
  deletedAt: null | string;
  createdAt: string;
  updatedAt: string;
}
 

export type CitizenProfile = {
  id: string;
  contactNumber: string | null;
  address: string | null;
};
 
export type StaffProfile = {
  id: string;
  isActive: boolean;
  department?: { id: string; name: string };
};
 
export type AdminProfile = {
  id: string;
  organizationEmail: string;
};
 
// Shape of GET /auth/me → data
// staffProfile / adminProfile are only returned once getMe's `include` is extended on the backend.
export type MeResponseData = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "ACTIVE" | "BLOCKED" | "DELETED";
  imageUrl: string;
  citizen?: CitizenProfile | null;
  staffProfile?: StaffProfile | null;
  adminProfile?: AdminProfile | null;
};
 
export type UpdateProfilePayload = {
  name: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
 
