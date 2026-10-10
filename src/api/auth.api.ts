import apiClient from "@/lib/apiClient";
import {
  LoginPayload,
  RegistrationPayload,
  ResendOtpPayload,
  VerifyAccountPayload,
} from "@/types";

export function userLogin(payload: LoginPayload) {
  return apiClient("/auth/login", { method: "POST", body: payload });
}

export function verifyAccount(payload: VerifyAccountPayload) {
  return apiClient("/auth/verify-email", { method: "POST", body: payload });
}

export function resendOtp(payload: ResendOtpPayload) {
  return apiClient("/auth/resend-otp", { method: "POST", body: payload });
}

export function userRegistration(payload: RegistrationPayload) {
  return apiClient("/auth/register", { method: "POST", body: payload });
}

export function userLogout() {
  return apiClient("/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiClient("/auth/me");
}

export function googleOAuth(payload: { idToken: string }) {
  return apiClient("/auth/google", { method: "POST", body: payload });
}