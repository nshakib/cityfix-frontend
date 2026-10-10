import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { acknowledgeComplaint, assignComplaint, createComplaint, getAllComplaints, getMyComplaints } from "@/api/complaint.api";
import { GetAllComplaintsParams } from "@/types/complaints.type";


export function useGetAllComplaints(params?: GetAllComplaintsParams) {
  return useQuery({
    queryKey: ["complaints", params],
    queryFn: () => getAllComplaints(params),
    placeholderData: keepPreviousData, // keeps the table visible while the next page loads
  });
}

export function useAcknowledgeComplaint() {
  return useMutation({
    mutationFn: acknowledgeComplaint,
  });
}
 
export function useAssignComplaint() {
  return useMutation({
    mutationFn: assignComplaint,
  });
}

export function useCreateComplaint() {
  return useMutation({
    mutationFn: createComplaint,
  });
}
 
export function useGetMyComplaints() {
  return useQuery({
    queryKey: ["complaints", "mine"], // starts with "complaints", so creating or changing a complaint refreshes it
    queryFn: getMyComplaints,
  });
}