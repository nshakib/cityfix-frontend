import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { disputeFine, getMyFines } from "@/api/fine.api";
import type { GetMyFinesParams } from "@/types/fine.type";

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