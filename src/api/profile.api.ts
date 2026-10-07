import apiClient from "@/lib/apiClient";


export function getProfile(params: {  }) {
  return apiClient("/auth/me", {
    params,
  });
}
