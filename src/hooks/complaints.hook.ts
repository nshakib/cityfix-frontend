import { getAllComplaints } from "@/api";
import { GetAllComplaintsParams } from "@/types/complaints";
import { useQuery } from "@tanstack/react-query";

export function useGetAllComplaints(params: GetAllComplaintsParams) {
return useQuery({
        queryKey:['complaints',params],
        queryFn:() => getAllComplaints(params)
    })
}
