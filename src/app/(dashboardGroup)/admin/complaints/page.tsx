"use client";

import { useGetAllComplaints } from "@/hooks/complaints.hook";

const ComplaintsPage = () => {

    const { data } = useGetAllComplaints({ page: 1, limit: 100 });

    const complaints = data?.data || [];
  
    if (complaints.length === 0) {
    return <p>There is not complaints</p>;
  }


  return (
    <div>
      {complaints.map((complaint) => (
        <div key={complaint.id}>
          <h2>{complaint.title}</h2>
          <p>{complaint.description}</p>
          <p>Status: {complaint.status}</p>
          <p>Priority: {complaint.priority}</p>
        </div>
      ))}
    </div>
  );
};

export default ComplaintsPage;