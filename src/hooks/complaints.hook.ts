import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllComplaints } from "@/api/complaint.api";
import { GetAllComplaintsParams } from "@/types/complaints";


export function useGetAllComplaints(params?: GetAllComplaintsParams) {
  return useQuery({
    queryKey: ["complaints", params],
    queryFn: () => getAllComplaints(params),
    placeholderData: keepPreviousData, // keeps the table visible while the next page loads
  });
}