import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  createFine,
  disputeFine,
  getAllFines,
  getComplaintsForFine,
  getMyFines,
  reviewFine,
} from "@/api/fine.api";
import type { GetAllFinesParams, GetMyFinesParams } from "@/types/fine.type";

export function useGetMyFines(params?: GetMyFinesParams) {
  return useQuery({
    queryKey: ["fines", "mine", params],
    queryFn: () => getMyFines(params),
    placeholderData: keepPreviousData,
  });
}

export function useDisputeFine() {
  return useMutation({
    mutationFn: disputeFine,
  });
}

export function useCreateFine() {
  return useMutation({
    mutationFn: createFine,
  });
}

export function useComplaintsForFine() {
  return useQuery({
    queryKey: ["complaints", "for-fine"],
    queryFn: getComplaintsForFine,
  });
}

export function useGetAllFines(params?: GetAllFinesParams) {
  return useQuery({
    queryKey: ["fines", "all", params],
    queryFn: () => getAllFines(params),
    placeholderData: keepPreviousData,
  });
}

export function useReviewFine() {
  return useMutation({
    mutationFn: reviewFine,
  });
}